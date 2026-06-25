import { AnimatePresence, motion } from "framer-motion";
import { Music, Crown, Globe, Percent, Settings, ChevronDown } from "lucide-react";
import Select from "react-select";
import { amberSelectStyles } from "@/components/ui/selectStyles";
import type { OwnerFormData } from "@/types/album-owner-split.types";
import type { SelectOption } from "@/types";

interface OwnerSplitConfigFormProps {
  ownerForm: OwnerFormData;
  isExpanded: boolean;
  tracksCount: number;
  currentUser: { name?: string; email?: string } | null;
  isLoadingFilters: boolean;
  countryOptions: SelectOption[];
  platformOptions: SelectOption[];
  onToggleExpanded: () => void;
  onUpdateForm: (field: keyof OwnerFormData, value: string | readonly SelectOption[]) => void;
}

const COUNTRY_TYPE_OPTIONS = [
  { value: "all", label: "Todos los países" },
  { value: "except", label: "Excepto países seleccionados" },
  { value: "only", label: "Solo países seleccionados" },
] as const;

const PLATFORM_TYPE_OPTIONS = [
  { value: "all", label: "Todas las plataformas" },
  { value: "except", label: "Excepto plataformas seleccionadas" },
  { value: "only", label: "Solo plataformas seleccionadas" },
] as const;

/**
 * Formulario de configuración del owner split masivo por álbum: un porcentaje
 * y filtros opcionales de país y plataforma que se aplican a todas las canciones.
 */
export function OwnerSplitConfigForm({
  ownerForm,
  isExpanded,
  tracksCount,
  currentUser,
  isLoadingFilters,
  countryOptions,
  platformOptions,
  onToggleExpanded,
  onUpdateForm,
}: OwnerSplitConfigFormProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <Settings className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
        <div className="text-sm text-blue-900">
          <p className="mb-1 font-medium">Creación masiva de splits</p>
          <p>
            La configuración que definas se aplicará a todas las {tracksCount} canciones de este
            álbum.
          </p>
        </div>
      </div>

      <motion.div
        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
      >
        {/* Owner header — clickeable para colapsar */}
        <motion.div
          className="cursor-pointer border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-6"
          onClick={onToggleExpanded}
          whileHover={{ backgroundColor: "rgba(245,158,11,0.05)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg"
                whileHover={{ scale: 1.1 }}
              >
                <Crown className="h-7 w-7" />
              </motion.div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900">
                  {currentUser?.name ?? "Owner"}
                </h3>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{currentUser?.email}</span>
                  {ownerForm.percentage && (
                    <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                      {ownerForm.percentage}%
                    </span>
                  )}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-amber-100 p-2 transition-colors hover:bg-amber-200"
            >
              <ChevronDown className="h-5 w-5 text-amber-700" />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Settings className="h-6 w-6 text-amber-600" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Configuración del Split
                      </h4>
                      <p className="text-sm text-gray-600">
                        Porcentaje del owner y filtros opcionales de país y plataforma
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Percent className="h-4 w-4" />
                        Porcentaje de Split
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          step="0.01"
                          placeholder="0.00"
                          value={ownerForm.percentage}
                          onChange={(e) => onUpdateForm("percentage", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 py-3 pl-4 pr-12 font-medium text-gray-900 transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          %
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Globe className="h-4 w-4" />
                        Configuración de Países
                      </label>
                      <div className="space-y-2">
                        {COUNTRY_TYPE_OPTIONS.map((opt) => (
                          <motion.label
                            key={opt.value}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name="countries-type"
                              checked={ownerForm.countriesType === opt.value}
                              onChange={() => onUpdateForm("countriesType", opt.value)}
                              className="h-4 w-4 text-amber-500 focus:ring-amber-500/20"
                            />
                            <span className="text-sm text-gray-900">{opt.label}</span>
                          </motion.label>
                        ))}
                      </div>
                      {ownerForm.countriesType !== "all" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <Select
                            isMulti
                            isLoading={isLoadingFilters}
                            options={countryOptions}
                            value={ownerForm.selectedCountries}
                            onChange={(selected) =>
                              onUpdateForm("selectedCountries", selected ?? [])
                            }
                            styles={amberSelectStyles}
                            placeholder="Seleccionar países..."
                            noOptionsMessage={() => "No hay países disponibles"}
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-3 lg:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Music className="h-4 w-4" />
                        Configuración de Plataformas
                      </label>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                        {PLATFORM_TYPE_OPTIONS.map((opt) => (
                          <motion.label
                            key={opt.value}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name="platforms-type"
                              checked={ownerForm.platformsType === opt.value}
                              onChange={() => onUpdateForm("platformsType", opt.value)}
                              className="h-4 w-4 text-amber-500 focus:ring-amber-500/20"
                            />
                            <span className="text-sm text-gray-900">{opt.label}</span>
                          </motion.label>
                        ))}
                      </div>
                      {ownerForm.platformsType !== "all" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <Select
                            isMulti
                            isLoading={isLoadingFilters}
                            options={platformOptions}
                            value={ownerForm.selectedPlatforms}
                            onChange={(selected) =>
                              onUpdateForm("selectedPlatforms", selected ?? [])
                            }
                            styles={amberSelectStyles}
                            placeholder="Seleccionar plataformas..."
                            noOptionsMessage={() => "No hay plataformas disponibles"}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
