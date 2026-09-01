import {
  CalendarRange,
  Globe,
  Radio,
  Plus,
  Trash2,
  SlidersHorizontal,
  Rocket,
  Infinity as InfinityIcon,
} from "lucide-react";
import { useState } from "react";
import Select from "react-select";
import { FilterSegment } from "@/components/ui/FilterSegment";
import { MonthField } from "@/components/ui/MonthField";
import { selectStyles } from "@/components/ui/selectStyles";
import { formatMonth, finalPeriodStart } from "@/utils/splitPeriods.utils";
import type { SelectOption, SplitPeriodFormData } from "@/types";

interface SplitPeriodsEditorProps {
  /** Identifica los inputs del colaborador dentro del modal. */
  ownerKey: string;
  periods: SplitPeriodFormData[];
  /** Porcentaje del tramo final, el que rige cuando se acaban los demás. */
  fallbackPercentage: string;
  /** Avisa del exceso sobre el 100% cuando lo hay; se pinta bajo su input. */
  fallbackWarning?: string | null;
  /** Mes de lanzamiento de la canción, o null si no se conoce. */
  releaseMonth?: string | null;
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

const isZero = (value: string) => (parseFloat(value) || 0) === 0;

/**
 * Tramos de vigencia de un split: la línea de tiempo completa de lo que cobra
 * un colaborador, desde que la canción sale hasta siempre.
 *
 * No es una lista de excepciones sobre un porcentaje de fondo: cada mes desde el
 * lanzamiento pertenece a un tramo, y siempre hay un último tramo que no acaba
 * nunca. Un colaborador nuevo empieza justo con ese: "desde su lanzamiento,
 * para siempre".
 *
 * Por eso los tramos se dibujan **colgando de un raíl continuo** y no como
 * tarjetas sueltas: la línea que los une es la afirmación de que no hay meses
 * sin regla, y se rompería sola si algún día la hubiera. Antes eran cajas
 * apiladas idénticas y no se distinguía una secuencia de tres formularios.
 */
export function SplitPeriodsEditor({
  ownerKey,
  periods,
  fallbackPercentage,
  fallbackWarning,
  releaseMonth = null,
  countryOptions,
  platformOptions,
  isLoadingFilters,
  onAdd,
  onRemove,
  onChange,
  onFallbackChange,
}: SplitPeriodsEditorProps) {
  const complete = periods.filter((p) => p.from && p.to && p.from <= p.to);
  // Desde cuándo rige el tramo final. Sin tramos arranca en el lanzamiento:
  // es el único que hay, y cubre la canción entera.
  const finalStart = finalPeriodStart(complete);

  // Años elegibles: desde el lanzamiento (o el tramo más antiguo) y una década
  // por delante, que es todo lo que se puede pactar sin inventarse el futuro.
  const thisYear = new Date().getFullYear();
  const earliest = [releaseMonth, ...periods.map((p) => p.from)]
    .filter(Boolean)
    .map((m) => Number((m as string).slice(0, 4)))
    .filter((y) => y > 1900);
  const minYear = Math.min(thisYear - 1, ...(earliest.length ? earliest : [thisYear]));
  const maxYear = Math.max(thisYear + 10, ...(earliest.length ? earliest : [thisYear]));

  return (
    <div className="flex flex-col gap-3.5 rounded-[16px] bg-[#FBFBFC] p-3.5 ring-1 ring-[#E8E8EC]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
          <CalendarRange className="h-3 w-3" />
          CUÁNDO COBRA Y CUÁNTO
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

      {complete.length >= 1 && (
        <PeriodsTimeline periods={complete} fallbackPercentage={fallbackPercentage} />
      )}

      <ol className="flex flex-col">
        {periods.map((period, index) => (
          <PeriodRow
            key={period.id}
            period={period}
            index={index}
            ownerKey={ownerKey}
            minYear={minYear}
            maxYear={maxYear}
            countryOptions={countryOptions}
            platformOptions={platformOptions}
            isLoadingFilters={isLoadingFilters}
            onRemove={() => onRemove(period.id)}
            onChange={(field, value) => onChange(period.id, field, value)}
          />
        ))}

        <FinalPeriodRow
          from={finalStart}
          percentage={fallbackPercentage}
          warning={fallbackWarning}
          onChange={onFallbackChange}
        />
      </ol>

      <p className="text-[10.5px] leading-[1.5] text-[#71757E]">
        {complete.length === 0
          ? "Añade un tramo si su parte cambia en unas fechas concretas."
          : "Los meses que queden sueltos entre dos tramos se rellenan solos al 0%. Puedes cambiarlos."}
      </p>
    </div>
  );
}

/**
 * La línea de tiempo completa: no quedan huecos que dibujar, así que los colores
 * ya no distinguen "cubierto" de "sin cubrir" sino cuánto se cobra en cada
 * tramo. Naranja es cobrar; gris es un tramo al 0%, que sigue siendo un tramo
 * escrito y no un olvido. La cola rayada de la derecha es el tramo final, que no
 * termina: se desvanece en lugar de cerrarse.
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
  const tail = Math.max(2, Math.round(covered * 0.3));
  const total = covered + tail;

  return (
    <span className="relative flex h-2 w-full overflow-hidden rounded-full bg-[#EDEEF1]">
      {periods.map((period) => {
        const from = monthIndex(period.from);
        const to = monthIndex(period.to);
        if (from === null || to === null) return null;
        return (
          <span
            key={period.id}
            title={`${formatMonth(period.from)} → ${formatMonth(period.to)} · ${fmtPct(period.percentage)}%`}
            className={`absolute top-0 h-full ${
              isZero(period.percentage) ? "bg-[#DFE0E4]" : "bg-[#FF5C00]"
            }`}
            style={{
              left: `${((from - bounds.start) / total) * 100}%`,
              width: `${((to - from + 1) / total) * 100}%`,
            }}
          />
        );
      })}
      <span
        title={`El tramo final, sin fecha de fin · ${fmtPct(fallbackPercentage)}%`}
        className="absolute top-0 h-full"
        style={{
          left: `${(covered / total) * 100}%`,
          width: `${(tail / total) * 100}%`,
          backgroundImage: `repeating-linear-gradient(115deg, ${
            isZero(fallbackPercentage) ? "#DFE0E4" : "#FF5C00"
          } 0 3px, transparent 3px 6px)`,
        }}
      />
    </span>
  );
}

/**
 * El nodo del raíl. Su forma dice qué clase de tramo cuelga de él sin gastar
 * una palabra: relleno cuando se cobra, hueco cuando es un 0%, y con el anillo
 * abierto en el que no termina nunca.
 */
function RailNode({
  variant,
  icon,
}: {
  variant: "paid" | "zero" | "final";
  icon?: React.ReactNode;
}) {
  if (icon) {
    return (
      <span className="relative z-10 grid h-[18px] w-[18px] place-items-center rounded-full bg-[#FFEADD] text-[#FF5C00]">
        {icon}
      </span>
    );
  }

  return (
    <span
      className={`relative z-10 grid h-[18px] w-[18px] place-items-center rounded-full bg-[#FBFBFC] ${
        variant === "final" ? "ring-[1.5px] ring-dashed ring-[#FFC7A3]" : ""
      }`}
    >
      <span
        className={`h-[9px] w-[9px] rounded-full ${
          variant === "paid"
            ? "bg-[#FF5C00]"
            : variant === "final"
              ? "bg-[#FFC7A3]"
              : "border-[1.5px] border-[#C9CBD1] bg-white"
        }`}
      />
    </span>
  );
}

/** Fila del raíl: el nodo, la línea que baja al siguiente, y el contenido. */
function RailItem({
  node,
  last = false,
  children,
}: {
  node: React.ReactNode;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="relative grid grid-cols-[18px_1fr] gap-x-3 pb-3 last:pb-0">
      {!last && (
        <span
          aria-hidden="true"
          className="absolute left-[8px] top-[18px] h-[calc(100%-18px)] w-[2px] bg-[#EDEEF1]"
        />
      )}
      {node}
      <div className="min-w-0 pt-[1px]">{children}</div>
    </li>
  );
}

/** El input de porcentaje, idéntico en todas las filas. */
function PercentInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <span className="relative w-[72px] shrink-0">
      <input
        type="number"
        min="0"
        max="100"
        step="0.01"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full rounded-[10px] border border-[#E8E8EC] bg-white py-[7px] pl-2.5 pr-6 text-right font-mono text-[12.5px] font-semibold text-[#1C1D22] outline-none transition-colors focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20"
      />
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10.5px] text-[#A6AAB2]">
        %
      </span>
    </span>
  );
}

