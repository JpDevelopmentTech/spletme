import type { PlatformCountryRow } from '../../../../types/analytics.types';

interface Props {
  data: PlatformCountryRow[];
  loading: boolean;
}

export default function PlatformCountrySummary({ data, loading }: Props) {
  const maxIncome = data.length > 0 ? Math.max(...data.map((r) => r.netIncome)) : 1;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-[#111827]">TOP 10 — Plataforma × País</h2>
        <p className="text-xs text-[#6B7280] mt-0.5">Ingresos y streams por combinación plataforma/país</p>
      </div>

      {loading ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-[#9CA3AF]">
          Cargando...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-[#9CA3AF]">
          Sin datos disponibles
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-[#9CA3AF] w-5 flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-[#111827] truncate">
                    {row.platform}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-[#6B7280] rounded font-medium">
                    {row.country}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#F97316] transition-all duration-500"
                    style={{ width: `${(row.netIncome / maxIncome) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="text-[12px] font-bold text-green-500">
                  ${row.netIncome >= 1000 ? `${(row.netIncome / 1000).toFixed(1)}K` : row.netIncome.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#9CA3AF]">
                  {row.streams >= 1_000 ? `${(row.streams / 1_000).toFixed(0)}K` : row.streams} streams
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
