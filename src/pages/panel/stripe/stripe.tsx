import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Shield,
  Zap,
  DollarSign,
  Link as LinkIcon,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useCheckStatusStripeAccount } from "@/hooks/useCheckStatusStripeAccount";
import stripe from "@/services/stripe";
import Title from "@/components/title/title";
import Loading from "@/components/loading/loading";

export default function Stripe() {
  const { status: statusParams } = useParams();
  const { isLoading: statusLoading } = useCheckStatusStripeAccount();
  const navigate = useNavigate();

  const [isConnecting, setIsConnecting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleConnectStripe = async () => {
    setIsConnecting(true);
    try {
      const response = await stripe.connectStripeAccount();
      if (response.data?.onboardingUrl) {
        window.location.href = response.data.onboardingUrl;
      }
    } catch (error) {
      console.error("Error connecting to Stripe:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Success State
  if (statusParams === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate("/panel/payments")}
              className="flex items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Pagos
            </button>
          </motion.div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20"
              >
                <CheckCircle className="h-10 w-10" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h1 className="mb-2 text-3xl font-bold">¡Conexión Exitosa!</h1>
                <p className="text-lg text-green-100">
                  Tu cuenta de Stripe ha sido conectada correctamente
                </p>
              </motion.div>
            </div>

            <div className="p-8">
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-xl bg-gray-50 p-6 text-center"
                >
                  <Shield className="mx-auto mb-3 h-8 w-8 text-tertiary" />
                  <h3 className="mb-2 font-semibold text-gray-800">Seguro</h3>
                  <p className="text-sm text-gray-600">
                    Pagos protegidos con encriptación de nivel empresarial
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="rounded-xl bg-gray-50 p-6 text-center"
                >
                  <Zap className="mx-auto mb-3 h-8 w-8 text-quinary" />
                  <h3 className="mb-2 font-semibold text-gray-800">Rápido</h3>
                  <p className="text-sm text-gray-600">
                    Procesamiento instantáneo de pagos y transferencias
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="rounded-xl bg-gray-50 p-6 text-center"
                >
                  <DollarSign className="mx-auto mb-3 h-8 w-8 text-green-600" />
                  <h3 className="mb-2 font-semibold text-gray-800">Rentable</h3>
                  <p className="text-sm text-gray-600">
                    Tarifas competitivas y transparentes
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <button
                  onClick={() => navigate("/panel/payments")}
                  className="transform rounded-lg bg-gradient-to-r from-tertiary to-secondary px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Ir a Pagos
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (statusParams === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate("/panel/payments")}
              className="flex items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Pagos
            </button>
          </motion.div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20"
              >
                <XCircle className="h-10 w-10" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h1 className="mb-2 text-3xl font-bold">Error de Conexión</h1>
                <p className="text-lg text-red-100">
                  No pudimos conectar tu cuenta de Stripe
                </p>
              </motion.div>
            </div>

            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                  <div>
                    <h3 className="mb-2 font-semibold text-red-800">
                      ¿Qué pasó?
                    </h3>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li>• La conexión con Stripe fue interrumpida</li>
                      <li>• Es posible que hayas cancelado el proceso</li>
                      <li>
                        • Puede haber un problema temporal con el servicio
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-4 text-center"
              >
                <button
                  onClick={handleConnectStripe}
                  disabled={isConnecting}
                  className="transform rounded-lg bg-gradient-to-r from-tertiary to-secondary px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isConnecting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Conectando...
                    </div>
                  ) : (
                    "Intentar de Nuevo"
                  )}
                </button>

                <p className="text-sm text-gray-500">
                  ¿Sigues teniendo problemas? Contacta a soporte técnico
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (statusLoading) {
    return <Loading />;
  }

  // Main Stripe Connection Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Title
            title="Configuración de Pagos"
            subtitle="Conecta tu cuenta de Stripe para recibir pagos"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Main Connection Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white p-8 shadow-xl"
          >
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-tertiary to-secondary"
              >
                <CreditCard className="h-10 w-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="mb-3 text-2xl font-bold text-gray-800">
                  Conectar con Stripe
                </h2>
                <p className="mb-6 text-gray-600">
                  Stripe es la plataforma de pagos más segura y confiable del
                  mundo. Conecta tu cuenta para comenzar a recibir pagos.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnectStripe}
                disabled={isConnecting}
                className="w-full rounded-xl bg-gradient-to-r from-tertiary to-secondary px-6 py-4 text-lg font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Conectando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Conectar Cuenta
                  </div>
                )}
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="border-t pt-6"
            >
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Proceso seguro y encriptado</span>
                <Shield className="h-4 w-4" />
              </div>
            </motion.div>
          </motion.div>

          {/* Information Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Benefits Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Zap className="h-5 w-5 text-quinary" />
                Beneficios de Stripe
              </h3>

              <div className="space-y-4">
                {[
                  {
                    icon: Shield,
                    title: "Seguridad Máxima",
                    desc: "Certificación PCI DSS Level 1",
                  },
                  {
                    icon: DollarSign,
                    title: "Tarifas Bajas",
                    desc: "Solo 2.9% + $0.30 por transacción",
                  },
                  {
                    icon: Zap,
                    title: "Pagos Instantáneos",
                    desc: "Recibe dinero en 1-2 días hábiles",
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <benefit.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  ¿Cómo funciona?
                </h3>
                <motion.div
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 border-t border-gray-100 pt-4"
                  >
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-tertiary text-xs font-bold text-white">
                          1
                        </div>
                        <p>
                          Haz clic en "Conectar Cuenta" para iniciar el proceso
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-tertiary text-xs font-bold text-white">
                          2
                        </div>
                        <p>
                          Serás redirigido a Stripe para crear o conectar tu
                          cuenta
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-tertiary text-xs font-bold text-white">
                          3
                        </div>
                        <p>Completa la información requerida por Stripe</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                          ✓
                        </div>
                        <p>¡Listo! Ya puedes recibir pagos de forma segura</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
