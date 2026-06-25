import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import PaymentsService from "../../services/payments";

interface Collaborator {
  id?: string;
  name?: string;
  email?: string;
  percentage?: number | string;
  amountToPay?: number | string;
  [key: string]: unknown;
}

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle?: string;
  songId?: string;
  totalAmount?: number;
  collaborators?: Collaborator[];
  onPaymentSuccess?: () => void;
}

const StripePaymentModal = ({
  isOpen,
  onClose,
  songTitle,
  songId,
  totalAmount = 0,
  collaborators = [],
  onPaymentSuccess,
}: StripePaymentModalProps) => {
  const [step, setStep] = useState<"confirm" | "processing" | "success">(
    "confirm",
  );
  const [amount, setAmount] = useState<number>(totalAmount);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setStep("confirm");
      setAmount(totalAmount);
      setErrors({});
    }
  }, [isOpen, totalAmount]);

  const handlePayment = async () => {
    setErrors({});

    if (!songId) {
      setErrors({ general: "No se encontró el ID de la canción" });
      return;
    }

    setStep("processing");

    try {
      // Inicia el cobro ACH de regalías y el reparto a colaboradores vía Wise.
      // El backend calcula el monto a partir de los splits de la canción.
      const response = await PaymentsService.payRoyalties(songId);

      if (response.error) {
        setErrors({ general: response.message || "Error al procesar el pago" });
        setStep("confirm");
        return;
      }

      // Pago iniciado correctamente
      setStep("success");

      // Llamar al callback después de 2 segundos y cerrar el modal
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setErrors({
        general: "Error al procesar el pago. Por favor, intenta nuevamente.",
      });
      setStep("confirm");
    }
  };

  const handleClose = () => {
    setStep("confirm");
    setAmount(totalAmount);
    setErrors({});
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const renderConfirmStep = () => (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-blue-900/20">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <DollarSign className="mr-2 h-5 w-5 text-indigo-600" />
            Resumen del Pago
          </h3>
          <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
            <Users className="mr-1 h-4 w-4" />
            {collaborators.length} colaboradores
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Canción</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {songTitle}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monto Total
            </p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Info del cobro */}
      <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4 dark:bg-indigo-900/10">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Se cobrará{" "}
          <span className="font-semibold">{formatCurrency(amount)}</span> desde
          tu cuenta bancaria por débito ACH y se repartirá automáticamente a los
          colaboradores según sus splits. El monto lo calcula el sistema a
          partir de los splits de la canción.
        </p>
      </div>

      {/* Collaborators Preview */}
      {collaborators.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Colaboradores ({collaborators.length})
          </h4>
          <div className="max-h-32 space-y-2 overflow-y-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            {collaborators
              .slice(0, 3)
              .map((collaborator: Collaborator, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {collaborator.name ||
                      collaborator.email ||
                      `Colaborador ${index + 1}`}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {collaborator.percentage
                      ? `${collaborator.percentage}%`
                      : "0%"}
                    {collaborator.amountToPay
                      ? ` · $${collaborator.amountToPay}`
                      : ""}
                  </span>
                </div>
              ))}
            {collaborators.length > 3 && (
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                +{collaborators.length - 3} colaboradores más...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error General */}
      {errors.general && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="flex items-center text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="mr-2 h-4 w-4" />
            {errors.general}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={handleClose}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handlePayment}
          disabled={amount <= 0}
          className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 py-3 font-semibold text-white transition-all hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Pagar a todos</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="space-y-6 py-8 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mx-auto h-16 w-16 rounded-full border-4 border-indigo-200 border-t-indigo-600"
      />

      <div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          Procesando pago
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Iniciando el cobro de {formatCurrency(amount)} por débito ACH...
        </p>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-center justify-center space-x-2 text-blue-800 dark:text-blue-300">
          <Clock className="h-5 w-5" />
          <span className="font-medium">Enviando solicitud a Stripe</span>
        </div>
        <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          Al liquidar el ACH, los colaboradores recibirán su parte vía Wise
        </p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 py-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          ¡Pago iniciado!
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          El cobro por {formatCurrency(amount)} se está procesando por ACH
        </p>

        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-6 text-left dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Estado:
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              En proceso
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            El débito ACH puede tardar algunos días en liquidar. Cuando se
            confirme, los colaboradores recibirán automáticamente su parte vía
            Wise.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-gray-500 dark:text-gray-400"
      >
        Cerrando automáticamente...
      </motion.div>
    </div>
  );

  const getModalTitle = () => {
    switch (step) {
      case "confirm":
        return "Pagar a todos";
      case "processing":
        return "Procesando pago";
      case "success":
        return "Pago iniciado";
      default:
        return "Pago";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-md"
          onClick={step === "confirm" ? handleClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 dark:border-gray-700 dark:from-indigo-900/20 dark:to-blue-900/20">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreditCard className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getModalTitle()}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {songTitle}
                  </p>
                </div>
              </div>
              {step === "confirm" && (
                <button
                  onClick={handleClose}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              {step === "confirm" && renderConfirmStep()}
              {step === "processing" && renderProcessingStep()}
              {step === "success" && renderSuccessStep()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StripePaymentModal;
