/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import UploadModal from "./components/UploadModal";
import {
  Music as MusicIcon,
  Disc,
  Search,
  Plus,
  Crown,
  Info,
  X,
  ArrowRight,
  Tags,
  SlidersHorizontal,
} from "lucide-react";
import UseSongs from "../../../hooks/useSongs";
import useAlbums from "../../../hooks/useAlbums";
import useDebounce from "../../../hooks/useDebounce";
import { useLabels } from "../../../hooks/useLabels";
import Loading from "../../../components/loading/loading";
import AlbumOwnerSplitModal from "./album/components/AlbumOwnerSplitModal";
import SongService from "../../../services/songs";

export default function Music() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"songs" | "albums">("songs");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [albumSearchResult, setAlbumSearchResult] = useState<any | null>(null);
  const [isAlbumSearching, setIsAlbumSearching] = useState(false);
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [isSongDetailsOpen, setIsSongDetailsOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [selectedSongDetails, setSelectedSongDetails] = useState<any | null>(null);
  const [isSongDetailsLoading, setIsSongDetailsLoading] = useState(false);
  const [songDetailsError, setSongDetailsError] = useState("");
  const [sortBy, setSortBy] = useState<"alpha" | "revenue" | "streams">("alpha");
  const [splitFilter, setSplitFilter] = useState<"all" | "with_split" | "without_split">("all");
  const [artistFilter, setArtistFilter] = useState("");
  const [isrcFilter, setIsrcFilter] = useState("");
  const [upcFilter, setUpcFilter] = useState("");
  const [groupAlbumsByTrackCount, setGroupAlbumsByTrackCount] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

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
    clearSearch
  } = UseSongs(page, limit);
  const {
    albums,
    loading: albumsLoading,
    getAlbumByUPC,
    refreshAlbums,
  } = useAlbums(page, limit);
  const { customLabels } = useLabels();

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

  const handleOpenSongDetails = async (song: any) => {
    setSelectedSong(song);
    setIsSongDetailsOpen(true);
    setSelectedSongDetails(null);
    setSongDetailsError("");

    if (!song?.isrc) {
      setSongDetailsError("La canción no tiene ISRC.");
      return;
    }

    setIsSongDetailsLoading(true);
    const response = await SongService.getSongByIsrc(song.isrc);
    setIsSongDetailsLoading(false);
    const details = response?.data ?? response;
    if (!details) {
      setSongDetailsError("No se pudo obtener el detalle de la canción por ISRC.");
      return;
    }
    setSelectedSongDetails(details);
  };

  const handleCloseSongDetails = () => {
    setIsSongDetailsOpen(false);
    setSelectedSong(null);
    setSelectedSongDetails(null);
    setSongDetailsError("");
  };

  const hasOwnerSplit = (item: any) => {
    const ownerSplit = item?.ownerId?.split;
    if (!ownerSplit) return false;
    if (Array.isArray(ownerSplit?.conditions)) return ownerSplit.conditions.length > 0;
    return true;
  };

  const hasAnySplit = (item: any) => {
    if (Boolean(item?.split) || hasOwnerSplit(item)) return true;
    if (Array.isArray(item?.tracks)) {
      return item.tracks.some((track: any) => Boolean(track?.split) || hasOwnerSplit(track));
    }
    return false;
  };

  const formatMoney = (value: number) =>
    `$${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Helpers to detect codes
  const looksLikeUPC = (q: string) => /^[0-9]{8,14}$/.test(q.replace(/\s|-/g, ""));
  const looksLikeISRC = (q: string) => /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/i.test(q.replace(/\s|-/g, "").toUpperCase());

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
  }, [debouncedSearchQuery, mode, searchSongs, clearSearch, searchSongsByCode, getAlbumByUPC]);

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
    let list = [...(debouncedSearchQuery.trim() && mode === "songs" ? searchResults : songs)];

    if (splitFilter === "with_split") {
      list = list.filter((song: any) => hasAnySplit(song));
    } else if (splitFilter === "without_split") {
      list = list.filter((song: any) => !hasAnySplit(song));
    }
    if (artistFilter.trim()) {
      const artist = normalize(artistFilter.trim());
      list = list.filter((song: any) => normalize(song?.artistName).includes(artist));
    }
    if (isrcFilter.trim()) {
      const isrc = normalize(isrcFilter.trim());
      list = list.filter((song: any) => normalize(song?.isrc).includes(isrc));
    }
    if (sortBy === "alpha") {
      list.sort((a: any, b: any) => String(a?.trackTitle || "").localeCompare(String(b?.trackTitle || "")));
    } else if (sortBy === "revenue") {
      list.sort((a: any, b: any) => (b?.totalNetIncome || 0) - (a?.totalNetIncome || 0));
    } else if (sortBy === "streams") {
      list.sort((a: any, b: any) => (b?.totalStreams || 0) - (a?.totalStreams || 0));
    }
    return list;
  }, [debouncedSearchQuery, mode, searchResults, songs, splitFilter, artistFilter, isrcFilter, sortBy]);

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
      list = list.filter((album) => normalize(album.artistName).includes(artist));
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
        String(a?.releaseTitle || a?.albumTitle || "").localeCompare(String(b?.releaseTitle || b?.albumTitle || "")),
      );
    } else if (sortBy === "revenue") {
      list.sort((a: any, b: any) => (b?.totalNetIncome || 0) - (a?.totalNetIncome || 0));
    } else if (sortBy === "streams") {
      list.sort((a: any, b: any) => (b?.totalStreams || 0) - (a?.totalStreams || 0));
    }
    if (groupAlbumsByTrackCount) {
      list.sort((a: any, b: any) =>
        (b?.totalTracks || b?.tracks?.length || 0) - (a?.totalTracks || a?.tracks?.length || 0),
      );
    }
    return list;
  }, [albumSearchResult, albums, searchQuery, artistFilter, upcFilter, splitFilter, sortBy, groupAlbumsByTrackCount]);

  useEffect(() => {
    setPage(1);
  }, [mode, limit, debouncedSearchQuery, sortBy, splitFilter, artistFilter, isrcFilter, upcFilter, groupAlbumsByTrackCount]);

  const loading = mode === "songs" ? (songsLoading || isSearching) : albumsLoading;
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

  const songDetailsSource = selectedSongDetails || selectedSong || {};

  const getSongField = (...keys: string[]) =>
    keys.map((key) => songDetailsSource?.[key]).find((value) => value !== undefined && value !== null && value !== "");

  const getReleaseDate = () => {
    const rawDate =
      getSongField("releaseDate", "release_date", "releasedAt", "release") ||
      songDetailsSource?.releases?.[0]?.releaseDate ||
      songDetailsSource?.releases?.[0]?.release_date ||
      songDetailsSource?.spotifyData?.album?.release_date;

    if (!rawDate) return "N/A";
    const parsedDate = new Date(rawDate);
    return Number.isNaN(parsedDate.getTime()) ? String(rawDate) : parsedDate.toLocaleDateString();
  };

  const getDuration = () => {
    const rawDuration =
      getSongField("duration", "durationMs", "duration_ms") ||
      songDetailsSource?.spotifyData?.duration_ms;
    if (rawDuration === undefined || rawDuration === null || rawDuration === "") return "N/A";

    const durationNumber = Number(rawDuration);
    if (Number.isNaN(durationNumber)) return String(rawDuration);

    const totalSeconds = durationNumber > 10000 ? Math.round(durationNumber / 1000) : Math.round(durationNumber);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const getSplitsCount = () => {
    const collaboratorsCount = songDetailsSource?.collaborators?.length || 0;
    const splitConditionsCount = songDetailsSource?.split?.conditions?.length || 0;
    return Math.max(collaboratorsCount, splitConditionsCount);
  };

  const getAssignedSplitsCount = () => {
    const collaborators = songDetailsSource?.collaborators;
    if (Array.isArray(collaborators) && collaborators.length > 0) {
      return collaborators.filter((collaborator: any) =>
        collaborator?.split?.conditions?.some((condition: any) => {
          const rawValue = condition?.percentage ?? condition?.value;
          const numericValue = Number(rawValue);
          return Number.isFinite(numericValue) && numericValue > 0;
        })
      ).length;
    }

    const splitConditions = songDetailsSource?.split?.conditions;
    if (Array.isArray(splitConditions) && splitConditions.length > 0) {
      return splitConditions.filter((condition: any) => {
        const rawValue = condition?.percentage ?? condition?.value;
        const numericValue = Number(rawValue);
        return Number.isFinite(numericValue) && numericValue > 0;
      }).length;
    }

    return 0;
  };

  const getUnassignedSplitsCount = () => {
    const totalSplits = getSplitsCount();
    const assignedSplits = getAssignedSplitsCount();
    return Math.max(totalSplits - assignedSplits, 0);
  };

  const getReleasesCount = () => {
    if (Array.isArray(songDetailsSource?.releases)) return songDetailsSource.releases.length;
    const releasesCountField = getSongField("releasesCount", "totalReleases");
    const releasesCount = Number(releasesCountField);
    return Number.isFinite(releasesCount) ? releasesCount : 0;
  };

  const getStreamsLabel = () => {
    const rawStreams = getSongField("totalStreams", "streams");
    const parsedStreams = Number(rawStreams);
    if (Number.isFinite(parsedStreams)) return parsedStreams.toLocaleString();
    return rawStreams || "0";
  };

  const getEarningsLabel = () => {
    const rawEarnings = getSongField("totalNetIncome", "netIncome", "earning", "earnings");
    const parsedEarnings = Number(rawEarnings);
    const amount = Number.isFinite(parsedEarnings) ? parsedEarnings : 0;
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getLabelName = (value: unknown): string | null => {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (value && typeof value === "object") {
      const labelObject = value as Record<string, unknown>;
      const candidate =
        labelObject.name ??
        labelObject.label ??
        labelObject.artisticLabel ??
        labelObject.title;

      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }

    return null;
  };

  const normalizeLabel = (label: string) => label.trim().toLowerCase();

  const getAllSongLabels = (song: any) => {
    const labelSources = [
      song?.artisticLabel,
      song?.label,
      song?.labels,
      song?.customLabels,
      song?.labelNames,
      song?.otherLabels,
    ];

    const directLabels = Array.from(
      new Set(
        labelSources.flatMap((source) => {
          if (Array.isArray(source)) {
            return source
              .map((item) => getLabelName(item))
              .filter((label): label is string => Boolean(label));
          }

          const singleLabel = getLabelName(source);
          return singleLabel ? [singleLabel] : [];
        })
      )
    );

    const normalizedDirectLabels = new Set(
      directLabels.map((label) => normalizeLabel(label))
    );

    const customLabelsWhereSongAppears = customLabels
      .filter((customLabel) =>
        customLabel.artisticLabels?.some((artisticLabel) =>
          normalizedDirectLabels.has(normalizeLabel(artisticLabel))
        )
      )
      .map((customLabel) => customLabel.name);

    return Array.from(new Set([...directLabels, ...customLabelsWhereSongAppears]));
  };

  const activeFilterCount = [
    sortBy !== "alpha",
    splitFilter !== "all",
    artistFilter.trim() !== "",
    isrcFilter.trim() !== "",
    upcFilter.trim() !== "",
    groupAlbumsByTrackCount,
  ].filter(Boolean).length;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Music Library</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your songs and albums</p>
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

          {/* Search + Filter button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={mode === "songs" ? "Search by title, artist, ISRC..." : "Search by title, artist, UPC..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {(isSearching && mode === "songs") || (isAlbumSearching && mode === "albums") ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setShowFilterPanel(true)}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] border text-sm font-medium transition-colors flex-shrink-0 ${
                activeFilterCount > 0
                  ? "bg-orange-50 border-orange-200 text-orange-600"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filtros</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
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
                                <MusicIcon size={18} className="text-orange-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{song.trackTitle}</p>
                            <p className="text-xs text-gray-500 truncate">{song?.artistName || "Unknown Artist"}</p>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                              ISRC: {song?.isrc || "N/A"} · {Number(song?.totalStreams || 0).toLocaleString()} streams · {formatMoney(song?.totalNetIncome || 0)}
                            </p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-[11px] font-semibold rounded-full ${
                            hasAnySplit(song) ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}>
                            {hasAnySplit(song) ? "Yes" : "No"}
                          </span>
                        </Link>
                      ))
                    : groupAlbumsByTrackCount
                      ? groupedAlbums.flatMap(([trackCount, albumsInGroup]) => [
                          <div key={`group-mobile-${trackCount}`} className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600">
                            {trackCount} canciones
                          </div>,
                          ...albumsInGroup.map((album: any) => (
                            <div key={`${album.upc}-${trackCount}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex-shrink-0 w-10 h-10">
                                {album?.coverImage || album?.image ? (
                                  <img src={album.coverImage || album.image} alt={album.albumTitle} className="w-10 h-10 rounded-lg object-cover" />
                                ) : album?.tracks?.[0]?.spotifyData?.album?.images?.[0]?.url ? (
                                  <img src={album.tracks[0].spotifyData.album.images[0].url} alt={album.albumTitle} className="w-10 h-10 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Disc size={18} className="text-purple-500" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link to={`/panel/album/upc/${album.upc}`} className="text-sm font-semibold text-gray-900 truncate block">{album.albumTitle}</Link>
                                <p className="text-xs text-gray-400">{album.artistName || "Unknown Artist"}</p>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); handleOpenOwnerSplitModal(album); }} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors">
                                <Crown size={12} />
                                Splits
                              </button>
                            </div>
                          )),
                        ])
                      : paginatedAlbums.map((album: any) => (
                          <div key={album.upc} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex-shrink-0 w-10 h-10">
                              {album?.coverImage || album?.image ? (
                                <img src={album.coverImage || album.image} alt={album.albumTitle} className="w-10 h-10 rounded-lg object-cover" />
                              ) : album?.tracks?.[0]?.spotifyData?.album?.images?.[0]?.url ? (
                                <img src={album.tracks[0].spotifyData.album.images[0].url} alt={album.albumTitle} className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                  <Disc size={18} className="text-purple-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/panel/album/upc/${album.upc}`} className="text-sm font-semibold text-gray-900 truncate block">{album.albumTitle}</Link>
                              <p className="text-xs text-gray-400">{album.artistName || "Unknown Artist"}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleOpenOwnerSplitModal(album); }} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors">
                              <Crown size={12} />
                              Splits
                            </button>
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
                        ? paginatedSongs.map((song: any) => {
                            const allSongLabels = getAllSongLabels(song);
                            const hasMultipleLabels = allSongLabels.length > 1;
                            return (
                              <tr key={song._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3">
                                  <Link to={`/panel/song/${song._id}`} className="flex items-center gap-3 group">
                                    <div className="flex-shrink-0 w-9 h-9">
                                      {song?.spotifyData?.album?.images?.[0]?.url ? (
                                        <img src={song.spotifyData.album.images[0].url} alt={song.trackTitle} className="w-9 h-9 rounded-lg object-cover" />
                                      ) : (
                                        <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                                          <MusicIcon size={16} className="text-orange-500" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-[13px] font-semibold text-gray-900 group-hover:text-orange-500 transition-colors truncate">{song.trackTitle}</p>
                                      <p className="text-[11px] text-gray-400 truncate">{song?.artistName || "Unknown Artist"}</p>
                                    </div>
                                  </Link>
                                </td>
                                <td className="px-6 py-3">
                                  <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ${hasAnySplit(song) ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {hasAnySplit(song) ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="px-6 py-3 text-[13px] text-gray-900">
                                  {song?.percetaje || "Not assigned"}
                                </td>
                                <td className="px-6 py-3">
                                  <div className="flex -space-x-2">
                                    {song?.collaborators?.length > 0 ? (
                                      <>
                                        {song.collaborators.slice(0, 3).map((collaborator: any, idx: number) => (
                                          <img key={idx} src={collaborator.image} alt={collaborator.name} className="w-7 h-7 rounded-full border-2 border-white" />
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
                                    <span className="text-[13px] text-gray-900 truncate max-w-[160px]">
                                      {song?.artisticLabel || "Unknown"}
                                    </span>
                                    {hasMultipleLabels && (
                                      <span
                                        className="inline-flex items-center gap-1 text-[11px] text-orange-500 font-medium"
                                        title={allSongLabels.join(", ")}
                                      >
                                        <Tags className="h-3 w-3 flex-shrink-0" />
                                        En {allSongLabels.length} labels
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
                                    onClick={() => handleOpenSongDetails(song)}
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
                              <tr key={`group-desktop-${trackCount}`} className="bg-gray-50 border-b border-gray-100">
                                <td colSpan={7} className="px-6 py-2 text-xs font-semibold text-gray-600">{trackCount} canciones</td>
                              </tr>,
                              ...albumsInGroup.map((album: any) => (
                                <tr key={`${album.upc}-${trackCount}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-3">
                                    <div className="flex items-center gap-3 group">
                                      <div className="flex-shrink-0 w-9 h-9">
                                        {album?.coverImage?.[0]?.[0]?.url ? (
                                          <img src={album.coverImage[0]?.[0]?.url} alt={album.albumTitle} className="w-9 h-9 rounded-lg object-cover" />
                                        ) : (
                                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <Disc size={16} className="text-purple-500" />
                                          </div>
                                        )}
                                      </div>
                                      <Link to={`/panel/album/upc/${album.upc}`} className="text-[13px] font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                                        {album.releaseTitle || album.albumTitle}
                                      </Link>
                                    </div>
                                  </td>
                                  <td className="px-6 py-3 text-[13px] text-gray-900">{album.artistName || "Unknown Artist"}</td>
                                  <td className="px-6 py-3 text-[13px] text-gray-900 font-mono">{album.upc || "N/A"}</td>
                                  <td className="px-6 py-3 text-[13px] text-gray-900">{album.artisticLabel || "Unknown"}</td>
                                  <td className="px-6 py-3 text-[13px] text-gray-900">{album.releaseDate ? new Date(album.releaseDate).toLocaleDateString() : "N/A"}</td>
                                  <td className="px-6 py-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                      Active
                                    </span>
                                  </td>
                                  <td className="px-6 py-3 text-center">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenOwnerSplitModal(album); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-semibold transition-colors">
                                      <Crown size={12} />
                                      Owner Splits
                                    </button>
                                  </td>
                                </tr>
                              )),
                            ])
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
                                        <Disc size={16} className="text-purple-500" />
                                      </div>
                                    )}
                                  </div>
                                  <Link to={`/panel/album/upc/${album.upc}`} className="text-[13px] font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
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
                                  ? new Date(album.releaseDate).toLocaleDateString()
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
                    Showing {currentData.length === 0 ? 0 : pageStart + 1}–{Math.min(pageEnd, currentData.length)} of {currentData.length} {mode}
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

      {isSongDetailsOpen && selectedSong && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">Song Details</h3>
              <button
                onClick={handleCloseSongDetails}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {selectedSongDetails?.spotifyData?.album?.images?.[0]?.url ||
                  selectedSong?.spotifyData?.album?.images?.[0]?.url ? (
                    <img
                      src={
                        selectedSongDetails?.spotifyData?.album?.images?.[0]?.url ||
                        selectedSong?.spotifyData?.album?.images?.[0]?.url ||
                        ""
                      }
                      alt={selectedSongDetails?.trackTitle || selectedSong?.trackTitle || "Song cover"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MusicIcon size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {getSongField("trackTitle", "title") || "Sin título"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {getSongField("artistName", "artist") || "Artista desconocido"}
                  </p>
                </div>
              </div>

              {isSongDetailsLoading ? (
                <div className="text-sm text-gray-500">Loading details...</div>
              ) : (
                
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                        ISRC
                      </p>
                      <p className="text-sm font-semibold text-gray-900 font-mono truncate">
                        {getSongField("isrc") || "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                        UPC / EAN
                      </p>
                      <p className="text-sm font-semibold text-gray-900 font-mono truncate">
                        {getSongField("upc", "ean") ||
                          songDetailsSource?.releases?.[0]?.upc ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                      <p className="text-[11px] text-green-700 uppercase tracking-wide">
                        Splits asignados
                      </p>
                      <p className="text-lg font-bold text-green-700">
                        {getAssignedSplitsCount()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
                      <p className="text-[11px] text-orange-700 uppercase tracking-wide">
                        Splits no asignados
                      </p>
                      <p className="text-lg font-bold text-orange-700">
                        {getUnassignedSplitsCount()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      Información de la canción
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                          Release date
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getReleaseDate()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                          Releases
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getReleasesCount()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                          Streams
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getStreamsLabel()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                          Ganancia
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ${getEarningsLabel()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                          Sello
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getSongField("artisticLabel", "label") || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                          Duración
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getDuration()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!!songDetailsError && (
                    <p className="text-xs text-red-600">{songDetailsError}</p>
                  )}
                </div>
              )}

              <button
                onClick={() => navigate(`/panel/song/${selectedSong._id}`)}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Ver información completa
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Filter Drawer Overlay */}
      {showFilterPanel && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setShowFilterPanel(false)}
        />
      )}

      {/* Filter Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          showFilterPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={18} className="text-gray-700" />
            <h3 className="text-base font-bold text-gray-900">Filtros</h3>
          </div>
          <button
            onClick={() => setShowFilterPanel(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          {/* Sort */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Ordenar por</p>
            <div className="space-y-2">
              {([
                { value: "alpha", label: "Nombre (A–Z)" },
                { value: "revenue", label: "Mayores ganancias" },
                { value: "streams", label: "Más streams" },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                    sortBy === value
                      ? "border-orange-200 bg-orange-50 text-orange-700 font-semibold"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sortBy === value ? "border-orange-500" : "border-gray-300"}`}>
                    {sortBy === value && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Split filter */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Estado de Split</p>
            <div className="space-y-2">
              {([
                { value: "all", label: "Todos" },
                { value: "with_split", label: "Con split asignado" },
                { value: "without_split", label: "Sin split" },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSplitFilter(value)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                    splitFilter === value
                      ? "border-orange-200 bg-orange-50 text-orange-700 font-semibold"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${splitFilter === value ? "border-orange-500" : "border-gray-300"}`}>
                    {splitFilter === value && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Artist */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Artista</p>
            <input
              type="text"
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
              placeholder="Filtrar por nombre de artista"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* ISRC / UPC */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {mode === "songs" ? "ISRC" : "UPC"}
            </p>
            {mode === "songs" ? (
              <input
                type="text"
                value={isrcFilter}
                onChange={(e) => setIsrcFilter(e.target.value)}
                placeholder="Filtrar por ISRC"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <input
                type="text"
                value={upcFilter}
                onChange={(e) => setUpcFilter(e.target.value)}
                placeholder="Filtrar por UPC"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            )}
          </div>

          {/* Albums: group by track count */}
          {mode === "albums" && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Álbumes</p>
              <button
                onClick={() => setGroupAlbumsByTrackCount((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
                  groupAlbumsByTrackCount
                    ? "border-orange-200 bg-orange-50 text-orange-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>Agrupar por nº canciones</span>
                <span className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${groupAlbumsByTrackCount ? "bg-orange-500" : "bg-gray-300"}`}>
                  <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${groupAlbumsByTrackCount ? "translate-x-4" : "translate-x-0"}`} />
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer — solo visible si hay filtros activos */}
        {activeFilterCount > 0 && (
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={() => {
                setSortBy("alpha");
                setSplitFilter("all");
                setArtistFilter("");
                setIsrcFilter("");
                setUpcFilter("");
                setGroupAlbumsByTrackCount(false);
              }}
              className="w-full py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar todos los filtros ({activeFilterCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
