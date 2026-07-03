import { Link } from "react-router-dom";
import { Music, Play, MoreHorizontal, Tag, ArrowRight } from "lucide-react";
import { hasAnySplit } from "@/utils/music.utils";
import { formatStreams, formatCurrency } from "@/utils/format.utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { CollaboratorAvatars } from "./CollaboratorAvatars";
import type { SongItem } from "@/types/music.types";

interface SongCardProps {
  song: SongItem;
  onQuickView: (song: SongItem) => void;
}

/**
 * Tarjeta de canción para la vista de galería (grid): portada con estado de
 * split, y todos los datos (streams, ingresos, ISRC, %, sello, colaboradores).
 */
export function SongCard({ song, onQuickView }: SongCardProps) {
  const cover = song?.spotifyData?.album?.images?.[0]?.url;
  const split = hasAnySplit(song);
  const to = `/panel/song/${song._id}`;
  const percentage = typeof song?.percetaje === "number" ? `${song.percetaje}%` : "Sin %";

  return (
    <div className="flex flex-col overflow-hidden rounded-[28px] bg-[#F4F5F7]">
      <div className="relative h-[168px] w-full bg-[#FF5C00]/15">
        <Link to={to} className="block h-full w-full">
          {cover ? (
            <img src={cover} alt={song.trackTitle} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Music className="h-8 w-8 text-[#FF5C00]/50" />
            </div>
          )}
        </Link>
        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-[5px] shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: split ? "#2FB37E" : "#FF5C00" }}
          />
          <span
            className="text-[10.5px] font-semibold"
            style={{ color: split ? "#2FB37E" : "#FF5C00" }}
          >
            {split ? "Con split" : "Sin split"}
          </span>
        </span>
        <button
          onClick={() => onQuickView(song)}
          title="Vista rápida"
          className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#F4F5F7]"
        >
          <MoreHorizontal className="h-4 w-4 text-[#71757E]" />
        </button>
      </div>

      <div className="flex flex-col gap-[11px] p-4">
        <div className="flex flex-col">
          <Link
            to={to}
            className="truncate text-[15px] font-semibold text-[#1C1D22] transition-colors hover:text-[#FF5C00]"
            title={song.trackTitle}
          >
            {song.trackTitle}
          </Link>
          <span className="truncate text-[11.5px] text-[#A6AAB2]">
            {song?.artistName ?? "Artista desconocido"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#71757E]">
            <Play className="h-3 w-3 text-[#A6AAB2]" />
            {formatStreams(song?.totalStreams ?? 0)}
          </span>
          <span className="text-[15px] font-bold text-[#2FB37E]">
            {formatCurrency(song?.totalNetIncome ?? song?.netIncome ?? 0)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate font-mono text-[11px] text-[#A6AAB2]">
              {song?.isrc ?? "—"}
            </span>
            {song?.isrc && <CopyButton value={song.isrc} title="Copiar ISRC" />}
          </span>
          <span className="flex flex-shrink-0 items-center gap-2">
            <span
              className={`text-xs font-semibold ${typeof song?.percetaje === "number" ? "text-[#1C1D22]" : "text-[#A6AAB2]"}`}
            >
              {percentage}
            </span>
            {(song?.labelCount ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEADD] px-2 py-0.5 text-[10px] font-bold text-[#FF5C00]">
                <Tag className="h-2.5 w-2.5" />
                {song.labelCount}
              </span>
            )}
          </span>
        </div>

        <div className="h-px bg-[#1C1D22]/10" />

        <div className="flex items-center justify-between">
          <CollaboratorAvatars collaborators={song?.collaborators} emptyLabel="Sin colaboradores" />
          <Link
            to={to}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5C00] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            Ver detalle
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
