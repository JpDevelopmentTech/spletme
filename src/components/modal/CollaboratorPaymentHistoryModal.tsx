import { useEffect, useState } from "react";
import { Clock3, CheckCircle2, AlertCircle, Send, Receipt } from "lucide-react";
import PaymentsService from "@/services/payments";
import type { CollaboratorPaymentHistoryItem } from "@/services/payments";
import { ModalShell, FooterNote, PrimaryButton } from "@/components/ui/ModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  collaboratorId: string;
  collaboratorName?: string;
  songTitle?: string;
  /** Lo que todavía se le debe en esta canción. */
  pendingAmount?: number;
}

/** Estado del cobro (ACH) traducido a lo que significa para quien mira. */
const PAYMENT_STATUS: Record<
  string,
  { label: string; bg: string; color: string; icon: typeof CheckCircle2 }
> = {
  succeeded: { label: "Recibido", bg: "#E4F5EC", color: "#2FB37E", icon: CheckCircle2 },
  processing: { label: "En camino", bg: "#FFEADD", color: "#EA580C", icon: Send },
  pending: { label: "En camino", bg: "#FFEADD", color: "#EA580C", icon: Clock3 },
  failed: { label: "Falló", bg: "#FDECEC", color: "#E5484D", icon: AlertCircle },
};

const PAYOUT_LABEL: Record<string, string> = {
  created: "creado",
  funded: "fondeado",
  processing: "procesando",
  sent: "enviado",
  failed: "falló el envío",
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

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase() || "?";

/**
 * Responde «¿ya le pagué?» sin salir de la canción: lo entregado, lo que falta
 * y cada envío con su estado.
 */
export default function CollaboratorPaymentHistoryModal({
  isOpen,
  onClose,
  songId,
  collaboratorId,
  collaboratorName,
  songTitle,
  pendingAmount = 0,
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

  const name = collaboratorName || "este colaborador";
  const totalPaid = items
    .filter((i) => i.paymentStatus !== "failed")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <ModalShell
      title={`Pagos a ${name}`}
      subtitle={songTitle || "Esta canción"}
      logo={
        <span className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-full bg-[#1C1D22] text-[13px] font-semibold text-white">
          {getInitials(name)}
        </span>
      }
      onClose={onClose}
      footer={
        <>
          <FooterNote>
            {pendingAmount > 0
              ? "Puedes pagarle lo que falta desde su fila en colaboradores."
              : "No queda nada pendiente con esta persona."}
          </FooterNote>
          <PrimaryButton onClick={onClose}>Cerrar</PrimaryButton>
        </>
      }
    >
      <div className="flex items-center gap-3.5 rounded-[18px] bg-[#F4F5F7] px-5 py-4">
        <div className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
            LE HAS PAGADO
          </span>
          <span className="font-mono text-[26px] font-semibold text-[#1C1D22]">
            {money(totalPaid)}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
            LE DEBES
          </span>
          <span
            className={`font-mono text-[26px] font-semibold ${
              pendingAmount > 0 ? "text-[#EA580C]" : "text-[#2FB37E]"
            }`}
          >
            {money(pendingAmount)}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-2.5 py-10 text-center">
          <Clock3 className="h-6 w-6 animate-pulse text-[#A6AAB2]" />
          <p className="text-sm text-[#71757E]">Trayendo los pagos…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 py-10 text-center">
          <span className="grid h-[52px] w-[52px] place-items-center rounded-[18px] bg-[#FFEADD]">
            <Receipt className="h-[22px] w-[22px] text-[#FF5C00]" />
          </span>
          <p className="text-[13px] font-semibold text-[#1C1D22]">
            Todavía no le has pagado nada en esta canción
          </p>
          <p className="max-w-[320px] text-[12px] text-[#71757E]">
            Cuando salga el primer pago, quedará apuntado aquí con su fecha y su estado.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[18px] border border-[#E8E8EC]">
          {items.map((item, index) => {
            const cfg = PAYMENT_STATUS[item.paymentStatus] ?? PAYMENT_STATUS.pending;
            const Icon = cfg.icon;
            const payout = item.payoutStatus ? PAYOUT_LABEL[item.payoutStatus] : null;
            return (
              <div key={item.royaltyPaymentId}>
                {index > 0 && <div className="h-px bg-[#E8E8EC]" />}
                <div className="flex items-center gap-[11px] px-4 py-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                      {formatDate(item.date)}
                    </span>
                    <span className="truncate text-[11px] text-[#A6AAB2]">
                      {payout ? `Envío ${payout}` : "Sin datos del envío"}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-[13px] font-semibold text-[#1C1D22]">
                    {money(item.amount)}
                  </span>
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[12px] px-[9px] py-1 text-[10px] font-semibold"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    <Icon className="h-2.5 w-2.5" />
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ModalShell>
  );
}
