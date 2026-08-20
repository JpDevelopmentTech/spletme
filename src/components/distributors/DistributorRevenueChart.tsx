import { useMemo, useState } from "react";
import { CalendarOff } from "lucide-react";
import { formatStreams, formatCompactCurrency, formatCurrency } from "@/utils/format.utils";
import { buildShortPeriodLabel, MONTH_SHORT_NAMES } from "@/utils/period.utils";
import { quarterColor } from "@/utils/coverage.utils";
import type { DistributorDashboard } from "@/types/distributor.types";

type Metric = "net" | "streams" | "songs";

const METRICS: { value: Metric; label: string }[] = [
  { value: "net", label: "Neto" },
  { value: "streams", label: "Streams" },
  { value: "songs", label: "Canciones" },
];

type Period = DistributorDashboard["revenueByPeriod"][number];

interface BarSlot {
  kind: "bar";
  period: Period;
  value: number;
  color: string;
}

interface GapSlot {
  kind: "gap";
  label: string;
  months: number;
}

type Slot = BarSlot | GapSlot;

interface DistributorRevenueChartProps {
  periods: Period[];
}

const CHART_HEIGHT = 230;

/**
 * Ingresos por periodo cargado.
 *
 * La diferencia con un gráfico de barras normal está en los huecos: si entre
 * marzo y julio no se subió nada, el gráfico no pega las dos barras fingiendo
 * continuidad, sino que deja el vacío marcado. Ese hueco es la información
 * accionable de esta pantalla.
 */
