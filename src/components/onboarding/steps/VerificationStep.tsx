import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, CircleAlert, CircleCheck, Loader2, Pencil } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[28px] font-semibold text-[#1C1D22]">
          Verifica tu correo
        </h1>
        <p className="text-[13.5px] leading-relaxed text-[#71757E]">
          Enviamos un código de 6 dígitos a{" "}
          <span className="font-semibold text-[#1C1D22]">{emailToVerify}</span>
        </p>
        <button
          type="button"
          onClick={prevStep}
          className="flex w-fit items-center gap-1.5 text-[12.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00]"
        >
          <Pencil className="h-3 w-3" />
          Cambiar correo
        </button>
      </div>

      <div className="flex gap-2.5">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            aria-label={`Dígito ${index + 1} de ${CODE_LENGTH}`}
            aria-invalid={Boolean(error)}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isVerifying}
            className={`h-[62px] flex-1 rounded-2xl border-0 text-center font-mono text-[24px] font-semibold text-[#1C1D22] outline outline-1 transition-colors focus:outline-2 focus:ring-0 ${
              error
                ? "bg-white outline-[#E5484D] focus:outline-[#E5484D]"
                : digit
                  ? "bg-white outline-[#E8E8EC] focus:outline-[#FF5C00]"
                  : "bg-[#F4F5F7] outline-[#E8E8EC] focus:outline-[#FF5C00]"
            }`}
          />
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-[14px] bg-[#FDECEC] px-3 py-2.5 text-[11.5px] leading-snug text-[#E5484D]"
        >
          <CircleAlert className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-[14px] bg-[#E4F5EC] px-3 py-2.5 text-[11.5px] leading-snug text-[#2FB37E]"
        >
          <CircleCheck className="h-3.5 w-3.5 flex-shrink-0" />
          {successMessage}
        </p>
      )}

      <div className="flex items-center gap-2">
        <span className="text-[12.5px] text-[#71757E]">¿No llegó el código?</span>
        {countdown > 0 ? (
          <span className="font-mono text-[12.5px] text-[#A6AAB2]">
            Puedes reenviarlo en {countdown} s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="text-[12.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] disabled:text-[#A6AAB2]"
          >
            {isResending ? "Enviando…" : "Reenviar ahora"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2.5 rounded-[18px] bg-[#F4F5F7] p-4">
        <span className="text-[12.5px] font-semibold text-[#1C1D22]">
          Si no lo ves en unos segundos
        </span>
        {[
          "Revisa la carpeta de spam o promociones.",
          "El código caduca a los 10 minutos.",
          "Comprueba que el correo esté bien escrito.",
        ].map((tip) => (
          <span key={tip} className="flex items-start gap-2.5">
            <span className="mt-[6px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-[#A6AAB2]" />
            <span className="text-[12px] leading-snug text-[#71757E]">{tip}</span>
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={prevStep}
          disabled={isVerifying}
          className="flex h-[50px] w-[150px] flex-shrink-0 items-center justify-center gap-2 rounded-[25px] border border-[#E8E8EC] bg-white text-[14.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] disabled:text-[#A6AAB2]"
        >
          <ArrowLeft className="h-[15px] w-[15px]" />
          Atrás
        </button>
        <button
          onClick={handleVerify}
          disabled={!isCodeComplete || isVerifying}
          className={`flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[25px] text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] ${
            isCodeComplete && !isVerifying
              ? "bg-[#FF5C00] text-white shadow-[0_8px_20px_-6px_rgba(255,92,0,0.55)] hover:bg-[#EA580C]"
              : "cursor-not-allowed bg-[#F4F5F7] text-[#A6AAB2]"
          }`}
        >
          {isVerifying ? "Verificando…" : "Verificar código"}
          {isVerifying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;
