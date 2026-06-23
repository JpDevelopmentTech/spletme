import { useEffect, useState } from "react";
import { DollarSign, Loader2, ChevronDown, CheckCircle2, Clock, AlertCircle } from "lucide-react";
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
  succeeded: { label: "Completado", color: "#16A34A", bg: "#ECFDF5", icon: CheckCircle2 },
  processing: { label: "En proceso", color: "#1D4ED8", bg: "#EFF6FF", icon: Clock },
  pending: { label: "Pendiente", color: "#D97706", bg: "#FFFBEB", icon: Clock },
  failed: { label: "Fallido", color: "#DC2626", bg: "#FFF1F2", icon: AlertCircle },
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
  if (id && typeof id === "object") return id.name || id.username || id.email || "Colaborador";
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Historial de Pagos Realizados</h3>
            <p className="text-sm text-gray-500">
              {payments.length} cobro{payments.length !== 1 ? "s" : ""} · Total $
              {total.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando historial…</span>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <DollarSign className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm">Aún no se han realizado pagos de esta canción.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
          {payments.map((p) => {
            const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const isOpen = expandedId === p._id;
            const recipients = p.breakdown ?? [];
            return (
              <div key={p._id}>
                <div
                  onClick={() => setExpandedId(isOpen ? null : p._id)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      ${p.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(p.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="px-6 py-3 bg-[#FAFAFA] border-t border-gray-100">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Repartido a
                    </span>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {recipients.length > 0 ? (
                        recipients.map((b, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 font-medium">
                              {getCollaboratorName(b.collaboratorId)}
                            </span>
                            <span className="text-gray-500">
                              {b.percentage}% · $
                              {b.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Sin desglose.</span>
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
