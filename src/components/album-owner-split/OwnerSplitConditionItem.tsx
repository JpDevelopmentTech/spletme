import { motion } from "framer-motion";
import { Trash2, Calendar } from "lucide-react";
import Select from "react-select";
import { countries, platforms } from "@/const";
import { amberSelectStyles } from "@/components/ui/selectStyles";
import type { SplitCondition } from "@/types";

interface OwnerSplitConditionItemProps {
  condition: SplitCondition;
  index: number;
  onUpdate: (index: number, field: string, value: string | readonly { value: string; label: string }[]) => void;
  onRemove: (index: number) => void;
}

const COUNTRY_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "except", label: "Excepto" },
  { value: "only", label: "Solo" },
] as const;

const PLATFORM_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "except", label: "Excepto" },
  { value: "only", label: "Solo" },
] as const;

/**
 * Tarjeta de condición específica en el formulario de owner split por álbum.
 */
export function OwnerSplitConditionItem({ condition, index, onUpdate, onRemove }: OwnerSplitConditionItemProps) {
  return (
    <motion.div
      className="bg-gradient-to-r from-orange-50 to-orange-25 rounded-2xl p-6 border border-orange-200"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <h5 className="font-semibold text-gray-900">Condición #{index + 1}</h5>
        </div>
        <motion.button
          onClick={() => onRemove(index)}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Fecha de inicio</label>
          <input
            type="date"
            value={condition.fromDate ?? ""}
            onChange={(e) => onUpdate(index, "fromDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Fecha de fin</label>
          <input
            type="date"
            value={condition.toDate ?? ""}
            onChange={(e) => onUpdate(index, "toDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Porcentaje</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={condition.percentage}
              onChange={(e) => onUpdate(index, "percentage", e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Países</label>
          <div className="flex gap-2 text-xs">
            {COUNTRY_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name={`countries-condition-${index}`}
                  checked={condition.countriesType === opt.value || (!condition.countriesType && opt.value === "all")}
                  onChange={() => onUpdate(index, "countriesType", opt.value)}
                  className="w-3 h-3"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {condition.countriesType !== "all" && (
            <Select
              isMulti
              options={countries}
              onChange={(selected) => onUpdate(index, "selectedCountries", selected ?? [])}
              styles={amberSelectStyles}
              placeholder="Seleccionar..."
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">Plataformas</label>
          <div className="flex gap-2 text-xs">
            {PLATFORM_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name={`platforms-condition-${index}`}
                  checked={condition.platformsType === opt.value || (!condition.platformsType && opt.value === "all")}
                  onChange={() => onUpdate(index, "platformsType", opt.value)}
                  className="w-3 h-3"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {condition.platformsType !== "all" && (
            <Select
              isMulti
              options={platforms}
              onChange={(selected) => onUpdate(index, "selectedPlatforms", selected ?? [])}
              styles={amberSelectStyles}
              placeholder="Seleccionar..."
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
