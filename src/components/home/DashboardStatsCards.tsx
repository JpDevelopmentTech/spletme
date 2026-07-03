import { Play, DollarSign, Music, Scale, ArrowUp } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";

interface DashboardStatsCardsProps {
  totalStreams: number;
  totalNetIncome: number;
  songsCount: number;
  netBalance: number;
  totalAmount: number;
}

/**
 * Fila de 4 tarjetas de métricas principales del dashboard: streams, ingresos,
 * canciones y balance neto (con desglose de ingresos/egresos).
 */
export function DashboardStatsCards({
  totalStreams,
  totalNetIncome,
  songsCount,
  netBalance,
  totalAmount,
}: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Streams Totales"
        icon={<Play className="h-4 w-4 text-[#A6AAB2]" />}
        value={formatStreams(totalStreams)}
        delta="12.5%"
      />
      <StatCard
        label="Ingresos Totales"
        icon={<DollarSign className="h-4 w-4 text-[#2FB37E]" />}
        value={formatCurrency(totalNetIncome)}
        valueClassName="text-[#2FB37E]"
        delta="8.2%"
      />
      <StatCard
        label="Canciones"
        icon={<Music className="h-4 w-4 text-[#A6AAB2]" />}
        value={songsCount?.toLocaleString() ?? "0"}
        delta="15.3%"
      />
      <StatCard
        label="Balance Neto"
        icon={<Scale className="h-4 w-4 text-[#A6AAB2]" />}
        value={formatCurrency(netBalance)}
        footer={
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs font-semibold text-[#2FB37E]">+{formatCurrency(totalNetIncome)}</span>
            <span className="text-xs font-semibold text-[#EF4444]">−{formatCurrency(totalAmount)}</span>
          </div>
        }
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  valueClassName?: string;
  delta?: string;
  footer?: React.ReactNode;
}

/** Tarjeta individual de métrica con etiqueta, icono, valor y variación opcional. */
function StatCard({ label, icon, value, valueClassName = "text-[#1C1D22]", delta, footer }: StatCardProps) {
  return (
    <div className="rounded-[28px] bg-[#F4F5F7] p-[22px]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-[#71757E]">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-[16px] bg-white">{icon}</span>
      </div>
      <p className={`text-[27px] font-semibold leading-tight ${valueClassName}`}>{value}</p>
      {delta && (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#E4F5EC] px-2 py-[3px] text-[11px] font-semibold text-[#2FB37E]">
          <ArrowUp className="h-[11px] w-[11px]" />
          {delta}
        </span>
      )}
      {footer}
    </div>
  );
}
