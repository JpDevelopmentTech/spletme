/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageProfile from "../../../../../components/imageprofile/imageprofile";
import Title from "../../../../../components/title/title";
import { motion } from "framer-motion";

export default function CardSong({ data }: { data: any }) {
  return (
    <motion.div 
      className="flex gap-6 p-4 bg-white/5 backdrop-blur-lg rounded-xl hover:bg-white/10 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.img
        src={data?.album.images[0].url}
        alt={data?.name}
        className="w-36 h-36 rounded-xl object-cover shadow-md"
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 } 
        }}
      />
      <div className="flex flex-col justify-between w-full">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Title
              title={data?.name}
              subtitle={data?.artists
                ?.map((item: any) => {
                  return item.name;
                })
                .join(", ")}
            />
          </motion.div>
          
          <motion.div 
            className="flex -space-x-3 mt-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {data?.artists.map((item: any, index: number) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <ImageProfile id={item.id} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="flex items-center justify-between mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span 
            className="text-2xl font-medium"
            whileHover={{ scale: 1.05 }}
          >
            $2.000,00
          </motion.span>
          
          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-sm font-medium text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Añadir
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
