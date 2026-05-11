import { Link } from "react-router-dom";
import { Music as MusicIcon, Disc, Crown, Info, Tags } from "lucide-react";
import { hasAnySplit } from "@/utils/music.utils";
import type { MusicMode, SongItem, AlbumItem } from "@/types/music.types";

interface MusicTableProps {
  mode: MusicMode;
  songs: SongItem[];
  albums: AlbumItem[];
  groupedAlbums: [number, AlbumItem[]][];
  groupAlbumsByTrackCount: boolean;
  getAllSongLabels: (song: SongItem) => string[];
  onSongDetails: (song: SongItem) => void;
  onOwnerSplitModal: (album: AlbumItem) => void;
  // Pagination
  safePage: number;
  pageStart: number;
  pageEnd: number;
  totalItemsForDisplay: number;
  canGoNext: boolean;
  knownTotalPages?: number | null;
  limit: number;
  onLimitChange: (limit: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

function AlbumCover({ album, size = "9" }: { album: AlbumItem; size?: string }) {
  const url = album?.coverImage?.[0]?.[0]?.url ?? album?.tracks?.[0]?.spotifyData?.album?.images?.[0]?.url;
  if (url) return <img src={url} alt={album.albumTitle} className={`w-${size} h-${size} rounded-lg object-cover`} />;
  return (
    <div className={`w-${size} h-${size} rounded-lg bg-purple-100 flex items-center justify-center`}>
      <Disc size={size === "10" ? 18 : 16} className="text-purple-500" />
    </div>
  );
}

/**
 * Tabla desktop con cabeceras, filas y paginación para songs y albums.
 */
export function MusicTable({
  mode, songs, albums, groupedAlbums, groupAlbumsByTrackCount,
  getAllSongLabels, onSongDetails, onOwnerSplitModal,
  safePage, pageStart, pageEnd, totalItemsForDisplay, canGoNext,
  limit, onLimitChange, onPrevPage, onNextPage,
}: MusicTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              {mode === "songs" ? (
                <>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Split Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborators</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPC</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {mode === "songs"
              ? songs.map((song) => {
                  const allLabels = getAllSongLabels(song);
                  return (
                    <tr key={song._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <Link to={`/panel/song/${song._id}`} className="flex items-center gap-3 group min-w-0">
                          <div className="flex-shrink-0 w-9 h-9">
                            {song?.spotifyData?.album?.images?.[0]?.url ? (
                              <img src={song.spotifyData.album.images[0].url} alt={song.trackTitle} className="w-9 h-9 rounded-lg object-cover" />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                                <MusicIcon size={16} className="text-orange-500" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-[260px]">
                            <p className="text-[13px] font-semibold text-gray-900 group-hover:text-orange-500 transition-colors truncate" title={song.trackTitle}>
                              {song.trackTitle}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{song?.artistName ?? "Unknown Artist"}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ${hasAnySplit(song) ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {hasAnySplit(song) ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-[13px] text-gray-900">{song?.percetaje ?? "Not assigned"}</td>
                      <td className="px-6 py-3">
                        <div className="flex -space-x-2">
                          {song?.collaborators?.length ? (
                            <>
                              {song.collaborators.slice(0, 3).map((c, idx) => (
                                <img key={idx} src={c.image} alt={c.name} className="w-7 h-7 rounded-full border-2 border-white" />
                              ))}
                              {song.collaborators.length > 3 && (
                                <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                  <span className="text-[10px] font-medium text-gray-500">+{song.collaborators.length - 3}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-[13px] text-gray-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] text-gray-900 truncate max-w-[160px]">{song?.artisticLabel ?? "Unknown"}</span>
                          {allLabels.length > 1 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-orange-500 font-medium" title={allLabels.join(", ")}>
                              <Tags className="h-3 w-3 flex-shrink-0" />
                              En {allLabels.length} labels
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => onSongDetails(song)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          <Info size={12} />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              : groupAlbumsByTrackCount
                ? groupedAlbums.flatMap(([trackCount, albumsInGroup]) => [
                    <tr key={`group-${trackCount}`} className="bg-gray-50 border-b border-gray-100">
                      <td colSpan={7} className="px-6 py-2 text-xs font-semibold text-gray-600">{trackCount} canciones</td>
                    </tr>,
                    ...albumsInGroup.map((album) => (
                      <AlbumRow key={`${album.upc}-${trackCount}`} album={album} onOwnerSplitModal={onOwnerSplitModal} />
                    )),
                  ])
                : albums.map((album) => (
                    <AlbumRow key={album.upc} album={album} onOwnerSplitModal={onOwnerSplitModal} />
                  ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-200">
        <span className="text-[13px] text-gray-500">
          Showing {totalItemsForDisplay === 0 ? 0 : pageStart + 1}–{Math.min(pageEnd, totalItemsForDisplay)} of {totalItemsForDisplay} {mode}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-500">Show:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2.5 py-1 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {[5, 10, 25, 50, 100].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <span className="text-[13px] text-gray-500">per page</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onPrevPage} disabled={safePage <= 1} className="px-3 py-1.5 text-[13px] font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 text-[13px] font-semibold text-white bg-orange-500 rounded-lg">{safePage}</button>
          <button
            onClick={onNextPage}
            disabled={!canGoNext}
            className="px-3 py-1.5 text-[13px] font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function AlbumRow({ album, onOwnerSplitModal }: { album: AlbumItem; onOwnerSplitModal: (a: AlbumItem) => void }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-3">
        <div className="flex items-center gap-3 group">
          <div className="flex-shrink-0 w-9 h-9">
            <AlbumCover album={album} />
          </div>
          <Link to={`/panel/album/upc/${album.upc}`} className="text-[13px] font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
            {album.releaseTitle ?? album.albumTitle}
          </Link>
        </div>
      </td>
      <td className="px-6 py-3 text-[13px] text-gray-900">{album.artistName ?? "Unknown Artist"}</td>
      <td className="px-6 py-3 text-[13px] text-gray-900 font-mono">{album.upc ?? "N/A"}</td>
      <td className="px-6 py-3 text-[13px] text-gray-900">{album.artisticLabel ?? "Unknown"}</td>
      <td className="px-6 py-3 text-[13px] text-gray-900">
        {album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-6 py-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Active
        </span>
      </td>
      <td className="px-6 py-3 text-center">
        <button
          onClick={(e) => { e.stopPropagation(); onOwnerSplitModal(album); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
        >
          <Crown size={12} />
          Owner Splits
        </button>
      </td>
    </tr>
  );
}

