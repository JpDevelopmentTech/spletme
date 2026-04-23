import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { OnboardingData, OnboardingService } from "../../../services/onboarding";

interface VerificationStepProps {
  nextStep: (data?: Partial<OnboardingData>) => void;
  prevStep: () => void;
  initialData?: OnboardingData;
  verificationEmail: string;
}

const CODE_LENGTH = 6;

const VerificationStep = ({
  nextStep,
  prevStep,
  verificationEmail,
}: VerificationStepProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");
    setSuccessMessage("");

    // Auto-focus next input
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length && i < CODE_LENGTH; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    setError("");
    setSuccessMessage("");
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(digit => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResendCode = async () => {
    if (!verificationEmail) {
      setError("No encontramos tu correo para reenviar el código.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsResending(true);
    try {
      const response = await OnboardingService.requestAccountVerificationCode(
        verificationEmail,
      );

      if (!response.accepted) {
        setError("No fue posible reenviar el código.");
        return;
      }

      setCountdown(60);
      setSuccessMessage("Te enviamos un nuevo código de verificación.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible reenviar el código.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    
    if (fullCode.length !== CODE_LENGTH) {
      setError("Por favor ingresa el código completo");
      return;
    }

    if (!/^\d{6}$/.test(fullCode)) {
      setError("El código debe contener solo números");
      return;
    }

    if (!verificationEmail) {
      setError("No encontramos tu correo para validar el código.");
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccessMessage("");

    try {
      const verificationResponse = await OnboardingService.verifyAccountCode(
        verificationEmail,
        fullCode,
      );

      if (!verificationResponse.verified) {
        setError("Código inválido o expirado.");
        return;
      }

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.accountVerified = true;
        localStorage.setItem("user", JSON.stringify(user));
      }

      nextStep({
        whatsappVerified: true,
      });
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Código inválido o expirado.",
      );
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== "");
  const emailToVerify = verificationEmail || "tu correo";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full text-white text-3xl shadow-lg"
        >
          📧
        </motion.div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Verifica tu cuenta
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Hemos enviado un código de verificación a{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {emailToVerify}
            </span>
          </p>
        </div>
      </div>

      {/* Code Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex justify-center space-x-3">
          {code.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`w-12 h-12 text-center text-xl font-bold rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                digit
                  ? "border-gray-500 bg-gray-50 text-gray-700 dark:border-gray-400 dark:bg-gray-800/60 dark:text-gray-300"
                  : error
                  ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                  : "border-gray-200 bg-white hover:border-gray-300 focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-gray-400"
              } dark:text-white`}
            />
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center justify-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </p>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Resend Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-3"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿No recibiste el código?
        </p>
        
        {countdown > 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Podrás solicitar un nuevo código en{" "}
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              {countdown}s
            </span>
          </p>
        ) : (
          <button
            onClick={handleResendCode}
            disabled={isResending || isVerifying}
            className="text-sm font-semibold text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
          >
            {isResending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </div>
            ) : (
              "Reenviar código"
            )}
          </button>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-start space-x-3">
          <div className="text-gray-500 text-xl">💡</div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Consejos para recibir el código
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Revisa tu bandeja de entrada y spam</li>
              <li>• Verifica que tu correo sea correcto</li>
              <li>• Asegúrate de tener conexión a internet</li>
              <li>• El código expira en 10 minutos</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex space-x-4 pt-6"
      >
        <button
          onClick={prevStep}
          disabled={isVerifying}
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
        >
          ← Anterior
        </button>
        
        <button
          onClick={handleVerify}
          disabled={!isCodeComplete || isVerifying}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
            isCodeComplete && !isVerifying
              ? "bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
          }`}
        >
          {isVerifying ? "Verificando..." : "Verificar →"}
        </button>
      </motion.div>
    </div>
  );
};

export default VerificationStep; 
