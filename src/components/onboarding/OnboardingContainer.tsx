import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import ProfessionStep from "./steps/ProfessionStep";
import AccountDetailsStep from "./steps/AccountDetailsStep";
import VerificationStep from "./steps/VerificationStep";
import CompletionStep from "./steps/CompletionStep";
import { OnboardingService, OnboardingData } from "../../services/onboarding";

const TOTAL_STEPS = 4;

const OnboardingContainer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    currentStep: 1,
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.onboardingCompleted) {
        navigate("/panel/home");
        return;
      }
      if (user.onboardingData) {
        setOnboardingData(user.onboardingData);
        setCurrentStep(user.onboardingData.currentStep || 1);
      }
    }
  }, [navigate]);

  const updateOnboardingStep = async (
    stepData: Partial<OnboardingData>,
    nextStepNumber?: number
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
      const nextStepNumber = currentStep + 1;
      if (stepData) {
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
      component: (
        <ProfessionStep nextStep={nextStep} initialData={onboardingData} />
      ),
    },
    {
      id: 2,
      component: (
        <AccountDetailsStep
          nextStep={nextStep}
          prevStep={prevStep}
          initialData={onboardingData}
        />
      ),
    },
    {
      id: 3,
      component: (
        <VerificationStep
          nextStep={nextStep}
          prevStep={prevStep}
          initialData={onboardingData}
        />
      ),
    },
    {
      id: 4,
      component: <CompletionStep />,
    },
  ];

  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Top Bar */}
      <div
        className="w-full bg-white flex items-center justify-between px-10"
        style={{ height: 64, borderBottom: "1px solid #E5E7EB" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center bg-[#F97316] text-white font-bold text-lg"
            style={{ width: 36, height: 36, borderRadius: 9 }}
          >
            S
          </div>
          <span className="text-[#111827] font-bold text-lg">SplitMe</span>
        </div>
        <span
          className="text-sm font-medium"
          style={{ color: isLastStep ? "#22C55E" : "#9CA3AF" }}
        >
          Paso {currentStep} de {TOTAL_STEPS}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center pt-8 pb-16 px-4 gap-7">
        {/* Stepper */}
        <div className="flex items-center w-full" style={{ maxWidth: 640 }}>
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

        {/* Step Card */}
        <div
          className="w-full bg-white"
          style={{
            maxWidth: 660,
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            padding: 40,
          }}
        >
          {steps[currentStep - 1].component}
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
