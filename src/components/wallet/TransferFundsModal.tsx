import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mail, DollarSign, Wallet, AlertTriangle, User, CheckCircle2, Loader2 } from "lucide-react";

interface TransferFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onTransferConfirm: (amount: number, recipientEmail: string, note?: string) => Promise<{ error: boolean; message?: string }>;
}

export default function TransferFundsModal({
  isOpen,
  onClose,
  walletBalance,
  onTransferConfirm,
}: TransferFundsModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    recipientEmail: "",
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(formData.amount);

    // Validaciones
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount > walletBalance) {
      setError("Insufficient funds");
      return;
    }

    if (!formData.recipientEmail || !formData.recipientEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    // Mostrar modal de confirmación
    setShowConfirmation(true);
  };

  const handleConfirmTransfer = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const amount = parseFloat(formData.amount);
      const result = await onTransferConfirm(amount, formData.recipientEmail, formData.note || undefined);
      
      if (result.error) {
        // Asegurar que el mensaje sea siempre un string
        const errorMessage = typeof result.message === 'string' 
          ? result.message 
          : typeof result.message === 'object' && result.message !== null
            ? JSON.stringify(result.message)
            : "Error sending funds";
        setError(errorMessage);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        
        // Cerrar después de mostrar éxito
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      setError("Unexpected error occurred");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // No permitir cerrar mientras está cargando
    
    setFormData({
      amount: "",
      recipientEmail: "",
      note: "",
    });
    setError(null);
    setShowConfirmation(false);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {/* Main Transfer Modal */}
      <AnimatePresence>
        {isOpen && !showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
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
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Send Money
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Transfer funds to another user
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                {/* Available Balance */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Available Balance
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Recipient Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="recipient@example.com"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Amount to Send
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                {/* Note (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Note (Optional)
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Add a message (optional)"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
                  >
                    Continue
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Confirmation Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Warning Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Confirm Transfer
                    </h3>
                    <p className="text-amber-100 text-sm">
                      Please review the details
                    </p>
                  </div>
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

                {/* Success State */}
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Transfer Successful!
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your funds have been sent successfully
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 text-center">
                      Are you sure you want to send this money?
                    </p>

                    {/* Transfer Details */}
                    <div className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ${parseFloat(formData.amount || "0").toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">To:</span>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1 break-all">
                          {formData.recipientEmail}
                        </p>
                      </div>
                      {formData.note && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Note:</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {formData.note}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                      <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
                        ⚠️ This action cannot be undone. Make sure the recipient email is correct.
                      </p>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                {!success && (
                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleCancelConfirmation}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Go Back
                    </motion.button>
                    <motion.button
                      onClick={handleConfirmTransfer}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Confirm & Send"
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

