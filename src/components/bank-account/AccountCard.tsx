import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export type MoneyDirection = "out" | "in";

interface AccountCardProps {
  direction: MoneyDirection;
  /** Texto de la banda. Cambia a condicional cuando la cuenta aún no existe. */
  label: string;
  /** Distintivo de estado, a la derecha de la banda. */
  status?: React.ReactNode;
  children: React.ReactNode;
}

/** Acentos de cada dirección: naranja lo que sale, verde lo que entra. */
const DIRECTION_STYLE: Record<
  MoneyDirection,
  { accent: string; soft: string; Icon: typeof ArrowUpRight }
> = {
  out: { accent: "#FF5C00", soft: "#FFEADD", Icon: ArrowUpRight },
  in: { accent: "#2FB37E", soft: "#E4F5EC", Icon: ArrowDownLeft },
};

/**
 * Tarjeta de una cuenta bancaria, encabezada por la dirección del dinero.
 *
 * La página tiene dos cuentas que hacen cosas opuestas —por una sale el dinero
 * hacia los colaboradores, por la otra entra el propio—, y antes se distinguían
 * solo por el color de un icono. La banda lo dice con palabras y es lo primero
 * que se lee, así que no hay que recordar qué proveedor hacía cada cosa.
 */
export function AccountCard({ direction, label, status, children }: AccountCardProps) {
  const { accent, soft, Icon } = DIRECTION_STYLE[direction];

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
      <div className="flex items-center gap-2 px-5 py-2.5" style={{ backgroundColor: soft }}>
        <Icon className="h-[13px] w-[13px] flex-shrink-0" style={{ color: accent }} />
        <span
          className="font-mono text-[9.5px] font-semibold tracking-[1.2px]"
          style={{ color: accent }}
        >
          {label}
        </span>
        {status && <div className="ml-auto flex-shrink-0">{status}</div>}
      </div>

      <div className="flex flex-1 flex-col gap-3.5 px-5 pb-[18px] pt-4">{children}</div>
    </div>
  );
}

/** Distintivo de la banda: estado de la cuenta o moneda registrada. */
export function AccountBadge({
  children,
  tone = "neutral",
  icon,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "ok" | "warn" | "error";
  icon?: React.ReactNode;
}) {
  const color = {
    neutral: "#A6AAB2",
    ok: "#2FB37E",
    warn: "#EA580C",
    error: "#E5484D",
  }[tone];

  return (
    <span
      className="flex items-center gap-1.5 rounded-[14px] bg-white px-2.5 py-1 text-[10.5px] font-semibold"
      style={{ color }}
    >
      {icon}
      {children}
    </span>
  );
}

/** Encabezado interno: icono, título y una línea de para qué sirve la cuenta. */
export function AccountHeading({
  direction,
  icon,
  title,
  description,
}: {
  direction: MoneyDirection;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const { soft } = DIRECTION_STYLE[direction];

  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[13px]"
        style={{ backgroundColor: soft }}
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <h2 className="font-display text-[15px] font-semibold text-[#1C1D22]">{title}</h2>
        <p className="text-[11.5px] leading-snug text-[#71757E]">{description}</p>
      </div>
    </div>
  );
}
