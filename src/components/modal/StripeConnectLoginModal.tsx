import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  EyeOff,
  CreditCard,
  Lock,
  User,
  CheckCircle,
} from "lucide-react";
import LocalStorageService from "../../services/localstorage";

interface StripeConnectLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const StripeConnectLoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
}: StripeConnectLoginModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Demo credentials
  const DEMO_USERNAME = "demo@stripe.com";
  const DEMO_PASSWORD = "demo123";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Demo validation
      if (username !== DEMO_USERNAME) {
        setErrors({ username: "Usuario incorrecto" });
        setIsLoading(false);
        return;
      }

      if (password !== DEMO_PASSWORD) {
        setErrors({ password: "Contraseña incorrecta" });
        setIsLoading(false);
        return;
      }

      // Save login state to localStorage
      const loginData = {
        isLoggedIn: true,
        username: username,
        timestamp: new Date().toISOString(),
        provider: "stripe_connect",
      };

      LocalStorageService.setItem(
        "stripe_connect_auth",
        JSON.stringify(loginData),
      );

      setIsLoading(false);
      setIsSuccess(true);

      // Auto close after showing success message
      setTimeout(() => {
        onLoginSuccess?.();
        handleClose();
      }, 2500);
    }, 1500);
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreditCard className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Iniciar sesión en Stripe Connect
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Conecta tu cuenta para procesar pagos
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {isSuccess ? (
                // Success State
                <div className="space-y-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                      ¡Inicio de sesión exitoso!
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      Te has conectado exitosamente con Stripe Connect.
                    </p>

                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                      <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-300">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Cuenta conectada</span>
                      </div>
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                        Ahora puedes procesar pagos de forma segura
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-gray-500 dark:text-gray-400"
                  >
                    Cerrando automáticamente...
                  </motion.div>
                </div>
              ) : (
                // Login Form
                <>
                  {/* Demo credentials info */}
                  <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Demo de Stripe Connect
                        </p>
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                          Usuario:{" "}
                          <code className="rounded bg-blue-100 px-1 dark:bg-blue-800">
                            {DEMO_USERNAME}
                          </code>
                          <br />
                          Contraseña:{" "}
                          <code className="rounded bg-blue-100 px-1 dark:bg-blue-800">
                            {DEMO_PASSWORD}
                          </code>
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Username */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <User className="mr-2 inline h-4 w-4" />
                        Usuario / Email
                      </label>
                      <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                          errors.username
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
                        } dark:text-white`}
                        placeholder="Ingresa tu email de Stripe"
                        required
                      />
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Lock className="mr-2 inline h-4 w-4" />
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full rounded-lg border px-4 py-3 pr-12 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                            errors.password
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"
                          } dark:text-white`}
                          placeholder="Ingresa tu contraseña"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 transition-colors hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || !username || !password}
                      className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                          />
                          <span>Iniciando sesión...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          <span>Iniciar sesión con Stripe</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                🔒 Esta es una demostración. En un entorno real, Stripe Connect
                manejaría la autenticación de forma segura.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StripeConnectLoginModal;
