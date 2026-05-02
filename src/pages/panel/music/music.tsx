/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import UploadModal from "./components/UploadModal";
import {
  Music as MusicIcon,
  Disc,
  Search,
  Plus,
  Crown,
  Filter,
} from "lucide-react";
import UseSongs from "../../../hooks/useSongs";
import useAlbums from "../../../hooks/useAlbums";
import useDebounce from "../../../hooks/useDebounce";
import Loading from "../../../components/loading/loading";
import AlbumOwnerSplitModal from "./album/components/AlbumOwnerSplitModal";

export default function Music() {
  const DATA_FETCH_LIMIT = 1000;
  const [mode, setMode] = useState<"songs" | "albums">("songs");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [albumSearchResult, setAlbumSearchResult] = useState<any | null>(null);
  const [isAlbumSearching, setIsAlbumSearching] = useState(false);
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<"alpha" | "revenue" | "streams">(
    "alpha",
  );
  const [splitFilter, setSplitFilter] = useState<
    "all" | "with_split" | "without_split"
  >("all");
  const [artistFilter, setArtistFilter] = useState("");
  const [isrcFilter, setIsrcFilter] = useState("");
  const [upcFilter, setUpcFilter] = useState("");
  const [groupAlbumsByTrackCount, setGroupAlbumsByTrackCount] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    songs,
    uploadSongs,
    loading: songsLoading,
    getSongs,
    searchSongs,
    searchSongsByCode,
    searchResults,
    isSearching,
    clearSearch,
  } = UseSongs(1, DATA_FETCH_LIMIT);
  const { albums, getAlbumByUPC, refreshAlbums } = useAlbums(
    0,
    DATA_FETCH_LIMIT,
  );

  const handleFileSelect = async (file: File) => {
    const formData = new FormData();
    formData.append("csvFile", file);
    await uploadSongs(formData);
    setIsModalOpen(false);
    getSongs();
  };

  const handleOpenOwnerSplitModal = (album: any) => {
    setSelectedAlbum(album);
    setIsOwnerSplitModalOpen(true);
  };

  // Helpers to detect codes
  const looksLikeUPC = (q: string) =>
    /^[0-9]{8,14}$/.test(q.replace(/\s|-/g, ""));
  const looksLikeISRC = (q: string) =>
    /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/i.test(q.replace(/\s|-/g, "").toUpperCase());
  const hasOwnerSplit = (item: any) => {
    const ownerSplit = item?.ownerId?.split;
    if (!ownerSplit) return false;
    if (Array.isArray(ownerSplit?.conditions))
      return ownerSplit.conditions.length > 0;
    return true;
  };

  const hasAnySplit = (item: any) => {
    if (Boolean(item?.split) || hasOwnerSplit(item)) return true;

    if (Array.isArray(item?.tracks)) {
      return item.tracks.some(
        (track: any) => Boolean(track?.split) || hasOwnerSplit(track),
      );
    }

    return false;
  };

  // Handle search when debounced query changes
  useEffect(() => {
    if (mode === "songs") {
      setAlbumSearchResult(null);
      if (debouncedSearchQuery.trim()) {
        const q = debouncedSearchQuery.trim();
        if (looksLikeISRC(q) || looksLikeUPC(q)) {
          searchSongsByCode(q);
        } else {
          searchSongs(q);
        }
      } else {
        clearSearch();
      }
    }
    if (mode === "albums") {
      const q = debouncedSearchQuery.trim();
      if (q && looksLikeUPC(q)) {
        setIsAlbumSearching(true);
        setAlbumSearchResult(null);
        (async () => {
          const result = await getAlbumByUPC(q.replace(/\s|-/g, ""));
          setAlbumSearchResult(result);
          setIsAlbumSearching(false);
        })();
      } else {
        setAlbumSearchResult(null);
      }
    }
  }, [
    debouncedSearchQuery,
    mode,
    searchSongs,
    clearSearch,
    searchSongsByCode,
    getAlbumByUPC,
  ]);

  // Clear search and reload albums when switching to albums mode
  useEffect(() => {
    if (mode === "albums") {
      clearSearch();
      setSearchQuery("");
      setAlbumSearchResult(null);
      refreshAlbums();
    }
  }, [mode, clearSearch, refreshAlbums]);

  const filteredSongs = useMemo(() => {
    const normalize = (value: unknown) => String(value || "").toLowerCase();
    let list = [
      ...(debouncedSearchQuery.trim() && mode === "songs"
        ? searchResults
        : songs),
    ];

    if (splitFilter === "with_split") {
      list = list.filter((song: any) => hasAnySplit(song));
    } else if (splitFilter === "without_split") {
      list = list.filter((song: any) => !hasAnySplit(song));
    }

    if (artistFilter.trim()) {
      const artist = normalize(artistFilter.trim());
      list = list.filter((song: any) =>
        normalize(song?.artistName).includes(artist),
      );
    }

    if (isrcFilter.trim()) {
      const isrc = normalize(isrcFilter.trim());
      list = list.filter((song: any) => normalize(song?.isrc).includes(isrc));
    }

    if (sortBy === "alpha") {
      list.sort((a: any, b: any) =>
        String(a?.trackTitle || "").localeCompare(String(b?.trackTitle || "")),
      );
    } else if (sortBy === "revenue") {
      list.sort(
        (a: any, b: any) => (b?.totalNetIncome || 0) - (a?.totalNetIncome || 0),
      );
    } else if (sortBy === "streams") {
      list.sort(
        (a: any, b: any) => (b?.totalStreams || 0) - (a?.totalStreams || 0),
      );
    }

    return list;
  }, [
    debouncedSearchQuery,
    mode,
    searchResults,
    songs,
    splitFilter,
    artistFilter,
    isrcFilter,
    sortBy,
  ]);

  const filteredAlbums = useMemo(() => {
    const normalize = (value: unknown) => String(value || "").toLowerCase();
    let list = albumSearchResult
      ? [albumSearchResult]
      : albums.filter(
          (album) =>
            normalize(album.albumTitle).includes(normalize(searchQuery)) ||
            normalize(album.artistName).includes(normalize(searchQuery)) ||
            normalize(album.artisticLabel).includes(normalize(searchQuery)),
        );

    if (artistFilter.trim()) {
      const artist = normalize(artistFilter.trim());
      list = list.filter((album) =>
        normalize(album.artistName).includes(artist),
      );
    }

    if (upcFilter.trim()) {
      const upc = normalize(upcFilter.trim());
      list = list.filter((album) => normalize(album.upc).includes(upc));
    }

    if (splitFilter !== "all") {
      list = list.filter((album: any) =>
        splitFilter === "with_split" ? hasAnySplit(album) : !hasAnySplit(album),
      );
    }

    if (sortBy === "alpha") {
      list.sort((a: any, b: any) =>
        String(a?.releaseTitle || a?.albumTitle || "").localeCompare(
          String(b?.releaseTitle || b?.albumTitle || ""),
        ),
      );
    } else if (sortBy === "revenue") {
      list.sort(
        (a: any, b: any) => (b?.totalNetIncome || 0) - (a?.totalNetIncome || 0),
      );
    } else if (sortBy === "streams") {
      list.sort(
        (a: any, b: any) => (b?.totalStreams || 0) - (a?.totalStreams || 0),
      );
    }

    if (groupAlbumsByTrackCount) {
      list.sort(
        (a: any, b: any) =>
          (b?.totalTracks || b?.tracks?.length || 0) -
          (a?.totalTracks || a?.tracks?.length || 0),
      );
    }

    return list;
  }, [
    albumSearchResult,
    albums,
    searchQuery,
    artistFilter,
    upcFilter,
    splitFilter,
    sortBy,
    groupAlbumsByTrackCount,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    mode,
    limit,
    debouncedSearchQuery,
    sortBy,
    splitFilter,
    artistFilter,
    isrcFilter,
    upcFilter,
    groupAlbumsByTrackCount,
  ]);

  const loading = mode === "songs" ? songsLoading || isSearching : false;
  const currentData = mode === "songs" ? filteredSongs : filteredAlbums;
  const totalPages = Math.max(1, Math.ceil(currentData.length / limit));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * limit;
  const pageEnd = pageStart + limit;
  const paginatedSongs = filteredSongs.slice(pageStart, pageEnd);
  const paginatedAlbums = filteredAlbums.slice(pageStart, pageEnd);
  const groupedAlbums = useMemo(() => {
    if (!groupAlbumsByTrackCount || mode !== "albums") return [];
    const groups = new Map<number, any[]>();
    paginatedAlbums.forEach((album: any) => {
      const trackCount = album?.totalTracks || album?.tracks?.length || 0;
      const existing = groups.get(trackCount) || [];
      existing.push(album);
      groups.set(trackCount, existing);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [groupAlbumsByTrackCount, mode, paginatedAlbums]);

  const formatMoney = (value: number) =>
    `$${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const getSongStatus = (song: any) => song?.status || "Active";

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Music Library</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your songs and albums
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] transition-colors"
          >
            <Plus size={16} />
            Upload
          </button>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="bg-gray-100 rounded-[10px] p-1 flex">
            {[
              { key: "songs", label: "Songs" },
              { key: "albums", label: "Albums" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMode(key as "songs" | "albums")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  mode === key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder={
                mode === "songs"
                  ? "Search by title, artist, ISRC..."
                  : "Search by title, artist, UPC..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md border transition-colors ${
                showFilters
                  ? "bg-orange-50 border-orange-200 text-orange-600"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
              aria-label="Mostrar filtros"
            >
              <Filter size={14} />
            </button>
            {(isSearching && mode === "songs") ||
            (isAlbumSearching && mode === "albums") ? (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
              </div>
            ) : null}

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 z-30 w-[320px] max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-3">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "alpha" | "revenue" | "streams")
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="alpha">Ordenar: Alfabéticamente</option>
                  <option value="revenue">Ordenar: Más ganancias</option>
                  <option value="streams">Ordenar: Más streams</option>
                </select>

                <select
                  value={splitFilter}
                  onChange={(e) =>
                    setSplitFilter(
                      e.target.value as "all" | "with_split" | "without_split",
                    )
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Splits: Todos</option>
                  <option value="with_split">Splits: Con split</option>
                  <option value="without_split">Splits: Sin split</option>
                </select>

                <input
                  type="text"
                  value={artistFilter}
                  onChange={(e) => setArtistFilter(e.target.value)}
                  placeholder="Filtrar por artista"
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                {mode === "songs" ? (
                  <input
                    type="text"
                    value={isrcFilter}
                    onChange={(e) => setIsrcFilter(e.target.value)}
                    placeholder="Filtrar por ISRC"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={upcFilter}
                    onChange={(e) => setUpcFilter(e.target.value)}
                    placeholder="Filtrar por UPC"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                )}

                {mode === "albums" ? (
                  <label className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={groupAlbumsByTrackCount}
                      onChange={(e) =>
                        setGroupAlbumsByTrackCount(e.target.checked)
                      }
                      className="accent-orange-500"
                    />
                    Agrupar por # canciones
                  </label>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {currentData.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MusicIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No {mode === "songs" ? "songs" : "albums"} found
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {debouncedSearchQuery && mode === "songs"
                ? `No songs found matching "${debouncedSearchQuery}". Try different search terms.`
                : searchQuery && mode === "albums"
                  ? `No albums found matching "${searchQuery}". Try different search terms.`
                  : "Start by uploading your first track"}
            </p>
            {!debouncedSearchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-[10px] transition-colors"
              >
                Upload Your First Track
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Mobile Card View */}
              <div className="block lg:hidden divide-y divide-gray-100">
                {mode === "songs"
                  ? paginatedSongs.map((song: any) => (
                      <Link
                        key={song._id}
                        to={`/panel/song/${song._id}`}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10">
                          {song?.spotifyData?.album?.images?.[0]?.url ? (
                            <img
                              src={song.spotifyData.album.images[0].url}
                              alt={song.trackTitle}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <MusicIcon
                                size={18}
                                className="text-orange-500"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {song.trackTitle}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {song?.artistName || "Unknown Artist"}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">
                            ISRC: {song?.isrc || "N/A"} ·{" "}
                            {Number(song?.totalStreams || 0).toLocaleString()}{" "}
                            streams · {formatMoney(song?.totalNetIncome || 0)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-[11px] font-semibold rounded-full ${
                            song?.split
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {song?.split ? "Yes" : "No"}
                        </span>
                      </Link>
                    ))
                  : groupAlbumsByTrackCount
                    ? groupedAlbums.flatMap(([trackCount, albumsInGroup]) => [
                        <div
                          key={`group-mobile-${trackCount}`}
                          className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600"
                        >
                          {trackCount} canciones
                        </div>,
                        ...albumsInGroup.map((album: any) => (
                          <div
                            key={`${album.upc}-${trackCount}`}
                            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-shrink-0 w-10 h-10">
                              {album?.coverImage || album?.image ? (
                                <img
                                  src={album.coverImage || album.image}
                                  alt={album.albumTitle}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : album?.tracks?.[0]?.spotifyData?.album
                                  ?.images?.[0]?.url ? (
                                <img
                                  src={
                                    album.tracks[0].spotifyData.album.images[0]
                                      .url
                                  }
                                  alt={album.albumTitle}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                  <Disc size={18} className="text-purple-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/panel/album/upc/${album.upc}`}
                                className="text-sm font-semibold text-gray-900 truncate block"
                              >
                                {album.albumTitle}
                              </Link>
                              <p className="text-xs text-gray-400">
                                {album.artistName || "Unknown Artist"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenOwnerSplitModal(album);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
                              >
                                <Crown size={12} />
                                Splits
                              </button>
                            </div>
                          </div>
                        )),
                      ])
                    : paginatedAlbums.map((album: any) => (
                        <div
                          key={album.upc}
                          className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10">
                            {album?.coverImage || album?.image ? (
                              <img
                                src={album.coverImage || album.image}
                                alt={album.albumTitle}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : album?.tracks?.[0]?.spotifyData?.album
                                ?.images?.[0]?.url ? (
                              <img
                                src={
                                  album.tracks[0].spotifyData.album.images[0]
                                    .url
                                }
                                alt={album.albumTitle}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Disc size={18} className="text-purple-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/panel/album/upc/${album.upc}`}
                              className="text-sm font-semibold text-gray-900 truncate block"
                            >
                              {album.albumTitle}
                            </Link>
                            <p className="text-xs text-gray-400">
                              {album.artistName || "Unknown Artist"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenOwnerSplitModal(album);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
                            >
                              <Crown size={12} />
                              Splits
                            </button>
                          </div>
                        </div>
                      ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-gray-200">
                      {mode === "songs" ? (
                        <>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Track
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Artist
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ISRC
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Streams
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Net Income
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Split Status
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Label
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Album
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Artist
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            UPC
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Label
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Release Date
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {mode === "songs"
                      ? paginatedSongs.map((song: any) => (
                          <tr
                            key={song._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-3">
                              <Link
                                to={`/panel/song/${song._id}`}
                                className="flex items-center gap-3 group"
                              >
                                <div className="flex-shrink-0 w-9 h-9">
                                  {song?.spotifyData?.album?.images?.[0]
                                    ?.url ? (
                                    <img
                                      src={song.spotifyData.album.images[0].url}
                                      alt={song.trackTitle}
                                      className="w-9 h-9 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                                      <MusicIcon
                                        size={16}
                                        className="text-orange-500"
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[13px] font-semibold text-gray-900 group-hover:text-orange-500 transition-colors truncate">
                                    {song.trackTitle}
                                  </p>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-3 text-[13px] text-gray-900">
                              {song?.artistName || "Unknown Artist"}
                            </td>
                            <td className="px-6 py-3">
                              <span className="text-[12px] text-gray-900 font-mono">
                                {song?.isrc || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-[13px] text-gray-900">
                              {Number(song?.totalStreams || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-3 text-[13px] text-gray-900 font-semibold">
                              {formatMoney(song?.totalNetIncome || 0)}
                            </td>
                            <td className="px-6 py-3">
                              <span
                                className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                                  hasAnySplit(song)
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {hasAnySplit(song) ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-[13px] text-gray-900">
                              {song?.artisticLabel || "Unknown"}
                            </td>
                            <td className="px-6 py-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                {getSongStatus(song)}
                              </span>
                            </td>
                          </tr>
                        ))
                      : groupAlbumsByTrackCount
                        ? groupedAlbums.flatMap(
                            ([trackCount, albumsInGroup]) => [
                              <tr
                                key={`group-desktop-${trackCount}`}
                                className="bg-gray-50 border-b border-gray-100"
                              >
                                <td
                                  colSpan={7}
                                  className="px-6 py-2 text-xs font-semibold text-gray-600"
                                >
                                  {trackCount} canciones
                                </td>
                              </tr>,
                              ...albumsInGroup.map((album: any) => (
                                <tr
                                  key={`${album.upc}-${trackCount}`}
                                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-3">
                                    <div className="flex items-center gap-3 group">
                                      <div className="flex-shrink-0 w-9 h-9">
                                        {album?.coverImage?.[0]?.[0]?.url ? (
                                          <img
                                            src={album.coverImage[0]?.[0]?.url}
                                            alt={album.albumTitle}
                                            className="w-9 h-9 rounded-lg object-cover"
                                          />
                                        ) : (
                                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <Disc
                                              size={16}
                                              className="text-purple-500"
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <Link
                                        to={`/panel/album/upc/${album.upc}`}
                                        className="text-[13px] font-semibold text-gray-900 group-hover:text-orange-500 transition-colors"
                                      >
                                        {album.releaseTitle || album.albumTitle}
                                      </Link>
                                    </div>
                                  </td>
                                  <td className="px-6 py-3 text-[13px] text-gray-900">
                                    {album.artistName || "Unknown Artist"}
                                  </td>
                                  <td className="px-6 py-3 text-[13px] text-gray-900 font-mono">
                                    {album.upc || "N/A"}
                                  </td>
                                  <td className="px-6 py-3 text-[13px] text-gray-900">
                                    {album.artisticLabel || "Unknown"}
                                  </td>
                                  <td className="px-6 py-3 text-[13px] text-gray-900">
                                    {album.releaseDate
                                      ? new Date(
                                          album.releaseDate,
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </td>
                                  <td className="px-6 py-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                      Active
                                    </span>
                                  </td>
                                  <td className="px-6 py-3 text-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenOwnerSplitModal(album);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
                                    >
                                      <Crown size={12} />
                                      Owner Splits
                                    </button>
                                  </td>
                                </tr>
                              )),
                            ],
                          )
                        : paginatedAlbums.map((album: any) => (
                            <tr
                              key={album.upc}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-3 group">
                                  <div className="flex-shrink-0 w-9 h-9">
                                    {album?.coverImage?.[0]?.[0]?.url ? (
                                      <img
                                        src={album.coverImage[0]?.[0]?.url}
                                        alt={album.albumTitle}
                                        className="w-9 h-9 rounded-lg object-cover"
                                      />
                                    ) : (
                                      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <Disc
                                          size={16}
                                          className="text-purple-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <Link
                                    to={`/panel/album/upc/${album.upc}`}
                                    className="text-[13px] font-semibold text-gray-900 group-hover:text-orange-500 transition-colors"
                                  >
                                    {album.releaseTitle || album.albumTitle}
                                  </Link>
                                </div>
                              </td>
                              <td className="px-6 py-3 text-[13px] text-gray-900">
                                {album.artistName || "Unknown Artist"}
                              </td>
                              <td className="px-6 py-3 text-[13px] text-gray-900 font-mono">
                                {album.upc || "N/A"}
                              </td>
                              <td className="px-6 py-3 text-[13px] text-gray-900">
                                {album.artisticLabel || "Unknown"}
                              </td>
                              <td className="px-6 py-3 text-[13px] text-gray-900">
                                {album.releaseDate
                                  ? new Date(
                                      album.releaseDate,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-3">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                  Active
                                </span>
                              </td>
                              <td className="px-6 py-3 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenOwnerSplitModal(album);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
                                >
                                  <Crown size={12} />
                                  Owner Splits
                                </button>
                              </td>
                            </tr>
                          ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-200">
                <span className="text-[13px] text-gray-500">
                  Showing {currentData.length === 0 ? 0 : pageStart + 1}-
                  {Math.min(pageEnd, currentData.length)} of{" "}
                  {currentData.length} {mode}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-gray-500">Show:</span>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="px-2.5 py-1 text-[13px] border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-[13px] text-gray-500">per page</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={safePage <= 1}
                    className="px-3 py-1.5 text-[13px] font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-[13px] font-semibold text-white bg-orange-500 rounded-lg">
                    {safePage}
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage >= totalPages}
                    className="px-3 py-1.5 text-[13px] font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={handleFileSelect}
      />

      {selectedAlbum && (
        <AlbumOwnerSplitModal
          isOpen={isOwnerSplitModalOpen}
          onClose={() => {
            setIsOwnerSplitModalOpen(false);
            setSelectedAlbum(null);
          }}
          album={selectedAlbum}
          onSplitsCreated={() => {
            refreshAlbums();
          }}
        />
      )}
    </div>
  );
}
