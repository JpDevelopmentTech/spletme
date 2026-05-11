import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UseSongs from "@/hooks/useSongs";
import useAlbums from "@/hooks/useAlbums";
import useDebounce from "@/hooks/useDebounce";
import { useLabels } from "@/hooks/useLabels";
import SongService from "@/services/songs";
import {
  hasAnySplit,
  looksLikeISRC,
  looksLikeUPC,
} from "@/utils/music.utils";
import type { MusicMode, SortBy, SplitFilter, SongItem, AlbumItem } from "@/types/music.types";

/**
 * Centraliza el estado, efectos, filtros y paginación de la biblioteca musical.
 * Separa toda la lógica del componente visual Music.
 */
export function useMusicLibrary() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<MusicMode>("songs");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [albumSearchResult, setAlbumSearchResult] = useState<AlbumItem | null>(null);
  const [isAlbumSearching, setIsAlbumSearching] = useState(false);
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null);
  const [isSongDetailsOpen, setIsSongDetailsOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [selectedSongDetails, setSelectedSongDetails] = useState<SongItem | null>(null);
  const [isSongDetailsLoading, setIsSongDetailsLoading] = useState(false);
  const [songDetailsError, setSongDetailsError] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("alpha");
  const [splitFilter, setSplitFilter] = useState<SplitFilter>("all");
  const [artistFilter, setArtistFilter] = useState("");
  const [isrcFilter, setIsrcFilter] = useState("");
  const [upcFilter, setUpcFilter] = useState("");
  const [groupAlbumsByTrackCount, setGroupAlbumsByTrackCount] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    songs,
    uploadSongs,
    loading: songsLoading,
    pagination: songsPagination,
    getSongs,
    searchSongs,
    searchSongsByCode,
    searchResults,
    isSearching,
    clearSearch,
  } = UseSongs(page, limit);

  const {
    albums,
    loading: albumsLoading,
    pagination: albumsPagination,
    getAlbumByUPC,
    refreshAlbums,
  } = useAlbums(0, 1000);

  const { customLabels } = useLabels();

  // Búsqueda reactiva según modo y query
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
        getAlbumByUPC(q.replace(/\s|-/g, "")).then((result) => {
          setAlbumSearchResult(result as AlbumItem);
          setIsAlbumSearching(false);
        });
      } else {
        setAlbumSearchResult(null);
      }
    }
  }, [debouncedSearchQuery, mode, searchSongs, clearSearch, searchSongsByCode, getAlbumByUPC]);

  // Al cambiar a modo álbumes, limpia búsqueda y recarga
  useEffect(() => {
    if (mode === "albums") {
      clearSearch();
      setSearchQuery("");
      setAlbumSearchResult(null);
      refreshAlbums();
    }
  }, [mode, clearSearch, refreshAlbums]);

  // Resetea la página al cambiar cualquier filtro
  useEffect(() => {
    setPage(1);
  }, [mode, limit, debouncedSearchQuery, sortBy, splitFilter, artistFilter, isrcFilter, upcFilter, groupAlbumsByTrackCount]);

  const getLabelName = (value: unknown): string | null => {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const candidate = obj.name ?? obj.label ?? obj.artisticLabel ?? obj.title;
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    }
    return null;
  };

  const getAllSongLabels = (song: SongItem): string[] => {
    const sources = [song?.artisticLabel, song?.label, song?.labels, song?.customLabels, song?.labelNames, song?.otherLabels];
    const directLabels = Array.from(new Set(
      sources.flatMap((src) => {
        if (Array.isArray(src)) return src.map(getLabelName).filter((l): l is string => Boolean(l));
        const single = getLabelName(src);
        return single ? [single] : [];
      })
    ));
    const normalizedDirect = new Set(directLabels.map((l) => l.trim().toLowerCase()));
    const fromCustomLabels = customLabels
      .filter((cl) => cl.artisticLabels?.some((al: string) => normalizedDirect.has(al.trim().toLowerCase())))
      .map((cl) => cl.name);
    return Array.from(new Set([...directLabels, ...fromCustomLabels]));
  };

  const normalize = (value: unknown) => String(value ?? "").toLowerCase();

  const filteredSongs = useMemo<SongItem[]>(() => {
    let list = [...(debouncedSearchQuery.trim() && mode === "songs" ? (searchResults as SongItem[]) : (songs as SongItem[]))];
    if (splitFilter === "with_split") list = list.filter(hasAnySplit);
    else if (splitFilter === "without_split") list = list.filter((s) => !hasAnySplit(s));
    if (artistFilter.trim()) {
      const artist = normalize(artistFilter.trim());
      list = list.filter((s) => normalize(s?.artistName).includes(artist));
    }
    if (isrcFilter.trim()) {
      const isrc = normalize(isrcFilter.trim());
      list = list.filter((s) => normalize(s?.isrc).includes(isrc));
    }
    if (sortBy === "alpha") list.sort((a, b) => String(a?.trackTitle ?? "").localeCompare(String(b?.trackTitle ?? "")));
    else if (sortBy === "revenue") list.sort((a, b) => (b?.totalNetIncome ?? 0) - (a?.totalNetIncome ?? 0));
    else if (sortBy === "streams") list.sort((a, b) => (b?.totalStreams ?? 0) - (a?.totalStreams ?? 0));
    return list;
  }, [debouncedSearchQuery, mode, searchResults, songs, splitFilter, artistFilter, isrcFilter, sortBy]);

  const filteredAlbums = useMemo<AlbumItem[]>(() => {
    let list: AlbumItem[] = albumSearchResult
      ? [albumSearchResult]
      : (albums as AlbumItem[]).filter(
          (album) =>
            normalize(album.albumTitle).includes(normalize(searchQuery)) ||
            normalize(album.artistName).includes(normalize(searchQuery)) ||
            normalize(album.artisticLabel).includes(normalize(searchQuery)),
        );
    if (artistFilter.trim()) {
      const artist = normalize(artistFilter.trim());
      list = list.filter((a) => normalize(a.artistName).includes(artist));
    }
    if (upcFilter.trim()) {
      const upc = normalize(upcFilter.trim());
      list = list.filter((a) => normalize(a.upc).includes(upc));
    }
    if (splitFilter !== "all") list = list.filter((a) => splitFilter === "with_split" ? hasAnySplit(a) : !hasAnySplit(a));
    if (sortBy === "alpha") list.sort((a, b) => String(a?.releaseTitle ?? a?.albumTitle ?? "").localeCompare(String(b?.releaseTitle ?? b?.albumTitle ?? "")));
    else if (sortBy === "revenue") list.sort((a, b) => (b?.totalNetIncome ?? 0) - (a?.totalNetIncome ?? 0));
    else if (sortBy === "streams") list.sort((a, b) => (b?.totalStreams ?? 0) - (a?.totalStreams ?? 0));
    if (groupAlbumsByTrackCount) list.sort((a, b) => (b?.totalTracks ?? b?.tracks?.length ?? 0) - (a?.totalTracks ?? a?.tracks?.length ?? 0));
    return list;
  }, [albumSearchResult, albums, searchQuery, artistFilter, upcFilter, splitFilter, sortBy, groupAlbumsByTrackCount]);

  const groupedAlbums = useMemo(() => {
    if (!groupAlbumsByTrackCount || mode !== "albums") return [];
    const groups = new Map<number, AlbumItem[]>();
    filteredAlbums.forEach((album) => {
      const count = album?.totalTracks ?? album?.tracks?.length ?? 0;
      groups.set(count, [...(groups.get(count) ?? []), album]);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [groupAlbumsByTrackCount, mode, filteredAlbums]);

  // Paginación
  const songFiltersApplied = Boolean(debouncedSearchQuery.trim() || artistFilter.trim() || isrcFilter.trim() || splitFilter !== "all");
  const albumFiltersApplied = Boolean(debouncedSearchQuery.trim() || artistFilter.trim() || upcFilter.trim() || splitFilter !== "all" || albumSearchResult);
  const currentData = mode === "songs" ? filteredSongs : filteredAlbums;
  const currentPageItems = currentData.length;
  const knownTotalItems = mode === "songs"
    ? (songFiltersApplied ? filteredSongs.length : songsPagination?.total)
    : (albumFiltersApplied ? filteredAlbums.length : albumsPagination?.total);
  const knownTotalPages = knownTotalItems != null ? Math.max(1, Math.ceil(knownTotalItems / limit)) : null;
  const safePage = knownTotalPages ? Math.min(page, knownTotalPages) : page;
  const pageStart = (safePage - 1) * limit;
  const pageEnd = pageStart + currentPageItems;
  const hasMoreFromApi = mode === "songs" ? songsPagination?.hasMore : albumsPagination?.hasMore;
  const hasMoreFallback = mode === "songs" ? (!songFiltersApplied && currentPageItems > 0) : (!albumFiltersApplied && currentPageItems > 0);
  const canGoNext = knownTotalPages ? safePage < knownTotalPages : (hasMoreFromApi ?? hasMoreFallback);
  const totalItemsForDisplay = knownTotalItems ?? Math.max(pageStart + currentPageItems, currentData.length);

  // Handlers
  const handleFileSelect = async (file: File) => {
    const formData = new FormData();
    formData.append("csvFile", file);
    await uploadSongs(formData);
    setIsModalOpen(false);
    getSongs();
  };

  const handleOpenOwnerSplitModal = (album: AlbumItem) => {
    setSelectedAlbum(album);
    setIsOwnerSplitModalOpen(true);
  };

  const handleOpenSongDetails = async (song: SongItem) => {
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
    setSelectedSongDetails(details as SongItem);
  };

  const handleCloseSongDetails = () => {
    setIsSongDetailsOpen(false);
    setSelectedSong(null);
    setSelectedSongDetails(null);
    setSongDetailsError("");
  };

  const handleNavigateToSong = (songId: string) => navigate(`/panel/song/${songId}`);

  const clearAllFilters = () => {
    setSortBy("alpha");
    setSplitFilter("all");
    setArtistFilter("");
    setIsrcFilter("");
    setUpcFilter("");
    setGroupAlbumsByTrackCount(false);
  };

  const activeFilterCount = [
    sortBy !== "alpha",
    splitFilter !== "all",
    artistFilter.trim() !== "",
    isrcFilter.trim() !== "",
    upcFilter.trim() !== "",
    groupAlbumsByTrackCount,
  ].filter(Boolean).length;

  const loading = mode === "songs" ? songsLoading || isSearching : albumsLoading;

  return {
    // state
    mode, setMode,
    page, setPage,
    limit, setLimit,
    isModalOpen, setIsModalOpen,
    searchQuery, setSearchQuery,
    isAlbumSearching,
    isOwnerSplitModalOpen, setIsOwnerSplitModalOpen,
    selectedAlbum, setSelectedAlbum,
    isSongDetailsOpen,
    selectedSong,
    selectedSongDetails,
    isSongDetailsLoading,
    songDetailsError,
    sortBy, setSortBy,
    splitFilter, setSplitFilter,
    artistFilter, setArtistFilter,
    isrcFilter, setIsrcFilter,
    upcFilter, setUpcFilter,
    groupAlbumsByTrackCount, setGroupAlbumsByTrackCount,
    showFilterPanel, setShowFilterPanel,
    // computed
    loading,
    filteredSongs,
    filteredAlbums,
    groupedAlbums,
    currentData,
    safePage,
    pageStart,
    pageEnd,
    canGoNext,
    knownTotalPages,
    totalItemsForDisplay,
    activeFilterCount,
    // helpers
    getAllSongLabels,
    // handlers
    handleFileSelect,
    handleOpenOwnerSplitModal,
    handleOpenSongDetails,
    handleCloseSongDetails,
    handleNavigateToSong,
    clearAllFilters,
    refreshAlbums,
    isSearching,
  };
}
