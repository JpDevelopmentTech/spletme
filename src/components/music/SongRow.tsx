import { Link } from "react-router-dom";
import { Music, Play, Tag, ArrowRight, Eye } from "lucide-react";
import { hasAnySplit } from "@/utils/music.utils";
import { formatStreams, formatCurrency } from "@/utils/format.utils";
import { CopyButton } from "@/components/ui/CopyButton";
import { CollaboratorAvatars } from "./CollaboratorAvatars";
import type { SongItem } from "@/types/music.types";

interface SongRowProps {
  song: SongItem;
  onQuickView: (song: SongItem) => void;
}

/**
 * Fila de canción para la vista de lista (densidad): portada, datos en columnas
 * y acciones. El ISRC se muestra como metadato secundario bajo el artista.
 */
export function SongRow({ song, onQuickView }: SongRowProps) {
  const cover = song?.spotifyData?.album?.images?.[0]?.url;
  const split = hasAnySplit(song);
  const to = `/panel/song/${song._id}`;

  return (
    <div className="flex items-center gap-3.5 rounded-[16px] bg-white px-[18px] py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* Canción */}
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <Link to={to} className="h-11 w-11 flex-shrink-0">
          {cover ? (
            <img src={cover} alt={song.trackTitle} className="h-11 w-11 rounded-[12px] object-cover" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#FFEADD]">
              <Music className="h-4 w-4 text-[#FF5C00]" />
            </div>
          )}
        </Link>
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            to={to}
            className="truncate text-[13.5px] font-semibold text-[#1C1D22] transition-colors hover:text-[#FF5C00]"
            title={song.trackTitle}
          >
            {song.trackTitle}
          </Link>
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[11.5px] text-[#A6AAB2]">
              {song?.artistName ?? "—"}
            </span>
            {song?.isrc && (
              <>
                <span className="text-[11px] text-[#A6AAB2]">·</span>
                <span className="truncate font-mono text-[11px] text-[#A6AAB2]">{song.isrc}</span>
                <CopyButton value={song.isrc} title="Copiar ISRC" />
              </>
            )}
          </span>
        </div>
      </div>

      {/* Estado */}
      <div className="hidden w-[112px] lg:flex">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{ backgroundColor: split ? "#E4F5EC" : "#FFEADD" }}
        >
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
      </div>

      {/* Streams */}
      <div className="hidden w-[104px] items-center gap-1.5 md:flex">
        <Play className="h-3 w-3 text-[#A6AAB2]" />
        <span className="text-[12.5px] font-medium text-[#71757E]">
          {formatStreams(song?.totalStreams ?? 0)}
        </span>
      </div>

      {/* Ingresos */}
      <div className="w-[120px]">
        <span className="text-[13.5px] font-bold text-[#2FB37E]">
          {formatCurrency(song?.totalNetIncome ?? song?.netIncome ?? 0)}
        </span>
      </div>

      {/* Colaboradores */}
      <div className="hidden w-[124px] lg:flex">
        <CollaboratorAvatars collaborators={song?.collaborators} />
      </div>

      {/* % · Sello */}
      <div className="hidden w-[120px] items-center gap-2 lg:flex">
        <span
          className={`text-[12.5px] font-semibold ${typeof song?.percetaje === "number" ? "text-[#1C1D22]" : "text-[#A6AAB2]"}`}
        >
          {typeof song?.percetaje === "number" ? `${song.percetaje}%` : "—"}
        </span>
        {(song?.labelCount ?? 0) > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEADD] px-2 py-0.5 text-[10px] font-bold text-[#FF5C00]">
            <Tag className="h-2.5 w-2.5" />
            {song.labelCount}
          </span>
        )}
      </div>

      {/* Acciones */}
      <div className="flex w-[132px] items-center justify-end gap-2">
        <button
          onClick={() => onQuickView(song)}
          title="Vista rápida"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F5F7] text-[#71757E] transition-colors hover:text-[#1C1D22]"
        >
          <Eye className="h-4 w-4" />
        </button>
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5C00] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          Ver detalle
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
