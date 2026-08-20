import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CircleAlert, Disc3, ListMusic, Loader, Music } from "lucide-react";
import AlbumService, { type AlbumAcceptanceResult } from "@/services/albums";
import { InviteAuthGate } from "@/components/invitations/InviteAuthGate";
import { clearPendingInvite, readInviteEmail } from "@/utils/pendingInvite";
import { isSignedIn } from "@/utils/session";

/** Lo que el token trae para poder pintar la invitación antes de aceptarla. */
interface AlbumTokenPayload {
  type?: string;
  /** Correo al que se envió; puede no tener cuenta todavía. */
  collaboratorEmail?: string;
  upc?: string;
  albumTitle?: string;
  artistName?: string;
  collaboratorName?: string;
  totalSongs?: number;
  exp?: number;
}

type Phase = "reading" | "ready" | "accepting" | "accepted" | "error";

/**
 * Aceptación de una invitación a un álbum completo.
 *
 * El enlace del correo llega aquí. Antes de pedir nada se enseña a qué se está
 * aceptando —qué álbum y cuántas pistas—, porque un solo clic mete a quien acepta
 * en todas ellas y el correo pudo llegar hace días.
 */
export default function AcceptAlbumCollaboration() {
  const navigate = useNavigate();

  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") ?? "", []);
  const [payload, setPayload] = useState<AlbumTokenPayload | null>(null);
  const [phase, setPhase] = useState<Phase>("reading");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AlbumAcceptanceResult | null>(null);

  const signedIn = isSignedIn();

  useEffect(() => {
    if (!token) {
      setError("Este enlace no trae ninguna invitación. Vuelve a abrirlo desde el correo.");
      setPhase("error");
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded || decoded.type !== "album_collaboration") {
      setError("Este enlace no es una invitación de álbum válida.");
      setPhase("error");
      return;
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      setError("La invitación caducó. Pídele a quien te invitó que te la envíe de nuevo.");
      setPhase("error");
      return;
    }

    setPayload(decoded);
    setPhase("ready");
    // Llegar aquí es el final del desvío por el alta: no queda nada pendiente.
    clearPendingInvite();
  }, [token]);

  async function accept() {
    setPhase("accepting");
    setError("");

    const response = await AlbumService.acceptCollaboration(token);

    if (!response.success) {
      setError(response.message);
      setPhase("error");
      return;
    }

    setResult(response.data);
    setPhase("accepted");
  }

  const total = payload?.totalSongs ?? 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F9] p-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-16px_rgba(16,17,20,0.18)]">
        {/* Cabecera: siempre dice de qué álbum se habla. */}
        <div className="flex items-center gap-3.5 px-7 pb-5 pt-7">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[16px] bg-[#FFEADD]">
            <Disc3 className="h-6 w-6 text-[#FF5C00]" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h1 className="truncate font-display text-[20px] font-semibold text-[#1C1D22]">
              {payload?.albumTitle ?? "Invitación a un álbum"}
            </h1>
            <p className="truncate text-[12.5px] text-[#71757E]">
              {payload?.artistName || "Colaboración en Splitme"}
            </p>
          </div>
        </div>

        <div className="h-px bg-[#E8E8EC]" />

        <div className="flex flex-col gap-5 px-7 py-6">
          {phase === "reading" && (
            <p className="flex items-center gap-2.5 text-[12.5px] text-[#71757E]">
              <Loader className="h-4 w-4 animate-spin text-[#FF5C00]" />
              Comprobando la invitación…
            </p>
          )}

          {phase === "error" && (
            <div className="flex items-start gap-3 rounded-[18px] bg-[#FDECEC] p-4">
              <CircleAlert className="mt-px h-[17px] w-[17px] flex-shrink-0 text-[#E5484D]" />
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-[#E5484D]">No se pudo aceptar</span>
                <span className="text-[11.5px] leading-relaxed text-[#E5484D]">{error}</span>
              </span>
            </div>
          )}

          {(phase === "ready" || phase === "accepting") && (
            <>
              <p className="text-[13.5px] leading-relaxed text-[#1C1D22]">
                Te han invitado a colaborar en este álbum. Si aceptas, entrarás como colaborador en{" "}
                <span className="font-semibold">
                  {total} {total === 1 ? "pista" : "pistas"}
                </span>{" "}
                de una vez.
              </p>

              <div className="flex items-center gap-3.5 rounded-[18px] bg-[#F4F5F7] px-4 py-3.5">
                <ListMusic className="h-[17px] w-[17px] flex-shrink-0 text-[#71757E]" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[12.5px] font-semibold text-[#1C1D22]">
                    Verás sus datos, no cobrarás todavía
                  </span>
                  <span className="text-[11px] leading-relaxed text-[#71757E]">
                    Aceptar te da acceso a los streams e ingresos de esas pistas. El reparto se
                    asigna aparte.
                  </span>
                </span>
              </div>

              {!signedIn ? (
                <InviteAuthGate
                  email={payload?.collaboratorEmail ?? readInviteEmail(token)}
                  what="este álbum"
                />
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={accept}
                    disabled={phase === "accepting"}
                    className="flex items-center gap-2 rounded-[22px] bg-[#FF5C00] px-[18px] py-3 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors enabled:hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:bg-[#F4F5F7] disabled:text-[#A6AAB2] disabled:shadow-none"
                  >
                    {phase === "accepting" ? (
                      <Loader className="h-[15px] w-[15px] animate-spin" />
                    ) : (
                      <Check className="h-[15px] w-[15px]" />
                    )}
                    {phase === "accepting" ? "Aceptando…" : "Aceptar invitación"}
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    disabled={phase === "accepting"}
                    className="rounded-[22px] border border-[#E8E8EC] bg-white px-[18px] py-3 text-[12.5px] font-semibold text-[#71757E] transition-colors enabled:hover:bg-[#F4F5F7] enabled:hover:text-[#1C1D22] disabled:opacity-50"
                  >
                    Ahora no
                  </button>
                </div>
              )}
            </>
          )}

          {phase === "accepted" && result && (
            <>
              <div className="flex items-center gap-3.5 rounded-[18px] bg-[#E4F5EC] p-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2FB37E]">
                  <Check className="h-5 w-5 text-white" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[14px] font-semibold text-[#1F7D58]">
                    Ya colaboras en {result.summary.added}{" "}
                    {result.summary.added === 1 ? "pista" : "pistas"}
                  </span>
                  <span className="truncate text-[11.5px] text-[#2FB37E]">{result.albumTitle}</span>
                </span>
              </div>

              {result.songs.length > 0 && (
                <ol className="flex max-h-[200px] flex-col gap-px overflow-y-auto rounded-[16px] bg-[#F4F5F7] p-1.5">
                  {result.songs.map((title, index) => (
                    <li
                      key={`${title}-${index}`}
                      className="flex items-center gap-2.5 rounded-[11px] px-2.5 py-1.5"
                    >
                      <Music className="h-3 w-3 flex-shrink-0 text-[#A6AAB2]" />
                      <span className="min-w-0 flex-1 truncate text-[11.5px] text-[#1C1D22]">
                        {title}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              {/* Lo que no salió bien se dice: en un álbum se tocan muchas
                  pistas y callar un fallo dejaría a alguien fuera sin saberlo. */}
              {(result.summary.alreadyExists > 0 || result.summary.errors > 0) && (
                <p className="text-[11.5px] leading-relaxed text-[#71757E]">
                  {result.summary.alreadyExists > 0 &&
                    `${result.summary.alreadyExists} ${
                      result.summary.alreadyExists === 1
                        ? "pista ya la compartíais"
                        : "pistas ya las compartíais"
                    }. `}
                  {result.summary.errors > 0 &&
                    `${result.summary.errors} no se pudieron añadir; avisa a quien te invitó.`}
                </p>
              )}

              <button
                onClick={() => navigate("/panel/music?view=albums")}
                className="flex w-fit items-center gap-2 rounded-[22px] bg-[#FF5C00] px-[18px] py-3 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors hover:bg-[#EA580C]"
              >
                <Disc3 className="h-[15px] w-[15px]" />
                Ver el álbum
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Lee el contenido del token sin comprobar la firma: sirve para saber qué
 * enseñar en la pantalla. Quien valida de verdad es el servidor al aceptar.
 */
function decodeToken(token: string): AlbumTokenPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as AlbumTokenPayload;
  } catch {
    return null;
  }
}
