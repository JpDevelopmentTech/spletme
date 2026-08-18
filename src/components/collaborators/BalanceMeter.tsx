import { formatCurrency, settledPercentage } from "@/utils/collaborators.utils";

interface BalanceMeterProps {
  paid: number;
  pending: number;
  /** Fondo de la pista; se aclara cuando la fila ya va sobre un tono. */
  trackClassName?: string;
  className?: string;
}

/**
 * Cuánto de lo que le corresponde a alguien ya está saldado.
 *
 * Es la lectura que antes obligaba a comparar dos columnas distintas: "pagado"
 * a un lado y "adeudado" al otro, sin nada que dijera si eso era mucho o poco.
 */
export function BalanceMeter({
  paid,
  pending,
  trackClassName = "bg-[#F4F5F7]",
  className = "",
}: BalanceMeterProps) {
  const hasPending = pending > 0;
  const hasActivity = paid > 0 || hasPending;
  const settled = settledPercentage(paid, pending);

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={`truncate font-mono text-[12.5px] ${
            hasPending ? "font-semibold text-[#FF5C00]" : "text-[#A6AAB2]"
          }`}
        >
          {hasPending
            ? `${formatCurrency(pending)} por pagar`
            : hasActivity
              ? "Al día"
              : "Sin movimientos"}
        </span>
        {paid > 0 && (
          <span className="flex-shrink-0 font-mono text-[10px] text-[#A6AAB2]">
            {formatCurrency(paid)} pagado
          </span>
        )}
      </div>

      <span
        className={`flex h-1.5 w-full overflow-hidden rounded-full ${trackClassName}`}
        role="img"
        aria-label={
          hasActivity
            ? `${formatCurrency(paid)} pagado y ${formatCurrency(pending)} pendiente`
            : "Sin movimientos de dinero"
        }
      >
        {paid > 0 && (
          <span className="h-full bg-[#2FB37E]" style={{ width: `${settled}%` }} />
        )}
        {hasPending && (
          <span className="h-full flex-1 bg-[#FF5C00]" />
        )}
      </span>
    </div>
  );
}
