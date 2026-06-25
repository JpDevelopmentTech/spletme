import { useEffect, useState } from "react";
import {
  DollarSign,
  Loader2,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import PaymentsService from "@/services/payments";
import type { RoyaltyPayment, RoyaltyBreakdownItem } from "@/services/payments";

interface Props {
  songId?: string;
  refreshTrigger?: number;
}

const STATUS_CONFIG: Record<
  RoyaltyPayment["status"],
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  succeeded: {
    label: "Completado",
    color: "#16A34A",
    bg: "#ECFDF5",
    icon: CheckCircle2,
  },
  processing: {
    label: "En proceso",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    icon: Clock,
  },
  pending: { label: "Pendiente", color: "#D97706", bg: "#FFFBEB", icon: Clock },
  failed: {
    label: "Fallido",
    color: "#DC2626",
    bg: "#FFF1F2",
    icon: AlertCircle,
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getCollaboratorName = (id: RoyaltyBreakdownItem["collaboratorId"]) => {
  if (id && typeof id === "object")
    return id.name || id.username || id.email || "Colaborador";
  return "Colaborador";
};

/**
 * Historial de todos los cobros de regalías realizados para una canción, con el
 * desglose de a qué colaboradores se repartió cada uno (expandible).
 */
export default function SongPaymentsHistory({ songId, refreshTrigger }: Props) {
  const [payments, setPayments] = useState<RoyaltyPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!songId) return;
    setLoading(true);
    PaymentsService.getSongHistory(songId).then((res) => {
      if (!res.error && res.data) setPayments(res.data);
      setLoading(false);
    });
  }, [songId, refreshTrigger]);

  const total = payments
    .filter((p) => p.status !== "failed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Historial de Pagos Realizados
            </h3>
            <p className="text-sm text-gray-500">
              {payments.length} cobro{payments.length !== 1 ? "s" : ""} · Total
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Cargando historial…</span>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <DollarSign className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm">
            Aún no se han realizado pagos de esta canción.
          </p>
        </div>
      ) : (
        <div className="max-h-[400px] divide-y divide-gray-100 overflow-y-auto">
          {payments.map((p) => {
            const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const isOpen = expandedId === p._id;
            const recipients = p.breakdown ?? [];
            return (
              <div key={p._id}>
                <div
                  onClick={() => setExpandedId(isOpen ? null : p._id)}
                  className="flex cursor-pointer items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      $
                      {p.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      USD
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(p.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-[#FAFAFA] px-6 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Repartido a
                    </span>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {recipients.length > 0 ? (
                        recipients.map((b, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-gray-700">
                              {getCollaboratorName(b.collaboratorId)}
                            </span>
                            <span className="text-gray-500">
                              {b.percentage}% · $
                              {b.amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">
                          Sin desglose.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
