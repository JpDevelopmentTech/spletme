import { useState } from "react";
import { motion } from "framer-motion";

interface AccountDetailsStepProps {
  nextStep: () => void;
  prevStep: () => void;
}

const AccountDetailsStep = ({ nextStep, prevStep }: AccountDetailsStepProps) => {
  const [formData, setFormData] = useState({
    country: "",
    phone: "",
    address: "",
    identification: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const countries = [
    { code: "CO", name: "Colombia", flag: "🇨🇴" },
    { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "MX", name: "México", flag: "🇲🇽" },
    { code: "AR", name: "Argentina", flag: "🇦🇷" },
    { code: "ES", name: "España", flag: "🇪🇸" },
    { code: "PE", name: "Perú", flag: "🇵🇪" },
    { code: "CL", name: "Chile", flag: "🇨🇱" },
    { code: "EC", name: "Ecuador", flag: "🇪🇨" },
    { code: "VE", name: "Venezuela", flag: "🇻🇪" },
    { code: "BO", name: "Bolivia", flag: "🇧🇴" }
  ];

  const formFields = [
    {
      id: "country",
      label: "País de residencia",
      icon: "🌍",
      type: "select",
      placeholder: "Selecciona tu país",
      required: true
    },
    {
      id: "phone",
      label: "Número de teléfono",
      icon: "📱",
      type: "tel",
      placeholder: "+57 300 123 4567",
      required: true
    },
    {
      id: "address",
      label: "Dirección de residencia",
      icon: "🏠",
      type: "text",
      placeholder: "Calle 123 #45-67, Bogotá",
      required: true
    },
    {
      id: "identification",
      label: "Número de identificación",
      icon: "🆔",
      type: "text",
      placeholder: "1234567890",
      required: true
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.country) {
      newErrors.country = "Por favor selecciona tu país";
    }

    if (!formData.phone) {
      newErrors.phone = "El número de teléfono es requerido";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Ingresa un número de teléfono válido";
    }

    if (!formData.address) {
      newErrors.address = "La dirección es requerida";
    } else if (formData.address.length < 10) {
      newErrors.address = "Ingresa una dirección más específica";
    }

    if (!formData.identification) {
      newErrors.identification = "El número de identificación es requerido";
    } else if (!/^\d{6,}$/.test(formData.identification)) {
      newErrors.identification = "Ingresa un número de identificación válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={field.id === "address" ? "md:col-span-2" : ""}
          >
            <label
              htmlFor={field.id}
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{field.icon}</span>
                <span>{field.label}</span>
                {field.required && <span className="text-red-500">*</span>}
              </div>
            </label>

            {field.type === "select" ? (
              <div className="relative">
                <select
                  id={field.id}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors[field.id]
                      ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-blue-400"
                  } dark:text-white`}
                >
                  <option value="">{field.placeholder}</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ) : (
              <input
                type={field.type}
                id={field.id}
                value={formData[field.id as keyof typeof formData]}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors[field.id]
                    ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                    : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-blue-400"
                } dark:text-white dark:placeholder-gray-400`}
              />
            )}

            {errors[field.id] && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors[field.id]}</span>
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Información adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-xl">🔒</div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Tu información está segura
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Utilizamos encriptación de nivel bancario para proteger todos tus datos personales.
              Esta información solo se usa para verificar tu identidad y cumplir con regulaciones.
            </p>
          </div>
        </div>
      </motion.div>

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
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          <span>Continuar</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.div>
        </button>
      </motion.div>
    </div>
  );
};

export default AccountDetailsStep; 