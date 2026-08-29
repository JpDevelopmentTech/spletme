import { useState, useEffect } from "react";
import { songSplitsService } from "@/services/songSplits";
import { useReleaseFilters } from "@/hooks/useReleaseFilters";
import { validatePeriods, toPayloadPeriods } from "@/utils/splitPeriods.utils";
import type {
  CollaboratorFormData,
  CollaboratorWithSplit,
  SelectOption,
  SplitPeriodFormData,
} from "@/types";

interface UseSplitsModalParams {
  isOpen: boolean;
  collaborators: CollaboratorWithSplit[];
  songId: string;
}

/** Convierte strings crudos de la BD en opciones para react-select. */
const toSelectOptions = (values: string[]): SelectOption[] =>
  (values ?? []).map((value) => ({ value, label: value }));

const defaultFormData = (): CollaboratorFormData => ({
  percentage: "",
  countriesType: "all",
  selectedCountries: [],
  platformsType: "all",
  selectedPlatforms: [],
  periods: [],
  ownerRate: "",
});

/** Contador de claves de React para los tramos recién añadidos. */
let periodKey = 0;

const emptyPeriod = (): SplitPeriodFormData => {
  periodKey += 1;
  return {
    id: `period-${periodKey}`,
    from: "",
    to: "",
    percentage: "",
    countriesType: "all",
    selectedCountries: [],
    platformsType: "all",
    selectedPlatforms: [],
  };
};

/**
 * Gestiona el estado y la lógica del modal de configuración de splits de
 * colaborador. Cada colaborador tiene un porcentaje obligatorio, filtros
 * opcionales de país y plataforma y, si su parte cambia con el tiempo, tramos
 * de vigencia con su propio porcentaje y sus propios filtros.
 *
 * Con tramos, el porcentaje de arriba deja de ser lo que cobra siempre y pasa
 * a ser lo que cobra fuera de ellos.
 *
 * El dueño de la canción puede además fijar por colaborador la retención que
 * le cobra sobre su parte (`ownerRate`). Dejarla vacía mantiene la de siempre:
 * la del split del owner, igual para todos.
 */
