import React, { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { motion } from "framer-motion";
import { useDashboardTour } from "../../hooks/useDashboardTour";
import { Sparkles, Crown } from "lucide-react";

interface DashboardTourProps {
  onTourComplete?: () => void;
}

const DashboardTour: React.FC<DashboardTourProps> = ({ onTourComplete }) => {
  const { isFirstTime, hasCompletedTour, completeTour, resetTour } = useDashboardTour();
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Start tour automatically for first-time users
    if (isFirstTime && !hasCompletedTour) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isFirstTime, hasCompletedTour]);

  const handleTourCallback = (data: CallBackProps) => {
    const { index, status, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      // Mark tour as completed
      completeTour();
      setRunTour(false);
      onTourComplete?.();
    } else if (type === "step:after") {
      setStepIndex(index + 1);
    }
  };

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">¡Bienvenido a tu Dashboard!</h3>
          <p className="text-gray-600">
            Te guiaré a través de las principales funciones de tu panel de música.
            <br />
            <span className="text-sm text-purple-600">¡Vamos a explorar juntos!</span>
          </p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
      styles: {
        options: {
          width: 400,
        },
      },
    },
    {
      target: '[data-tour="hero-header"]',
      content: (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">📊 Dashboard Analytics</h3>
          <p className="text-gray-600">
            Aquí tienes una vista general de tu rendimiento musical. El dashboard te muestra
            métricas clave y tendencias importantes.
          </p>
        </div>
      ),
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: '[data-tour="stats-cards"]',
      content: (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">📈 Métricas Principales</h3>
          <p className="text-gray-600">Estas tarjetas muestran tus estadísticas más importantes:</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            <li>
              • <strong>Total Streams:</strong> Reproducciones totales
            </li>
            <li>
              • <strong>Ingresos Mensuales:</strong> Ganancias del mes
            </li>
            <li>
              • <strong>Oyentes Activos:</strong> Audiencia activa
            </li>
            <li>
              • <strong>Tasa de Conversión:</strong> Efectividad
            </li>
          </ul>
        </div>
      ),
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: '[data-tour="analytics-chart"]',
      content: (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">📊 Gráfico de Rendimiento</h3>
          <p className="text-gray-600">
            Visualiza tu rendimiento a lo largo del tiempo. Puedes cambiar entre diferentes períodos
            (7 días, 30 días, etc.) para analizar tendencias y patrones.
          </p>
        </div>
      ),
      placement: "left",
      disableBeacon: true,
    },
    {
      target: '[data-tour="balance-section"]',
      content: (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">💰 Balance y Pagos</h3>
          <p className="text-gray-600">
            Aquí puedes ver tu balance actual, ingresos y gastos. También puedes acceder a Payoneer
            para gestionar tus pagos de forma segura.
          </p>
        </div>
      ),
      placement: "left",
      disableBeacon: true,
    },
    {
      target: '[data-tour="platforms-section"]',
      content: (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">🌐 Plataformas de Streaming</h3>
          <p className="text-gray-600">
            Monitorea tu rendimiento en diferentes plataformas como Spotify, Apple Music, YouTube y
            más. Ve cómo se distribuyen tus streams y ganancias.
          </p>
        </div>
      ),
      placement: "top",
      disableBeacon: true,
    },
    {
      target: '[data-tour="top-songs"]',
      content: (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gray-900">🎵 Tus Mejores Canciones</h3>
          <p className="text-gray-600">
            Descubre cuáles son tus canciones más exitosas del mes. Usa los filtros para analizar
            diferentes aspectos y haz clic en "Ver todas" para acceder a tu biblioteca completa.
          </p>
        </div>
      ),
      placement: "top",
      disableBeacon: true,
    },
    {
      target: "body",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500"
          >
            <Crown className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">¡Tour Completado!</h3>
          <p className="mb-4 text-gray-600">
            Ya conoces las funciones principales de tu dashboard. ¡Ahora puedes explorar y
            aprovechar al máximo todas las herramientas!
          </p>
          <div className="text-sm text-gray-500">
            <p>
              💡 <strong>Consejo:</strong> Puedes revisar este tour en cualquier momento desde tu
              perfil.
            </p>
          </div>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
      styles: {
        options: {
          width: 400,
        },
      },
    },
  ];

  const handleRestartTour = () => {
    resetTour();
    setRunTour(true);
    setStepIndex(0);
  };

  // Don't render anything if tour is not running and user has completed it
  if (!runTour && hasCompletedTour) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={handleRestartTour}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-3 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
        title="Reiniciar Tour del Dashboard"
      >
        <Sparkles className="h-5 w-5" />
      </motion.button>
    );
  }

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        stepIndex={stepIndex}
        callback={handleTourCallback}
        continuous
        showProgress
        showSkipButton
        hideCloseButton={false}
        styles={{
          options: {
            primaryColor: "#8B5CF6",
            zIndex: 10000,
          },
          tooltip: {
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(139, 92, 246, 0.1)",
          },
          tooltipTitle: {
            color: "#1F2937",
            fontSize: "18px",
            fontWeight: "700",
          },
          tooltipContent: {
            color: "#6B7280",
            fontSize: "14px",
            lineHeight: "1.5",
          },
          buttonNext: {
            backgroundColor: "#8B5CF6",
            borderRadius: "12px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            color: "#ffffff",
          },
          buttonBack: {
            color: "#8B5CF6",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            backgroundColor: "transparent",
          },
          buttonSkip: {
            color: "#9CA3AF",
            fontSize: "14px",
            fontWeight: "500",
            border: "none",
            backgroundColor: "transparent",
          },
          buttonClose: {
            color: "#9CA3AF",
            fontSize: "14px",
            fontWeight: "500",
            border: "none",
            backgroundColor: "transparent",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
          spotlight: {
            backgroundColor: "transparent",
            borderRadius: "12px",
          },
        }}
        locale={{
          back: "Anterior",
          close: "Cerrar",
          last: "Finalizar",
          next: "Siguiente",
          skip: "Saltar Tour",
        }}
      />

      {/* Tour Progress Indicator */}
      {runTour && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 transform rounded-2xl border border-white/20 bg-white/90 px-6 py-3 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Tour del Dashboard</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">{stepIndex + 1}</span>
              <span className="text-xs text-gray-400">/</span>
              <span className="text-xs text-gray-500">{steps.length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default DashboardTour;
