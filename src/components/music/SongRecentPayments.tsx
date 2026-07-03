import { useEffect, useState } from "react";
import { Receipt, ArrowRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import PaymentsService from "@/services/payments";
import type { RoyaltyPayment, RoyaltyBreakdownItem } from "@/services/payments";

interface SongRecentPaymentsProps {
  songId?: string;
  refreshTrigger?: number;
  onViewAll: () => void;
}

const STATUS: Record<
  RoyaltyPayment["status"],
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  succeeded: { label: "Completado", color: "#2FB37E", bg: "#E4F5EC", icon: CheckCircle2 },
  processing: { label: "En proceso", color: "#FF5C00", bg: "#FFEADD", icon: Clock },
  pending: { label: "Pendiente", color: "#FF5C00", bg: "#FFEADD", icon: Clock },
  failed: { label: "Fallido", color: "#EF4444", bg: "#FEECEC", icon: AlertCircle },
};

const TINTS = ["#FF5C00", "#A6AAB2", "#2FB37E"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

/** Nombre del primer destinatario de un pago (o "Pago" si no hay desglose). */
function recipientName(id: RoyaltyBreakdownItem["collaboratorId"]): string {
  if (id && typeof id === "object") return id.name || id.username || id.email || "Colaborador";
  return "Colaborador";
}

/** Iniciales (hasta 2) de un nombre. */
function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0] ?? "")
      .join("")
      .toUpperCase() || "?"
  );
}

/**
 * Últimos pagos realizados de la canción para la pestaña Resumen. Cada fila
 * muestra el colaborador (avatar + nombre + fecha), el monto y el estado.
 */
export function SongRecentPayments({ songId, refreshTrigger, onViewAll }: SongRecentPaymentsProps) {
  const [payments, setPayments] = useState<RoyaltyPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!songId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    PaymentsService.getSongHistory(songId).then((res) => {
      if (!res.error && res.data) setPayments(res.data);
      setLoading(false);
    });
  }, [songId, refreshTrigger]);

  const recent = payments.slice(0, 3);

  return (
    <div className="flex flex-col gap-3 rounded-[28px] bg-[#F4F5F7] p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Receipt className="h-[18px] w-[18px] text-[#1C1D22]" />
          <h3 className="text-base font-semibold text-[#1C1D22]">Pagos recientes</h3>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
        >
          Ver historial
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[#FF5C00]" />
        </div>
      ) : recent.length === 0 ? (
        <div className="rounded-[16px] bg-white p-6 text-center text-sm text-[#A6AAB2]">
          Aún no hay pagos realizados.
        </div>
      ) : (
        recent.map((p, idx) => {
          const cfg = STATUS[p.status] ?? STATUS.pending;
          const Icon = cfg.icon;
          const recipients = p.breakdown ?? [];
          const firstName = recipients.length ? recipientName(recipients[0].collaboratorId) : "Pago";
          const extra = recipients.length > 1 ? recipients.length - 1 : 0;
          return (
            <div
              key={p._id}
              className="flex items-center gap-3 rounded-[16px] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <span
                className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: TINTS[idx % TINTS.length] }}
              >
                <span className="text-[10.5px] font-bold text-white">{getInitials(firstName)}</span>
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] font-semibold text-[#1C1D22]">
                  {firstName}
                  {extra > 0 && <span className="text-[#A6AAB2]"> +{extra}</span>}
                </span>
                <span className="text-[11px] text-[#A6AAB2]">{formatDate(p.createdAt)}</span>
              </div>
              <span className="text-[13px] font-bold text-[#1C1D22]">
                ${p.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                <Icon className="h-3 w-3" />
                {cfg.label}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
