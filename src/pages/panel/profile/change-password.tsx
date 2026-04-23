import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth";
import { PasswordRecoverySessionHelper } from "@/helpers/passwordRecoverySession";
import LocalStorageService from "@/services/localstorage";

type ChangePasswordLocationState = {
  email?: string;
  token?: string;
};

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as ChangePasswordLocationState | null) ?? null;
  const stateRecoveryEmail = locationState?.email?.trim().toLowerCase() || "";
  const stateRecoveryToken = locationState?.token?.trim() || "";
  const persistedRecoverySession = useMemo(
    () => PasswordRecoverySessionHelper.get(),
    []
  );
  const recoveryEmail = stateRecoveryEmail || persistedRecoverySession?.email || "";
  const recoveryToken = stateRecoveryToken || persistedRecoverySession?.verificationCode || "";
  const userFromStorage = LocalStorageService.getItem("user");
  const authToken = (localStorage.getItem("token") || "").trim();
  const currentUserId = (userFromStorage.id || userFromStorage.userId || "").toString().trim();
  const userEmail = (userFromStorage.email || "").toString().trim().toLowerCase();
  const canUseRecoveryFlow = Boolean(recoveryEmail && recoveryToken);
  const canUseUserFlow = Boolean(authToken);
  const canSubmit = canUseRecoveryFlow || canUseUserFlow;
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    email: recoveryEmail || userEmail,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (stateRecoveryEmail && stateRecoveryToken) {
      PasswordRecoverySessionHelper.save(stateRecoveryEmail, stateRecoveryToken);
    }
  }, [stateRecoveryEmail, stateRecoveryToken]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
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

    if (!canSubmit) {
      setPasswordError("No hay una sesión válida para cambiar la contraseña");
      return;
    }

    if (!canUseRecoveryFlow && !passwordData.currentPassword.trim()) {
      setPasswordError("Ingresa tu contraseña actual");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = canUseRecoveryFlow
        ? await AuthService.resetPasswordByCode(
            normalizedEmail,
            recoveryToken,
            passwordData.newPassword,
            passwordData.confirmPassword
          )
        : await AuthService.changePassword(
            normalizedEmail,
            passwordData.newPassword,
            passwordData.confirmPassword,
            passwordData.currentPassword,
            authToken,
            currentUserId
          );

      if (!response.success) {
        setPasswordError(response.message || "Error al cambiar la contraseña");
        if (canUseRecoveryFlow && [400, 401, 404, 422].includes(response.status)) {
          PasswordRecoverySessionHelper.clear();
        }
        return;
      }

      if (canUseRecoveryFlow) {
        PasswordRecoverySessionHelper.clear();
      }
      setPasswordData({
        email: normalizedEmail,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setSuccessMessage(response.message || "Contraseña actualizada correctamente");
    } catch {
      setPasswordError("Error al cambiar la contraseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cambiar Contraseña
            </h1>
          </div>

          {!canSubmit ? (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                No se encontró una sesión válida para cambiar la contraseña.
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth/password-recovery")}
                className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Ir a verificar código
              </button>
            </div>
          ) : canUseRecoveryFlow ? (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Correo verificado: <span className="font-semibold">{recoveryEmail}</span>
            </p>
          ) : (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Se actualizará la contraseña de tu cuenta actual.
            </p>
          )}

          <motion.form
            onSubmit={handlePasswordSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="email"
                name="email"
                value={passwordData.email}
                onChange={handlePasswordChange}
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Contraseña actual"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required={!canUseRecoveryFlow}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {passwordError}
              </motion.p>
            )}

            {successMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 dark:text-green-400 text-sm"
              >
                {successMessage}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
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
