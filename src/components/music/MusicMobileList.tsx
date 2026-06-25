import { Link } from "react-router-dom";
import { Music as MusicIcon, Disc, Crown } from "lucide-react";
import { hasAnySplit } from "@/utils/music.utils";
import { formatCurrency } from "@/utils/format.utils";
import { CopyButton } from "@/components/ui/CopyButton";
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
  mode,
  songs,
  albums,
  groupedAlbums,
  groupAlbumsByTrackCount,
  onOwnerSplitModal,
}: MusicMobileListProps) {
  return (
    <div className="block divide-y divide-gray-100 lg:hidden">
      {mode === "songs"
        ? songs.map((song) => (
            <Link
              key={song._id}
              to={`/panel/song/${song._id}`}
              className="flex items-center gap-3 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="h-10 w-10 flex-shrink-0">
                {song?.spotifyData?.album?.images?.[0]?.url ? (
                  <img
                    src={song.spotifyData.album.images[0].url}
                    alt={song.trackTitle}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <MusicIcon size={18} className="text-orange-500" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{song.trackTitle}</p>
                <p className="truncate text-xs text-gray-500">
                  {song?.artistName ?? "Unknown Artist"}
                </p>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                  <span className="truncate">ISRC: {song?.isrc ?? "N/A"}</span>
                  {song?.isrc && <CopyButton value={song.isrc} size={11} title="Copiar ISRC" />}
                </span>
                <p className="truncate text-[11px] text-gray-400">
                  {Number(song?.totalStreams ?? 0).toLocaleString()} streams ·{" "}
                  {formatCurrency(song?.totalNetIncome ?? 0)}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${hasAnySplit(song) ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
              >
                {hasAnySplit(song) ? "Yes" : "No"}
              </span>
            </Link>
          ))
        : groupAlbumsByTrackCount
          ? groupedAlbums.flatMap(([trackCount, albumsInGroup]) => [
              <div
                key={`group-mobile-${trackCount}`}
                className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600"
              >
                {trackCount} canciones
              </div>,
              ...albumsInGroup.map((album) => (
                <AlbumMobileRow
                  key={`${album.upc}-${trackCount}`}
                  album={album}
                  onOwnerSplitModal={onOwnerSplitModal}
                />
              )),
            ])
          : albums.map((album) => (
              <AlbumMobileRow key={album.upc} album={album} onOwnerSplitModal={onOwnerSplitModal} />
            ))}
    </div>
  );
}

function AlbumMobileRow({
  album,
  onOwnerSplitModal,
}: {
  album: AlbumItem;
  onOwnerSplitModal: (a: AlbumItem) => void;
}) {
  const coverUrl =
    album?.coverImage?.[0]?.[0]?.url ?? album?.tracks?.[0]?.spotifyData?.album?.images?.[0]?.url;

  return (
    <div className="flex items-center gap-3 p-4 transition-colors hover:bg-gray-50">
      <div className="h-10 w-10 flex-shrink-0">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={album.albumTitle}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Disc size={18} className="text-purple-500" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          to={`/panel/album/upc/${album.upc}`}
          className="block truncate text-sm font-semibold text-gray-900"
        >
          {album.albumTitle}
        </Link>
        <p className="text-xs text-gray-400">{album.artistName ?? "Unknown Artist"}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOwnerSplitModal(album);
        }}
        className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-orange-600"
      >
        <Crown size={12} />
        Splits
      </button>
    </div>
  );
}
