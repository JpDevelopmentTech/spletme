import {
  Music,
  Trash2,
  Crown,
  X,
  Plus,
  Globe,
  Calendar,
  Percent,
  Settings,
  ChevronDown,
  Save,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import Select from "react-select";
import { countries, platforms } from "@/const";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CreateSplitOwnerRequest,
  splitsService,
  type SplitCondition,
} from "@/services/splits";
import LocalStorageService from "@/services/localstorage";

interface Song {
  id?: string;
  _id?: string;
  trackTitle: string;
  artistName?: string;
  isrc?: string;
  ownerId?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  collaborators?: Array<{
    id: string;
    name: string;
    email: string;
    hasActiveSplit?: boolean;
  }>;
  totalNetIncome?: number;
  releases?: Array<{
    id: string;
    platform: string;
    country: string;
    reportMonth: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface OwnerSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  song: Song;
  onSplitCreated?: () => void;
}

interface OwnerFormData {
  percentage: string;
  countriesType: "all" | "except" | "only";
  selectedCountries: { value: string; label: string }[];
  platformsType: "all" | "except" | "only";
  selectedPlatforms: { value: string; label: string }[];
  splitConditions: SplitCondition[];
  type: "general" | "specific";
}

const toSelectOptions = (
  values: string[],
  opts: { value: string; label: string }[]
): { value: string; label: string }[] =>
  (values || []).map((v) => opts.find((o) => o.value === v) ?? { value: v, label: v });

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

type FilterType = "all" | "except" | "only";

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

export default function OwnerSplitModal({
  isOpen,
  onClose,
  songId,
  song,
  onSplitCreated,
}: OwnerSplitModalProps) {
  const [ownerForm, setOwnerForm] = useState<OwnerFormData>({
    percentage: "",
    countriesType: "all",
    selectedCountries: [],
    platformsType: "all",
    selectedPlatforms: [],
    splitConditions: [],
    type: "general",
  });
  const [isGeneralExpanded, setIsGeneralExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const currentUser = LocalStorageService.getItem("user");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: SplitCondition[] = (song as any)?.ownerId?.split?.conditions ?? [];

    if (conditions.length === 0) {
      setOwnerForm({
        percentage: "",
        countriesType: "all",
        selectedCountries: [],
        platformsType: "all",
        selectedPlatforms: [],
        splitConditions: [],
        type: "general",
      });
      setIsGeneralExpanded(true);
      return;
    }

    const general = conditions.find((c) => c.type === "general");
    const specifics = conditions.filter((c) => c.type === "specific");

    setOwnerForm({
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
    });
    setIsGeneralExpanded(true);
  }, [isOpen]);

