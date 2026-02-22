import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Wallet, Mail, User, Phone, Globe, AlertCircle, Building2 } from "lucide-react";

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ success: boolean; message?: string }>;
}

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CO", name: "Colombia" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "BR", name: "Brazil" },
  { code: "CL", name: "Chile" },
  { code: "PE", name: "Peru" },
  { code: "ES", name: "Spain" },
  { code: "GB", name: "United Kingdom" },
];

const inputClass =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F97316] transition-colors bg-white";

const labelClass =
  "flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5";

export default function CreateWalletModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateWalletModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    contact_type: "personal",
    country: "US",
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      contact_type: "personal",
      country: "US",
    });
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await onSubmit(formData);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || "Error al crear la wallet");
      }
    } catch (err: any) {
      setError(err.message || "Error al crear la wallet");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-lg w-full mx-4 overflow-hidden flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#F97316] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base leading-tight">
                Crear Wallet
              </h2>
              <p className="text-white/80 text-xs mt-0.5">
                Configura tu wallet de pagos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-[#F7F8FA]">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <User className="w-3.5 h-3.5" /> Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Juan"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <User className="w-3.5 h-3.5" /> Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Pérez"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              <Mail className="w-3.5 h-3.5" /> Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="juan@ejemplo.com"
              className={inputClass}
            />
          </div>

          {/* Phone + Country row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <Phone className="w-3.5 h-3.5" /> Teléfono
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                placeholder="+1234567890"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <Globe className="w-3.5 h-3.5" /> País
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className={inputClass}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact type */}
          <div>
            <label className={labelClass}>
              <Building2 className="w-3.5 h-3.5" /> Tipo de contacto
            </label>
            <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 gap-0.5">
              {(["personal", "business"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, contact_type: type }))
                  }
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                    formData.contact_type === type
                      ? "bg-[#F97316] text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type === "personal" ? "Personal" : "Empresa"}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-5 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form=""
            disabled={loading}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            {loading ? "Creando..." : "Crear Wallet"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
