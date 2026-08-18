import { CircleCheck, Wallet, Check, Minus } from "lucide-react";
import type { Collaborator } from "@/types";
import {
  STATE_META,
  initialsOf,
  resolveCollaboratorState,
  type CollaboratorState,
} from "@/utils/collaborators.utils";
import { BalanceMeter } from "./BalanceMeter";
import { COLLABORATOR_COLUMNS, COLLABORATORS_GRID } from "./collaboratorsColumns";

interface CollaboratorRowProps {
  collaborator: Collaborator;
  color: string;
  /** Total de canciones con split, para leer la presencia como fracción. */
  catalogSize: number;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: (collaborator: Collaborator) => void;
  onPay: (collaborator: Collaborator) => void;
}

const visibility = (key: string) =>
  COLLABORATOR_COLUMNS.find((c) => c.key === key)!.visibility;

const STATE_ICON: Record<CollaboratorState, React.ReactNode> = {
  can_pay: <CircleCheck className="h-3 w-3" />,
  no_payout_data: <Wallet className="h-3 w-3" />,
  settled: <Check className="h-3 w-3" />,
  no_activity: <Minus className="h-3 w-3" />,
};

/**
 * Fila de la tabla. La fila entera abre el perfil; la casilla y el botón de
 * pagar hacen otra cosa por sí mismos y detienen el clic.
 */
export function CollaboratorRow({
  collaborator,
  color,
  catalogSize,
  selected,
  onToggleSelect,
  onOpen,
  onPay,
}: CollaboratorRowProps) {
  const state = resolveCollaboratorState(collaborator);
  const meta = STATE_META[state];
  const canPay = state === "can_pay";
  const presence = collaborator.songPresencePercentage ?? 0;

  return (
    <div
      onClick={() => onOpen(collaborator)}
      className={`${COLLABORATORS_GRID} group cursor-pointer px-5 py-3 transition-colors ${
        selected ? "bg-[#FFEADD]" : "hover:bg-[#F4F5F7]"
      }`}
    >
      {/* Selección */}
      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(collaborator.id)}
          disabled={!canPay}
          aria-label={`Seleccionar a ${collaborator.name}`}
          title={canPay ? undefined : "Solo se pueden seleccionar quienes pueden cobrar"}
          className="h-[15px] w-[15px] cursor-pointer rounded-[5px] border-[1.5px] border-[#A6AAB2] text-[#FF5C00] accent-[#FF5C00] focus:ring-[3px] focus:ring-[#FF5C00]/15 disabled:cursor-not-allowed disabled:opacity-40"
        />
      </div>

      {/* Persona */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          <span className="text-[13px] font-semibold text-white">
            {collaborator.initials || initialsOf(collaborator.name)}
          </span>
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span
            className="truncate text-[13.5px] font-semibold text-[#1C1D22] transition-colors group-hover:text-[#FF5C00]"
            title={collaborator.name}
          >
            {collaborator.name}
          </span>
          <span className="truncate text-[11px] text-[#A6AAB2]" title={collaborator.email}>
            {collaborator.email}
          </span>
        </span>
      </div>

      {/* Rol */}
      <div className={`${visibility("role")} flex-wrap items-center gap-1.5`}>
        {(collaborator.roles ?? []).length > 0 ? (
          collaborator.roles!.slice(0, 2).map((role) => {
            const isLabel = role.toLowerCase().includes("label") || role.toLowerCase().includes("sello");
            return (
              <span
                key={role}
                className={`rounded-xl px-2 py-1 text-[10.5px] font-semibold ${
                  isLabel ? "bg-[#F4F5F7] text-[#71757E]" : "bg-[#FFEADD] text-[#FF5C00]"
                }`}
              >
                {isLabel ? "Sello" : "Colab."}
              </span>
            );
          })
        ) : (
          <span className="text-[12px] text-[#A6AAB2]">—</span>
        )}
      </div>

      {/* En tu catálogo */}
      <div className={`${visibility("catalog")} min-w-0 flex-col gap-1`}>
        <span className="text-[12.5px] font-semibold text-[#1C1D22]">
          {collaborator.songs} de {catalogSize || collaborator.songs}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-16 overflow-hidden rounded-full bg-[#F4F5F7]">
            <span
              className="block h-full rounded-full bg-[#A6AAB2]"
              style={{ width: `${Math.min(100, Math.max(3, presence))}%` }}
            />
          </span>
          <span className="font-mono text-[10px] text-[#A6AAB2]">{Math.round(presence)}%</span>
        </span>
      </div>

      {/* Saldo */}
      <div className={visibility("balance")}>
        <BalanceMeter
          paid={collaborator.paid}
          pending={collaborator.amountPending}
          trackClassName={selected ? "bg-white" : "bg-[#F4F5F7]"}
          className="w-full"
        />
      </div>

      {/* Estado */}
      <div className={visibility("state")}>
        <span
          className="inline-flex items-center gap-1.5 rounded-[14px] px-2.5 py-1.5"
          style={{ backgroundColor: meta.bg, color: meta.fg }}
        >
          {STATE_ICON[state]}
          <span className="text-[10.5px] font-semibold">{meta.label}</span>
        </span>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onPay(collaborator)}
          disabled={!canPay}
          title={canPay ? `Pagar a ${collaborator.name}` : meta.label}
          className={`rounded-[15px] px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
            canPay
              ? "bg-[#FFEADD] text-[#FF5C00] hover:bg-[#FFDCC7]"
              : "cursor-not-allowed bg-[#F4F5F7] text-[#A6AAB2]"
          }`}
        >
          Pagar
        </button>
      </div>
    </div>
  );
}
