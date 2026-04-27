import { useState } from "react";
import { motion} from "framer-motion";
import {  X, Check, Loader2, Mail } from "lucide-react";
 
// ── Types ──────────────────────────────────────────────────────────────────
 
export interface UserD {
  username: string;
  name: string;
  lastName: string;
  email: string;
}
 
interface UpdateUserPayload {
  username?: string;
  name?: string;
  lastName?: string;
}
 
// ── Update Modal ───────────────────────────────────────────────────────────
 
interface UpdateModalProps {
  user: UserD;
  onClose: () => void;
  onSave: (data: UpdateUserPayload) => Promise<void>;
}
 
const UpdateModal = ({ user, onClose, onSave }: UpdateModalProps) => {
  const [form, setForm] = useState<UpdateUserPayload>({
    username: user.username,
    name: user.name,
    lastName: user.lastName,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<UpdateUserPayload>>({});
 
  const validate = (): boolean => {
    const newErrors: Partial<UpdateUserPayload> = {};
    if (!form.username?.trim()) newErrors.username = "El usuario es requerido";
    else if (form.username.length < 3) newErrors.username = "Mínimo 3 caracteres";
    if (!form.name?.trim()) newErrors.name = "El nombre es requerido";
    else if (form.name.length < 2) newErrors.name = "Mínimo 2 caracteres";
    if (!form.lastName?.trim()) newErrors.lastName = "El apellido es requerido";
    else if (form.lastName.length < 2) newErrors.lastName = "Mínimo 2 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
 
  const fields: { key: keyof UpdateUserPayload; label: string; placeholder: string }[] = [
    { key: "name",      label: "Nombre",          placeholder: "Tu nombre" },
    { key: "lastName",  label: "Apellido",         placeholder: "Tu apellido" },
    { key: "username",  label: "Nombre de usuario", placeholder: "usuario123" },
  ];
 
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
 
      {/* Modal */}
      <motion.div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Editar perfil
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              El correo no puede modificarse
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
 
        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* Email — readonly */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Correo electrónico
            </label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-dashed border-gray-200 dark:border-gray-600">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              
              <span className="text-sm text-gray-400 dark:text-gray-500 select-none">
                {user.email}
              </span>
              <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                Fijo
              </span>
            </div>
          </div>
 
          {/* Editable fields */}
          {fields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <input
                type="text"
                value={form[key] ?? ""}
                onChange={e => {
                  setForm(prev => ({ ...prev, [key]: e.target.value }));
                  if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
                }}
                placeholder={placeholder}
                className={`
                  w-full px-4 py-3 rounded-xl text-sm text-gray-900 dark:text-white
                  bg-gray-50 dark:bg-gray-700/50
                  border transition-colors outline-none
                  placeholder:text-gray-400
                  focus:ring-2 focus:ring-purple-500/30
                  ${errors[key]
                    ? "border-red-400 dark:border-red-500 focus:border-red-400"
                    : "border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500"
                  }
                `}
              />
              {errors[key] && (
                <motion.p
                  className="mt-1 text-xs text-red-500"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors[key]}
                </motion.p>
              )}
            </div>
          ))}
        </div>
 
        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando…
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UpdateModal;