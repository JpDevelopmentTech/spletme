/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { Disc, Music, DollarSign, TrendingUp, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Album } from "../../../../../models/album";

interface UpcAlbumCardProps {
  album: Album;
  index: number;
}

const UpcAlbumCard = ({ album, index }: UpcAlbumCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/panel/album/upc/${album.upc}`} className="block">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-600 group-hover:-translate-y-2">
          
          {/* Album Cover/Icon Section */}
          <div className="relative p-8 pb-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Disc size={40} className="text-white" />
                </div>
                {/* Play button overlay on hover */}
                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play size={20} className="text-white" fill="white" />
                </div>
              </div>
            </div>
          </div>

          {/* Album Information */}
          <div className="px-8 pb-8">
            {/* Title and Artist */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {album.albumTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                {album.artistName}
              </p>
              {album.artisticLabel && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {album.artisticLabel}
                </p>
              )}
            </div>

            {/* UPC Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                UPC: {album.upc}
              </span>
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
              {/* Primary Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-2xl p-4 text-center border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-center justify-center mb-2">
                    <Music size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {album.totalTracks}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    Tracks
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-4 text-center border border-emerald-100 dark:border-emerald-800/30">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatNumber(album.totalStreams)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    Streams
                  </div>
                </div>
              </div>

              {/* Revenue Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 text-center border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {formatCurrency(album.totalGrossIncome)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    Gross Revenue
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 text-center border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {formatCurrency(album.totalNetIncome)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    Net Revenue
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect Indicator */}
            <div className="mt-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                <span>View Album Details</span>
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default UpcAlbumCard;
