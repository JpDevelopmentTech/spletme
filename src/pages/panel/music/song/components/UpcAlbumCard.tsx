/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { Disc, Music, DollarSign, TrendingUp, Play } from "lucide-react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/ui/CopyButton";
import type { Album } from "../../../../../models/album";

interface UpcAlbumCardProps {
  album: Album;
  index: number;
}

const UpcAlbumCard = ({ album, index }: UpcAlbumCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:shadow-2xl group-hover:-translate-y-2 group-hover:border-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:group-hover:border-indigo-600">
          {/* Album Cover/Icon Section */}
          <div className="relative p-8 pb-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <Disc size={40} className="text-white" />
                </div>
                {/* Play button overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Play size={20} className="text-white" fill="white" />
                </div>
              </div>
            </div>
          </div>

          {/* Album Information */}
          <div className="px-8 pb-8">
            {/* Title and Artist */}
            <div className="mb-6 text-center">
              <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {album.albumTitle}
              </h3>
              <p className="mb-1 font-medium text-gray-600 dark:text-gray-300">
                {album.artistName}
              </p>
              {album.artisticLabel && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {album.artisticLabel}
                </p>
              )}
            </div>

            {/* UPC Badge */}
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 dark:border-gray-600 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300">
                UPC: {album.upc}
                {album.upc && (
                  <CopyButton value={album.upc} title="Copiar UPC" />
                )}
              </span>
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
              {/* Primary Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 text-center dark:border-indigo-800/30 dark:from-indigo-900/20 dark:to-indigo-800/20">
                  <div className="mb-2 flex items-center justify-center">
                    <Music
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {album.totalTracks}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Tracks
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 text-center dark:border-emerald-800/30 dark:from-emerald-900/20 dark:to-emerald-800/20">
                  <div className="mb-2 flex items-center justify-center">
                    <TrendingUp
                      size={20}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(album.totalStreams)}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Streams
                  </div>
                </div>
              </div>

              {/* Revenue Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center dark:border-blue-800/30 dark:from-blue-900/20 dark:to-blue-800/20">
                  <div className="mb-2 flex items-center justify-center">
                    <DollarSign
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(album.totalGrossIncome)}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Gross Revenue
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100 p-4 text-center dark:border-purple-800/30 dark:from-purple-900/20 dark:to-purple-800/20">
                  <div className="mb-2 flex items-center justify-center">
                    <DollarSign
                      size={20}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(album.totalNetIncome)}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Net Revenue
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect Indicator */}
            <div className="mt-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <span>View Album Details</span>
                <svg
                  className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
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
