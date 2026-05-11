import { Music as MusicIcon, Search, Plus, SlidersHorizontal } from "lucide-react";
import UploadModal from "./components/UploadModal";
import AlbumOwnerSplitModal from "./album/components/AlbumOwnerSplitModal";
import Loading from "@/components/loading/loading";
import { MusicFilterDrawer } from "@/components/music/MusicFilterDrawer";
import { SongDetailsModal } from "@/components/music/SongDetailsModal";
import { MusicTable } from "@/components/music/MusicTable";
import { MusicMobileList } from "@/components/music/MusicMobileList";
import { useMusicLibrary } from "@/hooks/useMusicLibrary";

export default function Music() {
  const {
    mode, setMode,
    setPage,
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

  if (loading && currentData.length === 0) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Music Library</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your songs and albums</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] transition-colors"
          >
            <Plus size={16} />
            Upload
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="bg-gray-100 rounded-[10px] p-1 flex">
            {(["songs", "albums"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {key === "songs" ? "Songs" : "Albums"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={mode === "songs" ? "Search by title, artist, ISRC..." : "Search by title, artist, UPC..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {(isSearching && mode === "songs") || (isAlbumSearching && mode === "albums") ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setShowFilterPanel(true)}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] border text-sm font-medium transition-colors flex-shrink-0 ${activeFilterCount > 0 ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filtros</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {currentData.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MusicIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No {mode === "songs" ? "songs" : "albums"} found
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {searchQuery ? `No results for "${searchQuery}". Try different terms.` : "Start by uploading your first track"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-[10px] transition-colors"
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
              albums={filteredAlbums}
              groupedAlbums={groupedAlbums}
              groupAlbumsByTrackCount={groupAlbumsByTrackCount}
              onOwnerSplitModal={handleOpenOwnerSplitModal}
            />
            <MusicTable
              mode={mode}
              songs={filteredSongs}
              albums={filteredAlbums}
              groupedAlbums={groupedAlbums}
              groupAlbumsByTrackCount={groupAlbumsByTrackCount}
              getAllSongLabels={getAllSongLabels}
              onSongDetails={handleOpenSongDetails}
              onOwnerSplitModal={handleOpenOwnerSplitModal}
              safePage={safePage}
              pageStart={pageStart}
              pageEnd={pageEnd}
              totalItemsForDisplay={totalItemsForDisplay}
              canGoNext={canGoNext}
              knownTotalPages={knownTotalPages}
              limit={limit}
              onLimitChange={setLimit}
              onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
              onNextPage={() => setPage((p) => knownTotalPages ? Math.min(knownTotalPages, p + 1) : p + 1)}
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
          onClose={() => { setIsOwnerSplitModalOpen(false); setSelectedAlbum(null); }}
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
        groupAlbumsByTrackCount={groupAlbumsByTrackCount}
        activeFilterCount={activeFilterCount}
        onClose={() => setShowFilterPanel(false)}
        onSortChange={setSortBy}
        onSplitFilterChange={setSplitFilter}
        onArtistFilterChange={setArtistFilter}
        onIsrcFilterChange={setIsrcFilter}
        onUpcFilterChange={setUpcFilter}
        onGroupByTrackCountChange={setGroupAlbumsByTrackCount}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}
