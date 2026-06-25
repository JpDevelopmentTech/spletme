import { Music, X, Globe, Percent, Users, ChevronDown, Save, AlertCircle } from "lucide-react";
import Select from "react-select";
import { createPortal } from "react-dom";
import { FilterSegment } from "@/components/ui/FilterSegment";
import { selectStyles } from "@/components/ui/selectStyles";
import { useSplitsModal } from "@/hooks/useSplitsModal";
import type { SplitsModalProps } from "@/types";

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

export default function SplitsModal({ collaborators, isOpen, onClose, songId }: SplitsModalProps) {
  const {
    mounted,
    isLoading,
    isLoadingFilters,
    countryOptions,
    platformOptions,
    errorMessage,
    expandedCollaborators,
    configuredCount,
    hasAnySavedSplit,
    getForm,
    toggleExpanded,
    updateForm,
    saveSplit,
  } = useSplitsModal({ isOpen, collaborators, songId });

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between bg-[#F97316] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight text-white">
                Configurar Splits
              </h2>
              <p className="mt-0.5 text-xs text-white/80">
                {collaborators.length} colaborador
                {collaborators.length !== 1 ? "es" : ""} disponible
                {collaborators.length !== 1 ? "s" : ""}
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
        <div className="flex-1 space-y-3 overflow-y-auto bg-[#F7F8FA] p-5">
          {collaborators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mb-1 text-sm font-semibold text-gray-700">Sin colaboradores</p>
              <p className="text-xs text-gray-400">Agrega colaboradores a la canción primero.</p>
            </div>
          ) : (
            collaborators.map((collaborator, idx) => {
              const form = getForm(collaborator.id);
              const isExpanded = expandedCollaborators[collaborator.id] ?? false;
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const hasPercentage = form.percentage && parseFloat(form.percentage) > 0;
              const hasExistingSplit = Boolean(collaborator.split);

              return (
                <div
                  key={collaborator.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  {/* Fila del colaborador — clickeable para expandir */}
                  <button
                    type="button"
                    onClick={() => toggleExpanded(collaborator.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full ${avatarColor} flex flex-shrink-0 items-center justify-center`}
                      >
                        <span className="text-xs font-bold text-white">
                          {getInitials(collaborator.name ?? "?")}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{collaborator.name}</p>
                        <p className="text-xs text-gray-500">{collaborator.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasExistingSplit && (
                        <span className="rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                          Configurado
                        </span>
                      )}
                      {hasPercentage && (
                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#F97316]">
                          {form.percentage}%
                        </span>
                      )}
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Contenido expandido — una sola regla: % + filtros */}
                  {isExpanded && (
                    <div className="space-y-4 border-t border-gray-100 bg-[#F7F8FA] px-5 py-5">
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                          <Percent className="h-3.5 w-3.5" />
                          Porcentaje del pool disponible
                        </label>
                        <div className="relative max-w-xs">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            step="0.01"
                            placeholder="0.00"
                            value={form.percentage}
                            onChange={(e) =>
                              updateForm(collaborator.id, "percentage", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-gray-900 transition-colors focus:border-[#F97316] focus:outline-none"
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
                          onChange={(v) => updateForm(collaborator.id, "countriesType", v)}
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
                            isLoading={isLoadingFilters}
                            options={countryOptions}
                            value={form.selectedCountries}
                            onChange={(selected) =>
                              updateForm(collaborator.id, "selectedCountries", selected ?? [])
                            }
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
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
                          onChange={(v) => updateForm(collaborator.id, "platformsType", v)}
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
                            isLoading={isLoadingFilters}
                            options={platformOptions}
                            value={form.selectedPlatforms}
                            onChange={(selected) =>
                              updateForm(collaborator.id, "selectedPlatforms", selected ?? [])
                            }
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            placeholder="Seleccionar plataformas..."
                            noOptionsMessage={() => "No hay plataformas disponibles"}
                          />
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
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
          {errorMessage && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-xs text-red-700">{errorMessage}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {configuredCount > 0 ? (
                <>
                  <span className="font-semibold text-gray-900">{configuredCount}</span> colaborador
                  {configuredCount !== 1 ? "es" : ""} configurado
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
                className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveSplit}
                disabled={isLoading || configuredCount === 0}
                className="flex items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isLoading
                  ? "Guardando..."
                  : hasAnySavedSplit
                    ? "Actualizar Splits"
                    : "Guardar Splits"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
