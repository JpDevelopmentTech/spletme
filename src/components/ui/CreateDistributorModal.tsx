import { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import type { CreateDistributorPayload, Currency } from '../../types/distributor.types';

interface Props {
  onClose: () => void;
  onConfirm: (payload: CreateDistributorPayload) => Promise<void>;
}

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'USD', label: 'Dólar (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
];

export default function CreateDistributorModal({ onClose, onConfirm }: Props) {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initials = name.trim().slice(0, 2).toUpperCase() || '??';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre es obligatorio'); return; }
    setLoading(true);
    setError('');
    try {
      await onConfirm({ name: name.trim(), currency });
      onClose();
    } catch {
      setError('No se pudo crear el distribuidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#111827]">Nuevo Distribuidor</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              {name.trim() ? (
                <span className="text-xl font-bold text-[#F97316]">{initials}</span>
              ) : (
                <Building2 className="w-6 h-6 text-[#F97316]" />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-[#111827]">
                {name.trim() || 'Nombre del distribuidor'}
              </span>
              <span className="text-xs text-[#9CA3AF]">Vista previa del avatar</span>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Spotify Distribution, TuneCore..."
              className="h-10 px-3 border border-gray-200 rounded-lg text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>

          {/* Currency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
              Moneda
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CURRENCIES.map(({ value, label, symbol }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCurrency(value)}
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    currency === value
                      ? 'border-[#F97316] bg-orange-50 text-[#F97316]'
                      : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
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
              className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 bg-[#F97316] rounded-lg text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Creando...' : 'Crear distribuidor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
