import { Link } from "react-router-dom";
import { Music, Play, DollarSign, TrendingUp } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";
import type { TopSong } from "@/types";

interface TopSongsShowcaseProps {
  songs: TopSong[];
}

/** Devuelve la URL de portada de Spotify o `undefined` si no existe. */
function coverUrl(song: TopSong): string | undefined {
  return song.spotifyData?.album?.images?.[0]?.url;
}

/**
 * Canciones principales como tracklist: la #1 destacada y el resto en filas
 * numeradas con sus streams e ingresos. El orden lo marca el ingreso generado.
 */
export function TopSongsShowcase({ songs }: TopSongsShowcaseProps) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] bg-[#F4F5F7] py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
          <Music className="h-7 w-7 text-[#A6AAB2]" />
        </div>
        <h3 className="text-sm font-semibold text-[#1C1D22]">Sin canciones aún</h3>
        <p className="max-w-xs text-center text-xs text-[#A6AAB2]">
          Sube tu primera canción para comenzar a ver el rendimiento de tu música
        </p>
        <Link
          to="/panel/music/songs"
          className="flex items-center gap-2 rounded-full bg-[#FF5C00] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          <Music className="h-4 w-4" />
          Subir canción
        </Link>
      </div>
    );
  }

  const [featured, ...rest] = songs;
  const rows = rest.slice(0, 4);

  return (
    <div className="flex flex-col gap-[18px] lg:flex-row">
      <FeaturedSong song={featured} />
      {rows.length > 0 && (
        <div className="flex min-w-0 flex-1 flex-col divide-y divide-[#E8E8EC]">
          {rows.map((song, i) => (
            <SongRow key={song._id} song={song} rank={i + 2} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Tarjeta de la canción #1: portada grande, métricas y acceso a su detalle. */
function FeaturedSong({ song }: { song: TopSong }) {
  const cover = coverUrl(song);
  return (
    <Link
      to={`/panel/song/${song._id}`}
      className="group flex flex-col gap-4 rounded-[22px] bg-[#101114] p-[18px] lg:w-[300px] lg:flex-shrink-0"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#FF5C00] px-2.5 py-1 font-mono text-[10.5px] font-semibold text-white">
          #1
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-[#FF5C00]">
          <TrendingUp className="h-3 w-3" />
          Tendencia
        </span>
      </div>

      <div className="flex items-center justify-between gap-3.5">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="h-[76px] w-[76px] flex-shrink-0 overflow-hidden rounded-[20px] bg-[#FF5C00]/15">
            {cover ? (
              <img src={cover} alt={song.trackTitle} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music className="h-6 w-6 text-white/40" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="truncate font-display text-lg font-semibold text-white">
              {song.trackTitle || "Canción"}
            </h3>
            <p className="truncate text-xs text-white/60">{song.artistName ?? ""}</p>
          </div>
        </div>
        <span className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full bg-[#FF5C00] shadow-[0_6px_16px_-2px_rgba(255,92,0,0.4)] transition-transform group-hover:scale-105">
          <Play className="h-[18px] w-[18px] fill-white text-white" />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-[7px] font-mono text-[11.5px] font-medium text-white">
          <Play className="h-3 w-3 text-white/70" />
          {formatStreams(song.totalStreams ?? 0)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-[7px] font-mono text-[11.5px] font-semibold text-[#2FB37E]">
          <DollarSign className="h-3 w-3" />
          {formatCurrency(song.totalNetIncome ?? 0)}
        </span>
      </div>
    </Link>
  );
}

/** Fila de la tracklist con posición, identidad y cifras de la canción. */
function SongRow({ song, rank }: { song: TopSong; rank: number }) {
  const cover = coverUrl(song);
  return (
    <Link
      to={`/panel/song/${song._id}`}
      className="flex items-center gap-3 rounded-2xl px-1 py-[15px] transition-colors hover:bg-[#F4F5F7]"
    >
      <span className="font-mono text-[11px] font-medium text-[#A6AAB2]">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-[13px] bg-[#F4F5F7]">
        {cover ? (
          <img src={cover} alt={song.trackTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-4 w-4 text-[#A6AAB2]" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-semibold text-[#1C1D22]">
          {song.trackTitle || "Canción"}
        </span>
        <span className="truncate text-[11px] text-[#A6AAB2]">{song.artistName ?? ""}</span>
      </div>
      <span className="flex flex-shrink-0 items-center gap-1.5 font-mono text-[11px] text-[#71757E]">
        <Play className="h-2.5 w-2.5 text-[#A6AAB2]" />
        {formatStreams(song.totalStreams ?? 0)}
      </span>
      <span className="w-[76px] flex-shrink-0 text-right font-mono text-xs font-semibold text-[#2FB37E]">
        {formatCurrency(song.totalNetIncome ?? 0)}
      </span>
    </Link>
  );
}
