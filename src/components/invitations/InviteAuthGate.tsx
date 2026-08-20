import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { savePendingInvite } from "@/utils/pendingInvite";

interface Props {
  /** Correo al que se envió la invitación, leído de su token. */
  email: string | null;
  /** Nombre de lo que se está aceptando, para el texto. */
  what?: string;
}

/**
 * Lo que ve quien abre una invitación sin haber iniciado sesión.
 *
 * Antes las invitaciones sólo se enviaban a gente con cuenta, así que bastaba
 * con mandar a iniciar sesión. Ahora el destinatario puede no conocer Splitme, y
 * lo que necesita es crear la cuenta —sin que el enlace se pierda por el camino—.
 * De eso se encarga `savePendingInvite`: al terminar el alta, el propio login
 * devuelve a esta misma pantalla y sólo queda aceptar.
 */
export function InviteAuthGate({ email, what = "esta invitación" }: Props) {
  const navigate = useNavigate();

  /** Se recuerda a dónde volver antes de salir hacia el alta o el acceso. */
  const goTo = (path: string) => {
    savePendingInvite({
      path: `${window.location.pathname}${window.location.search}`,
      email,
    });
    navigate(path);
  };

  return (
    <div className="flex flex-col gap-4 rounded-[18px] bg-[#FFEADD] p-4">
      <span className="flex flex-col gap-1">
        <span className="text-[12.5px] font-semibold text-[#EA580C]">
          Necesitas una cuenta para aceptar {what}
        </span>
        <span className="text-[11px] leading-relaxed text-[#EA580C]">
          {email ? (
            <>
              La invitación es para <span className="font-mono font-semibold">{email}</span>. Crea
              tu cuenta con ese correo y te traemos de vuelta aquí para aceptarla; no hace falta
              volver al mensaje.
            </>
          ) : (
            <>Entra con tu cuenta de Splitme y te traemos de vuelta aquí para aceptarla.</>
          )}
        </span>
      </span>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => goTo("/auth/register")}
          className="flex items-center gap-2 rounded-[14px] bg-[#FF5C00] px-3.5 py-2 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Crear mi cuenta
        </button>
        <button
          onClick={() => goTo("/auth/email-login")}
          className="flex items-center gap-2 rounded-[14px] border border-[#FF5C00]/30 bg-white px-3.5 py-2 text-[11.5px] font-semibold text-[#EA580C] transition-colors hover:bg-white/70"
        >
          <LogIn className="h-3.5 w-3.5" />
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}
