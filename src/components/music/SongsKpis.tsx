import { Music, DollarSign, Play, AlertCircle } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";

interface SongsKpisProps {
  totalSongs: number;
  totalIncome: number;
  totalStreams: number;
  withoutSplits: number;
}

/**
 * Fila de 4 KPIs de la biblioteca de canciones. "Sin splits" se resalta en
 * naranja por ser el dato accionable.
 */
export function SongsKpis({ totalSongs, totalIncome, totalStreams, withoutSplits }: SongsKpisProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        icon={<Music className="h-[22px] w-[22px] text-[#71757E]" />}
        label="Total canciones"
        value={totalSongs.toLocaleString()}
      />
      <KpiCard
        icon={<DollarSign className="h-[22px] w-[22px] text-[#71757E]" />}
        label="Ingresos totales"
        value={formatCurrency(totalIncome)}
      />
      <KpiCard
        icon={<Play className="h-[22px] w-[22px] text-[#71757E]" />}
        label="Streams totales"
        value={formatStreams(totalStreams)}
      />
      <KpiCard
        icon={<AlertCircle className="h-[22px] w-[22px] text-white" />}
        label="Sin splits"
        value={withoutSplits.toLocaleString()}
        alert
      />
    </div>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  alert?: boolean;
}

/** Tarjeta KPI individual. En modo `alert` usa el acento naranja. */
function KpiCard({ icon, label, value, alert }: KpiCardProps) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-[28px] p-[18px] ${alert ? "bg-[#FFEADD]" : "bg-[#F4F5F7]"}`}
    >
      <span
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[16px] ${alert ? "bg-[#FF5C00]" : "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"}`}
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className={`text-xs ${alert ? "text-[#FF5C00]" : "text-[#71757E]"}`}>{label}</span>
        <span className={`text-[22px] font-bold ${alert ? "text-[#FF5C00]" : "text-[#1C1D22]"}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
