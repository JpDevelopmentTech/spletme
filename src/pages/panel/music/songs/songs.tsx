import { useState } from "react";
import { Search, LayoutGrid, Rows3, Music as MusicIcon, ChevronDown } from "lucide-react";
import Loading from "@/components/loading/loading";
import { SongDetailsModal } from "@/components/music/SongDetailsModal";
import { SongsKpis } from "@/components/music/SongsKpis";
import { SongsFilterBar } from "@/components/music/SongsFilterBar";
import { SongCard } from "@/components/music/SongCard";
import { SongRow } from "@/components/music/SongRow";
import { useSongsLibrary } from "@/hooks/useSongsLibrary";
import { useSongsKpis } from "@/hooks/useSongsKpis";

type ViewMode = "grid" | "list";

const LIST_COLUMNS: { label: string; width: string }[] = [
  { label: "ESTADO", width: "w-[112px]" },
  { label: "STREAMS", width: "w-[104px]" },
  { label: "INGRESOS", width: "w-[120px]" },
  { label: "COLABS", width: "w-[124px]" },
  { label: "% · SELLO", width: "w-[120px]" },
];

export default function Songs() {
  const [view, setView] = useState<ViewMode>("grid");
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

  return (
    <div className="min-h-full bg-white">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-[#1C1D22]">Canciones</h1>
              <p className="text-sm text-[#71757E]">Gestiona tus canciones</p>
            </div>
            <div className="h-1 w-11 rounded-full bg-[#FF5C00]" />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6AAB2]" size={17} />
              <input
                type="text"
                placeholder="Buscar por título, artista, ISRC…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-[#F4F5F7] py-2.5 pl-11 pr-10 text-[13px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/40"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[#FF5C00]" />
                </div>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-[#F4F5F7] p-1">
              <ViewButton active={view === "grid"} onClick={() => setView("grid")} title="Cuadrícula">
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
        />

        <SongsFilterBar
          splitFilter={splitFilter}
          onSplitFilterChange={setSplitFilter}
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

        {/* Content */}
        {loading && currentData.length === 0 ? (
          <div className="rounded-[28px] bg-[#F4F5F7] p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#FF5C00]" />
            <p className="mt-4 text-sm text-[#A6AAB2]">Cargando canciones...</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="rounded-[28px] bg-[#F4F5F7] p-12 text-center">
            <MusicIcon size={48} className="mx-auto mb-4 text-[#A6AAB2]" />
            <h3 className="mb-2 text-lg font-semibold text-[#1C1D22]">No hay canciones</h3>
            <p className="text-sm text-[#71757E]">
              {searchQuery
                ? `Sin resultados para "${searchQuery}". Prueba con otros términos.`
                : "Aún no hay canciones para mostrar."}
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSongs.map((song) => (
              <SongCard key={song._id} song={song} onQuickView={handleOpenSongDetails} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-[28px] bg-[#F4F5F7] p-4">
            <div className="hidden items-center gap-3.5 px-[18px] py-2 lg:flex">
              <div className="flex-1">
                <ColumnLabel>CANCIÓN</ColumnLabel>
              </div>
              {LIST_COLUMNS.map((c) => (
                <div key={c.label} className={c.width}>
                  <ColumnLabel>{c.label}</ColumnLabel>
                </div>
              ))}
              <div className="w-[132px]" />
            </div>
            {filteredSongs.map((song) => (
              <SongRow key={song._id} song={song} onQuickView={handleOpenSongDetails} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {currentData.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 px-2 sm:flex-row">
            <span className="text-[12.5px] text-[#71757E]">
              Mostrando {totalItemsForDisplay === 0 ? 0 : pageStart + 1}–
              {Math.min(pageEnd, totalItemsForDisplay)} de {totalItemsForDisplay} canciones
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] text-[#71757E]">Mostrar:</span>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="appearance-none rounded-[12px] bg-[#F4F5F7] px-3 py-1.5 pr-7 text-[12.5px] font-medium text-[#1C1D22] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/40"
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
                  size={13}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#A6AAB2]"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-[12px] bg-[#F4F5F7] px-3.5 py-1.5 text-[12.5px] font-medium text-[#71757E] transition-colors hover:text-[#1C1D22] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[12px] bg-[#FF5C00] text-[12.5px] font-semibold text-white">
                {safePage}
              </span>
              <button
                onClick={() =>
                  setPage((p) => (knownTotalPages ? Math.min(knownTotalPages, p + 1) : p + 1))
                }
                disabled={!canGoNext}
                className="rounded-[12px] bg-[#F4F5F7] px-3.5 py-1.5 text-[12.5px] font-medium text-[#1C1D22] transition-colors hover:text-[#FF5C00] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
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
      className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
        active ? "bg-[#FF5C00] text-white" : "text-[#A6AAB2] hover:text-[#71757E]"
      }`}
    >
      {children}
    </button>
  );
}

/** Etiqueta de columna para la cabecera de la vista lista. */
function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
      {children}
    </span>
  );
}