export function useSplitsModal({ isOpen, collaborators, songId }: UseSplitsModalParams) {
  const [collaboratorForms, setCollaboratorForms] = useState<Record<string, CollaboratorFormData>>(
    {},
  );
  const [expandedCollaborators, setExpandedCollaborators] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { countryOptions, platformOptions, isLoadingFilters } = useReleaseFilters(songId, isOpen);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);

    const initialForms: Record<string, CollaboratorFormData> = {};

    for (const collaborator of collaborators) {
      const split = collaborator.split;
      if (!split) continue;

      initialForms[collaborator.id] = {
        // Vacío cuando no hay retención propia: el input queda en blanco y el
        // colaborador sigue heredando la del owner.
        ownerRate: split.ownerRate === null || split.ownerRate === undefined
          ? ""
          : String(split.ownerRate),
        percentage: String(split.percentage ?? ""),
        countriesType: split.countriesType ?? "all",
        selectedCountries: toSelectOptions(split.selectedCountries ?? []),
        platformsType: split.platformsType ?? "all",
        selectedPlatforms: toSelectOptions(split.selectedPlatforms ?? []),
        periods: (split.periods ?? []).map((period) => {
          periodKey += 1;
          return {
            id: `period-${periodKey}`,
            from: period.from ?? "",
            to: period.to ?? "",
            percentage: String(period.percentage ?? ""),
            countriesType: period.countriesType ?? "all",
            selectedCountries: toSelectOptions(period.selectedCountries ?? []),
            platformsType: period.platformsType ?? "all",
            selectedPlatforms: toSelectOptions(period.selectedPlatforms ?? []),
          };
        }),
      };
    }

    setCollaboratorForms(initialForms);
  }, [isOpen, collaborators]);

  const getForm = (collaboratorId: string): CollaboratorFormData =>
    collaboratorForms[collaboratorId] ?? defaultFormData();

  const toggleExpanded = (collaboratorId: string) => {
    setExpandedCollaborators((prev) => ({
      ...prev,
      [collaboratorId]: !prev[collaboratorId],
    }));
  };

  const updateForm = (
    collaboratorId: string,
    field: keyof CollaboratorFormData,
    value: string | readonly SelectOption[],
  ) => {
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: { ...getForm(collaboratorId), [field]: value },
    }));
  };

  const addPeriod = (collaboratorId: string) => {
    const form = getForm(collaboratorId);
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: { ...form, periods: [...form.periods, emptyPeriod()] },
    }));
  };

  const removePeriod = (collaboratorId: string, periodId: string) => {
    const form = getForm(collaboratorId);
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: {
        ...form,
        periods: form.periods.filter((period) => period.id !== periodId),
      },
    }));
  };

  const updatePeriod = (
    collaboratorId: string,
    periodId: string,
    field: keyof SplitPeriodFormData,
    value: string | readonly SelectOption[],
  ) => {
    const form = getForm(collaboratorId);
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: {
        ...form,
        periods: form.periods.map((period) =>
          period.id === periodId ? { ...period, [field]: value } : period,
        ),
      },
    }));
  };

  const saveSplit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Con tramos, un porcentaje base de 0 es una configuración legítima
      // ("cuando acabe su tramo, deja de cobrar"), así que también se guarda.
      const pending = Object.entries(collaboratorForms).filter(
        ([, form]) =>
          form.percentage !== "" &&
          (parseFloat(form.percentage) > 0 || form.periods.length > 0),
      );

      if (pending.length === 0) {
        setErrorMessage("Configura al menos un colaborador con un porcentaje válido.");
        return;
      }

      // Los tramos se comprueban antes de mandar nada: si el segundo colaborador
      // los tiene mal, el primero ya se habría guardado y el reparto quedaría a
      // medias sin que nadie lo haya pedido.
      for (const [, form] of pending) {
        const problem = validatePeriods(form.periods);
        if (problem) {
          setErrorMessage(problem);
          return;
        }

        // Se comprueba aquí y no al teclear porque el input admite estados
        // intermedios ("0.", "-") mientras se escribe; lo que no puede es
        // llegar así al backend y guardarse como una retención sin sentido.
        if (form.ownerRate.trim() !== "") {
          const rate = parseFloat(form.ownerRate);
          if (Number.isNaN(rate) || rate < 0 || rate > 100) {
            setErrorMessage("La retención del owner tiene que estar entre 0 y 100.");
            return;
          }
        }
      }

      for (const [collaboratorId, form] of pending) {
        await songSplitsService.createCollaboratorSplit({
          songId,
          collaboratorId,
          percentage: parseFloat(form.percentage),
          countriesType: form.countriesType,
          selectedCountries: form.selectedCountries.map((c) => c.value),
          platformsType: form.platformsType,
          selectedPlatforms: form.selectedPlatforms.map((p) => p.value),
          periods: toPayloadPeriods(form.periods),
          // Input vacío = sin retención propia: el backend le aplica la del
          // split del owner, igual que antes de que esto fuera configurable.
          ownerRate: form.ownerRate.trim() === "" ? null : parseFloat(form.ownerRate),
        });
      }

      setTimeout(() => window.location.reload(), 300);
    } catch (error: unknown) {
      const err = error as {
        response?: {
          status: number;
          data?: { message?: string; error?: string };
        };
        message?: string;
      };
      if (err.response?.data) {
        const msg = err.response.data.message ?? err.response.data.error ?? "Error del servidor.";
        setErrorMessage(`Error ${err.response.status}: ${msg}`);
      } else {
        setErrorMessage(err.message ?? "Error inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const configuredCount = Object.values(collaboratorForms).filter(
    (f) => f.percentage && parseFloat(f.percentage) > 0,
  ).length;

  /** Suma de todos los porcentajes que se están asignando a colaboradores. */
  const totalAssignedPercentage = Object.values(collaboratorForms).reduce(
    (sum, f) => sum + (parseFloat(f.percentage) || 0),
    0,
  );

  const hasAnySavedSplit = collaborators.some((c) => Boolean(c.split));

  /**
   * Con tramos, sumar los porcentajes de todos deja de significar nada: dos
   * personas al 80% no se pisan si cobran en meses distintos. La cabecera lo
   * usa para dejar de anunciar un total que no se cumple en ningún mes.
   */
  const hasAnyPeriod = Object.values(collaboratorForms).some((f) => f.periods.length > 0);

  return {
    mounted,
    isLoading,
    isLoadingFilters,
    countryOptions,
    platformOptions,
    errorMessage,
    collaboratorForms,
    expandedCollaborators,
    configuredCount,
    totalAssignedPercentage,
    hasAnySavedSplit,
    hasAnyPeriod,
    getForm,
    toggleExpanded,
    updateForm,
    addPeriod,
    removePeriod,
    updatePeriod,
    saveSplit,
  };
}
