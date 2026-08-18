import { useEffect, useMemo, useState } from "react";
import { Receipt, CheckCircle2, Clock3, AlertCircle, Send } from "lucide-react";
import PaymentsService from "@/services/payments";
import type { RoyaltyPayment, RoyaltyBreakdownItem } from "@/services/payments";

interface Props {
  songId?: string;
  refreshTrigger?: number;
  pendingAmount?: number;
}

const STATUS: Record<
  RoyaltyPayment["status"],
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  succeeded: { label: "Recibido", color: "#2FB37E", bg: "#E4F5EC", icon: CheckCircle2 },
  processing: { label: "En camino", color: "#EA580C", bg: "#FFEADD", icon: Send },
  pending: { label: "En camino", color: "#EA580C", bg: "#FFEADD", icon: Clock3 },
  failed: { label: "Falló", color: "#E5484D", bg: "#FDECEC", icon: AlertCircle },
};

const money = (n: number) =>
  n.toLocaleString("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });

function recipientName(id: RoyaltyBreakdownItem["collaboratorId"]): string {
  if (id && typeof id === "object") return id.name || id.username || id.email || "Colaborador";
  return "Colaborador";
}

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

interface PaymentRow {
  key: string;
  date: string;
  name: string;
  amount: number;
  method: string;
  status: RoyaltyPayment["status"];
}

/**
 * Lo que ya salió de la cuenta por esta canción: un apunte por persona y pago,
 * del más reciente al más antiguo.
 */
export default function SongPaymentsHistory({ songId, refreshTrigger, pendingAmount }: Props) {
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

  const totalPaid = payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  // Un pago puede repartirse entre varias personas: cada una es una línea.
  const rows = useMemo<PaymentRow[]>(() => {
    return payments.flatMap((p) => {
      const method = p.stripePaymentIntentId ? "Stripe" : (p.currency?.toUpperCase() ?? "—");
      const recipients = p.breakdown ?? [];
      if (recipients.length === 0) {
        return [
          {
            key: p._id,
            date: p.createdAt,
            name: "Pago de la canción",
            amount: p.amount,
            method,
            status: p.status,
          },
        ];
      }
      return recipients.map((b, i) => ({
        key: `${p._id}-${i}`,
        date: p.createdAt,
        name: recipientName(b.collaboratorId),
        amount: b.amount,
        method,
        status: p.status,
      }));
    });
  }, [payments]);

  const pending = pendingAmount ?? 0;

  return (
    <section className="flex flex-col overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
      <header className="flex flex-col gap-0.5 px-5 py-[18px]">
        <h3 className="font-display text-[18px] font-semibold text-[#1C1D22]">
          Lo que ya se ha pagado
        </h3>
        <p className="text-[12.5px] font-medium text-[#71757E]">
          {loading
            ? "Trayendo el historial…"
            : rows.length === 0
              ? "Todavía no ha salido dinero por esta canción"
              : `${payments.length} ${payments.length === 1 ? "cobro" : "cobros"} · ${money(totalPaid)} entregados`}
        </p>
      </header>

      <div className="h-px bg-[#E8E8EC]" />

      {loading ? (
        <div className="flex flex-col items-center gap-2.5 py-14 text-center">
          <Clock3 className="h-6 w-6 animate-pulse text-[#A6AAB2]" />
          <p className="text-sm text-[#71757E]">Trayendo el historial…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 px-6 py-14 text-center">
          <span className="grid h-[58px] w-[58px] place-items-center rounded-[20px] bg-[#FFEADD]">
            <Receipt className="h-6 w-6 text-[#FF5C00]" />
          </span>
          <p className="text-[15px] font-semibold text-[#1C1D22]">Aún no se ha pagado nada</p>
          <p className="max-w-[300px] text-[13px] text-[#71757E]">
            Cuando pagues a los colaboradores, cada envío quedará apuntado aquí con su fecha.
          </p>
        </div>
      ) : (
        <ul className="max-h-[420px] flex-1 overflow-y-auto">
          {rows.map((row, index) => {
            const cfg = STATUS[row.status] ?? STATUS.pending;
            const Icon = cfg.icon;
            return (
              <li key={row.key}>
                {index > 0 && <div className="h-px bg-[#E8E8EC]" />}
                <div className="flex items-center gap-[11px] px-5 py-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1C1D22] text-[10px] font-semibold text-white">
                    {getInitials(row.name)}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                      {row.name}
                    </span>
                    <span className="truncate text-[11px] text-[#A6AAB2]">
                      {formatDate(row.date)} · {row.method}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-[13px] font-semibold text-[#1C1D22]">
                    {money(row.amount)}
                  </span>
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[12px] px-[9px] py-1 text-[10px] font-semibold"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    <Icon className="h-2.5 w-2.5" />
                    {cfg.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="h-px bg-[#E8E8EC]" />

      <footer className="flex items-center gap-2 px-5 py-3.5">
        {pending > 0 ? (
          <>
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#EA580C]" />
            <span className="text-[11.5px] font-semibold text-[#EA580C]">
              Quedan {money(pending)} por pagar
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#2FB37E]" />
            <span className="text-[11.5px] font-semibold text-[#2FB37E]">
              No queda nada pendiente
            </span>
          </>
        )}
      </footer>
    </section>
  );
}
