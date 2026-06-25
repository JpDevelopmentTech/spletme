import { motion } from "framer-motion";
import { Music } from "lucide-react";
import type { CreationProgress } from "@/types/album-owner-split.types";

interface OwnerSplitProgressViewProps {
  progress: CreationProgress;
}

/**
 * Vista de progreso en tiempo real durante la creación masiva de owner splits.
 */
export function OwnerSplitProgressView({
  progress,
}: OwnerSplitProgressViewProps) {
  const processed = progress.completed + progress.failed;
  const pct = Math.round((processed / progress.total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            Creando Splits...
          </h3>
          <p className="text-gray-600">
            {processed} de {progress.total} canciones procesadas
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Progreso</span>
            <span>{pct}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {progress.current && (
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Music className="h-5 w-5 text-amber-600" />
            </motion.div>
            <div>
              <div className="text-sm text-gray-600">Procesando:</div>
              <div className="font-medium text-gray-900">
                {progress.current}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {progress.completed}
            </div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
          <div className="rounded-xl bg-red-50 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {progress.failed}
            </div>
            <div className="text-sm text-gray-600">Fallidos</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
