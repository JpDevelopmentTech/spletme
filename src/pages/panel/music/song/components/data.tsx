/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { CopyButton } from "@/components/ui/CopyButton";

export default function Data({ song }: { song: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="col-span-5 rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="mb-6 flex items-center justify-between"
      >
        <h3 className="bg-gradient-to-r from-primary to-quinary bg-clip-text text-xl font-bold text-transparent">
          Data
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg bg-quinary/10 px-4 py-2 text-sm font-medium text-quinary transition-all hover:bg-quinary/20"
          onClick={() => {
            document.getElementById("data-valora")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Ver más
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="space-y-1 border-b border-gray-200 py-4"
      >
        <p className="text-sm text-gray-500">&copy; 2021 Martha Paredes</p>
        <p className="text-sm text-gray-500">&copy; 2021 Martha Paredes</p>
      </motion.div>

      <div className="mt-6 space-y-4">
        {[
          {
            label: "UPC",
            value: song?.external_ids?.upc || "—",
            copyable: true,
          },
          {
            label: "ISRC",
            value: song?.external_ids?.isrc || "—",
            copyable: true,
          },
          {
            label: "Lanzamiento",
            value: song?.release_date || "—",
            copyable: false,
          },
          {
            label: "Duración",
            value: song?.duration_ms || "—",
            copyable: false,
          },
          { label: "Sello", value: song?.label || "—", copyable: false },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
          >
            <span className="font-medium text-gray-700">{item.label}:</span>
            <span className="inline-flex items-center gap-1.5">
              <motion.span
                whileHover={{ scale: 1.02 }}
                className="rounded-md bg-gray-100 px-3 py-1 text-gray-800"
              >
                {item.value}
              </motion.span>
              {item.copyable && item.value !== "—" && (
                <CopyButton value={String(item.value)} title={`Copiar ${item.label}`} />
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
