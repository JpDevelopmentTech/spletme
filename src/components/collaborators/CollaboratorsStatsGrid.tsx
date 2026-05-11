import { Users, ArrowUp, ArrowDown, Percent } from "lucide-react";

interface CollaboratorsStatsGridProps {
  totalCollaborators: number;
  totalSent: string;
  totalReceived: string;
  activeSplits: number;
  pendingPayments: number;
}

/**
 * Cuadrícula de 4 tarjetas de resumen estadístico para la página de colaboradores.
 */
export function CollaboratorsStatsGrid({
  totalCollaborators,
  totalSent,
  totalReceived,
  activeSplits,
  pendingPayments,
}: CollaboratorsStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#6B7280]">Total Colaboradores</span>
          <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-[#6B7280]" />
          </div>
        </div>
        <p className="text-[26px] font-bold text-[#111827] leading-none">{totalCollaborators}</p>
        <span className="text-[11px] font-medium text-green-500">+3 este mes</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#6B7280]">Pagos Enviados</span>
          <div className="w-7 h-7 bg-red-50 rounded-md flex items-center justify-center">
            <ArrowUp className="w-3.5 h-3.5 text-red-500" />
          </div>
        </div>
        <p className="text-[26px] font-bold text-[#111827] leading-none">{totalSent}</p>
        <span className="text-[11px] font-medium text-[#9CA3AF]">32 pagos en total</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#6B7280]">Pagos Recibidos</span>
          <div className="w-7 h-7 bg-green-50 rounded-md flex items-center justify-center">
            <ArrowDown className="w-3.5 h-3.5 text-green-500" />
          </div>
        </div>
        <p className="text-[26px] font-bold text-green-500 leading-none">{totalReceived}</p>
        <span className="text-[11px] font-medium text-[#F97316]">{pendingPayments} pagos pendientes</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#6B7280]">Splits Activos</span>
          <div className="w-7 h-7 bg-orange-50 rounded-md flex items-center justify-center">
            <Percent className="w-3.5 h-3.5 text-[#F97316]" />
          </div>
        </div>
        <p className="text-[26px] font-bold text-[#111827] leading-none">{activeSplits}</p>
        <span className="text-[11px] font-medium text-[#9CA3AF]">En {totalCollaborators} canciones</span>
      </div>
    </div>
  );
}
