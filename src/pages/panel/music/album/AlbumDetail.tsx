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
import AlbumExtraordinaryCosts from "./components/AlbumExtraordinaryCosts";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import AlbumService from "../../../../services/albums";
import SongService from "../../../../services/songs";
import Platforms from "../song/components/platforms";
import { CopyButton } from "@/components/ui/CopyButton";

interface ReproductionData {
  totalStreams: number;
  totalIncome: number;
  releasesCount: number;
  platform: string;
}

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
  const [collaboratorsModal, setCollaboratorsModal] = useState<
    { _id?: string; name?: string; image?: string }[] | null
  >(null);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("streams");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [monthlyMetrics, setMonthlyMetrics] = useState<MonthlyMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [albumReproductions, setAlbumReproductions] = useState<ReproductionData[]>([]);

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

  useEffect(() => {
    if (!album || album.tracks.length === 0) return;
    const fetchReproductions = async () => {
      const results = await Promise.allSettled(album.tracks.map((t) => SongService.getSong(t._id)));
      const map = new Map<string, ReproductionData>();
      for (const result of results) {
        if (result.status !== "fulfilled" || !result.value) continue;
        const song = result.value?.data ?? result.value;
        const repros: ReproductionData[] = song?.reproductions ?? [];
        for (const repro of repros) {
          const existing = map.get(repro.platform);
          if (existing) {
            map.set(repro.platform, {
              ...existing,
              totalStreams: existing.totalStreams + (repro.totalStreams || 0),
              totalIncome: existing.totalIncome + (repro.totalIncome || 0),
              releasesCount: existing.releasesCount + (repro.releasesCount || 0),
            });
          } else {
            map.set(repro.platform, { ...repro });
          }
        }
      }
      setAlbumReproductions(Array.from(map.values()));
    };
    fetchReproductions();
  }, [album]);

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
          (t) => t.trackTitle?.toLowerCase().includes(q) || t.isrc?.toLowerCase().includes(q),
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

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const avatarColors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-cyan-100 text-cyan-700",
  ];

  const getAvatarColor = (name?: string) => {
    const code = (name ?? "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarColors[code % avatarColors.length];
  };

  const chartCategories = useMemo(
    () =>
      monthlyMetrics.map((m) => {
        const [year, month] = m.month.split("-");
        return new Date(Number(year), Number(month) - 1, 1).toISOString();
      }),
    [monthlyMetrics],
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
    [monthlyMetrics],
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
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#F97316]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#F97316]" />
    );
  };

  if (loading) return <Loading />;

  if (error || !album) {
    return (
      <div className="min-h-screen space-y-6 bg-[#F7F8FA] px-6 py-8 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/panel/music")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </button>
        </div>
        <div className="flex max-w-lg items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error || "Álbum no encontrado"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-[#F7F8FA] px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/panel/music")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalle del Álbum</h1>
            <p className="mt-0.5 text-sm text-gray-500">Pistas y métricas del álbum</p>
          </div>
        </div>

        {/* Breadcrumb + action */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-sm sm:flex">
            <Link to="/panel/music" className="text-gray-400 hover:text-gray-600">
              Música
            </Link>
            <span className="text-gray-300">/</span>
            <span className="max-w-[160px] truncate font-medium text-gray-900">
              {album.releaseTitle || album.albumTitle}
            </span>
          </div>
          <button
            onClick={() => setIsOwnerSplitModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <Crown className="h-4 w-4" />
            Owner Splits
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row">
        {/* Cover */}
        <div className="flex h-40 w-40 flex-shrink-0 items-center justify-center self-center overflow-hidden rounded-xl bg-orange-50 sm:self-start">
          {album.coverImage?.[0]?.[0]?.url ? (
            <img
              src={album.coverImage[0][0].url}
              alt={album.releaseTitle || album.albumTitle}
              className="h-full w-full object-cover"
            />
          ) : (
            <Disc3 className="h-16 w-16 text-[#F97316]" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#F97316]">
              Álbum
            </span>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {album.releaseTitle || album.albumTitle}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{album.artistName}</p>
            {album.artisticLabel && (
              <p className="mt-0.5 text-xs text-gray-400">{album.artisticLabel}</p>
            )}
          </div>

          {/* UPC */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
            <span className="text-xs font-semibold text-gray-500">UPC</span>
            <span className="font-mono text-xs text-gray-900">{album.upc}</span>
            {album.upc && <CopyButton value={album.upc} title="Copiar UPC" />}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <Music2 className="h-4 w-4 text-[#F97316]" />
            </div>
            <span className="text-xs font-medium text-gray-500">Pistas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{album.totalTracks}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Play className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Streams</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatStreams(album.totalStreams)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Ingresos Netos</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(album.totalNetIncome)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <DollarSign className="h-4 w-4 text-fuchsia-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Owner revenue</span>
          </div>
          <p className="text-2xl font-bold text-fuchsia-600">
            {formatCurrency(album.ownerEarnings ? parseFloat(album.ownerEarnings) : 0)}
          </p>
        </div>
      </div>

      {/* Performance Chart + Platforms */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-semibold text-gray-900">Rendimiento del álbum</h2>
              <p className="text-xs text-gray-400">Streams e ingresos por mes</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-sm bg-gray-900" />
                <span className="text-[11px] text-gray-500">Streams</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-sm bg-green-500" />
                <span className="text-[11px] text-gray-500">Ingresos</span>
              </div>
            </div>
          </div>

          {metricsLoading ? (
            <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
              Cargando métricas...
            </div>
          ) : monthlyMetrics.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-sm text-gray-400">
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

        {/* Platforms */}
        <Platforms reproductions={albumReproductions} />
      </div>

      {/* Tracks Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Pistas</span>
            <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              {filteredTracks.length}
            </span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título o ISRC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#F97316] focus:outline-none"
            />
          </div>
        </div>

        {filteredTracks.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="w-10 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1.5 transition-colors hover:text-gray-700"
                  >
                    Título
                    <SortIcon field="title" />
                  </button>
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 lg:table-cell">
                  ISRC
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <button
                    onClick={() => handleSort("streams")}
                    className="flex items-center gap-1.5 transition-colors hover:text-gray-700"
                  >
                    Streams
                    <SortIcon field="streams" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <button
                    onClick={() => handleSort("revenue")}
                    className="flex items-center gap-1.5 transition-colors hover:text-gray-700"
                  >
                    Ingresos
                    <SortIcon field="revenue" />
                  </button>
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">
                  Splits
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Colaboradores
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTracks.map((track: AlbumTrack, index: number) => (
                <tr
                  key={track.isrc || index}
                  onClick={() => navigate(`/panel/song/${track._id}`)}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                >
                  {/* # */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-400">{index + 1}</span>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
                        <Music2 className="h-4 w-4 text-[#F97316]" />
                      </div>
                      <p className="max-w-[180px] truncate text-sm font-semibold text-gray-900">
                        {track.trackTitle}
                      </p>
                    </div>
                  </td>

                  {/* ISRC */}
                  <td className="hidden px-4 py-4 lg:table-cell">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-500">
                      {track.isrc || "—"}
                      {track.isrc && <CopyButton value={track.isrc} title="Copiar ISRC" />}
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
                  <td className="hidden px-4 py-4 md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span
                        title={hasOwnerSplit(track) ? "Owner split creado" : "Sin owner split"}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                          hasOwnerSplit(track)
                            ? "bg-orange-50 text-[#F97316]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {hasOwnerSplit(track) ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        Owner
                      </span>
                      <span
                        title={
                          hasCollaboratorSplit(track)
                            ? "Split de colaborador creado"
                            : "Sin split de colaborador"
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                          hasCollaboratorSplit(track)
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {hasCollaboratorSplit(track) ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        Collab
                      </span>
                    </div>
                  </td>

                  {/* Colaboradores */}
                  <td className="px-4 py-4">
                    {collaboratorsCount(track) > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCollaboratorsModal(track.collaborators!);
                        }}
                        className="flex -space-x-2 transition-opacity hover:opacity-80"
                      >
                        {track.collaborators!.slice(0, 4).map((collaborator, idx) =>
                          collaborator?.image ? (
                            <img
                              key={collaborator._id || idx}
                              src={collaborator.image}
                              alt={collaborator.name || ""}
                              title={collaborator.name}
                              className="h-7 w-7 rounded-full border-2 border-white object-cover"
                            />
                          ) : (
                            <div
                              key={collaborator._id || idx}
                              title={collaborator.name}
                              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold ${getAvatarColor(collaborator.name)}`}
                            >
                              {getInitials(collaborator.name)}
                            </div>
                          ),
                        )}
                        {collaboratorsCount(track) > 4 && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100">
                            <span className="text-[10px] font-semibold text-gray-500">
                              +{collaboratorsCount(track) - 4}
                            </span>
                          </div>
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Users className="h-3.5 w-3.5" />
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
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Music2 className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-700">
              {search ? "Sin resultados" : "Sin pistas"}
            </p>
            <p className="max-w-xs text-xs text-gray-400">
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

      {/* Album Costs */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <AlbumExtraordinaryCosts
          albumId={album._id || album.id || ""}
          albumUpc={upc || album.upc || ""}
          tracks={album.tracks.map((t) => ({
            _id: t._id,
            trackTitle: t.trackTitle,
          }))}
        />
      </div>

      {/* Collaborators Modal */}
      {collaboratorsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setCollaboratorsModal(null)}
        >
          <div
            className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#F97316]" />
                <span className="text-sm font-semibold text-gray-900">
                  Colaboradores ({collaboratorsModal.length})
                </span>
              </div>
              <button
                onClick={() => setCollaboratorsModal(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <ul className="max-h-72 divide-y divide-gray-50 overflow-y-auto">
              {collaboratorsModal.map((c, idx) => (
                <li key={c._id || idx} className="flex items-center gap-3 px-6 py-3">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name || ""}
                      className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(c.name)}`}
                    >
                      {getInitials(c.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {c.name || "Sin nombre"}
                    </p>
                    {c._id && (
                      <p className="truncate font-mono text-[11px] text-gray-400">{c._id}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
