import { useState } from "react";
import {
  Search,
  LayoutGrid,
  Rows3,
  SearchX,
  Music as MusicIcon,
  CircleX,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Loading from "@/components/loading/loading";
import { SongDetailsModal } from "@/components/music/SongDetailsModal";
import { SongsKpis } from "@/components/music/SongsKpis";
import { SongsFilterBar } from "@/components/music/SongsFilterBar";
import { SongCard } from "@/components/music/SongCard";
import { SongRow } from "@/components/music/SongRow";
import { SONG_COLUMNS, SONGS_GRID, isDescending } from "@/components/music/songsColumns";
import { useSongsLibrary } from "@/hooks/useSongsLibrary";
import { useSongsKpis } from "@/hooks/useSongsKpis";
import type { SortBy } from "@/types/music.types";

type ViewMode = "grid" | "list";

/** Criterio que aplica cada columna al pulsar su cabecera. */
const NEXT_SORT: Record<string, (current: SortBy) => SortBy> = {
  title: (current) => (current === "alpha" ? "title_desc" : "alpha"),
  streams: () => "streams",
  income: () => "revenue",
  collaborators: () => "collaborators_desc",
  percentage: (current) => (current === "percentage_desc" ? "percentage_asc" : "percentage_desc"),
};

export default function Songs() {
  const [view, setView] = useState<ViewMode>("list");
  const kpis = useSongsKpis();
  const {
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
    handleOpenSongDetails,
    handleCloseSongDetails,
    handleNavigateToSong,
    clearAllFilters,
    isSearching,
  } = useSongsLibrary();

  if (initialLoading) return <Loading />;

  const hasFilters =
    splitFilter !== "all" ||
    collaboratorsFilter !== "all" ||
    ownerSplitFilter !== "all" ||
    [artistFilter, isrcFilter, countryFilter, dateFrom, dateTo, percentageMin, percentageMax].some(
      (v) => v.trim() !== "",
    );

  const withSplits = Math.max(0, kpis.totalSongs - kpis.withoutSplits);

  const pagination = (
    <PaginationBar
      pageStart={pageStart}
      pageEnd={pageEnd}
      total={totalItemsForDisplay}
      page={safePage}
      limit={limit}
      onLimitChange={setLimit}
      canGoNext={canGoNext}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => (knownTotalPages ? Math.min(knownTotalPages, p + 1) : p + 1))}
    />
  );

  return (
    <div className="min-h-full bg-[#F7F7F9]">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-display text-2xl font-semibold text-[#1C1D22]">Canciones</h1>
            <p className="flex items-center gap-2 text-[13px] text-[#71757E]">
              <span>{kpis.totalSongs.toLocaleString()} canciones</span>
              <span className="text-[#A6AAB2]">·</span>
              <span>{withSplits.toLocaleString()} con split</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-[320px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6AAB2]"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar por título, artista o ISRC…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[22px] border border-[#E8E8EC] bg-white py-2.5 pl-11 pr-10 text-[12.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[#FF5C00]" />
                </div>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center gap-0.5 rounded-[22px] bg-[#F4F5F7] p-[3px]">
              <ViewButton
                active={view === "grid"}
                onClick={() => setView("grid")}
                title="Cuadrícula"
              >
                <LayoutGrid className="h-4 w-4" />
              </ViewButton>
              <ViewButton active={view === "list"} onClick={() => setView("list")} title="Lista">
                <Rows3 className="h-4 w-4" />
              </ViewButton>
            </div>
          </div>
        </div>

        <SongsKpis
          totalSongs={kpis.totalSongs}
          totalIncome={kpis.totalIncome}
          totalStreams={kpis.totalStreams}
          withoutSplits={kpis.withoutSplits}
          onShowWithoutSplits={() => setSplitFilter("without_split")}
        />

        <SongsFilterBar
          splitFilter={splitFilter}
          onSplitFilterChange={setSplitFilter}
          collaboratorsFilter={collaboratorsFilter}
          onCollaboratorsFilterChange={setCollaboratorsFilter}
          ownerSplitFilter={ownerSplitFilter}
          onOwnerSplitFilterChange={setOwnerSplitFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          artistFilter={artistFilter}
          onArtistFilterChange={setArtistFilter}
          isrcFilter={isrcFilter}
          onIsrcFilterChange={setIsrcFilter}
          countryFilter={countryFilter}
          onCountryFilterChange={setCountryFilter}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
          percentageMin={percentageMin}
          onPercentageMinChange={setPercentageMin}
          percentageMax={percentageMax}
          onPercentageMaxChange={setPercentageMax}
          onClearAll={clearAllFilters}
        />

        {/* Contenido */}
        {loading && currentData.length === 0 ? (
          <TableSkeleton />
        ) : currentData.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            hasFilters={hasFilters}
            onClearFilters={clearAllFilters}
            onClearSearch={() => setSearchQuery("")}
          />
        ) : view === "grid" ? (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSongs.map((song) => (
                <SongCard key={song._id} song={song} onQuickView={handleOpenSongDetails} />
              ))}
            </div>
            <div className="px-1">{pagination}</div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
            <TableHeader sortBy={sortBy} onSortChange={setSortBy} />
            <div className="h-px bg-[#E8E8EC]" />
            <div className="flex flex-col divide-y divide-[#E8E8EC]">
              {filteredSongs.map((song) => (
                <SongRow key={song._id} song={song} onQuickView={handleOpenSongDetails} />
              ))}
            </div>
            <div className="h-px bg-[#E8E8EC]" />
            <div className="px-5 py-3">{pagination}</div>
          </div>
        )}
      </div>

      {isSongDetailsOpen && selectedSong && (
        <SongDetailsModal
          song={selectedSong}
          songDetails={selectedSongDetails}
          isLoading={isSongDetailsLoading}
          error={songDetailsError}
          onClose={handleCloseSongDetails}
          onNavigate={handleNavigateToSong}
        />
      )}
    </div>
  );
}

