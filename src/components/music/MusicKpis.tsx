import { Music, Disc3, DollarSign, Play, CircleAlert, ArrowRight } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";

interface MusicKpisProps {
  totalSongs: number;
  totalAlbums: number;
  totalIncome: number;
  totalStreams: number;
  withoutSplits: number;
  /** Deja a la vista solo lo que aún no reparte. */
  onShowWithoutSplits?: () => void;
}

/**
 * Consola del catálogo. Canciones y álbumes se leen juntos porque son el mismo
 * catálogo; el último canal va en naranja porque es el único dato accionable.
 */
export function MusicKpis({
  totalSongs,
  totalAlbums,
  totalIncome,
  totalStreams,
  withoutSplits,
  onShowWithoutSplits,
}: MusicKpisProps) {
  const withSplits = Math.max(0, totalSongs - withoutSplits);

  return (
    <div className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:flex-row lg:divide-x lg:divide-y-0">
      <Channel
        label="CANCIONES"
        icon={<Music className="h-[13px] w-[13px] text-[#71757E]" />}
        value={totalSongs.toLocaleString()}
        caption={`${withSplits.toLocaleString()} con split`}
      />
      <Channel
        label="ÁLBUMES"
        icon={<Disc3 className="h-[13px] w-[13px] text-[#71757E]" />}
        value={totalAlbums.toLocaleString()}
        caption="agrupados por UPC"
      />
      <Channel
        label="INGRESOS TOTALES"
        icon={<DollarSign className="h-[13px] w-[13px] text-[#2FB37E]" />}
        value={formatCurrency(totalIncome)}
        valueClassName="text-[#2FB37E] text-[26px] sm:text-[28px]"
        className="lg:w-[320px] lg:flex-shrink-0"
        caption="neto acumulado"
      />
      <Channel
        label="STREAMS"
        icon={<Play className="h-[13px] w-[13px] text-[#71757E]" />}
        value={formatStreams(totalStreams)}
      />
      <Channel
        label="SIN SPLIT"
        labelClassName="text-[#FF5C00]"
        icon={<CircleAlert className="h-[13px] w-[13px] text-[#FF5C00]" />}
        value={withoutSplits > 0 ? withoutSplits.toLocaleString() : "Ninguna"}
        valueClassName={`text-[#FF5C00] ${withoutSplits > 0 ? "text-[26px]" : "text-[22px]"}`}
        className="bg-[#FFEADD] lg:w-[250px] lg:flex-shrink-0"
      >
        {withoutSplits > 0 ? (
          <button
            onClick={onShowWithoutSplits}
            disabled={!onShowWithoutSplits}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#EA580C] transition-colors enabled:hover:text-[#FF5C00] disabled:cursor-default"
          >
            Ver solo estas
            {onShowWithoutSplits && <ArrowRight className="h-3 w-3" />}
          </button>
        ) : (
          <span className="text-[11.5px] font-semibold text-[#EA580C]">
            Todo el catálogo reparte
          </span>
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
  caption?: string;
  children?: React.ReactNode;
}

function Channel({
  label,
  labelClassName = "text-[#71757E]",
  icon,
  value,
  valueClassName = "text-[#1C1D22] text-[26px]",
  className = "",
  caption,
  children,
}: ChannelProps) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col justify-center gap-2 px-6 py-[22px] ${className}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={`font-mono text-[9.5px] font-medium tracking-[1.3px] ${labelClassName}`}>
          {label}
        </span>
      </div>
      <p className={`font-mono font-semibold leading-none tracking-tight ${valueClassName}`}>
        {value}
      </p>
      {caption && <span className="text-[10.5px] text-[#A6AAB2]">{caption}</span>}
      {children}
    </div>
  );
}
