import { ArrowUpDown, CircleX } from "lucide-react";
import { FilterFacet } from "@/components/ui/FilterFacet";
import { SORT_LABELS, type CollaboratorSortBy } from "./collaboratorsColumns";
import type { StateFilter } from "@/hooks/useCollaboratorsLibrary";
import { describeRole } from "@/utils/collaborators.utils";

interface CollaboratorsFilterBarProps {
  stateFilter: StateFilter;
  onStateFilterChange: (value: StateFilter) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  roles: string[];
  sortBy: CollaboratorSortBy;
  onSortChange: (value: CollaboratorSortBy) => void;
  hasFilters: boolean;
  onClearAll: () => void;
}

const STATE_LABELS: Record<StateFilter, string> = {
  all: "Todos",
  can_pay: "Pueden cobrar",
  no_payout_data: "Sin datos de cobro",
  settled: "Al día",
};

export function CollaboratorsFilterBar({
  stateFilter,
  onStateFilterChange,
  roleFilter,
  onRoleFilterChange,
  roles,
  sortBy,
  onSortChange,
  hasFilters,
  onClearAll,
}: CollaboratorsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <FilterFacet
        label="Estado"
        value={STATE_LABELS[stateFilter]}
        highlighted={stateFilter !== "all"}
      >
        <select
          aria-label="Filtrar por estado de cobro"
          value={stateFilter}
          onChange={(e) => onStateFilterChange(e.target.value as StateFilter)}
        >
          {Object.entries(STATE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FilterFacet>

      {roles.length > 0 && (
        <FilterFacet
          label="Rol"
          value={roleFilter === "all" ? "Todos" : describeRole(roleFilter).long}
          highlighted={roleFilter !== "all"}
        >
          <select
            aria-label="Filtrar por rol"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
          >
            <option value="all">Todos</option>
            {/* El valor sigue siendo el rol crudo del backend; lo que cambia es
                cómo se lee. */}
            {roles.map((role) => (
              <option key={role} value={role}>
                {describeRole(role).long}
              </option>
            ))}
          </select>
        </FilterFacet>
      )}

      {hasFilters && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[11.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
        >
          <CircleX className="h-3.5 w-3.5" />
          Limpiar filtros
        </button>
      )}

      <div className="ml-auto">
        <FilterFacet value={SORT_LABELS[sortBy]} icon={<ArrowUpDown className="h-3.5 w-3.5" />}>
          <select
            aria-label="Ordenar colaboradores"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as CollaboratorSortBy)}
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FilterFacet>
      </div>
    </div>
  );
}
