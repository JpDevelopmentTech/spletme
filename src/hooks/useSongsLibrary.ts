import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UseSongs from "@/hooks/useSongs";
import useDebounce from "@/hooks/useDebounce";
import { useLabels } from "@/hooks/useLabels";
import SongService from "@/services/songs";
import { hasAnySplit, looksLikeISRC, looksLikeUPC } from "@/utils/music.utils";
import type { SortBy, SplitFilter, SongItem } from "@/types/music.types";

/**
 * Centraliza el estado, efectos, filtros y paginación de la sección de canciones.
 * Contiene únicamente la lógica de "songs", separada de la de álbumes.
 */
export function useSongsLibrary() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSongDetailsOpen, setIsSongDetailsOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [selectedSongDetails, setSelectedSongDetails] = useState<SongItem | null>(null);
  const [isSongDetailsLoading, setIsSongDetailsLoading] = useState(false);
  const [songDetailsError, setSongDetailsError] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("alpha");
  const [splitFilter, setSplitFilter] = useState<SplitFilter>("all");
  const [artistFilter, setArtistFilter] = useState("");
  const [isrcFilter, setIsrcFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [percentageMin, setPercentageMin] = useState("");
  const [percentageMax, setPercentageMax] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterResults, setFilterResults] = useState<SongItem[]>([]);
  const [filterPagination, setFilterPagination] = useState<{
    total?: number;
    hasMore?: boolean;
    totalPages?: number;
  } | null>(null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 600);

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
    hasLoaded: songsHasLoaded,
  } = UseSongs(page, limit);

  const { customLabels } = useLabels();

  // Búsqueda reactiva según el query (texto libre o código ISRC/UPC)
  useEffect(() => {
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
  }, [debouncedSearchQuery, searchSongs, clearSearch, searchSongsByCode]);

  // Llama al endpoint /songs/filter cuando hay filtros de servidor activos
  useEffect(() => {
    const serverActive = Boolean(
      countryFilter.trim() ||
      dateFrom ||
      dateTo ||
      splitFilter !== "all" ||
      percentageMin !== "" ||
      percentageMax !== "",
    );
    if (!serverActive) {
      setFilterResults([]);
      setFilterPagination(null);
      return;
    }
    setIsFilterLoading(true);
    const params: Record<string, unknown> = { page, limit };
    if (splitFilter === "with_split") params.hasSplits = true;
    else if (splitFilter === "without_split") params.hasSplits = false;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    if (countryFilter.trim()) params.country = countryFilter.trim();
    if (percentageMin !== "") params.percentageMin = Number(percentageMin);
    if (percentageMax !== "") params.percentageMax = Number(percentageMax);
    SongService.filterSongs(params)
      .then((response) => {
        const result = response?.data?.songs ?? response?.data ?? [];
        setFilterResults(Array.isArray(result) ? result : []);
        setFilterPagination(response?.data?.pagination ?? response?.pagination ?? null);
      })
      .catch(() => {
        setFilterResults([]);
        setFilterPagination(null);
      })
      .finally(() => {
        setIsFilterLoading(false);
      });
  }, [
    page,
    limit,
    splitFilter,
    countryFilter,
    dateFrom,
    dateTo,
    percentageMin,
    percentageMax,
  ]);

  // Resetea la página al cambiar cualquier filtro
  useEffect(() => {
    setPage(1);
  }, [
    limit,
    debouncedSearchQuery,
    sortBy,
    splitFilter,
    artistFilter,
    isrcFilter,
    countryFilter,
    dateFrom,
    dateTo,
    percentageMin,
    percentageMax,
  ]);

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
    const sources = [
      song?.artisticLabel,
      song?.label,
      song?.labels,
      song?.customLabels,
      song?.labelNames,
      song?.otherLabels,
    ];
    const directLabels = Array.from(
      new Set(
        sources.flatMap((src) => {
          if (Array.isArray(src))
            return src.map(getLabelName).filter((l): l is string => Boolean(l));
          const single = getLabelName(src);
          return single ? [single] : [];
        }),
      ),
    );
    const normalizedDirect = new Set(directLabels.map((l) => l.trim().toLowerCase()));
    const fromCustomLabels = customLabels
      .filter((cl) =>
        cl.artisticLabels?.some((al: string) => normalizedDirect.has(al.trim().toLowerCase())),
      )
      .map((cl) => cl.name);
    return Array.from(new Set([...directLabels, ...fromCustomLabels]));
  };

  const normalize = (value: unknown) => String(value ?? "").toLowerCase();

  const getSongDate = (s: SongItem) =>
    s?.releaseDate ?? s?.release_date ?? s?.releasedAt ?? s?.release ?? "";

  const filteredSongs = useMemo<SongItem[]>(() => {
    const serverActive = Boolean(
      countryFilter.trim() ||
      dateFrom ||
      dateTo ||
      splitFilter !== "all" ||
      percentageMin !== "" ||
      percentageMax !== "",
    );
    let list: SongItem[];
    if (serverActive) {
      list = [...filterResults];
    } else {
      list = [
        ...(debouncedSearchQuery.trim() ? (searchResults as SongItem[]) : (songs as SongItem[])),
      ];
      if (splitFilter === "with_split") list = list.filter(hasAnySplit);
      else if (splitFilter === "without_split") list = list.filter((s) => !hasAnySplit(s));
      if (countryFilter.trim()) {
        const country = normalize(countryFilter.trim());
        list = list.filter((s) => normalize(s?.country).includes(country));
      }
      if (dateFrom) {
        const from = new Date(dateFrom).getTime();
        list = list.filter((s) => {
          const d = getSongDate(s);
          return d ? new Date(d).getTime() >= from : true;
        });
      }
      if (dateTo) {
        const to = new Date(dateTo).getTime();
        list = list.filter((s) => {
          const d = getSongDate(s);
          return d ? new Date(d).getTime() <= to : true;
        });
      }
    }
    if (artistFilter.trim()) {
      const artist = normalize(artistFilter.trim());
      list = list.filter((s) => normalize(s?.artistName).includes(artist));
    }
    if (isrcFilter.trim()) {
      const isrc = normalize(isrcFilter.trim());
      list = list.filter((s) => normalize(s?.isrc).includes(isrc));
    }
    if (sortBy === "alpha")
      list.sort((a, b) => String(a?.trackTitle ?? "").localeCompare(String(b?.trackTitle ?? "")));
    else if (sortBy === "title_desc")
      list.sort((a, b) => String(b?.trackTitle ?? "").localeCompare(String(a?.trackTitle ?? "")));
    else if (sortBy === "revenue")
      list.sort((a, b) => (b?.totalNetIncome ?? 0) - (a?.totalNetIncome ?? 0));
    else if (sortBy === "streams")
      list.sort((a, b) => (b?.totalStreams ?? 0) - (a?.totalStreams ?? 0));
    else if (sortBy === "artist_asc")
      list.sort((a, b) => String(a?.artistName ?? "").localeCompare(String(b?.artistName ?? "")));
    else if (sortBy === "artist_desc")
      list.sort((a, b) => String(b?.artistName ?? "").localeCompare(String(a?.artistName ?? "")));
    else if (sortBy === "label_asc")
      list.sort((a, b) =>
        String(a?.artisticLabel ?? "").localeCompare(String(b?.artisticLabel ?? "")),
      );
    else if (sortBy === "label_desc")
      list.sort((a, b) =>
        String(b?.artisticLabel ?? "").localeCompare(String(a?.artisticLabel ?? "")),
      );
    else if (sortBy === "date_asc")
      list.sort(
        (a, b) => new Date(getSongDate(a) || 0).getTime() - new Date(getSongDate(b) || 0).getTime(),
      );
    else if (sortBy === "date_desc")
      list.sort(
        (a, b) => new Date(getSongDate(b) || 0).getTime() - new Date(getSongDate(a) || 0).getTime(),
      );
    else if (sortBy === "percentage_asc")
      list.sort((a, b) => (a?.percetaje ?? 0) - (b?.percetaje ?? 0));
    else if (sortBy === "percentage_desc")
      list.sort((a, b) => (b?.percetaje ?? 0) - (a?.percetaje ?? 0));
    else if (sortBy === "collaborators_asc")
      list.sort((a, b) => (a?.collaborators?.length ?? 0) - (b?.collaborators?.length ?? 0));
    else if (sortBy === "collaborators_desc")
      list.sort((a, b) => (b?.collaborators?.length ?? 0) - (a?.collaborators?.length ?? 0));
    else if (sortBy === "split_desc")
      list.sort((a, b) => (hasAnySplit(b) ? 1 : 0) - (hasAnySplit(a) ? 1 : 0));
    else if (sortBy === "split_asc")
      list.sort((a, b) => (hasAnySplit(a) ? 1 : 0) - (hasAnySplit(b) ? 1 : 0));
    return list;
  }, [
    debouncedSearchQuery,
    searchResults,
    songs,
    splitFilter,
    artistFilter,
    isrcFilter,
    countryFilter,
    dateFrom,
    dateTo,
    percentageMin,
    percentageMax,
    sortBy,
    filterResults,
  ]);

  // Paginación
  const isServerFilterActive = Boolean(
    countryFilter.trim() ||
    dateFrom ||
    dateTo ||
    splitFilter !== "all" ||
    percentageMin !== "" ||
    percentageMax !== "",
  );
  const songFiltersApplied = Boolean(
    debouncedSearchQuery.trim() || artistFilter.trim() || isrcFilter.trim() || isServerFilterActive,
  );
  const knownTotalItems = isServerFilterActive
    ? (filterPagination?.total ?? filteredSongs.length)
    : songFiltersApplied
      ? filteredSongs.length
      : songsPagination?.total;
  const knownTotalPages =
    knownTotalItems != null ? Math.max(1, Math.ceil(knownTotalItems / limit)) : null;
  const safePage = knownTotalPages ? Math.min(page, knownTotalPages) : page;
  const pageStart = (safePage - 1) * limit;
  const currentData = filteredSongs;
  const currentPageItems = currentData.length;
  const pageEnd = pageStart + currentPageItems;
  const hasMoreFromApi = isServerFilterActive
    ? filterPagination?.hasMore
    : songsPagination?.hasMore;
  const hasMoreFallback = !songFiltersApplied && currentPageItems > 0;
  const canGoNext = knownTotalPages
    ? safePage < knownTotalPages
    : (hasMoreFromApi ?? hasMoreFallback);
  const totalItemsForDisplay =
    knownTotalItems ?? Math.max(pageStart + currentPageItems, currentData.length);

  // Handlers
  const handleFileSelect = async (file: File) => {
    const formData = new FormData();
    formData.append("csvFile", file);
    await uploadSongs(formData);
    setIsModalOpen(false);
    getSongs();
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
    setCountryFilter("");
    setDateFrom("");
    setDateTo("");
    setPercentageMin("");
    setPercentageMax("");
  };

  const activeFilterCount = [
    sortBy !== "alpha",
    splitFilter !== "all",
    artistFilter.trim() !== "",
    isrcFilter.trim() !== "",
    countryFilter.trim() !== "",
    dateFrom !== "",
    dateTo !== "",
    percentageMin !== "",
    percentageMax !== "",
  ].filter(Boolean).length;

  const initialLoading = !songsHasLoaded;
  const loading = songsLoading || isSearching || isFilterLoading;

  return {
    // state
    page,
    setPage,
    limit,
    setLimit,
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    setSearchQuery,
    isSongDetailsOpen,
    selectedSong,
    selectedSongDetails,
    isSongDetailsLoading,
    songDetailsError,
    sortBy,
    setSortBy,
    splitFilter,
    setSplitFilter,
    artistFilter,
    setArtistFilter,
    isrcFilter,
    setIsrcFilter,
    countryFilter,
    setCountryFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    percentageMin,
    setPercentageMin,
    percentageMax,
    setPercentageMax,
    showFilterPanel,
    setShowFilterPanel,
    // computed
    initialLoading,
    loading,
    filteredSongs,
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
    handleOpenSongDetails,
    handleCloseSongDetails,
    handleNavigateToSong,
    clearAllFilters,
    isSearching,
  };
}
