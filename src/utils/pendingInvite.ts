/**
 * La invitación que alguien está intentando aceptar, guardada mientras crea su
 * cuenta.
 *
 * Quien llega desde el correo sin tener cuenta tiene que pasar por registro y
 * después por login antes de poder aceptar. Sin guardar a dónde iba, al terminar
 * acabaría en el panel y tendría que volver al correo a buscar el enlace —que es
 * justo lo que no debe pasar—.
 *
 * Se usa `sessionStorage` y no la URL porque el recorrido cruza varias páginas y
 * un token en la barra de direcciones se comparte por accidente al copiar el
 * enlace de cualquiera de ellas.
 */

const KEY = "splitme:pending-invite";

/** Dónde volver para aceptar, tal cual se abrió desde el correo. */
export interface PendingInvite {
  /** Ruta completa de la aceptación, con su token. */
  path: string;
  /** Correo al que se envió la invitación, para prefijar el registro. */
  email: string | null;
}

/** Guarda la invitación que quedó a medias. */
export function savePendingInvite(invite: PendingInvite): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(invite));
  } catch {
    // Sin almacenamiento (navegación privada estricta) el recorrido sigue
    // funcionando: sólo se pierde la vuelta automática.
  }
}

/** La invitación pendiente, si la hay. */
export function readPendingInvite(): PendingInvite | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingInvite;
    return parsed?.path ? parsed : null;
  } catch {
    return null;
  }
}

/** La retira: ya se llegó a la aceptación. */
export function clearPendingInvite(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nada que limpiar */
  }
}

/**
 * Lee el correo al que se envió la invitación desde su token.
 *
 * Sólo sirve para rellenar el registro y decir a quién pertenece el enlace; la
 * firma la comprueba el servidor al aceptar.
 */
export function readInviteEmail(token: string): string | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json) as { collaboratorEmail?: string };
    return parsed?.collaboratorEmail ?? null;
  } catch {
    return null;
  }
}
