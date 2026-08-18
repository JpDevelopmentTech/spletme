import { Check, TriangleAlert, Info } from "lucide-react";

interface AccountFeedbackProps {
  type: string;
  text: string;
}

const TONE = {
  success: {
    color: "#2FB37E",
    background: "#E4F5EC",
    border: "rgba(47,179,126,0.2)",
    Icon: Check,
  },
  error: {
    color: "#E5484D",
    background: "#FDECEC",
    border: "rgba(229,72,77,0.2)",
    Icon: TriangleAlert,
  },
  info: {
    color: "#71757E",
    background: "#F4F5F7",
    border: "#E8E8EC",
    Icon: Info,
  },
} as const;

/**
 * Resultado de vincular o guardar una cuenta, pegado a su propia tarjeta.
 *
 * Antes era una línea de once píxeles al final de la sección, del mismo tamaño
 * que el texto de ayuda: el aviso de que el banco había rechazado la cuenta
 * pesaba lo mismo que una nota al pie.
 */
export function AccountFeedback({ type, text }: AccountFeedbackProps) {
  const tone = TONE[type as keyof typeof TONE] ?? TONE.info;
  const { Icon } = tone;

  return (
    <div
      role="status"
      className="flex items-start gap-2.5 rounded-[18px] px-4 py-3"
      style={{ backgroundColor: tone.background, border: `1px solid ${tone.border}` }}
    >
      <Icon className="mt-px h-4 w-4 flex-shrink-0" style={{ color: tone.color }} />
      <span className="text-[11.5px] leading-relaxed text-[#1C1D22]">{text}</span>
    </div>
  );
}
