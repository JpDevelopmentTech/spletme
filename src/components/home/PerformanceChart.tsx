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
 * Gráfico de área (Streams + Revenue) con selector de período temporal.
 */
export function PerformanceChart({
  series,
  options,
  selectedTimeframe,
  onTimeframeChange,
}: PerformanceChartProps) {
  return (
    <div
      className="col-span-9 row-span-2 flex-1 rounded-xl border border-gray-200 bg-white p-6"
      data-tour="analytics-chart"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-semibold text-gray-900">Rendimiento</h2>
            <p className="text-xs text-gray-400">Streams e ingresos en el tiempo</p>
          </div>
          <div className="flex items-center rounded-lg bg-gray-100 p-0.5">
            {TIMEFRAME_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  selectedTimeframe === option.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => onTimeframeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm bg-gray-900" />
            <span className="text-[11px] text-gray-500">Streams</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm bg-green-500" />
            <span className="text-[11px] text-gray-500">Ingresos</span>
          </div>
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
