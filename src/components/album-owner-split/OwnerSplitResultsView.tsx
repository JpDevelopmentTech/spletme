import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { CreationProgress } from "@/types/album-owner-split.types";

interface OwnerSplitResultsViewProps {
  progress: CreationProgress;
  autoCloseCountdown: number | null;
}

/**
 * Vista de resultados tras finalizar la creación masiva de owner splits.
 */
export function OwnerSplitResultsView({ progress, autoCloseCountdown }: OwnerSplitResultsViewProps) {
  const allSuccess = progress.failed === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {allSuccess ? (
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          ) : (
            <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          )}
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">Proceso Completado</h3>

        {autoCloseCountdown !== null && allSuccess && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-600 mt-2">
            Cerrando en {autoCloseCountdown} segundo{autoCloseCountdown !== 1 ? "s" : ""}...
          </motion.p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-600">{progress.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-600">{progress.completed}</div>
            <div className="text-sm text-gray-600">Exitosos</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="text-3xl font-bold text-red-600">{progress.failed}</div>
            <div className="text-sm text-gray-600">Fallidos</div>
          </div>
        </div>

        {progress.errors.length > 0 && (
          <div className="mt-6 text-left">
            <h4 className="font-semibold text-gray-900 mb-3">Errores encontrados:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {progress.errors.map((error, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="font-medium text-red-900">{error.songTitle}</div>
                  <div className="text-sm text-red-700">{error.error}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
