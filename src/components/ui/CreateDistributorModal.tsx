import { useState } from "react";
import { X, Building2 } from "lucide-react";
import type { CreateDistributorPayload, Currency } from "../../types/distributor.types";

interface Props {
  onClose: () => void;
  onConfirm: (payload: CreateDistributorPayload) => Promise<void>;
}

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "USD", label: "Dólar (USD)", symbol: "$" },
  { value: "EUR", label: "Euro (EUR)", symbol: "€" },
];

export default function CreateDistributorModal({ onClose, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initials = name.trim().slice(0, 2).toUpperCase() || "??";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onConfirm({ name: name.trim(), currency });
      onClose();
    } catch {
      setError("No se pudo crear el distribuidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-4 flex w-full max-w-md flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#111827]">Nuevo Distribuidor</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-[#6B7280]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100">
              {name.trim() ? (
                <span className="text-xl font-bold text-[#F97316]">{initials}</span>
              ) : (
                <Building2 className="h-6 w-6 text-[#F97316]" />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-[#111827]">
                {name.trim() || "Nombre del distribuidor"}
              </span>
              <span className="text-xs text-[#9CA3AF]">Vista previa del avatar</span>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#374151]">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Spotify Distribution, TuneCore..."
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#F97316] focus:outline-none"
            />
          </div>

          {/* Currency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#374151]">
              Moneda
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CURRENCIES.map(({ value, label, symbol }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCurrency(value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    currency === value
                      ? "border-[#F97316] bg-orange-50 text-[#F97316]"
                      : "border-gray-200 text-[#6B7280] hover:border-gray-300"
                  }`}
                >
                  <span className="text-base font-bold">{symbol}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-lg border border-gray-200 text-sm font-medium text-[#6B7280] transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-10 flex-1 rounded-lg bg-[#F97316] text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear distribuidor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
