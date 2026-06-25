import { useState, useCallback, useEffect } from "react";
import { AuthService } from "@/services/auth";
import LocalStorageService from "@/services/localstorage";
import { extractSubprofiles } from "@/utils/profile.utils";
import type { SubprofileItem } from "@/types/profile.types";
import type { RegisterSubuserSchema } from "@/types";

/**
 * Gestiona la lista de subperfiles: carga, desvinculación y creación.
 */
export function useSubprofiles(parentUserId: string) {
  const [subprofiles, setSubprofiles] = useState<SubprofileItem[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState("");
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [unlinkSuccess, setUnlinkSuccess] = useState("");

  const [createForm, setCreateForm] = useState<RegisterSubuserSchema>({
    parentUserId,
    username: "",
    email: "",
    name: "",
    lastName: "",
  });
  const [createErrors, setCreateErrors] = useState<
    Partial<RegisterSubuserSchema>
  >({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const loadSubprofiles = useCallback(async () => {
    setSubLoading(true);
    setSubError("");
    try {
      const response = await AuthService.getSubUsersByUser();
      if (!response) {
        setSubError("No se pudieron cargar los subperfiles.");
        return;
      }
      const currentUser = LocalStorageService.getItem("user");
      const currentId = currentUser?.id ?? currentUser?._id ?? "";
      const currentEmail = (currentUser?.email ?? "").toLowerCase();
      const all = extractSubprofiles(response);
      setSubprofiles(
        all.filter(
          (s) => s.id !== currentId && s.email.toLowerCase() !== currentEmail,
        ),
      );
    } catch {
      setSubError("Error al cargar los subperfiles.");
    } finally {
      setSubLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubprofiles();
  }, [loadSubprofiles]);

  const handleUnlink = async (id: string) => {
    setUnlinkingId(id);
    setSubError("");
    setUnlinkSuccess("");
    try {
      const result = await AuthService.unlinkSubuser(id);
      if (!result.success) {
        setSubError(result.message);
        return;
      }
      setSubprofiles((prev) => prev.filter((s) => s.id !== id));
      setConfirmingId(null);
      setUnlinkSuccess("Subperfil desvinculado correctamente.");
      setTimeout(() => setUnlinkSuccess(""), 3000);
    } catch {
      setSubError("Error al desvincular.");
    } finally {
      setUnlinkingId(null);
    }
  };

  const validateCreate = (): boolean => {
    const errs: Partial<RegisterSubuserSchema> = {};
    if (!createForm.username.trim()) errs.username = "Requerido";
    if (!createForm.name.trim()) errs.name = "Requerido";
    if (!createForm.lastName.trim()) errs.lastName = "Requerido";
    if (!createForm.email.trim()) errs.email = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email))
      errs.email = "Correo inválido";
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubprofile = async (
    e: React.FormEvent,
    onDone: () => void,
  ) => {
    e.preventDefault();
    if (!validateCreate()) return;
    setCreateLoading(true);
    setCreateError("");
    setCreateSuccess(false);
    try {
      const response = await AuthService.registerSubuser(createForm);
      if (!response) throw new Error();
      setCreateSuccess(true);
      setCreateForm({
        parentUserId,
        username: "",
        email: "",
        name: "",
        lastName: "",
      });
      setTimeout(() => {
        setCreateSuccess(false);
        onDone();
        void loadSubprofiles();
      }, 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setCreateError(msg ?? "Error al crear el subperfil.");
    } finally {
      setCreateLoading(false);
    }
  };

  return {
    subprofiles,
    subLoading,
    subError,
    unlinkingId,
    confirmingId,
    setConfirmingId,
    unlinkSuccess,
    createForm,
    setCreateForm,
    createErrors,
    setCreateErrors,
    createLoading,
    createError,
    createSuccess,
    loadSubprofiles,
    handleUnlink,
    handleCreateSubprofile,
  };
}
