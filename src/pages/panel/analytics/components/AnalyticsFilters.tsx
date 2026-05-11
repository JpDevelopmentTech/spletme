import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import type { AnalyticsFilters, FilterOptions } from '../../../../types/analytics.types';
import { analyticsService } from '../../../../services/analyticsService';

interface Props {
  filters: AnalyticsFilters;
  onChange: (filters: AnalyticsFilters) => void;
}

export default function AnalyticsFiltersBar({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<FilterOptions>({
    platforms: [],
    countries: [],
    artists: [],
    labels: [],
  });

  useEffect(() => {
    analyticsService.getFilterOptions().then(setOptions).catch(() => {});
  }, []);

  function update(key: keyof AnalyticsFilters, value: string) {
    onChange({ ...filters, [key]: value || undefined });
  }

  function clearAll() {
    onChange({});
  }

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      {/* Toggle bar */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-[#111827]"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#F97316]" />
          <span>Filtros</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-orange-100 text-[#F97316] text-[11px] font-bold rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            {/* Platform */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Plataforma
              </label>
              <select
                value={filters.platform ?? ''}
                onChange={(e) => update('platform', e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg text-[13px] text-[#111827] focus:outline-none focus:border-[#F97316] bg-white"
              >
                <option value="">Todas</option>
                {options.platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                País
              </label>
              <select
                value={filters.country ?? ''}
                onChange={(e) => update('country', e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg text-[13px] text-[#111827] focus:outline-none focus:border-[#F97316] bg-white"
              >
                <option value="">Todos</option>
                {options.countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Start date */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Fecha inicio
              </label>
              <input
                type="month"
                value={filters.startDate ?? ''}
                onChange={(e) => update('startDate', e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg text-[13px] text-[#111827] focus:outline-none focus:border-[#F97316]"
              />
            </div>

            {/* End date */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Fecha fin
              </label>
              <input
                type="month"
                value={filters.endDate ?? ''}
                onChange={(e) => update('endDate', e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg text-[13px] text-[#111827] focus:outline-none focus:border-[#F97316]"
              />
            </div>

            {/* Artist */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Artista
              </label>
              <select
                value={filters.artistName ?? ''}
                onChange={(e) => update('artistName', e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg text-[13px] text-[#111827] focus:outline-none focus:border-[#F97316] bg-white"
              >
                <option value="">Todos</option>
                {options.artists.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Label */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Sello
              </label>
              <select
                value={filters.labelName ?? ''}
                onChange={(e) => update('labelName', e.target.value)}
                className="h-9 px-3 border border-gray-200 rounded-lg text-[13px] text-[#111827] focus:outline-none focus:border-[#F97316] bg-white"
              >
                <option value="">Todos</option>
                {options.labels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Period toggle + Clear */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => update('period', 'month')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  (filters.period ?? 'month') === 'month'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Por Mes
              </button>
              <button
                onClick={() => update('period', 'year')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filters.period === 'year'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Por Año
              </button>
            </div>

            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
