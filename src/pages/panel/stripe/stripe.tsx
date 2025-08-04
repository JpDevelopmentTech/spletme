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
  ExternalLink
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate("/panel/payments")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Pagos
            </button>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 mx-auto"
              >
                <CheckCircle className="w-10 h-10" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h1 className="text-3xl font-bold mb-2">¡Conexión Exitosa!</h1>
                <p className="text-green-100 text-lg">
                  Tu cuenta de Stripe ha sido conectada correctamente
                </p>
              </motion.div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center p-6 bg-gray-50 rounded-xl"
                >
                  <Shield className="w-8 h-8 text-tertiary mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Seguro</h3>
                  <p className="text-sm text-gray-600">Pagos protegidos con encriptación de nivel empresarial</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center p-6 bg-gray-50 rounded-xl"
                >
                  <Zap className="w-8 h-8 text-quinary mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Rápido</h3>
                  <p className="text-sm text-gray-600">Procesamiento instantáneo de pagos y transferencias</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center p-6 bg-gray-50 rounded-xl"
                >
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Rentable</h3>
                  <p className="text-sm text-gray-600">Tarifas competitivas y transparentes</p>
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
                  className="bg-gradient-to-r from-tertiary to-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate("/panel/payments")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Pagos
            </button>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 mx-auto"
              >
                <XCircle className="w-10 h-10" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h1 className="text-3xl font-bold mb-2">Error de Conexión</h1>
                <p className="text-red-100 text-lg">
                  No pudimos conectar tu cuenta de Stripe
                </p>
              </motion.div>
            </div>

            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">¿Qué pasó?</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• La conexión con Stripe fue interrumpida</li>
                      <li>• Es posible que hayas cancelado el proceso</li>
                      <li>• Puede haber un problema temporal con el servicio</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center space-y-4"
              >
                <button
                  onClick={handleConnectStripe}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-tertiary to-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isConnecting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
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
  if (statusLoading ) {
    return <Loading />;
  }

  // Main Stripe Connection Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Connection Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-tertiary to-secondary rounded-full mb-6 mx-auto"
              >
                <CreditCard className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Conectar con Stripe
                </h2>
                <p className="text-gray-600 mb-6">
                  Stripe es la plataforma de pagos más segura y confiable del mundo. 
                  Conecta tu cuenta para comenzar a recibir pagos.
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
                className="w-full bg-gradient-to-r from-tertiary to-secondary text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Conectando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LinkIcon className="w-5 h-5" />
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
                <Shield className="w-4 h-4" />
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-quinary" />
                Beneficios de Stripe
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: Shield, title: "Seguridad Máxima", desc: "Certificación PCI DSS Level 1" },
                  { icon: DollarSign, title: "Tarifas Bajas", desc: "Solo 2.9% + $0.30 por transacción" },
                  { icon: Zap, title: "Pagos Instantáneos", desc: "Recibe dinero en 1-2 días hábiles" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{benefit.title}</h4>
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
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  ¿Cómo funciona?
                </h3>
                <motion.div
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-tertiary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                        <p>Haz clic en "Conectar Cuenta" para iniciar el proceso</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-tertiary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                        <p>Serás redirigido a Stripe para crear o conectar tu cuenta</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-tertiary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                        <p>Completa la información requerida por Stripe</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</div>
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
