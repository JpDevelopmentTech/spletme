import { useEffect, useState } from "react";
import {
  X, Crown, Mail, Music, Calendar, UserCheck, DollarSign,
  Headphones, ChevronRight, BarChart2, History, ArrowLeft,
} from "lucide-react";
import CollaboratorService from "@/services/collaborator";
import { analyticsService } from "@/services/analyticsService";
import { splitsService } from "@/services/splits";
import type { PlatformCountryRow } from "@/types/analytics.types";
import type { Collaborator } from "@/types";

// ── API types ─────────────────────────────────────────────────────────────────

interface ApiSong {
  songId: string;
  trackTitle: string;
  artistName: string;
  isrc: string;
  upc: string;
  totalStreams: number;
  totalNetIncome: number;
  totalGrossIncome: number;
  split: { splitId: string; percentage: number } | null;
}

interface ApiCollaboratorDetail {
  userId: string;
  userExternalId: string;
  email: string;
  name: string;
  role: string;
  invitedBy: { _id: string; name: string; email: string } | null;
  createdAt: string;
  songs: ApiSong[];
}

interface SplitHistoryEntry {
  _id: string;
  action: "create" | "update" | "delete";
  isDeleted: boolean;
  collaboratorId: { _id: string; username: string; email: string; name?: string };
  conditions: Array<{ percentage: number; countriesType: string; selectedCountries: string[]; selectedPlatforms: string[] }>;
  createdAt: string;
  originalCreatedAt: string;
  originalUpdatedAt: string;
  songId: string;
  splitId: { _id: string };
  updatedAt: string;
  updatedBy: { _id: string; username: string; name: string };
}

interface CollaboratorDetailModalProps {
  collaborator: Collaborator;
  onClose: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const fmtStreams = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });

const PLATFORM_COLORS: Record<string, string> = {
  spotify: "#1DB954",
  "apple music": "#FC3C44",
  youtube: "#FF0000",
  deezer: "#EF5466",
  tidal: "#000000",
  amazon: "#FF9900",
};
const platformColor = (name: string) => PLATFORM_COLORS[name.toLowerCase()] ?? "#F97316";

