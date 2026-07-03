import { Music as MusicIcon, Search, SlidersHorizontal } from "lucide-react";
import AlbumOwnerSplitModal from "../album/components/AlbumOwnerSplitModal";
import Loading from "@/components/loading/loading";
import { MusicFilterDrawer } from "@/components/music/MusicFilterDrawer";
import { MusicTable } from "@/components/music/MusicTable";
import { MusicMobileList } from "@/components/music/MusicMobileList";
import { useAlbumsLibrary } from "@/hooks/useAlbumsLibrary";

export default function Albums() {
  const {
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
    initialLoading,
    loading,
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
    handleOpenOwnerSplitModal,
    clearAllFilters,
    refreshAlbums,
  } = useAlbumsLibrary();

  if (initialLoading) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="px-6 py-8 lg:px-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Álbumes</h1>
            <p className="mt-1 text-sm text-gray-500">Gestiona tus álbumes</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by title, artist, UPC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[10px] border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {isAlbumSearching ? (
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
            <p className="mt-4 text-sm text-gray-400">Cargando álbumes...</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <MusicIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-700">No albums found</h3>
            <p className="mb-6 text-sm text-gray-400">
              {searchQuery
                ? `No results for "${searchQuery}". Try different terms.`
                : "No hay álbumes disponibles todavía"}
            </p>
          </div>
        ) : (
          <>
            <MusicMobileList
              mode="albums"
              songs={[]}
              albums={displayAlbums}
              groupedAlbums={groupedAlbums}
              groupAlbumsByTrackCount={groupAlbumsByTrackCount}
              onOwnerSplitModal={handleOpenOwnerSplitModal}
            />
            <MusicTable
              mode="albums"
              songs={[]}
              albums={displayAlbums}
              groupedAlbums={groupedAlbums}
              groupAlbumsByTrackCount={groupAlbumsByTrackCount}
              getAllSongLabels={() => []}
              onSongDetails={() => {}}
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
        mode="albums"
        sortBy={sortBy}
        splitFilter={splitFilter}
        artistFilter={artistFilter}
        isrcFilter=""
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
        onIsrcFilterChange={() => {}}
        onUpcFilterChange={setUpcFilter}
        onCountryFilterChange={setCountryFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        percentageMin=""
        percentageMax=""
        onPercentageMinChange={() => {}}
        onPercentageMaxChange={() => {}}
        onGroupByTrackCountChange={setGroupAlbumsByTrackCount}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}
