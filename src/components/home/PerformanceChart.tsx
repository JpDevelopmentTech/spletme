import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { formatStreams, formatCurrency } from "@/utils/format.utils";

interface PerformanceChartProps {
  series: ApexAxisChartSeries;
  options: ApexOptions;
  selectedTimeframe: string;
  onTimeframeChange: (value: string) => void;
  totalStreams?: number;
  totalNetIncome?: number;
}

const TIMEFRAME_OPTIONS = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

/**
 * Gráfico de área (Streams + Ingresos) con selector de período temporal.
 * La leyenda lleva el total de cada serie para no tener que leerlo del eje.
 */
export function PerformanceChart({
  series,
  options,
  selectedTimeframe,
  onTimeframeChange,
  totalStreams,
  totalNetIncome,
}: PerformanceChartProps) {
  return (
    <div
      className="rounded-[26px] border border-[#E8E8EC] bg-white p-[26px] shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]"
      data-tour="analytics-chart"
    >
      <div className="flex flex-col gap-[18px]">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-display text-lg font-semibold text-[#1C1D22]">Rendimiento</h2>
            <p className="text-[12.5px] text-[#71757E]">Streams e ingresos en el tiempo</p>
          </div>
          <div className="flex items-center gap-0.5 rounded-full bg-[#F4F5F7] p-[3px]">
            {TIMEFRAME_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
                  selectedTimeframe === option.value
                    ? "bg-[#FF5C00] text-white"
                    : "text-[#71757E] hover:text-[#1C1D22]"
                }`}
                onClick={() => onTimeframeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-[18px]">
          <LegendItem
            color="#1C1D22"
            label="Streams"
            total={totalStreams !== undefined ? formatStreams(totalStreams) : undefined}
          />
          <LegendItem
            color="#FF5C00"
            label="Ingresos"
            total={totalNetIncome !== undefined ? formatCurrency(totalNetIncome) : undefined}
          />
        </div>

        <div className="h-[280px]">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}

/** Serie del gráfico con su color, nombre y total acumulado. */
function LegendItem({ color, label, total }: { color: string; label: string; total?: string }) {
  return (
    <div className="flex items-center gap-[7px]">
      <span className="h-[9px] w-[9px] rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-[11.5px] text-[#71757E]">{label}</span>
      {total && (
        <span className="font-mono text-[11.5px] font-semibold" style={{ color }}>
          {total}
        </span>
      )}
    </div>
  );
}
