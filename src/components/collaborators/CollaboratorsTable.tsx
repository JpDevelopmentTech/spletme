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
    <div className="flex flex-col overflow-hidden rounded-[28px] bg-[#F4F5F7] lg:col-span-8">
      <div className="flex flex-wrap items-center gap-3 px-[22px] py-[18px]">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-semibold text-[#1C1D22]">Listado de colaboradores</span>
          <span className="flex items-center rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#71757E] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {collaborators.length}
          </span>
        </div>
        <div className="ml-auto flex h-9 w-60 items-center gap-2 rounded-full bg-white px-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <Search className="h-[15px] w-[15px] text-[#A6AAB2]" />
          <input
            type="text"
            placeholder="Buscar colaborador…"
            className="w-full bg-transparent text-[12.5px] text-[#1C1D22] placeholder-[#A6AAB2] outline-none border-none focus:ring-0" 
          />
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[12.5px] font-semibold text-[#1C1D22] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#71757E]" />
          Filtros
        </button>
      </div>

      <div className="flex flex-col gap-2 px-5 pb-5">
        <div className="hidden items-center gap-3 px-4 py-1.5 lg:flex">
          <span className="flex-1 text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
            Colaborador
          </span>
          <span className="w-[84px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
            Canciones
          </span>
          <span className="w-[84px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
            % Owner
          </span>
          <span className="w-[116px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
            Role
          </span>
          <span className="w-[116px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
            Adeudado
          </span>
          <span className="w-[100px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
            Pagado
          </span>
        </div>

        {collaborators.map((collaborator, i) => (
          <CollaboratorTableRow
            key={collaborator.id}
            collaborator={collaborator}
            isActive={collaborator.id === featuredId}
            onClick={onSelectCollaborator}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
