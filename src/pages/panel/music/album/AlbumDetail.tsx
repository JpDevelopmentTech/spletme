/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Disc,
  Play,
  Download,
  Share2,
  MoreHorizontal,
  Crown,
} from "lucide-react";
import { useAlbums } from "../../../../hooks/useAlbums";
import Loading from "../../../../components/loading/loading";
import Breadcrumb from "../../../../components/breadcrumb/breadcrumb";
import type { Album, AlbumTrack } from "../../../../models/album";
import AlbumOwnerSplitModal from "./components/AlbumOwnerSplitModal";

export default function AlbumDetail() {
  const { upc } = useParams<{ upc: string }>();
  const navigate = useNavigate();
  const { getAlbumByUPC } = useAlbums(0, 10);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);

  const loadAlbum = useCallback(async () => {
    if (!upc) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const albumData = await getAlbumByUPC(upc);
      if (albumData) {
        setAlbum(albumData);
      } else {
        setError("Album not found");
      }
    } catch (err) {
      setError("Error loading album");
      console.error("Error loading album:", err);
    } finally {
      setLoading(false);
    }
  }, [upc, getAlbumByUPC]);

  useEffect(() => {
    if (upc) {
      loadAlbum();
    }
  }, [upc, loadAlbum]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const breadcrumbItems = [
    { label: "Panel", url: "/panel" },
    { label: "Music", url: "/panel/music" },
    { label: album?.albumTitle || "Album", url: "" }
  ];

  if (loading) return <Loading />;
  
  if (error || !album) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Album not found"}
          </h1>
          <Link 
            to="/panel/music" 
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Back to Music
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Breadcrumb items={breadcrumbItems} />
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/panel/music" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Music</span>
          </Link>
        </motion.div>

        {/* Album Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8"
        >
          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              
              {/* Album Cover */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Disc size={80} className="text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play size={32} className="text-white" fill="white" />
                  </div>
                </div>
              </div>

              {/* Album Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                    ALBUM
                  </p>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    {album.releaseTitle}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                    {album.artistName}
                  </p>
                  {album.artisticLabel && (
                    <p className="text-gray-500 dark:text-gray-400">
                      {album.artisticLabel}
                    </p>
                  )}
                </div>

                {/* UPC */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-6 py-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      UPC:
                    </span>
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {album.upc}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {album.totalTracks}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Tracks
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatNumber(album.totalStreams)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Streams
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatCurrency(album.totalGrossIncome)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Gross Revenue
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatCurrency(album.totalNetIncome)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Net Revenue
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                    <Play size={18} fill="white" />
                    Play Album
                  </button>
                  <motion.button
                    onClick={() => setIsOwnerSplitModalOpen(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Crown size={18} />
                    Create Owner Splits
                  </motion.button>
                  <button className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-full font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <Download size={18} />
                    Download
                  </button>
                  <button className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-full font-semibold border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tracks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tracks
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {album.totalTracks} songs
              </div>
            </div>

            {/* Tracks Table */}
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        #
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        TITLE
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        STREAMS
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        REVENUE
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                                         {album.tracks.map((track: AlbumTrack, index: number) => (
                       <motion.tr
                         key={track.isrc}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.3 + index * 0.05 }}
                         className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group cursor-pointer"
                         onClick={() => navigate(`/panel/song/${track._id}`)}
                       >
                         <td className="py-4 px-4">
                           <div className="flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                             <span className="text-sm font-medium group-hover:hidden">
                               {index + 1}
                             </span>
                             <Play size={16} className="hidden group-hover:block" fill="currentColor" />
                           </div>
                         </td>
                         <td className="py-4 px-4">
                           <div>
                             <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                               {track.trackTitle}
                             </div>
                             <div className="text-sm text-gray-500 dark:text-gray-400">
                               ISRC: {track.isrc}
                             </div>
                           </div>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <div className="font-semibold text-gray-900 dark:text-white">
                             {formatNumber(track.totalStreams)}
                           </div>
                         </td>
                         <td className="py-4 px-4 text-right">
                           <div className="font-semibold text-gray-900 dark:text-white">
                             {formatCurrency(track.totalNetIncome)}
                           </div>
                         </td>
                         <td className="py-4 px-4 text-center">
                           <button 
                             className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                             onClick={(e) => {
                               e.stopPropagation(); // Prevent row click when clicking the button
                               // Add menu functionality here if needed
                             }}
                           >
                             <MoreHorizontal size={16} className="text-gray-500 dark:text-gray-400" />
                           </button>
                         </td>
                       </motion.tr>
                     ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Album Owner Split Modal */}
      {album && (
        <AlbumOwnerSplitModal
          isOpen={isOwnerSplitModalOpen}
          onClose={() => setIsOwnerSplitModalOpen(false)}
          album={album}
          onSplitsCreated={() => {
            loadAlbum();
          }}
        />
      )}
    </div>
  );
}
