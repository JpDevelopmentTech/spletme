import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, CreditCard, Lock, User, CheckCircle } from 'lucide-react';
import LocalStorageService from '../../services/localstorage';

interface StripeConnectLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const StripeConnectLoginModal = ({ isOpen, onClose, onLoginSuccess }: StripeConnectLoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // Demo credentials
  const DEMO_USERNAME = 'demo@stripe.com';
  const DEMO_PASSWORD = 'demo123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Demo validation
      if (username !== DEMO_USERNAME) {
        setErrors({ username: 'Usuario incorrecto' });
        setIsLoading(false);
        return;
      }

      if (password !== DEMO_PASSWORD) {
        setErrors({ password: 'Contraseña incorrecta' });
        setIsLoading(false);
        return;
      }

      // Save login state to localStorage
      const loginData = {
        isLoggedIn: true,
        username: username,
        timestamp: new Date().toISOString(),
        provider: 'stripe_connect'
      };

      LocalStorageService.setItem('stripe_connect_auth', JSON.stringify(loginData));
      
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
    setUsername('');
    setPassword('');
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
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreditCard className="w-5 h-5 text-white" />
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
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {isSuccess ? (
                // Success State
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      ¡Inicio de sesión exitoso!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Te has conectado exitosamente con Stripe Connect.
                    </p>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-300">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Cuenta conectada</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
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
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Demo de Stripe Connect
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Usuario: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{DEMO_USERNAME}</code><br />
                          Contraseña: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{DEMO_PASSWORD}</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Usuario / Email
                      </label>
                      <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.username 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
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
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.password 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                          } dark:text-white`}
                          placeholder="Ingresa tu contraseña"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Iniciando sesión...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Iniciar sesión con Stripe</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                🔒 Esta es una demostración. En un entorno real, Stripe Connect manejaría la autenticación de forma segura.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StripeConnectLoginModal; 