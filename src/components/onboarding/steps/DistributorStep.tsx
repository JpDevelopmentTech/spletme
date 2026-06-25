import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingData } from "../../../services/onboarding";
import believeIcon from "../../../assets/images/believeicon.png";
import onerpmIcon from "../../../assets/images/onerpmicon.png";
import orchardIcon from "../../../assets/images/theorchardicon.png";
import symphonicIcon from "../../../assets/images/symphonicicon.png";

interface DistributorStepProps {
  nextStep: (data?: Partial<OnboardingData>) => void;
  prevStep: () => void;
  initialData?: OnboardingData;
}

const DistributorStep = ({
  nextStep,
  prevStep,
  initialData,
}: DistributorStepProps) => {
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(
    null,
  );
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData?.distributor) {
      setSelectedDistributor(initialData.distributor);
    }
    if (initialData?.distributorEmail) {
      setCredentials((prev) => ({
        ...prev,
        email: initialData.distributorEmail || "",
        password: initialData.distributorPassword || "",
      }));
    }
  }, [initialData]);

  const distributors = [
    {
      id: "believe",
      name: "Believe",
      description: "Distribución global independiente",
      color: "from-gray-500 to-gray-600",
      icon: believeIcon,
      features: [
        "Distribución mundial",
        "Analytics avanzados",
        "Promoción digital",
      ],
    },
    {
      id: "onerpm",
      name: "ONErpm",
      description: "Plataforma de distribución moderna",
      color: "from-gray-500 to-gray-600",
      icon: onerpmIcon,
      features: ["Tecnología avanzada", "Soporte 24/7", "Marketing digital"],
    },
    {
      id: "orchard",
      name: "The Orchard",
      description: "Distribución premium de Sony Music",
      color: "from-gray-500 to-gray-600",
      icon: orchardIcon,
      features: ["Red global", "Servicios premium", "Soporte especializado"],
    },
    {
      id: "symphonic",
      name: "Symphonic",
      description: "Distribución independiente completa",
      color: "from-gray-500 to-gray-600",
      icon: symphonicIcon,
      features: [
        "Distribución completa",
        "Herramientas de artista",
        "Soporte personalizado",
      ],
    },
  ];

  const handleDistributorSelect = (distributorId: string) => {
    setSelectedDistributor(distributorId);
    setCredentials({ email: "", password: "" });
    setErrors({});
  };

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
      nextStep({
        distributor: selectedDistributor,
        distributorEmail: credentials.email,
        distributorPassword: credentials.password,
      });
    }
  };

  const selectedDistributorData = distributors.find(
    (d) => d.id === selectedDistributor,
  );

  return (
    <div className="space-y-6">
      {/* Selección de distribuidor */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              className="peer hidden"
              onChange={() => handleDistributorSelect(distributor.id)}
              checked={selectedDistributor === distributor.id}
            />
            <label
              htmlFor={distributor.id}
              className={`block cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                selectedDistributor === distributor.id
                  ? `border-transparent bg-gradient-to-r ${distributor.color} text-white shadow-lg`
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
              }`}
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-lg text-3xl ${
                    selectedDistributor === distributor.id
                      ? "bg-white/20"
                      : "bg-gray-50 dark:bg-gray-600"
                  }`}
                >
                  <img
                    src={distributor.icon}
                    alt={distributor.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3
                    className={`mb-1 text-lg font-bold ${
                      selectedDistributor === distributor.id
                        ? "text-white"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {distributor.name}
                  </h3>
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
                className="mb-4 inline-flex items-center space-x-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xl dark:bg-gray-700">
                  {selectedDistributorData?.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Conecta tu cuenta de {selectedDistributorData?.name}
                </h3>
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
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
                  onChange={(e) =>
                    handleCredentialChange("email", e.target.value)
                  }
                  placeholder="tu@email.com"
                  className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                    errors.email
                      ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-gray-400"
                  } dark:text-white dark:placeholder-gray-400`}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
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
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
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
                  onChange={(e) =>
                    handleCredentialChange("password", e.target.value)
                  }
                  placeholder="••••••••"
                  className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                    errors.password
                      ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-gray-400"
                  } dark:text-white dark:placeholder-gray-400`}
                />
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center space-x-1 text-sm text-red-600 dark:text-red-400"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
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
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60"
            >
              <div className="flex items-center space-x-3">
                <div className="text-xl text-gray-500">ℹ️</div>
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Conexión segura
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Tus credenciales se encriptan y solo se usan para
                    sincronizar tu catálogo musical.
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
        transition={{ delay: 0.8 }}
        className="flex space-x-4 pt-6"
      >
        <button
          onClick={prevStep}
          className="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          ← Anterior
        </button>

        <button
          onClick={handleSubmit}
          disabled={!selectedDistributor}
          className={`flex-1 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 ${
            selectedDistributor
              ? "transform bg-gradient-to-r from-gray-500 to-gray-700 shadow-lg hover:-translate-y-0.5 hover:from-gray-600 hover:to-gray-800 hover:shadow-xl"
              : "cursor-not-allowed bg-gray-300 dark:bg-gray-600"
          }`}
        >
          Continuar →
        </button>
      </motion.div>
    </div>
  );
};

export default DistributorStep;
