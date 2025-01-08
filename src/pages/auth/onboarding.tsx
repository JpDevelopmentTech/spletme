import { useState } from "react";
import logo from "../../assets/images/7 - FULL LOGO.png";
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
        <div className="hidden w-full max-w-md p-12 lg:h-screen lg:block bg-primary">
          <div className="flex items-center mb-8 space-x-4">
            <a
              href="#"
              className="flex items-center text-2xl font-semibold text-white"
            >
              <img className="w-36 h-8 mr-2" src={logo} />
            </a>
            <a
              href="#"
              className="inline-flex items-center text-sm font-medium text-white hover:text-white"
            >
              <svg
                className="w-6 h-6 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Go back
            </a>
          </div>
        </div>
        <div className="flex items-center mx-auto md:w-[42rem] px-4 md:px-8 xl:px-0">
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
