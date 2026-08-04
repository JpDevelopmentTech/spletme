import { useMemo, useRef, useState, useEffect } from "react";
import { X, Building2, ChevronDown, Search, Check } from "lucide-react";
import type { CreateDistributorPayload, Currency } from "../../types/distributor.types";
import { SPOTIFY_DISTRIBUTORS, type SpotifyDistributor } from "../../const/distributors";

interface Props {
  onClose: () => void;
  onConfirm: (payload: CreateDistributorPayload) => Promise<void>;
}

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "USD", label: "Dólar (USD)", symbol: "$" },
  { value: "EUR", label: "Euro (EUR)", symbol: "€" },
];

export default function CreateDistributorModal({ onClose, onConfirm }: Props) {
  const [provider, setProvider] = useState<SpotifyDistributor | null>(null);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado del selector desplegable de distribuidores
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  // Cerrar el desplegable al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SPOTIFY_DISTRIBUTORS;
    return SPOTIFY_DISTRIBUTORS.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);

  const initials = name.trim().slice(0, 2).toUpperCase() || "??";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!provider) {
      setError("Selecciona un distribuidor");
      return;
    }
    if (!name.trim()) {
      setError("El nombre (alias) es obligatorio");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onConfirm({
        name: name.trim(),
        currency,
        provider: provider.name,
        photoUrl: provider.logo,
      });
      onClose();
    } catch {
      setError("No se pudo crear el distribuidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function selectProvider(d: SpotifyDistributor) {
    setProvider(d);
    setOpen(false);
    setQuery("");
    // Sugerir el nombre oficial como alias inicial si el campo está vacío
    if (!name.trim()) setName(d.name);
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
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-100">
              {provider ? (
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className="h-full w-full object-contain"
                />
              ) : name.trim() ? (
                <span className="text-xl font-bold text-[#F97316]">{initials}</span>
              ) : (
                <Building2 className="h-6 w-6 text-[#F97316]" />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-[#111827]">
                {name.trim() || provider?.name || "Nombre del distribuidor"}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {provider ? provider.name : "Vista previa del avatar"}
              </span>
            </div>
          </div>

          {/* Distributor selector */}
          <div className="flex flex-col gap-1.5" ref={selectRef}>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#374151]">
              Distribuidor *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 text-sm transition-colors focus:border-[#F97316] focus:outline-none"
              >
                {provider ? (
                  <span className="flex items-center gap-2 truncate">
                    <img
                      src={provider.logo}
                      alt=""
                      className="h-5 w-5 flex-shrink-0 rounded object-contain"
                    />
                    <span className="truncate text-[#111827]">{provider.name}</span>
                  </span>
                ) : (
                  <span className="text-[#9CA3AF]">Selecciona un distribuidor...</span>
                )}
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#6B7280]" />
              </button>

              {open && (
                <div className="absolute z-10 mt-1 flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                    <Search className="h-4 w-4 flex-shrink-0 text-[#9CA3AF]" />
                    <input
                      autoFocus
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar distribuidor..."
                      className="w-full text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <p className="px-3 py-3 text-sm text-[#9CA3AF]">Sin resultados</p>
                    ) : (
                      filtered.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => selectProvider(d)}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-orange-50"
                        >
                          <img
                            src={d.logo}
                            alt=""
                            loading="lazy"
                            className="h-6 w-6 flex-shrink-0 rounded object-contain"
                          />
                          <span className="flex-1 truncate text-[#111827]">{d.name}</span>
                          {provider?.id === d.id && (
                            <Check className="h-4 w-4 flex-shrink-0 text-[#F97316]" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Name (alias) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#374151]">
              Nombre (alias) *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Mi cuenta de DistroKid, TuneCore label..."
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#F97316] focus:outline-none"
            />
            <span className="text-xs text-[#9CA3AF]">
              Un nombre personalizado para identificar este distribuidor.
            </span>
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
