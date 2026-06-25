import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";
import type { TopSong } from "@/types";

interface TopSongsTableProps {
  songs: TopSong[];
}

/**
 * Tabla de canciones principales ordenadas por streams.
 * Cada fila enlaza a la página de detalle de la canción.
 */
export function TopSongsTable({ songs }: TopSongsTableProps) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Music className="h-7 w-7 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">
          Sin canciones aún
        </h3>
        <p className="max-w-xs text-center text-xs text-gray-400">
          Sube tu primera canción para comenzar a ver el rendimiento de tu
          música
        </p>
        <Link
          to="/panel/music"
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
        >
          <Music className="h-4 w-4" />
          Subir canción
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b border-gray-100 py-2.5">
        <div className="flex-1">
          <span className="text-[11px] font-semibold uppercase text-gray-400">
            Canción
          </span>
        </div>
        <div className="w-[100px]">
          <span className="text-[11px] font-semibold uppercase text-gray-400">
            Streams
          </span>
        </div>
        <div className="w-[100px]">
          <span className="text-[11px] font-semibold uppercase text-gray-400">
            Ingresos
          </span>
        </div>
        <div className="w-[80px]">
          <span className="text-[11px] font-semibold uppercase text-gray-400">
            Estado
          </span>
        </div>
      </div>

      {songs.map((song, index) => (
        <Link
          key={song._id}
          to={`/panel/song/${song._id}`}
          className="group -mx-1 flex items-center gap-3 rounded-lg border-b border-gray-100 px-1 py-3 transition-colors last:border-b-0 hover:bg-gray-50"
        >
          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {song.spotifyData?.album?.images?.[0]?.url ? (
              <img
                src={song.spotifyData.album.images[0].url}
                alt={song.trackTitle}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-[13px] font-semibold text-gray-900 transition-colors group-hover:text-[#F97316]">
              {song.trackTitle || `Canción ${index + 1}`}
            </span>
            <span className="truncate text-[11px] text-gray-400">
              {song.artistName ?? ""}
            </span>
          </div>

          <div className="w-[100px]">
            <span className="text-[13px] font-medium text-gray-900">
              {formatStreams(song.totalStreams ?? 0)}
            </span>
          </div>
          <div className="w-[100px]">
            <span className="text-[13px] font-medium text-green-500">
              {formatCurrency(song.totalNetIncome ?? 0)}
            </span>
          </div>
          <div className="w-[80px]">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                index === 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {index === 0 ? "Tendencia" : "Estable"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
