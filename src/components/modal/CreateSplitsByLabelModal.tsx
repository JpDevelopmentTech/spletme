/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Crown,
  X,
  AlertCircle,
  CheckCircle,
  Save,
  Settings,
  Percent,
  Globe,
  Music,
  Tag,
} from "lucide-react";
import Select from "react-select";
import { createPortal } from "react-dom";
import { FilterSegment } from "@/components/ui/FilterSegment";
import { selectStyles } from "@/components/ui/selectStyles";
import { useReleaseFiltersForSongs } from "@/hooks/useReleaseFiltersForSongs";
import labelsService from "@/services/labels";
import type { FilterType, SelectOption } from "@/types";

interface CreateSplitsByLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  songCount: number;
}

interface LabelSplitForm {
  percentage: string;
  countriesType: FilterType;
  selectedCountries: SelectOption[];
  platformsType: FilterType;
  selectedPlatforms: SelectOption[];
}

const DEFAULT_FORM: LabelSplitForm = {
  percentage: "",
  countriesType: "all",
  selectedCountries: [],
  platformsType: "all",
  selectedPlatforms: [],
};

export default function CreateSplitsByLabelModal({
  isOpen,
  onClose,
  label,
  songCount,
}: CreateSplitsByLabelModalProps) {
  const [form, setForm] = useState<LabelSplitForm>(DEFAULT_FORM);
  const [songIds, setSongIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { countryOptions, platformOptions, isLoadingFilters } =
    useReleaseFiltersForSongs(songIds, isOpen);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);
    setResult(null);
    setForm(DEFAULT_FORM);

    let active = true;
    labelsService.getSongsByLabel(label).then((res) => {
      if (!active) return;
      setSongIds((res.data ?? []).map((s) => s._id));
    });
    return () => {
      active = false;
    };
  }, [isOpen, label]);

  const updateForm = (
    field: keyof LabelSplitForm,
    value: string | readonly SelectOption[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    const pct = parseFloat(form.percentage);
    if (!pct || pct < 1 || pct > 100) {
      setErrorMessage("El porcentaje debe estar entre 1 y 100.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await labelsService.createSplitByLabel({
        label,
        percentage: pct,
        countriesType: form.countriesType,
        selectedCountries: form.selectedCountries.map((c) => c.value),
        platformsType: form.platformsType,
        selectedPlatforms: form.selectedPlatforms.map((p) => p.value),
      });

      if (response.error) {
        setErrorMessage(response.message ?? "Error al crear los splits");
        return;
      }
      setResult(response.data);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ?? "Error al crear los splits",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setErrorMessage(null);
    onClose();
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={handleClose}
    >
      <div
        className="mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between bg-[#F97316] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight text-white">
                Owner Split — Label
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80">
                <Tag className="h-3 w-3" />
                {label} · {songCount}{" "}
                {songCount === 1 ? "canción" : "canciones"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-white/30"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-[#F7F8FA] p-5">
          {result ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-green-100 bg-green-50">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Splits Guardados
                </h3>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    label: "Total",
                    value: result.summary?.total ?? 0,
                    color: "blue",
                  },
                  {
                    label: "Creados",
                    value: result.summary?.created ?? 0,
                    color: "green",
                  },
                  {
                    label: "Actualizados",
                    value: result.summary?.updated ?? 0,
                    color: "purple",
                  },
                  {
                    label: "Errores",
                    value: result.summary?.errors ?? 0,
                    color: "red",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`bg-${s.color}-50 border border-${s.color}-100 rounded-xl p-3 text-center`}
                  >
                    <p className={`text-xl font-bold text-${s.color}-600`}>
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {result.failed?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-700">
                    Con error ({result.failed.length})
                  </p>
                  <div className="max-h-40 space-y-1.5 overflow-y-auto">
                    {result.failed.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="rounded-lg border border-red-100 bg-red-50 p-2.5"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {item.trackTitle}
                        </p>
                        <p className="text-xs text-red-600">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700">
                  La configuración se aplicará a las{" "}
                  <strong>{songCount}</strong> canciones del label{" "}
                  <strong>{label}</strong>.
                </p>
              </div>

              <div className="space-y-5 rounded-xl border border-gray-200 bg-white px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                    <Settings className="h-4 w-4 text-[#F97316]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Configuración del Split
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Porcentaje del owner y filtros opcionales
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    <Percent className="h-3.5 w-3.5" /> Porcentaje
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="0.01"
                      placeholder="0.00"
                      value={form.percentage}
                      onChange={(e) => updateForm("percentage", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-10 text-sm font-semibold text-gray-900 transition-colors focus:border-[#F97316] focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    <Globe className="h-3.5 w-3.5" /> Países
                  </label>
                  <FilterSegment
                    value={form.countriesType}
                    onChange={(v) => updateForm("countriesType", v)}
                    labels={{ all: "Todos", except: "Excepto", only: "Solo" }}
                    name="label-países"
                  />
                  {form.countriesType !== "all" && (
                    <Select
                      isMulti
                      isLoading={isLoadingFilters}
                      options={countryOptions}
                      value={form.selectedCountries}
                      onChange={(s) => updateForm("selectedCountries", s ?? [])}
                      styles={selectStyles}
                      placeholder="Seleccionar países..."
                      noOptionsMessage={() => "No hay países disponibles"}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    <Music className="h-3.5 w-3.5" /> Plataformas
                  </label>
                  <FilterSegment
                    value={form.platformsType}
                    onChange={(v) => updateForm("platformsType", v)}
                    labels={{ all: "Todas", except: "Excepto", only: "Solo" }}
                    name="label-plataformas"
                  />
                  {form.platformsType !== "all" && (
                    <Select
                      isMulti
                      isLoading={isLoadingFilters}
                      options={platformOptions}
                      value={form.selectedPlatforms}
                      onChange={(s) => updateForm("selectedPlatforms", s ?? [])}
                      styles={selectStyles}
                      placeholder="Seleccionar plataformas..."
                      noOptionsMessage={() => "No hay plataformas disponibles"}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
          {errorMessage && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-xs text-red-700">{errorMessage}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {result ? "Cerrar" : "Cancelar"}
            </button>
            {!result && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isLoading ? "Guardando..." : "Guardar Splits"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
