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
 * Sección de canciones principales: tarjeta destacada para el #1 y una fila
 * de tarjetas compactas para el resto. Cada elemento enlaza a su detalle.
 */
export function TopSongsShowcase({ songs }: TopSongsShowcaseProps) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F5F7]">
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
  const cards = rest.slice(0, 4);

  return (
    <div className="flex flex-col gap-3.5">
      <FeaturedSong song={featured} />
      {cards.length > 0 && (
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {cards.map((song, i) => (
            <CompactSong key={song._id} song={song} rank={i + 2} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Tarjeta destacada del #1 con portada grande, stats y botón de reproducción. */
function FeaturedSong({ song }: { song: TopSong }) {
  const cover = coverUrl(song);
  return (
    <Link
      to={`/panel/song/${song._id}`}
      className="group flex items-center gap-[18px] rounded-[28px] bg-[#101114] p-4"
    >
      <div className="h-[124px] w-[124px] flex-shrink-0 overflow-hidden rounded-[22px] bg-[#FF5C00]/15">
        {cover ? (
          <img src={cover} alt={song.trackTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-8 w-8 text-white/40" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#FF5C00] px-2.5 py-1 text-[11px] font-bold text-white">#1</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-[#FF5C00]">
            <TrendingUp className="h-3 w-3" />
            Tendencia
          </span>
        </div>
        <h3 className="truncate text-xl font-semibold text-white">
          {song.trackTitle || "Canción"}
        </h3>
        <p className="truncate text-[13px] text-white/60">{song.artistName ?? ""}</p>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-[7px] text-xs font-medium text-white">
            <Play className="h-3 w-3 text-white/70" />
            {formatStreams(song.totalStreams ?? 0)} streams
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-[7px] text-xs font-medium text-[#2FB37E]">
            <DollarSign className="h-3 w-3 text-white/70" />
            {formatCurrency(song.totalNetIncome ?? 0)}
          </span>
        </div>
      </div>

      <div className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-full bg-[#FF5C00] shadow-[0_6px_16px_-2px_rgba(255,92,0,0.4)] transition-transform group-hover:scale-105">
        <Play className="h-[22px] w-[22px] fill-white text-white" />
      </div>
    </Link>
  );
}

/** Tarjeta compacta de canción con portada, ranking y stats. */
function CompactSong({ song, rank }: { song: TopSong; rank: number }) {
  const cover = coverUrl(song);
  return (
    <Link
      to={`/panel/song/${song._id}`}
      className="flex flex-col gap-2.5 rounded-[22px] border border-white/60 bg-white/70 p-3 shadow-[0_4px_14px_-6px_rgba(255,92,0,0.12)] backdrop-blur-md transition-transform hover:-translate-y-0.5"
    >
      <div className="relative h-[104px] w-full overflow-hidden rounded-[16px] bg-[#FF5C00]/15">
        {cover ? (
          <img src={cover} alt={song.trackTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-6 w-6 text-[#A6AAB2]" />
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-[#101114]/80 px-2 py-[3px] text-[10.5px] font-bold text-white">
          #{rank}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="truncate text-[13px] font-semibold text-[#1C1D22]">
          {song.trackTitle || "Canción"}
        </span>
        <span className="truncate text-[10.5px] text-[#A6AAB2]">{song.artistName ?? ""}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11.5px] font-medium text-[#71757E]">
          <Play className="h-[11px] w-[11px] text-[#A6AAB2]" />
          {formatStreams(song.totalStreams ?? 0)}
        </span>
        <span className="text-[11.5px] font-semibold text-[#2FB37E]">
          {formatCurrency(song.totalNetIncome ?? 0)}
        </span>
      </div>
    </Link>
  );
}
