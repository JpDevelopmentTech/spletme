import { useState, useEffect } from "react";
import {
  CreateSplitOwnerRequest,
  splitsService,
  type SplitCondition,
} from "@/services/splits";
import LocalStorageService from "@/services/localstorage";
import type { Album } from "@/types";
import type { OwnerFormData, CreationProgress } from "@/types/album-owner-split.types";

const DEFAULT_FORM: OwnerFormData = {
  percentage: "",
  countriesType: "all",
  selectedCountries: [],
  platformsType: "all",
  selectedPlatforms: [],
  splitConditions: [],
  type: "general",
};

/**
 * Gestiona el estado y la lógica del modal de owner splits por álbum completo.
 * Incluye creación masiva por canción, tracking de progreso y auto-cierre.
 */
export function useAlbumOwnerSplit(
  isOpen: boolean,
  album: Album,
  onClose: () => void,
  onSplitsCreated?: () => void
) {
  const [ownerForm, setOwnerForm] = useState<OwnerFormData>(DEFAULT_FORM);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<CreationProgress | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number | null>(null);

  const currentUser = LocalStorageService.getItem("user");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setProgress(null);
      setShowResults(false);
      setAutoCloseCountdown(null);
    }
  }, [isOpen]);

  // Countdown de auto-cierre al terminar sin errores
  useEffect(() => {
    if (autoCloseCountdown === null || autoCloseCountdown <= 0) {
      if (autoCloseCountdown === 0) closeWithReset();
      return;
    }
    const timer = setTimeout(() => setAutoCloseCountdown(autoCloseCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [autoCloseCountdown]);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const updateOwnerForm = (
    field: keyof OwnerFormData,
    value: string | readonly { value: string; label: string }[]
  ) => {
    setOwnerForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSplitCondition = (
    index: number,
    field: string,
    value: string | readonly { value: string; label: string }[] | readonly string[]
  ) => {
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: prev.splitConditions.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  };

  const addSplitCondition = () => {
    const newCondition: SplitCondition = {
      percentage: 0,
      selectedCountries: [],
      countriesType: "all",
      selectedPlatforms: [],
      platformsType: "all",
      type: "specific",
    };
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: [...prev.splitConditions, newCondition],
    }));
  };

  const removeSplitCondition = (index: number) => {
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: prev.splitConditions.filter((_, i) => i !== index),
    }));
  };

  const closeWithReset = () => {
    const hadProgress = progress !== null;
    setProgress(null);
    setShowResults(false);
    setAutoCloseCountdown(null);
    onClose();
    if (hadProgress && onSplitsCreated) onSplitsCreated();
  };

  const buildConditions = (): SplitCondition[] | null => {
    const conditions: SplitCondition[] = [];

    if (ownerForm.percentage && parseFloat(ownerForm.percentage) > 0) {
      const pct = parseFloat(ownerForm.percentage);
      if (pct <= 0 || pct > 100) {
        alert("El porcentaje debe estar entre 0 y 100");
        return null;
      }
      conditions.push({
        percentage: pct,
        selectedCountries: ownerForm.selectedCountries.map((c) => c.value),
        countriesType: ownerForm.countriesType,
        selectedPlatforms: ownerForm.selectedPlatforms.map((p) => p.value),
        platformsType: ownerForm.platformsType,
        type: "general",
      });
    }

    for (let i = 0; i < ownerForm.splitConditions.length; i++) {
      const condition = ownerForm.splitConditions[i];
      const pct = typeof condition.percentage === "string"
        ? parseFloat(condition.percentage)
        : condition.percentage;

      if (pct <= 0 || pct > 100) {
        alert(`El porcentaje de la condición #${i + 1} debe estar entre 0 y 100`);
        return null;
      }

      conditions.push({
        fromDate: condition.fromDate,
        toDate: condition.toDate,
        percentage: pct,
        selectedCountries: Array.isArray(condition.selectedCountries)
          ? condition.selectedCountries.map((c) =>
              typeof c === "string" ? c : (c as { value: string }).value
            )
          : [],
        countriesType: condition.countriesType ?? "all",
        selectedPlatforms: Array.isArray(condition.selectedPlatforms)
          ? condition.selectedPlatforms.map((p) =>
              typeof p === "string" ? p : (p as { value: string }).value
            )
          : [],
        platformsType: condition.platformsType ?? "all",
        type: "specific",
      });
    }

    if (conditions.length === 0) {
      alert("Configura al menos una condición (porcentaje general o condición específica)");
      return null;
    }

    return conditions;
  };

  const createBulkOwnerSplits = async () => {
    if (!album?.tracks?.length) {
      alert("Error: No hay canciones en este álbum");
      return;
    }
    if (!currentUser?.id) {
      alert("Error: No se pudo obtener la información del usuario. Por favor, inicia sesión de nuevo.");
      return;
    }

    const conditions = buildConditions();
    if (!conditions) return;

    setIsLoading(true);
    setShowResults(false);
    setProgress({ total: album.tracks.length, completed: 0, failed: 0, current: "", errors: [] });

    let localFailed = 0;

    try {
      for (const track of album.tracks) {
        setProgress((prev) => prev ? { ...prev, current: track.trackTitle } : null);

        try {
          const payload: CreateSplitOwnerRequest = { songId: track._id, conditions };
          await splitsService.createOwnerSplit(payload);
          setProgress((prev) => prev ? { ...prev, completed: prev.completed + 1 } : null);
        } catch (err: unknown) {
          const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
          const msg = axiosErr.response?.data?.message ?? axiosErr.message ?? "Error desconocido";
          localFailed++;
          setProgress((prev) =>
            prev
              ? { ...prev, failed: prev.failed + 1, errors: [...prev.errors, { songTitle: track.trackTitle, error: msg }] }
              : null
          );
        }
      }

      setShowResults(true);
      if (localFailed === 0) setAutoCloseCountdown(3);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudieron crear los splits";
      alert(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mounted,
    ownerForm,
    isExpanded,
    isLoading,
    progress,
    showResults,
    autoCloseCountdown,
    currentUser,
    toggleExpanded,
    updateOwnerForm,
    updateSplitCondition,
    addSplitCondition,
    removeSplitCondition,
    createBulkOwnerSplits,
    closeWithReset,
  };
}
