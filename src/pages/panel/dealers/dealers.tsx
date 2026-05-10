import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  Download,
  SlidersHorizontal,
  Search,
  Check,
  X,
  MoreHorizontal,
  TrendingUp,
  Music,
  DollarSign,
  BarChart2,
} from "lucide-react";

interface Collaborator {
  initials: string;
  bg: string;
  color: string;
}

interface Dealer {
  id: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  name: string;
  website: string;
  songs: number;
  performance: number;
  collaborators: Collaborator[];
  isOwner: boolean;
  isInvited: boolean;
  lastIncome: number;
}

interface PerformanceBar {
  name: string;
  percentage: number;
  color: string;
}

const dealers: Dealer[] = [
  {
    id: "1",
    initials: "SP",
    avatarBg: "#DBEAFE",
    avatarColor: "#1E40AF",
    name: "Spotify Distribution",
    website: "spotify.com",
    songs: 42,
    performance: 18.4,
    collaborators: [
      { initials: "A", bg: "#FED7AA", color: "#9A3412" },
      { initials: "B", bg: "#D1FAE5", color: "#065F46" },
      { initials: "C", bg: "#EDE9FE", color: "#5B21B6" },
    ],
    isOwner: true,
    isInvited: false,
    lastIncome: 8420,
  },
  {
    id: "2",
    initials: "AM",
    avatarBg: "#FEE2E2",
    avatarColor: "#991B1B",
    name: "Apple Music Distribution",
    website: "apple.com",
    songs: 38,
    performance: 15.1,
    collaborators: [
      { initials: "A", bg: "#FED7AA", color: "#9A3412" },
      { initials: "B", bg: "#D1FAE5", color: "#065F46" },
    ],
    isOwner: true,
    isInvited: true,
    lastIncome: 6180,
  },
  {
    id: "3",
    initials: "TT",
    avatarBg: "#FEF3C7",
    avatarColor: "#92400E",
    name: "TikTok for Artists",
    website: "tiktok.com",
    songs: 25,
    performance: 9.8,
    collaborators: [{ initials: "D", bg: "#FCE7F3", color: "#9D174D" }],
    isOwner: false,
    isInvited: true,
    lastIncome: 4920,
  },
  {
    id: "4",
    initials: "YT",
    avatarBg: "#FEE2E2",
    avatarColor: "#991B1B",
    name: "YouTube Music",
    website: "youtube.com",
    songs: 31,
    performance: 7.2,
    collaborators: [
      { initials: "A", bg: "#FED7AA", color: "#9A3412" },
      { initials: "E", bg: "#DBEAFE", color: "#1E40AF" },
      { initials: "F", bg: "#D1FAE5", color: "#065F46" },
      { initials: "G", bg: "#EDE9FE", color: "#5B21B6" },
    ],
    isOwner: true,
    isInvited: false,
    lastIncome: 3240,
  },
  {
    id: "5",
    initials: "AZ",
    avatarBg: "#D1FAE5",
    avatarColor: "#065F46",
    name: "Amazon Music",
    website: "amazon.com",
    songs: 19,
    performance: 5.1,
    collaborators: [
      { initials: "B", bg: "#D1FAE5", color: "#065F46" },
      { initials: "C", bg: "#EDE9FE", color: "#5B21B6" },
    ],
    isOwner: false,
    isInvited: true,
    lastIncome: 1560,
  },
  {
    id: "6",
    initials: "DZ",
    avatarBg: "#F3F4F6",
    avatarColor: "#374151",
    name: "Deezer",
    website: "deezer.com",
    songs: 14,
    performance: 3.4,
    collaborators: [{ initials: "A", bg: "#FED7AA", color: "#9A3412" }],
    isOwner: true,
    isInvited: true,
    lastIncome: 500,
  },
];

const performanceBars: PerformanceBar[] = [
  { name: "Spotify Distribution", percentage: 18.4, color: "#2563EB" },
  { name: "Apple Music Distribution", percentage: 15.1, color: "#EF4444" },
  { name: "TikTok for Artists", percentage: 9.8, color: "#F59E0B" },
  { name: "YouTube Music", percentage: 7.2, color: "#EF4444" },
  { name: "Amazon Music", percentage: 5.1, color: "#22C55E" },
  { name: "Deezer", percentage: 3.4, color: "#9CA3AF" },
];

const chartSeries = [
  {
    name: "Spotify",
    data: [8420, 9200, 7800, 9800, 9400, 8800],
  },
  {
    name: "Apple",
    data: [6180, 7400, 5900, 8100, 7600, 7200],
  },
  {
    name: "TikTok",
    data: [4920, 5400, 3900, 6200, 5800, 5200],
  },
];

const chartOptions: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
    background: "transparent",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "65%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: { enabled: false },
  colors: ["#2563EB", "#EF4444", "#F59E0B"],
  stroke: { show: false },
  xaxis: {
    categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    labels: { style: { fontSize: "11px", colors: "#9CA3AF" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: "#9CA3AF", fontSize: "11px" },
      formatter: (val: number) => {
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
        return `$${val}`;
      },
    },
  },
  grid: {
    borderColor: "#F3F4F6",
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    fontSize: "11px",
    labels: { colors: "#6B7280" },
    markers: { size: 6 },
    itemMargin: { horizontal: 10 },
  },
  tooltip: {
    theme: "light",
    y: { formatter: (val: number) => `$${val.toLocaleString("en-US")}` },
  },
  fill: { opacity: 1 },
};

