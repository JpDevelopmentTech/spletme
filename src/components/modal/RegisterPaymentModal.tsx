import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  DollarSign,
  Calendar,
  Globe,
  Music,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { useSplits } from "../../hooks/useSplits";

interface RegisterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  splitId: string;
  songTitle?: string;
  onPaymentRegistered?: (paymentId: string) => void;
}

const RegisterPaymentModal = ({
  isOpen,
  onClose,
  splitId,
  songTitle,
}: RegisterPaymentModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [platform, setPlatform] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [preview, setPreview] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [paymentLoading] = useState(false);
  const [calculationLoading] = useState(false);

  const {
    loading: splitsLoading,
    error: splitsError,
    getSplitsBySong,
  } = useSplits();

  const platforms = [
    "Spotify",
    "Apple Music",
    "YouTube Music",
    "Amazon Music",
    "Deezer",
    "Tidal",
    "SoundCloud",
    "Bandcamp",
    "Pandora",
    "iHeartRadio",
  ];

  const countries = [
    "Colombia",
    "Estados Unidos",
    "México",
    "Argentina",
    "España",
    "Brasil",
    "Chile",
    "Perú",
    "Ecuador",
    "Venezuela",
    "Uruguay",
    "Paraguay",
    "Reino Unido",
    "Francia",
    "Alemania",
    "Italia",
    "Canadá",
    "Australia",
  ];

  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount(0);
      setDate(new Date().toISOString().split("T")[0]);
      setPlatform("");
      setCountry("");
      setPreview(null);
      setErrors({});
    }
  }, [isOpen]);

  // Load splits when modal opens
  useEffect(() => {
    if (isOpen && splitId) {
      loadSplits();
    }
  }, [isOpen, splitId]);

  const loadSplits = async () => {
    try {
      const splits = await getSplitsBySong(splitId);
      setPreview({ splits: splits || [] });
    } catch (error) {
      console.error("Error loading splits:", error);
    }
  };

  const handleSubmit = async () => {
    // This would integrate with payment system when available
    console.log("Payment registration not yet implemented");
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const isFormValid = () => {
    return amount > 0 && date && !splitsLoading;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Registrar Pago
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {songTitle || "Canción"} - Nuevo pago de regalías
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={splitsLoading}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-140px)]">
              {/* Left Panel - Form */}
              <div className="w-1/2 overflow-y-auto border-r border-gray-200 p-6 dark:border-gray-700">
                {/* Error Display */}
                {splitsError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                    <p className="flex items-center text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {splitsError}
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <DollarSign className="mr-2 inline h-4 w-4" />
                      Monto del Pago *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 transform font-medium text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount || ""}
                        onChange={(e) => {
                          setAmount(parseFloat(e.target.value) || 0);
                          if (errors.amount) {
                            setErrors((prev) => ({ ...prev, amount: "" }));
                          }
                        }}
                        placeholder="0.00"
                        disabled={paymentLoading}
                        className={`w-full rounded-xl border-2 py-3 pl-8 pr-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                          errors.amount
                            ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                            : "border-gray-200 bg-white hover:border-gray-300 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-green-400"
                        } dark:text-white dark:placeholder-gray-400`}
                      />
                    </div>
                    {errors.amount && (
                      <p className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.amount}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Ingresa el monto total a distribuir entre los
                      participantes
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Calendar className="mr-2 inline h-4 w-4" />
                      Fecha del Pago *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) {
                          setErrors((prev) => ({ ...prev, date: "" }));
                        }
                      }}
                      disabled={paymentLoading}
                      className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.date
                          ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                          : "border-gray-200 bg-white hover:border-gray-300 focus:border-green-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-green-400"
                      } dark:text-white`}
                    />
                    {errors.date && (
                      <p className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Platform (Optional) */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Music className="mr-2 inline h-4 w-4" />
                      Plataforma (Opcional)
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      disabled={paymentLoading}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all duration-300 hover:border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-gray-500 dark:focus:border-green-400"
                    >
                      <option value="">Seleccionar plataforma...</option>
                      {platforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Especifica la plataforma si el pago proviene de una fuente
                      específica
                    </p>
                  </div>

                  {/* Country (Optional) */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <Globe className="mr-2 inline h-4 w-4" />
                      País (Opcional)
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={paymentLoading}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all duration-300 hover:border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-gray-500 dark:focus:border-green-400"
                    >
                      <option value="">Seleccionar país...</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Especifica el país si el pago tiene restricciones
                      geográficas
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="w-1/2 overflow-y-auto p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Vista Previa de Distribución
                </h3>

                {calculationLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      Calculando distribución...
                    </span>
                  </div>
                ) : preview ? (
                  <div className="space-y-4">
                    {/* Filters Applied */}
                    {(platform || country) && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {platform && (
                          <div className="flex items-center space-x-2 rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-900/30">
                            <Music className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                              {platform}
                            </span>
                          </div>
                        )}
                        {country && (
                          <div className="flex items-center space-x-2 rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/30">
                            <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-300">
                              {country}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Owner */}
                    <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-indigo-900 dark:text-indigo-100">
                          {preview.owner.name}
                        </span>
                        <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                          {preview.owner.percentage}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
                          {formatCurrency(preview.owner.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="space-y-3">
                      {preview.participants.map(
                        (participant: any, index: number) => (
                          <div
                            key={index}
                            className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {participant.name}
                              </span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {participant.percentage}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                {participant.appliedConditions.length > 0 && (
                                  <div className="mb-2 flex flex-wrap gap-1">
                                    {participant.appliedConditions.map(
                                      (condition: any, condIndex: number) => (
                                        <span
                                          key={condIndex}
                                          className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                        >
                                          {condition}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                {formatCurrency(participant.amount)}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Total */}
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-800 dark:text-green-200">
                          Total a Distribuir:
                        </span>
                        <span className="text-xl font-bold text-green-800 dark:text-green-200">
                          {formatCurrency(preview.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : amount > 0 ? (
                  <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <DollarSign className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>Ingresa un monto para ver la distribución</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <DollarSign className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>Completa los datos para ver la vista previa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
              <button
                onClick={onClose}
                disabled={paymentLoading}
                className="px-6 py-2 text-gray-600 transition-colors hover:text-gray-800 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || paymentLoading}
                className={`flex items-center space-x-2 rounded-lg px-6 py-2 font-medium transition-all duration-200 ${
                  isFormValid() && !paymentLoading
                    ? "bg-green-600 text-white shadow-lg hover:bg-green-700 hover:shadow-xl"
                    : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Registrar Pago</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterPaymentModal;
