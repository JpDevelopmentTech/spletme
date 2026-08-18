import { Music, DollarSign, Play, CircleAlert, ArrowRight } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";

interface SongsKpisProps {
  totalSongs: number;
  totalIncome: number;
  totalStreams: number;
  withoutSplits: number;
  /** Aplica el filtro "sin split" desde el canal de alerta. */
  onShowWithoutSplits?: () => void;
}

/**
 * Consola de métricas de la biblioteca: total, ingresos, streams y canciones sin
 * split. El último canal va en naranja porque es el único dato accionable, y
 * lleva directamente al listado filtrado.
 */
export function SongsKpis({
  totalSongs,
  totalIncome,
  totalStreams,
  withoutSplits,
  onShowWithoutSplits,
}: SongsKpisProps) {
  return (
    <div className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:flex-row lg:divide-x lg:divide-y-0">
      <Channel
        label="TOTAL CANCIONES"
        icon={<Music className="h-[13px] w-[13px] text-[#71757E]" />}
        value={totalSongs.toLocaleString()}
      />
      <Channel
        label="INGRESOS TOTALES"
        icon={<DollarSign className="h-[13px] w-[13px] text-[#2FB37E]" />}
        value={formatCurrency(totalIncome)}
        valueClassName="text-[#2FB37E] text-[26px] sm:text-[30px]"
        className="lg:w-[300px] lg:flex-shrink-0"
      />
      <Channel
        label="STREAMS TOTALES"
        icon={<Play className="h-[13px] w-[13px] text-[#71757E]" />}
        value={formatStreams(totalStreams)}
      />
      <Channel
        label="SIN SPLITS"
        labelClassName="text-[#FF5C00]"
        icon={<CircleAlert className="h-[13px] w-[13px] text-[#FF5C00]" />}
        value={withoutSplits.toLocaleString()}
        valueClassName="text-[#FF5C00] text-[26px]"
        className="bg-[#FFEADD] lg:w-[250px] lg:flex-shrink-0"
      >
        {withoutSplits > 0 && onShowWithoutSplits && (
          <button
            onClick={onShowWithoutSplits}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
          >
            Ver solo estas
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </Channel>
    </div>
  );
}

interface ChannelProps {
  label: string;
  labelClassName?: string;
  icon: React.ReactNode;
  value: string;
  valueClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

/** Canal de la consola: etiqueta, cifra y, opcionalmente, una acción. */
function Channel({
  label,
  labelClassName = "text-[#71757E]",
  icon,
  value,
  valueClassName = "text-[#1C1D22] text-[26px]",
  className = "",
  children,
}: ChannelProps) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col justify-center gap-2 px-6 py-[22px] ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={`font-mono text-[9.5px] font-medium tracking-[1.3px] ${labelClassName}`}>
          {label}
        </span>
      </div>
      <p className={`font-mono font-semibold leading-none tracking-tight ${valueClassName}`}>
        {value}
      </p>
      {children}
    </div>
  );
}
