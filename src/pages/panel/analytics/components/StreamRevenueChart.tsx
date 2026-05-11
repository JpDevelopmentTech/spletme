import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import type { TopSong } from '../../../../types/analytics.types';

interface Props {
  songs: TopSong[];
  loading: boolean;
}

export default function StreamRevenueChart({ songs, loading }: Props) {
  if (loading || songs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Stream × Revenue</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">Correlación de streams vs ingresos por canción</p>
        </div>
        <div className="h-[240px] flex items-center justify-center text-sm text-[#9CA3AF]">
          {loading ? 'Cargando...' : 'Sin datos disponibles'}
        </div>
      </div>
    );
  }

  const series = [
    {
      name: 'Canciones',
      data: songs.map((s) => ({
        x: s.streams,
        y: parseFloat(s.netIncome.toFixed(2)),
        z: 10,
        label: s.trackTitle,
      })),
    },
  ];

  const options: ApexOptions = {
    chart: { type: 'scatter', toolbar: { show: false }, background: 'transparent', zoom: { enabled: false } },
    colors: ['#F97316'],
    markers: { size: 8, strokeColors: '#fff', strokeWidth: 2, hover: { size: 10 } },
    xaxis: {
      title: { text: 'Streams', style: { fontSize: '11px', color: '#9CA3AF' } },
      labels: {
        style: { colors: '#9CA3AF', fontSize: '10px' },
        formatter: (v: string) => {
          const n = Number(v);
          return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : String(n);
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: 'Ingreso Neto ($)', style: { fontSize: '11px', color: '#9CA3AF' } },
      labels: {
        style: { colors: '#9CA3AF', fontSize: '10px' },
        formatter: (v: number) => (v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`),
      },
    },
    grid: { borderColor: '#F3F4F6' },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: unknown }) => {
        const point = (w as { config: { series: typeof series } }).config.series[seriesIndex].data[dataPointIndex] as { x: number; y: number; label: string };
        return `<div style="padding:8px 12px;font-size:12px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
          <strong>${point.label}</strong><br/>
          Streams: ${point.x.toLocaleString()}<br/>
          Ingresos: $${point.y.toFixed(2)}
        </div>`;
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-[#111827]">Stream × Revenue</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">Correlación de streams vs ingresos por canción</p>
      </div>
      <ReactApexChart options={options} series={series} type="scatter" height={240} />
    </div>
  );
}
