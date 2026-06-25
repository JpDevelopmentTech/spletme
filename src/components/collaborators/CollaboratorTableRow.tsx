import { formatCurrency } from "@/utils/collaborators.utils";
import type { Collaborator } from "@/types";

interface CollaboratorTableRowProps {
  collaborator: Collaborator;
  isActive: boolean;
  onClick: (id: string) => void;
}

/**
 * Fila individual de la tabla de colaboradores con avatar, stats y montos.
 */
export function CollaboratorTableRow({
  collaborator,
  isActive,
  onClick,
}: CollaboratorTableRowProps) {
  return (
    <tr
      onClick={() => onClick(collaborator.id)}
      className={`cursor-pointer border-b border-gray-100 transition-colors last:border-b-0 ${
        isActive ? "bg-orange-50/40" : "hover:bg-gray-50"
      }`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: collaborator.avatarBg }}
          >
            <span
              className="text-[12px] font-bold"
              style={{ color: collaborator.avatarText }}
            >
              {collaborator.initials}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-[13px] font-semibold text-[#111827]">
              {collaborator.name}
            </span>
            <span className="truncate text-[11px] text-[#9CA3AF]">
              {collaborator.email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-center text-[13px] font-semibold text-[#111827]">
        {collaborator.songs}
      </td>
      <td className="px-3 py-4 text-center text-[13px] font-semibold text-[#F97316]">
        {collaborator.splitPercentage != null
          ? `${collaborator.splitPercentage}%`
          : "—"}
      </td>
      <td className="px-3 py-4 text-center">
        {collaborator.roles && collaborator.roles.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-1">
            {collaborator.roles.map((r) => (
              <span
                key={r}
                className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold capitalize text-[#F97316]"
              >
                {r}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[13px] text-[#9CA3AF]">—</span>
        )}
      </td>
      <td
        className={`px-3 py-4 text-center text-[13px] font-semibold ${
          collaborator.amountPending > 0 ? "text-[#F43F5E]" : "text-[#9CA3AF]"
        }`}
      >
        {formatCurrency(collaborator.amountPending)}
      </td>
      <td className="px-3 py-4 text-center text-[13px] font-semibold text-green-500">
        {formatCurrency(collaborator.paid)}
      </td>
    </tr>
  );
}
