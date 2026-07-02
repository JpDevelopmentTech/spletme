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
export function CollaboratorsTable({
  collaborators,
  featuredId,
  onSelectCollaborator,
}: CollaboratorsTableProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-8">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-[#111827]">Listado de Colaboradores</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-[#6B7280]">
            {collaborators.length}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              className="h-9 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-[13px] text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#F97316] focus:outline-none"
            />
          </div>
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-[12px] font-medium text-[#6B7280] transition-colors hover:bg-gray-50">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-[#FAFAFA]">
            <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              Colaborador
            </th>
            <th className="w-[140px] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              User ID
            </th>
            <th className="w-[110px] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              Canciones
            </th>
            <th className="w-[90px] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              Split %
            </th>
            <th className="w-[90px] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              Role
            </th>
            <th className="w-[120px] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              Adeudado
            </th>
            <th className="w-[120px] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              Pagado
            </th>
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
