/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMusicBrainz from "../../hooks/useMusicBrainz";
import ImageProfile from "../imageprofile/imageprofile";
import { Play, Heart, Share2, Music, User } from "lucide-react";

interface CardSongProps {
  song?: {
    _id: string;
    isrc?: string;
    trackTitle?: string;
    artistName?: string;
    artists?: any[];
    album?: {
      images: { url: string }[];
    };
    percetaje?: number;
    spotifyData?: any;
  };
}

export default function CardSong({ song }: CardSongProps) {
  const { getRecordingByISRC } = useMusicBrainz();
  const [recordingData, setRecordingData] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchRecordingData = async () => {
      if (song?.isrc) {
        const data = await getRecordingByISRC(song.isrc);
        if (data) {
          setRecordingData(data);
        }
      }
    };

    fetchRecordingData();
  }, [song?.isrc]);

  // Use MusicBrainz data if available, otherwise fallback to song data
  const displayTitle = recordingData?.title || song?.trackTitle || 'Unknown Title';
  const displayArtist = recordingData?.artist || song?.artistName || 'Unknown Artist';
  const dataSpotify = song?.spotifyData;

  if (!song) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden relative">
          <div className="animate-pulse space-y-4">
            <div className="w-full aspect-[4/3] bg-gray-300/20 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-300/20 rounded w-3/4" />
              <div className="h-3 bg-gray-300/20 rounded w-1/2" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full group"
    >
      <motion.div 
        whileHover={{ 
          y: -12,
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
        className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden cursor-pointer"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Image Section */}
          <div className="relative mb-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              {dataSpotify?.album?.images && dataSpotify?.album.images.length > 0 ? (
                <motion.img
                  src={dataSpotify.album.images[0].url}
                  alt={`${displayTitle} cover`}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200/20 to-gray-300/20 flex items-center justify-center">
                  <Music className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Play Button Overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl"
                >
                  {isPlaying ? (
                    <div className="w-6 h-6 bg-gray-800 rounded-sm" />
                  ) : (
                    <Play className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" />
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Song Info */}
          <div className="space-y-4">
            <div>
              <motion.h3 
                className="font-bold text-xl text-gray-800 dark:text-white tracking-tight line-clamp-2 mb-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {displayTitle}
              </motion.h3>
              
              <motion.p 
                className="text-base text-gray-600 dark:text-gray-300 flex items-center gap-2"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                <User className="w-4 h-4" />
                {displayArtist}
              </motion.p>
            </div>
            
            {/* Artists Avatars */}
            {song.artists && song.artists.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Artistas</p>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {song.artists.slice(0, 3).map((artist: any, index: number) => (
                      <motion.div 
                        key={artist.id} 
                        initial={{ scale: 0.8, x: index * -10 }}
                        animate={{ scale: 1, x: 0 }}
                        whileHover={{ scale: 1.2, y: -8, zIndex: 10 }}
                        transition={{ type: "spring", stiffness: 400, delay: index * 0.1 }}
                        className="border-2 border-white/80 rounded-full shadow-lg"
                      >
                        <ImageProfile id={artist.id} />
                      </motion.div>
                    ))}
                  </div>
                  {song.artists.length > 3 && (
                    <motion.span 
                      className="text-sm text-gray-600 dark:text-gray-400 ml-3 bg-white/50 px-2 py-1 rounded-full"
                      whileHover={{ scale: 1.1 }}
                    >
                      +{song.artists.length - 3} más
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Stats and Actions */}
            <div className="space-y-4 pt-4">
              {/* Price and Percentage */}
              <div className="flex items-center justify-between">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    $00,00
                  </span>
                  <span className="text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-700 dark:text-green-300 font-medium border border-green-200/50">
                    {song?.percetaje || "No tienes porcentaje asignado"}
                  </span>
                </motion.div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full transition-colors duration-200 ${
                      isLiked 
                        ? "bg-red-500/20 text-red-500" 
                        : "bg-gray-200/50 text-gray-600 hover:bg-red-500/20 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-gray-200/50 text-gray-600 hover:bg-blue-500/20 hover:text-blue-500 transition-colors duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <Link to={"/panel/song/" + song._id}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    Explorar
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}