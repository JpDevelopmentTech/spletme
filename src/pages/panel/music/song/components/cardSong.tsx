/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageProfile from "../../../../../components/imageprofile/imageprofile";
import Title from "../../../../../components/title/title";
import { motion } from "framer-motion";
import { Heart, Play, Share2, Plus, Music, User } from "lucide-react";
import { useState } from "react";

export default function CardSong({ data }: { data: any }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div 
      className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <Title
            title={data?.name}
            subtitle={data?.artists
              ?.map((item: any) => {
                return item.name;
              })
              .join(", ")}
          />
          
          {/* Artist Icons */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <User className="w-4 h-4" />
            <span className="text-sm">{data?.artists?.length || 0} artistas</span>
          </div>
        </motion.div>
        
        {/* Artists Avatars */}
        {data?.artists && data.artists.length > 0 && (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Colaboradores</p>
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {data.artists.map((item: any, index: number) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.2, y: -8, zIndex: 10 }}
                    className="border-2 border-white/80 rounded-full shadow-lg"
                  >
                    <ImageProfile id={item.id} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Action Buttons */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2.5 rounded-full transition-all duration-200 ${
              isLiked 
                ? "bg-red-500/20 text-red-500 shadow-lg" 
                : "bg-gray-200/50 text-gray-600 hover:bg-red-500/20 hover:text-red-500 hover:shadow-md"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-full bg-gray-200/50 text-gray-600 hover:bg-blue-500/20 hover:text-blue-500 hover:shadow-md transition-all duration-200"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-full bg-gray-200/50 text-gray-600 hover:bg-green-500/20 hover:text-green-500 hover:shadow-md transition-all duration-200"
          >
            <Play className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        {/* Price and Add Button */}
        <motion.div 
          className="flex items-center justify-between pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            $2.000,00
          </motion.span>
          
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            Añadir
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
