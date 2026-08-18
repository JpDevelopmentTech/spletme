import { Link, useNavigate } from "react-router-dom";
import { Music, Play, Eye, Tag, ChevronRight } from "lucide-react";
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
 * Tarjeta de canción para la vista de cuadrícula. Lleva los mismos datos que la
 * fila de la tabla; la portada tiñe de naranja cuando la canción no tiene split.
 */
export function SongCard({ song, onQuickView }: SongCardProps) {
  const navigate = useNavigate();
  const cover = song?.spotifyData?.album?.images?.[0]?.url;
  const split = hasAnySplit(song);
  const to = `/panel/song/${song._id}`;
  const percentage = typeof song?.percetaje === "number" ? `${song.percetaje}%` : "—";

  return (
    <div
      onClick={() => navigate(to)}
      className="flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-[#E8E8EC] bg-white transition-shadow hover:shadow-[0_10px_28px_-12px_rgba(255,92,0,0.25)]"
    >
      <div className={`relative aspect-square w-full ${split ? "bg-[#F4F5F7]" : "bg-[#FFEADD]"}`}>
        {cover ? (
          <img src={cover} alt={song.trackTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className={`h-8 w-8 ${split ? "text-[#A6AAB2]/60" : "text-[#FF5C00]/40"}`} />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-[5px]">
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
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(song);
          }}
          title="Vista rápida"
          aria-label={`Vista rápida de ${song.trackTitle}`}
          className="absolute right-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-[#71757E] transition-colors hover:text-[#1C1D22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00]"
        >
          <Eye className="h-[14px] w-[14px]" />
        </button>
      </div>

      <div className="flex flex-col gap-[11px] p-4">
        <div className="flex flex-col">
          <Link
            to={to}
            onClick={(e) => e.stopPropagation()}
            className="truncate text-[14.5px] font-semibold text-[#1C1D22] transition-colors hover:text-[#FF5C00]"
            title={song.trackTitle}
          >
            {song.trackTitle}
          </Link>
          <span className="truncate text-[11.5px] text-[#A6AAB2]">
            {song?.artistName ?? "Artista desconocido"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-[#71757E]">
            <Play className="h-3 w-3 text-[#A6AAB2]" />
            {formatStreams(song?.totalStreams ?? 0)}
          </span>
          <span className="font-mono text-[14px] font-semibold text-[#2FB37E]">
            {formatCurrency(song?.totalNetIncome ?? song?.netIncome ?? 0)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <span className="truncate font-mono text-[10.5px] text-[#A6AAB2]">
              {song?.isrc ?? "—"}
            </span>
            {song?.isrc && <CopyButton value={song.isrc} title="Copiar ISRC" />}
          </span>
          <span className="flex flex-shrink-0 items-center gap-2">
            <span
              className={`font-mono text-[11.5px] font-semibold ${typeof song?.percetaje === "number" ? "text-[#1C1D22]" : "text-[#A6AAB2]"}`}
            >
              {percentage}
            </span>
            {(song?.labelCount ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEADD] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#FF5C00]">
                <Tag className="h-2.5 w-2.5" />
                {song.labelCount}
              </span>
            )}
          </span>
        </div>

        <div className="h-px bg-[#E8E8EC]" />

        <div className="flex items-center justify-between">
          <CollaboratorAvatars collaborators={song?.collaborators} emptyLabel="Sin colaboradores" />
          <ChevronRight className="h-4 w-4 text-[#A6AAB2]" />
        </div>
      </div>
    </div>
  );
}
