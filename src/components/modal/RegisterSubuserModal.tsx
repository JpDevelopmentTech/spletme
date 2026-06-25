import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserPlus,
  Mail,
  User,
  AlertCircle,
  Check,
  Loader2,
  UserCircle,
} from "lucide-react";
import { AuthService, RegisterSubuserSchema } from "@/services/auth";

interface RegisterSubuserModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentUserId: string;
  onSubuserCreated?: () => void;
}

const RegisterSubuserModal = ({
  isOpen,
  onClose,
  parentUserId,
  onSubuserCreated,
}: RegisterSubuserModalProps) => {
  const [formData, setFormData] = useState<RegisterSubuserSchema>({
    parentUserId,
    username: "",
    email: "",
    name: "",
    lastName: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const response = await AuthService.registerSubuser(formData);

      if (response) {
        setSuccessMessage(
          "Subusuario creado exitosamente. Se envió un código de verificación al correo.",
        );

        setTimeout(() => {
          onSubuserCreated?.();
          handleClose();
        }, 1500);
      } else {
        setErrors({
          submit: "Error al crear el subusuario. Intenta nuevamente.",
        });
      }
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || "Error al crear el subusuario",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        parentUserId,
        username: "",
        email: "",
        name: "",
        lastName: "",
      });
      setErrors({});
      setSuccessMessage("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Crear Subusuario
                  </h2>
                  <p className="text-sm text-white/80">
                    Agregar un nuevo subusuario a tu cuenta
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="rounded-lg p-2 transition-colors hover:bg-white/20 disabled:opacity-50"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
                >
                  <p className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <Check className="mr-2 h-4 w-4" />
                    {successMessage}
                  </p>
                </motion.div>
              )}

              {errors.submit && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                  <p className="flex items-center text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {errors.submit}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <UserCircle className="mr-2 inline h-4 w-4" />
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full rounded-xl border-2 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 ${
                      errors.username
                        ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-600"
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder="johndoe"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <User className="mr-2 inline h-4 w-4" />
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full rounded-xl border-2 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 ${
                        errors.name
                          ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-600"
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="Juan"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <User className="mr-2 inline h-4 w-4" />
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full rounded-xl border-2 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 ${
                        errors.lastName
                          ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-600"
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="Pérez"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Mail className="mr-2 inline h-4 w-4" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full rounded-xl border-2 px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 ${
                      errors.email
                        ? "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-600"
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder="juan@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-3 text-gray-600 transition-colors hover:text-gray-800 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Crear Subusuario
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterSubuserModal;
