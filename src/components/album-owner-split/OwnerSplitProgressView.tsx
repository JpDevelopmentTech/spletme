import { motion } from "framer-motion";
import { Music } from "lucide-react";
import type { CreationProgress } from "@/types/album-owner-split.types";

interface OwnerSplitProgressViewProps {
  progress: CreationProgress;
}

/**
 * Vista de progreso en tiempo real durante la creación masiva de owner splits.
 */
export function OwnerSplitProgressView({ progress }: OwnerSplitProgressViewProps) {
  const processed = progress.completed + progress.failed;
  const pct = Math.round((processed / progress.total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Creando Splits...</h3>
          <p className="text-gray-600">
            {processed} de {progress.total} canciones procesadas
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {progress.current && (
          <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5 text-amber-600" />
            </motion.div>
            <div>
              <div className="text-sm text-gray-600">Procesando:</div>
              <div className="font-medium text-gray-900">{progress.current}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{progress.completed}</div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
            <div className="text-sm text-gray-600">Fallidos</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
