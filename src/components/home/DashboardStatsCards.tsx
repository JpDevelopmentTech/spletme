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
      <div className="col-span-3 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Streams Totales</span>
          <Play className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-[28px] font-bold leading-tight text-gray-900">
          {formatStreams(totalStreams)}
        </p>
        <span className="mt-1 inline-block text-xs font-medium text-green-500">&uarr; 12.5%</span>
      </div>

      <div className="col-span-3 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Ingresos Totales</span>
          <DollarSign className="h-4 w-4 text-green-500" />
        </div>
        <p className="text-[28px] font-bold leading-tight text-green-500">
          {formatCurrency(totalNetIncome)}
        </p>
        <span className="mt-1 inline-block text-xs font-medium text-green-500">&uarr; 8.2%</span>
      </div>

      <div className="col-span-3 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Canciones</span>
          <Music className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-[28px] font-bold leading-tight text-gray-900">
          {songsCount?.toLocaleString() ?? "0"}
        </p>
        <span className="mt-1 inline-block text-xs font-medium text-green-500">&uarr; 15.3%</span>
      </div>

      <div className="col-span-3 rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Balance Neto</span>
          <PiggyBank className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-[28px] font-bold leading-tight text-gray-900">
          {formatCurrency(netBalance)}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs font-medium text-green-500">
            +{formatCurrency(totalNetIncome)}
          </span>
          <span className="text-xs font-medium text-red-500">
            &ndash;{formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </>
  );
}
