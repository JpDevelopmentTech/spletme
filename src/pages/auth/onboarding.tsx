import { useState } from "react";
import Step1 from "../../components/onboarding/step1";
import Step2 from "../../components/onboarding/step2";
import Step3 from "../../components/onboarding/step3";
import Step12 from "../../components/onboarding/step1-2";
import Step13 from "../../components/onboarding/step1-3";
const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    }

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    }

  return (
    <section className="py-8 bg-white dark:bg-gray-900 lg:py-0">
      <div className="lg:flex">
        <div className="flex items-center justify-center h-screen mx-auto md:w-[50rem] px-4 md:px-8 xl:px-0">
          <div className="w-full">
            
            {currentStep === 1 && <Step1 nextStep={nextStep} />}
            {currentStep === 2 && <Step12 nextStep={nextStep} prevStep={prevStep}/>}
            {currentStep === 3 && <Step13 nextStep={nextStep} prevStep={prevStep}/>}
            {currentStep === 4 && <Step2 nextStep={nextStep} prevStep={prevStep}/>}
            {currentStep === 5 && <Step3/>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Onboarding;
