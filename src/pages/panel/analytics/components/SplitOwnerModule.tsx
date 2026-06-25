import { Crown, Music, TrendingUp, Star } from "lucide-react";
import type { SplitOwnerInfo } from "../../../../types/analytics.types";

interface Props {
  data: SplitOwnerInfo | null;
  loading: boolean;
}

export default function SplitOwnerModule({ data, loading }: Props) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-yellow-50">
          <Crown className="h-4 w-4 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Split Owner</h2>
          <p className="text-xs text-[#6B7280]">
            Resumen de tu catálogo como owner
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[100px] items-center justify-center text-sm text-[#9CA3AF]">
          Cargando...
        </div>
      ) : !data ? (
        <div className="flex h-[100px] items-center justify-center text-sm text-[#9CA3AF]">
          Sin datos disponibles
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-lg bg-[#FAFAFA] p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Music className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] text-[#6B7280]">Canciones</p>
              <p className="text-[18px] font-bold leading-tight text-[#111827]">
                {data.songCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-[#FAFAFA] p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-[11px] text-[#6B7280]">Ingreso Total</p>
              <p className="text-[18px] font-bold leading-tight text-green-500">
                {data.totalNetIncome >= 1_000
                  ? `$${(data.totalNetIncome / 1_000).toFixed(1)}K`
                  : `$${data.totalNetIncome.toFixed(2)}`}
              </p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 rounded-lg bg-[#FAFAFA] p-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <Star className="h-4 w-4 text-[#F97316]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-[#6B7280]">Top Canción</p>
              {data.topSong ? (
                <>
                  <p className="truncate text-[13px] font-semibold text-[#111827]">
                    {data.topSong.trackTitle}
                  </p>
                  <p className="text-[11px] font-medium text-green-500">
                    ${data.topSong.netIncome.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-[13px] text-[#9CA3AF]">—</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
