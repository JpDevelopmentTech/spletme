import { Music, User, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/collaborators.utils";
import type { Collaborator, CollaboratorStatus } from "@/types";

interface FeaturedCollaboratorCardProps {
  collaborator: Collaborator;
  onViewProfile: () => void;
  onPaySplit: () => void;
}

interface StatusBadge {
  label: string;
  className: string;
}

const SONG_TINTS = ["#FF5C00", "#2FB37E", "#A6AAB2", "#101114"];

const STATUS_BADGES: Record<CollaboratorStatus, StatusBadge> = {
  active: { label: "Activo", className: "bg-[#E4F5EC] text-[#2FB37E]" },
  pending: { label: "Pendiente", className: "bg-[#FFEADD] text-[#FF5C00]" },
  no_wallet: { label: "Sin wallet", className: "bg-[#E7E9EC] text-[#71757E]" },
};

/**
 * Tarjeta de detalle del colaborador seleccionado.
 * Muestra avatar, stats, canciones recientes y acciones rápidas.
 */
export function FeaturedCollaboratorCard({
  collaborator,
  onViewProfile,
  onPaySplit,
}: FeaturedCollaboratorCardProps) {
  const statusBadge = STATUS_BADGES[collaborator.status];

  return (
    <div className="flex flex-col gap-[18px] rounded-[28px] bg-[#F4F5F7] p-6 lg:col-span-4">
      <div className="flex items-center gap-3.5">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#FF5C00]">
          <span className="text-lg font-bold text-white">{collaborator.initials}</span>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="truncate text-[17px] font-semibold text-[#1C1D22]">{collaborator.name}</h3>
          <p className="truncate text-[12.5px] text-[#A6AAB2]">{collaborator.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {collaborator.roles?.map((role) => (
          <span
            key={role}
            className="rounded-full bg-[#FFEADD] px-3 py-1 text-[11.5px] font-semibold capitalize text-[#FF5C00]"
          >
            {role}
          </span>
        ))}
        <span
          className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${statusBadge.className}`}
        >
          {statusBadge.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-0.5 rounded-[16px] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <span className="text-[10.5px] text-[#A6AAB2]">Canciones</span>
          <span className="text-[17px] font-bold text-[#1C1D22]">{collaborator.songs}</span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-[16px] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <span className="text-[10.5px] text-[#A6AAB2]">% Owner</span>
          <span className="text-[17px] font-bold text-[#FF5C00]">
            {collaborator.songPresencePercentage}%
          </span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-[16px] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <span className="text-[10.5px] text-[#A6AAB2]">Adeudado</span>
          <span className="text-[17px] font-bold text-[#1C1D22]">
            {formatCurrency(collaborator.amountPending)}
          </span>
        </div>
      </div>

      {collaborator.recentSongs && collaborator.recentSongs.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
            TOP CANCIONES
          </span>
          <div className="flex flex-col gap-2">
            {collaborator.recentSongs.map((song, i) => (
              <div
                key={song.title}
                className="flex items-center gap-2.5 rounded-[16px] bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: SONG_TINTS[i % SONG_TINTS.length] }}
                >
                  <Music className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                    {song.title}
                  </span>
                  <span className="text-[10.5px] text-[#A6AAB2]">{song.streams}</span>
                </div>
                <span className="ml-auto text-[12.5px] font-bold text-[#FF5C00]">
                  {song.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2.5">
        <button
          onClick={onViewProfile}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[16px] bg-white py-3 text-[13px] font-semibold text-[#1C1D22] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FBFBFC]"
        >
          <User className="h-[15px] w-[15px] text-[#71757E]" />
          Ver perfil
        </button>
        <button
          onClick={onPaySplit}
          disabled={collaborator.amountPending <= 0}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[16px] bg-[#2FB37E] py-3 text-[13px] font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
        >
          <DollarSign className="h-[15px] w-[15px]" />
          Pagar
        </button>
      </div>
    </div>
  );
}
