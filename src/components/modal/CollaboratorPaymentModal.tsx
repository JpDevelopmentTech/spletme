import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Music2,
} from "lucide-react";
import PaymentsService, { type CollaboratorReadiness } from "@/services/payments";
import { formatCurrency } from "@/utils/format.utils";
import type { CollaboratorPaymentModalProps } from "@/types";

type Step = "loading" | "confirm" | "processing" | "success";

/**
 * Modal de verificación para pagar el TOTAL pendiente de un colaborador (todas sus
 * canciones, un solo débito ACH). Al abrir consulta el readiness (total, desglose
 * por canción e issues) y solo permite confirmar si `canPay`.
 */
export function CollaboratorPaymentModal({
  isOpen,
  onClose,
  collaboratorId,
  collaboratorName,
  collaboratorEmail,
  onPaymentSuccess,
}: CollaboratorPaymentModalProps) {
  const [step, setStep] = useState<Step>("loading");
  const [readiness, setReadiness] = useState<CollaboratorReadiness | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReadiness = useCallback(async () => {
    setStep("loading");
    setError(null);
    setReadiness(null);
    const response = await PaymentsService.getCollaboratorReadiness(collaboratorId);
    if (response.error || !response.data) {
      setError(response.message ?? "No se pudo calcular el monto a pagar.");
      setStep("confirm");
      return;
    }
    setReadiness(response.data);
    setStep("confirm");
  }, [collaboratorId]);

  useEffect(() => {
    if (isOpen) loadReadiness();
  }, [isOpen, loadReadiness]);

  const handleClose = () => {
    setStep("loading");
    setReadiness(null);
    setError(null);
    onClose();
  };

  const handlePay = async () => {
    setError(null);
    setStep("processing");
    const response = await PaymentsService.payCollaborator(collaboratorId);
    if (response.error) {
      setError(response.message ?? "Error al procesar el pago.");
      setStep("confirm");
      return;
    }
    setStep("success");
    setTimeout(() => {
      onPaymentSuccess?.();
      handleClose();
    }, 2200);
  };

  const total = readiness?.totalPending ?? 0;
  const canPay = Boolean(readiness?.canPay) && total > 0;

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-orange-100 border-t-[#F97316] rounded-full"
      />
      <p className="text-sm text-gray-500">Calculando el monto pendiente...</p>
    </div>
  );

  const renderConfirm = () => (
    <div className="space-y-5">
      {/* Total */}
      <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#F97316]">
          Total a pagar
        </p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(total)}</p>
        <p className="mt-1 text-xs text-gray-500">
          Se cobrará por débito ACH desde tu cuenta y se enviará a {collaboratorName} vía Wise.
        </p>
      </div>

      {/* Desglose por canción */}
      {readiness && readiness.songs.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700">
            Canciones ({readiness.songs.length})
          </h4>
          <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-lg bg-gray-50 p-3">
            {readiness.songs.map((song) => (
              <div
                key={song.songId}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-gray-700">
                  <Music2 className="h-3.5 w-3.5 flex-shrink-0 text-[#F97316]" />
                  <span className="truncate">{song.trackTitle}</span>
                </span>
                <span className="flex-shrink-0 font-semibold text-gray-900">
                  {formatCurrency(song.pendingAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues que impiden el pago */}
      {readiness && readiness.issues.length > 0 && (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          {readiness.issues.map((issue) => (
            <p
              key={issue.code}
              className="flex items-start gap-2 text-sm text-amber-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {issue.message}
            </p>
          ))}
        </div>
      )}

      {/* Error de la petición */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={handleClose}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handlePay}
          disabled={!canPay}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Pagar {formatCurrency(total)}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        className="h-16 w-16 rounded-full border-4 border-orange-100 border-t-[#F97316]"
      />
      <div>
        <h3 className="text-lg font-bold text-gray-900">Procesando pago</h3>
        <p className="mt-1 text-sm text-gray-500">
          Iniciando el cobro de {formatCurrency(total)} por débito ACH...
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Enviando solicitud a Stripe</span>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
      >
        <CheckCircle className="h-10 w-10 text-green-600" />
      </motion.div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">¡Pago iniciado!</h3>
        <p className="mt-1 text-sm text-gray-500">
          El cobro por {formatCurrency(total)} se está procesando por ACH.
        </p>
      </div>
      <p className="max-w-sm text-xs text-gray-400">
        El débito ACH puede tardar algunos días en liquidar. Al confirmarse,
        {" "}
        {collaboratorName} recibirá su pago vía Wise.
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={step === "confirm" ? handleClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F97316]">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900">Pagar colaborador</h2>
                  <p className="truncate text-xs text-gray-500">
                    {collaboratorName} · {collaboratorEmail}
                  </p>
                </div>
              </div>
              {(step === "confirm" || step === "loading") && (
                <button
                  onClick={handleClose}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              {step === "loading" && renderLoading()}
              {step === "confirm" && renderConfirm()}
              {step === "processing" && renderProcessing()}
              {step === "success" && renderSuccess()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CollaboratorPaymentModal;
