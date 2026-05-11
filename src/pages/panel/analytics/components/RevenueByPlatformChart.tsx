import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { RevenueByPlatformData } from '../../../../types/analytics.types';

interface Props {
  data: RevenueByPlatformData | null;
  loading: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
  Spotify: '#1DB954',
  'Apple Music': '#FC3C44',
  YouTube: '#FF0000',
  'YouTube Music': '#FF0000',
  TikTok: '#69C9D0',
  Amazon: '#FF9900',
  'Amazon Music': '#FF9900',
  Deezer: '#EF5466',
};

function colorFor(name: string, idx: number) {
  return (
    PLATFORM_COLORS[name] ||
    ['#2563EB', '#F97316', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'][idx % 7]
  );
}

export default function RevenueByPlatformChart({ data, loading }: Props) {
  if (loading || !data || data.series.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Ingresos por Plataforma / Mes</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">Barras apiladas — YT, Spotify, Apple y más</p>
        </div>
        <div className="h-[280px] flex items-center justify-center text-sm text-[#9CA3AF]">
          {loading ? 'Cargando...' : 'Sin datos disponibles'}
        </div>
      </div>
    );
  }

  const series = data.series.map((s, i) => ({
    name: s.name,
    data: s.data,
    color: colorFor(s.name, i),
  }));

  const options: ApexOptions = {
    chart: { type: 'bar', stacked: true, toolbar: { show: false }, background: 'transparent' },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '65%', borderRadius: 3, borderRadiusApplication: 'end' },
    },
    dataLabels: { enabled: false },
    colors: series.map((s) => s.color),
    stroke: { show: false },
    xaxis: {
      categories: data.months,
      labels: { style: { fontSize: '11px', colors: '#9CA3AF' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px' },
        formatter: (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`),
      },
    },
    grid: { borderColor: '#F3F4F6', yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '11px',
      labels: { colors: '#6B7280' },
      markers: { size: 6 },
      itemMargin: { horizontal: 8 },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    },
    fill: { opacity: 1 },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-[#111827]">Ingresos por Plataforma / Mes</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">Barras apiladas — YT, Spotify, Apple y más</p>
      </div>
      <ReactApexChart options={options} series={series} type="bar" height={280} />
    </div>
  );
}
