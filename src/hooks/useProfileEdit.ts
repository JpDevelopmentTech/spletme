import { useState } from "react";
import { AuthService } from "@/services/auth";
import type { ProfileUserData, EditProfileForm } from "@/types/profile.types";

/**
 * Gestiona el formulario de edición de país, profesión y dirección del perfil.
 */
export function useProfileEdit(
  userData: ProfileUserData,
  onSuccess: (patch: Partial<ProfileUserData["onboardingData"]>) => void,
) {
  const [editForm, setEditForm] = useState<EditProfileForm>({
    country: userData.onboardingData.country ?? "",
    profession: userData.onboardingData.profession ?? "",
    otherProfession: userData.onboardingData.otherProfession ?? "",
    address: userData.onboardingData.address ?? "",
  });
  const [editErrors, setEditErrors] = useState<Partial<EditProfileForm>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<EditProfileForm> = {};
    if (!editForm.country.trim()) errs.country = "Requerido";
    if (!editForm.profession.trim()) errs.profession = "Requerido";
    if (editForm.profession === "otro" && !editForm.otherProfession.trim())
      errs.otherProfession = "Selecciona tu profesión específica";
    if (!editForm.address.trim()) errs.address = "Requerido";
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validate()) return;
    setEditLoading(true);
    setEditError("");
    setEditSuccess(false);
    try {
      const finalProfession =
        editForm.profession === "otro" ? editForm.otherProfession : editForm.profession;
      const payload = {
        country: editForm.country || null,
        profession: finalProfession || null,
        address: editForm.address || null,
      };
      const response = await AuthService.updateProfileInfo(payload);
      if (!response) throw new Error("Sin respuesta del servidor");

      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...u,
            onboardingData: { ...(u.onboardingData ?? {}), ...payload },
          }),
        );
      }
      onSuccess(payload);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 1500);
    } catch {
      setEditError("No se pudo guardar. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setEditLoading(false);
    }
  };

  return {
    editForm,
    setEditForm,
    editErrors,
    setEditErrors,
    editLoading,
    editError,
    editSuccess,
    handleSaveProfile,
  };
}
