import { Crown, Music, TrendingUp, Star } from 'lucide-react';
import type { SplitOwnerInfo } from '../../../../types/analytics.types';

interface Props {
  data: SplitOwnerInfo | null;
  loading: boolean;
}

export default function SplitOwnerModule({ data, loading }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-yellow-50 rounded-md flex items-center justify-center">
          <Crown className="w-4 h-4 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Split Owner</h2>
          <p className="text-xs text-[#6B7280]">Resumen de tu catálogo como owner</p>
        </div>
      </div>

      {loading ? (
        <div className="h-[100px] flex items-center justify-center text-sm text-[#9CA3AF]">
          Cargando...
        </div>
      ) : !data ? (
        <div className="h-[100px] flex items-center justify-center text-sm text-[#9CA3AF]">
          Sin datos disponibles
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Music className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] text-[#6B7280]">Canciones</p>
              <p className="text-[18px] font-bold text-[#111827] leading-tight">{data.songCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-[11px] text-[#6B7280]">Ingreso Total</p>
              <p className="text-[18px] font-bold text-green-500 leading-tight">
                {data.totalNetIncome >= 1_000
                  ? `$${(data.totalNetIncome / 1_000).toFixed(1)}K`
                  : `$${data.totalNetIncome.toFixed(2)}`}
              </p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 p-3 bg-[#FAFAFA] rounded-lg">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-[#F97316]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-[#6B7280]">Top Canción</p>
              {data.topSong ? (
                <>
                  <p className="text-[13px] font-semibold text-[#111827] truncate">
                    {data.topSong.trackTitle}
                  </p>
                  <p className="text-[11px] text-green-500 font-medium">
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
