import { useState, useEffect, useMemo } from "react";
import useAlbums from "@/hooks/useAlbums";
import useDebounce from "@/hooks/useDebounce";
import AlbumService from "@/services/albums";
import { hasAnySplit } from "@/utils/music.utils";
import type { SortBy, SplitFilter, AlbumItem } from "@/types/music.types";

/**
 * Centraliza el estado, efectos, filtros y paginación de la sección de álbumes.
 * Contiene únicamente la lógica de "albums", separada de la de canciones.
 */
export function useAlbumsLibrary() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AlbumItem[] | null>(null);
  const [isAlbumSearching, setIsAlbumSearching] = useState(false);
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("alpha");
  const [splitFilter, setSplitFilter] = useState<SplitFilter>("all");
  const [artistFilter, setArtistFilter] = useState("");
  const [upcFilter, setUpcFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [groupAlbumsByTrackCount, setGroupAlbumsByTrackCount] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  const {
    albums,
    loading: albumsLoading,
    pagination: albumsPagination,
    refreshAlbums,
  } = useAlbums(page, limit);

  // Detecta si hay filtros de cliente aplicados
  const albumFiltersApplied = Boolean(
    debouncedSearchQuery.trim() ||
    artistFilter.trim() ||
    upcFilter.trim() ||
    splitFilter !== "all" ||
    countryFilter.trim() ||
    dateFrom ||
    dateTo ||
    groupAlbumsByTrackCount,
  );

  // Búsqueda global en el backend: por título, release, artista, sello o UPC,
  // sobre todo el catálogo del usuario (no solo la página cargada en memoria).
  useEffect(() => {
    const q = debouncedSearchQuery.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }
    let cancelled = false;
    setIsAlbumSearching(true);
    AlbumService.searchAlbums(q, 0, 200).then((response) => {
      if (cancelled) return;
      setSearchResults(response.success && "data" in response ? (response.data as AlbumItem[]) : []);
      setIsAlbumSearching(false);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearchQuery]);

  // Resetea la página al cambiar cualquier filtro
  useEffect(() => {
    setPage(1);
  }, [
    limit,
    debouncedSearchQuery,
    sortBy,
    splitFilter,
    artistFilter,
    upcFilter,
    countryFilter,
    dateFrom,
    dateTo,
    groupAlbumsByTrackCount,
  ]);

  const normalize = (value: unknown) => String(value ?? "").toLowerCase();

  const getAlbumDate = (a: AlbumItem) =>
    (a as AlbumItem & { releaseDate?: string })?.releaseDate ?? "";

  const filteredAlbums = useMemo<AlbumItem[]>(() => {
    let list: AlbumItem[] = searchResults !== null ? searchResults : (albums as AlbumItem[]);
    if (artistFilter.trim()) {
      const artist = normalize(artistFilter.trim());
      list = list.filter((a) => normalize(a.artistName).includes(artist));
    }
    if (upcFilter.trim()) {
      const upc = normalize(upcFilter.trim());
      list = list.filter((a) => normalize(a.upc).includes(upc));
    }
    if (countryFilter.trim()) {
      const country = normalize(countryFilter.trim());
      list = list.filter((a) =>
        normalize((a as AlbumItem & { country?: string })?.country).includes(country),
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      list = list.filter((a) => {
        const d = getAlbumDate(a);
        return d ? new Date(d).getTime() >= from : true;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime();
      list = list.filter((a) => {
        const d = getAlbumDate(a);
        return d ? new Date(d).getTime() <= to : true;
      });
    }
    if (splitFilter !== "all")
      list = list.filter((a) => (splitFilter === "with_split" ? hasAnySplit(a) : !hasAnySplit(a)));
    if (sortBy === "alpha")
      list.sort((a, b) =>
        String(a?.releaseTitle ?? a?.albumTitle ?? "").localeCompare(
          String(b?.releaseTitle ?? b?.albumTitle ?? ""),
        ),
      );
    else if (sortBy === "title_desc")
      list.sort((a, b) =>
        String(b?.releaseTitle ?? b?.albumTitle ?? "").localeCompare(
          String(a?.releaseTitle ?? a?.albumTitle ?? ""),
        ),
      );
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
        (a, b) =>
          new Date(getAlbumDate(a) || 0).getTime() - new Date(getAlbumDate(b) || 0).getTime(),
      );
    else if (sortBy === "date_desc")
      list.sort(
        (a, b) =>
          new Date(getAlbumDate(b) || 0).getTime() - new Date(getAlbumDate(a) || 0).getTime(),
      );
    if (groupAlbumsByTrackCount)
      list.sort(
        (a, b) =>
          (b?.totalTracks ?? b?.tracks?.length ?? 0) - (a?.totalTracks ?? a?.tracks?.length ?? 0),
      );
    return list;
  }, [
    searchResults,
    albums,
    searchQuery,
    artistFilter,
    upcFilter,
    countryFilter,
    dateFrom,
    dateTo,
    splitFilter,
    sortBy,
    groupAlbumsByTrackCount,
  ]);

  // Paginación
  const knownTotalItems = albumFiltersApplied ? filteredAlbums.length : albumsPagination?.total;
  const knownTotalPages =
    knownTotalItems != null ? Math.max(1, Math.ceil(knownTotalItems / limit)) : null;
  const safePage = knownTotalPages ? Math.min(page, knownTotalPages) : page;
  const pageStart = (safePage - 1) * limit;
  const displayAlbums = useMemo(
    () => filteredAlbums.slice(pageStart, pageStart + limit),
    [filteredAlbums, pageStart, limit],
  );
  const groupedAlbums = useMemo(() => {
    if (!groupAlbumsByTrackCount) return [] as [number, AlbumItem[]][];
    const groups = new Map<number, AlbumItem[]>();
    displayAlbums.forEach((album) => {
      const count = album?.totalTracks ?? album?.tracks?.length ?? 0;
      groups.set(count, [...(groups.get(count) ?? []), album]);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [groupAlbumsByTrackCount, displayAlbums]);
  const currentData = displayAlbums;
  const currentPageItems = currentData.length;
  const pageEnd = pageStart + currentPageItems;
  const hasMoreFromApi = albumsPagination?.hasMore;
  const hasMoreFallback = !albumFiltersApplied && currentPageItems > 0;
  const canGoNext = knownTotalPages
    ? safePage < knownTotalPages
    : (hasMoreFromApi ?? hasMoreFallback);
  const totalItemsForDisplay =
    knownTotalItems ?? Math.max(pageStart + currentPageItems, currentData.length);

  // Handlers
  const handleOpenOwnerSplitModal = (album: AlbumItem) => {
    setSelectedAlbum(album);
    setIsOwnerSplitModalOpen(true);
  };

  const clearAllFilters = () => {
    setSortBy("alpha");
    setSplitFilter("all");
    setArtistFilter("");
    setUpcFilter("");
    setCountryFilter("");
    setDateFrom("");
    setDateTo("");
    setGroupAlbumsByTrackCount(false);
  };

  const activeFilterCount = [
    sortBy !== "alpha",
    splitFilter !== "all",
    artistFilter.trim() !== "",
    upcFilter.trim() !== "",
    countryFilter.trim() !== "",
    dateFrom !== "",
    dateTo !== "",
    groupAlbumsByTrackCount,
  ].filter(Boolean).length;

  const loading = albumsLoading;
  const initialLoading = albumsLoading && albums.length === 0 && searchResults === null;

  return {
    // state
    page,
    setPage,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    isAlbumSearching,
    isOwnerSplitModalOpen,
    setIsOwnerSplitModalOpen,
    selectedAlbum,
    setSelectedAlbum,
    sortBy,
    setSortBy,
    splitFilter,
    setSplitFilter,
    artistFilter,
    setArtistFilter,
    upcFilter,
    setUpcFilter,
    countryFilter,
    setCountryFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    groupAlbumsByTrackCount,
    setGroupAlbumsByTrackCount,
    showFilterPanel,
    setShowFilterPanel,
    // computed
    initialLoading,
    loading,
    filteredAlbums,
    displayAlbums,
    groupedAlbums,
    currentData,
    safePage,
    pageStart,
    pageEnd,
    canGoNext,
    knownTotalPages,
    totalItemsForDisplay,
    activeFilterCount,
    // handlers
    handleOpenOwnerSplitModal,
    clearAllFilters,
    refreshAlbums,
  };
}
