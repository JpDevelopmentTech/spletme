import { DollarSign, AlertCircle, Landmark } from "lucide-react";
import { useState } from "react";
import {
  ModalShell,
  ModalMark,
  FooterNote,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui/ModalShell";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  collaboratorName: string;
  collaboratorEmail: string;
  amount: number;
  currency?: string;
  songTitle?: string;
}

const money = (n: number) =>
  n.toLocaleString("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase() || "?";

/**
 * Enseña a quién va el dinero y cuánto sale antes de mover nada. El cobro se
 * hace por débito ACH a la cuenta del owner y el envío al colaborador vía Wise.
 */
export default function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  collaboratorName,
  collaboratorEmail,
  amount,
  currency = "USD",
  songTitle,
}: PaymentConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      title={`Pagar a ${collaboratorName}`}
      subtitle={songTitle || "Esta canción"}
      logo={
        <ModalMark>
          <DollarSign className="h-[18px] w-[18px]" />
        </ModalMark>
      }
      locked={loading}
      onClose={onClose}
      footer={
        <>
          <FooterNote>Una vez enviado no se puede deshacer desde aquí.</FooterNote>
          <SecondaryButton onClick={onClose} disabled={loading}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton
            onClick={handleConfirm}
            disabled={loading}
            icon={<DollarSign className="h-3.5 w-3.5" />}
          >
            {loading ? "Enviando…" : `Pagar ${money(amount)}`}
          </PrimaryButton>
        </>
      }
    >
      {error && (
        <div className="flex items-center gap-2.5 rounded-[14px] bg-[#FDECEC] px-3 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#E5484D]" />
          <span className="text-[11.5px] font-medium text-[#E5484D]">{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-2.5 rounded-[18px] bg-[#F4F5F7] px-5 py-[18px]">
        <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
          TOTAL A PAGAR
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[30px] font-semibold text-[#1C1D22]">{money(amount)}</span>
          <span className="font-mono text-[12px] text-[#A6AAB2]">{currency}</span>
        </div>
        <p className="text-[11.5px] text-[#71757E]">
          Se cobra de tu cuenta bancaria y le llega por Wise.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-[18px] border border-[#E8E8EC] px-4 py-3.5">
        <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-[#1C1D22] text-[11.5px] font-semibold text-white">
          {getInitials(collaboratorName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[#1C1D22]">{collaboratorName}</p>
          <p className="truncate text-[11px] text-[#A6AAB2]">{collaboratorEmail}</p>
        </div>
        <span className="shrink-0 font-mono text-[13px] font-semibold text-[#2FB37E]">
          {money(amount)}
        </span>
      </div>

      <div className="flex items-center gap-2.5 rounded-[14px] bg-[#F4F5F7] px-3 py-2.5">
        <Landmark className="h-3.5 w-3.5 shrink-0 text-[#71757E]" />
        <span className="text-[11.5px] font-medium leading-[1.4] text-[#71757E]">
          El cobro se confirma al instante y el envío suele liquidar en unos dos días hábiles.
        </span>
      </div>
    </ModalShell>
  );
}
