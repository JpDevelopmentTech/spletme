import { useEffect } from "react";
import { ArrowUp, ArrowDown, SearchX, Music as MusicIcon, Disc3, CircleX } from "lucide-react";
import { SongRow } from "@/components/music/SongRow";
import { SongCard } from "@/components/music/SongCard";
import { SongDetailsModal } from "@/components/music/SongDetailsModal";
import { MusicPagination } from "@/components/music/MusicPagination";
import { MusicFilterDrawer } from "@/components/music/MusicFilterDrawer";
import { SONG_COLUMNS, SONGS_GRID, isDescending } from "@/components/music/songsColumns";
import { useSongsLibrary } from "@/hooks/useSongsLibrary";
import type { MusicLayout, SortBy } from "@/types/music.types";

interface SongsViewProps {
  query: string;
  onQueryChange: (value: string) => void;
  layout: MusicLayout;
  /** Abre el otro modo cuando aquí no hay nada que enseñar. */
  onSwitchToAlbums: () => void;
  onCountChange?: (total: number) => void;
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  onActiveFiltersChange?: (count: number) => void;
}

/** Criterio que aplica cada columna al pulsar su cabecera. */
const NEXT_SORT: Record<string, (current: SortBy) => SortBy> = {
  title: (current) => (current === "alpha" ? "title_desc" : "alpha"),
  streams: () => "streams",
  income: () => "revenue",
  collaborators: () => "collaborators_desc",
  percentage: (current) => (current === "percentage_desc" ? "percentage_asc" : "percentage_desc"),
};

/** El catálogo canción a canción: la lectura densa, para comparar cifras. */
export function SongsView({
  query,
  onQueryChange,
  layout,
  onSwitchToAlbums,
  onCountChange,
  filtersOpen,
  onFiltersOpenChange,
  onActiveFiltersChange,
}: SongsViewProps) {
  const library = useSongsLibrary();
  const {
    searchQuery,
    setSearchQuery,
    filteredSongs,
    currentData,
    loading,
    initialLoading,
    totalItemsForDisplay,
    activeFilterCount,
    sortBy,
    setSortBy,
  } = library;

  // La búsqueda vive en la página para que sobreviva al cambio de agrupación.
  useEffect(() => {
    if (query !== searchQuery) setSearchQuery(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (searchQuery !== query) onQueryChange(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    onCountChange?.(totalItemsForDisplay);
  }, [totalItemsForDisplay, onCountChange]);

  useEffect(() => {
    onActiveFiltersChange?.(activeFilterCount);
  }, [activeFilterCount, onActiveFiltersChange]);

  const drawer = (
    <MusicFilterDrawer
      isOpen={filtersOpen}
      mode="songs"
      sortBy={sortBy}
      splitFilter={library.splitFilter}
      artistFilter={library.artistFilter}
      isrcFilter={library.isrcFilter}
      upcFilter=""
      countryFilter={library.countryFilter}
      dateFrom={library.dateFrom}
      dateTo={library.dateTo}
      groupAlbumsByTrackCount={false}
      activeFilterCount={activeFilterCount}
      resultCount={totalItemsForDisplay}
      onClose={() => onFiltersOpenChange(false)}
      onSortChange={setSortBy}
      onSplitFilterChange={library.setSplitFilter}
      onArtistFilterChange={library.setArtistFilter}
      onIsrcFilterChange={library.setIsrcFilter}
      onUpcFilterChange={() => {}}
      onCountryFilterChange={library.setCountryFilter}
      onDateFromChange={library.setDateFrom}
      onDateToChange={library.setDateTo}
      percentageMin={library.percentageMin}
      percentageMax={library.percentageMax}
      onPercentageMinChange={library.setPercentageMin}
      onPercentageMaxChange={library.setPercentageMax}
      onGroupByTrackCountChange={() => {}}
      onClearAll={library.clearAllFilters}
    />
  );

  const detailsModal = library.isSongDetailsOpen && library.selectedSong && (
    <SongDetailsModal
      song={library.selectedSong}
      songDetails={library.selectedSongDetails}
      isLoading={library.isSongDetailsLoading}
      error={library.songDetailsError}
      onClose={library.handleCloseSongDetails}
      onNavigate={library.handleNavigateToSong}
    />
  );

  const pagination = (
    <MusicPagination
      pageStart={library.pageStart}
      pageEnd={library.pageEnd}
      total={totalItemsForDisplay}
      page={library.safePage}
      limit={library.limit}
      onLimitChange={library.setLimit}
      canGoNext={library.canGoNext}
      onPrev={() => library.setPage((p) => Math.max(1, p - 1))}
      onNext={() =>
        library.setPage((p) =>
          library.knownTotalPages ? Math.min(library.knownTotalPages, p + 1) : p + 1,
        )
      }
      noun="canciones"
    />
  );

  if (initialLoading || (loading && currentData.length === 0)) {
    return (
      <>
        <SongsSkeleton />
        {drawer}
      </>
    );
  }

  if (currentData.length === 0) {
    return (
      <>
        <EmptySongs
          query={query}
          hasFilters={activeFilterCount > 0}
          onClearFilters={library.clearAllFilters}
          onClearSearch={() => onQueryChange("")}
          onSwitchToAlbums={onSwitchToAlbums}
        />
        {drawer}
      </>
    );
  }

  if (layout === "grid") {
    return (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSongs.map((song) => (
            <SongCard key={song._id} song={song} onQuickView={library.handleOpenSongDetails} />
          ))}
        </div>
        <div className="px-1">{pagination}</div>
        {drawer}
        {detailsModal}
      </div>
    );
  }

  const titleActive = sortBy === "alpha" || sortBy === "title_desc";

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
      <div className={`${SONGS_GRID} px-5 py-3`}>
        <div className="flex min-w-0">
          <ColumnButton
            label="CANCIÓN"
            active={titleActive}
            descending={isDescending(sortBy)}
            onClick={() => setSortBy(NEXT_SORT.title(sortBy))}
          />
        </div>
        {SONG_COLUMNS.map((column) => {
          const active = Boolean(column.sortKeys?.includes(sortBy));
          return (
            <div key={column.key} className={column.visibility}>
              {column.sortKeys ? (
                <ColumnButton
                  label={column.label}
                  active={active}
                  descending={isDescending(sortBy)}
                  onClick={() => setSortBy(NEXT_SORT[column.key](sortBy))}
                />
              ) : (
                <ColumnLabel>{column.label}</ColumnLabel>
              )}
            </div>
          );
        })}
        <div />
      </div>
      <div className="h-px bg-[#E8E8EC]" />
      <div className="flex flex-col divide-y divide-[#E8E8EC]">
        {filteredSongs.map((song) => (
          <SongRow key={song._id} song={song} onQuickView={library.handleOpenSongDetails} />
        ))}
      </div>
      <div className="h-px bg-[#E8E8EC]" />
      <div className="px-5 py-3">{pagination}</div>

      {drawer}
      {detailsModal}
    </div>
  );
}

