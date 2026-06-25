import { Crown, X, Globe, Percent, Music, Save, AlertCircle } from "lucide-react";
import Select from "react-select";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FilterSegment } from "@/components/ui/FilterSegment";
import { selectStyles } from "@/components/ui/selectStyles";
import { useReleaseFilters } from "@/hooks/useReleaseFilters";
import { songSplitsService } from "@/services/songSplits";
import type { FilterType, SelectOption, SongSplit } from "@/types";

interface OwnerSplitModalSong {
  trackTitle?: string;
  ownerId?: { split?: SongSplit | null } | string;
}

interface OwnerSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  song: OwnerSplitModalSong;
  onSplitCreated?: () => void;
}

interface OwnerFormData {
  percentage: string;
  countriesType: FilterType;
  selectedCountries: SelectOption[];
  platformsType: FilterType;
  selectedPlatforms: SelectOption[];
}

const toSelectOptions = (values: string[]): SelectOption[] =>
  (values ?? []).map((value) => ({ value, label: value }));

const defaultForm = (): OwnerFormData => ({
  percentage: "",
  countriesType: "all",
  selectedCountries: [],
  platformsType: "all",
  selectedPlatforms: [],
});

export default function OwnerSplitModal({
  isOpen,
  onClose,
  songId,
  song,
  onSplitCreated,
}: OwnerSplitModalProps) {
  const [form, setForm] = useState<OwnerFormData>(defaultForm());
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

    const ownerId = song?.ownerId;
    const split = ownerId && typeof ownerId === "object" ? (ownerId.split ?? null) : null;

    if (!split) {
      setForm(defaultForm());
      return;
    }

    setForm({
      percentage: String(split.percentage ?? ""),
      countriesType: split.countriesType ?? "all",
      selectedCountries: toSelectOptions(split.selectedCountries ?? []),
      platformsType: split.platformsType ?? "all",
      selectedPlatforms: toSelectOptions(split.selectedPlatforms ?? []),
    });
  }, [isOpen, song]);

  const updateForm = (field: keyof OwnerFormData, value: string | readonly SelectOption[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const hasExistingSplit = Boolean(
    song?.ownerId && typeof song.ownerId === "object" && song.ownerId.split,
  );

  const saveOwnerSplit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!songId) {
        setErrorMessage("ID de canción no válido.");
        return;
      }

      const pct = parseFloat(form.percentage);
      if (!pct || pct < 1 || pct > 100) {
        setErrorMessage("El porcentaje debe estar entre 1 y 100.");
        return;
      }

      await songSplitsService.createOwnerSplit({
        songId,
        percentage: pct,
        countriesType: form.countriesType,
        selectedCountries: form.selectedCountries.map((c) => c.value),
        platformsType: form.platformsType,
        selectedPlatforms: form.selectedPlatforms.map((p) => p.value),
      });

      if (onSplitCreated) onSplitCreated();
      onClose();
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

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mx-4 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between bg-[#F97316] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold leading-tight text-white">Owner Split</h2>
                {hasExistingSplit && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                    Editando
                  </span>
                )}
              </div>
              <p className="mt-0.5 max-w-xs truncate text-xs text-white/80">
                {song?.trackTitle || "Canción"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-white/30"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-[#F7F8FA] p-5">
          <div className="space-y-5 rounded-xl border border-gray-200 bg-white px-5 py-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                <Percent className="h-3.5 w-3.5" />
                Porcentaje del owner
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
                <Globe className="h-3.5 w-3.5" />
                Países
              </label>
              <FilterSegment
                value={form.countriesType}
                onChange={(v) => updateForm("countriesType", v)}
                labels={{ all: "Todos", except: "Excepto", only: "Solo" }}
                name="owner-países"
              />
              {form.countriesType !== "all" && (
                <Select
                  isMulti
                  isLoading={isLoadingFilters}
                  options={countryOptions}
                  value={form.selectedCountries}
                  onChange={(selected) => updateForm("selectedCountries", selected ?? [])}
                  styles={selectStyles}
                  placeholder="Seleccionar países..."
                  noOptionsMessage={() => "No hay países disponibles"}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                <Music className="h-3.5 w-3.5" />
                Plataformas
              </label>
              <FilterSegment
                value={form.platformsType}
                onChange={(v) => updateForm("platformsType", v)}
                labels={{ all: "Todas", except: "Excepto", only: "Solo" }}
                name="owner-plataformas"
              />
              {form.platformsType !== "all" && (
                <Select
                  isMulti
                  isLoading={isLoadingFilters}
                  options={platformOptions}
                  value={form.selectedPlatforms}
                  onChange={(selected) => updateForm("selectedPlatforms", selected ?? [])}
                  styles={selectStyles}
                  placeholder="Seleccionar plataformas..."
                  noOptionsMessage={() => "No hay plataformas disponibles"}
                />
              )}
            </div>
          </div>
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
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={saveOwnerSplit}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? "Guardando..." : hasExistingSplit ? "Actualizar Split" : "Crear Split"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
