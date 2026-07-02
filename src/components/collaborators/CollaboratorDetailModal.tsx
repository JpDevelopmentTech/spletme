import { useEffect, useState } from "react";
import {
  X,
  Crown,
  Mail,
  Music,
  Calendar,
  UserCheck,
  DollarSign,
  Headphones,
  ChevronRight,
  ChevronDown,
  BarChart2,
  History,
  ArrowLeft,
} from "lucide-react";
import CollaboratorService from "@/services/collaborator";
import { songSplitsService } from "@/services/songSplits";
import type { Collaborator } from "@/types";

// ── API types ─────────────────────────────────────────────────────────────────

interface ApiSong {
  songId: string;
  trackTitle: string;
  artistName: string;
  isrc: string;
  upc: string;
  roles?: string[];
  totalStreams: number;
  totalNetIncome: number;
  totalGrossIncome: number;
  split: {
    splitId: string;
    percentage: number;
    totalOwed: number;
    totalPaid: number;
    pendingAmount: number;
  } | null;
}

interface ApiCollaboratorDetail {
  userId: string;
  userExternalId: string;
  email: string;
  name: string;
  roles: string[];
  invitedBy: { _id: string; name: string; email: string } | null;
  createdAt: string;
  songs: ApiSong[];
}

interface SplitHistoryEntry {
  _id: string;
  action: "create" | "update" | "delete";
  isDeleted: boolean;
  percentage: number;
  countriesType: string;
  selectedCountries: string[];
  platformsType: string;
  selectedPlatforms: string[];
  version: number;
  role: string;
  userId: string;
  songId: string;
  splitId: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: { _id: string; username: string; name: string; email: string };
  conditions: [];
}

interface PlatformEntry {
  platform: string;
  streams: number;
  netIncome: number;
  grossIncome: number;
  // % dentro de la canción (en byPlatform por canción)
  streamsPctOfSong?: number;
  netPctOfSong?: number;
  // % del total de todas las canciones (en byPlatform de totals)
  streamsPctOfTotal?: number;
  netPctOfTotal?: number;
}

interface SongMetrics {
  songId: string;
  trackTitle: string;
  artistName: string;
  isrc: string;
  upc: string;
  totalStreams: number;
  totalNetIncome: number;
  totalGrossIncome: number;
  streamsContributionPct: number;
  netContributionPct: number;
  byPlatform: PlatformEntry[];
  split: {
    splitId: string;
    percentage: number;
    totalOwed: number;
    totalPaid: number;
    pendingAmount: number;
  } | null;
}

interface CollaboratorTotals {
  totalStreams: number;
  totalNetIncome: number;
  totalGrossIncome: number;
  totalOwed: number;
  totalPaid: number;
  pendingAmount: number;
  byPlatform: PlatformEntry[];
}

interface CollaboratorMetrics {
  songs: SongMetrics[];
  totals: CollaboratorTotals;
}

