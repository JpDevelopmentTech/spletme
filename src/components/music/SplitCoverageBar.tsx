interface SplitCoverageBarProps {
  withSplit: number;
  total: number;
  /** Fondo de la pista; se aclara cuando la fila ya va sobre un tono. */
  trackClassName?: string;
  className?: string;
}

/**
 * Cuántas pistas de un álbum ya reparten.
 *
 * Es lo que dice si un álbum está terminado. Un álbum a medias no es un error,
 * pero sí trabajo pendiente, y por eso se distingue del que no reparte nada.
 */
export function SplitCoverageBar({
  withSplit,
  total,
  trackClassName = "bg-[#F4F5F7]",
  className = "",
}: SplitCoverageBarProps) {
  const complete = total > 0 && withSplit === total;
  const none = withSplit === 0;
  const percent = total > 0 ? (withSplit / total) * 100 : 0;

  const label = total === 0 ? "Sin pistas" : complete ? "Completo" : `${withSplit} de ${total} pistas`;
  const color = complete ? "#2FB37E" : none ? "#E5484D" : "#EA580C";

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[12px] font-semibold" style={{ color }}>
          {label}
        </span>
        {total > 0 && (
          <span className="flex-shrink-0 font-mono text-[10px] text-[#A6AAB2]">
            {Math.round(percent)}%
          </span>
        )}
      </div>
      <span
        className={`block h-1.5 w-full overflow-hidden rounded-full ${trackClassName}`}
        role="img"
        aria-label={
          total === 0
            ? "El álbum no tiene pistas"
            : `${withSplit} de ${total} pistas con split asignado`
        }
      >
        {withSplit > 0 && (
          <span
            className="block h-full rounded-full"
            style={{
              width: `${Math.max(3, percent)}%`,
              backgroundColor: complete ? "#2FB37E" : "#FF5C00",
            }}
          />
        )}
      </span>
    </div>
  );
}
