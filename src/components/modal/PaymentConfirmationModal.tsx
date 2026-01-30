import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, User, Wallet, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  collaboratorName: string;
  collaboratorEmail: string;
  amount: number;
  walletBalance: number;
  currency?: string;
}

export default function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  collaboratorName,
  collaboratorEmail,
  amount,
  walletBalance,
  currency = "USD",
}: PaymentConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasInsufficientFunds = walletBalance < amount;
  const remainingBalance = walletBalance - amount;

  const handleConfirm = async () => {
    if (hasInsufficientFunds) {
      setError("Fondos insuficientes en tu wallet");
      return;
    }

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Confirmar Pago
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Revisa los detalles antes de continuar
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={loading}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Insufficient Funds Warning */}
              {hasInsufficientFunds && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-900 dark:text-amber-200 text-sm font-semibold mb-1">
                        Fondos Insuficientes
                      </p>
                      <p className="text-amber-800 dark:text-amber-300 text-sm">
                        No tienes suficiente balance en tu wallet para realizar este pago.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recipient Info */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 font-semibold">
                  Destinatario
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {collaboratorName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {collaboratorEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border-2 border-green-200 dark:border-green-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 font-semibold">
                  Monto a Pagar
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{currency}</span>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Balance Actual
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {!hasInsufficientFunds && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                          Balance Después del Pago
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading || hasInsufficientFunds}
                  whileHover={{ scale: hasInsufficientFunds ? 1 : 1.02 }}
                  whileTap={{ scale: hasInsufficientFunds ? 1 : 0.98 }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Procesando..." : hasInsufficientFunds ? "Fondos Insuficientes" : "Confirmar Pago"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

