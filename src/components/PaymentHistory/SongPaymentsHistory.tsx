import { useEffect, useMemo, useState } from "react";
import { DollarSign, Receipt, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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
  succeeded: { label: "Completado", color: "#2FB37E", bg: "#E4F5EC", icon: CheckCircle2 },
  processing: { label: "En proceso", color: "#FF5C00", bg: "#FFEADD", icon: Clock },
  pending: { label: "Pendiente", color: "#FF5C00", bg: "#FFEADD", icon: Clock },
  failed: { label: "Fallido", color: "#EF4444", bg: "#FEECEC", icon: AlertCircle },
};

const TINTS = ["#FF5C00", "#A6AAB2", "#2FB37E", "#101114"];

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

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

const COLUMNS: { label: string; width: string }[] = [
  { label: "FECHA", width: "w-[150px]" },
  { label: "MONTO", width: "w-[130px]" },
  { label: "MÉTODO", width: "w-[150px]" },
  { label: "ESTADO", width: "w-[140px]" },
];

/**
 * Historial de cobros de regalías de una canción: KPIs de resumen (pagado,
 * pendiente, nº de pagos) y una tabla con el detalle por colaborador.
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

  // Aplana cada pago en una fila por colaborador destinatario del reparto.
  const rows = useMemo<PaymentRow[]>(() => {
    return payments.flatMap((p) => {
      const method = p.stripePaymentIntentId ? "Stripe" : (p.currency?.toUpperCase() ?? "—");
      const recipients = p.breakdown ?? [];
      if (recipients.length === 0) {
        return [
          { key: p._id, date: p.createdAt, name: "Pago", amount: p.amount, method, status: p.status },
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

  return (
    <div className="flex flex-col gap-5">
      {/* Resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Kpi
          icon={<CheckCircle2 className="h-[22px] w-[22px] text-[#2FB37E]" />}
          boxClass="bg-[#E4F5EC]"
          label="Total pagado"
          value={money(totalPaid)}
          valueClass="text-[#2FB37E]"
        />
        <Kpi
          icon={<Clock className="h-[22px] w-[22px] text-[#FF5C00]" />}
          boxClass="bg-[#FFEADD]"
          label="Pendiente"
          value={money(pendingAmount ?? 0)}
        />
        <Kpi
          icon={<Receipt className="h-[22px] w-[22px] text-[#71757E]" />}
          boxClass="bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          label="Pagos realizados"
          value={String(payments.length)}
        />
      </div>

      {/* Historial */}
      <div className="rounded-[28px] bg-[#F4F5F7]">
        <div className="flex items-center gap-2.5 px-6 py-5">
          <Receipt className="h-[19px] w-[19px] text-[#1C1D22]" />
          <h3 className="text-base font-semibold text-[#1C1D22]">Historial de Pagos Realizados</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-[#A6AAB2]">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[#FF5C00]" />
            <span className="text-sm">Cargando historial…</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <DollarSign className="h-6 w-6 text-[#A6AAB2]" />
            </div>
            <p className="text-sm text-[#71757E]">Aún no se han realizado pagos de esta canción.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-5 pb-5">
            <div className="hidden items-center gap-3 px-4 py-2 lg:flex">
              <span className="flex-1 text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
                Colaborador
              </span>
              {COLUMNS.map((c) => (
                <span
                  key={c.label}
                  className={`${c.width} text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]`}
                >
                  {c.label}
                </span>
              ))}
            </div>

            <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto">
              {rows.map((r, idx) => {
                const cfg = STATUS[r.status] ?? STATUS.pending;
                const Icon = cfg.icon;
                return (
                  <div
                    key={r.key}
                    className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: TINTS[idx % TINTS.length] }}
                      >
                        <span className="text-[10px] font-bold text-white">{getInitials(r.name)}</span>
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-medium text-[#1C1D22]">{r.name}</span>
                        <span className="text-[11px] text-[#A6AAB2] lg:hidden">{formatDate(r.date)}</span>
                      </div>
                    </div>
                    <span className="hidden w-[150px] text-[12.5px] font-medium text-[#1C1D22] lg:block">
                      {formatDate(r.date)}
                    </span>
                    <span className="w-[130px] text-[13px] font-bold text-[#1C1D22]">
                      {money(r.amount)}
                    </span>
                    <span className="hidden w-[150px] lg:block">
                      <span className="inline-flex rounded-full bg-[#F4F5F7] px-2.5 py-0.5 text-[11px] font-semibold text-[#71757E]">
                        {r.method}
                      </span>
                    </span>
                    <span className="flex w-[140px]">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface KpiProps {
  icon: React.ReactNode;
  boxClass: string;
  label: string;
  value: string;
  valueClass?: string;
}

/** Tarjeta KPI del resumen de pagos. */
function Kpi({ icon, boxClass, label, value, valueClass = "text-[#1C1D22]" }: KpiProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-[28px] bg-[#F4F5F7] p-[18px]">
      <span
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[16px] ${boxClass}`}
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-[#71757E]">{label}</span>
        <span className={`text-[21px] font-bold ${valueClass}`}>{value}</span>
      </div>
    </div>
  );
}
