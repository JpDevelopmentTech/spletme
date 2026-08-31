import { CalendarRange, Globe, Radio, Plus, Trash2, ChevronDown, Infinity } from "lucide-react";
import { useState } from "react";
import Select from "react-select";
import { FilterSegment } from "@/components/ui/FilterSegment";
import { selectStyles } from "@/components/ui/selectStyles";
import {
  formatMonth,
  formatPeriodRange,
  earliestMonth,
  finalPeriodStart,
} from "@/utils/splitPeriods.utils";
import type { SelectOption, SplitPeriodFormData } from "@/types";

interface SplitPeriodsEditorProps {
  /** Identifica los inputs del colaborador dentro del modal. */
  ownerKey: string;
  periods: SplitPeriodFormData[];
  /** Porcentaje del tramo final, el que rige cuando se acaban los demás. */
  fallbackPercentage: string;
  /** Avisa del exceso sobre el 100% cuando lo hay; se pinta bajo su input. */
  fallbackWarning?: string | null;
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
  /** Edita el porcentaje del tramo final, que vive en el split, no en un tramo. */
  onFallbackChange: (value: string) => void;
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
 * un porcentaje concreto.
 *
 * El porcentaje base no es una regla de fondo que rellene cualquier hueco: es
 * UN TRAMO MÁS, el último, que arranca cuando termina el anterior y ya no
 * acaba. Se pinta como tal —fila propia y bloque en la línea de tiempo— porque
 * antes era una regla invisible que solo se entendía leyendo la letra pequeña.
 *
 * Lo que queda fuera de los tramos dibujados no se paga. Por eso la línea de
 * tiempo no es decoración: sus huecos son exactamente los meses a 0.
 */
export function SplitPeriodsEditor({
  ownerKey,
  periods,
  fallbackPercentage,
  fallbackWarning,
  countryOptions,
  platformOptions,
  isLoadingFilters,
  onAdd,
  onRemove,
  onChange,
  onFallbackChange,
}: SplitPeriodsEditorProps) {
  const complete = periods.filter((p) => p.from && p.to && p.from <= p.to);
  const first = earliestMonth(complete);
  // Desde cuándo rige el porcentaje base, ya como tramo final abierto.
  const finalStart = finalPeriodStart(complete);

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
          {/* Con un solo tramo ya hay dos bloques que leer: ese y el final. */}
          {complete.length >= 1 && (
            <PeriodsTimeline periods={complete} fallbackPercentage={fallbackPercentage} />
          )}

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

          <FinalPeriodRow
            from={finalStart}
            percentage={fallbackPercentage}
            warning={fallbackWarning}
            onChange={onFallbackChange}
          />

          <p className="rounded-[12px] bg-[#F4F5F7] px-3 py-2.5 text-[11px] leading-[1.5] text-[#71757E]">
            {first ? (
              <>
                Los meses que no cubre ningún tramo no le pagan nada, ni antes de{" "}
                <strong className="font-semibold text-[#1C1D22]">{formatMonth(first)}</strong> ni en
                los huecos que queden entre medias.
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
 * Los tramos dibujados sobre el periodo que abarcan, más la cola del tramo
 * final. Lo naranja fuerte son los tramos; lo naranja claro de la derecha, el
 * tramo final que ya no acaba; lo gris, los meses que no le pagan nada.
 */
function PeriodsTimeline({
  periods,
  fallbackPercentage,
}: {
  periods: SplitPeriodFormData[];
  fallbackPercentage: string;
}) {
  const bounds = periods.reduce<{ start: number; end: number } | null>((acc, period) => {
    const from = monthIndex(period.from);
    const to = monthIndex(period.to);
    if (from === null || to === null) return acc;
    if (!acc) return { start: from, end: to };
    return { start: Math.min(acc.start, from), end: Math.max(acc.end, to) };
  }, null);

  if (!bounds) return null;

  const covered = bounds.end - bounds.start + 1;
  // El tramo final no tiene fin, así que no hay ancho que le corresponda: se le
  // reserva un trozo proporcional para poder enseñarlo sin fingir una fecha.
  const tail = Math.max(2, Math.round(covered * 0.35));
  const total = covered + tail;
  const finalFrom = finalPeriodStart(periods) ?? "";

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
        <span
          title={`Desde ${formatMonth(finalFrom)}, para siempre · ${fmtPct(fallbackPercentage)}%`}
          className="absolute top-0 h-full rounded-r-[6px] bg-[#FFC7A3]"
          style={{ left: `${(covered / total) * 100}%`, width: `${(tail / total) * 100}%` }}
        />
      </span>
      <span className="flex justify-between font-mono text-[9px] text-[#A6AAB2]">
        <span>{formatMonth(periods[0].from)}</span>
        <span>lo gris no le paga nada</span>
        <span>{formatMonth(finalFrom)} → siempre</span>
      </span>
    </div>
  );
}

/**
 * El tramo final: el que empieza cuando acaba el último y ya no termina.
 *
 * Se lee como los demás —mismas columnas DESDE / HASTA / COBRA— porque es un
 * tramo más, pero sus fechas no se editan: el inicio lo marca el tramo anterior
 * y el fin no existe. Por eso la fila no se cierra por la derecha, se desvanece.
 *
 * Su porcentaje sí se edita aquí, y es el mismo dato que el split guarda como
 * `percentage`: cuando hay tramos, este es el único sitio donde se escribe.
 */
function FinalPeriodRow({
  from,
  percentage,
  warning,
  onChange,
}: {
  /** Mes en que arranca, o null si los tramos aún no tienen fechas. */
  from: string | null;
  percentage: string;
  warning?: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-l-[14px] border border-r-0 border-dashed border-[#FFD0AF] bg-gradient-to-r from-[#FFF7F2] via-[#FFF7F2] to-transparent py-3 pl-3 pr-10">
      <div className="flex flex-wrap items-end gap-2.5">
        <span className="flex flex-col gap-1">
          <span className="font-mono text-[9px] tracking-[1px] text-[#A6AAB2]">DESDE</span>
          <span className="flex h-[37px] items-center rounded-[12px] bg-white px-2.5 font-mono text-[12px] font-semibold text-[#1C1D22] ring-1 ring-[#F2DFD2]">
            {from ? formatMonth(from) : "al acabar el último"}
          </span>
        </span>

        <span className="flex flex-col gap-1">
          <span className="font-mono text-[9px] tracking-[1px] text-[#A6AAB2]">HASTA</span>
          <span
            title="Este tramo no tiene fecha de fin"
            className="flex h-[37px] items-center gap-1.5 rounded-[12px] bg-white px-2.5 font-mono text-[12px] font-semibold text-[#FF5C00] ring-1 ring-[#F2DFD2]"
          >
            <Infinity className="h-3.5 w-3.5" aria-hidden="true" />
            Por siempre
          </span>
        </span>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[9px] tracking-[1px] text-[#A6AAB2]">COBRA *</span>
          <span className="relative w-[92px]">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0.00"
              value={percentage}
              onChange={(e) => onChange(e.target.value)}
              aria-label={
                from
                  ? `Porcentaje del tramo final, desde ${formatMonth(from)}`
                  : "Porcentaje del tramo final"
              }
              className="w-full rounded-[12px] border border-[#E8E8EC] bg-white py-2 pl-2.5 pr-7 font-mono text-[13px] font-semibold text-[#1C1D22] outline-none transition-colors focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/25"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#A6AAB2]">
              %
            </span>
          </span>
        </label>
      </div>

      <p className="max-w-[380px] text-[10.5px] leading-[1.45] text-[#71757E]">
        {warning ? (
          <span className="font-semibold text-[#E5484D]">{warning}</span>
        ) : (
          <>Cuando se acaben los tramos cobra esto, sin fecha de fin. Puede ser 0.</>
        )}
      </p>
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
