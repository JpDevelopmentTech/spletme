/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";

export default function Data({ song }: { song: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="col-span-5 bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="flex justify-between items-center mb-6"
      >
        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-quinary bg-clip-text text-transparent">Data</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-quinary/10 hover:bg-quinary/20 rounded-lg text-quinary font-medium text-sm transition-all"
          onClick={() => {
            document
              .getElementById("data-valora")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Ver más
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="border-b border-gray-200 py-4 space-y-1"
      >
        <p className="text-sm text-gray-500">&copy; 2021 Martha Paredes</p>
        <p className="text-sm text-gray-500">&copy; 2021 Martha Paredes</p>
      </motion.div>
      
      <div className="mt-6 space-y-4">
        {[
          { label: "UPC", value: song?.external_ids?.upc || "—" },
          { label: "ISRC", value: song?.external_ids?.isrc || "—" },
          { label: "Lanzamiento", value: song?.release_date || "—" },
          { label: "Duración", value: song?.duration_ms || "—" },
          { label: "Sello", value: song?.label || "—" }
        ].map((item, index) => (
          <motion.div 
            key={item.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-700">{item.label}:</span>
            <motion.span 
              whileHover={{ scale: 1.02 }}
              className="text-gray-800 bg-gray-100 px-3 py-1 rounded-md"
            >
              {item.value}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
