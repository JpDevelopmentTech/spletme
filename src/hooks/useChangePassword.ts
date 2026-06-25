import { useState } from "react";
import { AuthService } from "@/services/auth";

/**
 * Gestiona el formulario de cambio de contraseña con validación y feedback.
 */
export function useChangePassword(onSuccess: () => void) {
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdShow, setPwdShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    const authToken = (localStorage.getItem("token") ?? "").trim();
    if (!pwdForm.currentPassword.trim()) {
      setPwdError("Ingresa tu contraseña actual");
      return;
    }
    if (pwdForm.newPassword.length < 8) {
      setPwdError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdError("Las contraseñas nuevas no coinciden");
      return;
    }
    if (!authToken) {
      setPwdError("No se encontró token de autenticación");
      return;
    }

    setPwdLoading(true);
    try {
      const response = await AuthService.changePassword(
        pwdForm.newPassword,
        pwdForm.confirmPassword,
        pwdForm.currentPassword,
        authToken,
      );
      if (!response.success) {
        setPwdError(response.message ?? "Error al cambiar la contraseña");
        return;
      }
      setPwdSuccess(
        response.message ?? "Contraseña actualizada correctamente.",
      );
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setPwdSuccess("");
        onSuccess();
      }, 2000);
    } catch {
      setPwdError("Error al cambiar la contraseña.");
    } finally {
      setPwdLoading(false);
    }
  };

  return {
    pwdForm,
    setPwdForm,
    pwdShow,
    setPwdShow,
    pwdError,
    pwdSuccess,
    pwdLoading,
    handleChangePassword,
  };
}