interface CollaboratorDetailModalProps {
  collaborator: Collaborator;
  onClose: () => void;
  isOwner?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const fmtStreams = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}K`
      : String(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const ACTION_STYLES: Record<string, { label: string; cls: string }> = {
  create: { label: "Creado", cls: "bg-green-50 text-[#8B5CF6]" },
  update: { label: "Actualizado", cls: "bg-orange-50 text-[#F97316]" },
  delete: { label: "Eliminado", cls: "bg-red-50 text-red-500" },
};

// Barra con etiqueta y porcentaje exacto (2 decimales) a la derecha.
function PctBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 flex-shrink-0 text-[9px] text-[#9CA3AF]">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-11 flex-shrink-0 text-right text-[9px] font-semibold" style={{ color }}>
        {pct.toFixed(2)}%
      </span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CollaboratorDetailModal({ collaborator, onClose, isOwner = true }: CollaboratorDetailModalProps) {
  const [detail, setDetail] = useState<ApiCollaboratorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSong, setSelectedSong] = useState<ApiSong | null>(null);

  const [metrics, setMetrics] = useState<CollaboratorMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [history, setHistory] = useState<SplitHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [songsExpanded, setSongsExpanded] = useState(false);

  // Load collaborator detail
  useEffect(() => {
    CollaboratorService.getById(collaborator.id).then((response) => {
      const payload: ApiCollaboratorDetail | null = response?.data ?? null;
      if (payload) setDetail(payload);
      else setError(true);
      setLoading(false);
    });
  }, [collaborator.id]);

  // Load metrics once when panel opens
  useEffect(() => {
    if (!selectedSong || metrics) return;
    setMetricsLoading(true);
    CollaboratorService.getSongMetrics(collaborator.id)
      .then((res) => setMetrics(res?.data ?? null))
      .catch(() => setMetrics(null))
      .finally(() => setMetricsLoading(false));
  }, [selectedSong]);

  // Load history when a song is selected
  useEffect(() => {
    if (!selectedSong) return;
    setHistory([]);
    setHistoryLoading(true);
    songSplitsService
      .getSplitHistoryBySong(selectedSong.songId)
      .then((rows) => setHistory((rows ?? []) as unknown as SplitHistoryEntry[]))
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, [selectedSong?.songId]);

  const totalStreams = detail?.songs.reduce((s, x) => s + (x.totalStreams ?? 0), 0) ?? 0;
  const totalNet = detail?.songs.reduce((s, x) => s + (x.totalNetIncome ?? 0), 0) ?? 0;

  // Use metrics.totals when available, fall back to detail.songs
  const collaboratorTotalStreams =
    metrics?.totals.totalStreams ??
    detail?.songs.reduce((s, x) => s + (x.totalStreams ?? 0), 0) ??
    0;
  const collaboratorTotalNet =
    metrics?.totals.totalNetIncome ??
    detail?.songs.reduce((s, x) => s + (x.totalNetIncome ?? 0), 0) ??
    0;
  const songStreams = selectedSong?.totalStreams ?? 0;
  const songNet = selectedSong?.totalNetIncome ?? 0;

  // Platform data from metrics endpoint
  const selectedSongMetrics = metrics?.songs.find((s) => s.songId === selectedSong?.songId);
  // Muestra los valores de la canción desde la MISMA fuente que el porcentaje
  // (endpoint de métricas) para que el número mostrado y el % siempre cuadren.
  const songStreamsExact = selectedSongMetrics?.totalStreams ?? songStreams;
  const songNetExact = selectedSongMetrics?.totalNetIncome ?? songNet;
  const maxStreams = Math.max(collaboratorTotalStreams, songStreamsExact, 1);
  const songPlatforms = selectedSongMetrics?.byPlatform ?? [];
  const globalPlatforms = metrics?.totals.byPlatform ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center gap-4 overflow-x-auto bg-black/60 px-4"
      onClick={onClose}
    >
      {/* ── Main modal ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300"
        style={{ width: 820, height: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex flex-shrink-0 items-center justify-between bg-[#0F172A] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
            <span className="text-[11px] font-bold tracking-wider text-[#F97316]">
              PERFIL DEL COLABORADOR
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Profile panel */}
          <div className="flex w-64 flex-shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-[#FAFAFA]">
            <div className="flex flex-col items-center gap-2 border-b border-gray-100 px-5 py-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: collaborator.avatarBg }}
              >
                <span className="text-xl font-bold" style={{ color: collaborator.avatarText }}>
                  {collaborator.initials}
                </span>
              </div>
              <div className="flex w-full flex-col items-center gap-0.5">
                <h3 className="text-center text-sm font-bold text-[#111827]">
                  {detail?.name ?? collaborator.name}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="max-w-[160px] truncate">
                    {detail?.email ?? collaborator.email}
                  </span>
                </div>
              </div>
              {(detail?.roles?.length ?? collaborator.roles?.length ?? 0) > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {(detail?.roles ?? collaborator.roles ?? []).map((r) => (
                    <span
                      key={r}
                      className="inline-flex h-6 items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-2.5"
                    >
                      <Crown className="h-3 w-3 text-[#F97316]" />
                      <span className="text-[11px] font-semibold capitalize text-orange-900">
                        {r}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4">
              <span className="text-[10px] font-bold tracking-wider text-[#9CA3AF]">RESUMEN</span>
              <div className="flex flex-col gap-1.5">
                {[
                  {
                    icon: <Music className="h-3.5 w-3.5" />,
                    label: "Canciones",
                    value: detail?.songs.length ?? collaborator.songs,
                    cls: "text-[#111827]",
                  },
                  {
                    icon: <Headphones className="h-3.5 w-3.5" />,
                    label: "Streams",
                    value: fmtStreams(totalStreams),
                    cls: "text-[#F97316]",
                  },
                  {
                    icon: <DollarSign className="h-3.5 w-3.5" />,
                    label: "Neto total",
                    value: fmt(totalNet),
                    cls: "text-[#C084FC]",
                  },
                ].map(({ icon, label, value, cls }) => (
                  <div
                    key={label}
                    className="flex h-9 items-center justify-between rounded-lg border border-gray-100 bg-white px-3"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                      {icon}
                      <span>{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {detail && (detail.invitedBy || detail.createdAt) && (
              <div className="flex flex-col gap-2 px-4 py-4">
                <span className="text-[10px] font-bold tracking-wider text-[#9CA3AF]">INFO</span>
                <div className="flex flex-col gap-2.5">
                  {detail.createdAt && (
                    <div className="flex items-start gap-2">
                      <Calendar className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#9CA3AF]" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#9CA3AF]">Miembro desde</span>
                        <span className="text-[11px] font-semibold text-[#374151]">
                          {fmtDate(detail.createdAt)}
                        </span>
                      </div>
                    </div>
                  )}
                  {detail.invitedBy && (
                    <div className="flex items-start gap-2">
                      <UserCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#9CA3AF]" />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-[10px] text-[#9CA3AF]">Invitado por</span>
                        <span className="truncate text-[11px] font-semibold text-[#374151]">
                          {detail.invitedBy.name}
                        </span>
                        <span className="truncate text-[10px] text-[#9CA3AF]">
                          {detail.invitedBy.email}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Songs panel */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
              <span className="text-[11px] font-bold tracking-wider text-[#9CA3AF]">CANCIONES</span>
              {detail && (
                <span className="text-[10px] text-[#9CA3AF]">{detail.songs.length} en total</span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3">
              {loading && (
                <div className="flex h-full items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent" />
                </div>
              )}
              {!loading && error && (
                <p className="py-4 text-center text-xs text-red-400">Error al cargar.</p>
              )}
              {!loading &&
                !error &&
                detail?.songs.map((song) => {
                  const isSelected = selectedSong?.songId === song.songId;
                  return (
                    <button
                      key={song.songId}
                      onClick={() => setSelectedSong(isSelected ? null : song)}
                      className={`group flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        isSelected
                          ? "border-orange-200 bg-orange-50"
                          : "border-gray-100 bg-[#F9FAFB] hover:border-orange-200 hover:bg-orange-50/40"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${isSelected ? "bg-[#F97316]" : "bg-orange-100 group-hover:bg-[#F97316]"}`}
                      >
                        <Music
                          className={`h-3.5 w-3.5 transition-colors ${isSelected ? "text-white" : "text-[#F97316] group-hover:text-white"}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p
                          className={`truncate text-xs font-bold ${isSelected ? "text-[#F97316]" : "text-[#111827]"}`}
                          title={song.trackTitle}
                        >
                          {song.trackTitle}
                        </p>
                        <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1">
                          <p className="truncate text-[10px] text-[#6B7280]">{song.artistName}</p>
                          {(song.roles ?? []).map((r) => (
                            <span
                              key={r}
                              className="flex-shrink-0 rounded-full bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold capitalize leading-none text-purple-600"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-2 flex flex-shrink-0 items-center gap-1.5">
                        {song.split ? (
                          <span
                            className={`whitespace-nowrap text-[11px] font-bold ${isSelected ? "text-[#F97316]" : "text-[#9CA3AF]"}`}
                          >
                            {song.split.percentage}%
                          </span>
                        ) : (
                          <span className="whitespace-nowrap text-[9px] text-gray-300">
                            Sin split
                          </span>
                        )}
                        <ChevronRight
                          className={`h-3.5 w-3.5 flex-shrink-0 transition-colors ${isSelected ? "text-[#F97316]" : "text-gray-300 group-hover:text-[#F97316]"}`}
                        />
                      </div>
                    </button>
                  );
                })}
              {!loading && !error && detail?.songs.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-[#9CA3AF]">
                  <Music className="h-7 w-7" />
                  <p className="text-xs">Sin canciones asociadas</p>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3">
              <button
                onClick={onClose}
                className="h-9 w-full rounded-lg border border-gray-200 bg-white text-[12px] font-semibold text-[#111827] transition-colors hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics modal — slides in from right ───────────────────────── */}
      <div
        className="flex flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300"
        style={{
          width: selectedSong ? 680 : 0,
          height: "90vh",
          opacity: selectedSong ? 1 : 0,
          pointerEvents: selectedSong ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {selectedSong && (
          <>
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between bg-[#0F172A] px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#F97316]">
                  <Music className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="max-w-[280px] truncate text-xs font-bold text-white">
                    {selectedSong.trackTitle}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {selectedSong.artistName} · {selectedSong.isrc}
                  </span>
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                {selectedSong.split && (
                  <span className="flex h-6 items-center rounded-full bg-[#F97316] px-2.5 text-xs font-bold text-white">
                    {selectedSong.split.percentage}%
                  </span>
                )}
                <button
                  onClick={() => setSelectedSong(null)}
                  className="rounded-md p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Two columns */}
            <div className="flex min-h-0 flex-1 divide-x divide-gray-100">
              {/* Performance — built from detail.songs */}
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex flex-shrink-0 items-center gap-1.5 border-b border-gray-100 px-4 py-2.5">
                  <BarChart2 className="h-3.5 w-3.5 text-[#F97316]" />
                  <span className="text-[11px] font-bold tracking-wider text-[#374151]">
                    RENDIMIENTO
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "Streams canción",
                        value: songStreamsExact.toLocaleString("en-US"),
                        sub: "streams totales",
                        color: "#F97316",
                      },
                      {
                        label: "% del total streams",
                        value:
                          selectedSongMetrics?.streamsContributionPct != null
                            ? `${selectedSongMetrics.streamsContributionPct.toFixed(2)}%`
                            : "—",
                        sub: "de todos sus streams",
                        color: "#06B6D4",
                      },
                      {
                        label: "Neto canción",
                        value: fmt(songNetExact),
                        sub: "neto generado",
                        color: "#C084FC",
                      },
                      {
                        label: "% del total neto",
                        value:
                          selectedSongMetrics?.netContributionPct != null
                            ? `${selectedSongMetrics.netContributionPct.toFixed(2)}%`
                            : "—",
                        sub: "del neto total del colaborador",
                        color: "#8B5CF6",
                      },
                    ].map(({ label, value, sub, color }) => (
                      <div
                        key={label}
                        className="flex flex-col gap-0.5 rounded-xl border border-gray-100 bg-[#F9FAFB] px-3 py-2.5"
                      >
                        <span className="text-[9px] uppercase tracking-wide text-[#9CA3AF]">
                          {label}
                        </span>
                        <span className="text-sm font-bold" style={{ color }}>
                          {value}
                        </span>
                        <span className="text-[9px] text-[#9CA3AF]">{sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Split financials from metrics */}
                  {selectedSongMetrics?.split && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold tracking-wider text-[#9CA3AF]">
                        SPLIT — {selectedSongMetrics.split.percentage}%
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          {
                            label: "Adeudado",
                            value: fmt(selectedSongMetrics.split.totalOwed),
                            color: "#F97316",
                          },
                          {
                            label: "Pagado",
                            value: fmt(selectedSongMetrics.split.totalPaid),
                            color: "#34D399",
                          },
                          {
                            label: "Pendiente",
                            value: fmt(selectedSongMetrics.split.pendingAmount),
                            color: "#F43F5E",
                          },
                        ].map(({ label, value, color }) => (
                          <div
                            key={label}
                            className="flex flex-col gap-0.5 rounded-xl border border-gray-100 bg-[#F9FAFB] px-2.5 py-2"
                          >
                            <span className="text-[9px] uppercase tracking-wide text-[#9CA3AF]">
                              {label}
                            </span>
                            <span className="text-[11px] font-bold" style={{ color }}>
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comparison bars */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-[#9CA3AF]">
                      COMPARATIVA DE STREAMS
                    </span>
                    <div className="flex flex-col gap-1.5 rounded-xl border border-gray-100 bg-[#F9FAFB] px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-14 flex-shrink-0 text-[9px] text-[#9CA3AF]">Total</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#06B6D4]"
                            style={{ width: "100%" }}
                          />
                        </div>
                        <span className="w-16 flex-shrink-0 text-right text-[9px] text-[#9CA3AF]">
                          {collaboratorTotalStreams.toLocaleString("en-US")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-14 flex-shrink-0 text-[9px] text-[#9CA3AF]">
                          Canción
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#F97316]"
                            style={{
                              width: `${(songStreamsExact / maxStreams) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-16 flex-shrink-0 text-right text-[9px] font-semibold text-[#F97316]">
                          {songStreamsExact.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-xl border border-gray-100 bg-[#F9FAFB] px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-14 flex-shrink-0 text-[9px] text-[#9CA3AF]">Total</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#8B5CF6]"
                            style={{ width: "100%" }}
                          />
                        </div>
                        <span className="w-16 flex-shrink-0 text-right text-[9px] text-[#9CA3AF]">
                          {fmt(collaboratorTotalNet)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-14 flex-shrink-0 text-[9px] text-[#9CA3AF]">
                          Canción
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#C084FC]"
                            style={{
                              width: `${(songNetExact / Math.max(collaboratorTotalNet, songNetExact, 1)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-16 flex-shrink-0 text-right text-[9px] font-semibold text-[#C084FC]">
                          {fmt(songNetExact)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Platform breakdown from /metrics endpoint */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-[#9CA3AF]">
                      DESGLOSE POR PLATAFORMA
                    </span>
                    {metricsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent" />
                      </div>
                    ) : songPlatforms.length === 0 ? (
                      <p className="py-3 text-center text-[10px] text-[#9CA3AF]">
                        Sin datos de plataformas
                      </p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {/* Song platforms */}
                        {songPlatforms
                          .slice()
                          .sort((a, b) => b.streams - a.streams)
                          .map((p) => {
                            const globalEntry = globalPlatforms.find(
                              (g) => g.platform === p.platform,
                            );
                            // Porcentajes exactos calculados en el backend.
                            const streamsPctSong = p.streamsPctOfSong ?? 0;
                            const netPctSong = p.netPctOfSong ?? 0;
                            const streamsPctTotal = globalEntry?.streamsPctOfTotal ?? 0;
                            const netPctTotal = globalEntry?.netPctOfTotal ?? 0;
                            return (
                              <div
                                key={p.platform}
                                className="flex flex-col gap-1.5 rounded-xl border border-gray-100 bg-[#F9FAFB] px-3 py-2.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold capitalize text-[#111827]">
                                    {p.platform}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div className="flex flex-col gap-0.5 rounded-lg border border-gray-100 bg-white px-2 py-1.5">
                                    <span className="text-[9px] uppercase tracking-wide text-[#9CA3AF]">
                                      Streams
                                    </span>
                                    <div className="flex items-center gap-1 text-[#06B6D4]">
                                      <Headphones className="h-2.5 w-2.5" />
                                      <span className="text-[10px] font-bold">
                                        {p.streams.toLocaleString("en-US")}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-0.5 rounded-lg border border-gray-100 bg-white px-2 py-1.5">
                                    <span className="text-[9px] uppercase tracking-wide text-[#9CA3AF]">
                                      Neto
                                    </span>
                                    <div className="flex items-center gap-1 text-[#8B5CF6]">
                                      <DollarSign className="h-2.5 w-2.5" />
                                      <span className="text-[10px] font-bold">
                                        {fmt(p.netIncome)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {/* % de STREAMS: dentro de la canción y del total */}
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1">
                                    <Headphones className="h-2.5 w-2.5 text-[#06B6D4]" />
                                    <span className="text-[9px] font-bold uppercase tracking-wide text-[#06B6D4]">
                                      Streams
                                    </span>
                                  </div>
                                  <PctBar label="Canción" pct={streamsPctSong} color="#F97316" />
                                  <PctBar label="Total" pct={streamsPctTotal} color="#06B6D4" />
                                </div>
                                {/* % de GANANCIA (neto): dentro de la canción y del total */}
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-2.5 w-2.5 text-[#8B5CF6]" />
                                    <span className="text-[9px] font-bold uppercase tracking-wide text-[#8B5CF6]">
                                      Ganancia
                                    </span>
                                  </div>
                                  <PctBar label="Canción" pct={netPctSong} color="#F97316" />
                                  <PctBar label="Total" pct={netPctTotal} color="#8B5CF6" />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                  {/* All songs ranking — collapsible, closed by default */}
                  <div className="flex flex-col gap-0">
                    <button
                      onClick={() => setSongsExpanded((v) => !v)}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-[#F9FAFB] px-3 py-2.5 transition-colors hover:bg-gray-100"
                    >
                      <span className="text-[10px] font-bold tracking-wider text-[#9CA3AF]">
                        CANCIONES DEL COLABORADOR
                      </span>
                      {songsExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF]" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-[#9CA3AF]" />
                      )}
                    </button>
                    {songsExpanded && (
                      <div className="mt-1.5 flex flex-col gap-1.5">
                        {detail?.songs
                          .slice()
                          .sort((a, b) => b.totalStreams - a.totalStreams)
                          .map((song) => {
                            const isThis = song.songId === selectedSong?.songId;
                            const pct = (song.totalStreams / maxStreams) * 100;
                            return (
                              <div
                                key={song.songId}
                                className={`flex flex-col gap-1 rounded-lg border px-2.5 py-2 ${isThis ? "border-orange-200 bg-orange-50" : "border-gray-100 bg-[#F9FAFB]"}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`max-w-[120px] truncate text-[10px] font-semibold ${isThis ? "text-[#F97316]" : "text-[#374151]"}`}
                                  >
                                    {song.trackTitle}
                                  </span>
                                  <span className="text-[10px] text-[#9CA3AF]">
                                    {song.totalStreams.toLocaleString("en-US")}
                                  </span>
                                </div>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${pct}%`,
                                      backgroundColor: isThis ? "#F97316" : "#34D399",
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* History */}
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex flex-shrink-0 items-center gap-1.5 border-b border-gray-100 px-4 py-2.5">
                  <History className="h-3.5 w-3.5 text-[#F97316]" />
                  <span className="text-[11px] font-bold tracking-wider text-[#374151]">
                    HISTORIAL DE SPLITS
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3">
                  {historyLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent" />
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-[#9CA3AF]">
                      <History className="h-7 w-7" />
                      <p className="text-xs">Sin historial de splits</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {history.filter((e) => isOwner || e.role !== "owner").map((entry) => {
                        const style = ACTION_STYLES[entry.action] ?? ACTION_STYLES.update;
                        return (
                          <div
                            key={entry._id}
                            className="flex flex-col gap-1.5 rounded-xl border border-gray-100 bg-[#F9FAFB] px-3 py-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`flex h-5 items-center rounded-full px-2 text-[10px] font-bold ${style.cls}`}
                              >
                                {style.label}
                              </span>
                              {entry.percentage !== undefined && (
                                <span className="text-xs font-bold text-[#F97316]">
                                  {entry.percentage}%
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5 text-[10px] text-[#6B7280]">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-2.5 w-2.5" />
                                <span>{fmtDate(entry.createdAt)}</span>
                              </div>
                              {entry.updatedBy?.name && (
                                <span className="truncate">
                                  Por:{" "}
                                  <span className="font-semibold text-[#374151]">
                                    {entry.updatedBy.name}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-gray-100 px-4 py-3">
              <button
                onClick={() => setSelectedSong(null)}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-[12px] font-semibold text-[#111827] transition-colors hover:bg-gray-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver al perfil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
