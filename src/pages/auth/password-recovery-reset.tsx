import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth";
import { PasswordRecoverySessionHelper } from "@/helpers/passwordRecoverySession";

type PasswordRecoveryLocationState = {
  email?: string;
  token?: string;
};

const PasswordRecoveryReset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState =
    (location.state as PasswordRecoveryLocationState | null) ?? null;
  const stateRecoveryEmail = locationState?.email?.trim().toLowerCase() || "";
  const stateRecoveryToken = locationState?.token?.trim() || "";
  const persistedRecoverySession = useMemo(
    () => PasswordRecoverySessionHelper.get(),
    []
  );
  const recoveryEmail =
    stateRecoveryEmail || persistedRecoverySession?.email || "";
  const recoveryToken =
    stateRecoveryToken || persistedRecoverySession?.verificationCode || "";

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
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
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
    setSuccessMessage("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!recoveryEmail || !recoveryToken) {
      setPasswordError("No hay una sesión válida para restablecer la contraseña");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthService.resetPasswordByCode(
        recoveryEmail,
        recoveryToken,
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      if (!response.success) {
        setPasswordError(response.message || "Error al restablecer la contraseña");
        if ([400, 401, 404, 422].includes(response.status)) {
          PasswordRecoverySessionHelper.clear();
        }
        return;
      }

      PasswordRecoverySessionHelper.clear();
      setSuccessMessage(response.message || "Contraseña actualizada correctamente");
      navigate("/auth/email-login", { replace: true });
    } catch {
      setPasswordError("Error al restablecer la contraseña");
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
          onClick={() => navigate("/auth/password-recovery")}
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
              Restablecer Contraseña
            </h1>
          </div>

          {recoveryEmail ? (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Correo verificado: <span className="font-semibold">{recoveryEmail}</span>
            </p>
          ) : (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                No se encontró una sesión válida para restablecer la contraseña.
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth/password-recovery")}
                className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Ir a verificar código
              </button>
            </div>
          )}

          <motion.form onSubmit={handlePasswordSubmit} className="space-y-4">
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
              disabled={isSubmitting || !recoveryEmail || !recoveryToken}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Guardando..." : "Restablecer Contraseña"}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordRecoveryReset;
