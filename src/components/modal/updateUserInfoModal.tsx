import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Loader2,
  Lock,
  Globe,
  Briefcase,
  MapPin,
  ChevronDown,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface UserD {
  username: string;
  name: string;
  lastName: string;
  email: string;
  onboardingData?: {
    country?: string | null;
    profession?: string | null;
    otherProfession?: string | null;
    address?: string | null;
  };
}

interface UpdateUserPayload {
  country?: string | null;
  profession?: string | null;
  otherProfession?: string | null;
  address?: string | null;
}

interface UpdateModalProps {
  user: UserD;
  onClose: () => void;
  onSave: (data: UpdateUserPayload) => Promise<void>;
}

// ── Data ───────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: "CO", name: "🇨🇴 Colombia" },
  { code: "US", name: "🇺🇸 Estados Unidos" },
  { code: "MX", name: "🇲🇽 México" },
  { code: "AR", name: "🇦🇷 Argentina" },
  { code: "ES", name: "🇪🇸 España" },
  { code: "PE", name: "🇵🇪 Perú" },
  { code: "CL", name: "🇨🇱 Chile" },
  { code: "EC", name: "🇪🇨 Ecuador" },
  { code: "VE", name: "🇻🇪 Venezuela" },
  { code: "BO", name: "🇧🇴 Bolivia" },
];

const PROFESSIONS = [
  {
    id: "artista",
    name: "Artista",
    description: "Cantante, músico o intérprete",
  },
  {
    id: "productor",
    name: "Productor",
    description: "Productor musical o de audio",
  },
  {
    id: "compositor",
    name: "Compositor",
    description: "Compositor o escritor de canciones",
  },
  { id: "otro", name: "Otro", description: "Otra profesión musical" },
];

const OTHER_PROFESSIONS = [
  "Ingeniero de sonido",
  "Diseñador de sonido",
  "Diseñador de audio",
  "Ingeniero de mezcla",
  "Ingeniero de masterización",
  "Ingeniero de grabación",
  "Manager musical",
  "Promotor de eventos",
  "DJ",
  "Locutor",
  "Podcaster",
];

// ── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string, lastName: string) {
  return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// ── Shared style strings ───────────────────────────────────────────────────

const inputBase = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-gray-50 dark:bg-gray-800/70
  text-gray-900 dark:text-white
  border transition-all duration-150 outline-none
  placeholder:text-gray-300 dark:placeholder:text-gray-600
  appearance-none
