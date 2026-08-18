import { CircleCheck, Loader, TriangleAlert, Receipt } from "lucide-react";
import { formatCurrency } from "@/utils/format.utils";
import { collaboratorColor, initialsOf } from "@/utils/collaborators.utils";
import type { RoyaltyPayment } from "@/services/payments";
import type { RecentPayment } from "@/utils/payments.utils";

interface RecentPaymentsSectionProps {
  payments: RecentPayment[];
  loading: boolean;
  onSeeAll?: () => void;
}

const STATUS_META: Record<RoyaltyPayment["status"], { label: string; fg: string; bg: string }> = {
  succeeded: { label: "Recibido", fg: "#2FB37E", bg: "#E4F5EC" },
  processing: { label: "En camino", fg: "#EA580C", bg: "#FFEADD" },
  pending: { label: "En camino", fg: "#EA580C", bg: "#FFEADD" },
  failed: { label: "Falló", fg: "#E5484D", bg: "#FDECEC" },
};

/**
 * Lo último que ha salido de tu cuenta hacia colaboradores.
 *
 * Sale del historial real de cobros de regalías: cada cobro trae su reparto, y
 * aquí se aplana a una línea por persona, que es como se lee.
 */
export function RecentPaymentsSection({
  payments,
  loading,
  onSeeAll,
}: RecentPaymentsSectionProps) {
  return (
    <section className="flex flex-col gap-3.5 rounded-[26px] border border-[#E8E8EC] bg-white p-6 shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-[15px] font-semibold text-[#1C1D22]">
            Últimos pagos enviados
          </h2>
          <p className="text-[11.5px] text-[#71757E]">
            Lo que ha salido de tu cuenta hacia colaboradores
          </p>
        </div>
        {payments.length > 0 && onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-[11.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
          >
            Ver todo el historial
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-[#F4F5F7] px-3.5 py-3">
              <span className="h-[34px] w-[34px] flex-shrink-0 animate-pulse rounded-full bg-white" />
              <span className="flex flex-1 flex-col gap-1.5">
                <span className="h-2.5 w-[140px] animate-pulse rounded-full bg-white" />
                <span className="h-2 w-[190px] animate-pulse rounded-full bg-white/70" />
              </span>
              <span className="h-3 w-[80px] animate-pulse rounded-full bg-white" />
            </div>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-9">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
            <Receipt className="h-[22px] w-[22px] text-[#71757E]" />
          </span>
          <span className="text-[13px] font-semibold text-[#1C1D22]">Todavía no has pagado nada</span>
          <span className="text-center text-[11.5px] text-[#71757E]">
            Cuando envíes tu primer pago aparecerá aquí, con su estado y a quién fue.
          </span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {payments.map((payment, index) => {
            const status = STATUS_META[payment.status] ?? STATUS_META.pending;
            return (
              <li
                key={payment.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#F4F5F7] px-3.5 py-2.5"
              >
                <span
                  className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: collaboratorColor(index) }}
                >
                  <span className="text-[11px] font-semibold text-white">
                    {initialsOf(payment.collaboratorName)}
                  </span>
                </span>

                <span className="flex min-w-[150px] flex-1 flex-col gap-0.5">
                  <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                    {payment.collaboratorName}
                  </span>
                  <span className="truncate text-[10.5px] text-[#A6AAB2]">
                    {payment.songTitle} · {formatRelative(payment.date)}
                  </span>
                </span>

                <span className="font-mono text-[13.5px] font-semibold text-[#1C1D22]">
                  {formatCurrency(payment.amount)}
                </span>

                <span
                  className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-[14px] px-2.5 py-1.5"
                  style={{ backgroundColor: status.bg, color: status.fg }}
                >
                  {payment.status === "succeeded" ? (
                    <CircleCheck className="h-3 w-3" />
                  ) : payment.status === "failed" ? (
                    <TriangleAlert className="h-3 w-3" />
                  ) : (
                    <Loader className="h-3 w-3 animate-spin" />
                  )}
                  <span className="text-[10.5px] font-semibold">{status.label}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** "Hace 2 horas", "Ayer", "hace 5 días", o la fecha si ya queda lejos. */
function formatRelative(iso: string): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "—";

  const minutes = Math.floor((Date.now() - then.getTime()) / 60_000);
  if (minutes < 60) return minutes <= 1 ? "hace un momento" : `hace ${minutes} minutos`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days} días`;

  return then.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}
