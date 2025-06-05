import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface VerificationStepProps {
  nextStep: () => void;
  prevStep: () => void;
}

const VerificationStep = ({ nextStep, prevStep }: VerificationStepProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
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
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    
    setCode(newCode);
    setError("");
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(digit => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setCountdown(60);
    
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    
    if (fullCode.length !== 6) {
      setError("Por favor ingresa el código completo");
      return;
    }

    if (!/^\d{6}$/.test(fullCode)) {
      setError("El código debe contener solo números");
      return;
    }

    // Simulate verification
    if (fullCode === "123456") {
      nextStep();
    } else {
      setError("Código incorrecto. Intenta nuevamente.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const isCodeComplete = code.every(digit => digit !== "");
  const phoneNumber = "+57 300 123 4567"; // This would come from previous step

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full text-white text-3xl shadow-lg"
        >
          📱
        </motion.div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Verifica tu número de WhatsApp
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Hemos enviado un código de verificación a{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {phoneNumber}
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
              className={`w-12 h-12 text-center text-xl font-bold rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                digit
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300"
                  : error
                  ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                  : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-blue-400"
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
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {countdown}s
            </span>
          </p>
        ) : (
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
          >
            {isResending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Consejos para recibir el código
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Verifica que WhatsApp esté instalado y activo</li>
              <li>• Revisa tu bandeja de mensajes de WhatsApp</li>
              <li>• Asegúrate de tener conexión a internet</li>
              <li>• El código expira en 10 minutos</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Demo Code Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800"
      >
        <div className="flex items-start space-x-3">
          <div className="text-yellow-500 text-xl">🧪</div>
          <div>
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
              Modo Demo
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Para esta demostración, usa el código: <span className="font-mono font-bold">123456</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex space-x-4 pt-6"
      >
        <button
          onClick={prevStep}
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>←</span>
          <span>Anterior</span>
        </button>
        
        <button
          onClick={handleVerify}
          disabled={!isCodeComplete}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            isCodeComplete
              ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
          }`}
        >
          <span>Verificar</span>
          <motion.div
            animate={{ x: isCodeComplete ? [0, 5, 0] : 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.div>
        </button>
      </motion.div>
    </div>
  );
};

export default VerificationStep; 