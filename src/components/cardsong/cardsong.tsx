import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMusicBrainz from "../../hooks/useMusicBrainz";
import ImageProfile from "../imageprofile/imageprofile";

interface CardSongProps {
  song?: {
    id: string;
    isrc?: string;
    trackTitle?: string;
    artistName?: string;
    artists?: any[];
    album?: {
      images: { url: string }[];
    };
  };
}

export default function CardSong({ song }: CardSongProps) {
  const { getRecordingByISRC, loading } = useMusicBrainz();
  const [recordingData, setRecordingData] = useState<any>(null);

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
  const coverImage = recordingData?.coverArt || song?.album?.images?.[0]?.url;

  if (!song) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <div className="bg-gradient-to-br from-white to-gray-100 p-5 rounded-2xl shadow-md border border-gray-200 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-gray-200 animate-pulse" />
            <div className="flex flex-col justify-between py-1 flex-1">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mt-2" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Link to={"/panel/song/" + song.id} className="block">
        <motion.div 
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-white to-gray-100 p-5 rounded-2xl shadow-md border border-gray-200 overflow-hidden relative"
        >
          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            {/* Cover Image with Animation */}
            <motion.div 
              className="relative aspect-square overflow-hidden rounded-xl shadow-lg border border-gray-200"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              ) : (
                <motion.img
                  src={coverImage}
                  className="w-full h-full object-cover"
                  alt={displayTitle}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.08, rotate: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              <motion.div 
                className="absolute bottom-2 left-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-sm font-medium text-gray-800 shadow-md"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                325K Streams
              </motion.div>
            </motion.div>

            {/* Song Details */}
            <div className="flex flex-col justify-between py-1 flex-1">
              <div>
                <motion.h3 
                  className="font-bold text-xl text-gray-800 tracking-tight line-clamp-1"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {displayTitle}
                </motion.h3>
                
                <motion.p 
                  className="text-base text-gray-600 mt-2 line-clamp-1"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {displayArtist}
                </motion.p>
              </div>
              
              {/* Artists Avatars with Animation */}
              {song.artists && song.artists.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">Artistas</p>
                  <div className="flex items-center">
                    <div className="flex -space-x-3">
                      {song.artists.slice(0, 3).map((artist: any, index: number) => (
                        <motion.div 
                          key={artist.id} 
                          initial={{ scale: 0.9, x: index * -5 }}
                          whileHover={{ scale: 1.1, y: -5, zIndex: 10 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className="border-2 border-white rounded-full shadow-md"
                        >
                          <ImageProfile id={artist.id} />
                        </motion.div>
                      ))}
                    </div>
                    {song.artists.length > 3 && (
                      <motion.span 
                        className="text-sm text-gray-600 ml-3"
                        whileHover={{ scale: 1.1 }}
                      >
                        +{song.artists.length - 3} más
                      </motion.span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Price & Stats */}
              <div className="flex items-center justify-between mt-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    $00,00
                  </span>
                  <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium shadow-sm">0%</span>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium shadow-md"
                >
                  Explorar
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Background glow effect */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30" />
        </motion.div>
      </Link>
    </motion.div>
  );
}