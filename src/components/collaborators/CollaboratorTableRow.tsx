import { formatCurrency } from "@/utils/collaborators.utils";
import type { Collaborator } from "@/types";

const TINTS = ["#FF5C00", "#2FB37E", "#A6AAB2", "#101114"];

interface CollaboratorTableRowProps {
  collaborator: Collaborator;
  isActive: boolean;
  onClick: (id: string) => void;
  index: number;
}

/**
 * Fila individual de la tabla de colaboradores con avatar, stats y montos.
 */
export function CollaboratorTableRow({
  collaborator,
  isActive,
  onClick,
  index,
}: CollaboratorTableRowProps) {
  return (
    <div
      onClick={() => onClick(collaborator.id)}
      className={
        "flex cursor-pointer items-center gap-3 rounded-[16px] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors " +
        (isActive ? "ring-[1.5px] ring-[#FF5C00]" : "hover:bg-[#FBFBFC]")
      }
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: TINTS[index % TINTS.length] }}
        >
          <span className="text-[11px] font-bold text-white">{collaborator.initials}</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] font-semibold text-[#1C1D22]">
            {collaborator.name}
          </span>
          <span className="truncate text-[11.5px] text-[#A6AAB2]">{collaborator.email}</span>
        </div>
      </div>

      <span className="hidden w-[84px] text-[13px] font-semibold text-[#1C1D22] lg:block">
        {collaborator.songs}
      </span>

      <span className="hidden w-[84px] text-[13px] font-semibold text-[#1C1D22] lg:block">
        {collaborator.songPresencePercentage}%
      </span>

      <div className="hidden w-[116px] lg:block">
        {collaborator.roles && collaborator.roles.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {collaborator.roles.map((r) => (
              <span
                key={r}
                className={
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize " +
                  (r.toLowerCase().includes("label")
                    ? "bg-[#E7E9EC] text-[#71757E]"
                    : "bg-[#FFEADD] text-[#FF5C00]")
                }
              >
                {r}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[13px] text-[#A6AAB2]">—</span>
        )}
      </div>

      <span
        className={
          "hidden w-[116px] text-[13px] font-semibold lg:block " +
          (collaborator.amountPending > 0 ? "text-[#EF4444]" : "text-[#A6AAB2]")
        }
      >
        {formatCurrency(collaborator.amountPending)}
      </span>

      <span className="hidden w-[100px] text-[13px] font-medium text-[#71757E] lg:block">
        {formatCurrency(collaborator.paid)}
      </span>
    </div>
  );
}