/**
 * La rejilla que comparten las tres clases de tramo: el que se escribe, el que
 * se genera para tapar un hueco y el final.
 *
 * Las tres dicen lo mismo —desde cuándo, hasta cuándo y cuánto cobra— así que
 * lo dicen en el mismo sitio y con las mismas palabras. Antes cada una tenía su
 * propia disposición y había que releer cada fila para saber qué miraba.
 */
function PeriodGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[46px_minmax(0,1fr)] items-center gap-x-2 gap-y-1.5">
      {children}
    </div>
  );
}

/** Etiqueta de la columna izquierda de la rejilla. */
function GridLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-medium text-[#71757E]">{children}</span>;
}

/** Valor de solo lectura: las fechas que no se editan, en el hueco y el final. */
function GridValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[12px] font-semibold text-[#1C1D22]">{children}</span>
  );
}

/**
 * El tramo final: el que empieza cuando acaba el último y ya no termina.
 *
 * Está siempre, incluso sin ningún otro tramo: entonces es el único que hay y
 * arranca en el lanzamiento de la canción. Por eso es lo primero que ve quien
 * reparte un split nuevo —"desde su lanzamiento, para siempre"— y no una regla
 * escondida que solo aparece cuando ya hay fechas de por medio.
 *
 * Sus fechas no se editan: el inicio lo marca el tramo anterior y el fin no
 * existe. Su porcentaje sí, y es el mismo dato que el split guarda como
 * `percentage`.
 */
