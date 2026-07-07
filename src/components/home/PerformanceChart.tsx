import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface PerformanceChartProps {
  series: ApexAxisChartSeries;
  options: ApexOptions;
  selectedTimeframe: string;
  onTimeframeChange: (value: string) => void;
}

const TIMEFRAME_OPTIONS = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

/**
 * Gráfico de área (Streams + Ingresos) con selector de período temporal.
 */
export function PerformanceChart({
  series,
  options,
  selectedTimeframe,
  onTimeframeChange,
}: PerformanceChartProps) {
  return (
    <div className="rounded-[36px] border border-white/60 bg-white/55 p-7 shadow-[0_16px_40px_-16px_rgba(255,92,0,0.15)] backdrop-blur-2xl" data-tour="analytics-chart">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-semibold text-[#1C1D22]">Rendimiento</h2>
            <p className="text-[12.5px] text-[#71757E]">Streams e ingresos en el tiempo</p>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/60 bg-white/60 p-1 backdrop-blur-md">
            {TIMEFRAME_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
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
          <div className="flex items-center gap-[7px]">
            <div className="h-[9px] w-[9px] rounded-[3px] bg-[#1C1D22]" />
            <span className="text-[11.5px] text-[#71757E]">Streams</span>
          </div>
          <div className="flex items-center gap-[7px]">
            <div className="h-[9px] w-[9px] rounded-[3px] bg-[#FF5C00]" />
            <span className="text-[11.5px] text-[#71757E]">Ingresos</span>
          </div>
        </div>

        <div className="h-[280px]">
          <ReactApexChart options={options} series={series} type="area" height="100%" width="100%" />
        </div>
      </div>
    </div>
  );
}
