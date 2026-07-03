import { Crown, Music } from "lucide-react";
import { formatCompactCurrency } from "@/utils/collaborators.utils";
import type { Collaborator } from "@/types";

interface FeaturedCollaboratorCardProps {
  collaborator: Collaborator;
  onViewProfile: () => void;
  onPaySplit: () => void;
}

/**
 * Tarjeta de detalle del colaborador seleccionado.
 * Muestra avatar, stats, canciones recientes y acciones rápidas.
 */
export function FeaturedCollaboratorCard({
  collaborator,
  onViewProfile,
  onPaySplit,
}: FeaturedCollaboratorCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-4">
      <div className="relative flex h-[140px] items-start justify-center bg-[#0F172A] pt-6">
        <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[#1E293B] px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
          <span className="text-[10px] font-bold tracking-wider text-[#F97316]">
            COLABORADOR DESTACADO
          </span>
        </span>
        <div className="absolute -bottom-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-white p-1 shadow-sm">
          <div
            className="flex h-full w-full items-center justify-center rounded-full"
            style={{ backgroundColor: collaborator.avatarBg }}
          >
            <span className="text-[28px] font-bold" style={{ color: collaborator.avatarText }}>
              {collaborator.initials}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-16">
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-lg font-bold text-[#111827]">{collaborator.name}</h3>
          <p className="text-xs text-[#6B7280]">{collaborator.email}</p>
        </div>

        {collaborator.roles && collaborator.roles.length > 0 && (
          <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-orange-50 px-2.5">
            <Crown className="h-3 w-3 text-[#F97316]" />
            <span className="text-[11px] font-semibold text-orange-900">
              {collaborator.roles[0]}
            </span>
          </span>
        )}

        <div className="grid w-full grid-cols-3 border-y border-gray-100">
          <div className="flex flex-col items-center gap-1 py-3">
            <span className="text-xl font-bold text-[#111827]">{collaborator.songs}</span>
            <span className="text-[10px] text-[#6B7280]">Canciones</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-gray-100 py-3">
            <span className="text-xl font-bold text-[#F97316]">
              {`${collaborator.songPresencePercentage}%`}
            </span>
            <span className="text-[10px] text-[#6B7280]">% del Owner</span>
          </div>
          <div className="flex flex-col items-center gap-1 py-3">
            <span
              className={`text-xl font-bold ${
                collaborator.amountPending > 0 ? "text-[#F43F5E]" : "text-[#9CA3AF]"
              }`}
            >
              {formatCompactCurrency(collaborator.amountPending)}
            </span>
            <span className="text-[10px] text-[#6B7280]">Adeudado</span>
          </div>
        </div>

        {collaborator.recentSongs && collaborator.recentSongs.length > 0 && (
          <div className="flex w-full flex-col gap-2.5">
            <span className="text-[10px] font-bold tracking-wider text-[#9CA3AF]">
              CANCIONES RECIENTES
            </span>
            <div className="flex flex-col gap-2">
              {collaborator.recentSongs.map((song) => (
                <div
                  key={song.title}
                  className="flex h-12 items-center gap-3 rounded-lg bg-[#F9FAFB] px-3"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-orange-100">
                    <Music className="h-3.5 w-3.5 text-[#F97316]" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-xs font-semibold text-[#111827]">
                      {song.title}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">{song.streams}</span>
                  </div>
                  <span className="text-xs font-bold text-[#F97316]">{song.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex w-full items-center gap-2">
          <button
            onClick={onViewProfile}
            className="h-10 flex-1 rounded-lg bg-[#F97316] text-[13px] font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Ver perfil
          </button>
          <button
            onClick={onPaySplit}
            disabled={collaborator.amountPending <= 0}
            className="h-10 flex-1 rounded-lg bg-green-500 text-[13px] font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-green-500"
          >
            Pagar split
          </button>
        </div>
      </div>
    </div>
  );
}
