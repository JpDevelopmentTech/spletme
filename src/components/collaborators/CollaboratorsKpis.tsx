import { Users, GitBranch, CircleCheck, HandCoins, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/format.utils";

interface CollaboratorsKpisProps {
  totalCollaborators: number;
  people: number;
  labels: number;
  activeSplits: number;
  songsWithSplits: number;
  totalPaid: number;
  totalPending: number;
  /** Cuántas personas esperan cobro, con o sin datos de pago. */
  waitingCount: number;
  /** Filtra la lista a quienes tienen saldo pendiente. */
  onShowPending?: () => void;
}

/**
 * Consola de métricas. El último canal va en naranja porque es el único dato
 * accionable: no repite un total, dice cuánto dinero sigue sin repartir.
 */
export function CollaboratorsKpis({
  totalCollaborators,
  people,
  labels,
  activeSplits,
  songsWithSplits,
  totalPaid,
  totalPending,
  waitingCount,
  onShowPending,
}: CollaboratorsKpisProps) {
  return (
    <div className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:flex-row lg:divide-x lg:divide-y-0">
      <Channel
        label="COLABORADORES"
        icon={<Users className="h-[13px] w-[13px] text-[#71757E]" />}
        value={totalCollaborators.toLocaleString()}
        caption={`${people} ${people === 1 ? "persona" : "personas"} · ${labels} ${
          labels === 1 ? "sello" : "sellos"
        }`}
      />
      <Channel
        label="SPLITS ACTIVOS"
        icon={<GitBranch className="h-[13px] w-[13px] text-[#71757E]" />}
        value={activeSplits.toLocaleString()}
        caption={`en ${songsWithSplits} ${songsWithSplits === 1 ? "canción" : "canciones"}`}
      />
      <Channel
        label="YA PAGADO"
        icon={<CircleCheck className="h-[13px] w-[13px] text-[#2FB37E]" />}
        value={formatCurrency(totalPaid)}
        valueClassName="text-[#2FB37E] text-[26px] sm:text-[28px]"
        className="lg:w-[300px] lg:flex-shrink-0"
        caption="desde que empezaste"
      />
      <Channel
        label="POR PAGAR"
        labelClassName="text-[#FF5C00]"
        icon={<HandCoins className="h-[13px] w-[13px] text-[#FF5C00]" />}
        value={totalPending > 0 ? formatCurrency(totalPending) : "Al día"}
        valueClassName={`text-[#FF5C00] ${totalPending > 0 ? "text-[26px] sm:text-[28px]" : "text-[22px]"}`}
        className="bg-[#FFEADD] lg:w-[280px] lg:flex-shrink-0"
      >
        {totalPending > 0 ? (
          <button
            onClick={onShowPending}
            disabled={!onShowPending}
            className="flex items-center gap-1.5 text-left text-[10.5px] font-semibold text-[#EA580C] transition-colors enabled:hover:text-[#FF5C00] disabled:cursor-default"
          >
            {waitingCount} {waitingCount === 1 ? "persona esperando" : "personas esperando"}
            {onShowPending && <ArrowRight className="h-3 w-3 flex-shrink-0" />}
          </button>
        ) : (
          <span className="text-[10.5px] font-semibold text-[#EA580C]">
            No le debes nada a nadie
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

/** Canal de la consola: etiqueta, cifra y una lectura de apoyo. */
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
