import { CalendarRange, Globe, Radio, Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import Select from "react-select";
import { FilterSegment } from "@/components/ui/FilterSegment";
import { selectStyles } from "@/components/ui/selectStyles";
import { formatMonth, formatPeriodRange, earliestMonth } from "@/utils/splitPeriods.utils";
import type { SelectOption, SplitPeriodFormData } from "@/types";

interface SplitPeriodsEditorProps {
  /** Identifica los inputs del colaborador dentro del modal. */
  ownerKey: string;
  periods: SplitPeriodFormData[];
  /** Porcentaje base del split: lo que cobra fuera de los tramos. */
  fallbackPercentage: string;
  countryOptions: SelectOption[];
  platformOptions: SelectOption[];
  isLoadingFilters: boolean;
  onAdd: () => void;
  onRemove: (periodId: string) => void;
  onChange: (
    periodId: string,
    field: keyof SplitPeriodFormData,
    value: string | readonly SelectOption[],
  ) => void;
}

/** `"2025-03"` → 24303, para poder medir distancias en meses. */
const monthIndex = (value: string): number | null => {
  const [year, month] = (value ?? "").split("-");
  const y = Number(year);
  const m = Number(month);
  if (!y || !m) return null;
  return y * 12 + (m - 1);
};

const fmtPct = (value: string) => {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

/**
 * Tramos de vigencia de un split: los periodos en los que el colaborador cobra
 * un porcentaje distinto del suyo habitual.
 *
 * La línea de tiempo de arriba no es decoración: los huecos que deja son
 * exactamente los meses que paga el porcentaje de fuera de los tramos, que es
 * la parte de la regla que no se ve leyendo una lista de fechas.
 */
export function SplitPeriodsEditor({
  ownerKey,
  periods,
  fallbackPercentage,
  countryOptions,
  platformOptions,
  isLoadingFilters,
  onAdd,
  onRemove,
  onChange,
}: SplitPeriodsEditorProps) {
  const complete = periods.filter((p) => p.from && p.to && p.from <= p.to);
  const first = earliestMonth(complete);

  return (
    <div className="flex flex-col gap-3 rounded-[16px] bg-white p-3.5 ring-1 ring-[#E8E8EC]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
          <CalendarRange className="h-3 w-3" />
          CUÁNDO CAMBIA SU PARTE
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#F4F5F7] px-2.5 py-1.5 text-[11px] font-semibold text-[#71757E] transition-colors hover:bg-[#E8E8EC] hover:text-[#1C1D22] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
        >
          <Plus className="h-3 w-3" />
          Añadir tramo
        </button>
      </div>

      {periods.length === 0 ? (
        <p className="text-[11.5px] leading-[1.45] text-[#A6AAB2]">
          Cobra ese porcentaje siempre. Añade un tramo si su parte cambia en unas fechas
          concretas.
        </p>
      ) : (
        <>
          {complete.length >= 2 && <PeriodsTimeline periods={complete} />}

          <ul className="flex flex-col gap-2.5">
            {periods.map((period, index) => (
              <PeriodRow
                key={period.id}
                period={period}
                index={index}
                ownerKey={ownerKey}
                countryOptions={countryOptions}
                platformOptions={platformOptions}
                isLoadingFilters={isLoadingFilters}
                onRemove={() => onRemove(period.id)}
                onChange={(field, value) => onChange(period.id, field, value)}
              />
            ))}
          </ul>

          <p className="rounded-[12px] bg-[#F4F5F7] px-3 py-2.5 text-[11px] leading-[1.5] text-[#71757E]">
            {first ? (
              <>
                Antes de <strong className="font-semibold text-[#1C1D22]">{formatMonth(first)}</strong>{" "}
                no cobra nada. Fuera de los tramos cobra el{" "}
                <strong className="font-semibold text-[#1C1D22]">
                  {fmtPct(fallbackPercentage)}%
                </strong>{" "}
                de arriba.
              </>
            ) : (
              "Completa las fechas de cada tramo para ver cuándo cobra cada porcentaje."
            )}
          </p>
        </>
      )}
    </div>
  );
}

/**
 * Los tramos dibujados sobre el periodo que abarcan, de su primer mes al
 * último. Lo naranja son los tramos; lo gris, los meses que paga el fallback.
 */
function PeriodsTimeline({ periods }: { periods: SplitPeriodFormData[] }) {
  const bounds = periods.reduce<{ start: number; end: number } | null>((acc, period) => {
    const from = monthIndex(period.from);
    const to = monthIndex(period.to);
    if (from === null || to === null) return acc;
    if (!acc) return { start: from, end: to };
    return { start: Math.min(acc.start, from), end: Math.max(acc.end, to) };
  }, null);

  if (!bounds) return null;

  const total = bounds.end - bounds.start + 1;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="relative flex h-3 w-full overflow-hidden rounded-[6px] bg-[#E8E8EC]">
        {periods.map((period) => {
          const from = monthIndex(period.from);
          const to = monthIndex(period.to);
          if (from === null || to === null) return null;
          return (
            <span
              key={period.id}
              title={`${formatPeriodRange(period)} · ${fmtPct(period.percentage)}%`}
              className="absolute top-0 h-full rounded-[6px] bg-[#FF5C00]"
              style={{
                left: `${((from - bounds.start) / total) * 100}%`,
                width: `${((to - from + 1) / total) * 100}%`,
              }}
            />
          );
        })}
      </span>
      <span className="flex justify-between font-mono text-[9px] text-[#A6AAB2]">
        <span>{formatMonth(periods[0].from)}</span>
        <span>lo gris lo paga el porcentaje de fuera de los tramos</span>
      </span>
    </div>
  );
}

function PeriodRow({
  period,
  index,
  ownerKey,
  countryOptions,
  platformOptions,
  isLoadingFilters,
  onRemove,
  onChange,
}: {
  period: SplitPeriodFormData;
  index: number;
  ownerKey: string;
  countryOptions: SelectOption[];
  platformOptions: SelectOption[];
  isLoadingFilters: boolean;
  onRemove: () => void;
  onChange: (field: keyof SplitPeriodFormData, value: string | readonly SelectOption[]) => void;
}) {
  const narrowed = period.countriesType !== "all" || period.platformsType !== "all";
  const [showFilters, setShowFilters] = useState(narrowed);
  const inverted = Boolean(period.from && period.to && period.from > period.to);

  return (
    <li className="flex flex-col gap-2.5 rounded-[14px] bg-[#FBFBFC] p-3 ring-1 ring-[#E8E8EC]">
      <div className="flex flex-wrap items-end gap-2.5">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[9px] tracking-[1px] text-[#A6AAB2]">DESDE</span>
          <input
            type="month"
            value={period.from}
            onChange={(e) => onChange("from", e.target.value)}
            aria-label={`Mes inicial del tramo ${index + 1}`}
            className={`rounded-[12px] border bg-white px-2.5 py-2 font-mono text-[12px] text-[#1C1D22] outline-none transition-colors focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/25 ${
              inverted ? "border-[#E5484D]" : "border-[#E8E8EC]"
            }`}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[9px] tracking-[1px] text-[#A6AAB2]">HASTA</span>
          <input
            type="month"
            value={period.to}
            min={period.from || undefined}
            onChange={(e) => onChange("to", e.target.value)}
            aria-label={`Mes final del tramo ${index + 1}`}
            className={`rounded-[12px] border bg-white px-2.5 py-2 font-mono text-[12px] text-[#1C1D22] outline-none transition-colors focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/25 ${
              inverted ? "border-[#E5484D]" : "border-[#E8E8EC]"
            }`}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[9px] tracking-[1px] text-[#A6AAB2]">COBRA</span>
          <span className="relative w-[92px]">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0.00"
              value={period.percentage}
              onChange={(e) => onChange("percentage", e.target.value)}
              aria-label={`Porcentaje del tramo ${index + 1}`}
              className="w-full rounded-[12px] border border-[#E8E8EC] bg-white py-2 pl-2.5 pr-7 font-mono text-[13px] font-semibold text-[#1C1D22] outline-none transition-colors focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/25"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#A6AAB2]">
              %
            </span>
          </span>
        </label>

        <button
          type="button"
          onClick={onRemove}
          title="Quitar este tramo"
          aria-label={`Quitar el tramo ${index + 1}`}
          className="mb-[1px] grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[12px] border border-[#E8E8EC] bg-white text-[#71757E] transition-colors hover:border-[#E5484D] hover:bg-[#FDECEC] hover:text-[#E5484D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {inverted && (
        <p className="text-[10.5px] font-semibold text-[#E5484D]">
          Este tramo termina antes de empezar.
        </p>
      )}

      <button
        type="button"
        onClick={() => setShowFilters((v) => !v)}
        aria-expanded={showFilters}
        className="flex w-fit items-center gap-1.5 text-[10.5px] font-semibold text-[#71757E] transition-colors hover:text-[#1C1D22] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        {narrowed ? "Acotado a países o plataformas" : "Acotar a países o plataformas"}
      </button>

      {showFilters && (
        <div className="flex flex-col gap-2.5 border-t border-[#E8E8EC] pt-2.5">
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[1px] text-[#A6AAB2]">
              <Globe className="h-2.5 w-2.5" />
              PAÍSES DE ESTE TRAMO
            </span>
            <FilterSegment
              value={period.countriesType}
              onChange={(v) => onChange("countriesType", v)}
              labels={{ all: "Todos", except: "Excepto", only: "Solo" }}
              name={`tramo-países-${ownerKey}-${period.id}`}
            />
            {period.countriesType !== "all" && (
              <Select
                isMulti
                isLoading={isLoadingFilters}
                options={countryOptions}
                value={period.selectedCountries}
                onChange={(selected) => onChange("selectedCountries", selected ?? [])}
                styles={selectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                placeholder="Elegir países…"
                noOptionsMessage={() => "No hay países disponibles"}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[1px] text-[#A6AAB2]">
              <Radio className="h-2.5 w-2.5" />
              PLATAFORMAS DE ESTE TRAMO
            </span>
            <FilterSegment
              value={period.platformsType}
              onChange={(v) => onChange("platformsType", v)}
              labels={{ all: "Todas", except: "Excepto", only: "Solo" }}
              name={`tramo-plataformas-${ownerKey}-${period.id}`}
            />
            {period.platformsType !== "all" && (
              <Select
                isMulti
                isLoading={isLoadingFilters}
                options={platformOptions}
                value={period.selectedPlatforms}
                onChange={(selected) => onChange("selectedPlatforms", selected ?? [])}
                styles={selectStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                placeholder="Elegir plataformas…"
                noOptionsMessage={() => "No hay plataformas disponibles"}
              />
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default SplitPeriodsEditor;
