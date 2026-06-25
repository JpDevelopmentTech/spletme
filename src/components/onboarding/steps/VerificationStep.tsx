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

const VerificationStep = ({ nextStep, prevStep, verificationEmail }: VerificationStepProps) => {
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
    const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
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
      const response = await OnboardingService.requestAccountVerificationCode(verificationEmail);

      if (!response.accepted) {
        setError("No fue posible reenviar el código.");
        return;
      }

      setCountdown(60);
      setSuccessMessage("Te enviamos un nuevo código de verificación.");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "No fue posible reenviar el código.",
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

  const isCodeComplete = code.every((digit) => digit !== "");
  const emailToVerify = verificationEmail || "tu correo";

  return (
    <motion.div className="flex flex-col gap-5">
      {/* Header */}
      <div className="space-y-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-3xl text-white shadow-lg"
        >
          📧
        </motion.div>

        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Verifica tu cuenta
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Hemos enviado un código de verificación a{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{emailToVerify}</span>
          </p>
        </div>
      </div>

      {/* Code boxes */}
      <div className="flex justify-center gap-2.5">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="text-center text-[22px] font-bold outline-none transition-colors"
            style={{
              width: 52,
              height: 60,
              borderRadius: 10,
              backgroundColor: digit ? "#FFF7ED" : "#FFFFFF",
              border: digit
                ? "2px solid #F97316"
                : error
                  ? "1.5px solid #FCA5A5"
                  : "1.5px solid #E5E7EB",
              color: digit ? "#F97316" : "#111827",
            }}
          />
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="flex items-center justify-center space-x-1 text-sm text-red-600 dark:text-red-400">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
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
          <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
        </motion.div>
      )}
      {/* Resend */}
      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-[#9CA3AF]">
            ¿No recibiste el código? Reenviar en <span className="font-semibold">{countdown}s</span>
          </p>
        ) : (
          <button
            onClick={handleResendCode}
            disabled={isResending || isVerifying}
            className="text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {isResending ? "Enviando..." : "Reenviar código"}
          </button>
        )}
      </div>

      {/* Info box */}
      <div
        className="flex items-start gap-2.5"
        style={{
          backgroundColor: "#F0F9FF",
          border: "1px solid #BAE6FD",
          borderRadius: 10,
          padding: 14,
        }}
      >
        <div className="flex items-start space-x-3">
          <div className="text-xl text-gray-500">💡</div>
          <div>
            <h4 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Consejos para recibir el código
            </h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>• Revisa tu bandeja de entrada y spam</li>
              <li>• Verifica que tu correo sea correcto</li>
              <li>• Asegúrate de tener conexión a internet</li>
              <li>• El código expira en 10 minutos</li>
            </ul>
          </div>
        </div>
      </div>

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
          className="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Anterior
        </button>
        <button
          onClick={handleVerify}
          disabled={!isCodeComplete || isVerifying}
          className={`flex-1 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 ${
            isCodeComplete && !isVerifying
              ? "transform bg-gradient-to-r from-gray-500 to-gray-700 shadow-lg hover:-translate-y-0.5 hover:from-gray-600 hover:to-gray-800 hover:shadow-xl"
              : "cursor-not-allowed bg-gray-300 dark:bg-gray-600"
          }`}
        >
          {isVerifying ? "Verificando..." : "Verificar →"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default VerificationStep;
