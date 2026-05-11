import { useState, useEffect } from "react";
import { countries, platforms } from "@/const";
import { splitsService } from "@/services/splits";
import type { CollaboratorFormData, CollaboratorWithSplit } from "@/types";
import type { SplitConditionFormData } from "@/types";

interface UseSplitsModalParams {
  isOpen: boolean;
  collaborators: CollaboratorWithSplit[];
  songId: string;
}

const toSelectOptions = (
  values: string[],
  opts: { value: string; label: string }[]
): { value: string; label: string }[] =>
  (values ?? []).map((v) => opts.find((o) => o.value === v) ?? { value: v, label: v });

const defaultFormData = (): CollaboratorFormData => ({
  percentage: "",
  countriesType: "all",
  selectedCountries: [],
  platformsType: "all",
  selectedPlatforms: [],
  splitConditions: [],
  type: "general",
});

/**
 * Gestiona el estado y la lógica del modal de configuración de splits.
 * Separa toda la lógica del componente visual SplitsModal.
 */
export function useSplitsModal({ isOpen, collaborators, songId }: UseSplitsModalParams) {
  const [collaboratorForms, setCollaboratorForms] = useState<Record<string, CollaboratorFormData>>({});
  const [expandedCollaborators, setExpandedCollaborators] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);

    const initialForms: Record<string, CollaboratorFormData> = {};

    for (const collaborator of collaborators) {
      const conditions = collaborator.split?.conditions ?? [];
      if (conditions.length === 0) continue;

      const general = conditions.find((c) => c.type === "general");
      const specifics = conditions.filter((c) => c.type === "specific");

      initialForms[collaborator.id] = {
        percentage: general ? String(general.percentage) : "",
        countriesType: general?.countriesType ?? "all",
        selectedCountries: toSelectOptions(general?.selectedCountries ?? [], countries),
        platformsType: general?.platformsType ?? "all",
        selectedPlatforms: toSelectOptions(general?.selectedPlatforms ?? [], platforms),
        splitConditions: specifics.map((c): SplitConditionFormData => ({
          ...c,
          percentage: c.percentage,
          selectedCountries: toSelectOptions(c.selectedCountries ?? [], countries),
          selectedPlatforms: toSelectOptions(c.selectedPlatforms ?? [], platforms),
        })),
        type: "general",
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
    value: string | readonly { value: string; label: string }[]
  ) => {
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: { ...getForm(collaboratorId), [field]: value },
    }));
  };

  const updateCondition = (
    collaboratorId: string,
    conditionIndex: number,
    field: string,
    value: string | readonly { value: string; label: string }[] | readonly string[]
  ) => {
    setCollaboratorForms((prev) => {
      const form = prev[collaboratorId] ?? defaultFormData();
      return {
        ...prev,
        [collaboratorId]: {
          ...form,
          splitConditions: form.splitConditions.map((c, i) =>
            i === conditionIndex ? { ...c, [field]: value } : c
          ),
        },
      };
    });
  };

  const addCondition = (collaboratorId: string) => {
    setCollaboratorForms((prev) => {
      const form = prev[collaboratorId] ?? defaultFormData();
      const newCondition: SplitConditionFormData = {
        percentage: 0,
        selectedCountries: [],
        countriesType: "all",
        selectedPlatforms: [],
        platformsType: "all",
        type: "specific",
      };
      return {
        ...prev,
        [collaboratorId]: {
          ...form,
          splitConditions: [...form.splitConditions, newCondition],
        },
      };
    });
  };

  const removeCondition = (collaboratorId: string, conditionIndex: number) => {
    setCollaboratorForms((prev) => {
      const form = prev[collaboratorId] ?? defaultFormData();
      return {
        ...prev,
        [collaboratorId]: {
          ...form,
          splitConditions: form.splitConditions.filter((_, i) => i !== conditionIndex),
        },
      };
    });
  };

  const saveSplit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const splitsToCreate = Object.entries(collaboratorForms)
        .filter(([, formData]) => formData.percentage && parseFloat(formData.percentage) > 0)
        .map(([collaboratorId, formData]) => ({
          songId,
          collaboratorId,
          conditions: [
            ...formData.splitConditions.map((condition) => ({
              fromDate: condition.fromDate,
              toDate: condition.toDate,
              percentage: Number(condition.percentage),
              selectedCountries: (condition.selectedCountries as { value: string }[]).map((c) => c.value),
              countriesType: condition.countriesType,
              selectedPlatforms: (condition.selectedPlatforms as { value: string }[]).map((p) => p.value),
              platformsType: condition.platformsType,
              type: condition.type,
            })),
            {
              percentage: parseFloat(formData.percentage),
              selectedCountries: formData.selectedCountries.map((c) => c.value),
              selectedPlatforms: formData.selectedPlatforms.map((p) => p.value),
              countriesType: formData.countriesType,
              platformsType: formData.platformsType,
              type: "general" as const,
            },
          ],
        }));

      if (splitsToCreate.length === 0) {
        setErrorMessage("Configura al menos un colaborador con un porcentaje válido.");
        return;
      }

      await splitsService.createSplit(splitsToCreate);
      setTimeout(() => window.location.reload(), 300);
    } catch (error: unknown) {
      const err = error as {
        response?: { status: number; data?: { message?: string; error?: string } };
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
    (f) => f.percentage && parseFloat(f.percentage) > 0
  ).length;

  const hasAnySavedSplit = Object.keys(collaboratorForms).some(
    (id) => (collaborators.find((c) => c.id === id)?.split?.conditions ?? []).length > 0
  );

  return {
    mounted,
    isLoading,
    errorMessage,
    collaboratorForms,
    expandedCollaborators,
    configuredCount,
    hasAnySavedSplit,
    getForm,
    toggleExpanded,
    updateForm,
    updateCondition,
    addCondition,
    removeCondition,
    saveSplit,
  };
}
