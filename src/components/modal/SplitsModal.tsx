import {
  Music,
  Trash2,
  X,
  Plus,
  Globe,
  Calendar,
  Percent,
  Users,
  Settings,
  ChevronDown,
  Save,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { User as UserType } from "@/models/user";
import Select from "react-select";
import { countries, platforms } from "@/const";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  splitsService,
  type SplitCondition,
  type CreateSplitRequest,
} from "@/services/splits";

interface SplitsModalProps {
  collaborators: UserType[];
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  onSplitSaved: (splitId: string) => void;
}

interface CollaboratorFormData {
  percentage: string;
  countriesType: "all" | "except" | "only";
  selectedCountries: { value: string; label: string }[];
  platformsType: "all" | "except" | "only";
  selectedPlatforms: { value: string; label: string }[];
  splitConditions: SplitCondition[];
  type: "general" | "specific";
}

type FilterType = "all" | "except" | "only";

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-rose-500",
  "bg-teal-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const selectStyles = {
  control: (base: Record<string, unknown>) => ({
    ...base,
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "2px",
    boxShadow: "none",
    backgroundColor: "white",
    "&:hover": { border: "1px solid #F97316" },
    "&:focus-within": { border: "1px solid #F97316" },
  }),
  option: (
    base: Record<string, unknown>,
    { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }
  ) => ({
    ...base,
    backgroundColor: isSelected ? "#F97316" : isFocused ? "#fff7ed" : "white",
    color: isSelected ? "white" : "#374151",
    fontSize: "13px",
  }),
  multiValue: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: "#fff7ed",
    borderRadius: "6px",
  }),
  multiValueLabel: (base: Record<string, unknown>) => ({
    ...base,
    color: "#c2410c",
    fontWeight: "500",
    fontSize: "12px",
  }),
  multiValueRemove: (base: Record<string, unknown>) => ({
    ...base,
    color: "#c2410c",
    "&:hover": { backgroundColor: "#F97316", color: "white" },
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    fontSize: "13px",
    color: "#9ca3af",
  }),
};

