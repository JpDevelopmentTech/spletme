import { useEffect, useState } from "react";
import { Music as MusicIcon, Search, SlidersHorizontal, AlertCircle } from "lucide-react";
import UploadModal from "./components/UploadModal";
import AlbumOwnerSplitModal from "./album/components/AlbumOwnerSplitModal";
import Loading from "@/components/loading/loading";
import { MusicFilterDrawer } from "@/components/music/MusicFilterDrawer";
import { SongDetailsModal } from "@/components/music/SongDetailsModal";
import { MusicTable } from "@/components/music/MusicTable";
import { MusicMobileList } from "@/components/music/MusicMobileList";
import { useMusicLibrary } from "@/hooks/useMusicLibrary";
import songService from "@/services/songs";

export default function Music() {
  const [songsWithoutSplits, setSongsWithoutSplits] = useState<number | null>(null);

  useEffect(() => {
    songService
      .filterSongs({ hasSplits: false, page: 1, limit: 1 })
      .then((res) => {
        const total =
          res?.data?.pagination?.total ?? res?.pagination?.total ?? res?.data?.total ?? null;
        setSongsWithoutSplits(total);
      })
      .catch(() => setSongsWithoutSplits(null));
  }, []);

  const {
    mode,
    setMode,
    setPage,
    limit,
    setLimit,
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    setSearchQuery,
    isAlbumSearching,
    isOwnerSplitModalOpen,
    setIsOwnerSplitModalOpen,
    selectedAlbum,
    setSelectedAlbum,
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
    upcFilter,
    setUpcFilter,
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
    groupAlbumsByTrackCount,
    setGroupAlbumsByTrackCount,
    showFilterPanel,
    setShowFilterPanel,
    initialLoading,
    loading,
    filteredSongs,
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
    getAllSongLabels,
    handleFileSelect,
    handleOpenOwnerSplitModal,
    handleOpenSongDetails,
    handleCloseSongDetails,
    handleNavigateToSong,
    clearAllFilters,
    refreshAlbums,
    isSearching,
  } = useMusicLibrary();

  if (initialLoading) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="px-6 py-8 lg:px-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Music Library</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your songs and albums</p>
          </div>
          {/* Stat card — songs without splits */}
          {songsWithoutSplits !== null && songsWithoutSplits > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-4 rounded-2xl border border-amber-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50">
                  <AlertCircle size={20} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none text-gray-900">
                    {songsWithoutSplits}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {songsWithoutSplits === 1 ? "canción sin" : "canciones sin"} splits asignados
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex rounded-[10px] bg-gray-100 p-1">
            {(["songs", "albums"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${mode === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {key === "songs" ? "Songs" : "Albums"}
              </button>
            ))}
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-72">
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
                className="w-full rounded-[10px] border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {(isSearching && mode === "songs") || (isAlbumSearching && mode === "albums") ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-orange-500" />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setShowFilterPanel(true)}
              className={`relative flex flex-shrink-0 items-center gap-2 rounded-[10px] border px-3.5 py-2.5 text-sm font-medium transition-colors ${activeFilterCount > 0 ? "border-orange-200 bg-orange-50 text-orange-600" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filtros</span>
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {loading && currentData.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500" />
            <p className="mt-4 text-sm text-gray-400">
              Cargando {mode === "songs" ? "canciones" : "álbumes"}...
            </p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <MusicIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              No {mode === "songs" ? "songs" : "albums"} found
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              {searchQuery
                ? `No results for "${searchQuery}". Try different terms.`
                : "Start by uploading your first track"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-[10px] bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Upload Your First Track
              </button>
            )}
          </div>
        ) : (
          <>
            <MusicMobileList
              mode={mode}
              songs={filteredSongs}
              albums={displayAlbums}
              groupedAlbums={groupedAlbums}
              groupAlbumsByTrackCount={groupAlbumsByTrackCount}
              onOwnerSplitModal={handleOpenOwnerSplitModal}
            />
            <MusicTable
              mode={mode}
              songs={filteredSongs}
              albums={displayAlbums}
              groupedAlbums={groupedAlbums}
              groupAlbumsByTrackCount={groupAlbumsByTrackCount}
              getAllSongLabels={getAllSongLabels}
              onSongDetails={handleOpenSongDetails}
              onOwnerSplitModal={handleOpenOwnerSplitModal}
              sortBy={sortBy}
              onSortChange={setSortBy}
              splitFilter={splitFilter}
              onSplitFilterChange={setSplitFilter}
              safePage={safePage}
              pageStart={pageStart}
              pageEnd={pageEnd}
              totalItemsForDisplay={totalItemsForDisplay}
              canGoNext={canGoNext}
              knownTotalPages={knownTotalPages}
              limit={limit}
              onLimitChange={setLimit}
              onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
              onNextPage={() =>
                setPage((p) => (knownTotalPages ? Math.min(knownTotalPages, p + 1) : p + 1))
              }
            />
          </>
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
          onSplitsCreated={refreshAlbums}
        />
      )}

      <MusicFilterDrawer
        isOpen={showFilterPanel}
        mode={mode}
        sortBy={sortBy}
        splitFilter={splitFilter}
        artistFilter={artistFilter}
        isrcFilter={isrcFilter}
        upcFilter={upcFilter}
        countryFilter={countryFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        groupAlbumsByTrackCount={groupAlbumsByTrackCount}
        activeFilterCount={activeFilterCount}
        onClose={() => setShowFilterPanel(false)}
        onSortChange={setSortBy}
        onSplitFilterChange={setSplitFilter}
        onArtistFilterChange={setArtistFilter}
        onIsrcFilterChange={setIsrcFilter}
        onUpcFilterChange={setUpcFilter}
        onCountryFilterChange={setCountryFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        percentageMin={percentageMin}
        percentageMax={percentageMax}
        onPercentageMinChange={setPercentageMin}
        onPercentageMaxChange={setPercentageMax}
        onGroupByTrackCountChange={setGroupAlbumsByTrackCount}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}
