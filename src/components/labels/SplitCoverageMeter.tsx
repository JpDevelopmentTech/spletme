import type { SplitCoverage } from "./types";

interface SplitCoverageMeterProps {
  coverage: SplitCoverage;
  /** `bar` para la fila de la tabla, `inline` para cabeceras y listas. */
  variant?: "bar" | "inline";
  className?: string;
}

/**
 * Medidor de cobertura de splits.
 *
 * Antes este dato solo aparecía como un porcentaje suelto y únicamente cuando el
 * reparto estaba a medias. Aquí acompaña siempre al sello: el vacío de la barra
 * es exactamente el trabajo que queda por hacer.
 */
export function SplitCoverageMeter({
  coverage,
  variant = "bar",
  className = "",
}: SplitCoverageMeterProps) {
  const { percentage, total, withSplits, complete } = coverage;
  const empty = total === 0;
  const color = complete ? "#2FB37E" : "#FF5C00";
  const label = empty
    ? "Sin canciones que repartir"
    : complete
      ? `Las ${total} canciones tienen split`
      : `${withSplits} de ${total} con split`;

  if (variant === "inline") {
    return (
      <span className={`flex items-center gap-2 ${className}`} title={label}>
        <span className="font-mono text-[12px] font-semibold" style={{ color }}>
          {empty ? "—" : `${percentage}%`}
        </span>
        <Track percentage={percentage} color={color} className="w-[70px]" />
      </span>
    );
  }

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-2.5">
        <span
          className="font-mono text-[12.5px] font-semibold"
          style={{ color: empty ? "#A6AAB2" : color }}
        >
          {empty ? "—" : `${percentage}%`}
        </span>
        <Track percentage={percentage} color={color} className="min-w-0 flex-1" />
      </div>
      <span className="truncate text-[10.5px] text-[#A6AAB2]">{label}</span>
    </div>
  );
}

function Track({
  percentage,
  color,
  className = "",
}: {
  percentage: number;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={`h-1.5 overflow-hidden rounded-full bg-[#F4F5F7] ${className}`}
      role="img"
      aria-label={`${percentage}% de las canciones con split`}
    >
      <span
        className="block h-full rounded-full transition-[width] duration-300"
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%`, backgroundColor: color }}
      />
    </span>
  );
}
