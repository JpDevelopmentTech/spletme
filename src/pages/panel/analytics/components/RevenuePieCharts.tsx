import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import type { PieChartEntry } from "../../../../types/analytics.types";

interface PieProps {
  title: string;
  subtitle: string;
  data: PieChartEntry[];
  loading: boolean;
}

const COLORS = [
  "#2563EB",
  "#F97316",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
  "#6366F1",
];

function PieSection({ title, subtitle, data, loading }: PieProps) {
  if (loading || data.length === 0) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">{title}</h2>
          <p className="mt-0.5 text-xs text-[#6B7280]">{subtitle}</p>
        </div>
        <div className="flex h-[220px] items-center justify-center text-sm text-[#9CA3AF]">
          {loading ? "Cargando..." : "Sin datos disponibles"}
        </div>
      </div>
    );
  }

  const options: ApexOptions = {
    chart: { type: "donut", background: "transparent" },
    labels: data.map((d) => d.name),
    colors: COLORS.slice(0, data.length),
    legend: {
      position: "bottom",
      fontSize: "11px",
      labels: { colors: "#6B7280" },
      markers: { size: 6 },
    },
    dataLabels: {
      enabled: true,
      formatter: (_val: number, opts: { seriesIndex: number }) =>
        `${data[opts.seriesIndex]?.percentage ?? 0}%`,
      style: { fontSize: "11px", colors: ["#fff"] },
      dropShadow: { enabled: false },
    },
    plotOptions: { pie: { donut: { size: "55%" } } },
    tooltip: {
      y: {
        formatter: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      },
    },
    stroke: { width: 2, colors: ["#fff"] },
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <div>
        <h2 className="text-sm font-semibold text-[#111827]">{title}</h2>
        <p className="mt-0.5 text-xs text-[#6B7280]">{subtitle}</p>
      </div>
      <ReactApexChart
        options={options}
        series={data.map((d) => d.value)}
        type="donut"
        height={220}
      />
    </div>
  );
}

interface Props {
  storeData: PieChartEntry[];
  countryData: PieChartEntry[];
  loading: boolean;
}

export default function RevenuePieCharts({ storeData, countryData, loading }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <PieSection
        title="Revenue by Store"
        subtitle="Top 5 plataformas — resto agrupado en 'Others'"
        data={storeData}
        loading={loading}
      />
      <PieSection
        title="Revenue by Country/Region"
        subtitle="Top 10 países por ingreso neto"
        data={countryData}
        loading={loading}
      />
    </div>
  );
}