/** Botón del toggle de vista (grid/lista). */
function ViewButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
        active ? "bg-[#FF5C00] text-white" : "text-[#A6AAB2] hover:text-[#71757E]"
      }`}
    >
      {children}
    </button>
  );
}

/** Cabecera de la tabla: cada columna ordena y marca el criterio activo. */
function TableHeader({
  sortBy,
  onSortChange,
}: {
  sortBy: SortBy;
  onSortChange: (v: SortBy) => void;
}) {
  const titleActive = sortBy === "alpha" || sortBy === "title_desc";
  return (
    <div className={`${SONGS_GRID} px-5 py-3`}>
      <div className="flex min-w-0">
        <ColumnButton
          label="CANCIÓN"
          active={titleActive}
          descending={isDescending(sortBy)}
          onClick={() => onSortChange(NEXT_SORT.title(sortBy))}
        />
      </div>
      {SONG_COLUMNS.map((c) => {
        const active = Boolean(c.sortKeys?.includes(sortBy));
        return (
          <div key={c.key} className={c.visibility}>
            {c.sortKeys ? (
              <ColumnButton
                label={c.label}
                active={active}
                descending={isDescending(sortBy)}
                onClick={() => onSortChange(NEXT_SORT[c.key](sortBy))}
              />
            ) : (
              <ColumnLabel>{c.label}</ColumnLabel>
            )}
          </div>
        );
      })}
      <div />
    </div>
  );
}

/** Cabecera de columna pulsable, con el indicador de orden. */
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
      className={`flex items-center gap-1 transition-colors ${active ? "text-[#FF5C00]" : "text-[#A6AAB2] hover:text-[#71757E]"}`}
    >
      <span className="font-mono text-[9.5px] font-medium tracking-[1.2px]">{label}</span>
      {active && (descending ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
    </button>
  );
}

/** Etiqueta de columna no ordenable. */
function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
      {children}
    </span>
  );
}

interface PaginationBarProps {
  pageStart: number;
  pageEnd: number;
  total: number;
  page: number;
  limit: number;
  onLimitChange: (v: number) => void;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/** Rango mostrado, tamaño de página y paso entre páginas. */
function PaginationBar({
  pageStart,
  pageEnd,
  total,
  page,
  limit,
  onLimitChange,
  canGoNext,
  onPrev,
  onNext,
}: PaginationBarProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <span className="text-[12px] text-[#71757E]">
        Mostrando {total === 0 ? 0 : pageStart + 1}–{Math.min(pageEnd, total)} de {total} canciones
      </span>
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#71757E]">Por página</span>
          <div className="relative">
            <select
              aria-label="Canciones por página"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="appearance-none rounded-xl border-0 bg-[#F4F5F7] px-2.5 py-1.5 pr-7 font-mono text-[12px] font-semibold text-[#1C1D22] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/40"
            >
              {Array.from(new Set([limit, 12, 24, 48, 96]))
                .sort((a, b) => a - b)
                .map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#A6AAB2]"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            className="flex items-center gap-1.5 rounded-xl bg-[#F4F5F7] px-3 py-1.5 text-[12px] font-medium text-[#71757E] transition-colors hover:text-[#1C1D22] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Anterior
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5C00] font-mono text-[12px] font-semibold text-white">
            {page}
          </span>
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-1.5 rounded-xl border border-[#E8E8EC] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1C1D22] transition-colors hover:text-[#FF5C00] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Tabla fantasma: conserva las columnas mientras llegan los datos. */
function TableSkeleton() {
  const widths = ["w-[168px]", "w-[132px]", "w-[190px]", "w-[150px]"];
  return (
    <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white">
      <div className={`${SONGS_GRID} px-5 py-3`}>
        <div className="min-w-0">
          <ColumnLabel>CANCIÓN</ColumnLabel>
        </div>
        {SONG_COLUMNS.map((c) => (
          <div key={c.key} className={c.visibility}>
            <ColumnLabel>{c.label}</ColumnLabel>
          </div>
        ))}
        <div />
      </div>
      <div className="h-px bg-[#E8E8EC]" />
      <div className="flex flex-col divide-y divide-[#E8E8EC]">
        {widths.map((width, i) => (
          <div key={width} className={`${SONGS_GRID} px-5 py-3.5`}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-11 w-11 flex-shrink-0 animate-pulse rounded-[13px] bg-[#F4F5F7]" />
              <div className="flex flex-1 flex-col gap-2">
                <div className={`h-2.5 animate-pulse rounded-full bg-[#F4F5F7] ${width}`} />
                <div
                  className={`h-2 animate-pulse rounded-full bg-[#F4F5F7]/70 ${i % 2 ? "w-[96px]" : "w-[120px]"}`}
                />
              </div>
            </div>
            {SONG_COLUMNS.map((c) => (
              <div key={c.key} className={c.visibility}>
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

interface EmptyStateProps {
  searchQuery: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onClearSearch: () => void;
}

/** Sin resultados: dice qué se buscó y ofrece deshacer lo que está limitando. */
function EmptyState({ searchQuery, hasFilters, onClearFilters, onClearSearch }: EmptyStateProps) {
  const searching = searchQuery.trim() !== "";
  return (
    <div className="flex flex-col items-center gap-3 rounded-[26px] border border-[#E8E8EC] bg-white px-6 py-[52px]">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
        {searching ? (
          <SearchX className="h-[22px] w-[22px] text-[#71757E]" />
        ) : (
          <MusicIcon className="h-[22px] w-[22px] text-[#71757E]" />
        )}
      </div>
      <h3 className="font-display text-base font-semibold text-[#1C1D22]">
        {searching ? `Sin resultados para «${searchQuery}»` : "No hay canciones"}
      </h3>
      <p className="text-center text-[12.5px] text-[#71757E]">
        {hasFilters
          ? "Hay filtros puestos que pueden estar dejando fuera lo que buscas."
          : searching
            ? "Prueba con otro título, artista o ISRC."
            : "Aún no hay canciones para mostrar."}
      </p>
      {(hasFilters || searching) && (
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
            <button
              onClick={onClearSearch}
              className="rounded-2xl border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
            >
              Borrar búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  );
}
