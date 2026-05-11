import { Play, DollarSign, Music, PiggyBank } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";

interface DashboardStatsCardsProps {
  totalStreams: number;
  totalNetIncome: number;
  songsCount: number;
  netBalance: number;
  totalAmount: number;
}

/**
 * Fila de 3 tarjetas de métricas principales del dashboard (streams, ingresos, canciones)
 * más la tarjeta de balance neto.
 */
export function DashboardStatsCards({
  totalStreams,
  totalNetIncome,
  songsCount,
  netBalance,
  totalAmount,
}: DashboardStatsCardsProps) {
  return (
    <>
      <div className="col-span-3 bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Streams Totales</span>
          <Play className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-[28px] font-bold text-gray-900 leading-tight">{formatStreams(totalStreams)}</p>
        <span className="text-xs font-medium text-green-500 mt-1 inline-block">&uarr; 12.5%</span>
      </div>

      <div className="bg-white col-span-3 rounded-xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Ingresos Totales</span>
          <DollarSign className="w-4 h-4 text-green-500" />
        </div>
        <p className="text-[28px] font-bold text-green-500 leading-tight">{formatCurrency(totalNetIncome)}</p>
        <span className="text-xs font-medium text-green-500 mt-1 inline-block">&uarr; 8.2%</span>
      </div>

      <div className="bg-white col-span-3 rounded-xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Canciones</span>
          <Music className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-[28px] font-bold text-gray-900 leading-tight">
          {songsCount?.toLocaleString() ?? "0"}
        </p>
        <span className="text-xs font-medium text-green-500 mt-1 inline-block">&uarr; 15.3%</span>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-200 col-span-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">Balance Neto</span>
          <PiggyBank className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-[28px] font-bold text-gray-900 leading-tight">{formatCurrency(netBalance)}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-medium text-green-500">+{formatCurrency(totalNetIncome)}</span>
          <span className="text-xs font-medium text-red-500">&ndash;{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </>
  );
}
