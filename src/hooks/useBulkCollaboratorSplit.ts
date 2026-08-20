import { useEffect, useMemo, useState } from "react";
import { songSplitsService } from "@/services/songSplits";
import { useReleaseFiltersForSongs } from "@/hooks/useReleaseFiltersForSongs";
import type { OwnerFormData, CreationProgress } from "@/types/album-owner-split.types";

/**
 * Una canción del conjunto sobre el que se reparte. Es el mínimo común de un
 * álbum y de un sello: los dos son «un montón de canciones que se tratan a la
 * vez», y cada origen adapta su forma a esta antes de entrar.
 */
export interface BulkSplitTrack {
  _id: string;
  trackTitle: string;
  /** Si ya tiene asignado el porcentaje del owner. */
  hasOwnerSplit: boolean;
  collaborators: { id?: string; name?: string }[];
}

const DEFAULT_FORM: OwnerFormData = {
  percentage: "",
  countriesType: "all",
  selectedCountries: [],
  platformsType: "all",
  selectedPlatforms: [],
};

/** Una persona que colabora en el conjunto, con las canciones en las que figura. */
export interface BulkCollaborator {
  /** Id generado del usuario: es el que espera el endpoint de splits. */
  id: string;
  name: string;
  tracks: BulkSplitTrack[];
  /** Canciones suyas que aún no tienen split del owner. */
  blockedTracks: BulkSplitTrack[];
}

/**
 * Estado del modal que reparte a UN colaborador en todas las canciones de un
 * conjunto —un álbum o un sello— donde esa persona figura.
 *
 * Dos diferencias con el reparto del owner vienen del servidor: el porcentaje de
 * un colaborador sale del remanente que deja el owner, así que el endpoint
 * rechaza toda canción cuyo owner no haya fijado aún el suyo; y una persona
 * puede no estar en todas. Las dos cosas se calculan antes de enviar nada para
 * poder decirlas, en vez de descubrirlas como una lista de errores al final.
 */
export function useBulkCollaboratorSplit(
  isOpen: boolean,
  tracks: BulkSplitTrack[],
  onClose: () => void,
  onSplitsCreated?: () => void,
) {
  const [collaboratorId, setCollaboratorId] = useState("");
  const [form, setForm] = useState<OwnerFormData>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<CreationProgress | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Las personas salen de las propias canciones: ni el álbum ni el sello tienen
   * una lista propia, y cada canción trae la suya. Agruparlas por id da además
   * en cuántas está cada una, que es el alcance real de su reparto.
   */
  const collaborators = useMemo<BulkCollaborator[]>(() => {
    const porId = new Map<string, BulkCollaborator>();

    for (const track of tracks ?? []) {
      for (const person of track.collaborators ?? []) {
        // El endpoint identifica al participante por su id generado; el `_id` de
        // Mongo no le vale. Si una canción no lo trae, esa persona no se ofrece.
        const id = person.id;
        if (!id) continue;

        if (!porId.has(id)) {
          porId.set(id, {
            id,
            name: person.name || "Colaborador",
            tracks: [],
            blockedTracks: [],
          });
        }

        const entrada = porId.get(id)!;
        entrada.tracks.push(track);
        if (!track.hasOwnerSplit) entrada.blockedTracks.push(track);
      }
    }

    return [...porId.values()].sort((a, b) => b.tracks.length - a.tracks.length);
  }, [tracks]);

  const selected = collaborators.find((c) => c.id === collaboratorId) ?? null;

  /** Canciones a las que se le puede aplicar el reparto ahora mismo. */
  const targetTracks = useMemo(
    () => (selected ? selected.tracks.filter((track) => track.hasOwnerSplit) : []),
    [selected],
  );

  const { countryOptions, platformOptions, isLoadingFilters } = useReleaseFiltersForSongs(
    targetTracks.map((track) => track._id),
    isOpen && targetTracks.length > 0,
  );

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Al abrir de nuevo, el modal empieza limpio: un porcentaje heredado de la
  // persona anterior se aplicaría a otra sin que nadie lo note.
  useEffect(() => {
    if (isOpen) return;
    setCollaboratorId("");
    setForm(DEFAULT_FORM);
    setProgress(null);
    setShowResults(false);
    setAutoCloseCountdown(null);
    setError(null);
  }, [isOpen]);

  useEffect(() => {
    if (autoCloseCountdown === null || autoCloseCountdown <= 0) {
      if (autoCloseCountdown === 0) closeWithReset();
      return;
    }
    const timer = setTimeout(() => setAutoCloseCountdown(autoCloseCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [autoCloseCountdown]);

  const updateForm = (
    field: keyof OwnerFormData,
    value: string | readonly { value: string; label: string }[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const selectCollaborator = (id: string) => {
    setCollaboratorId(id);
    setError(null);
  };

  function closeWithReset() {
    const hadProgress = progress !== null;
    setProgress(null);
    setShowResults(false);
    setAutoCloseCountdown(null);
    setError(null);
    onClose();
    if (hadProgress && onSplitsCreated) onSplitsCreated();
  }

  const createBulkCollaboratorSplits = async () => {
    if (!selected) {
      setError("Elige a quién le asignas el porcentaje.");
      return;
    }

    const percentage = parseFloat(form.percentage);
    if (!percentage || percentage <= 0 || percentage > 100) {
      setError("El porcentaje debe estar entre 0 y 100.");
      return;
    }

    if (targetTracks.length === 0) {
      setError("Ninguna de sus canciones tiene todavía el split del owner.");
      return;
    }

    const payloadBase = {
      collaboratorId: selected.id,
      percentage,
      countriesType: form.countriesType,
      selectedCountries: form.selectedCountries.map((c) => c.value),
      platformsType: form.platformsType,
      selectedPlatforms: form.selectedPlatforms.map((p) => p.value),
    };

    setIsLoading(true);
    setError(null);
    setShowResults(false);
    setProgress({
      total: targetTracks.length,
      completed: 0,
      failed: 0,
      current: "",
      errors: [],
    });

    let fallidas = 0;

    for (const track of targetTracks) {
      setProgress((prev) => (prev ? { ...prev, current: track.trackTitle } : null));

      try {
        await songSplitsService.createCollaboratorSplit({ songId: track._id, ...payloadBase });
        setProgress((prev) => (prev ? { ...prev, completed: prev.completed + 1 } : null));
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const msg = axiosErr.response?.data?.message ?? axiosErr.message ?? "Error desconocido";
        fallidas += 1;
        setProgress((prev) =>
          prev
            ? {
                ...prev,
                failed: prev.failed + 1,
                errors: [...prev.errors, { songTitle: track.trackTitle, error: msg }],
              }
            : null,
        );
      }
    }

    setIsLoading(false);
    setShowResults(true);
    if (fallidas === 0) setAutoCloseCountdown(3);
  };

  return {
    mounted,
    collaborators,
    collaboratorId,
    selected,
    targetTracks,
    form,
    isLoading,
    isLoadingFilters,
    countryOptions,
    platformOptions,
    progress,
    showResults,
    autoCloseCountdown,
    error,
    selectCollaborator,
    updateForm,
    createBulkCollaboratorSplits,
    closeWithReset,
  };
}