export function DistributorRevenueChart({ periods }: DistributorRevenueChartProps) {
  const [metric, setMetric] = useState<Metric>("net");

  const slots = useMemo(() => buildSlots(periods, metric), [periods, metric]);
  const bars = slots.filter((slot): slot is BarSlot => slot.kind === "bar");
  const max = Math.max(1, ...bars.map((slot) => slot.value));
  const format = (value: number) => formatValue(value, metric);

  return (
    <div className="flex flex-col gap-[18px] rounded-[26px] border border-[#E8E8EC] bg-white p-[26px] shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-lg font-semibold text-[#1C1D22]">
            Ingresos por periodo
          </h2>
          <p className="text-[12.5px] text-[#71757E]">
            Cada reporte cargado, en orden cronológico
          </p>
        </div>
        <div className="flex items-center gap-0.5 rounded-full bg-[#F4F5F7] p-[3px]">
          {METRICS.map((option) => (
            <button
              key={option.value}
              onClick={() => setMetric(option.value)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
                metric === option.value
                  ? "bg-[#FF5C00] text-white"
                  : "text-[#71757E] hover:text-[#1C1D22]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {bars.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-[12.5px] text-[#A6AAB2]">
          Sin cargas registradas todavía
        </div>
      ) : (
        <div className="flex gap-3">
          {/* Eje */}
          <div
            className="flex w-11 flex-shrink-0 flex-col items-end justify-between"
            style={{ height: CHART_HEIGHT }}
            aria-hidden="true"
          >
            {[1, 0.75, 0.5, 0.25, 0].map((step) => (
              <span key={step} className="font-mono text-[9.5px] text-[#A6AAB2]">
                {step === 0 ? "0" : formatAxis(max * step, metric)}
              </span>
            ))}
          </div>

          {/* Área */}
          <div className="min-w-0 flex-1">
            <div className="relative" style={{ height: CHART_HEIGHT }}>
              {[0, 0.25, 0.5, 0.75, 1].map((step) => (
                <span
                  key={step}
                  className="absolute left-0 right-0 h-px bg-[#E8E8EC]"
                  style={{ top: `${step * 100}%` }}
                  aria-hidden="true"
                />
              ))}

              <div className="absolute inset-0 flex items-end gap-2 overflow-x-auto">
                {slots.map((slot, index) =>
                  slot.kind === "gap" ? (
                    <div
                      key={`gap-${index}`}
                      title={`${slot.label}: sin reporte cargado`}
                      className="flex h-full min-w-[72px] flex-1 flex-col items-center justify-center gap-1.5 rounded-[10px] bg-[#FF5C00]/[0.06]"
                    >
                      <CalendarOff className="h-4 w-4 text-[#EA580C]" />
                      <span className="font-mono text-[9.5px] font-semibold tracking-[1px] text-[#EA580C]">
                        {slot.label.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#A6AAB2]">sin datos</span>
                    </div>
                  ) : (
                    <div
                      key={`bar-${index}`}
                      className="flex h-full min-w-[52px] flex-1 flex-col items-center justify-end gap-2"
                      title={`${slot.period.periodLabel}: ${format(slot.value)}`}
                    >
                      <span
                        className="font-mono text-[10.5px] font-semibold"
                        style={{ color: slot.color }}
                      >
                        {formatAxis(slot.value, metric)}
                      </span>
                      <span
                        className="w-full max-w-[56px] rounded-t-[9px]"
                        style={{
                          height: Math.max(4, (slot.value / max) * (CHART_HEIGHT - 26)),
                          backgroundColor: slot.color,
                        }}
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Eje de periodos */}
            <div className="mt-2 flex gap-2">
              {slots.map((slot, index) => (
                <span
                  key={`label-${index}`}
                  className={`flex-1 truncate text-center font-mono text-[10.5px] ${
                    slot.kind === "gap"
                      ? "min-w-[72px] font-semibold text-[#EA580C]"
                      : "min-w-[52px] font-medium text-[#71757E]"
                  }`}
                >
                  {slot.kind === "gap"
                    ? `${slot.months} ${slot.months === 1 ? "mes" : "meses"}`
                    : buildShortPeriodLabel(
                        slot.period.startMonth,
                        slot.period.endMonth,
                        slot.period.year,
                      )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Ordena los periodos y mete un hueco allí donde la cronología se rompe. Los
 * meses se comparan en una escala absoluta (`año * 12 + mes`) para que el salto
 * de diciembre a enero se trate igual que cualquier otro.
 */
function buildSlots(periods: Period[], metric: Metric): Slot[] {
  const sorted = [...periods]
    .filter((period) => period.startMonth && period.endMonth)
    .sort((a, b) => absolute(a.year, a.startMonth!) - absolute(b.year, b.startMonth!));

  const slots: Slot[] = [];

  sorted.forEach((period, index) => {
    const previous = sorted[index - 1];
    if (previous) {
      const from = absolute(previous.year, previous.endMonth!) + 1;
      const to = absolute(period.year, period.startMonth!) - 1;
      if (to >= from) {
        slots.push({
          kind: "gap",
          label: describeGap(from, to),
          months: to - from + 1,
        });
      }
    }
    slots.push({
      kind: "bar",
      period,
      value: pickValue(period, metric),
      color: quarterColor(period.startMonth),
    });
  });

  return slots;
}

const absolute = (year: number, month: number) => year * 12 + month;

function describeGap(from: number, to: number): string {
  const fromMonth = ((from - 1) % 12) + 1;
  const toMonth = ((to - 1) % 12) + 1;
  const fromLabel = MONTH_SHORT_NAMES[fromMonth - 1];
  if (from === to) return fromLabel;
  return `${fromLabel}–${MONTH_SHORT_NAMES[toMonth - 1]}`;
}

function pickValue(period: Period, metric: Metric): number {
  if (metric === "streams") return period.totalStreams ?? 0;
  if (metric === "songs") return period.songsCount ?? 0;
  return period.totalNetIncome ?? 0;
}

function formatValue(value: number, metric: Metric): string {
  if (metric === "streams") return `${formatStreams(value)} streams`;
  if (metric === "songs") return `${value.toLocaleString()} canciones`;
  return formatCurrency(value);
}

function formatAxis(value: number, metric: Metric): string {
  if (metric === "streams") return formatStreams(value);
  if (metric === "songs") return Math.round(value).toLocaleString();
  return formatCompactCurrency(value);
}
