import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, User, AlertTriangle, Landmark } from "lucide-react";
import { useState } from "react";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  collaboratorName: string;
  collaboratorEmail: string;
  amount: number;
  currency?: string;
}

/**
 * Modal de confirmación para pagar a un colaborador individual. El cobro se hace
 * por débito ACH a la cuenta del owner y el reparto al colaborador vía Wise; no
 * depende de ningún balance de wallet previo.
 */
export default function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  collaboratorName,
  collaboratorEmail,
  amount,
  currency = "USD",
}: PaymentConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al procesar el pago";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Confirmar Pago</h2>
                    <p className="text-sm text-blue-100">Revisa los detalles antes de continuar</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 transition-colors hover:text-white"
                  disabled={loading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Recipient Info */}
              <div className="rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 p-4 dark:from-gray-700 dark:to-blue-900/20">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Destinatario
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {collaboratorName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{collaboratorEmail}</p>
                  </div>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Monto a Pagar
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    $
                    {amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{currency}</span>
                </div>
              </div>

              {/* Info del cobro */}
              <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <Landmark className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Se cobrará este monto desde tu cuenta bancaria por débito ACH y se enviará al
                  colaborador vía Wise. El ACH puede tardar unos días en liquidar.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Procesando..." : "Confirmar Pago"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
