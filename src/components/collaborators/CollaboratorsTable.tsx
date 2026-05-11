import { Search, SlidersHorizontal } from "lucide-react";
import { CollaboratorTableRow } from "./CollaboratorTableRow";
import type { Collaborator } from "@/types";

interface CollaboratorsTableProps {
  collaborators: Collaborator[];
  featuredId: string;
  onSelectCollaborator: (id: string) => void;
}

/**
 * Tabla de colaboradores con barra de búsqueda, filtros y filas interactivas.
 */
export function CollaboratorsTable({ collaborators, featuredId, onSelectCollaborator }: CollaboratorsTableProps) {
  return (
    <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-[#111827]">Listado de Colaboradores</span>
          <span className="px-2.5 py-0.5 bg-gray-100 text-[#6B7280] text-[11px] font-bold rounded-full">
            {collaborators.length}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              className="w-full pl-9 pr-3 h-9 border border-gray-200 rounded-lg text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 h-9 border border-gray-200 rounded-lg text-[12px] font-medium text-[#6B7280] hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtros
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-[#FAFAFA] border-b border-gray-100">
            <th className="text-left px-6 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Colaborador</th>
            <th className="text-left px-3 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[110px]">Canciones</th>
            <th className="text-left px-3 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[90px]">Split %</th>
            <th className="text-left px-3 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[120px]">Pagado</th>
            <th className="text-left px-3 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[110px]">Estado</th>
            <th className="w-[60px]" />
          </tr>
        </thead>
        <tbody>
          {collaborators.map((collaborator) => (
            <CollaboratorTableRow
              key={collaborator.id}
              collaborator={collaborator}
              isActive={collaborator.id === featuredId}
              onClick={onSelectCollaborator}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
