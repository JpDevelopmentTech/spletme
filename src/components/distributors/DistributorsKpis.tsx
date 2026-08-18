import { Handshake, Music, DollarSign, Play, CalendarOff, ArrowRight } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";

interface DistributorsKpisProps {
  distributorsCount: number;
  songsCount: number;
  totalNetIncome: number;
  totalGrossIncome: number;
  totalStreams: number;
  /** Meses del año sin reporte en ningún distribuidor. */
  missingMonths: number;
  /** Los huecos ya enumerados: "Abr–Jun · Oct". */
  gapsLabel: string;
  year: number;
  /** Filtra la lista a los distribuidores con huecos. */
  onShowGaps?: () => void;
}

/**
 * Consola de métricas de la lista. El último canal va en naranja porque es el
 * único dato accionable: no repite un total, dice cuántos meses del año siguen
 * sin cargar y cuáles.
 */
export function DistributorsKpis({
  distributorsCount,
  songsCount,
  totalNetIncome,
  totalGrossIncome,
  totalStreams,
  missingMonths,
  gapsLabel,
  year,
  onShowGaps,
}: DistributorsKpisProps) {
  const retained = totalGrossIncome > 0 ? Math.round((totalNetIncome / totalGrossIncome) * 100) : 0;

  return (
    <div className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:flex-row lg:divide-x lg:divide-y-0">
      <Channel
        label="DISTRIBUIDORES"
        icon={<Handshake className="h-[13px] w-[13px] text-[#71757E]" />}
        value={distributorsCount.toLocaleString()}
      />
      <Channel
        label="CANCIONES"
        icon={<Music className="h-[13px] w-[13px] text-[#71757E]" />}
        value={songsCount.toLocaleString()}
      />
      <Channel
        label="INGRESOS NETOS"
        icon={<DollarSign className="h-[13px] w-[13px] text-[#2FB37E]" />}
        value={formatCurrency(totalNetIncome)}
        valueClassName="text-[#2FB37E] text-[26px] sm:text-[30px]"
        className="lg:w-[300px] lg:flex-shrink-0"
      >
        {totalGrossIncome > 0 && (
          <span className="text-[10.5px] text-[#A6AAB2]">
            bruto {formatCurrency(totalGrossIncome)} · {retained}% retenido
          </span>
        )}
      </Channel>
      <Channel
        label="STREAMS"
        icon={<Play className="h-[13px] w-[13px] text-[#71757E]" />}
        value={formatStreams(totalStreams)}
      />
      <Channel
        label={`SIN CARGAR ${year}`}
        labelClassName="text-[#FF5C00]"
        icon={<CalendarOff className="h-[13px] w-[13px] text-[#FF5C00]" />}
        value={missingMonths > 0 ? String(missingMonths) : "Al día"}
        valueClassName={`text-[#FF5C00] ${missingMonths > 0 ? "text-[26px]" : "text-[22px]"}`}
        className="bg-[#FFEADD] lg:w-[260px] lg:flex-shrink-0"
      >
        {missingMonths > 0 ? (
          <button
            onClick={onShowGaps}
            disabled={!onShowGaps}
            className="flex items-center gap-1.5 text-left text-[11.5px] font-semibold text-[#EA580C] transition-colors enabled:hover:text-[#FF5C00] disabled:cursor-default"
          >
            {gapsLabel}
            {onShowGaps && <ArrowRight className="h-3 w-3 flex-shrink-0" />}
          </button>
        ) : (
          <span className="text-[11.5px] font-semibold text-[#EA580C]">
            Todos los meses vencidos están cubiertos
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
  children?: React.ReactNode;
}

/** Canal de la consola: etiqueta, cifra y, opcionalmente, una lectura de apoyo. */
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
      {children}
    </div>
  );
}
