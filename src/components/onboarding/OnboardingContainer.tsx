import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import ProfessionStep from "./steps/ProfessionStep";
import AccountDetailsStep from "./steps/AccountDetailsStep";
import VerificationStep from "./steps/VerificationStep";
import CompletionStep from "./steps/CompletionStep";
import { OnboardingService, OnboardingData } from "../../services/onboarding";
import { setAuth } from "@/store/states/authSlice";

const TOTAL_STEPS = 4;

const OnboardingContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [onboardingError, setOnboardingError] = useState("");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    currentStep: 1,
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";
      const storedStep = Number(user.onboardingData?.currentStep || 1);

      if (email) {
        setVerificationEmail(email);
      }

      if (user.onboardingCompleted || storedStep >= TOTAL_STEPS) {
        const completedUser = {
          ...user,
          onboardingCompleted: true,
        };
        localStorage.setItem("user", JSON.stringify(completedUser));
        dispatch(setAuth({ isAuth: "true", user: completedUser }));
        navigate("/panel/home", { replace: true });
        return;
      }

      setCurrentStep(storedStep);
      setOnboardingData((prev) => ({
        ...prev,
        ...(user.onboardingData || {}),
        currentStep: storedStep,
      }));
    }
  }, [navigate]);

  const updateOnboardingStep = async (
    stepData: Partial<OnboardingData>,
    nextStepNumber?: number,
  ) => {
    try {
      const updatedData: OnboardingData = {
        ...onboardingData,
        ...stepData,
        currentStep: nextStepNumber || currentStep,
      };
      const response = await OnboardingService.updateOnboarding(updatedData);
      if (response.data && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setOnboardingData(updatedData);
      }
      return true;
    } catch (error) {
      console.error("Error updating onboarding:", error);
      return false;
    }
  };

  const nextStep = async (stepData?: Partial<OnboardingData>) => {
    if (currentStep < TOTAL_STEPS) {
      setOnboardingError("");
      const nextStepNumber = currentStep + 1;
      if (stepData) {
        if (nextStepNumber === 3) {
          if (!verificationEmail) {
            setOnboardingError("No encontramos un correo para enviar el código de verificación.");
            return;
          }

          try {
            const requestResponse =
              await OnboardingService.requestAccountVerificationCode(verificationEmail);

            if (!requestResponse.accepted) {
              setOnboardingError("No fue posible enviar el código de verificación.");
              return;
            }
          } catch (error) {
            setOnboardingError(
              error instanceof Error
                ? error.message
                : "No fue posible enviar el código de verificación.",
            );
            return;
          }
        }

        const success = await updateOnboardingStep(stepData, nextStepNumber);
        if (success) {
          setCurrentStep(nextStepNumber);
          if (nextStepNumber === TOTAL_STEPS) {
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const user = JSON.parse(userStr);
              user.onboardingCompleted = true;
              localStorage.setItem("user", JSON.stringify(user));
            }
          }
        } else {
          setOnboardingError("No pudimos guardar tu progreso. Intenta nuevamente.");
        }
      } else {
        setCurrentStep(nextStepNumber);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      id: 1,
      title: "Completa tu perfil",
      description: "Cuéntanos sobre tu profesión",
      icon: "👤",
      component: <ProfessionStep nextStep={nextStep} initialData={onboardingData} />,
    },
    {
      id: 2,
      title: "Datos de cuenta",
      description: "Configura tu información principal",
      icon: "🧾",
      component: (
        <AccountDetailsStep nextStep={nextStep} prevStep={prevStep} initialData={onboardingData} />
      ),
    },
    {
      id: 3,
      title: "Verificación",
      description: "Confirma tu correo",
      icon: "📧",
      component: (
        <VerificationStep
          nextStep={nextStep}
          prevStep={prevStep}
          initialData={onboardingData}
          verificationEmail={verificationEmail}
        />
      ),
    },
    {
      id: 4,
      title: "¡Listo!",
      description: "Tu cuenta ya está verificada",
      icon: "✅",
      component: <CompletionStep />,
    },
  ];
  const currentStepData = steps[currentStep - 1];

  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Top Bar */}
      <div
        className="flex w-full items-center justify-between bg-white px-10"
        style={{ height: 64, borderBottom: "1px solid #E5E7EB" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center bg-[#F97316] text-lg font-bold text-white"
            style={{ width: 36, height: 36, borderRadius: 9 }}
          >
            S
          </div>
          <span className="text-lg font-bold text-[#111827]">SplitMe</span>
        </div>
        <span className="text-sm font-medium" style={{ color: isLastStep ? "#22C55E" : "#9CA3AF" }}>
          Paso {currentStep} de {TOTAL_STEPS}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-7 px-4 pb-16 pt-8">
        {/* Stepper */}
        <div className="flex w-full items-center" style={{ maxWidth: 640 }}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            const isActive = isDone || isCurrent;
            const isLastCircle = stepNum === TOTAL_STEPS;

            const circleBg = isActive
              ? isLastCircle && isCurrent
                ? "#22C55E"
                : "#F97316"
              : "#FFFFFF";

            const circleStyle: React.CSSProperties = {
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: circleBg,
              border: isActive ? "none" : "1.5px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            };

            return (
              <div key={stepNum} style={{ display: "contents" }}>
                <div style={circleStyle}>
                  {isDone ? (
                    <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                  ) : (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: isCurrent ? "#FFFFFF" : "#9CA3AF" }}
                    >
                      {stepNum}
                    </span>
                  )}
                </div>
                {stepNum < TOTAL_STEPS && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor: isDone ? "#F97316" : "#E5E7EB",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Contenido del paso actual */}
        <div className="mx-auto max-w-2xl">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-3 text-4xl"
              >
                {currentStepData.icon}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-2 text-2xl font-bold text-gray-900 dark:text-white"
              >
                {currentStepData.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-400"
              >
                {currentStepData.description}
              </motion.p>
            </div>

            {onboardingError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                {onboardingError}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.component}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
