import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, DollarSign, AlertTriangle, CheckCircle, ArrowDownToLine } from "lucide-react";
import Select from "react-select";
import WalletService from "@/services/wallet";
import { selectStyles } from "@/components/ui/selectStyles";

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

      console.log("Payout methods response:", response);

      if (!response.error && response.data) {
        // El backend ahora retorna directamente los datos sin el wrapper body
        const methods = Array.isArray(response.data) ? response.data : [];
        console.log("Payout methods:", methods);
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
      console.log("Required fields response:", response);

      if (!response.error && response.data) {
        // El backend ahora retorna directamente los datos sin el wrapper body
        const fieldsData = response.data as { fields?: unknown[] };
        const fields = fieldsData.fields || [];
        console.log("Required fields:", fields);
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
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                    <ArrowDownToLine className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
                    <p className="text-sm text-green-100">Transfer money to your bank account</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 transition-colors hover:text-white"
                  disabled={loading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
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
                  className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Available Balance */}
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Available Balance
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    $
                    {walletBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <DollarSign className="mr-2 inline h-4 w-4" />
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  disabled={loading || success}
                />
              </div>

              {/* Payout Methods */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payout Method
                </label>
                {loadingMethods ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <Select
                    value={
                      formData.payoutMethodType
                        ? {
                            value: formData.payoutMethodType,
                            label:
                              (payoutMethods.find(
                                (method) =>
                                  (method as { payout_method_type: string }).payout_method_type ===
                                  formData.payoutMethodType,
                              ) as { name?: string; payout_method_type: string } | undefined)?.name ||
                              formData.payoutMethodType.replace(/_/g, " ").toUpperCase(),
                          }
                        : null
                    }
                    onChange={(opt) => handlePayoutMethodChange(opt?.value || "")}
                    options={payoutMethods.map((method) => {
                      const m = method as {
                        payout_method_type: string;
                        name?: string;
                      };
                      return {
                        value: m.payout_method_type,
                        label: m.name || m.payout_method_type.replace(/_/g, " ").toUpperCase(),
                      };
                    })}
                    placeholder="Select a payout method"
                    isDisabled={loading || success}
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    isClearable
                  />
                )}
              </div>

              {/* Loading Fields Indicator */}
              {loadingFields && (
                <div className="flex items-center justify-center py-4">
                  <div className="mr-3 h-6 w-6 animate-spin rounded-full border-b-2 border-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Loading fields...
                  </span>
                </div>
              )}

              {/* Dynamic Required Fields */}
              {!loadingFields && requiredFields.length > 0 && (
                <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <DollarSign className="h-4 w-4" />
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
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {f.name
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          {f.is_required && <span className="ml-1 text-red-500">*</span>}
                        </label>
                        {f.instructions && (
                          <p className="mb-1 text-xs italic text-gray-500 dark:text-gray-400">
                            💡 {f.instructions}
                          </p>
                        )}
                        <input
                          type={f.type === "number" ? "number" : "text"}
                          value={formData.beneficiaryDetails[f.name] || ""}
                          onChange={(e) => handleBeneficiaryFieldChange(f.name, e.target.value)}
                          required={f.is_required}
                          pattern={f.regex || undefined}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder={f.instructions || f.name.replace(/_/g, " ")}
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
                  className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading || success || loadingMethods}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
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