function FinalPeriodRow({
  from,
  percentage,
  warning,
  onChange,
}: {
  /** Mes en que arranca, o null si todavía es el único tramo que hay. */
  from: string | null;
  percentage: string;
  warning?: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <RailItem last node={<RailNode variant="final" />}>
      <div className="rounded-[12px] bg-[#FFF7F2] p-2.5 ring-1 ring-[#FFE2CE]">
        <PeriodGrid>
          <GridLabel>Desde</GridLabel>
          <GridValue>{from ? formatMonth(from) : "su lanzamiento"}</GridValue>

          <GridLabel>Hasta</GridLabel>
          <span className="flex items-center gap-1.5 font-mono text-[12px] font-semibold text-[#FF5C00]">
            <InfinityIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            siempre
          </span>

          <GridLabel>Cobra</GridLabel>
          <PercentInput
            value={percentage}
            onChange={onChange}
            label={
              from
                ? `Porcentaje desde ${formatMonth(from)}, sin fecha de fin`
                : "Porcentaje desde el lanzamiento, sin fecha de fin"
            }
          />
        </PeriodGrid>

        {warning && (
          <p className="mt-2 text-[10.5px] font-semibold leading-[1.4] text-[#E5484D]">
            {warning}
          </p>
        )}
      </div>
    </RailItem>
  );
}

