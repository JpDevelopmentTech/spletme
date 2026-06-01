import { useEffect, useState } from "react";
import { X, Crown, Mail, Music, Calendar, UserCheck, TrendingUp, DollarSign, Headphones } from "lucide-react";
import CollaboratorService from "@/services/collaborator";
import type { Collaborator } from "@/types";

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

interface CollaboratorDetailModalProps {
  collaborator: Collaborator;
  onClose: () => void;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const fmtStreams = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });

export function CollaboratorDetailModal({ collaborator, onClose }: CollaboratorDetailModalProps) {
  const [detail, setDetail] = useState<ApiCollaboratorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    CollaboratorService.getById(collaborator.id).then((response) => {
      const payload: ApiCollaboratorDetail | null = response?.data ?? null;
      if (payload) setDetail(payload);
      else setError(true);
      setLoading(false);
    });
  }, [collaborator.id]);

  const totalStreams = detail?.songs.reduce((s, x) => s + (x.totalStreams ?? 0), 0) ?? 0;
  const totalNet = detail?.songs.reduce((s, x) => s + (x.totalNetIncome ?? 0), 0) ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#0F172A] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full" />
            <span className="text-[11px] font-bold text-[#F97316] tracking-wider">PERFIL DEL COLABORADOR</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Two-panel body */}
        <div className="flex flex-1 min-h-0">

          {/* LEFT — profile */}
          <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-100 bg-[#FAFAFA]">
            {/* Avatar block */}
            <div className="flex flex-col items-center gap-2 px-5 py-6 border-b border-gray-100">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: collaborator.avatarBg }}
              >
                <span className="text-xl font-bold" style={{ color: collaborator.avatarText }}>
                  {collaborator.initials}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5 w-full">
                <h3 className="text-sm font-bold text-[#111827] text-center leading-tight">
                  {detail?.name ?? collaborator.name}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[160px]">{detail?.email ?? collaborator.email}</span>
                </div>
              </div>
              {(detail?.role ?? collaborator.role) && (
                <span className="inline-flex items-center gap-1 px-2.5 h-6 bg-orange-50 border border-orange-100 rounded-full">
                  <Crown className="w-3 h-3 text-[#F97316]" />
                  <span className="text-[11px] font-semibold text-orange-900 capitalize">
                    {detail?.role ?? collaborator.role}
                  </span>
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-2 px-4 py-4 border-b border-gray-100">
              <span className="text-[10px] font-bold text-[#9CA3AF] tracking-wider">RESUMEN</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-3 h-9 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <Music className="w-3.5 h-3.5" />
                    <span>Canciones</span>
                  </div>
                  <span className="text-sm font-bold text-[#111827]">{detail?.songs.length ?? collaborator.songs}</span>
                </div>
                <div className="flex items-center justify-between px-3 h-9 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Streams</span>
                  </div>
                  <span className="text-sm font-bold text-[#F97316]">{fmtStreams(totalStreams)}</span>
                </div>
                <div className="flex items-center justify-between px-3 h-9 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Neto total</span>
                  </div>
                  <span className="text-sm font-bold text-green-500">{fmt(totalNet)}</span>
                </div>
              </div>
            </div>

            {/* Meta */}
            {detail && (detail.invitedBy || detail.createdAt) && (
              <div className="flex flex-col gap-2 px-4 py-4">
                <span className="text-[10px] font-bold text-[#9CA3AF] tracking-wider">INFO</span>
                <div className="flex flex-col gap-1.5">
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

          {/* RIGHT — songs */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <span className="text-[11px] font-bold text-[#9CA3AF] tracking-wider">CANCIONES</span>
              {detail && (
                <span className="text-[10px] text-[#9CA3AF]">{detail.songs.length} en total</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-5 h-5 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!loading && error && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-red-400">No se pudieron cargar los detalles.</p>
                </div>
              )}

              {!loading && !error && detail && detail.songs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-[#9CA3AF]">
                  <Music className="w-8 h-8" />
                  <p className="text-xs">Sin canciones asociadas</p>
                </div>
              )}

              {!loading && !error && detail && detail.songs.length > 0 && (
                <div className="flex flex-col gap-2">
                  {detail.songs.map((song) => (
                    <div
                      key={song.songId}
                      className="flex flex-col gap-2 p-3 bg-[#F9FAFB] rounded-xl border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-colors"
                    >
                      {/* Title row */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Music className="w-3.5 h-3.5 text-[#F97316]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#111827] truncate">{song.trackTitle}</p>
                          <p className="text-[10px] text-[#6B7280] truncate">{song.artistName}</p>
                        </div>
                        {song.split ? (
                          <span className="text-xs font-bold text-white bg-[#F97316] px-2 h-5 rounded-full flex items-center flex-shrink-0">
                            {song.split.percentage}%
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 h-5 rounded-full flex items-center flex-shrink-0">
                            Sin split
                          </span>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-4 gap-1.5">
                        <div className="flex flex-col gap-0.5 px-2 py-1.5 bg-white rounded-lg border border-gray-100">
                          <span className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">Streams</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-2.5 h-2.5 text-[#F97316]" />
                            <span className="text-[11px] font-bold text-[#111827]">{fmtStreams(song.totalStreams)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 px-2 py-1.5 bg-white rounded-lg border border-gray-100">
                          <span className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">Neto</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-2.5 h-2.5 text-green-500" />
                            <span className="text-[11px] font-bold text-green-600">{fmt(song.totalNetIncome)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 px-2 py-1.5 bg-white rounded-lg border border-gray-100">
                          <span className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">ISRC</span>
                          <span className="text-[10px] font-mono font-semibold text-[#374151] truncate">{song.isrc || "—"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 px-2 py-1.5 bg-white rounded-lg border border-gray-100">
                          <span className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">UPC</span>
                          <span className="text-[10px] font-mono font-semibold text-[#374151] truncate">{song.upc || "—"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full h-9 bg-white border border-gray-200 hover:bg-gray-50 text-[#111827] text-[12px] font-semibold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