function FilterSegment({
  value,
  onChange,
  labels,
  name,
}: {
  value: FilterType;
  onChange: (v: FilterType) => void;
  labels: { all: string; except: string; only: string };
  name: string;
}) {
  const options: { val: FilterType; label: string }[] = [
    { val: "all", label: labels.all },
    { val: "except", label: labels.except },
    { val: "only", label: labels.only },
  ];
  return (
    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.val}
          type="button"
          onClick={() => onChange(opt.val)}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === opt.val
              ? "bg-white text-gray-900 border border-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
          aria-label={`${name} ${opt.label}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const toSelectOptions = (
  values: string[],
  opts: { value: string; label: string }[]
): { value: string; label: string }[] =>
  (values || []).map((v) => opts.find((o) => o.value === v) ?? { value: v, label: v });

const defaultFormData = (): CollaboratorFormData => ({
  percentage: "",
  countriesType: "all",
  selectedCountries: [],
  platformsType: "all",
  selectedPlatforms: [],
  splitConditions: [],
  type: "general",
});

export default function SplitsModal({
  collaborators,
  isOpen,
  onClose,
  songId,
}: SplitsModalProps) {
  const [collaboratorForms, setCollaboratorForms] = useState<
    Record<string, CollaboratorFormData>
  >({});
  const [expandedCollaborators, setExpandedCollaborators] = useState<
    Record<string, boolean>
  >({});
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conditions: SplitCondition[] = (collaborator as any)?.split?.conditions ?? [];
      if (conditions.length === 0) continue;

      const general = conditions.find((c) => c.type === "general");
      const specifics = conditions.filter((c) => c.type === "specific");

      initialForms[collaborator.id] = {
        percentage: general ? String(general.percentage) : "",
        countriesType: (general?.countriesType as FilterType) || "all",
        selectedCountries: toSelectOptions(
          (general?.selectedCountries as string[]) || [],
          countries
        ),
        platformsType: (general?.platformsType as FilterType) || "all",
        selectedPlatforms: toSelectOptions(
          (general?.selectedPlatforms as string[]) || [],
          platforms
        ),
        splitConditions: specifics.map((c) => ({
          ...c,
          selectedCountries: toSelectOptions(
            (c.selectedCountries as string[]) || [],
            countries
          ),
          selectedPlatforms: toSelectOptions(
            (c.selectedPlatforms as string[]) || [],
            platforms
          ),
        })) as unknown as SplitCondition[],
        type: "general",
      };
    }

    setCollaboratorForms(initialForms);
  }, [isOpen]);

  // Initialize form for a collaborator if not yet present
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
    value:
      | string
      | readonly { value: string; label: string }[]
      | readonly string[]
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
      return {
        ...prev,
        [collaboratorId]: {
          ...form,
          splitConditions: [
            ...form.splitConditions,
            {
              percentage: 0,
              selectedCountries: [],
              countriesType: "all",
              selectedPlatforms: [],
              platformsType: "all",
              type: "specific",
            },
          ],
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
          splitConditions: form.splitConditions.filter(
            (_, i) => i !== conditionIndex
          ),
        },
      };
    });
  };

  const saveSplit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const splitsToCreate: CreateSplitRequest[] = [];

      for (const [collaboratorId, formData] of Object.entries(
        collaboratorForms
      )) {
        if (!formData.percentage || parseFloat(formData.percentage) <= 0)
          continue;

        const conditions: SplitCondition[] = formData.splitConditions.map(
          (condition) => ({
            fromDate: condition.fromDate,
            toDate: condition.toDate,
            percentage: condition.percentage,
            selectedCountries: condition.selectedCountries || [],
            countriesType: condition.countriesType,
            selectedPlatforms: condition.selectedPlatforms || [],
            platformsType: condition.platformsType,
            type: condition.type,
          })
        );

        conditions.push({
          percentage: parseFloat(formData.percentage),
          selectedCountries: formData.selectedCountries.map((c) => c.value),
          selectedPlatforms: formData.selectedPlatforms.map((p) => p.value),
          countriesType: formData.countriesType,
          platformsType: formData.platformsType,
          type: "general",
        });

        splitsToCreate.push({ songId, collaboratorId, conditions });
      }

      if (splitsToCreate.length === 0) {
        setErrorMessage(
          "Configura al menos un colaborador con un porcentaje válido."
        );
        return;
      }

      await splitsService.createSplit(splitsToCreate);

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
        const msg =
          err.response.data.message ||
          err.response.data.error ||
          "Error del servidor.";
        setErrorMessage(`Error ${err.response.status}: ${msg}`);
      } else {
        setErrorMessage(err.message || "Error inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const configuredCount = Object.values(collaboratorForms).filter(
    (f) => f.percentage && parseFloat(f.percentage) > 0
  ).length;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#F97316] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base leading-tight">
                Configurar Splits
              </h2>
              <p className="text-white/80 text-xs mt-0.5">
                {collaborators.length} colaborador
                {collaborators.length !== 1 ? "es" : ""} disponible
                {collaborators.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#F7F8FA] p-5 space-y-3">
          {collaborators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Sin colaboradores
              </p>
              <p className="text-xs text-gray-400">
                Agrega colaboradores a la canción primero.
              </p>
            </div>
          ) : (
            collaborators.map((collaborator, idx) => {
              const form = getForm(collaborator.id);
              const isExpanded = expandedCollaborators[collaborator.id] ?? false;
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const hasPercentage =
                form.percentage && parseFloat(form.percentage) > 0;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const hasExistingSplit = ((collaborator as any)?.split?.conditions ?? []).length > 0;

              return (
                <div
                  key={collaborator.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* Collaborator header — clickable to expand */}
                  <button
                    type="button"
                    onClick={() => toggleExpanded(collaborator.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-white text-xs font-bold">
                          {getInitials(collaborator.name || "?")}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          {collaborator.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasExistingSplit && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full border border-green-100">
                          Configurado
                        </span>
                      )}
                      {hasPercentage && (
                        <span className="px-2.5 py-1 bg-orange-50 text-[#F97316] text-xs font-semibold rounded-full">
                          {form.percentage}%
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-[#F7F8FA]">
                      {/* General Condition */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                          <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Settings className="w-3.5 h-3.5 text-[#F97316]" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">
                              Condición General
                            </p>
                            <p className="text-xs text-gray-400">
                              Base cuando no hay condiciones específicas activas
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-4 space-y-4">
                          {/* Percentage */}
                          <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              <Percent className="w-3.5 h-3.5" />
                              Porcentaje del pool disponible
                            </label>
                            <div className="relative max-w-xs">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="0.00"
                                value={form.percentage}
                                onChange={(e) =>
                                  updateForm(
                                    collaborator.id,
                                    "percentage",
                                    e.target.value
                                  )
                                }
                                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#F97316] transition-colors"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                                %
                              </span>
                            </div>
                          </div>

                          {/* Countries */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              <Globe className="w-3.5 h-3.5" />
                              Países
                            </label>
                            <FilterSegment
                              value={form.countriesType}
                              onChange={(v) =>
                                updateForm(collaborator.id, "countriesType", v)
                              }
                              labels={{
                                all: "Todos",
                                except: "Excepto",
                                only: "Solo",
                              }}
                              name={`países-${collaborator.id}`}
                            />
                            {form.countriesType !== "all" && (
                              <Select
                                isMulti
                                options={countries}
                                value={form.selectedCountries}
                                onChange={(selected) =>
                                  updateForm(
                                    collaborator.id,
                                    "selectedCountries",
                                    selected || []
                                  )
                                }
                                styles={selectStyles}
                                placeholder="Seleccionar países..."
                                noOptionsMessage={() =>
                                  "No hay países disponibles"
                                }
                              />
                            )}
                          </div>

                          {/* Platforms */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              <Music className="w-3.5 h-3.5" />
                              Plataformas
                            </label>
                            <FilterSegment
                              value={form.platformsType}
                              onChange={(v) =>
                                updateForm(collaborator.id, "platformsType", v)
                              }
                              labels={{
                                all: "Todas",
                                except: "Excepto",
                                only: "Solo",
                              }}
                              name={`plataformas-${collaborator.id}`}
                            />
                            {form.platformsType !== "all" && (
                              <Select
                                isMulti
                                options={platforms}
                                value={form.selectedPlatforms}
                                onChange={(selected) =>
                                  updateForm(
                                    collaborator.id,
                                    "selectedPlatforms",
                                    selected || []
                                  )
                                }
                                styles={selectStyles}
                                placeholder="Seleccionar plataformas..."
                                noOptionsMessage={() =>
                                  "No hay plataformas disponibles"
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Specific Conditions */}
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-900">
                                Condiciones Específicas
                              </p>
                              <p className="text-xs text-gray-400">
                                Por período, país o plataforma
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addCondition(collaborator.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            Añadir
                          </button>
                        </div>

                        {form.splitConditions.length === 0 ? (
                          <div className="flex flex-col items-center py-8 text-center px-4">
                            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-xs font-medium text-gray-600 mb-0.5">
                              Sin condiciones específicas
                            </p>
                            <p className="text-xs text-gray-400">
                              Aplica solo la condición general.
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 space-y-3">
                            {form.splitConditions.map(
                              (condition, conditionIndex) => (
                                <div
                                  key={conditionIndex}
                                  className="bg-[#F7F8FA] rounded-xl border border-gray-200 p-4 space-y-3"
                                >
                                  {/* Condition header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-[#F97316]">
                                          {conditionIndex + 1}
                                        </span>
                                      </div>
                                      <span className="text-xs font-semibold text-gray-900">
                                        Condición específica
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeCondition(
                                          collaborator.id,
                                          conditionIndex
                                        )
                                      }
                                      className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-gray-400 hover:text-red-500"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Dates + percentage */}
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Desde
                                      </label>
                                      <input
                                        type="date"
                                        value={condition.fromDate || ""}
                                        onChange={(e) =>
                                          updateCondition(
                                            collaborator.id,
                                            conditionIndex,
                                            "fromDate",
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Hasta
                                      </label>
                                      <input
                                        type="date"
                                        value={condition.toDate || ""}
                                        onChange={(e) =>
                                          updateCondition(
                                            collaborator.id,
                                            conditionIndex,
                                            "toDate",
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Porcentaje
                                      </label>
                                      <div className="relative">
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          step="0.01"
                                          value={condition.percentage || ""}
                                          onChange={(e) =>
                                            updateCondition(
                                              collaborator.id,
                                              conditionIndex,
                                              "percentage",
                                              e.target.value
                                            )
                                          }
                                          className="w-full pl-3 pr-7 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 font-semibold focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                                        />
                                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                          %
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Countries + Platforms */}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                      <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        <Globe className="w-3 h-3" />
                                        Países
                                      </label>
                                      <FilterSegment
                                        value={
                                          (condition.countriesType as FilterType) ||
                                          "all"
                                        }
                                        onChange={(v) =>
                                          updateCondition(
                                            collaborator.id,
                                            conditionIndex,
                                            "countriesType",
                                            v
                                          )
                                        }
                                        labels={{
                                          all: "Todos",
                                          except: "Excepto",
                                          only: "Solo",
                                        }}
                                        name={`países-cond-${collaborator.id}-${conditionIndex}`}
                                      />
                                      {condition.countriesType &&
                                        condition.countriesType !== "all" && (
                                          <Select
                                            isMulti
                                            options={countries}
                                            value={
                                              Array.isArray(
                                                condition.selectedCountries
                                              )
                                                ? (condition.selectedCountries as unknown as {
                                                    value: string;
                                                    label: string;
                                                  }[])
                                                : []
                                            }
                                            onChange={(selected) =>
                                              updateCondition(
                                                collaborator.id,
                                                conditionIndex,
                                                "selectedCountries",
                                                selected || []
                                              )
                                            }
                                            styles={selectStyles}
                                            placeholder="Seleccionar..."
                                          />
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        <Music className="w-3 h-3" />
                                        Plataformas
                                      </label>
                                      <FilterSegment
                                        value={
                                          (condition.platformsType as FilterType) ||
                                          "all"
                                        }
                                        onChange={(v) =>
                                          updateCondition(
                                            collaborator.id,
                                            conditionIndex,
                                            "platformsType",
                                            v
                                          )
                                        }
                                        labels={{
                                          all: "Todas",
                                          except: "Excepto",
                                          only: "Solo",
                                        }}
                                        name={`plataformas-cond-${collaborator.id}-${conditionIndex}`}
                                      />
                                      {condition.platformsType &&
                                        condition.platformsType !== "all" && (
                                          <Select
                                            isMulti
                                            options={platforms}
                                            value={
                                              Array.isArray(
                                                condition.selectedPlatforms
                                              )
                                                ? (condition.selectedPlatforms as unknown as {
                                                    value: string;
                                                    label: string;
                                                  }[])
                                                : []
                                            }
                                            onChange={(selected) =>
                                              updateCondition(
                                                collaborator.id,
                                                conditionIndex,
                                                "selectedPlatforms",
                                                selected || []
                                              )
                                            }
                                            styles={selectStyles}
                                            placeholder="Seleccionar..."
                                          />
                                        )}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          {errorMessage && (
            <div className="flex items-start gap-2 mb-3 p-3 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{errorMessage}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {configuredCount > 0 ? (
                <>
                  <span className="font-semibold text-gray-900">
                    {configuredCount}
                  </span>{" "}
                  colaborador{configuredCount !== 1 ? "es" : ""} configurado
                  {configuredCount !== 1 ? "s" : ""}
                </>
              ) : (
                "Ningún colaborador configurado aún"
              )}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveSplit}
                disabled={isLoading || configuredCount === 0}
                className="flex items-center gap-2 px-5 py-2 bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading
                  ? "Guardando..."
                  : Object.keys(collaboratorForms).some(
                      (id) =>
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ((collaborators.find((c) => c.id === id) as any)?.split?.conditions ?? []).length > 0
                    )
                  ? "Actualizar Splits"
                  : "Guardar Splits"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
