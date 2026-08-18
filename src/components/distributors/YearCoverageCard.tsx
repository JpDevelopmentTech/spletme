import { TriangleAlert, CircleCheck, ChevronDown } from "lucide-react";
import { MONTH_NAMES, MONTH_SHORT_NAMES } from "@/utils/period.utils";
import { formatGaps, type MonthRange } from "@/utils/coverage.utils";

interface YearCoverageCardProps {
  /** Cuántos distribuidores cubren cada mes, indexado de 1 a 12. */
  countByMonth: Map<number, number>;
  /** Total de distribuidores, para saber cuándo un mes está cubierto del todo. */
  distributorsCount: number;
  gaps: MonthRange[];
  year: number;
  years: number[];
  onYearChange: (year: number) => void;
  /** Último mes vencido: los posteriores se dibujan como pendientes, no como hueco. */
  upToMonth: number;
  onShowGaps?: () => void;
}

/**
 * Cobertura del año agregada: cuántos distribuidores han reportado cada mes.
 *
 * Un mes en el que solo han reportado dos de seis distribuidores no es un hueco,
 * pero tampoco está cerrado; por eso la celda gradúa en vez de encenderse o
 * apagarse.
 */
export function YearCoverageCard({
  countByMonth,
  distributorsCount,
  gaps,
  year,
  years,
  onYearChange,
  upToMonth,
  onShowGaps,
}: YearCoverageCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[26px] border border-[#E8E8EC] bg-white p-6 shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:w-[400px] lg:flex-shrink-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-[15px] font-semibold text-[#1C1D22]">
            Cobertura {year}
          </h2>
          <p className="text-[11.5px] text-[#71757E]">
            Meses con reporte cargado por algún distribuidor
          </p>
        </div>
        <div className="relative flex-shrink-0">
          <select
            aria-label="Año de cobertura"
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="appearance-none rounded-2xl bg-[#F4F5F7] py-1.5 pl-3 pr-7 font-mono text-[11.5px] font-semibold text-[#1C1D22] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#71757E]" />
        </div>
      </div>

      <div className="flex items-end gap-1">
        {MONTH_SHORT_NAMES.map((short, index) => {
          const month = index + 1;
          const count = countByMonth.get(month) ?? 0;
          const pending = month > upToMonth;
          const full = distributorsCount > 0 && count >= distributorsCount;
          const partial = count > 0 && !full;

          return (
            <div key={short} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                title={`${MONTH_NAMES[index]} ${year}: ${count} de ${distributorsCount} distribuidores`}
                className={[
                  "flex h-[34px] w-full items-center justify-center rounded-[9px]",
                  full
                    ? "bg-[#FF5C00]"
                    : partial
                      ? "bg-[#FFEADD]"
                      : pending
                        ? "border border-dashed border-[#E8E8EC] bg-white"
                        : "border border-[#E8E8EC] bg-[#F4F5F7]",
                ].join(" ")}
              >
                <span
                  className={`font-mono text-[11px] font-semibold ${
                    full ? "text-white" : partial ? "text-[#FF5C00]" : "text-[#A6AAB2]"
                  }`}
                >
                  {count > 0 ? count : "—"}
                </span>
              </span>
              <span className="font-mono text-[9.5px] font-medium text-[#A6AAB2]">
                {short.charAt(0)}
              </span>
            </div>
          );
        })}
      </div>

      {gaps.length > 0 ? (
        <button
          onClick={onShowGaps}
          disabled={!onShowGaps}
          className="flex items-center gap-2.5 rounded-2xl bg-[#FFEADD] px-3.5 py-3 text-left transition-colors enabled:hover:bg-[#FFDCC7] disabled:cursor-default"
        >
          <TriangleAlert className="h-3.5 w-3.5 flex-shrink-0 text-[#FF5C00]" />
          <span className="flex-1 text-[11.5px] font-semibold text-[#EA580C]">
            {formatGaps(gaps)} sin cargar en ningún distribuidor
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-2.5 rounded-2xl bg-[#E4F5EC] px-3.5 py-3">
          <CircleCheck className="h-3.5 w-3.5 flex-shrink-0 text-[#2FB37E]" />
          <span className="flex-1 text-[11.5px] font-semibold text-[#1F7D58]">
            Todos los meses vencidos de {year} tienen reporte
          </span>
        </div>
      )}
    </div>
  );
}
