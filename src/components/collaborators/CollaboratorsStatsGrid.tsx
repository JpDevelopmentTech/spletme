import { Users, ArrowUp, Percent } from "lucide-react";

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
  activeSplits,
}: CollaboratorsStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#6B7280]">Total Colaboradores</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100">
            <Users className="h-3.5 w-3.5 text-[#6B7280]" />
          </div>
        </div>
        <p className="text-[26px] font-bold leading-none text-[#111827]">{totalCollaborators}</p>
        <span className="text-[11px] font-medium text-green-500">+3 este mes</span>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#6B7280]">Pagos Enviados</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50">
            <ArrowUp className="h-3.5 w-3.5 text-red-500" />
          </div>
        </div>
        <p className="text-[26px] font-bold leading-none text-[#111827]">{totalSent}</p>
        <span className="text-[11px] font-medium text-[#9CA3AF]">32 pagos en total</span>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#6B7280]">Splits Activos</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-50">
            <Percent className="h-3.5 w-3.5 text-[#F97316]" />
          </div>
        </div>
        <p className="text-[26px] font-bold leading-none text-[#111827]">{activeSplits}</p>
        <span className="text-[11px] font-medium text-[#9CA3AF]">
          En {totalCollaborators} canciones
        </span>
      </div>
    </div>
  );
}
