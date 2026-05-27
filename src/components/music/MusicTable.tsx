import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Music as MusicIcon, Disc, Crown, Info, Tags, ArrowUpDown, Check } from "lucide-react";
import { hasAnySplit } from "@/utils/music.utils";
import type { MusicMode, SongItem, AlbumItem, SortBy } from "@/types/music.types";

const COLUMN_SORT_OPTIONS: Record<string, { value: SortBy; label: string }[]> = {
  track:         [{ value: "alpha",              label: "A → Z" },             { value: "title_desc",         label: "Z → A" }],
  split:         [{ value: "split_desc",         label: "Con split primero" },  { value: "split_asc",          label: "Sin split primero" }],
  percentage:    [{ value: "percentage_desc",    label: "Mayor %" },            { value: "percentage_asc",     label: "Menor %" }],
  collaborators: [{ value: "collaborators_desc", label: "Más colaboradores" },  { value: "collaborators_asc",  label: "Menos colaboradores" }],
  label:         [{ value: "label_asc",          label: "A → Z" },             { value: "label_desc",         label: "Z → A" }],
  album:         [{ value: "alpha",              label: "A → Z" },             { value: "title_desc",         label: "Z → A" }],
  artist:        [{ value: "artist_asc",         label: "A → Z" },             { value: "artist_desc",        label: "Z → A" }],
  date:          [{ value: "date_desc",          label: "Más reciente" },       { value: "date_asc",           label: "Más antiguo" }],
  revenue:       [{ value: "revenue",            label: "Mayor ganancia" },     { value: "streams",            label: "Más streams" }],
};

const COLLAB_COLORS = [
  { bg: "#DBEAFE", color: "#1E40AF" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#EDE9FE", color: "#5B21B6" },
  { bg: "#FED7AA", color: "#9A3412" },
  { bg: "#FCE7F3", color: "#9D174D" },
  { bg: "#FEF3C7", color: "#92400E" },
];

function getCollabInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase() || "?";
}

interface MusicTableProps {
  mode: MusicMode;
  songs: SongItem[];
  albums: AlbumItem[];
  groupedAlbums: [number, AlbumItem[]][];
  groupAlbumsByTrackCount: boolean;
  getAllSongLabels: (song: SongItem) => string[];
  onSongDetails: (song: SongItem) => void;
  onOwnerSplitModal: (album: AlbumItem) => void;
  sortBy: SortBy;
  onSortChange: (v: SortBy) => void;
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
  sortBy, onSortChange,
  safePage, pageStart, pageEnd, totalItemsForDisplay, canGoNext,
  limit, onLimitChange, onPrevPage, onNextPage,
}: MusicTableProps) {
  const [sortPopover, setSortPopover] = useState<{ x: number; y: number; column: string } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortPopover) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSortPopover(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortPopover]);

  const handleSortIconClick = (e: React.MouseEvent<HTMLButtonElement>, column: string) => {
    e.stopPropagation();
    if (sortPopover?.column === column) { setSortPopover(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setSortPopover({ x: rect.left, y: rect.bottom + 4, column });
  };

  const isColumnActive = (column: string) =>
    (COLUMN_SORT_OPTIONS[column] ?? []).some((o) => o.value === sortBy);

  const SortBtn = ({ column }: { column: string }) => (
    <button
      type="button"
      onClick={(e) => handleSortIconClick(e, column)}
      className={`ml-1 p-0.5 rounded transition-colors flex-shrink-0 ${isColumnActive(column) ? "text-orange-500" : "text-gray-400 hover:bg-gray-200"}`}
      title="Ordenar"
    >
      <ArrowUpDown size={11} />
    </button>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {sortPopover && (
        <div
          ref={popoverRef}
          style={{ position: "fixed", top: sortPopover.y, left: sortPopover.x }}
          className="z-50 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 min-w-[190px]"
        >
          <p className="px-3.5 pt-1 pb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
            Ordenar
          </p>
          {(COLUMN_SORT_OPTIONS[sortPopover.column] ?? []).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => { onSortChange(value); setSortPopover(null); }}
              className={`w-full flex items-center gap-2 px-3.5 py-2 text-sm transition-colors ${sortBy === value ? "text-orange-600 font-semibold bg-orange-50" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <span className="flex-1 text-left">{label}</span>
              {sortBy === value && <Check size={13} className="text-orange-500 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              {mode === "songs" ? (
                <>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Track <SortBtn column="track" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Split Status <SortBtn column="split" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Percentage <SortBtn column="percentage" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Collaborators <SortBtn column="collaborators" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Label <SortBtn column="label" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Status <SortBtn column="revenue" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Album <SortBtn column="album" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Artist <SortBtn column="artist" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPC</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Label <SortBtn column="label" /></div>
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Release Date <SortBtn column="date" /></div>
                  </th>
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
                              {song.collaborators.slice(0, 3).map((c, idx) => {
                                const palette = COLLAB_COLORS[idx % COLLAB_COLORS.length];
                                return c.image ? (
                                  <img
                                    key={idx}
                                    src={c.image}
                                    alt={c.name}
                                    title={c.name}
                                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                  />
                                ) : (
                                  <div
                                    key={idx}
                                    title={c.name}
                                    className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: palette.bg }}
                                  >
                                    <span className="text-[10px] font-bold" style={{ color: palette.color }}>
                                      {getCollabInitials(c.name)}
                                    </span>
                                  </div>
                                );
                              })}
                              {song.collaborators.length > 3 && (
                                <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                  <span className="text-[10px] font-medium text-gray-500">+{song.collaborators.length - 3}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-[13px] text-gray-400">—</span>
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

