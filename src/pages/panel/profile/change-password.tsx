import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth";
import LocalStorageService from "@/services/localstorage";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const userFromStorage = LocalStorageService.getItem("user");
  const authToken = (localStorage.getItem("token") || "").trim();
  const userEmail = (userFromStorage.email || "").toString().trim().toLowerCase();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    email: userEmail,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
    setSuccessMessage("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = passwordData.email.trim().toLowerCase();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setPasswordError("Ingresa un correo electrónico válido");
      return;
    }

    if (!authToken) {
      setPasswordError("No se encontró token de autenticación");
      return;
    }

    if (!passwordData.currentPassword.trim()) {
      setPasswordError("Ingresa tu contraseña actual");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthService.changePassword(
        passwordData.newPassword,
        passwordData.confirmPassword,
        passwordData.currentPassword,
        authToken,
      );

      if (!response.success) {
        setPasswordError(response.message || "Error al cambiar la contraseña");
        return;
      }

      setPasswordData({
        email: normalizedEmail,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccessMessage(response.message || "Contraseña actualizada correctamente");
    } catch {
      setPasswordError("Error al cambiar la contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver</span>
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/30">
              <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cambiar Contraseña</h1>
          </div>

          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Se actualizará la contraseña de tu cuenta actual.
          </p>

          <motion.form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Contraseña actual"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Nueva contraseña"
                minLength={8}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirmar nueva contraseña"
                minLength={8}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {passwordError}
              </motion.p>
            )}

            {successMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600 dark:text-green-400"
              >
                {successMessage}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 py-3 font-medium text-white transition-all duration-200 hover:from-indigo-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Guardando..." : "Cambiar Contraseña"}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePasswordPage;
