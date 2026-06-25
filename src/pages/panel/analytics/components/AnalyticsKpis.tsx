import { TrendingUp, DollarSign, TrendingDown, Clock } from "lucide-react";
import type { AnalyticsKpis, HistoricalTotal } from "../../../../types/analytics.types";

interface Props {
  kpis: AnalyticsKpis | null;
  historical: HistoricalTotal | null;
  loading: boolean;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtStreams(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function AnalyticsKpisSection({ kpis, historical, loading }: Props) {
  const cards = [
    {
      label: "Total Streams",
      value: loading ? "—" : fmtStreams(kpis?.totalStreams ?? 0),
      sub: "Reproducciones filtradas",
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-[#111827]",
    },
    {
      label: "Total Ingresos",
      value: loading ? "—" : fmt(kpis?.totalIncome ?? 0),
      sub: "Ingresos netos filtrados",
      icon: DollarSign,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      valueColor: "text-green-500",
    },
    {
      label: "Total Egresos",
      value: loading ? "—" : fmt(kpis?.totalExpenses ?? 0),
      sub: "Costos y retenciones",
      icon: TrendingDown,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      valueColor: "text-red-500",
    },
    {
      label: "Histórico Total",
      value: loading ? "—" : fmt(historical?.totalNetIncome ?? 0),
      sub: historical?.firstDate ? `Desde ${historical.firstDate.slice(0, 7)}` : "Todo el tiempo",
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-[#F97316]",
      valueColor: "text-[#F97316]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, sub, icon: Icon, iconBg, iconColor, valueColor }) => (
        <div
          key={label}
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">{label}</span>
            <div className={`h-7 w-7 ${iconBg} flex items-center justify-center rounded-md`}>
              <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
            </div>
          </div>
          <p className={`text-[26px] font-bold leading-none ${valueColor}`}>{value}</p>
          <span className="text-[11px] font-medium text-[#9CA3AF]">{sub}</span>
        </div>
      ))}
    </div>
  );
}
