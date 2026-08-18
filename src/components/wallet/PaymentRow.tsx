import { ChevronDown, Music } from "lucide-react";
import { formatCurrency } from "@/utils/format.utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { collaboratorName, songTitle } from "@/hooks/useRoyaltyPayments";
import {
  DATE_COLUMN_VISIBILITY,
  PAYMENTS_GRID,
  PAYMENT_COLUMNS,
  PAYMENT_STATUS,
} from "./paymentsColumns";
import type { RoyaltyPayment } from "@/services/payments";

interface PaymentRowProps {
  payment: RoyaltyPayment;
  expanded: boolean;
  onToggle: () => void;
}

const visibility = (key: string) =>
  PAYMENT_COLUMNS.find((column) => column.key === key)!.visibility;

/** Avatares del desglose, en los colores de identidad del sistema. */
const AVATAR_COLORS = ["#FF5C00", "#1C1D22", "#2FB37E", "#7C5CFF", "#0B7DDA", "#F0A202"];

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Fila del historial de pagos, desplegable para ver a quién se repartió.
 *
 * El reparto es justo lo que se viene a mirar y antes solo se insinuaba con un
 * chevron pegado al importe; ahora la propia fila anuncia cuántos destinatarios
 * hay debajo.
 */
export function PaymentRow({ payment, expanded, onToggle }: PaymentRowProps) {
  const status = PAYMENT_STATUS[payment.status] ?? PAYMENT_STATUS.pending;
  const StatusIcon = status.Icon;
  const reference = payment.stripePaymentIntentId || payment._id;
  const recipients = payment.breakdown ?? [];
  const title = songTitle(payment.songId);

  return (
    <div className={expanded ? "bg-[#F4F5F7]" : ""}>
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={`${title}, ${status.label}. Ver reparto`}
        className={`${PAYMENTS_GRID} w-full px-5 py-3 text-left transition-colors hover:bg-[#F4F5F7]`}
      >
        {/* Fecha */}
        <div className={DATE_COLUMN_VISIBILITY}>
          <span className="font-mono text-[11.5px] text-[#71757E]">
            {formatDate(payment.createdAt)}
          </span>
        </div>

        {/* Canción */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[11px] bg-[#F4F5F7]">
            <Music className="h-[14px] w-[14px] text-[#A6AAB2]" />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-[13px] font-semibold text-[#1C1D22]" title={title}>
              {title}
            </span>
            <span className="truncate text-[11px] text-[#A6AAB2]">
              {recipients.length === 0
                ? "Sin desglose"
                : `${recipients.length} ${
                    recipients.length === 1 ? "destinatario" : "destinatarios"
                  }`}
            </span>
          </span>
        </div>

        {/* Referencia */}
        <div className={`${visibility("reference")} min-w-0 items-center gap-1.5`}>
          <span className="truncate font-mono text-[10.5px] text-[#A6AAB2]" title={reference}>
            {reference}
          </span>
          <span onClick={(e) => e.stopPropagation()}>
            <CopyButton value={reference} title="Copiar referencia" />
          </span>
        </div>

        {/* Estado */}
        <div className={visibility("status")}>
          <span
            className="flex items-center gap-1.5 rounded-[14px] px-2.5 py-1.5 text-[10.5px] font-semibold"
            style={{ backgroundColor: status.background, color: status.color }}
          >
            <StatusIcon className="h-[11px] w-[11px]" />
            {status.label}
          </span>
        </div>

        {/* Monto */}
        <div className={`${visibility("amount")} flex-col items-start gap-0.5`}>
          <span
            className={`font-mono text-[13px] font-semibold ${
              payment.status === "failed" ? "text-[#A6AAB2] line-through" : "text-[#1C1D22]"
            }`}
          >
            {formatCurrency(payment.amount ?? 0)}
          </span>
          <span className="font-mono text-[9.5px] text-[#A6AAB2]">
            {(payment.currency || "usd").toUpperCase()}
          </span>
        </div>

        {/* Abrir */}
        <div className="flex justify-end">
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded ? "rotate-180 text-[#FF5C00]" : "text-[#A6AAB2]"
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-2.5 px-5 pb-4 pt-1">
          <span className="font-mono text-[9px] font-semibold tracking-[1.1px] text-[#71757E]">
            REPARTIDO A
          </span>

          {recipients.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-3 text-[12px] text-[#A6AAB2]">
              Este pago no guardó el detalle del reparto.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-2xl bg-white">
              {recipients.map((item, index) => {
                const name = collaboratorName(item.collaboratorId);
                return (
                  <div key={`${name}-${index}`} className="flex items-center gap-3 px-4 py-2.5">
                    <span
                      className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                    >
                      {name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[#1C1D22]">
                      {name}
                    </span>
                    <span className="flex-shrink-0 rounded-xl bg-[#F4F5F7] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#71757E]">
                      {item.percentage}%
                    </span>
                    <span className="w-[90px] flex-shrink-0 text-right font-mono text-[12.5px] font-semibold text-[#1C1D22]">
                      {formatCurrency(item.amount ?? 0)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
