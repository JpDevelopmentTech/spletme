import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UseSongs from "@/hooks/useSongs";
import useDebounce from "@/hooks/useDebounce";
import SongService from "@/services/songs";
import type { SongsListParams } from "@/services/songs";
import { looksLikeISRC, looksLikeUPC } from "@/utils/music.utils";
import type {
  SortBy,
  SplitFilter,
  CollaboratorsFilter,
  OwnerSplitFilter,
  SongItem,
} from "@/types/music.types";

/** Tamaño de página inicial; el usuario lo cambia desde la barra de paginación. */
const DEFAULT_LIMIT = 10;

/**
 * Estado, búsqueda, filtros y paginación de la sección de canciones.
 *
 * Todo lo que decide QUÉ se ve —el orden, los filtros, el trozo del catálogo—
 * viaja al servidor y vuelve resuelto. Aquí no se filtra ni se ordena nada:
 * hacerlo sobre la página recibida reacomodaba diez filas y dejaba el resto del
 * catálogo como estaba, y de paso hacía que el contador y el botón de
 * «siguiente» hablaran de lo que se veía en vez de lo que hay.
 */
export function useSongsLibrary() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSongDetailsOpen, setIsSongDetailsOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongItem | null>(null);
  const [selectedSongDetails, setSelectedSongDetails] = useState<SongItem | null>(null);
  const [isSongDetailsLoading, setIsSongDetailsLoading] = useState(false);
  const [songDetailsError, setSongDetailsError] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("alpha");
  const [splitFilter, setSplitFilter] = useState<SplitFilter>("all");
  const [collaboratorsFilter, setCollaboratorsFilter] = useState<CollaboratorsFilter>("all");
  const [ownerSplitFilter, setOwnerSplitFilter] = useState<OwnerSplitFilter>("all");
  const [artistFilter, setArtistFilter] = useState("");
  const [isrcFilter, setIsrcFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [percentageMin, setPercentageMin] = useState("");
  const [percentageMax, setPercentageMax] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  // Cualquier cambio de filtro, de orden o de tamaño de página cambia de qué
  // conjunto se está mirando: seguir en la página 7 de otro conjunto no
  // significa nada, así que se vuelve a la primera.
  //
  // El reajuste ocurre durante el render y no en un efecto a propósito: en un
  // efecto se llegaría a pedir la página 7 del conjunto nuevo antes de volver a
  // la 1, es decir, una petición de más en cada pulsación del filtro.
  const filtersKey = [
    limit,
    debouncedSearchQuery.trim(),
    sortBy,
    splitFilter,
    collaboratorsFilter,
    ownerSplitFilter,
    artistFilter.trim(),
    isrcFilter.trim(),
    countryFilter.trim(),
    dateFrom,
    dateTo,
    percentageMin,
    percentageMax,
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
   *
   * Un término con forma de ISRC o de UPC se manda como código y no como texto
   * libre: quien pega un ISRC busca esa canción, no las que lo mencionan.
   */
  const params = useMemo<SongsListParams>(() => {
    const query = debouncedSearchQuery.trim();
    const isCode = Boolean(query) && (looksLikeISRC(query) || looksLikeUPC(query));

    const next: SongsListParams = { page, limit, sortBy };

    if (query) {
      if (isCode) next.code = query;
      else next.q = query;
    }
    if (artistFilter.trim()) next.artist = artistFilter.trim();
    if (isrcFilter.trim()) next.isrc = isrcFilter.trim();
    if (countryFilter.trim()) next.country = countryFilter.trim();
    if (dateFrom) next.dateFrom = dateFrom;
    if (dateTo) next.dateTo = dateTo;
    if (splitFilter !== "all") next.hasSplits = splitFilter === "with_split";
    if (collaboratorsFilter !== "all") {
      next.hasCollaborators = collaboratorsFilter === "with_collaborators";
    }
    if (ownerSplitFilter !== "all") {
      next.hasOwnerSplit = ownerSplitFilter === "with_owner_split";
    }
    if (percentageMin !== "") next.percentageMin = Number(percentageMin);
    if (percentageMax !== "") next.percentageMax = Number(percentageMax);

    return next;
  }, [
    page,
    limit,
    sortBy,
    debouncedSearchQuery,
    artistFilter,
    isrcFilter,
    countryFilter,
    dateFrom,
    dateTo,
    splitFilter,
    collaboratorsFilter,
    ownerSplitFilter,
    percentageMin,
    percentageMax,
  ]);

  const { songs, loading, pagination, hasLoaded, getSongs, uploadSongs } = UseSongs(params);

  // Paginación: sale entera de la respuesta. El cliente no puede deducirla —una
  // página de diez no dice cuántas hay detrás—, y cuando lo intentaba dejaba el
  // «siguiente» habilitado hasta chocar con una página vacía.
  const totalItems = pagination?.total ?? 0;
  const knownTotalPages = pagination?.totalPages ?? null;
  const safePage = pagination?.page ?? page;
  const pageStart = (safePage - 1) * limit;
  const pageEnd = pageStart + songs.length;
  const canGoNext = pagination?.hasMore ?? false;

  // Si el conjunto encogió por debajo de la página en la que estabas —al
  // recargar tras borrar, por ejemplo—, se retrocede a la última que existe en
  // lugar de dejar la tabla en blanco.
  useEffect(() => {
    if (knownTotalPages && page > knownTotalPages) setPage(knownTotalPages);
  }, [knownTotalPages, page]);

  // Handlers
  const handleFileSelect = async (file: File) => {
    const formData = new FormData();
    formData.append("csvFile", file);
    await uploadSongs(formData);
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
    setCollaboratorsFilter("all");
    setOwnerSplitFilter("all");
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
    collaboratorsFilter !== "all",
    ownerSplitFilter !== "all",
    artistFilter.trim() !== "",
    isrcFilter.trim() !== "",
    countryFilter.trim() !== "",
    dateFrom !== "",
    dateTo !== "",
    percentageMin !== "",
    percentageMax !== "",
  ].filter(Boolean).length;

  return {
    // state
    page,
    setPage,
    limit,
    setLimit,
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
    collaboratorsFilter,
    setCollaboratorsFilter,
    ownerSplitFilter,
    setOwnerSplitFilter,
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
    // computed
    initialLoading: !hasLoaded,
    loading,
    songs: songs as SongItem[],
    safePage,
    pageStart,
    pageEnd,
    canGoNext,
    knownTotalPages,
    totalItemsForDisplay: totalItems,
    activeFilterCount,
    // handlers
    refresh: getSongs,
    handleFileSelect,
    handleOpenSongDetails,
    handleCloseSongDetails,
    handleNavigateToSong,
    clearAllFilters,
  };
}
