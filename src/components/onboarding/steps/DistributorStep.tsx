import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DistributorStepProps {
  nextStep: () => void;
  prevStep: () => void;
}

const DistributorStep = ({ nextStep, prevStep }: DistributorStepProps) => {
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const distributors = [
    {
      id: "believe",
      name: "Believe",
      description: "Distribución global independiente",
      color: "from-red-500 to-pink-500",
      icon: "🎵",
      features: ["Distribución mundial", "Analytics avanzados", "Promoción digital"]
    },
    {
      id: "onerpm",
      name: "ONErpm",
      description: "Plataforma de distribución moderna",
      color: "from-blue-500 to-cyan-500",
      icon: "🎧",
      features: ["Tecnología avanzada", "Soporte 24/7", "Marketing digital"]
    },
    {
      id: "orchard",
      name: "The Orchard",
      description: "Distribución premium de Sony Music",
      color: "from-purple-500 to-indigo-500",
      icon: "🎼",
      features: ["Red global", "Servicios premium", "Soporte especializado"]
    },
    {
      id: "symphonic",
      name: "Symphonic",
      description: "Distribución independiente completa",
      color: "from-green-500 to-emerald-500",
      icon: "🎹",
      features: ["Distribución completa", "Herramientas de artista", "Soporte personalizado"]
    }
  ];

  const handleDistributorSelect = (distributorId: string) => {
    setSelectedDistributor(distributorId);
    setCredentials({ email: "", password: "" });
    setErrors({});
  };

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateCredentials = () => {
    const newErrors: Record<string, string> = {};

    if (!credentials.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!credentials.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (credentials.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!selectedDistributor) {
      return;
    }

    if (validateCredentials()) {
      nextStep();
    }
  };

  const selectedDistributorData = distributors.find(d => d.id === selectedDistributor);

  return (
    <div className="space-y-6">
      {/* Selección de distribuidor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {distributors.map((distributor, index) => (
          <motion.div
            key={distributor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="radio"
              id={distributor.id}
              name="distributor"
              value={distributor.id}
              className="hidden peer"
              onChange={() => handleDistributorSelect(distributor.id)}
              checked={selectedDistributor === distributor.id}
            />
            <label
              htmlFor={distributor.id}
              className={`block p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedDistributor === distributor.id
                  ? `border-transparent bg-gradient-to-r ${distributor.color} text-white shadow-lg`
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl ${
                  selectedDistributor === distributor.id 
                    ? "bg-white/20" 
                    : "bg-gray-50 dark:bg-gray-600"
                }`}>
                  {distributor.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${
                    selectedDistributor === distributor.id 
                      ? "text-white" 
                      : "text-gray-900 dark:text-white"
                  }`}>
                    {distributor.name}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    selectedDistributor === distributor.id 
                      ? "text-white/80" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {distributor.description}
                  </p>
                  <div className="space-y-1">
                    {distributor.features.map((feature, idx) => (
                      <div key={idx} className={`text-xs flex items-center justify-center space-x-1 ${
                        selectedDistributor === distributor.id 
                          ? "text-white/70" 
                          : "text-gray-400 dark:text-gray-500"
                      }`}>
                        <span>•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </label>
          </motion.div>
        ))}
      </div>

      {/* Formulario de credenciales */}
      <AnimatePresence>
        {selectedDistributor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-3 mb-4"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                  {selectedDistributorData?.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Conecta tu cuenta de {selectedDistributorData?.name}
                </h3>
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Ingresa tus credenciales para sincronizar tu catálogo musical
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📧</span>
                    <span>Correo electrónico</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="email"
                  id="email"
                  value={credentials.email}
                  onChange={(e) => handleCredentialChange("email", e.target.value)}
                  placeholder="tu@email.com"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.email
                      ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-blue-400"
                  } dark:text-white dark:placeholder-gray-400`}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.email}</span>
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🔐</span>
                    <span>Contraseña</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={(e) => handleCredentialChange("password", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.password
                      ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-blue-400"
                  } dark:text-white dark:placeholder-gray-400`}
                />
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.password}</span>
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Información de seguridad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-start space-x-3">
                <div className="text-green-500 text-xl">🛡️</div>
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Conexión segura
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Tus credenciales se almacenan de forma segura y encriptada. Solo las usamos para 
                    sincronizar tu catálogo musical y nunca las compartimos con terceros.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botones de navegación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex space-x-4 pt-6"
      >
        <button
          onClick={prevStep}
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>←</span>
          <span>Anterior</span>
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!selectedDistributor || !credentials.email || !credentials.password}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            selectedDistributor && credentials.email && credentials.password
              ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
          }`}
        >
          <span>Continuar</span>
          <motion.div
            animate={{ x: selectedDistributor && credentials.email && credentials.password ? [0, 5, 0] : 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.div>
        </button>
      </motion.div>
    </div>
  );
};

export default DistributorStep; 