function ColumnButton({
  label,
  active,
  descending,
  onClick,
}: {
  label: string;
  active: boolean;
  descending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 transition-colors ${
        active ? "text-[#FF5C00]" : "text-[#A6AAB2] hover:text-[#71757E]"
      }`}
    >
      <span className="font-mono text-[9.5px] font-medium tracking-[1.2px]">{label}</span>
      {active && (descending ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
    </button>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="truncate font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
      {children}
    </span>
  );
}

function SongsSkeleton() {
  const widths = ["w-[168px]", "w-[132px]", "w-[190px]", "w-[150px]"];
  return (
    <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white">
      <div className={`${SONGS_GRID} px-5 py-3`}>
        <ColumnLabel>CANCIÓN</ColumnLabel>
        {SONG_COLUMNS.map((column) => (
          <div key={column.key} className={column.visibility}>
            <ColumnLabel>{column.label}</ColumnLabel>
          </div>
        ))}
        <div />
      </div>
      <div className="h-px bg-[#E8E8EC]" />
      <div className="flex flex-col divide-y divide-[#E8E8EC]">
        {widths.map((width, index) => (
          <div key={width} className={`${SONGS_GRID} px-5 py-3.5`}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-11 w-11 flex-shrink-0 animate-pulse rounded-[13px] bg-[#F4F5F7]" />
              <div className="flex flex-1 flex-col gap-2">
                <div className={`h-2.5 animate-pulse rounded-full bg-[#F4F5F7] ${width}`} />
                <div
                  className={`h-2 animate-pulse rounded-full bg-[#F4F5F7]/70 ${
                    index % 2 ? "w-[96px]" : "w-[120px]"
                  }`}
                />
              </div>
            </div>
            {SONG_COLUMNS.map((column) => (
              <div key={column.key} className={column.visibility}>
                <div className="h-2.5 w-[70%] animate-pulse rounded-full bg-[#F4F5F7]" />
              </div>
            ))}
            <div className="flex justify-end">
              <div className="h-7 w-7 animate-pulse rounded-full bg-[#F4F5F7]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptySongs({
  query,
  hasFilters,
  onClearFilters,
  onClearSearch,
  onSwitchToAlbums,
}: {
  query: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onClearSearch: () => void;
  onSwitchToAlbums: () => void;
}) {
  const searching = query.trim() !== "";

  return (
    <div className="flex flex-col items-center gap-3 rounded-[26px] border border-[#E8E8EC] bg-white px-6 py-[50px]">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
        {searching ? (
          <SearchX className="h-[22px] w-[22px] text-[#71757E]" />
        ) : (
          <MusicIcon className="h-[22px] w-[22px] text-[#71757E]" />
        )}
      </span>

      <h3 className="text-center font-display text-base font-semibold text-[#1C1D22]">
        {searching ? `Ninguna canción coincide con «${query}»` : "Tu catálogo todavía está vacío"}
      </h3>
      <p className="max-w-[520px] text-center text-[12.5px] leading-relaxed text-[#71757E]">
        {hasFilters
          ? "Hay filtros puestos que pueden estar dejando fuera lo que buscas."
          : searching
            ? "Puede que lo que buscas sea el título de un álbum."
            : "Las canciones aparecen solas cuando subes el reporte de un distribuidor. No hace falta darlas de alta una a una."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 rounded-2xl bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            <CircleX className="h-3.5 w-3.5" />
            Limpiar filtros
          </button>
        )}
        {searching && (
          <>
            <button
              onClick={onSwitchToAlbums}
              className="flex items-center gap-1.5 rounded-2xl bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
            >
              <Disc3 className="h-3.5 w-3.5" />
              Buscar en álbumes
            </button>
            <button
              onClick={onClearSearch}
              className="rounded-2xl border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
            >
              Borrar búsqueda
            </button>
          </>
        )}
      </div>
    </div>
  );
}