`;

const inputNormal =
  "border-gray-200 dark:border-gray-700 focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-400/20";

const inputError =
  "border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-400/20";

// ── Sub-components ─────────────────────────────────────────────────────────

const FieldLabel = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
    <span className="text-gray-300 dark:text-gray-600">{icon}</span>
    {label}
  </label>
);

const ErrorMsg = ({ message }: { message?: string | null }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        className="mt-1.5 text-xs text-red-500"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const StyledSelect = ({
  hasError,
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) => (
  <div className="relative">
    <select
      {...props}
      className={`${inputBase} pr-10 ${hasError ? inputError : inputNormal} ${className}`}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
  </div>
);

// ── Main Modal ─────────────────────────────────────────────────────────────

const UpdateModal = ({ user, onClose, onSave }: UpdateModalProps) => {
  const [form, setForm] = useState<UpdateUserPayload>({
    country: user.onboardingData?.country || "",
    profession: user.onboardingData?.profession || "",
    otherProfession: user.onboardingData?.otherProfession || "",
    address: user.onboardingData?.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<UpdateUserPayload>>({});
  const [saveError, setSaveError] = useState("");

  const validate = (): boolean => {
    const newErrors: Partial<UpdateUserPayload> = {};
    if (!form.country?.trim()) newErrors.country = "El país es requerido";
    if (!form.profession?.trim())
      newErrors.profession = "La profesión es requerida";
    if (form.profession === "otro" && !form.otherProfession?.trim())
      newErrors.otherProfession = "Selecciona tu profesión específica";
    if (!form.address?.trim()) newErrors.address = "La dirección es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setSaveError("");
    try {
      const finalProfession =
        form.profession === "otro" ? form.otherProfession : form.profession;
      await onSave({
        country: form.country,
        profession: finalProfession,
        address: form.address,
      });
      onClose();
    } catch (e) {
      setSaveError(
        e instanceof Error
          ? e.message
          : "No se pudo guardar. Intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearError = (key: keyof UpdateUserPayload) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const initials = getInitials(user.name, user.lastName);
  const fullName = `${user.name} ${user.lastName}`.trim();
  const selectedProfessionDesc = PROFESSIONS.find(
    (p) => p.id === form.profession,
  )?.description;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800"
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ type: "spring", damping: 22, stiffness: 320 }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 select-none">
                  {initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                  {fullName}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  @{user.username}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="px-6 py-5 space-y-5 max-h-[62vh] overflow-y-auto">
            {/* Locked fields */}
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Información bloqueada
                </p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { label: "Nombre", value: fullName },
                  { label: "Usuario", value: `@${user.username}` },
                  { label: "Correo", value: user.email },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-4 py-2.5 gap-4"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <Lock className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── País ── */}
            <div>
              <FieldLabel
                icon={<Globe className="w-3.5 h-3.5" />}
                label="País"
              />
              <StyledSelect
                value={form.country ?? ""}
                hasError={!!errors.country}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, country: e.target.value }));
                  clearError("country");
                }}
              >
                <option value="">Selecciona tu país</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </StyledSelect>
              <ErrorMsg message={errors.country} />
            </div>

            {/* ── Profesión ── */}
            <div>
              <FieldLabel
                icon={<Briefcase className="w-3.5 h-3.5" />}
                label="Profesión"
              />
              <StyledSelect
                value={form.profession ?? ""}
                hasError={!!errors.profession}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    profession: value,
                    otherProfession:
                      value === "otro" ? prev.otherProfession : "",
                  }));
                  clearError("profession");
                }}
              >
                <option value="">Selecciona tu profesión</option>
                {PROFESSIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </StyledSelect>

              <AnimatePresence>
                {selectedProfessionDesc && (
                  <motion.p
                    className="mt-1.5 text-xs text-gray-400 dark:text-gray-500"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {selectedProfessionDesc}
                  </motion.p>
                )}
              </AnimatePresence>

              <ErrorMsg message={errors.profession} />

              {/* Sub-select "otro" */}
              <AnimatePresence>
                {form.profession === "otro" && (
                  <motion.div
                    className="mt-3"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                      Profesión específica
                    </label>
                    <StyledSelect
                      value={form.otherProfession ?? ""}
                      hasError={!!errors.otherProfession}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          otherProfession: e.target.value,
                        }));
                        clearError("otherProfession");
                      }}
                    >
                      <option value="">
                        Selecciona tu profesión específica
                      </option>
                      {OTHER_PROFESSIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </StyledSelect>
                    <ErrorMsg message={errors.otherProfession} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Dirección ── */}
            <div>
              <FieldLabel
                icon={<MapPin className="w-3.5 h-3.5" />}
                label="Dirección"
              />
              <input
                type="text"
                value={form.address ?? ""}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, address: e.target.value }));
                  clearError("address");
                }}
                placeholder="Escribe tu dirección"
                className={`${inputBase} ${errors.address ? inputError : inputNormal}`}
              />
              <ErrorMsg message={errors.address} />
            </div>
          </div>

          {/* ── Save error ── */}
          <AnimatePresence>
            {saveError && (
              <motion.div
                className="mx-6 mb-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-xs text-red-600 dark:text-red-400"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {saveError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Footer ── */}
          <div className="flex gap-2.5 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors disabled:opacity-60"
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
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateModal;
