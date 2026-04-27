import { useState, useRef, useEffect } from "react";
import { Smartphone, Info } from "lucide-react";
import { OnboardingData } from "../../../services/onboarding";

interface VerificationStepProps {
  nextStep: (data?: Partial<OnboardingData>) => void;
  prevStep: () => void;
  initialData?: OnboardingData;
}

const VerificationStep = ({ nextStep, prevStep, initialData }: VerificationStepProps) => {
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
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pasted.length && i < 6; i++) {
      if (/^\d$/.test(pasted[i])) newCode[i] = pasted[i];
    }
    setCode(newCode);
    setError("");
    const nextEmpty = newCode.findIndex((d) => d === "");
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleResend = async () => {
    setIsResending(true);
    setCountdown(60);
    setTimeout(() => setIsResending(false), 2000);
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Por favor ingresa el código completo");
      return;
    }
    if (fullCode === "123456") {
      nextStep({ whatsappVerified: true });
    } else {
      setError("Código incorrecto. Intenta nuevamente.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const isComplete = code.every((d) => d !== "");
  const phoneNumber = initialData?.phone || "+57 300 123 4567";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-2.5 text-center">
        <Smartphone size={48} color="#F97316" />
        <h2 className="text-[22px] font-bold text-[#111827]">
          Verifica tu número de WhatsApp
        </h2>
        <p className="text-sm text-[#6B7280]">
          Enviamos un código de 6 dígitos a{" "}
          <span className="font-semibold text-[#111827]">{phoneNumber}</span>
        </p>
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
            className="text-center font-bold text-[22px] outline-none transition-colors"
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
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      {/* Resend */}
      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-[#9CA3AF]">
            ¿No recibiste el código? Reenviar en{" "}
            <span className="font-semibold">{countdown}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-sm font-semibold text-[#F97316] hover:opacity-80 transition-opacity disabled:opacity-50"
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
        <Info size={16} color="#0EA5E9" className="flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#0369A1]">
          Verifica que WhatsApp esté activo y tengas conexión a internet
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={prevStep}
          className="flex-1 font-semibold text-[#374151] transition-colors hover:bg-[#E5E7EB]"
          style={{ height: 46, borderRadius: 10, backgroundColor: "#F4F4F5" }}
        >
          Anterior
        </button>
        <button
          onClick={handleVerify}
          disabled={!isComplete}
          className="flex-1 font-semibold text-white transition-opacity"
          style={{
            height: 46,
            borderRadius: 10,
            backgroundColor: isComplete ? "#F97316" : "#D1D5DB",
            cursor: isComplete ? "pointer" : "not-allowed",
          }}
        >
          Verificar
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;
