import { useState } from "react";
import { Trash2, Globe, Radio, AlertCircle } from "lucide-react";
import {
  ModalShell,
  ModalMark,
  FooterNote,
  SecondaryButton,
  DangerButton,
} from "@/components/ui/ModalShell";

export interface RemoveSplitTarget {
  splitId: string;
  /** Nombre de quien pierde el split, tal y como se ve en la tabla. */
  name: string;
  isOwnerSplit: boolean;
  percentage: number | null;
  /** Alcance del split ya resuelto en una frase, o null si no se conoce. */
  scope: { label: string; worldwide: boolean } | null;
  /** Devengado y todavía sin pagar; se avisa antes de soltar el split. */
  pending: number;
}

interface RemoveSplitModalProps {
  target: RemoveSplitTarget;
  songTitle?: string;
  onClose: () => void;
  /** Quita el split; si el backend rechaza, se lanza para pintar el motivo. */
  onConfirm: (splitId: string) => Promise<void>;
}

const formatMoney = (value: number) =>
  value.toLocaleString("es-CO", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/** Mensaje del backend si lo hay; si no, uno genérico. */
const messageOf = (error: unknown) => {
  const err = error as { response?: { data?: { message?: string; error?: string } } };
  return (
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    "No pudimos quitar el split. Inténtalo de nuevo."
  );
};

/**
 * Confirmación para soltar un split de una canción.
 *
 * No borra nada de la base: el split deja de contar en el reparto y el cambio
 * queda registrado en el historial. Lo que sí cambia el dinero se dice aquí
 * antes de pulsar: el pendiente que se deja de deber y, en el caso del owner,
 * que el pool pasa a repartirse entero entre los demás.
 */
export function RemoveSplitModal({
  target,
  songTitle,
  onClose,
  onConfirm,
}: RemoveSplitModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const confirm = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await onConfirm(target.splitId);
      onClose();
    } catch (error: unknown) {
      setErrorMessage(messageOf(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalShell
      title={target.isOwnerSplit ? "Quitar tu parte" : "Quitar el split"}
      subtitle={songTitle || "Esta canción"}
      locked={isLoading}
      onClose={onClose}
      logo={
        <ModalMark tone="danger">
          <Trash2 className="h-[18px] w-[18px]" />
        </ModalMark>
      }
      footer={
        <>
          <FooterNote>El split queda en el historial de la canción.</FooterNote>
          <SecondaryButton onClick={onClose} disabled={isLoading}>
            Cancelar
          </SecondaryButton>
          <DangerButton
            onClick={confirm}
            disabled={isLoading}
            icon={<Trash2 className="h-[15px] w-[15px]" />}
          >
            {isLoading ? "Quitando…" : "Quitar split"}
          </DangerButton>
        </>
      }
    >
      <p className="text-[13px] leading-[1.5] text-[#71757E]">
        <span className="font-semibold text-[#1C1D22]">{target.name}</span>{" "}
        {target.isOwnerSplit
          ? "deja de tener parte asignada en esta canción."
          : "deja de cobrar de esta canción."}{" "}
        El split no se borra: se marca como retirado y sigue visible en el historial.
      </p>

      <ul className="flex flex-col gap-2 rounded-[16px] bg-[#F4F5F7] p-3.5">
        <li className="flex items-center justify-between gap-4">
          <span className="text-[11.5px] text-[#71757E]">Porcentaje</span>
          <span className="font-mono text-[13px] font-semibold text-[#1C1D22]">
            {target.percentage != null ? `${target.percentage}%` : "—"}
          </span>
        </li>
        {target.scope && (
          <li className="flex items-center justify-between gap-4">
            <span className="text-[11.5px] text-[#71757E]">Alcance</span>
            <span className="flex min-w-0 items-center gap-1.5">
              {target.scope.worldwide ? (
                <Globe className="h-3 w-3 flex-shrink-0 text-[#A6AAB2]" />
              ) : (
                <Radio className="h-3 w-3 flex-shrink-0 text-[#A6AAB2]" />
              )}
              <span className="truncate text-[11.5px] font-semibold text-[#1C1D22]">
                {target.scope.label}
              </span>
            </span>
          </li>
        )}
      </ul>

      {target.pending > 0 && (
        <p className="flex items-start gap-2.5 rounded-[14px] bg-[#FFEADD] px-3.5 py-3 text-[11.5px] leading-[1.45] text-[#EA580C]">
          <AlertCircle className="mt-[1px] h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Tiene {formatMoney(target.pending)} devengados sin pagar. Al quitar el split ese
            pendiente deja de calcularse; lo que ya se le pagó permanece en su historial de pagos.
          </span>
        </p>
      )}

      {target.isOwnerSplit ? (
        <p className="flex items-start gap-2.5 rounded-[14px] bg-[#FDECEC] px-3.5 py-3 text-[11.5px] leading-[1.45] text-[#E5484D]">
          <AlertCircle className="mt-[1px] h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Sin tu split no podrás crear ni editar los de los demás hasta que vuelvas a fijar tu
            parte.
          </span>
        </p>
      ) : (
        <p className="flex items-start gap-2.5 rounded-[14px] bg-[#F4F5F7] px-3.5 py-3 text-[11.5px] leading-[1.45] text-[#71757E]">
          <AlertCircle className="mt-[1px] h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
          <span>
            Seguirá figurando como colaborador de la canción, pero sin split. Mientras siga así,
            «Pagar a todos» queda bloqueado: asígnale un split nuevo o quítalo de la canción.
          </span>
        </p>
      )}

      {errorMessage && (
        <p className="flex items-start gap-2.5 rounded-[14px] bg-[#FDECEC] px-3.5 py-3 text-[11.5px] leading-[1.45] text-[#E5484D]">
          <AlertCircle className="mt-[1px] h-3.5 w-3.5 flex-shrink-0" />
          {errorMessage}
        </p>
      )}
    </ModalShell>
  );
}

export default RemoveSplitModal;
