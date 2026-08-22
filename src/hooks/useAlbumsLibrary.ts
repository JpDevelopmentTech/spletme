import { useState, useEffect, useMemo } from "react";
import useAlbums from "@/hooks/useAlbums";
import useDebounce from "@/hooks/useDebounce";
import { looksLikeUPC } from "@/utils/music.utils";
import type { AlbumsListParams } from "@/models/album";
import type { SortBy, SplitFilter, AlbumItem } from "@/types/music.types";

/** Tamaño de página inicial; el usuario lo cambia desde la barra de paginación. */
const DEFAULT_LIMIT = 12;

/**
 * Estado, búsqueda, filtros y paginación de la sección de álbumes.
 *
 * Todo lo que decide QUÉ se ve —el orden, los filtros, el trozo del catálogo—
 * viaja al servidor y vuelve resuelto. Aquí no se filtra ni se ordena nada:
 * hacerlo sobre la página recibida reacomodaba doce filas y dejaba el resto del
 * catálogo como estaba.
 */
export function useAlbumsLibrary() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [searchQuery, setSearchQuery] = useState("");
  const [albumSearchResult, setAlbumSearchResult] = useState<AlbumItem | null>(null);
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

  const debouncedSearchQuery = useDebounce(searchQuery, 600);
  const trimmedSearchQuery = debouncedSearchQuery.trim();
  // Un UPC exacto identifica un álbum concreto y se resuelve por su propia vía
  // (getAlbumByUPC); el resto de términos van al listado como búsqueda libre.
  const isUpcSearch = Boolean(trimmedSearchQuery) && looksLikeUPC(trimmedSearchQuery);

  // Cualquier cambio de filtro, de orden o de tamaño de página cambia de qué
  // conjunto se está mirando: se vuelve a la primera página.
  //
  // El reajuste ocurre durante el render y no en un efecto a propósito: en un
  // efecto se llegaría a pedir la página 7 del conjunto nuevo antes de volver a
  // la 1, es decir, una petición de más en cada pulsación del filtro.
  const filtersKey = [
    limit,
    trimmedSearchQuery,
    sortBy,
    splitFilter,
    artistFilter.trim(),
    upcFilter.trim(),
    countryFilter.trim(),
    dateFrom,
    dateTo,
    groupAlbumsByTrackCount,
  ].join("|");
  const [appliedFiltersKey, setAppliedFiltersKey] = useState(filtersKey);

  if (appliedFiltersKey !== filtersKey) {
    setAppliedFiltersKey(filtersKey);
    setPage(1);
  }

  /**
   * La petición que describe la página. Se memoriza porque es la dependencia
   * que dispara la lectura: un objeto nuevo en cada render pediría el catálogo
   * en bucle.
   */
  const params = useMemo<AlbumsListParams | null>(() => {
    // Buscar por UPC devuelve un álbum concreto por su propia vía; pedir además
    // una página del listado sería traer un catálogo que nadie va a mirar.
    if (isUpcSearch) return null;

    const next: AlbumsListParams = {
      skip: (page - 1) * limit,
      limit,
      sortBy,
    };

    if (trimmedSearchQuery) next.search = trimmedSearchQuery;
    if (groupAlbumsByTrackCount) next.groupByTrackCount = true;
    if (artistFilter.trim()) next.artist = artistFilter.trim();
    if (upcFilter.trim()) next.upc = upcFilter.trim();
    if (countryFilter.trim()) next.country = countryFilter.trim();
    if (dateFrom) next.dateFrom = dateFrom;
    if (dateTo) next.dateTo = dateTo;
    if (splitFilter !== "all") next.hasSplits = splitFilter === "with_split";

    return next;
  }, [
    page,
    limit,
    sortBy,
    isUpcSearch,
    trimmedSearchQuery,
    groupAlbumsByTrackCount,
    artistFilter,
    upcFilter,
    countryFilter,
    dateFrom,
    dateTo,
    splitFilter,
  ]);

  const {
    albums,
    loading: albumsLoading,
    hasLoaded: albumsHasLoaded,
    pagination: albumsPagination,
    getAlbumByUPC,
    refreshAlbums,
  } = useAlbums(params);

  // Búsqueda por UPC: un álbum concreto, sin paginación que valga.
  useEffect(() => {
    if (!isUpcSearch) {
      setAlbumSearchResult(null);
      return;
    }

    setIsAlbumSearching(true);
    setAlbumSearchResult(null);
    getAlbumByUPC(trimmedSearchQuery.replace(/\s|-/g, "")).then((result) => {
      setAlbumSearchResult(result as AlbumItem);
      setIsAlbumSearching(false);
    });
  }, [isUpcSearch, trimmedSearchQuery, getAlbumByUPC]);

  const displayAlbums = useMemo<AlbumItem[]>(() => {
    if (isUpcSearch) return albumSearchResult ? [albumSearchResult] : [];
    return albums as AlbumItem[];
  }, [isUpcSearch, albumSearchResult, albums]);

  // Paginación: sale entera de la respuesta, salvo en la búsqueda por UPC, que
  // devuelve como mucho un álbum y no tiene detrás un conjunto que paginar.
  const totalItems = isUpcSearch ? displayAlbums.length : (albumsPagination?.total ?? 0);
  const knownTotalPages = isUpcSearch ? 1 : (albumsPagination?.totalPages ?? null);
  const safePage = isUpcSearch ? 1 : (albumsPagination?.page ?? page);
  const pageStart = (safePage - 1) * limit;
  const pageEnd = pageStart + displayAlbums.length;
  const canGoNext = isUpcSearch ? false : (albumsPagination?.hasMore ?? false);

  // Si el conjunto encogió por debajo de la página en la que estabas, se
  // retrocede a la última que existe en lugar de dejar la tabla en blanco.
  useEffect(() => {
    if (knownTotalPages && page > knownTotalPages) setPage(knownTotalPages);
  }, [knownTotalPages, page]);

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

  const loading = albumsLoading || isAlbumSearching;

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
    // computed
    initialLoading: isUpcSearch ? isAlbumSearching : !albumsHasLoaded,
    loading,
    displayAlbums,
    safePage,
    pageStart,
    pageEnd,
    canGoNext,
    knownTotalPages,
    totalItemsForDisplay: totalItems,
    activeFilterCount,
    // handlers
    handleOpenOwnerSplitModal,
    clearAllFilters,
    refreshAlbums,
  };
}