const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const totalSongs = dealers.reduce((sum, d) => sum + d.songs, 0);
const totalIncome = dealers.reduce((sum, d) => sum + d.lastIncome, 0);
const avgPerformance =
  dealers.reduce((sum, d) => sum + d.performance, 0) / dealers.length;
const maxPerformance = Math.max(...performanceBars.map((p) => p.percentage));

export default function Dealers() {
  const [search, setSearch] = useState("");

  const filtered = dealers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.website.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="px-6 lg:px-10 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#111827]">Distribuidores</h1>
            <p className="text-sm text-[#6B7280]">
              Gestiona y analiza el rendimiento de tus distribuidores
            </p>
            <div className="w-10 h-0.5 rounded-full bg-[#F97316] mt-1" />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 h-9 bg-white border border-gray-200 text-[#6B7280] text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Descargar
            </button>
            <button className="flex items-center gap-1.5 px-4 h-9 bg-white border border-gray-200 text-[#6B7280] text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">Total Distribuidores</span>
              <div className="w-7 h-7 bg-orange-50 rounded-md flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-[#F97316]" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-[#111827] leading-none">{dealers.length}</p>
            <span className="text-[11px] font-medium text-green-500">+2 este mes</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">Canciones Activas</span>
              <div className="w-7 h-7 bg-blue-50 rounded-md flex items-center justify-center">
                <Music className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-[#111827] leading-none">{totalSongs}</p>
            <span className="text-[11px] font-medium text-[#9CA3AF]">En todos los distribuidores</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">Ingresos Totales</span>
              <div className="w-7 h-7 bg-green-50 rounded-md flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-green-500 leading-none">
              ${(totalIncome / 1000).toFixed(1)}K
            </p>
            <span className="text-[11px] font-medium text-[#9CA3AF]">Último periodo</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">Rendimiento Promedio</span>
              <div className="w-7 h-7 bg-purple-50 rounded-md flex items-center justify-center">
                <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-[#111827] leading-none">
              {avgPerformance.toFixed(1)}%
            </p>
            <span className="text-[11px] font-medium text-green-500">↑ 3.2% vs mes anterior</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Toolbar */}
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 accent-[#F97316]"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Distribuidor
                  </th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[120px]">
                    Canciones
                  </th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[130px]">
                    Rendimiento
                  </th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[160px]">
                    Colaboradores
                  </th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[100px]">
                    Propietario
                  </th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[90px]">
                    Invitado
                  </th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[130px]">
                    Últ. Ingreso
                  </th>
                  <th className="w-[50px]" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 accent-[#F97316]"
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: dealer.avatarBg }}
                        >
                          <span
                            className="text-[12px] font-bold"
                            style={{ color: dealer.avatarColor }}
                          >
                            {dealer.initials}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-semibold text-[#111827]">
                            {dealer.name}
                          </span>
                          <span className="text-[11px] text-[#9CA3AF]">{dealer.website}</span>
                        </div>
                      </div>
                    </td>

                    {/* Songs */}
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full">
                        {dealer.songs}
                      </span>
                    </td>

                    {/* Performance */}
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-full ${
                          dealer.performance >= 10
                            ? "bg-green-50 text-green-700"
                            : dealer.performance >= 6
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {dealer.performance}%
                      </span>
                    </td>

                    {/* Collaborators */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        <div className="flex -space-x-2">
                          {dealer.collaborators.slice(0, 4).map((c, idx) => (
                            <div
                              key={idx}
                              className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: c.bg }}
                            >
                              <span
                                className="text-[10px] font-bold"
                                style={{ color: c.color }}
                              >
                                {c.initials}
                              </span>
                            </div>
                          ))}
                          {dealer.collaborators.length > 4 && (
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                              <span className="text-[9px] font-semibold text-gray-500">
                                +{dealer.collaborators.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            dealer.isOwner ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          {dealer.isOwner ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Invited */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            dealer.isInvited ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          {dealer.isInvited ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Last Income */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-[13px] font-semibold text-green-500">
                        {formatCurrency(dealer.lastIncome)}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-center">
                      <button className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar chart — Ingresos */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">
                Ingresos por Distribuidor
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Comparativa de ingresos netos enero–junio
              </p>
            </div>
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={280}
            />
          </div>

          {/* Progress bars — Rendimiento */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">
                Rendimiento por Distribuidor
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Porcentaje de rendimiento acumulado por plataforma
              </p>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {performanceBars.map((bar) => (
                <div key={bar.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#111827] truncate max-w-[220px]">
                      {bar.name}
                    </span>
                    <span
                      className="text-[12px] font-bold ml-2 flex-shrink-0"
                      style={{ color: bar.color }}
                    >
                      {bar.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(bar.percentage / maxPerformance) * 100}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-[#6B7280]">
                Rendimiento total acumulado
              </span>
              <span className="text-xs font-bold text-[#111827]">
                {avgPerformance.toFixed(1)}% promedio
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
