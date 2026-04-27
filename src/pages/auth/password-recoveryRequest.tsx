import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth";
import { PasswordRecoverySessionHelper } from "@/helpers/passwordRecoverySession";

const CODE_LENGTH = 6;

export default function PasswordRecoveryRequest() {
  const navigate = useNavigate();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(true);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  const [codeDigits, setCodeDigits] = useState<string[]>(
    Array(CODE_LENGTH).fill("")
  );
  const [codeError, setCodeError] = useState("");

  const handleSendRecoveryRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isEmailValid) {
      setEmailError("Ingresa un correo válido");
      return;
    }

    setEmailError("");
    setIsSendingRequest(true);

    try {
      const recoveryResponse = await AuthService.sentPasswordRecoveryRequest(
        normalizedEmail
      );

      if (!recoveryResponse.success) {
        setEmailError(recoveryResponse.message || "correo no encontrado");
        return;
      }

      PasswordRecoverySessionHelper.clear();
      setSentEmail(normalizedEmail);
      setIsEmailModalOpen(false);
      setCodeDigits(Array(CODE_LENGTH).fill(""));
      setCodeError("");
    } catch {
      setEmailError("No se pudo enviar el código");
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCodeDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setCodeError("");

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const nextDigits = Array(CODE_LENGTH)
      .fill("")
      .map((_, index) => pasted[index] ?? "");
    setCodeDigits(nextDigits);
    setCodeError("");

    const lastIndex = Math.min(pasted.length, CODE_LENGTH) - 1;
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codeDigits.join("");

    if (fullCode.length !== CODE_LENGTH) {
      setCodeError("Completa los 6 dígitos del código");
      return;
    }

    setIsVerifyingCode(true);
    setCodeError("");

    const verificationResponse = await AuthService.sentcodeForPasswordRecovery(
      sentEmail,
      fullCode
    );

    if (!verificationResponse.success) {
      setCodeError(verificationResponse.message || "Código inválido o expirado");
      setIsVerifyingCode(false);
      return;
    }

    const verifiedCode = verificationResponse.token?.trim() || fullCode;
    PasswordRecoverySessionHelper.save(sentEmail, verifiedCode);
    navigate("/panel/change-password", {
      state: { email: sentEmail, token: verifiedCode },
    });
    setIsVerifyingCode(false);
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => navigate("/auth/email-login")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </motion.button>

          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Verificar código
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            {sentEmail
              ? `Ingresa el código de 6 dígitos enviado a ${sentEmail}.`
              : "Primero ingresa tu correo para recibir un código."}
          </p>

          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="flex items-center justify-between gap-2">
              {codeDigits.map((digit, index) => (
                <input
                  key={`digit-${index}`}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(index, e)}
                  onPaste={handleCodePaste}
                  disabled={isVerifyingCode}
                  className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>

            {codeError && (
              <p className="text-sm text-red-500 text-center">{codeError}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isVerifyingCode}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isVerifyingCode ? "Verificando código..." : "Validar código"}
            </motion.button>

            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              disabled={isVerifyingCode}
              className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Reenviar / cambiar correo
            </button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {isEmailModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Recuperar contraseña
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Ingresa tu correo y te enviaremos un código de verificación.
              </p>

              <form onSubmit={handleSendRecoveryRequest} className="space-y-4">
                <div>
                  <label
                    htmlFor="recovery-email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="recovery-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                  {emailError && (
                    <p className="text-sm text-red-500 mt-2">{emailError}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSendingRequest}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                  {isSendingRequest ? "Enviando..." : "Enviar código"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVerifyingCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-2xl flex flex-col items-center gap-3"
            >
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-gray-800 font-semibold">Verificando código...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
