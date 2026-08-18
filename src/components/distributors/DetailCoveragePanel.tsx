import { CalendarOff, CircleCheck, Upload } from "lucide-react";
import { CoverageStrip, CoverageLegend } from "./CoverageStrip";
import { formatMonthRange, type MonthRange } from "@/utils/coverage.utils";

interface DetailCoveragePanelProps {
  covered: Set<number>;
  gaps: MonthRange[];
  year: number;
  years: number[];
  onYearChange: (year: number) => void;
  upToMonth: number;
  /** Abre la subida con ese rango ya marcado. */
  onFillGap: (gap: MonthRange) => void;
}

/**
 * Cobertura del distribuidor en un año. No se queda en enseñar el hueco: propone
 * la carga que lo tapa, con el periodo ya elegido.
 */
export function DetailCoveragePanel({
  covered,
  gaps,
  year,
  years,
  onYearChange,
  upToMonth,
  onFillGap,
}: DetailCoveragePanelProps) {
  const [firstGap] = gaps;

  return (
    <div className="flex flex-col gap-4 rounded-[26px] border border-[#E8E8EC] bg-white p-6 shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-base font-semibold text-[#1C1D22]">
            Cobertura {year}
          </h2>
          <p className="text-[11.5px] text-[#71757E]">Meses ya cubiertos por un reporte</p>
        </div>
        <select
          aria-label="Año de cobertura"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="flex-shrink-0 appearance-none rounded-2xl bg-[#F4F5F7] px-3 py-1.5 font-mono text-[11.5px] font-semibold text-[#1C1D22] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <CoverageStrip covered={covered} year={year} upToMonth={upToMonth} showInitials />

      <CoverageLegend />

      <div className="h-px bg-[#E8E8EC]" />

      {gaps.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-2xl bg-[#E4F5EC] px-3.5 py-3">
          <CircleCheck className="h-3.5 w-3.5 flex-shrink-0 text-[#2FB37E]" />
          <span className="text-[11.5px] font-semibold text-[#1F7D58]">
            Sin huecos: {year} está al día
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 rounded-2xl bg-[#FFEADD] p-3.5">
          <span className="flex items-center gap-2">
            <CalendarOff className="h-3.5 w-3.5 flex-shrink-0 text-[#FF5C00]" />
            <span className="text-[12px] font-semibold text-[#EA580C]">
              {gaps.map(formatMonthRange).join(" · ")} sin reporte
            </span>
          </span>
          <span className="text-[11px] leading-relaxed text-[#EA580C]">
            {gaps.length === 1
              ? "Ese tramo del año no tiene ingresos registrados para este distribuidor."
              : "Esos tramos del año no tienen ingresos registrados para este distribuidor."}
          </span>
          <button
            onClick={() => onFillGap(firstGap)}
            className="flex items-center justify-center gap-2 rounded-[14px] bg-[#FF5C00] px-3.5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            <Upload className="h-3.5 w-3.5" />
            Cargar {formatMonthRange(firstGap)} {year}
          </button>
        </div>
      )}
    </div>
  );
}
