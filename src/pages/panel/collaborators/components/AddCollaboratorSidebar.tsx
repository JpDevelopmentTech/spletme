import { useState, useEffect } from "react";
import {
  X,
  Music,
  Search,
  Mail,
  Hash,
  UserPlus,
  ChevronRight,
  Loader2,
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
      ...(method === "email"
        ? { collaboratorEmail: email }
        : { collaboratorId: code }),
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
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#0F172A] px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#F97316]">
              <Music className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="max-w-[240px] truncate text-xs font-bold text-white">
                {song.title}
              </p>
              <p className="truncate text-[10px] text-gray-400">
                {song.artist} · {song.isrc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 py-5">
          <div>
            <p className="mb-2.5 text-[10px] font-bold tracking-wider text-[#9CA3AF]">
              MÉTODO DE INVITACIÓN
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setMethod("email")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  method === "email"
                    ? "border-orange-200 bg-orange-50 text-[#F97316]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Por correo
              </button>
              <button
                onClick={() => setMethod("code")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  method === "code"
                    ? "border-orange-200 bg-orange-50 text-[#F97316]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Hash className="h-3.5 w-3.5" />
                Por código
              </button>
            </div>
          </div>

          {method === "email" ? (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="nombre@ejemplo.com"
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          ) : (
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de usuario"
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2.5">
              <p className="text-xs font-semibold text-green-700">
                ¡Invitación enviada exitosamente!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
          <button
            onClick={onClose}
            className="h-10 flex-1 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={sending || success || !canSend}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#F97316] text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {sending ? "Enviando..." : "Enviar invitación"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function AddCollaboratorSidebar({
  isOpen,
  onClose,
}: AddCollaboratorSidebarProps) {
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
            (s.roles ?? []).some((r: string) => r.toLowerCase() === "label"),
          );
          setSongs(
            labelOnly.map((s) => ({
              id: s.songId,
              title: s.trackTitle,
              artist: s.artistName,
              isrc: s.isrc,
            })),
          );
        } else {
          const res = await SongService.getSongs(1, 100);
          const data: {
            _id: string;
            trackTitle: string;
            artistName: string;
            isrc: string;
          }[] = Array.isArray(res?.data) ? res.data : [];
          setSongs(
            data.map((s) => ({
              id: s._id,
              title: s.trackTitle,
              artist: s.artistName,
              isrc: s.isrc,
            })),
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
          s.isrc.toLowerCase().includes(search.toLowerCase()),
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
        className="fixed right-0 top-0 z-50 flex h-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: 420,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Top bar */}
        <div className="flex flex-shrink-0 items-center justify-between bg-[#0F172A] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
            <span className="text-[11px] font-bold tracking-wider text-[#F97316]">
              AGREGAR COLABORADOR
            </span>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 border-b border-gray-100 px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar canción..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            {isLabel ? "Canciones donde eres label" : "Todas tus canciones"}
            {!loading &&
              ` · ${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Song list */}
        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-3">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent" />
              <p className="text-xs text-gray-400">Cargando canciones...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
              <Music className="h-8 w-8" />
              <p className="text-sm">
                {search
                  ? "Sin resultados para tu búsqueda"
                  : "No hay canciones disponibles"}
              </p>
            </div>
          ) : (
            filtered.map((song) => (
              <button
                key={song.id}
                onClick={() => setInviteSong(song)}
                className="group flex w-full items-center gap-2.5 rounded-xl border border-gray-100 bg-[#F9FAFB] px-3 py-2.5 text-left transition-all hover:border-orange-200 hover:bg-orange-50/50"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 transition-colors group-hover:bg-[#F97316]">
                  <Music className="h-4 w-4 text-[#F97316] transition-colors group-hover:text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#111827] transition-colors group-hover:text-[#F97316]">
                    {song.title}
                  </p>
                  <p className="truncate text-[10px] text-gray-400">
                    {song.artist} · {song.isrc}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-[#F97316]" />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Invitation modal — opens over the sidebar */}
      {inviteSong && (
        <InviteModal song={inviteSong} onClose={() => setInviteSong(null)} />
      )}
    </>
  );
}
