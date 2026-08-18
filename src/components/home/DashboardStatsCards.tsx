import { Play, DollarSign, Music, Scale, ArrowUp } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";

interface DashboardStatsCardsProps {
  totalStreams: number;
  totalNetIncome: number;
  songsCount: number;
  netBalance: number;
  totalAmount: number;
}

/** Alturas de las barras del medidor, en píxeles. Las últimas cuatro van apagadas. */
const INCOME_METER = [5, 7, 9, 8, 11, 10, 13, 12, 15, 14, 12, 10, 8, 6];
const STREAMS_METER = [4, 6, 7, 9, 8, 11, 10, 13, 11, 9];
const SONGS_METER = [5, 6, 8, 7, 10, 9, 12, 11, 9, 7];

/**
 * Consola de métricas del dashboard: ingresos, streams, canciones y balance neto
 * en una sola superficie separada por hairlines. Los ingresos ocupan el canal
 * ancho porque son la lectura principal del panel.
 */
export function DashboardStatsCards({
  totalStreams,
  totalNetIncome,
  songsCount,
  netBalance,
  totalAmount,
}: DashboardStatsCardsProps) {
  return (
    <div className="flex flex-col divide-y divide-[#E8E8EC] rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:flex-row lg:divide-x lg:divide-y-0">
      <Channel
        label="INGRESOS TOTALES"
        icon={<DollarSign className="h-[13px] w-[13px] text-[#2FB37E]" />}
        value={formatCurrency(totalNetIncome)}
        valueClassName="text-[#2FB37E] text-[28px] sm:text-[34px]"
        delta="8.2%"
        className="lg:w-[352px] lg:flex-shrink-0"
      >
        <Meter bars={INCOME_METER} color="#2FB37E" softColor="#E4F5EC" />
      </Channel>

      <Channel
        label="STREAMS TOTALES"
        icon={<Play className="h-[13px] w-[13px] text-[#71757E]" />}
        value={formatStreams(totalStreams)}
        delta="12.5%"
      >
        <Meter bars={STREAMS_METER} color="#1C1D22" softColor="#F4F5F7" />
      </Channel>

      <Channel
        label="CANCIONES"
        icon={<Music className="h-[13px] w-[13px] text-[#71757E]" />}
        value={songsCount?.toLocaleString() ?? "0"}
        delta="15.3%"
      >
        <Meter bars={SONGS_METER} color="#A6AAB2" softColor="#F4F5F7" />
      </Channel>

      <Channel
        label="BALANCE NETO"
        icon={<Scale className="h-[13px] w-[13px] text-[#71757E]" />}
        value={formatCurrency(netBalance)}
      >
        <div className="flex h-[14px] items-center gap-3">
          <Flow color="#2FB37E" amount={`+${formatCurrency(totalNetIncome)}`} />
          <Flow color="#E5484D" amount={`−${formatCurrency(totalAmount)}`} />
        </div>
      </Channel>
    </div>
  );
}

interface ChannelProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  valueClassName?: string;
  delta?: string;
  className?: string;
  children: React.ReactNode;
}

/** Canal de la consola: etiqueta, cifra y una lectura de apoyo (medidor o flujo). */
function Channel({
  label,
  icon,
  value,
  valueClassName = "text-[#1C1D22] text-[26px]",
  delta,
  className = "",
  children,
}: ChannelProps) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col justify-center gap-2.5 px-6 py-[22px] ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="font-mono text-[9.5px] font-medium tracking-[1.3px] text-[#71757E]">
          {label}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <p className={`font-mono font-semibold leading-none tracking-tight ${valueClassName}`}>
          {value}
        </p>
        {delta && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E4F5EC] px-2 py-[3px] font-mono text-[10.5px] font-semibold text-[#2FB37E]">
            <ArrowUp className="h-2.5 w-2.5" />
            {delta}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/** Barras tipo medidor que dan la forma de la tendencia sin ocupar una gráfica. */
function Meter({ bars, color, softColor }: { bars: number[]; color: string; softColor: string }) {
  return (
    <div className="flex h-[14px] items-end gap-[3px]" aria-hidden="true">
      {bars.map((height, i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm"
          style={{ height, backgroundColor: i < bars.length - 4 ? color : softColor }}
        />
      ))}
    </div>
  );
}

/** Entrada o salida de dinero del balance neto. */
function Flow({ color, amount }: { color: string; amount: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-mono text-[10.5px] font-medium" style={{ color }}>
        {amount}
      </span>
    </span>
  );
}
