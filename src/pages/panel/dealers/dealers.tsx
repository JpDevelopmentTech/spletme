import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  Plus,
  Upload,
  Search,
  TrendingUp,
  Music,
  DollarSign,
  BarChart2,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import type {
  Distributor,
  DistributorKpi,
  Quarter,
} from "../../../types/distributor.types";
import { distributorsService } from "../../../services/distributorsService";
import CreateDistributorModal from "../../../components/ui/CreateDistributorModal";
import UploadSongsModal from "../../../components/ui/UploadSongsModal";

const AVATAR_PALETTES = [
  { bg: "#DBEAFE", color: "#1E40AF" },
  { bg: "#FEE2E2", color: "#991B1B" },
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#EDE9FE", color: "#5B21B6" },
  { bg: "#FCE7F3", color: "#9D174D" },
];

function palette(index: number) {
  return AVATAR_PALETTES[index % AVATAR_PALETTES.length];
}

function fmt(n: number, currency = "USD") {
  const s = currency === "EUR" ? "€" : "$";
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
  const [search, setSearch] = useState("");
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
          .filter((u) => u.status !== "error")
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

  useEffect(() => {
    load();
  }, []);

  const filtered = distributors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalIncome = kpis.reduce((s, k) => s + k.totalNetIncome, 0);
  const totalStreams = kpis.reduce((s, k) => s + k.totalStreams, 0);
  const totalSongs = kpis.reduce((s, k) => s + k.songsCount, 0);

  // KPI comparison bar chart
  const kpiChartOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    colors: ["#F97316"],
    xaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "11px" },
        formatter: (v: string) => {
          const n = Number(v);
          return n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#9CA3AF", fontSize: "11px" } } },
    grid: {
      borderColor: "#F3F4F6",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: { theme: "light", y: { formatter: (v: number) => fmt(v) } },
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {showCreate && (
        <CreateDistributorModal
          onClose={() => setShowCreate(false)}
          onConfirm={async (payload) => {
            const created = await distributorsService.create(payload);
            await load();
            // Abrir de inmediato el modal de carga del Q para el distribuidor
            // recién creado. Al ser nuevo, no tiene cargas previas.
            setUploadTarget({ distributor: created, existingUploads: [] });
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
              uploadTarget.distributor._id,
              file,
              quarter,
              year,
              onProgress,
            );
            await load();
            return result;
          }}
        />
      )}

      <div className="flex flex-col gap-6 px-6 py-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#111827]">
              Distribuidores
            </h1>
            <p className="text-sm text-[#6B7280]">
              Gestiona y analiza el rendimiento de tus distribuidores
            </p>
            <div className="mt-1 h-0.5 w-10 rounded-full bg-[#F97316]" />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#F97316] px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Nuevo distribuidor
          </button>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Distribuidores",
              value: String(distributors.length),
              sub: `${kpis.reduce((s, k) => s + k.uploadCount, 0)} cargas totales`,
              icon: TrendingUp,
              iconBg: "bg-orange-50",
              iconColor: "text-[#F97316]",
              valueColor: "text-[#111827]",
            },
            {
              label: "Canciones Totales",
              value: String(totalSongs),
              sub: "En todos los distribuidores",
              icon: Music,
              iconBg: "bg-blue-50",
              iconColor: "text-blue-600",
              valueColor: "text-[#111827]",
            },
            {
              label: "Ingresos Totales",
              value: fmt(totalIncome),
              sub: "Suma de ingresos netos",
              icon: DollarSign,
              iconBg: "bg-green-50",
              iconColor: "text-green-600",
              valueColor: "text-green-500",
            },
            {
              label: "Streams Totales",
              value: fmtStreams(totalStreams),
              sub: "Reproducciones acumuladas",
              icon: BarChart2,
              iconBg: "bg-purple-50",
              iconColor: "text-purple-600",
              valueColor: "text-[#111827]",
            },
          ].map(
            ({
              label,
              value,
              sub,
              icon: Icon,
              iconBg,
              iconColor,
              valueColor,
            }) => (
              <div
                key={label}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6B7280]">
                    {label}
                  </span>
                  <div
                    className={`h-7 w-7 ${iconBg} flex items-center justify-center rounded-md`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  </div>
                </div>
                <p
                  className={`text-[26px] font-bold leading-none ${valueColor}`}
                >
                  {value}
                </p>
                <span className="text-[11px] font-medium text-[#9CA3AF]">
                  {sub}
                </span>
              </div>
            ),
          )}
        </div>

        {/* KPI comparison chart */}
        {kpis.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-[#111827]">
              KPIs Comparativos
            </h2>
            <p className="mb-4 mt-0.5 text-xs text-[#6B7280]">
              Ingresos netos por distribuidor
            </p>
            <ReactApexChart
              options={{
                ...kpiChartOptions,
                xaxis: {
                  ...kpiChartOptions.xaxis,
                  categories: kpis.map((k) => k.name),
                },
              }}
              series={[
                {
                  name: "Ingresos Netos",
                  data: kpis.map((k) => k.totalNetIncome),
                },
              ]}
              type="bar"
              height={Math.max(120, kpis.length * 44)}
            />
          </div>
        )}

        {/* Distributors table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-[#111827]">
                Listado de Distribuidores
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-[#6B7280]">
                {filtered.length}
              </span>
            </div>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Buscar distribuidor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-[13px] text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#F97316] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-[#9CA3AF]">
                Cargando distribuidores...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-3">
                <p className="text-sm text-[#9CA3AF]">
                  {distributors.length === 0
                    ? "Aún no tienes distribuidores"
                    : "Sin resultados"}
                </p>
                {distributors.length === 0 && (
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#F97316] hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Crear primer distribuidor
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Distribuidor
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Moneda
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Canciones
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Streams
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Ingresos
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      Cargas
                    </th>
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
                        className="cursor-pointer border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50"
                        onClick={() => navigate(`/panel/dealers/${d._id}`)}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                              style={{ backgroundColor: pal.bg }}
                            >
                              <span
                                className="text-[12px] font-bold"
                                style={{ color: pal.color }}
                              >
                                {initials}
                              </span>
                            </div>
                            <span className="text-[13px] font-semibold text-[#111827]">
                              {d.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              d.currency === "USD"
                                ? "bg-green-50 text-green-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
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
                          <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-[#F97316]">
                            {kpi?.uploadCount ?? 0}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openUploadModal(d);
                              }}
                              className="rounded-md p-1.5 text-[#9CA3AF] transition-colors hover:bg-orange-50 hover:text-[#F97316]"
                              title="Subir canciones"
                            >
                              <Upload className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/panel/dealers/${d._id}`);
                              }}
                              className="rounded-md p-1.5 text-[#9CA3AF] transition-colors hover:bg-gray-100 hover:text-[#111827]"
                              title="Ver detalle"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="rounded-md p-1.5 text-[#9CA3AF] transition-colors hover:bg-gray-100 hover:text-[#6B7280]"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
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
