import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfessionStep from "./steps/ProfessionStep";
import AccountDetailsStep from "./steps/AccountDetailsStep";
import DistributorStep from "./steps/DistributorStep";
import VerificationStep from "./steps/VerificationStep";
import CompletionStep from "./steps/CompletionStep";

const OnboardingContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Profesión",
      description: "Cuéntanos sobre ti",
      icon: "👤",
      component: <ProfessionStep nextStep={nextStep} />
    },
    {
      id: 2,
      title: "Detalles",
      description: "Información personal",
      icon: "📋",
      component: <AccountDetailsStep nextStep={nextStep} prevStep={prevStep} />
    },
    {
      id: 3,
      title: "Distribuidor",
      description: "Elige tu plataforma",
      icon: "🎵",
      component: <DistributorStep nextStep={nextStep} prevStep={prevStep} />
    },
    {
      id: 4,
      title: "Verificación",
      description: "Confirma tu número",
      icon: "📱",
      component: <VerificationStep nextStep={nextStep} prevStep={prevStep} />
    },
    {
      id: 5,
      title: "Completado",
      description: "¡Todo listo!",
      icon: "✅",
      component: <CompletionStep />
    }
  ];

  const currentStepData = steps[currentStep - 1];
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header con logo y progreso */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                S
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
                SplitMe
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Configuremos tu cuenta
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400"
            >
              Solo te tomará unos minutos completar tu perfil
            </motion.p>
          </div>

          {/* Indicador de progreso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center relative"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      step.id <= currentStep
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-lg"
                      >
                        ✓
                      </motion.div>
                    ) : (
                      <span className="text-lg">{step.icon}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium ${
                      step.id <= currentStep ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  
                  {/* Línea conectora */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 left-12 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: step.id < currentStep ? "100%" : "0%" 
                        }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Barra de progreso general */}
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Paso {currentStep} de {totalSteps}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido del paso actual */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl mb-3"
              >
                {currentStepData.icon}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
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