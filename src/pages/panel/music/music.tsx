/* eslint-disable @typescript-eslint/no-explicit-any */
import CardSong from "../../../components/cardsong/cardsong";
import { useState } from "react";
import { Link } from "react-router-dom";
import UpcAlbumCard from "./song/components/UpcAlbumCard";
import { motion, AnimatePresence } from "framer-motion";
import UploadModal from "./components/UploadModal";
import { Music as MusicIcon, Disc, Search, Grid, List, Plus, TrendingUp } from "lucide-react";
import UseSongs from "../../../hooks/useSongs";
import useAlbums from "../../../hooks/useAlbums";
import Loading from "../../../components/loading/loading";

export default function Music() {
  const [mode, setMode] = useState<"songs" | "albums">("songs");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { songs, uploadSongs, loading: songsLoading, getSongs } = UseSongs();
  const { albums, loading: albumsLoading, hasMoreAlbums, loadMoreAlbums } = useAlbums();

  const handleFileSelect = async (file: File) => {
    const formData = new FormData();
    formData.append("csvFile", file);
    await uploadSongs(formData);
    setIsModalOpen(false);
    getSongs();
  };

  const filteredSongs = songs.filter((song: any) =>
    song.trackTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artisticLabel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlbums = albums.filter((album) =>
    album.albumTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artistName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artisticLabel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const loading = mode === "songs" ? songsLoading : albumsLoading;
  const currentData = mode === "songs" ? filteredSongs : filteredAlbums;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 lg:mb-4">
            Music Library
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Manage your songs and albums with powerful tools and beautiful visualizations
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6 lg:mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="flex space-x-1">
              {[
                { key: "songs", icon: MusicIcon, label: "Songs" },
                { key: "albums", icon: Disc, label: "Albums" }
              ].map(({ key, icon: Icon, label }) => (
                <motion.button
                  key={key}
                  className={`relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 sm:gap-3 ${
                    mode === key
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={() => setMode(key as "songs" | "albums")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {mode === key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search songs, albums, or labels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 dark:text-white"
                />
              </div>
            </div>

            {/* View Toggle and Upload */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
              {/* View Mode Toggle */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <div className="flex space-x-1">
                  {[
                    { key: "grid", icon: Grid },
                    { key: "list", icon: List }
                  ].map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setViewMode(key as "grid" | "list")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === key
                          ? "bg-white dark:bg-gray-600 text-indigo-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Upload</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentData.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 lg:py-20"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-white/20">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <MusicIcon size={80} className="sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto text-gray-400 mb-4 sm:mb-6" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                  No {mode === "songs" ? "songs" : "albums"} found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 px-4">
                  {searchQuery ? "Try adjusting your search terms" : "Start by uploading your first track"}
                </p>
                {!searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Upload Your First Track
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 lg:space-y-8"
            >
              {/* Featured Cards Section */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                    Featured {mode === "songs" ? "Songs" : "Albums"}
                  </h2>
                </motion.div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentData.slice(0, 3).map((item: any, index: number) => (
                    <motion.div
                      key={mode === "songs" ? item._id : item.upc}
                      variants={itemVariants}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                      className="group"
                    >
                      {mode === "songs" ? (
                        <></>
                      ) : (
                        <UpcAlbumCard album={item} index={index} />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Table View */}
              {viewMode === "list" && mode === "songs" && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80 dark:bg-gray-700/80">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Track
                          </th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Split Status
                          </th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Percentage
                          </th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Collaborators
                          </th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Label
                          </th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredSongs.map((song: any) => (
                          <motion.tr
                            key={song._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                            className="transition-colors duration-200"
                          >
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <Link 
                                to={`/panel/song/${song._id}`}
                                className="flex items-center space-x-3 group"
                              >
                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                    <MusicIcon size={16} className="sm:w-5 sm:h-5 text-white" />
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                    {song.trackTitle}
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                song?.split 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}>
                                {song?.split ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {song?.percetaje || "Not assigned"}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex -space-x-2">
                                {song?.collaborators?.length > 0 ? (
                                  song.collaborators.slice(0, 3).map((collaborator: any, idx: number) => (
                                    <img
                                      key={idx}
                                      src={collaborator.image}
                                      alt={collaborator.name}
                                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-gray-800"
                                    />
                                  ))
                                ) : (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">None</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {song?.artisticLabel || "Unknown"}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                Active
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <motion.div
                  variants={itemVariants}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                      All {mode === "songs" ? "Songs" : "Albums"}
                    </h2>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {currentData.slice(3).map((item: any, index: number) => (
                      <motion.div
                        key={mode === "songs" ? item._id : item.upc}
                        variants={itemVariants}
                        whileHover={{ 
                          y: -8,
                          transition: { duration: 0.2 }
                        }}
                        className="group"
                      >
                        {mode === "songs" ? (
                          <CardSong song={item} />
                        ) : (
                          <UpcAlbumCard album={item} index={index + 3} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Load More Button for Albums */}
                  {mode === "albums" && hasMoreAlbums && (
                    <div className="flex justify-center mt-8">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadMoreAlbums}
                        disabled={albumsLoading}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                      >
                        {albumsLoading ? "Loading..." : "Load More Albums"}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}