const ACTION_STYLES: Record<string, { label: string; cls: string }> = {
  create: { label: "Creado",     cls: "bg-green-50 text-green-600" },
  update: { label: "Actualizado", cls: "bg-orange-50 text-[#F97316]" },
  delete: { label: "Eliminado",  cls: "bg-red-50 text-red-500" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function CollaboratorDetailModal({ collaborator, onClose }: CollaboratorDetailModalProps) {
  const [detail, setDetail]         = useState<ApiCollaboratorDetail | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [selectedSong, setSelectedSong] = useState<ApiSong | null>(null);

  const [platforms, setPlatforms]           = useState<PlatformCountryRow[]>([]);
  const [platformsLoading, setPlatformsLoading] = useState(false);
  const [history, setHistory]               = useState<SplitHistoryEntry[]>([]);
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

  // Load metrics when a song is selected
  useEffect(() => {
    if (!selectedSong) return;

    setPlatforms([]);
    setPlatformsLoading(true);
    analyticsService
      .getSongPlatformSummary(selectedSong.isrc)
      .then((rows) => setPlatforms(rows ?? []))
      .catch(() => setPlatforms([]))
      .finally(() => setPlatformsLoading(false));

    setHistory([]);
    setHistoryLoading(true);
    splitsService
      .getUserSplitHistory(collaborator.id)
      .then((rows) => setHistory((rows ?? []) as unknown as SplitHistoryEntry[]))
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, [selectedSong]);

  const totalStreams = detail?.songs.reduce((s, x) => s + (x.totalStreams ?? 0), 0) ?? 0;
  const totalNet     = detail?.songs.reduce((s, x) => s + (x.totalNetIncome ?? 0), 0) ?? 0;

  const platformSummary = platforms.reduce<Record<string, { streams: number; netIncome: number }>>((acc, row) => {
    if (!acc[row.platform]) acc[row.platform] = { streams: 0, netIncome: 0 };
    acc[row.platform].streams   += row.streams;
    acc[row.platform].netIncome += row.netIncome;
    return acc;
  }, {});
  const maxStreams = Math.max(...Object.values(platformSummary).map((p) => p.streams), 1);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center gap-4 px-4 overflow-x-auto"
      onClick={onClose}
    >
      {/* ── Main modal ─────────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col flex-shrink-0 transition-all duration-300"
        style={{ width: 672, height: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#0F172A] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full" />
            <span className="text-[11px] font-bold text-[#F97316] tracking-wider">PERFIL DEL COLABORADOR</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Profile panel */}
          <div className="w-64 flex-shrink-0 flex flex-col border-r border-gray-100 bg-[#FAFAFA] overflow-y-auto">
            <div className="flex flex-col items-center gap-2 px-5 py-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: collaborator.avatarBg }}>
                <span className="text-xl font-bold" style={{ color: collaborator.avatarText }}>{collaborator.initials}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 w-full">
                <h3 className="text-sm font-bold text-[#111827] text-center">{detail?.name ?? collaborator.name}</h3>
                <div className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[160px]">{detail?.email ?? collaborator.email}</span>
                </div>
              </div>
              {(detail?.role ?? collaborator.role) && (
                <span className="inline-flex items-center gap-1 px-2.5 h-6 bg-orange-50 border border-orange-100 rounded-full">
                  <Crown className="w-3 h-3 text-[#F97316]" />
                  <span className="text-[11px] font-semibold text-orange-900 capitalize">{detail?.role ?? collaborator.role}</span>
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 px-4 py-4 border-b border-gray-100">
              <span className="text-[10px] font-bold text-[#9CA3AF] tracking-wider">RESUMEN</span>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: <Music className="w-3.5 h-3.5" />, label: "Canciones", value: detail?.songs.length ?? collaborator.songs, cls: "text-[#111827]" },
                  { icon: <Headphones className="w-3.5 h-3.5" />, label: "Streams", value: fmtStreams(totalStreams), cls: "text-[#F97316]" },
                  { icon: <DollarSign className="w-3.5 h-3.5" />, label: "Neto total", value: fmt(totalNet), cls: "text-green-500" },
                ].map(({ icon, label, value, cls }) => (
                  <div key={label} className="flex items-center justify-between px-3 h-9 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">{icon}<span>{label}</span></div>
                    <span className={`text-sm font-bold ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {detail && (detail.invitedBy || detail.createdAt) && (
              <div className="flex flex-col gap-2 px-4 py-4">
                <span className="text-[10px] font-bold text-[#9CA3AF] tracking-wider">INFO</span>
                <div className="flex flex-col gap-2.5">
                  {detail.createdAt && (
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#9CA3AF] mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#9CA3AF]">Miembro desde</span>
                        <span className="text-[11px] font-semibold text-[#374151]">{fmtDate(detail.createdAt)}</span>
                      </div>
                    </div>
                  )}
                  {detail.invitedBy && (
                    <div className="flex items-start gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-[#9CA3AF] mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-[#9CA3AF]">Invitado por</span>
                        <span className="text-[11px] font-semibold text-[#374151] truncate">{detail.invitedBy.name}</span>
                        <span className="text-[10px] text-[#9CA3AF] truncate">{detail.invitedBy.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Songs panel */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <span className="text-[11px] font-bold text-[#9CA3AF] tracking-wider">CANCIONES</span>
              {detail && <span className="text-[10px] text-[#9CA3AF]">{detail.songs.length} en total</span>}
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-5 h-5 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!loading && error && <p className="text-xs text-red-400 text-center py-4">Error al cargar.</p>}
              {!loading && !error && detail?.songs.map((song) => {
                const isSelected = selectedSong?.songId === song.songId;
                return (
                  <button
                    key={song.songId}
                    onClick={() => setSelectedSong(isSelected ? null : song)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all group ${
                      isSelected
                        ? "bg-orange-50 border-orange-200"
                        : "bg-[#F9FAFB] border-gray-100 hover:border-orange-200 hover:bg-orange-50/40"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "bg-[#F97316]" : "bg-orange-100 group-hover:bg-[#F97316]"}`}>
                      <Music className={`w-3.5 h-3.5 transition-colors ${isSelected ? "text-white" : "text-[#F97316] group-hover:text-white"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isSelected ? "text-[#F97316]" : "text-[#111827]"}`}>{song.trackTitle}</p>
                      <p className="text-[10px] text-[#6B7280] truncate">{song.artistName}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {song.split
                        ? <span className={`text-[10px] font-bold ${isSelected ? "text-[#F97316]" : "text-[#9CA3AF]"}`}>{song.split.percentage}%</span>
                        : <span className="text-[9px] text-gray-300">Sin split</span>
                      }
                      <ChevronRight className={`w-3.5 h-3.5 transition-colors ${isSelected ? "text-[#F97316]" : "text-gray-300 group-hover:text-[#F97316]"}`} />
                    </div>
                  </button>
                );
              })}
              {!loading && !error && detail?.songs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-[#9CA3AF]">
                  <Music className="w-7 h-7" />
                  <p className="text-xs">Sin canciones asociadas</p>
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <button onClick={onClose} className="w-full h-9 bg-white border border-gray-200 hover:bg-gray-50 text-[#111827] text-[12px] font-semibold rounded-lg transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics modal — slides in from right ───────────────────────── */}
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width: selectedSong ? 560 : 0,
          height: "90vh",
          opacity: selectedSong ? 1 : 0,
          pointerEvents: selectedSong ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {selectedSong && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate max-w-[280px]">{selectedSong.trackTitle}</span>
                  <span className="text-[10px] text-gray-400">{selectedSong.artistName} · {selectedSong.isrc}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {selectedSong.split && (
                  <span className="text-xs font-bold text-white bg-[#F97316] px-2.5 h-6 rounded-full flex items-center">
                    {selectedSong.split.percentage}%
                  </span>
                )}
                <button onClick={() => setSelectedSong(null)} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Two columns */}
            <div className="flex flex-1 min-h-0 divide-x divide-gray-100">
              {/* Platforms */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
                  <BarChart2 className="w-3.5 h-3.5 text-[#F97316]" />
                  <span className="text-[11px] font-bold text-[#374151] tracking-wider">PLATAFORMAS</span>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3">
                  {platformsLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-5 h-5 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : Object.keys(platformSummary).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-[#9CA3AF]">
                      <BarChart2 className="w-7 h-7" />
                      <p className="text-xs">Sin datos de plataformas</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {Object.entries(platformSummary)
                        .sort((a, b) => b[1].streams - a[1].streams)
                        .map(([name, data]) => (
                          <div key={name} className="flex flex-col gap-1.5 px-3 py-2.5 bg-[#F9FAFB] rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platformColor(name) }} />
                                <span className="text-xs font-semibold text-[#111827] capitalize">{name}</span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px]">
                                <div className="flex items-center gap-1 text-[#6B7280]">
                                  <Headphones className="w-3 h-3" /><span>{fmtStreams(data.streams)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-green-600 font-semibold">
                                  <DollarSign className="w-3 h-3" /><span>{fmt(data.netIncome)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(data.streams / maxStreams) * 100}%`, backgroundColor: platformColor(name) }} />
                            </div>
                          </div>
                        ))}

                      {platforms.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-1">
                          <span className="text-[10px] font-bold text-[#9CA3AF] tracking-wider">POR PAÍS</span>
                          {platforms
                            .sort((a, b) => b.streams - a.streams)
                            .slice(0, 6)
                            .map((row, i) => (
                              <div key={i} className="flex items-center justify-between px-2 py-1.5 bg-[#F9FAFB] rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-[#6B7280] capitalize w-16 truncate">{row.platform}</span>
                                  <span className="text-[10px] font-semibold text-[#374151]">{row.country}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px]">
                                  <span className="text-[#9CA3AF]">{fmtStreams(row.streams)}</span>
                                  <span className="text-green-600 font-semibold">{fmt(row.netIncome)}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* History */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
                  <History className="w-3.5 h-3.5 text-[#F97316]" />
                  <span className="text-[11px] font-bold text-[#374151] tracking-wider">HISTORIAL DE SPLITS</span>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3">
                  {historyLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-5 h-5 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-[#9CA3AF]">
                      <History className="w-7 h-7" />
                      <p className="text-xs">Sin historial de splits</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {[
                        ...history.filter((e) => e.songId === selectedSong?.songId),
                        ...history.filter((e) => e.songId !== selectedSong?.songId),
                      ].map((entry) => {
                        const style      = ACTION_STYLES[entry.action] ?? ACTION_STYLES.update;
                        const pct        = entry.conditions?.[0]?.percentage;
                        const isThisSong = entry.songId === selectedSong?.songId;
                        return (
                          <div key={entry._id} className="flex flex-col gap-1.5 px-3 py-2.5 bg-[#F9FAFB] rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold px-2 h-5 rounded-full flex items-center ${style.cls}`}>
                                  {style.label}
                                </span>
                                {isThisSong && (
                                  <div className="w-4 h-4 bg-[#F97316] rounded-full flex items-center justify-center" title={selectedSong?.trackTitle}>
                                    <Music className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                              </div>
                              {pct !== undefined && (
                                <span className="text-xs font-bold text-[#F97316]">{pct}%</span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5 text-[10px] text-[#6B7280]">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                <span>{fmtDate(entry.createdAt)}</span>
                              </div>
                              {entry.updatedBy?.name && (
                                <span className="truncate">Por: <span className="font-semibold text-[#374151]">{entry.updatedBy.name}</span></span>
                              )}
                              {entry.collaboratorId?.username && (
                                <span className="truncate">Colaborador: <span className="font-semibold text-[#374151]">{entry.collaboratorId.username}</span></span>
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
            <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setSelectedSong(null)}
                className="w-full h-9 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#111827] text-[12px] font-semibold rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver al perfil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
