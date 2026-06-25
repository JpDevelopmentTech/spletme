import { useState } from "react";
import {
  X,
  UserPlus,
  Layers,
  Tag,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Music2,
  Users,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LabelsService from "../../services/labels";

interface InviteCollaboratorToLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelType: "artistic" | "custom";
  labelIdentifier: string;
  labelName: string;
  songCount: number;
  onSuccess?: () => void;
}

export default function InviteCollaboratorToLabelModal({
  isOpen,
  onClose,
  labelType,
  labelIdentifier,
  labelName,
  songCount,
  onSuccess,
}: InviteCollaboratorToLabelModalProps) {
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [invitationResult, setInvitationResult] = useState<{
    collaboratorName: string;
    collaboratorEmail: string;
    totalSongs: number;
  } | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setError("");

    if (!collaboratorEmail.trim()) {
      setError("El correo electrónico del colaborador es requerido");
      return;
    }

    if (!isValidEmail(collaboratorEmail.trim())) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);

    try {
      const response = await LabelsService.inviteCollaboratorToLabel({
        labelType,
        labelIdentifier,
        collaboratorEmail: collaboratorEmail.trim().toLowerCase(),
      });

      if (response.error) {
        setError(response.message || "Error al enviar la invitación");
      } else if (response.data) {
        setSuccess(true);
        setInvitationResult({
          collaboratorName: response.data.collaboratorName,
          collaboratorEmail: response.data.collaboratorEmail,
          totalSongs: response.data.totalSongs,
        });
        onSuccess?.();
      }
    } catch (err) {
      console.error("Error inviting collaborator:", err);
      setError("Error al enviar la invitación");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCollaboratorEmail("");
    setSuccess(false);
    setError("");
    setInvitationResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`border-b border-gray-200 p-6 dark:border-gray-700 ${
                  labelType === "custom"
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
                    : "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${
                          labelType === "custom"
                            ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500"
                            : "bg-gradient-to-br from-indigo-500 to-purple-600"
                        }`}
                      >
                        <UserPlus className="h-6 w-6 text-white" />
                      </div>
                      {labelType === "custom" && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Invitar Colaborador
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        {labelType === "custom" ? (
                          <Layers className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Tag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            labelType === "custom"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-indigo-600 dark:text-indigo-400"
                          }`}
                        >
                          {labelName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {success && invitationResult ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4 text-center"
                  >
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg ${
                        labelType === "custom"
                          ? "bg-gradient-to-br from-amber-400 to-orange-500"
                          : "bg-gradient-to-br from-green-400 to-emerald-500"
                      }`}
                    >
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      ¡Invitación Enviada!
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      Se ha enviado una invitación a{" "}
                      <strong>{invitationResult.collaboratorName}</strong>
                    </p>
                    <div className="mx-auto max-w-sm rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email:{" "}
                        <span className="font-medium">
                          {invitationResult.collaboratorEmail}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Canciones que se agregarán:{" "}
                        <span className="font-medium">
                          {invitationResult.totalSongs}
                        </span>
                      </p>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                      El colaborador recibirá un email con un enlace para
                      aceptar la invitación. La invitación expira en 7 días.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Info Box */}
                    <div
                      className={`mb-6 rounded-xl border p-4 ${
                        labelType === "custom"
                          ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                          : "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-lg p-2 ${
                            labelType === "custom"
                              ? "bg-amber-100 dark:bg-amber-800/30"
                              : "bg-indigo-100 dark:bg-indigo-800/30"
                          }`}
                        >
                          <Users
                            className={`h-5 w-5 ${
                              labelType === "custom"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-indigo-600 dark:text-indigo-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              labelType === "custom"
                                ? "text-amber-700 dark:text-amber-300"
                                : "text-indigo-700 dark:text-indigo-300"
                            }`}
                          >
                            ¿Qué sucede al aceptar?
                          </p>
                          <p
                            className={`mt-1 text-sm ${
                              labelType === "custom"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-indigo-600 dark:text-indigo-400"
                            }`}
                          >
                            El colaborador será agregado automáticamente a las{" "}
                            <strong>{songCount} canciones</strong> de este
                            label, permitiéndole ver sus métricas y datos.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Song count indicator */}
                    <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
                      <div
                        className={`rounded-lg p-2 ${
                          labelType === "custom"
                            ? "bg-amber-100 dark:bg-amber-800/30"
                            : "bg-indigo-100 dark:bg-indigo-800/30"
                        }`}
                      >
                        <Music2
                          className={`h-5 w-5 ${
                            labelType === "custom"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-indigo-600 dark:text-indigo-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Canciones en el label
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {songCount}
                        </p>
                      </div>
                    </div>

                    {/* Collaborator Email Input */}
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Correo Electrónico del Colaborador
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail
                            className={`h-5 w-5 ${
                              labelType === "custom"
                                ? "text-amber-500"
                                : "text-indigo-500"
                            }`}
                          />
                        </div>
                        <input
                          type="email"
                          value={collaboratorEmail}
                          onChange={(e) => setCollaboratorEmail(e.target.value)}
                          placeholder="colaborador@email.com"
                          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Ingresa el correo electrónico del usuario registrado que
                        deseas invitar
                      </p>
                    </div>

                    {/* Note */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Nota:</strong> Los splits de pago se configuran
                        por separado después de que el colaborador acepte la
                        invitación.
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                      >
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
                {!success ? (
                  <>
                    <button
                      onClick={handleClose}
                      disabled={loading}
                      className="rounded-lg px-6 py-2.5 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={
                        loading ||
                        !collaboratorEmail.trim() ||
                        !isValidEmail(collaboratorEmail.trim())
                      }
                      className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-white shadow-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        labelType === "custom"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                          : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-5 w-5" />
                          <span>Enviar Invitación</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleClose}
                    className={`rounded-lg px-6 py-2.5 text-white shadow-md transition-colors ${
                      labelType === "custom"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                    }`}
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
