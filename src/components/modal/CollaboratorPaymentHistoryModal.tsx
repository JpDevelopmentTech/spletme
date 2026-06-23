import { useEffect, useState } from "react";
import { X, Loader2, History } from "lucide-react";
import PaymentsService from "@/services/payments";
import type { CollaboratorPaymentHistoryItem } from "@/services/payments";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  collaboratorId: string;
  collaboratorName?: string;
}

const PAYMENT_LABEL: Record<string, string> = {
  succeeded: "Completado",
  processing: "En proceso",
  pending: "Pendiente",
  failed: "Fallido",
};

const PAYOUT_LABEL: Record<string, string> = {
  created: "Creado",
  funded: "Fondeado",
  processing: "Procesando",
  sent: "Enviado",
  failed: "Fallido",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

/**
 * Modal con el histórico de pagos hechos a un colaborador en una canción:
 * fecha, monto, estado del cobro (ACH) y estado del envío (Wise).
 */
export default function CollaboratorPaymentHistoryModal({
  isOpen,
  onClose,
  songId,
  collaboratorId,
  collaboratorName,
}: Props) {
  const [items, setItems] = useState<CollaboratorPaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !songId || !collaboratorId) return;
    setLoading(true);
    PaymentsService.getCollaboratorHistory(songId, collaboratorId).then((res) => {
      if (!res.error && res.data) setItems(res.data);
      setLoading(false);
    });
  }, [isOpen, songId, collaboratorId]);

  if (!isOpen) return null;

  const totalPaid = items
    .filter((i) => i.paymentStatus !== "failed")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            <span className="text-[15px] font-bold text-gray-900">
              Historial de pagos {collaboratorName ? `· ${collaboratorName}` : ""}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Cargando historial…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Aún no se le ha pagado a este colaborador en esta canción.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((it) => (
                <div
                  key={it.royaltyPaymentId}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#F7F8FA] px-3 py-2.5"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                      ${it.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(it.date)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs font-medium text-gray-600">
                      Cobro: {PAYMENT_LABEL[it.paymentStatus] ?? it.paymentStatus}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Envío: {it.payoutStatus ? PAYOUT_LABEL[it.payoutStatus] ?? it.payoutStatus : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && items.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Total pagado</span>
            <span className="text-sm font-bold text-gray-900">
              ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
