import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, DollarSign, AlertTriangle, CheckCircle, ArrowDownToLine } from "lucide-react";
import WalletService from "@/services/wallet";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onWithdrawalSuccess: () => void;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
  walletBalance,
  onWithdrawalSuccess,
}: WithdrawalModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [loadingFields, setLoadingFields] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [payoutMethods, setPayoutMethods] = useState<unknown[]>([]);
  const [requiredFields, setRequiredFields] = useState<unknown[]>([]);
  const [formData, setFormData] = useState({
    amount: "",
    payoutMethodType: "",
    beneficiaryDetails: {} as Record<string, string>,
  });

  useEffect(() => {
    if (isOpen) {
      fetchPayoutMethods();
    }
  }, [isOpen]);

  const fetchPayoutMethods = async () => {
    setLoadingMethods(true);
    setError(null);
    try {
      const response = await WalletService.getPayoutMethodTypes();
  
      console.log('Payout methods response:', response);
      
      if (!response.error && response.data) {
        // El backend ahora retorna directamente los datos sin el wrapper body
        const methods = Array.isArray(response.data) ? response.data : [];
        console.log('Payout methods:', methods);
        setPayoutMethods(methods);
      } else {
        setError(response.message || "Error loading payout methods");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error loading payout methods";
      setError(errorMessage);
    } finally {
      setLoadingMethods(false);
    }
  };

  const fetchRequiredFields = async (payoutMethodType: string) => {
    setLoadingFields(true);
    setError(null);
    setRequiredFields([]);
    try {
      const response = await WalletService.getRequiredFieldsForPayoutMethod(payoutMethodType);
      console.log('Required fields response:', response);
      
      if (!response.error && response.data) {
        // El backend ahora retorna directamente los datos sin el wrapper body
        const fieldsData = response.data as { fields?: unknown[] };
        const fields = fieldsData.fields || [];
        console.log('Required fields:', fields);
        setRequiredFields(fields);
      } else {
        setError(response.message || "Error loading required fields");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error loading required fields";
      setError(errorMessage);
    } finally {
      setLoadingFields(false);
    }
  };

  const handlePayoutMethodChange = async (payoutMethodType: string) => {
    setFormData({
      ...formData,
      payoutMethodType,
      beneficiaryDetails: {},
    });
    
    if (payoutMethodType) {
      await fetchRequiredFields(payoutMethodType);
    } else {
      setRequiredFields([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

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

    if (!formData.payoutMethodType) {
      setError("Please select a payout method");
      return;
    }

    setLoading(true);

    try {
      const response = await WalletService.requestWithdrawal({
        amount,
        payoutMethodType: formData.payoutMethodType,
        beneficiaryDetails: formData.beneficiaryDetails,
      });

      if (!response.error) {
        setSuccess(true);
        setTimeout(() => {
          onWithdrawalSuccess();
          handleClose();
        }, 2000);
      } else {
        setError(response.message || "Error requesting withdrawal");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error requesting withdrawal";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: "",
      payoutMethodType: "",
      beneficiaryDetails: {},
    });
    setRequiredFields([]);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleBeneficiaryFieldChange = (fieldName: string, value: string) => {
    setFormData({
      ...formData,
      beneficiaryDetails: {
        ...formData.beneficiaryDetails,
        [fieldName]: value,
      },
    });
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
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ArrowDownToLine className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Withdraw Funds
                    </h2>
                    <p className="text-green-100 text-sm">
                      Transfer money to your bank account
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={loading}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Withdrawal request submitted successfully!
                    </p>
                  </div>
                </motion.div>
              )}

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

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  disabled={loading || success}
                />
              </div>

              {/* Payout Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payout Method
                </label>
                {loadingMethods ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <select
                    value={formData.payoutMethodType}
                    onChange={(e) => handlePayoutMethodChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    disabled={loading || success}
                  >
                    <option value="">Select a payout method</option>
                    {payoutMethods.map((method) => {
                      const m = method as { payout_method_type: string; name?: string };
                      return (
                        <option key={m.payout_method_type} value={m.payout_method_type}>
                          {m.name || m.payout_method_type.replace(/_/g, ' ').toUpperCase()}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* Loading Fields Indicator */}
              {loadingFields && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-3"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Loading fields...</span>
                </div>
              )}

              {/* Dynamic Required Fields */}
              {!loadingFields && requiredFields.length > 0 && (
                <div className="space-y-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Required Payment Details
                  </h3>
                  {requiredFields.map((field) => {
                    const f = field as { 
                      name: string; 
                      type: string; 
                      is_required: boolean; 
                      instructions?: string; 
                      regex?: string;
                    };
                    return (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {f.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        {f.is_required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {f.instructions && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 italic">
                          💡 {f.instructions}
                        </p>
                      )}
                      <input
                        type={f.type === 'number' ? 'number' : 'text'}
                        value={formData.beneficiaryDetails[f.name] || ''}
                        onChange={(e) => handleBeneficiaryFieldChange(f.name, e.target.value)}
                        required={f.is_required}
                        pattern={f.regex || undefined}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder={f.instructions || f.name.replace(/_/g, ' ')}
                        disabled={loading || success}
                      />
                    </div>
                    );
                  })}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={loading || success}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading || success || loadingMethods}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : success ? "Success!" : "Submit Withdrawal"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

