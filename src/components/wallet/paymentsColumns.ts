import { Check, Hourglass, Loader, TriangleAlert } from "lucide-react";
import type { RoyaltyPayment } from "@/services/payments";

/**
 * Rejilla del historial de pagos. La comparten la cabecera, `PaymentRow` y el
 * esqueleto de carga, para que los anchos no se desincronicen.
 *
 * La canción absorbe el ancho sobrante. Antes la referencia del cobro ocupaba
 * 220 px fijos —la segunda columna más ancha— para el dato que nadie acciona,
 * mientras el título se cortaba; ahora baja a 150 px y solo aparece en pantallas
 * grandes.
 */
export const PAYMENTS_GRID =
  "grid items-center gap-3 grid-cols-[minmax(0,1fr)_110px_32px] " +
  "sm:grid-cols-[minmax(0,1fr)_120px_110px_32px] " +
  "md:grid-cols-[96px_minmax(0,1fr)_120px_110px_32px] " +
  "lg:grid-cols-[96px_minmax(0,1fr)_150px_120px_120px_32px]";

export interface PaymentColumn {
  key: string;
  label: string;
  /** Clases de visibilidad por breakpoint; deben coincidir con `PAYMENTS_GRID`. */
  visibility: string;
}

/** Columnas posteriores a la canción; la fecha va antes y se declara aparte. */
export const PAYMENT_COLUMNS: PaymentColumn[] = [
  { key: "reference", label: "REFERENCIA", visibility: "hidden lg:flex" },
  { key: "status", label: "ESTADO", visibility: "hidden sm:flex" },
  { key: "amount", label: "MONTO", visibility: "flex" },
];

export const DATE_COLUMN_VISIBILITY = "hidden md:flex";

export interface StatusStyle {
  label: string;
  color: string;
  background: string;
  Icon: typeof Check;
}

/**
 * Estilo de cada estado de pago, en los colores del sistema.
 *
 * Antes convivían cuatro familias ajenas (verde, azul, ámbar y rojo de Tailwind)
 * con el naranja de la marca y el esmeralda de Wise: seis a la vez en la misma
 * pantalla. Aquí solo se usan los del rediseño, y «pendiente» toma el naranja
 * porque es lo único que sigue esperando una acción.
 */
export const PAYMENT_STATUS: Record<RoyaltyPayment["status"], StatusStyle> = {
  succeeded: { label: "Completado", color: "#2FB37E", background: "#E4F5EC", Icon: Check },
  processing: { label: "En proceso", color: "#1C1D22", background: "#F4F5F7", Icon: Loader },
  pending: { label: "Pendiente", color: "#FF5C00", background: "#FFEADD", Icon: Hourglass },
  failed: { label: "Fallido", color: "#E5484D", background: "#FDECEC", Icon: TriangleAlert },
};

export const STATUS_FILTER_LABELS: Record<string, string> = {
  all: "Todos",
  succeeded: "Completados",
  processing: "En proceso",
  pending: "Pendientes",
  failed: "Fallidos",
};
