import { Trash2, Globe, Music } from "lucide-react";
import Select from "react-select";
import { countries, platforms } from "@/const";
import { FilterSegment } from "@/components/ui/FilterSegment";
import { selectStyles } from "@/components/ui/selectStyles";
import type { SplitConditionFormData } from "@/types";
import type { FilterType } from "@/types";

interface SplitConditionCardProps {
  condition: SplitConditionFormData;
  index: number;
  collaboratorId: string;
  onUpdate: (collaboratorId: string, index: number, field: string, value: string | readonly { value: string; label: string }[] | readonly string[]) => void;
  onRemove: (collaboratorId: string, index: number) => void;
}

/**
 * Tarjeta que representa una condición específica de split (por período, país o plataforma).
 * Renderiza los campos de fecha, porcentaje, países y plataformas para una condición.
 */
export function SplitConditionCard({
  condition,
  index,
  collaboratorId,
  onUpdate,
  onRemove,
}: SplitConditionCardProps) {
  return (
    <div className="bg-[#F7F8FA] rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#F97316]">{index + 1}</span>
          </div>
          <span className="text-xs font-semibold text-gray-900">Condición específica</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(collaboratorId, index)}
          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-gray-400 hover:text-red-500"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Desde</label>
          <input
            type="date"
            value={condition.fromDate ?? ""}
            onChange={(e) => onUpdate(collaboratorId, index, "fromDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hasta</label>
          <input
            type="date"
            value={condition.toDate ?? ""}
            onChange={(e) => onUpdate(collaboratorId, index, "toDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Porcentaje</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={condition.percentage ?? ""}
              onChange={(e) => onUpdate(collaboratorId, index, "percentage", e.target.value)}
              className="w-full pl-3 pr-7 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 font-semibold focus:outline-none focus:border-[#F97316] transition-colors bg-white"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <Globe className="w-3 h-3" />
            Países
          </label>
          <FilterSegment
            value={(condition.countriesType as FilterType) ?? "all"}
            onChange={(v) => onUpdate(collaboratorId, index, "countriesType", v)}
            labels={{ all: "Todos", except: "Excepto", only: "Solo" }}
            name={`países-cond-${collaboratorId}-${index}`}
          />
          {condition.countriesType && condition.countriesType !== "all" && (
            <Select
              isMulti
              options={countries}
              value={condition.selectedCountries as { value: string; label: string }[]}
              onChange={(selected) => onUpdate(collaboratorId, index, "selectedCountries", selected ?? [])}
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
            value={(condition.platformsType as FilterType) ?? "all"}
            onChange={(v) => onUpdate(collaboratorId, index, "platformsType", v)}
            labels={{ all: "Todas", except: "Excepto", only: "Solo" }}
            name={`plataformas-cond-${collaboratorId}-${index}`}
          />
          {condition.platformsType && condition.platformsType !== "all" && (
            <Select
              isMulti
              options={platforms}
              value={condition.selectedPlatforms as { value: string; label: string }[]}
              onChange={(selected) => onUpdate(collaboratorId, index, "selectedPlatforms", selected ?? [])}
              styles={selectStyles}
              placeholder="Seleccionar..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
