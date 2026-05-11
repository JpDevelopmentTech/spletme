import { Link } from "react-router-dom";
import { Music as MusicIcon, Disc, Crown } from "lucide-react";
import { hasAnySplit } from "@/utils/music.utils";
import { formatCurrency } from "@/utils/format.utils";
import type { MusicMode, SongItem, AlbumItem } from "@/types/music.types";

interface MusicMobileListProps {
  mode: MusicMode;
  songs: SongItem[];
  albums: AlbumItem[];
  groupedAlbums: [number, AlbumItem[]][];
  groupAlbumsByTrackCount: boolean;
  onOwnerSplitModal: (album: AlbumItem) => void;
}

/**
 * Vista en tarjetas para pantallas móviles — songs y albums.
 */
export function MusicMobileList({
  mode, songs, albums, groupedAlbums, groupAlbumsByTrackCount, onOwnerSplitModal,
}: MusicMobileListProps) {
  return (
    <div className="block lg:hidden divide-y divide-gray-100">
      {mode === "songs"
        ? songs.map((song) => (
            <Link
              key={song._id}
              to={`/panel/song/${song._id}`}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10">
                {song?.spotifyData?.album?.images?.[0]?.url ? (
                  <img src={song.spotifyData.album.images[0].url} alt={song.trackTitle} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <MusicIcon size={18} className="text-orange-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{song.trackTitle}</p>
                <p className="text-xs text-gray-500 truncate">{song?.artistName ?? "Unknown Artist"}</p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  ISRC: {song?.isrc ?? "N/A"} · {Number(song?.totalStreams ?? 0).toLocaleString()} streams · {formatCurrency(song?.totalNetIncome ?? 0)}
                </p>
              </div>
              <span className={`inline-flex px-2 py-1 text-[11px] font-semibold rounded-full ${hasAnySplit(song) ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {hasAnySplit(song) ? "Yes" : "No"}
              </span>
            </Link>
          ))
        : groupAlbumsByTrackCount
          ? groupedAlbums.flatMap(([trackCount, albumsInGroup]) => [
              <div key={`group-mobile-${trackCount}`} className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600">
                {trackCount} canciones
              </div>,
              ...albumsInGroup.map((album) => (
                <AlbumMobileRow key={`${album.upc}-${trackCount}`} album={album} onOwnerSplitModal={onOwnerSplitModal} />
              )),
            ])
          : albums.map((album) => (
              <AlbumMobileRow key={album.upc} album={album} onOwnerSplitModal={onOwnerSplitModal} />
            ))}
    </div>
  );
}

function AlbumMobileRow({ album, onOwnerSplitModal }: { album: AlbumItem; onOwnerSplitModal: (a: AlbumItem) => void }) {
  const coverUrl =
    album?.coverImage?.[0]?.[0]?.url ??
    album?.tracks?.[0]?.spotifyData?.album?.images?.[0]?.url;

  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 w-10 h-10">
        {coverUrl ? (
          <img src={coverUrl} alt={album.albumTitle} className="w-10 h-10 rounded-lg object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Disc size={18} className="text-purple-500" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link to={`/panel/album/upc/${album.upc}`} className="text-sm font-semibold text-gray-900 truncate block">
          {album.albumTitle}
        </Link>
        <p className="text-xs text-gray-400">{album.artistName ?? "Unknown Artist"}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onOwnerSplitModal(album); }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
      >
        <Crown size={12} />
        Splits
      </button>
    </div>
  );
}