function PeriodRow({
  period,
  index,
  ownerKey,
  minYear,
  maxYear,
  countryOptions,
  platformOptions,
  isLoadingFilters,
  onRemove,
  onChange,
}: {
  period: SplitPeriodFormData;
  index: number;
  ownerKey: string;
  minYear: number;
  maxYear: number;
  countryOptions: SelectOption[];
  platformOptions: SelectOption[];
  isLoadingFilters: boolean;
  onRemove: () => void;
  onChange: (field: keyof SplitPeriodFormData, value: string | readonly SelectOption[]) => void;
}) {
  const narrowed = period.countriesType !== "all" || period.platformsType !== "all";
  const [showFilters, setShowFilters] = useState(narrowed);
  const inverted = Boolean(period.from && period.to && period.from > period.to);
  // Las fechas de un tramo generado las fijan sus vecinos: editarlas aquí sería
  // moverlo a un sitio donde ya hay otro tramo, o abrir el hueco otra vez.
  const generated = Boolean(period.autoFilled);
  const zero = isZero(period.percentage);

  return (
    <RailItem
      node={
        period.openStart ? (
          <RailNode variant="paid" icon={<Rocket className="h-2.5 w-2.5" />} />
        ) : (
          <RailNode variant={zero ? "zero" : "paid"} />
        )
      }
    >
      <div
        className={`rounded-[12px] p-2.5 ring-1 ${
          generated ? "bg-[#F4F5F7] ring-[#E8E8EC]" : "bg-white ring-[#E3E4E8]"
        }`}
      >
        <PeriodGrid>
          <GridLabel>Desde</GridLabel>
          {generated ? (
            <GridValue>
              {period.openStart ? "su lanzamiento" : formatMonth(period.from)}
            </GridValue>
          ) : (
            <MonthField
              value={period.from}
              onChange={(value) => onChange("from", value)}
              minYear={minYear}
              maxYear={maxYear}
              label={`inicio del tramo ${index + 1}`}
              invalid={inverted}
            />
          )}

          <GridLabel>Hasta</GridLabel>
          {generated ? (
            <GridValue>{formatMonth(period.to)}</GridValue>
          ) : (
            <MonthField
              value={period.to}
              onChange={(value) => onChange("to", value)}
              minYear={minYear}
              maxYear={maxYear}
              label={`fin del tramo ${index + 1}`}
              invalid={inverted}
            />
          )}

          <GridLabel>Cobra</GridLabel>
          <span className="flex items-center justify-between gap-2">
            <PercentInput
              value={period.percentage}
              onChange={(value) => onChange("percentage", value)}
              label={`Porcentaje del tramo ${index + 1}`}
            />

            <span className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
                title={
                  narrowed ? "Acotado a países o plataformas" : "Acotar a países o plataformas"
                }
                className={`grid h-[30px] w-[30px] place-items-center rounded-[10px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] ${
                  narrowed
                    ? "bg-[#FFEADD] text-[#FF5C00]"
                    : "text-[#A6AAB2] hover:bg-[#F4F5F7] hover:text-[#71757E]"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                title={
                  generated
                    ? "Quitar: sus meses se los queda el tramo de al lado"
                    : "Quitar: sus meses pasan a no pagar nada"
                }
                aria-label={
                  generated ? `Quitar el hueco ${index + 1}` : `Quitar el tramo ${index + 1}`
                }
                className="grid h-[30px] w-[30px] place-items-center rounded-[10px] text-[#A6AAB2] transition-colors hover:bg-[#FDECEC] hover:text-[#E5484D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          </span>
        </PeriodGrid>

        {generated && (
          <p className="mt-2 text-[10.5px] leading-[1.35] text-[#71757E]">
            Se creó solo para que no queden meses sin regla
          </p>
        )}

        {inverted && (
          <p className="mt-2 text-[10.5px] font-semibold text-[#E5484D]">
            Este tramo termina antes de empezar.
          </p>
        )}

        {showFilters && (
          <div className="mt-2 flex flex-col gap-2.5 border-t border-[#EDEEF1] pt-2.5">
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
      </div>
    </RailItem>
  );
}

export default SplitPeriodsEditor;
