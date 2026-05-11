/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Music2,
  Disc3,
  Play,
  DollarSign,
  Crown,
  AlertCircle,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Search,
  Users,
  Check,
  Minus,
} from "lucide-react";
import { useAlbums } from "../../../../hooks/useAlbums";
import Loading from "../../../../components/loading/loading";
import type { Album, AlbumTrack } from "../../../../models/album";
import AlbumOwnerSplitModal from "./components/AlbumOwnerSplitModal";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import AlbumService from "../../../../services/albums";

interface MonthlyMetric {
  month: string;
  streams: number;
  revenue: number;
}

type SortField = "title" | "streams" | "revenue";
type SortDir = "asc" | "desc";

export default function AlbumDetail() {
  const { upc } = useParams<{ upc: string }>();
  const navigate = useNavigate();
  const { getAlbumByUPC } = useAlbums(0, 10);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("streams");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);

  const loadAlbum = useCallback(async () => {
    if (!upc) return;
    setLoading(true);
    setError(null);
    try {
      const albumData = await getAlbumByUPC(upc);
      if (albumData) {
        setAlbum(albumData);
      } else {
        setError("Álbum no encontrado");
      }
    } catch {
      setError("Error al cargar el álbum");
    } finally {
      setLoading(false);
    }
  }, [upc, getAlbumByUPC]);

  useEffect(() => {
    if (upc) loadAlbum();
  }, [upc, loadAlbum]);

  useEffect(() => {
    if (!upc) return;
    setMetricsLoading(true);
    AlbumService.getAlbumMonthlyMetrics(upc, 12)
      .then((data) => setMonthlyMetrics(data))
      .finally(() => setMetricsLoading(false));
  }, [upc]);

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatStreams = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredTracks = useMemo(() => {
    if (!album) return [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? album.tracks.filter(
          (t) =>
            t.trackTitle?.toLowerCase().includes(q) ||
            t.isrc?.toLowerCase().includes(q)
        )
      : [...album.tracks];

    filtered.sort((a, b) => {
      let diff = 0;
      if (sortField === "title") {
        diff = (a.trackTitle || "").localeCompare(b.trackTitle || "");
      } else if (sortField === "streams") {
        diff = (a.totalStreams || 0) - (b.totalStreams || 0);
      } else {
        diff = (a.totalNetIncome || 0) - (b.totalNetIncome || 0);
      }
      return sortDir === "asc" ? diff : -diff;
    });

    return filtered;
  }, [album, search, sortField, sortDir]);

  const hasOwnerSplit = (track: AlbumTrack) => {
    const conditions = track?.ownerId?.split?.conditions;
    if (Array.isArray(conditions)) return conditions.length > 0;
    return Boolean(track?.ownerId?.split);
  };

  const hasCollaboratorSplit = (track: AlbumTrack) => {
    const conditions = track?.split?.conditions;
    if (Array.isArray(conditions)) return conditions.length > 0;
    return Boolean(track?.split);
  };

  const collaboratorsCount = (track: AlbumTrack) =>
    Array.isArray(track?.collaborators) ? track.collaborators.length : 0;

  const chartCategories = useMemo(
    () =>
      monthlyMetrics.map((m) => {
        const [year, month] = m.month.split("-");
        return new Date(Number(year), Number(month) - 1, 1).toISOString();
      }),
    [monthlyMetrics]
  );

  const chartSeries = useMemo(
    () => [
      {
        name: "Streams",
        type: "area",
        data: monthlyMetrics.map((m) => m.streams),
      },
      {
        name: "Ingresos",
        type: "area",
        data: monthlyMetrics.map((m) => m.revenue),
      },
    ],
    [monthlyMetrics]
  );

  const chartOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    stroke: { width: [2, 2], curve: "smooth" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    markers: { size: [0, 0] },
    dataLabels: { enabled: false },
    colors: ["#111827", "#22C55E"],
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "datetime",
      categories: chartCategories,
      labels: {
        style: { fontSize: "11px", colors: "#9CA3AF" },
        datetimeFormatter: { month: "MMM" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        seriesName: "Streams",
        labels: {
          style: { colors: "#9CA3AF", fontSize: "11px" },
          formatter: (val: number) => {
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
            if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
            return String(Math.round(val));
          },
        },
      },
      {
        seriesName: "Ingresos",
        opposite: true,
        labels: {
          style: { colors: "#22C55E", fontSize: "11px" },
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      },
    ],
    tooltip: {
      x: { format: "MMM yyyy" },
      theme: "light",
      style: { fontSize: "12px" },
      y: [
        {
          formatter: (val: number) => {
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M streams`;
            if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K streams`;
            return `${Math.round(val)} streams`;
          },
        },
        { formatter: (val: number) => `$${val.toFixed(2)}` },
      ],
    },
    legend: { show: false },
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-[#F97316]" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-[#F97316]" />
    );
  };

  if (loading) return <Loading />;

  if (error || !album) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] px-6 lg:px-10 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/panel/music")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </button>
        </div>
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-xl max-w-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error || "Álbum no encontrado"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-6 lg:px-10 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/panel/music")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalle del Álbum</h1>
            <p className="text-sm text-gray-500 mt-0.5">Pistas y métricas del álbum</p>
          </div>
        </div>

        {/* Breadcrumb + action */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Link to="/panel/music" className="text-gray-400 hover:text-gray-600">
              Música
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[160px]">
              {album.releaseTitle || album.albumTitle}
            </span>
          </div>
          <button
            onClick={() => setIsOwnerSplitModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Crown className="w-4 h-4" />
            Owner Splits
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6">
        {/* Cover */}
        <div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 self-center sm:self-start bg-orange-50 flex items-center justify-center">
          {album.coverImage?.[0]?.[0]?.url ? (
            <img
              src={album.coverImage[0][0].url}
              alt={album.releaseTitle || album.albumTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <Disc3 className="w-16 h-16 text-[#F97316]" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold text-[#F97316] uppercase tracking-wide">
              Álbum
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {album.releaseTitle || album.albumTitle}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{album.artistName}</p>
            {album.artisticLabel && (
              <p className="text-xs text-gray-400 mt-0.5">{album.artisticLabel}</p>
            )}
          </div>

          {/* UPC */}
          <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 bg-gray-100 rounded-full">
            <span className="text-xs font-semibold text-gray-500">UPC</span>
            <span className="text-xs font-mono text-gray-900">{album.upc}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Music2 className="w-4 h-4 text-[#F97316]" />
            </div>
            <span className="text-xs font-medium text-gray-500">Pistas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{album.totalTracks}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Streams</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatStreams(album.totalStreams)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Ingresos Brutos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(album.totalGrossIncome)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Ingresos Netos</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(album.totalNetIncome)}</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-semibold text-gray-900">Rendimiento del álbum</h2>
            <p className="text-xs text-gray-400">Streams e ingresos por mes</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gray-900 rounded-sm" />
              <span className="text-[11px] text-gray-500">Streams</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-sm" />
              <span className="text-[11px] text-gray-500">Ingresos</span>
            </div>
          </div>
        </div>

        {metricsLoading ? (
          <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
            Cargando métricas...
          </div>
        ) : monthlyMetrics.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
            Aún no hay datos mensuales para este álbum.
          </div>
        ) : (
          <div className="h-[280px]">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height="100%"
              width="100%"
            />
          </div>
        )}
      </div>

      {/* Tracks Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Pistas</span>
            <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              {filteredTracks.length}
            </span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título o ISRC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>
        </div>

        {filteredTracks.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                  >
                    Título
                    <SortIcon field="title" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  ISRC
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <button
                    onClick={() => handleSort("streams")}
                    className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                  >
                    Streams
                    <SortIcon field="streams" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <button
                    onClick={() => handleSort("revenue")}
                    className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                  >
                    Ingresos
                    <SortIcon field="revenue" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Splits
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Colaboradores
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTracks.map((track: AlbumTrack, index: number) => (
                <tr
                  key={track.isrc || index}
                  onClick={() => navigate(`/panel/song/${track._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* # */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400 font-medium">{index + 1}</span>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music2 className="w-4 h-4 text-[#F97316]" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                        {track.trackTitle}
                      </p>
                    </div>
                  </td>

                  {/* ISRC */}
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs font-mono text-gray-500">
                      {track.isrc || "—"}
                    </span>
                  </td>

                  {/* Streams */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatStreams(track.totalStreams || 0)}
                    </span>
                  </td>

                  {/* Revenue */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(track.totalNetIncome || 0)}
                    </span>
                  </td>

                  {/* Splits */}
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span
                        title={hasOwnerSplit(track) ? "Owner split creado" : "Sin owner split"}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-full ${
                          hasOwnerSplit(track)
                            ? "bg-orange-50 text-[#F97316]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {hasOwnerSplit(track) ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                        Owner
                      </span>
                      <span
                        title={
                          hasCollaboratorSplit(track)
                            ? "Split de colaborador creado"
                            : "Sin split de colaborador"
                        }
                        className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-full ${
                          hasCollaboratorSplit(track)
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {hasCollaboratorSplit(track) ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                        Collab
                      </span>
                    </div>
                  </td>

                  {/* Colaboradores */}
                  <td className="px-4 py-4">
                    {collaboratorsCount(track) > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {track.collaborators!
                            .slice(0, 3)
                            .map((collaborator, idx) =>
                              collaborator?.image ? (
                                <img
                                  key={collaborator._id || idx}
                                  src={collaborator.image}
                                  alt={collaborator.name || ""}
                                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                />
                              ) : (
                                <div
                                  key={collaborator._id || idx}
                                  className="w-7 h-7 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center"
                                >
                                  <Users className="w-3 h-3 text-[#F97316]" />
                                </div>
                              )
                            )}
                          {collaboratorsCount(track) > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                              <span className="text-[10px] font-semibold text-gray-500">
                                +{collaboratorsCount(track) - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {collaboratorsCount(track)}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        Ninguno
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Music2 className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {search ? "Sin resultados" : "Sin pistas"}
            </p>
            <p className="text-xs text-gray-400 max-w-xs">
              {search
                ? `No se encontraron pistas para "${search}"`
                : "No hay pistas registradas para este álbum"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-xs font-medium text-[#F97316] hover:underline"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>

      {/* Album Owner Split Modal */}
      <AlbumOwnerSplitModal
        isOpen={isOwnerSplitModalOpen}
        onClose={() => setIsOwnerSplitModalOpen(false)}
        album={album}
        onSplitsCreated={loadAlbum}
      />
    </div>
  );
}
