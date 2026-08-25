import { useState } from "react";
import { UserMinus, AlertCircle, Check } from "lucide-react";
import {
  ModalShell,
  ModalMark,
  FooterNote,
  SecondaryButton,
  DangerButton,
} from "@/components/ui/ModalShell";

export interface RemoveCollaboratorTarget {
  collaboratorId: string;
  name: string;
  email?: string;
  /** Porcentaje de su split activo, si tiene uno. */
  percentage: number | null;
  /** Devengado y todavía sin pagar en esta canción. */
  pending: number;
}

interface RemoveCollaboratorModalProps {
  target: RemoveCollaboratorTarget;
  songTitle?: string;
  onClose: () => void;
  onConfirm: (collaboratorId: string) => Promise<void>;
}

const formatMoney = (value: number) =>
  value.toLocaleString("es-CO", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const messageOf = (error: unknown) => {
  const err = error as { response?: { data?: { message?: string; error?: string } } };
  return (
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    "No pudimos quitarlo de la canción. Inténtalo de nuevo."
  );
};

/**
 * Confirmación para desvincular a alguien de una canción.
 *
 * La persona no se borra: sigue en tu lista de colaboradores mientras trabaje
 * contigo en otra canción, y lo que ya se le pagó sigue en su historial. Lo que
 * se deshace es todo lo que le ataba a ESTA canción, y eso se enumera aquí
 * porque es más de lo que parece desde fuera.
 */
export function RemoveCollaboratorModal({
  target,
  songTitle,
  onClose,
  onConfirm,
}: RemoveCollaboratorModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const confirm = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await onConfirm(target.collaboratorId);
      onClose();
    } catch (error: unknown) {
      setErrorMessage(messageOf(error));
    } finally {
      setIsLoading(false);
    }
  };

  const consequences = [
    "Deja de figurar entre quienes cobran de esta canción.",
    target.percentage !== null
      ? `Su split del ${target.percentage}% se retira, y queda en el historial.`
      : "No tiene split que retirar en esta canción.",
    "Pierde el acceso a esta canción, pero conserva las demás en las que colabore.",
  ];

  return (
    <ModalShell
      title="Quitar de la canción"
      subtitle={songTitle || "Esta canción"}
      locked={isLoading}
      onClose={onClose}
      logo={
        <ModalMark tone="danger">
          <UserMinus className="h-[18px] w-[18px]" />
        </ModalMark>
      }
      footer={
        <>
          <FooterNote>La persona y sus pagos anteriores no se borran.</FooterNote>
          <SecondaryButton onClick={onClose} disabled={isLoading}>
            Cancelar
          </SecondaryButton>
          <DangerButton
            onClick={confirm}
            disabled={isLoading}
            icon={<UserMinus className="h-[15px] w-[15px]" />}
          >
            {isLoading ? "Quitando…" : "Quitar de la canción"}
          </DangerButton>
        </>
      }
    >
      <p className="text-[13px] leading-[1.5] text-[#71757E]">
        <span className="font-semibold text-[#1C1D22]">{target.name}</span>
        {target.email ? ` (${target.email})` : ""} deja de estar vinculado a esta canción.
      </p>

      <ul className="flex flex-col gap-2 rounded-[16px] bg-[#F4F5F7] p-3.5">
        {consequences.map((line) => (
          <li key={line} className="flex items-start gap-2.5">
            <Check className="mt-[2px] h-3 w-3 flex-shrink-0 text-[#A6AAB2]" />
            <span className="text-[11.5px] leading-[1.45] text-[#71757E]">{line}</span>
          </li>
        ))}
      </ul>

      {target.pending > 0 && (
        <p className="flex items-start gap-2.5 rounded-[14px] bg-[#FFEADD] px-3.5 py-3 text-[11.5px] leading-[1.45] text-[#EA580C]">
          <AlertCircle className="mt-[1px] h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Tiene {formatMoney(target.pending)} devengados sin pagar aquí. Al quitarlo, ese
            pendiente deja de calcularse; lo que ya se le pagó permanece en su historial.
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

export default RemoveCollaboratorModal;
