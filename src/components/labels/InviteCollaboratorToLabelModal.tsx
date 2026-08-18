import { useEffect, useState } from "react";
import {
  UserPlus,
  Mail,
  Send,
  Check,
  Info,
  TriangleAlert,
  Loader2,
  Tag,
  Layers,
} from "lucide-react";
import LabelsService from "@/services/labels";
import { ModalShell, FieldLabel, PrimaryButton, SecondaryButton } from "@/components/ui/ModalShell";

interface InviteCollaboratorToLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelType: "artistic" | "custom";
  /** Nombre del sello artístico, o el id del personalizado. */
  labelIdentifier: string;
  labelName: string;
  songCount: number;
  onSuccess?: () => void;
}

interface InvitationResult {
  collaboratorName: string;
  collaboratorEmail: string;
  totalSongs: number;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Invitación de un colaborador a todas las canciones de un sello.
 *
 * La nota del cuerpo separa las dos cosas que se confunden: entrar al sello da
 * acceso a las canciones, pero no reparte dinero. El porcentaje se define
 * después, y decirlo aquí evita que alguien dé por hecho que ya cobra.
 */
export default function InviteCollaboratorToLabelModal({
  isOpen,
  onClose,
  labelType,
  labelIdentifier,
  labelName,
  songCount,
  onSuccess,
}: InviteCollaboratorToLabelModalProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<InvitationResult | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setEmail("");
    setError("");
    setResult(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const trimmed = email.trim();
  const isCustom = labelType === "custom";

  const handleClose = () => {
    setEmail("");
    setError("");
    setResult(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!trimmed) {
      setError("Escribe el correo del colaborador.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Ese correo no tiene un formato válido.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await LabelsService.inviteCollaboratorToLabel({
        labelType,
        labelIdentifier,
        collaboratorEmail: trimmed.toLowerCase(),
      });

      if (response.error || !response.data) {
        setError(response.message ?? "La invitación no se pudo enviar.");
        return;
      }

      setResult({
        collaboratorName: response.data.collaboratorName,
        collaboratorEmail: response.data.collaboratorEmail,
        totalSongs: response.data.totalSongs,
      });
      onSuccess?.();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const mark = (
    <span
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[14px] ${
        isCustom ? "bg-[#FF5C00]" : "bg-[#FFEADD]"
      }`}
    >
      {isCustom ? (
        <Layers className="h-[18px] w-[18px] text-white" />
      ) : (
        <Tag className="h-[18px] w-[18px] text-[#FF5C00]" />
      )}
    </span>
  );

  if (result) {
    return (
      <ModalShell
        title="Invitación enviada"
        width="lg"
        onClose={handleClose}
        footer={
          <>
            <span className="min-w-0 flex-1" />
            <PrimaryButton onClick={handleClose}>Cerrar</PrimaryButton>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 pb-1 pt-4 text-center">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#E4F5EC]">
            <Check className="h-[22px] w-[22px] text-[#2FB37E]" />
          </span>
          <h3 className="font-display text-[17px] font-semibold text-[#1C1D22]">
            {result.collaboratorName} recibirá el acceso
          </h3>
          <p className="max-w-[380px] text-[12.5px] leading-relaxed text-[#71757E]">
            Le llega un correo con el enlace para aceptar. La invitación caduca en 7 días.
          </p>
        </div>

        <dl className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-[18px] bg-[#F4F5F7]">
          <SummaryRow label="Colaborador" value={result.collaboratorName} />
          <SummaryRow label="Correo" value={result.collaboratorEmail} />
          <SummaryRow
            label="Sello"
            value={`${labelName} · ${result.totalSongs} ${
              result.totalSongs === 1 ? "canción" : "canciones"
            }`}
          />
        </dl>

        <div className="flex items-start gap-2.5 rounded-2xl bg-[#FFEADD] px-4 py-3">
          <Info className="mt-px h-4 w-4 flex-shrink-0 text-[#FF5C00]" />
          <span className="text-[11.5px] leading-relaxed text-[#1C1D22]">
            Cuando acepte, define su porcentaje desde el sello o canción por canción.
          </span>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      title="Invitar colaborador"
      subtitle={`${labelName} · ${songCount} ${songCount === 1 ? "canción" : "canciones"}`}
      width="lg"
      locked={submitting}
      onClose={handleClose}
      logo={mark}
      footer={
        <>
          <span className="min-w-0 flex-1" />
          <SecondaryButton onClick={handleClose} disabled={submitting}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={submitting}
            icon={
              submitting ? (
                <Loader2 className="h-[14px] w-[14px] animate-spin" />
              ) : (
                <Send className="h-[14px] w-[14px]" />
              )
            }
          >
            {submitting ? "Enviando…" : "Enviar invitación"}
          </PrimaryButton>
        </>
      }
    >
      <label className="flex flex-col gap-2">
        <FieldLabel required invalid={Boolean(error)}>
          CORREO DEL COLABORADOR
        </FieldLabel>
        <div className="relative">
          <Mail
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              error ? "text-[#E5484D]" : "text-[#FF5C00]"
            }`}
            size={15}
          />
          <input
            type="email"
            value={email}
            autoFocus
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit()}
            disabled={submitting}
            placeholder="colaborador@email.com"
            className={`w-full rounded-2xl border bg-white py-3 pl-11 pr-4 text-[13.5px] font-medium text-[#1C1D22] placeholder:font-normal placeholder:text-[#A6AAB2] focus:outline-none focus:ring-[3px] disabled:opacity-50 ${
              error
                ? "border-[#E5484D] focus:border-[#E5484D] focus:ring-[#E5484D]/15"
                : "border-[#E8E8EC] focus:border-[#FF5C00] focus:ring-[#FF5C00]/15"
            }`}
          />
        </div>
        <span className="text-[11px] text-[#A6AAB2]">
          Debe ser el correo de una cuenta ya registrada en Splitme.
        </span>
      </label>

      <div className="flex items-start gap-2.5 rounded-2xl bg-[#F4F5F7] px-4 py-3">
        <UserPlus className="mt-px h-4 w-4 flex-shrink-0 text-[#71757E]" />
        <span className="text-[11.5px] leading-relaxed text-[#71757E]">
          Al aceptar, entra en las {songCount} {songCount === 1 ? "canción" : "canciones"} del sello
          y puede ver sus métricas. Los splits de pago se configuran aparte, después.
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-[#F5C2C4] bg-[#FDECEC] px-4 py-3"
        >
          <TriangleAlert className="mt-px h-4 w-4 flex-shrink-0 text-[#E5484D]" />
          <span className="text-[12.5px] text-[#E5484D]">{error}</span>
        </div>
      )}
    </ModalShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <dt className="w-[92px] flex-shrink-0 text-[11.5px] text-[#A6AAB2]">{label}</dt>
      <dd className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-[#1C1D22]">
        {value}
      </dd>
    </div>
  );
}
