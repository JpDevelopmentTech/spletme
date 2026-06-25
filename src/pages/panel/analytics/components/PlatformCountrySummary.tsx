import type { PlatformCountryRow } from "../../../../types/analytics.types";

interface Props {
  data: PlatformCountryRow[];
  loading: boolean;
}

export default function PlatformCountrySummary({ data, loading }: Props) {
  const maxIncome = data.length > 0 ? Math.max(...data.map((r) => r.netIncome)) : 1;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <div>
        <h2 className="text-sm font-semibold text-[#111827]">TOP 10 — Plataforma × País</h2>
        <p className="mt-0.5 text-xs text-[#6B7280]">
          Ingresos y streams por combinación plataforma/país
        </p>
      </div>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-[#9CA3AF]">
          Cargando...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-[#9CA3AF]">
          Sin datos disponibles
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-5 flex-shrink-0 text-[11px] font-bold text-[#9CA3AF]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="truncate text-[12px] font-semibold text-[#111827]">
                    {row.platform}
                  </span>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280]">
                    {row.country}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#F97316] transition-all duration-500"
                    style={{ width: `${(row.netIncome / maxIncome) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
                <span className="text-[12px] font-bold text-green-500">
                  $
                  {row.netIncome >= 1000
                    ? `${(row.netIncome / 1000).toFixed(1)}K`
                    : row.netIncome.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#9CA3AF]">
                  {row.streams >= 1_000 ? `${(row.streams / 1_000).toFixed(0)}K` : row.streams}{" "}
                  streams
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
