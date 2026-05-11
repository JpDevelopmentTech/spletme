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
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
          <Music className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">Sin canciones aún</h3>
        <p className="text-xs text-gray-400 text-center max-w-xs">
          Sube tu primera canción para comenzar a ver el rendimiento de tu música
        </p>
        <Link
          to="/panel/music"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Music className="w-4 h-4" />
          Subir canción
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center py-2.5 border-b border-gray-100">
        <div className="flex-1">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Canción</span>
        </div>
        <div className="w-[100px]">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Streams</span>
        </div>
        <div className="w-[100px]">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Ingresos</span>
        </div>
        <div className="w-[80px]">
          <span className="text-[11px] font-semibold text-gray-400 uppercase">Estado</span>
        </div>
      </div>

      {songs.map((song, index) => (
        <Link
          key={song._id}
          to={`/panel/song/${song._id}`}
          className="flex items-center py-3 border-b border-gray-100 last:border-b-0 gap-3 hover:bg-gray-50 rounded-lg px-1 -mx-1 transition-colors group"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            {song.spotifyData?.album?.images?.[0]?.url ? (
              <img
                src={song.spotifyData.album.images[0].url}
                alt={song.trackTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <span className="text-[13px] font-semibold text-gray-900 truncate group-hover:text-[#F97316] transition-colors">
              {song.trackTitle || `Canción ${index + 1}`}
            </span>
            <span className="text-[11px] text-gray-400 truncate">{song.artistName ?? ""}</span>
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
              className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                index === 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
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
