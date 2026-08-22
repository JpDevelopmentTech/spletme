import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Hash,
  Info,
  Loader,
  Mail,
  Music,
  Percent,
  Search,
  Send,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import SongService from "@/services/songs";
import CollaboratorService from "@/services/collaborator";
import LocalStorageService from "@/services/localstorage";
import { ModalShell, PrimaryButton, SecondaryButton } from "@/components/ui/ModalShell";

interface SongOption {
  id: string;
  title: string;
  artist: string;
  isrc: string;
  collaborators: number;
}

interface AddCollaboratorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  /** Se llama tras invitar, para refrescar la lista de la página. */
  onInvited?: () => void;
}

/**
 * Alta de un colaborador, que en realidad es una invitación a una canción
 * concreta: el reparto vive en la canción, no en la persona.
 *
 * Por eso el panel enseña los dos pasos desde el principio —elegir la canción y
 * luego a quién invitas— en vez de presentarlo como «agregar colaborador» y
 * descubrir a mitad de camino que primero hay que elegir una canción.
 */
export function AddCollaboratorSidebar({
  isOpen,
  onClose,
  onInvited,
}: AddCollaboratorSidebarProps) {
  const [songs, setSongs] = useState<SongOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [onlyWithout, setOnlyWithout] = useState(false);
  const [inviteSong, setInviteSong] = useState<SongOption | null>(null);

  const currentUser = LocalStorageService.getItem("user");
  const isLabel = String(currentUser?.role ?? "").toLowerCase() === "label";

  useEffect(() => {
    if (!isOpen) return;
    let alive = true;
    setLoading(true);
    setSongs([]);

    const fetchSongs = async () => {
      try {
        if (isLabel) {
          // Un sello solo puede invitar en las canciones donde es sello.
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
            (s.roles ?? []).some((role) => role.toLowerCase() === "label"),
          );
          if (alive) {
            setSongs(
              labelOnly.map((s) => ({
                id: s.songId,
                title: s.trackTitle,
                artist: s.artistName,
                isrc: s.isrc,
                collaborators: 0,
              })),
            );
          }
        } else {
          const res = await SongService.getSongs({ page: 1, limit: 100 });
          const songs = res?.data?.songs;
          const data: {
            _id: string;
            trackTitle: string;
            artistName: string;
            isrc: string;
            collaborators?: unknown[];
          }[] = Array.isArray(songs)
            ? (songs as {
                _id: string;
                trackTitle: string;
                artistName: string;
                isrc: string;
                collaborators?: unknown[];
              }[])
            : [];
          if (alive) {
            setSongs(
              data.map((s) => ({
                id: s._id,
                title: s.trackTitle,
                artist: s.artistName,
                isrc: s.isrc,
                collaborators: Array.isArray(s.collaborators) ? s.collaborators.length : 0,
              })),
            );
          }
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchSongs();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return songs.filter((song) => {
      if (onlyWithout && song.collaborators > 0) return false;
      if (!query) return true;
      return `${song.title} ${song.artist} ${song.isrc}`.toLowerCase().includes(query);
    });
  }, [songs, search, onlyWithout]);

  const handleClose = () => {
    setSearch("");
    setOnlyWithout(false);
    setInviteSong(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#101114]/65 backdrop-blur-sm" onClick={handleClose} />

      <aside
        role="dialog"
        aria-label="Invitar a una canción"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col bg-white shadow-[-16px_0_48px_-12px_rgba(16,17,20,0.35)]"
      >
        {/* Cabecera */}
        <div className="flex flex-shrink-0 flex-col gap-3.5 px-6 pb-[18px] pt-6">
          <div className="flex items-start justify-between gap-3.5">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-xl font-semibold text-[#1C1D22]">
                Invitar a una canción
              </h2>
              <p className="text-[12px] leading-relaxed text-[#71757E]">
                Los colaboradores se añaden por canción: elige en cuál participa y luego a quién
                invitas.
              </p>
            </div>
            <button
              onClick={handleClose}
              aria-label="Cerrar"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F4F5F7] text-[#71757E] transition-colors hover:bg-[#E8E8EC] hover:text-[#1C1D22]"
            >
              <X className="h-[15px] w-[15px]" />
            </button>
          </div>

          <Steps active={inviteSong ? 1 : 0} />
        </div>

        <div className="h-px flex-shrink-0 bg-[#E8E8EC]" />

        {/* Paso 1 — elegir canción */}
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-6 py-[18px]">
          <div className="flex items-center gap-2.5 rounded-[16px] bg-[#F4F5F7] px-3.5 py-2.5">
            <Search className="h-[15px] w-[15px] flex-shrink-0 text-[#71757E]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, artista o ISRC…"
              className="w-full bg-transparent text-[12px] text-[#1C1D22] placeholder:text-[#71757E] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Chip active={!onlyWithout} onClick={() => setOnlyWithout(false)}>
              {isLabel ? "Canciones donde eres sello" : "Todas tus canciones"}
            </Chip>
            <Chip active={onlyWithout} onClick={() => setOnlyWithout(true)}>
              Sin colaboradores
            </Chip>
            {!loading && (
              <span className="ml-auto text-[11px] text-[#A6AAB2]">
                {filtered.length} {filtered.length === 1 ? "canción" : "canciones"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-[62px] animate-pulse rounded-[16px] bg-[#F4F5F7]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12">
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
                <Music className="h-[22px] w-[22px] text-[#71757E]" />
              </span>
              <span className="text-[13px] font-semibold text-[#1C1D22]">
                {search ? "Sin resultados" : "No hay canciones disponibles"}
              </span>
              <span className="text-center text-[11.5px] text-[#71757E]">
                {search
                  ? "Prueba con otro título, artista o ISRC."
                  : "Sube un reporte para que aparezcan tus canciones."}
              </span>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((song) => (
                <li key={song.id}>
                  <button
                    onClick={() => setInviteSong(song)}
                    className="flex w-full items-center gap-3 rounded-[16px] border border-[#E8E8EC] bg-white px-3.5 py-2.5 text-left transition-colors hover:border-[#FF5C00] hover:bg-[#FFEADD]/40"
                  >
                    <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-xl bg-[#F4F5F7]">
                      <Music className="h-4 w-4 text-[#A6AAB2]" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                        {song.title}
                      </span>
                      <span className="truncate text-[10.5px] text-[#A6AAB2]">
                        {song.artist}
                        {song.isrc ? ` · ${song.isrc}` : ""}
                      </span>
                    </span>
                    <span
                      className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl px-2 py-1 ${
                        song.collaborators === 0 ? "bg-[#FFEADD]" : "bg-[#F4F5F7]"
                      }`}
                      title={`${song.collaborators} colaboradores`}
                    >
                      <Users
                        className={`h-3 w-3 ${
                          song.collaborators === 0 ? "text-[#FF5C00]" : "text-[#71757E]"
                        }`}
                      />
                      <span
                        className={`font-mono text-[10.5px] font-semibold ${
                          song.collaborators === 0 ? "text-[#FF5C00]" : "text-[#71757E]"
                        }`}
                      >
                        {song.collaborators}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#A6AAB2]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="h-px flex-shrink-0 bg-[#E8E8EC]" />
        <p className="flex flex-shrink-0 items-start gap-2.5 px-6 pb-5 pt-4 text-[11px] leading-relaxed text-[#A6AAB2]">
          <Info className="mt-px h-3.5 w-3.5 flex-shrink-0" />
          La persona recibirá una invitación y aparecerá aquí al aceptarla.
        </p>
      </aside>

      {/* Paso 2 — invitar */}
      {inviteSong && (
        <InviteModal
          song={inviteSong}
          onClose={() => setInviteSong(null)}
          onInvited={() => {
            setInviteSong(null);
            onInvited?.();
          }}
        />
      )}
    </>
  );
}

function Steps({ active }: { active: 0 | 1 }) {
  const steps = ["Elige la canción", "Invita a la persona"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, index) => {
        const done = index < active;
        const current = index === active;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            {index > 0 && <span className={`h-0.5 flex-1 ${done || current ? "bg-[#2FB37E]" : "bg-[#E8E8EC]"}`} />}
            <span className="flex flex-shrink-0 items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${
                  done
                    ? "bg-[#2FB37E] text-white"
                    : current
                      ? "bg-[#FF5C00] text-white"
                      : "bg-[#F4F5F7] text-[#A6AAB2]"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <span
                className={`text-[12px] ${
                  current || done ? "font-semibold text-[#1C1D22]" : "text-[#A6AAB2]"
                }`}
              >
                {label}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[14px] px-2.5 py-1.5 text-[11.5px] transition-colors ${
        active
          ? "bg-[#FFEADD] font-semibold text-[#FF5C00]"
          : "border border-[#E8E8EC] bg-white font-medium text-[#71757E] hover:border-[#D9DAE0]"
      }`}
    >
      {children}
    </button>
  );
}

/** Segundo paso: a quién se invita y por qué vía. */
function InviteModal({
  song,
  onClose,
  onInvited,
}: {
  song: SongOption;
  onClose: () => void;
  onInvited: () => void;
}) {
  const [method, setMethod] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const value = method === "email" ? email : code;
  const canSend = value.trim() !== "" && !sending;

  async function handleSend() {
    setSending(true);
    setError("");

    const res = await SongService.addCollaborator({
      songId: song.id,
      ...(method === "email" ? { collaboratorEmail: email.trim() } : { collaboratorId: code.trim() }),
    });

    setSending(false);
    if (res.success) {
      setSent(true);
      setTimeout(onInvited, 1600);
    } else {
      setError(res.message || "No se pudo enviar la invitación.");
    }
  }

  return (
    <ModalShell
      title={sent ? "Invitación enviada" : `Invitar a «${song.title}»`}
      subtitle={`${song.artist}${song.isrc ? ` · ${song.isrc}` : ""}`}
      locked={sending}
      onClose={onClose}
      logo={
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[13px] bg-[#F4F5F7]">
          <Music className="h-[17px] w-[17px] text-[#A6AAB2]" />
        </span>
      }
      footer={
        sent ? (
          <>
            <span className="flex-1" />
            <PrimaryButton onClick={onInvited}>Hecho</PrimaryButton>
          </>
        ) : (
          <>
            <span className="flex-1" />
            <SecondaryButton onClick={onClose} disabled={sending}>
              Volver
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSend}
              disabled={!canSend}
              icon={<Send className="h-[15px] w-[15px]" />}
            >
              {sending ? "Enviando…" : "Enviar invitación"}
            </PrimaryButton>
          </>
        )
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-2.5 rounded-[18px] bg-[#E4F5EC] p-6">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#2FB37E]">
            <Check className="h-6 w-6 text-white" />
          </span>
          <span className="text-[13px] font-semibold text-[#1F7D58]">
            Invitación enviada a {method === "email" ? email : code}
          </span>
          <span className="text-center text-[11.5px] text-[#2FB37E]">
            Aparecerá en tu lista de colaboradores cuando la acepte.
          </span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
              CÓMO QUIERES INVITARLE
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <MethodOption
                icon={<Mail className="h-[15px] w-[15px]" />}
                title="Por correo"
                detail="Le llega un email"
                active={method === "email"}
                onClick={() => setMethod("email")}
              />
              <MethodOption
                icon={<Hash className="h-[15px] w-[15px]" />}
                title="Por código"
                detail="Si ya tiene cuenta"
                active={method === "code"}
                onClick={() => setMethod("code")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
              {method === "email" ? "CORREO DE LA PERSONA *" : "CÓDIGO DE USUARIO *"}
            </span>
            <input
              autoFocus
              type={method === "email" ? "email" : "text"}
              value={value}
              onChange={(e) =>
                method === "email" ? setEmail(e.target.value) : setCode(e.target.value)
              }
              placeholder={method === "email" ? "nombre@ejemplo.com" : "Código de usuario"}
              className="rounded-2xl border border-[#E8E8EC] px-4 py-3 text-[13px] font-medium text-[#1C1D22] placeholder:font-normal placeholder:text-[#A6AAB2] transition-colors focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
            />
          </div>

          <div className="flex items-start gap-3 rounded-[16px] bg-[#F4F5F7] p-3.5">
            <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[10px] bg-white">
              <Percent className="h-3.5 w-3.5 text-[#71757E]" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-[12px] font-semibold text-[#1C1D22]">
                El porcentaje se asigna después
              </span>
              <span className="text-[11px] leading-relaxed text-[#71757E]">
                Al aceptar, aparecerá en la canción con un 0%. Desde ahí le asignas su parte del
                split.
              </span>
            </span>
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-[14px] bg-[#FDECEC] px-3.5 py-3 text-[12px] font-medium text-[#E5484D]">
              <TriangleAlert className="h-4 w-4 flex-shrink-0" />
              {error}
            </p>
          )}

          {sending && (
            <p className="flex items-center gap-2 text-[11.5px] text-[#71757E]">
              <Loader className="h-3.5 w-3.5 animate-spin text-[#FF5C00]" />
              Enviando la invitación…
            </p>
          )}
        </>
      )}
    </ModalShell>
  );
}

function MethodOption({
  icon,
  title,
  detail,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-left transition-colors ${
        active
          ? "border-[1.5px] border-[#FF5C00] bg-[#FFEADD]"
          : "border border-[#E8E8EC] bg-white hover:border-[#D9DAE0]"
      }`}
    >
      <span className={active ? "text-[#FF5C00]" : "text-[#71757E]"}>{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={`text-[12.5px] font-semibold ${active ? "text-[#EA580C]" : "text-[#1C1D22]"}`}
        >
          {title}
        </span>
        <span className={`text-[10.5px] ${active ? "text-[#EA580C]" : "text-[#A6AAB2]"}`}>
          {detail}
        </span>
      </span>
      {active && <Check className="h-3.5 w-3.5 flex-shrink-0 text-[#FF5C00]" />}
    </button>
  );
}
