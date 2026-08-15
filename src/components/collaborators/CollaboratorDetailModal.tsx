import { useEffect, useState } from "react";
import {
  X,
  Crown,
  Mail,
  Music,
  Calendar,
  User,
  DollarSign,
  Headphones,
  ChevronRight,
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
  coverUrl?: string | null;
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
  streamsPctOfSong?: number;
  netPctOfSong?: number;
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
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const fmtStreams = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}K`
      : String(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });

const COVER_TINTS = ["#FF5C00", "#2FB37E", "#A6AAB2", "#101114"];

const ACTION_STYLES: Record<string, { label: string; cls: string }> = {
  create: { label: "Creado", cls: "bg-[#E4F5EC] text-[#2FB37E]" },
  update: { label: "Actualizado", cls: "bg-[#FFEADD] text-[#FF5C00]" },
  delete: { label: "Eliminado", cls: "bg-[#FEECEC] text-[#EF4444]" },
};

const SECTION_LABEL = "text-[10.5px] font-bold uppercase tracking-wide text-[#A6AAB2]";
const WHITE_CARD = "rounded-[16px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]";

/** Barra de porcentaje con etiqueta y valor exacto (1 decimal). */
function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[52px] flex-shrink-0 text-[9.5px] text-[#A6AAB2]">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EDEEF1]">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-11 flex-shrink-0 text-right text-[9.5px] font-semibold" style={{ color }}>
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CollaboratorDetailModal({
  collaborator,
  onClose,
  isOwner = true,
}: CollaboratorDetailModalProps) {
  const [detail, setDetail] = useState<ApiCollaboratorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSong, setSelectedSong] = useState<ApiSong | null>(null);

  const [metrics, setMetrics] = useState<CollaboratorMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [history, setHistory] = useState<SplitHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load collaborator detail
  useEffect(() => {
    CollaboratorService.getById(collaborator.id).then((response) => {
      const payload: ApiCollaboratorDetail | null = response?.data ?? null;
      if (payload) setDetail(payload);
      else setError(true);
      setLoading(false);
    });
  }, [collaborator.id]);

  // Load metrics (montos ajustados por split): se usan tanto en el resumen del
  // perfil como en el drill-down de cada canción, por eso se cargan junto con
  // el detalle en vez de esperar a que se abra una canción.
  useEffect(() => {
    setMetricsLoading(true);
    CollaboratorService.getSongMetrics(collaborator.id)
      .then((res) => setMetrics(res?.data ?? null))
      .catch(() => setMetrics(null))
      .finally(() => setMetricsLoading(false));
  }, [collaborator.id]);

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
  // Neto ajustado al split de este colaborador (neto de la canción, ya
  // descontada la parte del split owner), no el neto bruto de la canción.
  const totalOwed = metrics?.totals.totalOwed ?? 0;
  const owedBySongId = new Map(
    (metrics?.songs ?? []).map((s) => [s.songId, s.split?.totalOwed ?? 0]),
  );

  const songStreams = selectedSong?.totalStreams ?? 0;
  const songNet = selectedSong?.totalNetIncome ?? 0;

  // Platform data from the metrics endpoint (same source as the shown %).
  const selectedSongMetrics = metrics?.songs.find((s) => s.songId === selectedSong?.songId);
  const songStreamsExact = selectedSongMetrics?.totalStreams ?? songStreams;
  const songNetExact = selectedSongMetrics?.totalNetIncome ?? songNet;
  const songPlatforms = selectedSongMetrics?.byPlatform ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[940px] flex-col overflow-hidden rounded-[28px] bg-[#F4F5F7] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {selectedSong ? (
          // ── Song detail (drill-down) ──────────────────────────────────────
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-[22px] py-[18px]">
              <button
                onClick={() => setSelectedSong(null)}
                aria-label="Volver"
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#71757E] transition-colors hover:text-[#1C1D22] ${WHITE_CARD}`}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#FF5C00]">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-base font-semibold text-[#1C1D22]">
                  {selectedSong.trackTitle}
                </span>
                <span className="truncate text-[11.5px] text-[#A6AAB2]">
                  {selectedSong.artistName} · {selectedSong.isrc}
                </span>
              </div>
              {selectedSong.split && (
                <span className="flex-shrink-0 rounded-full bg-[#FF5C00] px-3.5 py-1.5 text-[13px] font-bold text-white">
                  {selectedSong.split.percentage}%
                </span>
              )}
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#71757E] transition-colors hover:text-[#1C1D22] ${WHITE_CARD}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-[22px] pb-[22px] pt-1 lg:flex-row lg:items-start">
              {/* Left */}
              <div className="flex flex-1 flex-col gap-4">
                <span className={SECTION_LABEL}>Rendimiento</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      label: "Streams canción",
                      value: songStreamsExact.toLocaleString("en-US"),
                      sub: "streams totales",
                      color: "#FF5C00",
                    },
                    {
                      label: "% del total streams",
                      value:
                        selectedSongMetrics?.streamsContributionPct != null
                          ? `${selectedSongMetrics.streamsContributionPct.toFixed(2)}%`
                          : "—",
                      sub: "de todos sus streams",
                      color: "#1C1D22",
                    },
                    {
                      label: "Neto canción",
                      value: fmt(songNetExact),
                      sub: "neto generado",
                      color: "#2FB37E",
                    },
                    {
                      label: "% del total neto",
                      value:
                        selectedSongMetrics?.netContributionPct != null
                          ? `${selectedSongMetrics.netContributionPct.toFixed(2)}%`
                          : "—",
                      sub: "del neto del colaborador",
                      color: "#1C1D22",
                    },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} className={`flex flex-col gap-0.5 p-3.5 ${WHITE_CARD}`}>
                      <span className="text-[9.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
                        {label}
                      </span>
                      <span className="text-base font-bold" style={{ color }}>
                        {value}
                      </span>
                      <span className="text-[9.5px] text-[#A6AAB2]">{sub}</span>
                    </div>
                  ))}
                </div>

                {selectedSongMetrics?.split && (
                  <>
                    <span className={SECTION_LABEL}>Split — {selectedSongMetrics.split.percentage}%</span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        {
                          label: "Adeudado",
                          value: fmt(selectedSongMetrics.split.totalOwed),
                          color: "#FF5C00",
                        },
                        {
                          label: "Pagado",
                          value: fmt(selectedSongMetrics.split.totalPaid),
                          color: "#2FB37E",
                        },
                        {
                          label: "Pendiente",
                          value: fmt(selectedSongMetrics.split.pendingAmount),
                          color: "#EF4444",
                        },
                      ].map(({ label, value, color }) => (
                        <div key={label} className={`flex flex-col gap-1 px-3 py-2.5 ${WHITE_CARD}`}>
                          <span className="text-[9.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
                            {label}
                          </span>
                          <span className="text-sm font-bold" style={{ color }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <span className={SECTION_LABEL}>Desglose por plataforma</span>
                {metricsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FF5C00] border-t-transparent" />
                  </div>
                ) : songPlatforms.length === 0 ? (
                  <p className="py-3 text-center text-[11px] text-[#A6AAB2]">
                    Sin datos de plataformas
                  </p>
                ) : (
                  songPlatforms
                    .slice()
                    .sort((a, b) => b.streams - a.streams)
                    .map((p) => (
                      <div key={p.platform} className={`flex flex-col gap-2.5 p-3.5 ${WHITE_CARD}`}>
                        <div className="flex items-center gap-3">
                          <span className="flex-1 text-[12.5px] font-semibold capitalize text-[#1C1D22]">
                            {p.platform}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#71757E]">
                            <Headphones className="h-3 w-3 text-[#FF5C00]" />
                            {p.streams.toLocaleString("en-US")}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#71757E]">
                            <DollarSign className="h-3 w-3 text-[#2FB37E]" />
                            {fmt(p.netIncome)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Bar label="Streams" pct={p.streamsPctOfSong ?? 0} color="#FF5C00" />
                          <Bar label="Ganancia" pct={p.netPctOfSong ?? 0} color="#2FB37E" />
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Right — History */}
              <div className="flex w-full flex-col gap-3 lg:w-[300px] lg:flex-shrink-0">
                <span className={SECTION_LABEL}>Historial de splits</span>
                {historyLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF5C00] border-t-transparent" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-[#A6AAB2]">
                    <History className="h-7 w-7" />
                    <p className="text-xs">Sin historial de splits</p>
                  </div>
                ) : (
                  history
                    .filter((e) => isOwner || e.role !== "owner")
                    .map((entry) => {
                      const style = ACTION_STYLES[entry.action] ?? ACTION_STYLES.update;
                      return (
                        <div key={entry._id} className={`flex flex-col gap-2 p-3.5 ${WHITE_CARD}`}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${style.cls}`}
                            >
                              {style.label}
                            </span>
                            {entry.percentage !== undefined && (
                              <span className="ml-auto text-xs font-bold text-[#FF5C00]">
                                {entry.percentage}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#71757E]">
                            <Calendar className="h-3 w-3 text-[#A6AAB2]" />
                            <span>{fmtDate(entry.createdAt)}</span>
                          </div>
                          {entry.updatedBy?.name && (
                            <span className="text-[11px] text-[#A6AAB2]">
                              Por:{" "}
                              <span className="font-semibold text-[#71757E]">
                                {entry.updatedBy.name}
                              </span>
                            </span>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-[22px] pb-[22px] pt-1">
              <button
                onClick={() => setSelectedSong(null)}
                className={`flex w-full items-center justify-center gap-2 bg-white py-3 text-[13.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#FBFBFC] ${WHITE_CARD}`}
              >
                <ArrowLeft className="h-4 w-4 text-[#71757E]" />
                Volver al perfil
              </button>
            </div>
          </>
        ) : (
          // ── Profile ───────────────────────────────────────────────────────
          <>
            {/* Hero */}
            <div className="flex flex-col gap-[18px] px-6 pb-[22px] pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#FF5C00]">
                  <span className="text-[22px] font-bold text-white">{collaborator.initials}</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <h3 className="truncate text-xl font-semibold text-[#1C1D22]">
                    {detail?.name ?? collaborator.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[12.5px] text-[#71757E]">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
                    <span className="truncate">{detail?.email ?? collaborator.email}</span>
                  </div>
                </div>
                <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
                  {(detail?.roles ?? collaborator.roles ?? []).map((r) => (
                    <span
                      key={r}
                      className="flex items-center gap-1.5 rounded-full bg-[#FFEADD] px-3 py-1.5 text-[11.5px] font-semibold capitalize text-[#FF5C00]"
                    >
                      <Crown className="h-3 w-3" />
                      {r}
                    </span>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#71757E] transition-colors hover:text-[#1C1D22] ${WHITE_CARD}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: <Music className="h-[18px] w-[18px] text-[#1C1D22]" />,
                    label: "Canciones",
                    value: String(detail?.songs.length ?? collaborator.songs),
                    color: "#1C1D22",
                  },
                  {
                    icon: <Headphones className="h-[18px] w-[18px] text-[#FF5C00]" />,
                    label: "Streams",
                    value: fmtStreams(totalStreams),
                    color: "#FF5C00",
                  },
                  {
                    icon: <DollarSign className="h-[18px] w-[18px] text-[#2FB37E]" />,
                    label: "Neto total",
                    value: fmt(totalOwed),
                    color: "#2FB37E",
                  },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} className={`flex items-center gap-3 p-3.5 ${WHITE_CARD}`}>
                    <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[12px] bg-[#F4F5F7]">
                      {icon}
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[11px] text-[#A6AAB2]">{label}</span>
                      <span className="text-[17px] font-bold" style={{ color }}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {detail && (detail.createdAt || detail.invitedBy) && (
                <div className={`flex flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 ${WHITE_CARD}`}>
                  {detail.createdAt && (
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 flex-shrink-0 text-[#A6AAB2]" />
                      <div className="flex flex-col">
                        <span className="text-[10.5px] text-[#A6AAB2]">Miembro desde</span>
                        <span className="text-[12.5px] font-semibold text-[#1C1D22]">
                          {fmtDate(detail.createdAt)}
                        </span>
                      </div>
                    </div>
                  )}
                  {detail.invitedBy && (
                    <div className="flex min-w-0 items-center gap-2.5">
                      <User className="h-4 w-4 flex-shrink-0 text-[#A6AAB2]" />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-[10.5px] text-[#A6AAB2]">Invitado por</span>
                        <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                          {detail.invitedBy.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Songs */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1C1D22]">Canciones</span>
                {detail && (
                  <span className="text-[11.5px] text-[#A6AAB2]">{detail.songs.length} en total</span>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF5C00] border-t-transparent" />
                </div>
              ) : error ? (
                <p className="py-6 text-center text-xs text-[#EF4444]">Error al cargar.</p>
              ) : detail?.songs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-[#A6AAB2]">
                  <Music className="h-7 w-7" />
                  <p className="text-xs">Sin canciones asociadas</p>
                </div>
              ) : (
                detail?.songs.map((song, idx) => (
                  <button
                    key={song.songId}
                    onClick={() => setSelectedSong(song)}
                    className={`flex w-full items-center gap-3 rounded-[16px] bg-white px-3.5 py-2.5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FBFBFC]`}
                  >
                    {song.coverUrl ? (
                      <img
                        src={song.coverUrl}
                        alt={song.trackTitle}
                        className="h-10 w-10 flex-shrink-0 rounded-[12px] object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[12px]"
                        style={{ backgroundColor: COVER_TINTS[idx % COVER_TINTS.length] }}
                      >
                        <Music className="h-4 w-4 text-white" />
                      </span>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[13px] font-semibold text-[#1C1D22]">
                        {song.trackTitle}
                      </span>
                      <span className="truncate text-[11px] text-[#A6AAB2]">{song.artistName}</span>
                    </div>
                    <span className="hidden w-[120px] items-center gap-1.5 md:flex">
                      <Headphones className="h-3.5 w-3.5 text-[#A6AAB2]" />
                      <span className="text-[12px] font-medium text-[#71757E]">
                        {fmtStreams(song.totalStreams)}
                      </span>
                    </span>
                    <span className="hidden w-[88px] text-[13px] font-bold text-[#2FB37E] sm:block">
                      {fmt(owedBySongId.get(song.songId) ?? 0)}
                    </span>
                    {song.split ? (
                      <span className="rounded-full bg-[#FFEADD] px-2.5 py-1 text-[12px] font-bold text-[#FF5C00]">
                        {song.split.percentage}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#A6AAB2]">Sin split</span>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-3">
              <button
                onClick={onClose}
                className="w-full rounded-[16px] bg-[#101114] py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#26272c]"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
