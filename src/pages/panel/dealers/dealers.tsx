import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Plus, Upload, Search, TrendingUp, Music,
  DollarSign, BarChart2, MoreHorizontal, ArrowRight,
} from 'lucide-react';
import type { Distributor, DistributorKpi, Quarter } from '../../../types/distributor.types';
import { distributorsService } from '../../../services/distributorsService';
import CreateDistributorModal from '../../../components/ui/CreateDistributorModal';
import UploadSongsModal from '../../../components/ui/UploadSongsModal';

const AVATAR_PALETTES = [
  { bg: '#DBEAFE', color: '#1E40AF' },
  { bg: '#FEE2E2', color: '#991B1B' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#D1FAE5', color: '#065F46' },
  { bg: '#EDE9FE', color: '#5B21B6' },
  { bg: '#FCE7F3', color: '#9D174D' },
];

function palette(index: number) {
  return AVATAR_PALETTES[index % AVATAR_PALETTES.length];
}

function fmt(n: number, currency = 'USD') {
  const s = currency === 'EUR' ? '€' : '$';
  if (n >= 1_000_000) return `${s}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${s}${(n / 1_000).toFixed(1)}K`;
  return `${s}${n.toFixed(2)}`;
}

function fmtStreams(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function Dealers() {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [kpis, setKpis] = useState<DistributorKpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{
    distributor: Distributor;
    existingUploads: Array<{ quarter: Quarter; year: number }>;
  } | null>(null);

  async function openUploadModal(distributor: Distributor) {
    try {
      const ups = await distributorsService.getUploads(distributor._id);
      setUploadTarget({
        distributor,
        existingUploads: ups
          .filter((u) => u.status !== 'error')
          .map((u) => ({ quarter: u.quarter, year: u.year })),
      });
    } catch {
      setUploadTarget({ distributor, existingUploads: [] });
    }
  }

  async function load() {
    setLoading(true);
    try {
      const [list, kpiList] = await Promise.all([
        distributorsService.getAll(),
        distributorsService.getKpis(),
      ]);
      setDistributors(list);
      setKpis(kpiList);
    } catch {
      setDistributors([]);
      setKpis([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = distributors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalIncome = kpis.reduce((s, k) => s + k.totalNetIncome, 0);
  const totalStreams = kpis.reduce((s, k) => s + k.totalStreams, 0);
  const totalSongs = kpis.reduce((s, k) => s + k.songsCount, 0);

  // KPI comparison bar chart
  const kpiChartOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    plotOptions: { bar: { horizontal: true, barHeight: '60%', borderRadius: 4, borderRadiusApplication: 'end' } },
    dataLabels: { enabled: false },
    colors: ['#F97316'],
    xaxis: {
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px' },
        formatter: (v: string) => {
          const n = Number(v);
          return n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
        },
      },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#9CA3AF', fontSize: '11px' } } },
    grid: { borderColor: '#F3F4F6', xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    tooltip: { theme: 'light', y: { formatter: (v: number) => fmt(v) } },
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {showCreate && (
        <CreateDistributorModal
          onClose={() => setShowCreate(false)}
          onConfirm={async (payload) => {
            await distributorsService.create(payload);
            await load();
          }}
        />
      )}

      {uploadTarget && (
        <UploadSongsModal
          distributorName={uploadTarget.distributor.name}
          existingUploads={uploadTarget.existingUploads}
          onClose={() => setUploadTarget(null)}
          onConfirm={async (file, quarter, year, onProgress) => {
            const result = await distributorsService.uploadSongs(
              uploadTarget.distributor._id, file, quarter, year, onProgress,
            );
            await load();
            return result;
          }}
        />
      )}

      <div className="px-6 lg:px-10 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#111827]">Distribuidores</h1>
            <p className="text-sm text-[#6B7280]">Gestiona y analiza el rendimiento de tus distribuidores</p>
            <div className="w-10 h-0.5 rounded-full bg-[#F97316] mt-1" />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 h-9 bg-[#F97316] text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo distribuidor
          </button>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Distribuidores', value: String(distributors.length), sub: `${kpis.reduce((s, k) => s + k.uploadCount, 0)} cargas totales`, icon: TrendingUp, iconBg: 'bg-orange-50', iconColor: 'text-[#F97316]', valueColor: 'text-[#111827]' },
            { label: 'Canciones Totales', value: String(totalSongs), sub: 'En todos los distribuidores', icon: Music, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valueColor: 'text-[#111827]' },
            { label: 'Ingresos Totales', value: fmt(totalIncome), sub: 'Suma de ingresos netos', icon: DollarSign, iconBg: 'bg-green-50', iconColor: 'text-green-600', valueColor: 'text-green-500' },
            { label: 'Streams Totales', value: fmtStreams(totalStreams), sub: 'Reproducciones acumuladas', icon: BarChart2, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', valueColor: 'text-[#111827]' },
          ].map(({ label, value, sub, icon: Icon, iconBg, iconColor, valueColor }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B7280]">{label}</span>
                <div className={`w-7 h-7 ${iconBg} rounded-md flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                </div>
              </div>
              <p className={`text-[26px] font-bold leading-none ${valueColor}`}>{value}</p>
              <span className="text-[11px] font-medium text-[#9CA3AF]">{sub}</span>
            </div>
          ))}
        </div>

        {/* KPI comparison chart */}
        {kpis.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-[#111827]">KPIs Comparativos</h2>
            <p className="text-xs text-[#6B7280] mt-0.5 mb-4">Ingresos netos por distribuidor</p>
            <ReactApexChart
              options={{ ...kpiChartOptions, xaxis: { ...kpiChartOptions.xaxis, categories: kpis.map((k) => k.name) } }}
              series={[{ name: 'Ingresos Netos', data: kpis.map((k) => k.totalNetIncome) }]}
              type="bar"
              height={Math.max(120, kpis.length * 44)}
            />
          </div>
        )}

        {/* Distributors table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-[#111827]">Listado de Distribuidores</span>
              <span className="px-2.5 py-0.5 bg-gray-100 text-[#6B7280] text-[11px] font-bold rounded-full">
                {filtered.length}
              </span>
            </div>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Buscar distribuidor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 h-9 border border-gray-200 rounded-lg text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40 text-sm text-[#9CA3AF]">
                Cargando distribuidores...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <p className="text-sm text-[#9CA3AF]">
                  {distributors.length === 0 ? 'Aún no tienes distribuidores' : 'Sin resultados'}
                </p>
                {distributors.length === 0 && (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-1.5 text-sm text-[#F97316] font-medium hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Crear primer distribuidor
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Distribuidor</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Moneda</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Canciones</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Streams</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Ingresos</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Cargas</th>
                    <th className="w-[80px]" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => {
                    const kpi = kpis.find((k) => k.distributorId === d._id);
                    const pal = palette(i);
                    const initials = d.name.slice(0, 2).toUpperCase();
                    return (
                      <tr
                        key={d._id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/panel/dealers/${d._id}`)}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: pal.bg }}
                            >
                              <span className="text-[12px] font-bold" style={{ color: pal.color }}>
                                {initials}
                              </span>
                            </div>
                            <span className="text-[13px] font-semibold text-[#111827]">{d.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                            d.currency === 'USD' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {d.currency}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-[13px] font-medium text-[#111827]">
                            {kpi?.songsCount ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-[12px] text-[#6B7280]">
                          {fmtStreams(kpi?.totalStreams ?? 0)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-[13px] font-semibold text-green-500">
                            {fmt(kpi?.totalNetIncome ?? 0, d.currency)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-[#F97316] text-[11px] font-bold rounded-full">
                            {kpi?.uploadCount ?? 0}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); openUploadModal(d); }}
                              className="p-1.5 rounded-md hover:bg-orange-50 text-[#9CA3AF] hover:text-[#F97316] transition-colors"
                              title="Subir canciones"
                            >
                              <Upload className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/panel/dealers/${d._id}`); }}
                              className="p-1.5 rounded-md hover:bg-gray-100 text-[#9CA3AF] hover:text-[#111827] transition-colors"
                              title="Ver detalle"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-md hover:bg-gray-100 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
