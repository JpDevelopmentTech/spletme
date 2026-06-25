import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCcw,
  User,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { AuthService } from "@/services/auth";

interface SubprofileManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateSubprofile: () => void;
}

type ViewMode = "menu" | "unlink";

interface SubprofileItem {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
}

interface CurrentUserIdentity {
  ids: Set<string>;
  email?: string;
  username?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getString = (source: Record<string, unknown>, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
};

const extractSubprofilesArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.subusers)) {
    return payload.subusers;
  }

  if (Array.isArray(payload.subUsers)) {
    return payload.subUsers;
  }

  if (isRecord(payload.data)) {
    if (Array.isArray(payload.data.subusers)) {
      return payload.data.subusers;
    }

    if (Array.isArray(payload.data.subUsers)) {
      return payload.data.subUsers;
    }
  }

  return [];
};

const mapSubprofile = (item: unknown, index: number): SubprofileItem => {
  if (!isRecord(item)) {
    return {
      id: `subprofile-${index}`,
      name: "Subperfil",
      lastName: "",
      username: "sin-usuario",
      email: "Sin correo",
    };
  }

  const id = getString(item, ["id", "_id", "userId"]) || `subprofile-${index}`;

  return {
    id,
    name: getString(item, ["name", "firstName"]) || "Subperfil",
    lastName: getString(item, ["lastName", "surname"]) || "",
    username: getString(item, ["username", "userName"]) || "sin-usuario",
    email: getString(item, ["email"]) || "Sin correo",
  };
};

const normalizeText = (value: string | undefined): string => (value || "").trim().toLowerCase();

const getCurrentUserIdentity = (): CurrentUserIdentity => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    return { ids: new Set<string>() };
  }

  try {
    const parsed = JSON.parse(rawUser);
    if (!isRecord(parsed)) {
      return { ids: new Set<string>() };
    }

    const ids = new Set<string>();
    const rawId = getString(parsed, ["id", "_id", "userId"]);
    if (rawId) {
      ids.add(rawId);
    }

    const rawAltId = getString(parsed, ["_id"]);
    if (rawAltId) {
      ids.add(rawAltId);
    }

    return {
      ids,
      email: normalizeText(getString(parsed, ["email"])),
      username: normalizeText(getString(parsed, ["username", "userName"])),
    };
  } catch {
    return { ids: new Set<string>() };
  }
};

const isCurrentOwner = (subprofile: SubprofileItem, currentUser: CurrentUserIdentity): boolean => {
  if (currentUser.ids.has(subprofile.id)) {
    return true;
  }

  const subprofileEmail = normalizeText(subprofile.email);
  if (currentUser.email && subprofileEmail && currentUser.email === subprofileEmail) {
    return true;
  }

  const subprofileUsername = normalizeText(subprofile.username);
  if (currentUser.username && subprofileUsername && currentUser.username === subprofileUsername) {
    return true;
  }

  return false;
};

const SubprofileManagementModal = ({
  isOpen,
  onClose,
  onOpenCreateSubprofile,
}: SubprofileManagementModalProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("menu");
  const [subprofiles, setSubprofiles] = useState<SubprofileItem[]>([]);
  const [loadingSubprofiles, setLoadingSubprofiles] = useState(false);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadSubprofiles = useCallback(async () => {
    setLoadingSubprofiles(true);
    setErrorMessage("");
    setSuccessMessage("");

    const response = await AuthService.getSubUsersByUser();
    if (!response) {
      setSubprofiles([]);
      setErrorMessage("No se pudieron cargar los subperfiles.");
      setLoadingSubprofiles(false);
      return;
    }

    const entries = extractSubprofilesArray(response);
    const currentUser = getCurrentUserIdentity();
    const mappedSubprofiles = entries
      .map(mapSubprofile)
      .filter((subprofile) => !isCurrentOwner(subprofile, currentUser));
    setSubprofiles(mappedSubprofiles);
    setLoadingSubprofiles(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setViewMode("menu");
      setSubprofiles([]);
      setLoadingSubprofiles(false);
      setUnlinkingId(null);
      setConfirmingId(null);
      setErrorMessage("");
      setSuccessMessage("");
      return;
    }

    setViewMode("menu");
    setConfirmingId(null);
    setErrorMessage("");
    setSuccessMessage("");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && viewMode === "unlink") {
      void loadSubprofiles();
    }
  }, [isOpen, viewMode, loadSubprofiles]);

  const handleOpenCreate = () => {
    setViewMode("menu");
    onClose();
    onOpenCreateSubprofile();
  };

  const handleOpenUnlink = () => {
    setViewMode("unlink");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleUnlink = async (subprofileId: string) => {
    setErrorMessage("");
    setSuccessMessage("");
    setUnlinkingId(subprofileId);

    const result = await AuthService.unlinkSubuser(subprofileId);
    if (!result.success) {
      setErrorMessage(result.message);
      setUnlinkingId(null);
      return;
    }

    setSubprofiles((prev) => prev.filter((subprofile) => subprofile.id !== subprofileId));
    setSuccessMessage(result.message);
    setConfirmingId(null);
    setUnlinkingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 dark:border-gray-700">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Gestión de Subperfiles</h2>
                <p className="text-sm text-white/80">
                  Administra los subperfiles vinculados a tu cuenta
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
              {viewMode === "menu" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={handleOpenCreate}
                    className="group rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-indigo-800 dark:bg-indigo-900/20"
                  >
                    <div className="mb-3 inline-flex rounded-xl bg-indigo-500 p-3 text-white">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Crear subperfil
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Registra un nuevo subperfil para tu equipo con acceso independiente.
                    </p>
                  </button>

                  <button
                    onClick={handleOpenUnlink}
                    className="group rounded-2xl border border-red-100 bg-red-50 p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-red-900 dark:bg-red-900/20"
                  >
                    <div className="mb-3 inline-flex rounded-xl bg-red-500 p-3 text-white">
                      <UserMinus className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Desvincular subperfil
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Visualiza todos tus subperfiles y desvincula los que ya no necesites.
                    </p>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setViewMode("menu")}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver
                    </button>
                    <button
                      onClick={() => void loadSubprofiles()}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Actualizar
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  {successMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{successMessage}</span>
                      </div>
                    </div>
                  )}

                  {loadingSubprofiles ? (
                    <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-300">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Cargando subperfiles...
                    </div>
                  ) : subprofiles.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-300">
                      No tienes subperfiles vinculados actualmente.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {subprofiles.map((subprofile) => {
                        const fullName = [subprofile.name, subprofile.lastName].join(" ").trim();
                        const isProcessing = unlinkingId === subprofile.id;
                        const isConfirming = confirmingId === subprofile.id;

                        return (
                          <div
                            key={subprofile.id}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/40"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-indigo-500" />
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {fullName || "Subperfil"}
                                  </p>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    @{subprofile.username}
                                  </span>
                                </div>
                                <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <Mail className="h-4 w-4" />
                                  {subprofile.email}
                                </p>
                              </div>

                              {isConfirming ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => void handleUnlink(subprofile.id)}
                                    disabled={isProcessing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-70"
                                  >
                                    {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Confirmar
                                  </button>
                                  <button
                                    onClick={() => setConfirmingId(null)}
                                    disabled={isProcessing}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-70 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmingId(subprofile.id)}
                                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-300 dark:hover:bg-red-900/20"
                                >
                                  <UserMinus className="h-4 w-4" />
                                  Desvincular
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubprofileManagementModal;
