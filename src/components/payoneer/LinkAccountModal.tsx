import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Mail,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import { usePayoneer } from "../../hooks/usePayoneer";

interface LinkAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LinkAccountModal: React.FC<LinkAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { linkAccount, loading, error, clearError } = usePayoneer();
  const [step, setStep] = useState<"form" | "success">("form");

  // Form states
  const [payoneerEmail, setPayoneerEmail] = useState("");
  const [payoneerAccountId, setPayoneerAccountId] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleLinkAccount = async () => {
    clearError();

    if (!acceptTerms) {
      return;
    }

    try {
      await linkAccount(payoneerEmail, payoneerAccountId || undefined);
      setStep("success");
    } catch (error) {
      console.error("Error linking account:", error);
    }
  };

  const resetModal = () => {
    setStep("form");
    setPayoneerEmail("");
    setPayoneerAccountId("");
    setAcceptTerms(false);
    clearError();
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case "form":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <CreditCard className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Vincular Cuenta de Payoneer
              </h3>
              <p className="text-sm text-gray-600">
                Conecta tu cuenta de Payoneer para enviar y recibir pagos de
                forma gratuita
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email de Payoneer *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={payoneerEmail}
                    onChange={(e) => setPayoneerEmail(e.target.value)}
                    placeholder="tu-email@payoneer.com"
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Usa el mismo email que tienes registrado en tu cuenta de
                  Payoneer
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  ID de Cuenta Payoneer (opcional)
                </label>
                <input
                  type="text"
                  value={payoneerAccountId}
                  onChange={(e) => setPayoneerAccountId(e.target.value)}
                  placeholder="123456789"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Puedes encontrar este ID en tu cuenta de Payoneer
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">
                      ¿Cómo funciona?
                    </h4>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-inside list-disc space-y-1">
                        <li>Vinculamos tu cuenta de forma segura</li>
                        <li>Verificamos tu identidad con Payoneer</li>
                        <li>
                          Una vez verificado, podrás enviar y recibir pagos
                        </li>
                        <li>Las transferencias entre usuarios son gratuitas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  Acepto los{" "}
                  <button
                    type="button"
                    className="text-indigo-600 underline hover:text-indigo-500"
                    onClick={() =>
                      window.open(
                        "https://www.payoneer.com/legal/terms-conditions/",
                        "_blank",
                      )
                    }
                  >
                    términos y condiciones
                  </button>{" "}
                  de Payoneer y autorizo la vinculación de mi cuenta
                </label>
              </div>

              {error && (
                <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                onClick={handleLinkAccount}
                disabled={!payoneerEmail || !acceptTerms || loading}
                className="flex w-full items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LinkIcon className="h-4 w-4" />
                <span>{loading ? "Vinculando..." : "Vincular Cuenta"}</span>
              </button>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                ¡Cuenta Vinculada!
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Tu cuenta de Payoneer ha sido vinculada exitosamente
              </p>

              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium">{payoneerEmail}</span>
                </div>
                {payoneerAccountId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ID de Cuenta:</span>
                    <span className="font-medium">{payoneerAccountId}</span>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  <strong>Próximos pasos:</strong> Payoneer verificará tu
                  cuenta. Recibirás un email cuando el proceso esté completo.
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Continuar
            </button>
          </div>
        );

      default:
        return null;
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
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md rounded-xl bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Vincular Payoneer
              </h2>
              <button
                onClick={handleClose}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{renderStep()}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LinkAccountModal;
