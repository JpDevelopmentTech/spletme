import ReactApexChart from "react-apexcharts";
import Title from "../../../../components/title/title";
import { ApexOptions } from "apexcharts";
import useMetricPayments from "../../../../hooks/useMetricPayments";
import { useEffect, useState } from "react";

interface BehaviorProps {
  songId?: string;
  compact?: boolean;
}

export default function Behavior({ songId, compact = false }: BehaviorProps) {
  const [dateType, setDateType] = useState<"day" | "month" | "year">("month");
  const { metricsData} = useMetricPayments(songId, dateType);
  const [series, setSeries] = useState<
    Array<{ name: string; data: Array<{ x: string; y: string }> }>
  >([]);

  const transformDataToSeries = (
    data: Array<{
      name: string;
      totalNetIncome: number;
      totalStreams?: number;
    }>,
  ) => {
    if (!data || data.length === 0) return [];

    const hasStreams = data.some((item) => (item.totalStreams ?? 0) > 0);

    const series: Array<{
      name: string;
      data: Array<{ x: string; y: string }>;
    }> = [
      {
        name: "Ingresos Netos",
        data: data.map((item) => ({
          x: item.name.substring(0, 10),
          y: item.totalNetIncome.toFixed(2),
        })),
      },
    ];

    if (hasStreams) {
      series.push({
        name: "Streams",
        data: data.map((item) => ({
          x: item.name.substring(0, 10),
          y: String(item.totalStreams ?? 0),
        })),
      });
    }

    return series;
  };

  useEffect(() => {
    if (metricsData && metricsData.length > 0) {
      const transformedSeries = transformDataToSeries(metricsData);
      setSeries(transformedSeries);
    }
  }, [metricsData]);

  const hasStreams = metricsData.some((item) => (item.totalStreams ?? 0) > 0);

  const options: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#F97316", "#3B82F6"],
    dataLabels: { enabled: false },
    markers: { size: 0 },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [20, 100],
      },
    },
    xaxis: {
      categories: metricsData.map((item) => item.name.substring(0, 10)),
      labels: { style: { colors: "#9CA3AF", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: hasStreams
      ? [
          {
            seriesName: "Ingresos Netos",
            labels: {
              formatter: (val: number) => `$${val.toFixed(0)}`,
              style: { colors: "#F97316", fontSize: "11px" },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          {
            seriesName: "Streams",
            opposite: true,
            labels: {
              formatter: (val: number) => val.toLocaleString(),
              style: { colors: "#3B82F6", fontSize: "11px" },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
        ]
      : {
          labels: {
            formatter: (val: number) => `$${val.toFixed(0)}`,
            style: { colors: "#9CA3AF", fontSize: "11px" },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
    tooltip: {
      shared: true,
      y: [
        { formatter: (val: number) => `$${val.toFixed(2)}` },
        { formatter: (val: number) => val.toLocaleString() },
      ],
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      markers: { size: 8 },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
    },
  };

  const containerClass = compact
    ? "bg-[#F4F5F7] border border-gray-200 rounded-xl p-6 h-full"
    : "p-6 rounded-2xl shadow-lg hover:scale-[1.01] duration-200 relative";

  const chartHeight = compact ? 250 : 350;
  const placeholderHeightClass = compact ? "h-[250px]" : "h-64";

  // Si no hay songId, mostrar mensaje
  if (!songId) {
    return (
      <div id="behavior" className={containerClass}>
        <div className="flex items-center justify-between">
          <Title
            title="Comportamiento de Pagos"
            subtitle={`Métricas de pagos por ${dateType === "day" ? "día" : dateType === "month" ? "mes" : "año"}`}
          />
        </div>
        <div className={`flex items-center justify-center ${placeholderHeightClass} text-gray-500`}>
          Selecciona una canción para ver las métricas
        </div>
      </div>
    );
  }

  return (
    <div id="behavior" className={containerClass}>
      <div className="flex items-center justify-between">
        <Title
          title="Comportamiento de Pagos"
          subtitle={`Métricas de pagos por ${dateType === "day" ? "día" : dateType === "month" ? "mes" : "año"}`}
        />
        <div className="flex items-center space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
          <button
            onClick={() => setDateType("month")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              dateType === "month"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setDateType("year")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              dateType === "year"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Año
          </button>
        </div>
      </div>
      <div>
     
          <ReactApexChart type="area" options={options} series={series} height={chartHeight} />
     
      </div>
    </div>
  );
}
