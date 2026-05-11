import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  ArrowLeft, Upload, Music, TrendingUp, DollarSign,
  BarChart2, Calendar, FileText, AlertCircle,
} from 'lucide-react';
import type { DistributorDashboard, Quarter } from '../../../types/distributor.types';
import { distributorsService } from '../../../services/distributorsService';
import UploadSongsModal from '../../../components/ui/UploadSongsModal';

const QUARTER_COLORS: Record<Quarter, string> = {
  Q1: '#2563EB', Q2: '#10B981', Q3: '#F97316', Q4: '#8B5CF6',
};

function fmt(n: number, currency = 'USD') {
  const symbol = currency === 'EUR' ? '€' : '$';
  if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${symbol}${(n / 1_000).toFixed(1)}K`;
  return `${symbol}${n.toFixed(2)}`;
}

function fmtStreams(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function DistributorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DistributorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const data = await distributorsService.getDashboard(id);
      setDashboard(data);
    } catch {
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  const [uploadResult, setUploadResult] = useState<{
    songsProcessed: number;
    rejected: Array<{ isrc: string; existingOwnerId: string }>;
  } | null>(null);

  async function handleUpload(file: File, quarter: Quarter, year: number) {
    if (!id) return;
    const result = await distributorsService.uploadSongs(id, file, quarter, year);
    setUploadResult({ songsProcessed: result.songsProcessed, rejected: result.rejected });
    await load();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <p className="text-sm text-[#9CA3AF]">Cargando dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-[#6B7280]">No se pudo cargar el distribuidor</p>
        <button onClick={() => navigate('/panel/dealers')} className="text-sm text-[#F97316] font-medium">
          ← Volver
        </button>
      </div>
    );
  }

  const { distributor, totals, revenueByQuarter, topSongs, uploads } = dashboard;
  const initials = distributor.name.slice(0, 2).toUpperCase();

  // Chart: revenue by quarter
  const chartOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    plotOptions: { bar: { horizontal: false, columnWidth: '60%', borderRadius: 4, borderRadiusApplication: 'end' } },
    dataLabels: { enabled: false },
    colors: revenueByQuarter.map((r) => QUARTER_COLORS[r.quarter] || '#F97316'),
    xaxis: {
      categories: revenueByQuarter.map((r) => r.label),
      labels: { style: { fontSize: '11px', colors: '#9CA3AF' } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF', fontSize: '11px' },
        formatter: (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`),
      },
    },
    grid: { borderColor: '#F3F4F6', yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    tooltip: { theme: 'light', y: { formatter: (v: number) => fmt(v, distributor.currency) } },
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {showUpload && (
        <UploadSongsModal
          distributorName={distributor.name}
          existingUploads={uploads
            .filter((u) => u.status !== 'error')
            .map((u) => ({ quarter: u.quarter, year: u.year }))}
          onClose={() => setShowUpload(false)}
          onConfirm={handleUpload}
        />
      )}

      <div className="px-6 lg:px-10 py-8 flex flex-col gap-6">
        {/* Upload result banner */}
        {uploadResult && (
          <div
            className={`rounded-xl p-4 flex items-start gap-3 ${
              uploadResult.rejected.length > 0
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-green-50 border border-green-200'
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 ${
                uploadResult.rejected.length > 0 ? 'text-yellow-600' : 'text-green-600'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold ${
                  uploadResult.rejected.length > 0 ? 'text-yellow-800' : 'text-green-800'
                }`}
              >
                {uploadResult.songsProcessed} canción{uploadResult.songsProcessed !== 1 ? 'es' : ''} procesada{uploadResult.songsProcessed !== 1 ? 's' : ''}
                {uploadResult.rejected.length > 0 &&
                  ` · ${uploadResult.rejected.length} rechazada${uploadResult.rejected.length !== 1 ? 's' : ''}`}
              </p>
              {uploadResult.rejected.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-yellow-700 mb-1.5">
                    Los siguientes ISRC ya pertenecen a otro usuario y fueron omitidos:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadResult.rejected.map((r) => (
                      <span
                        key={r.isrc}
                        className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[11px] font-mono rounded"
                      >
                        {r.isrc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setUploadResult(null)}
              className="p-1 rounded hover:bg-black/5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 rotate-45 text-[#6B7280]" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/panel/dealers')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#F97316]">{initials}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111827]">{distributor.name}</h1>
              <span className="text-xs text-[#6B7280]">
                {distributor.currency === 'USD' ? '$ Dólar' : '€ Euro'} · {totals.uploadCount} cargas
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 h-9 bg-[#F97316] text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Subir canciones
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Ingresos Netos', value: fmt(totals.totalNetIncome, distributor.currency), icon: DollarSign, iconBg: 'bg-green-50', iconColor: 'text-green-600', valueColor: 'text-green-500' },
            { label: 'Total Streams', value: fmtStreams(totals.totalStreams), icon: TrendingUp, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valueColor: 'text-[#111827]' },
            { label: 'Canciones', value: String(totals.songsCount), icon: Music, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', valueColor: 'text-[#111827]' },
            { label: 'Cargas', value: String(totals.uploadCount), icon: BarChart2, iconBg: 'bg-orange-50', iconColor: 'text-[#F97316]', valueColor: 'text-[#111827]' },
          ].map(({ label, value, icon: Icon, iconBg, iconColor, valueColor }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B7280]">{label}</span>
                <div className={`w-7 h-7 ${iconBg} rounded-md flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold leading-none ${valueColor}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Revenue by quarter chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#111827]">Ingresos por Quarter</h2>
          <p className="text-xs text-[#6B7280] mt-0.5 mb-4">Evolución de ingresos netos por temporada</p>
          {revenueByQuarter.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-[#9CA3AF]">
              Sin cargas registradas aún
            </div>
          ) : (
            <ReactApexChart
              options={chartOptions}
              series={[{ name: 'Ingresos Netos', data: revenueByQuarter.map((r) => r.totalNetIncome) }]}
              type="bar"
              height={250}
            />
          )}
        </div>

        {/* Uploads + Top songs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upload records */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F97316]" />
              <h2 className="text-sm font-semibold text-[#111827]">Historial de Cargas</h2>
            </div>
            {uploads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
                <FileText className="w-6 h-6 text-[#D1D5DB]" />
                <p className="text-sm text-[#9CA3AF]">Aún no hay cargas</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="text-xs text-[#F97316] font-medium hover:underline"
                >
                  Subir primera carga →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {uploads.map((u) => (
                  <div key={u._id} className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg border border-gray-100">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
                      style={{ backgroundColor: QUARTER_COLORS[u.quarter] }}
                    >
                      {u.quarter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111827]">{u.quarter} {u.year}</p>
                      <p className="text-[11px] text-[#9CA3AF] truncate">
                        {u.songsCount} canciones · {new Date(u.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[12px] font-bold text-green-500">
                        {fmt(u.totalNetIncome, distributor.currency)}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        u.status === 'done' ? 'bg-green-50 text-green-600' :
                        u.status === 'processing' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-red-50 text-red-500'
                      }`}>
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top songs */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#F97316]" />
              <h2 className="text-sm font-semibold text-[#111827]">Top 5 Canciones</h2>
            </div>
            {topSongs.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-sm text-[#9CA3AF]">
                Sin canciones cargadas
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {topSongs.map((s, i) => (
                  <div key={s._id} className="flex items-center gap-3">
                    <span className={`text-[12px] font-bold w-5 flex-shrink-0 ${
                      i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-[#9CA3AF]'
                    }`}>#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111827] truncate">{s.trackTitle}</p>
                      <p className="text-[11px] text-[#9CA3AF] truncate">{s.artistName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <span className="text-[12px] font-bold text-green-500">
                        {fmt(s.totalNetIncome, distributor.currency)}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">{fmtStreams(s.totalStreams)} str.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
