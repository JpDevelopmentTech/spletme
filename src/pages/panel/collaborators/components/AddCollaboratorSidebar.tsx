import { useState, useEffect } from "react";
import {
  X, Music, Search, Mail, Hash, UserPlus, ChevronRight, Loader2,
} from "lucide-react";
import SongService from "@/services/songs";
import CollaboratorService from "@/services/collaborator";
import LocalStorageService from "@/services/localstorage";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SongOption {
  id: string;
  title: string;
  artist: string;
  isrc: string;
}

interface AddCollaboratorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Invite modal (appears on top of the sidebar) ──────────────────────────────

function InviteModal({
  song,
  onClose,
}: {
  song: SongOption;
  onClose: () => void;
}) {
  const [method, setMethod] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const canSend = method === "email" ? email.trim() !== "" : code.trim() !== "";

  const handleSend = async () => {
    setSending(true);
    setError("");

    const res = await SongService.addCollaborator({
      songId: song.id,
      ...(method === "email" ? { collaboratorEmail: email } : { collaboratorId: code }),
    });

    setSending(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      setError(res.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0F172A]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
              <Music className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate max-w-[240px]">{song.title}</p>
              <p className="text-[10px] text-gray-400 truncate">{song.artist} · {song.isrc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-bold text-[#9CA3AF] tracking-wider mb-2.5">
              MÉTODO DE INVITACIÓN
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setMethod("email")}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  method === "email"
                    ? "bg-orange-50 border-orange-200 text-[#F97316]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Por correo
              </button>
              <button
                onClick={() => setMethod("code")}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  method === "code"
                    ? "bg-orange-50 border-orange-200 text-[#F97316]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                Por código
              </button>
            </div>
          </div>

          {method === "email" ? (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="nombre@ejemplo.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          ) : (
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de usuario"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          )}

          {error && (
            <div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="px-3 py-2.5 bg-green-50 border border-green-100 rounded-lg">
              <p className="text-xs font-semibold text-green-700">
                ¡Invitación enviada exitosamente!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={sending || success || !canSend}
            className="flex-1 h-10 bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {sending ? "Enviando..." : "Enviar invitación"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function AddCollaboratorSidebar({ isOpen, onClose }: AddCollaboratorSidebarProps) {
  const [songs, setSongs] = useState<SongOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [inviteSong, setInviteSong] = useState<SongOption | null>(null);

  const currentUser = LocalStorageService.getItem("user");
  const isLabel = String(currentUser?.role ?? "").toLowerCase() === "label";

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setSongs([]);

    const fetchSongs = async () => {
      try {
        if (isLabel) {
          const userId = currentUser?.id ?? currentUser?._id ?? "";
          const res = await CollaboratorService.getById(userId);
          const apiSongs = (res?.data?.songs ?? []) as {
            songId: string;
            trackTitle: string;
            artistName: string;
            isrc: string;
            roles?: string[];
          }[];
          const labelOnly = apiSongs.filter((s) =>
            (s.roles ?? []).some((r: string) => r.toLowerCase() === "label")
          );
          setSongs(
            labelOnly.map((s) => ({
              id: s.songId,
              title: s.trackTitle,
              artist: s.artistName,
              isrc: s.isrc,
            }))
          );
        } else {
          const res = await SongService.getSongs(1, 100);
          const data: { _id: string; trackTitle: string; artistName: string; isrc: string }[] =
            Array.isArray(res?.data) ? res.data : [];
          setSongs(
            data.map((s) => ({
              id: s._id,
              title: s.trackTitle,
              artist: s.artistName,
              isrc: s.isrc,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const filtered = search.trim()
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.artist.toLowerCase().includes(search.toLowerCase()) ||
          s.isrc.toLowerCase().includes(search.toLowerCase())
      )
    : songs;

  const handleClose = () => {
    setSearch("");
    setInviteSong(null);
    onClose();
  };

  return (
    <>
      {/* Overlay behind sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={handleClose} />
      )}

      {/* Sidebar panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          width: 420,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0F172A] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full" />
            <span className="text-[11px] font-bold text-[#F97316] tracking-wider">
              AGREGAR COLABORADOR
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar canción..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            {isLabel ? "Canciones donde eres label" : "Todas tus canciones"}
            {!loading && ` · ${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Song list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Cargando canciones...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <Music className="w-8 h-8" />
              <p className="text-sm">
                {search ? "Sin resultados para tu búsqueda" : "No hay canciones disponibles"}
              </p>
            </div>
          ) : (
            filtered.map((song) => (
              <button
                key={song.id}
                onClick={() => setInviteSong(song)}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-100 bg-[#F9FAFB] hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F97316] transition-colors">
                  <Music className="w-4 h-4 text-[#F97316] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#111827] truncate group-hover:text-[#F97316] transition-colors">
                    {song.title}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {song.artist} · {song.isrc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#F97316] flex-shrink-0 transition-colors" />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Invitation modal — opens over the sidebar */}
      {inviteSong && (
        <InviteModal
          song={inviteSong}
          onClose={() => setInviteSong(null)}
        />
      )}
    </>
  );
}