  const updateOwnerForm = (
    field: keyof OwnerFormData,
    value: string | readonly { value: string; label: string }[]
  ) => {
    setOwnerForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSplitCondition = (
    conditionIndex: number,
    field: string,
    value: string | readonly { value: string; label: string }[] | readonly string[]
  ) => {
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: prev.splitConditions.map((condition, index) =>
        index === conditionIndex ? { ...condition, [field]: value } : condition
      ),
    }));
  };

  const addSplitCondition = () => {
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: [
        ...prev.splitConditions,
        {
          percentage: 0,
          selectedCountries: [],
          countriesType: "all",
          selectedPlatforms: [],
          platformsType: "all",
          type: "specific",
        },
      ],
    }));
  };

  const removeSplitCondition = (conditionIndex: number) => {
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: prev.splitConditions.filter((_, i) => i !== conditionIndex),
    }));
  };

  const saveOwnerSplit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!songId) {
        setErrorMessage("ID de canción no válido.");
        return;
      }
      if (!currentUser?.id) {
        setErrorMessage("No se pudo obtener la información del usuario. Por favor, inicia sesión de nuevo.");
        return;
      }

      const conditions: SplitCondition[] = [];

      // Condición general
      if (ownerForm.percentage && parseFloat(ownerForm.percentage) > 0) {
        const pct = parseFloat(ownerForm.percentage);
        if (pct <= 0 || pct > 100) {
          setErrorMessage("El porcentaje general debe estar entre 1 y 100.");
          return;
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

      // Condiciones específicas — for...of para que el return funcione correctamente
      for (let i = 0; i < ownerForm.splitConditions.length; i++) {
        const condition = ownerForm.splitConditions[i];
        const pct =
          typeof condition.percentage === "string"
            ? parseFloat(condition.percentage)
            : condition.percentage;

        if (!pct || pct <= 0 || pct > 100) {
          setErrorMessage(
            `El porcentaje de la condición específica #${i + 1} debe estar entre 1 y 100.`
          );
          return;
        }

        conditions.push({
          fromDate: condition.fromDate,
          toDate: condition.toDate,
          percentage: pct,
          selectedCountries: Array.isArray(condition.selectedCountries)
            ? condition.selectedCountries.map((c) =>
                typeof c === "string" ? c : (c as { value: string; label: string }).value
              )
            : [],
          countriesType: condition.countriesType || "all",
          selectedPlatforms: Array.isArray(condition.selectedPlatforms)
            ? condition.selectedPlatforms.map((p) =>
                typeof p === "string" ? p : (p as { value: string; label: string }).value
              )
            : [],
          platformsType: condition.platformsType || "all",
          type: "specific",
        });
      }

      if (conditions.length === 0) {
        setErrorMessage("Configura al menos una condición con un porcentaje válido.");
        return;
      }

      const ownerSplitData: CreateSplitOwnerRequest = { songId, conditions };

      await splitsService.createOwnerSplit(ownerSplitData);

      if (onSplitCreated) onSplitCreated();
      onClose();
    } catch (error: unknown) {
      const err = error as {
        response?: { status: number; data?: { message?: string; error?: string; details?: unknown } };
        request?: unknown;
        message?: string;
      };

      if (err.response?.data) {
        const data = err.response.data;
        const msg =
          data.message ||
          data.error ||
          (data.details ? JSON.stringify(data.details) : null) ||
          "Error desconocido del servidor.";
        setErrorMessage(`Error ${err.response.status}: ${msg}`);
      } else if (err.request) {
        setErrorMessage("Error de conexión. Verifica tu conexión a internet.");
      } else {
        setErrorMessage(err.message || "Error inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasExistingSplit = ((song as any)?.ownerId?.split?.conditions ?? []).length > 0;

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
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-semibold text-base leading-tight">
                  Owner Split
                </h2>
                {hasExistingSplit && (
                  <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-semibold rounded-full">
                    Editando
                  </span>
                )}
              </div>
              <p className="text-white/80 text-xs mt-0.5 truncate max-w-xs">
                {song?.trackTitle || "Canción"}
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
        <div className="flex-1 overflow-y-auto bg-[#F7F8FA] p-5 space-y-4">

          {/* Sección: Condición General */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Section header */}
            <button
              type="button"
              onClick={() => setIsGeneralExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-[#F97316]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Condición General</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Aplica cuando no hay condiciones específicas activas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ownerForm.percentage && (
                  <span className="px-2.5 py-1 bg-orange-50 text-[#F97316] text-xs font-semibold rounded-full">
                    {ownerForm.percentage}%
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isGeneralExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Section body */}
            {isGeneralExpanded && (
              <div className="px-5 py-5 space-y-5">
                {/* Porcentaje */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <Percent className="w-3.5 h-3.5" />
                    Porcentaje
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0.00"
                      value={ownerForm.percentage}
                      onChange={(e) => updateOwnerForm("percentage", e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#F97316] transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                      %
                    </span>
                  </div>
                </div>

                {/* Países */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <Globe className="w-3.5 h-3.5" />
                    Países
                  </label>
                  <FilterSegment
                    value={ownerForm.countriesType}
                    onChange={(v) => updateOwnerForm("countriesType", v)}
                    labels={{ all: "Todos", except: "Excepto", only: "Solo" }}
                    name="países"
                  />
                  {ownerForm.countriesType !== "all" && (
                    <Select
                      isMulti
                      options={countries}
                      value={ownerForm.selectedCountries}
                      onChange={(selected) =>
                        updateOwnerForm("selectedCountries", selected || [])
                      }
                      styles={selectStyles}
                      placeholder="Seleccionar países..."
                      noOptionsMessage={() => "No hay países disponibles"}
                    />
                  )}
                </div>

                {/* Plataformas */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <Music className="w-3.5 h-3.5" />
                    Plataformas
                  </label>
                  <FilterSegment
                    value={ownerForm.platformsType}
                    onChange={(v) => updateOwnerForm("platformsType", v)}
                    labels={{ all: "Todas", except: "Excepto", only: "Solo" }}
                    name="plataformas"
                  />
                  {ownerForm.platformsType !== "all" && (
                    <Select
                      isMulti
                      options={platforms}
                      value={ownerForm.selectedPlatforms}
                      onChange={(selected) =>
                        updateOwnerForm("selectedPlatforms", selected || [])
                      }
                      styles={selectStyles}
                      placeholder="Seleccionar plataformas..."
                      noOptionsMessage={() => "No hay plataformas disponibles"}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sección: Condiciones Específicas */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Condiciones Específicas</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Aplican por período de tiempo, país o plataforma
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addSplitCondition}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir
              </button>
            </div>

            {ownerForm.splitConditions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Sin condiciones específicas</p>
                <p className="text-xs text-gray-400 max-w-xs">
                  Agrega condiciones para definir porcentajes distintos según período, país o plataforma.
                </p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {ownerForm.splitConditions.map((condition, conditionIndex) => (
                  <div
                    key={conditionIndex}
                    className="bg-[#F7F8FA] rounded-xl border border-gray-200 p-4 space-y-4"
                  >
                    {/* Condition header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-[#F97316]">
                            {conditionIndex + 1}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          Condición específica
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSplitCondition(conditionIndex)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Dates + percentage */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Desde
                        </label>
                        <input
                          type="date"
                          value={condition.fromDate || ""}
                          onChange={(e) =>
                            updateSplitCondition(conditionIndex, "fromDate", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Hasta
                        </label>
                        <input
                          type="date"
                          value={condition.toDate || ""}
                          onChange={(e) =>
                            updateSplitCondition(conditionIndex, "toDate", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
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
                              updateSplitCondition(conditionIndex, "percentage", e.target.value)
                            }
                            className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Countries + Platforms */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <Globe className="w-3 h-3" />
                          Países
                        </label>
                        <FilterSegment
                          value={(condition.countriesType as FilterType) || "all"}
                          onChange={(v) =>
                            updateSplitCondition(conditionIndex, "countriesType", v)
                          }
                          labels={{ all: "Todos", except: "Excepto", only: "Solo" }}
                          name={`países-${conditionIndex}`}
                        />
                        {condition.countriesType && condition.countriesType !== "all" && (
                          <Select
                            isMulti
                            options={countries}
                            value={
                              Array.isArray(condition.selectedCountries)
                                ? (condition.selectedCountries as unknown as { value: string; label: string }[])
                                : []
                            }
                            onChange={(selected) =>
                              updateSplitCondition(conditionIndex, "selectedCountries", selected || [])
                            }
                            styles={selectStyles}
                            placeholder="Seleccionar..."
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <Music className="w-3 h-3" />
                          Plataformas
                        </label>
                        <FilterSegment
                          value={(condition.platformsType as FilterType) || "all"}
                          onChange={(v) =>
                            updateSplitCondition(conditionIndex, "platformsType", v)
                          }
                          labels={{ all: "Todas", except: "Excepto", only: "Solo" }}
                          name={`plataformas-${conditionIndex}`}
                        />
                        {condition.platformsType && condition.platformsType !== "all" && (
                          <Select
                            isMulti
                            options={platforms}
                            value={
                              Array.isArray(condition.selectedPlatforms)
                                ? (condition.selectedPlatforms as unknown as { value: string; label: string }[])
                                : []
                            }
                            onChange={(selected) =>
                              updateSplitCondition(conditionIndex, "selectedPlatforms", selected || [])
                            }
                            styles={selectStyles}
                            placeholder="Seleccionar..."
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          {errorMessage && (
            <div className="flex items-start gap-2 mb-3 p-3 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{errorMessage}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={saveOwnerSplit}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? "Guardando..." : hasExistingSplit ? "Actualizar Split" : "Crear Split"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
