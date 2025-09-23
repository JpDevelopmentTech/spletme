import ReactApexChart from "react-apexcharts";
import Title from "../../../../components/title/title";
import { ApexOptions } from "apexcharts";
import useMetricPayments from "../../../../hooks/useMetricPayments";
import { useEffect, useState } from "react";
import Loading from "../../../../components/loading/loading";

interface BehaviorProps {
  songId?: string;
}

export default function Behavior({ songId }: BehaviorProps) {
  const [dateType, setDateType] = useState<'day' | 'month' | 'year'>('month');
  const { metricsData, loading, error } = useMetricPayments(songId, dateType);
  const [series, setSeries] = useState<Array<{name: string; data: Array<{x: string; y: string}>}>>([]);

  // Función para transformar los datos de la API al formato de ApexCharts
  const transformDataToSeries = (data: Array<{name: string; totalNetIncome: number}>) => {
    if (!data || data.length === 0) return [];

    // Crear una serie con los datos de ingresos netos
    const series = [{
      name: "Ingresos Netos",
      data: data.map(item => ({
        x: item.name.substring(0, 10), // Limitar el nombre para mejor visualización
        y: item.totalNetIncome.toFixed(2)
      }))
    }];

    return series;
  };

  useEffect(() => {
    if (metricsData && metricsData.length > 0) {
      const transformedSeries = transformDataToSeries(metricsData);
      setSeries(transformedSeries);
    }
  }, [metricsData]);

  const options: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: 100,
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#8e8da4",
        },
        offsetX: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
          //xaxis dinámico basado en los datos
      xaxis: {
        categories: metricsData.map(item => item.name.substring(0, 10)),
      },
    tooltip: {
      shared: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
  };

  // Si no hay songId, mostrar mensaje
  if (!songId) {
    return (
      <div
        id="behavior"
        className="col-span-12 row-span-2 p-6 rounded-2xl shadow-lg hover:scale-[1.01] duration-200 relative"
      >
        <div className="flex justify-between items-center">
                  <Title
          title="Comportamiento de Pagos"
          subtitle={`Métricas de pagos por ${dateType === 'day' ? 'día' : dateType === 'month' ? 'mes' : 'año'}`}
        />
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Selecciona una canción para ver las métricas
        </div>
      </div>
    );
  }

  return (
    <div
      id="behavior"
      className="col-span-12 row-span-2 p-6 rounded-2xl shadow-lg hover:scale-[1.01] duration-200 relative"
    >
      <div className="flex justify-between items-center">
        <Title
          title="Comportamiento de Pagos"
          subtitle={`Métricas de pagos por ${dateType === 'day' ? 'día' : dateType === 'month' ? 'mes' : 'año'}`}
        />
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setDateType('month')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              dateType === 'month'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => setDateType('year')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              dateType === 'year'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Año
          </button>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loading />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            {error}
          </div>
        ) : series.length > 0 ? (
          <ReactApexChart
            type="area"
            options={options}
            series={series}
            height={350}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No hay datos disponibles para mostrar
          </div>
        )}
      </div>
    </div>
  );
}
