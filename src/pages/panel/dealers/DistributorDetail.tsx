import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  ArrowLeft,
  Upload,
  Music,
  TrendingUp,
  DollarSign,
  BarChart2,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { DistributorDashboard, Quarter } from "../../../types/distributor.types";
import { distributorsService } from "../../../services/distributorsService";
import type { RejectedSong } from "../../../services/distributorsService";
import UploadSongsModal from "../../../components/ui/UploadSongsModal";

const QUARTER_COLORS: Record<Quarter, string> = {
  Q1: "#2563EB",
  Q2: "#10B981",
  Q3: "#F97316",
  Q4: "#8B5CF6",
};

function fmt(n: number, currency = "USD") {
  const symbol = currency === "EUR" ? "€" : "$";
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

  useEffect(() => {
    load();
  }, [id]);

  const [uploadResult, setUploadResult] = useState<{
    songsProcessed: number;
    rejected: RejectedSong[];
  } | null>(null);

  async function handleUpload(file: File, quarter: Quarter, year: number) {
    if (!id) return;
    const result = await distributorsService.uploadSongs(id, file, quarter, year);
    setUploadResult({
      songsProcessed: result.songsProcessed,
      rejected: result.rejected,
    });
    await load();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <p className="text-sm text-[#9CA3AF]">Cargando dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F7F8FA]">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-[#6B7280]">No se pudo cargar el distribuidor</p>
        <button
          onClick={() => navigate("/panel/dealers")}
          className="text-sm font-medium text-[#F97316]"
        >
          ← Volver
        </button>
      </div>
    );
  }

  const { distributor, totals, revenueByQuarter, topSongs, uploads } = dashboard;
  const initials = distributor.name.slice(0, 2).toUpperCase();

  // Chart: revenue by quarter
  const chartOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    colors: revenueByQuarter.map((r) => QUARTER_COLORS[r.quarter] || "#F97316"),
    xaxis: {
      categories: revenueByQuarter.map((r) => r.label),
      labels: { style: { fontSize: "11px", colors: "#9CA3AF" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "11px" },
        formatter: (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`),
      },
    },
    grid: {
      borderColor: "#F3F4F6",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (v: number) => fmt(v, distributor.currency) },
    },
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {showUpload && (
        <UploadSongsModal
          distributorName={distributor.name}
          existingUploads={uploads
            .filter((u) => u.status !== "error")
            .map((u) => ({ quarter: u.quarter, year: u.year }))}
          onClose={() => setShowUpload(false)}
          onConfirm={handleUpload}
        />
      )}

      <div className="flex flex-col gap-6 px-6 py-8 lg:px-10">
        {/* Upload result banner */}
        {uploadResult && (
          <div
            className={`flex items-start gap-3 rounded-xl p-4 ${
              uploadResult.rejected.length > 0
                ? "border border-yellow-200 bg-yellow-50"
                : "border border-green-200 bg-green-50"
            }`}
          >
            <AlertCircle
              className={`h-5 w-5 flex-shrink-0 ${
                uploadResult.rejected.length > 0 ? "text-yellow-600" : "text-green-600"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  uploadResult.rejected.length > 0 ? "text-yellow-800" : "text-green-800"
                }`}
              >
                {uploadResult.songsProcessed} canción
                {uploadResult.songsProcessed !== 1 ? "es" : ""} procesada
                {uploadResult.songsProcessed !== 1 ? "s" : ""}
                {uploadResult.rejected.length > 0 &&
                  ` · ${uploadResult.rejected.length} rechazada${uploadResult.rejected.length !== 1 ? "s" : ""}`}
              </p>
              {uploadResult.rejected.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1.5 text-xs text-yellow-700">
                    Los siguientes ISRC ya pertenecen a otro usuario y fueron omitidos:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadResult.rejected.map((r) => (
                      <span
                        key={r.isrc}
                        className="rounded bg-yellow-100 px-2 py-0.5 font-mono text-[11px] text-yellow-800"
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
              className="rounded p-1 transition-colors hover:bg-black/5"
            >
              <ArrowLeft className="h-3.5 w-3.5 rotate-45 text-[#6B7280]" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/panel/dealers")}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 text-[#6B7280]" />
            </button>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <span className="text-sm font-bold text-[#F97316]">{initials}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111827]">{distributor.name}</h1>
              <span className="text-xs text-[#6B7280]">
                {distributor.currency === "USD" ? "$ Dólar" : "€ Euro"} · {totals.uploadCount}{" "}
                cargas
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#F97316] px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <Upload className="h-3.5 w-3.5" />
            Subir canciones
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Ingresos Netos",
              value: fmt(totals.totalNetIncome, distributor.currency),
              icon: DollarSign,
              iconBg: "bg-green-50",
              iconColor: "text-green-600",
              valueColor: "text-green-500",
            },
            {
              label: "Total Streams",
              value: fmtStreams(totals.totalStreams),
              icon: TrendingUp,
              iconBg: "bg-blue-50",
              iconColor: "text-blue-600",
              valueColor: "text-[#111827]",
            },
            {
              label: "Canciones",
              value: String(totals.songsCount),
              icon: Music,
              iconBg: "bg-purple-50",
              iconColor: "text-purple-600",
              valueColor: "text-[#111827]",
            },
            {
              label: "Cargas",
              value: String(totals.uploadCount),
              icon: BarChart2,
              iconBg: "bg-orange-50",
              iconColor: "text-[#F97316]",
              valueColor: "text-[#111827]",
            },
          ].map(({ label, value, icon: Icon, iconBg, iconColor, valueColor }) => (
            <div
              key={label}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B7280]">{label}</span>
                <div className={`h-7 w-7 ${iconBg} flex items-center justify-center rounded-md`}>
                  <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold leading-none ${valueColor}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Revenue by quarter chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-[#111827]">Ingresos por Quarter</h2>
          <p className="mb-4 mt-0.5 text-xs text-[#6B7280]">
            Evolución de ingresos netos por temporada
          </p>
          {revenueByQuarter.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-[#9CA3AF]">
              Sin cargas registradas aún
            </div>
          ) : (
            <ReactApexChart
              options={chartOptions}
              series={[
                {
                  name: "Ingresos Netos",
                  data: revenueByQuarter.map((r) => r.totalNetIncome),
                },
              ]}
              type="bar"
              height={250}
            />
          )}
        </div>

        {/* Uploads + Top songs */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Upload records */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#F97316]" />
              <h2 className="text-sm font-semibold text-[#111827]">Historial de Cargas</h2>
            </div>
            {uploads.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                <FileText className="h-6 w-6 text-[#D1D5DB]" />
                <p className="text-sm text-[#9CA3AF]">Aún no hay cargas</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="text-xs font-medium text-[#F97316] hover:underline"
                >
                  Subir primera carga →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {uploads.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-[#FAFAFA] p-3"
                  >
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                      style={{ backgroundColor: QUARTER_COLORS[u.quarter] }}
                    >
                      {u.quarter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111827]">{u.quarter} {u.year}</p>
                      <div className="flex items-center gap-1 text-[13px] text-[#111827]">
                        <p>Nombre del archivo: </p>
                        <p className="text-[11px] text-[#111827] font-semibold truncate">{u.fileName}</p>
                      </div>
                      <p className="text-[11px] text-[#9CA3AF] truncate">
                        {u.songsCount} canciones · {new Date(u.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[12px] font-bold text-green-500">
                        {fmt(u.totalNetIncome, distributor.currency)}
                      </span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          u.status === "done"
                            ? "bg-green-50 text-green-600"
                            : u.status === "processing"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-red-50 text-red-500"
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top songs */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-[#F97316]" />
              <h2 className="text-sm font-semibold text-[#111827]">Top 5 Canciones</h2>
            </div>
            {topSongs.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-[#9CA3AF]">
                Sin canciones cargadas
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {topSongs.map((s, i) => (
                  <div key={s._id} className="flex items-center gap-3">
                    <span
                      className={`w-5 flex-shrink-0 text-[12px] font-bold ${
                        i === 0
                          ? "text-yellow-500"
                          : i === 1
                            ? "text-gray-400"
                            : i === 2
                              ? "text-amber-600"
                              : "text-[#9CA3AF]"
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-[#111827]">
                        {s.trackTitle}
                      </p>
                      <p className="truncate text-[11px] text-[#9CA3AF]">{s.artistName}</p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
                      <span className="text-[12px] font-bold text-green-500">
                        {fmt(s.totalNetIncome, distributor.currency)}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">
                        {fmtStreams(s.totalStreams)} str.
                      </span>
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
