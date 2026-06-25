import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Music } from "lucide-react";
import type {
  AnalyticsFilters,
  AnalyticsSong,
  PaginatedResult,
} from "../../../../types/analytics.types";
import { analyticsService } from "../../../../services/analyticsService";

interface Props {
  filters: AnalyticsFilters;
}

export default function SongsAnalyticsView({ filters }: Props) {
  const [result, setResult] = useState<PaginatedResult<AnalyticsSong> | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    analyticsService
      .getSongs(filters, page, 10)
      .then(setResult)
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [filters, page]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Music className="h-4 w-4 text-[#F97316]" />
          <span className="text-sm font-semibold text-[#111827]">
            Canciones en Analytics
          </span>
          {result && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-[#6B7280]">
              {result.total}
            </span>
          )}
        </div>
        {result && result.pages > 1 && (
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span>
              {page} / {result.pages}
            </span>
            <button
              disabled={page === result.pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-[#9CA3AF]">
            Cargando canciones...
          </div>
        ) : !result || result.data.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-[#9CA3AF]">
            Sin canciones para los filtros seleccionados
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Canción
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Artista
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Sello
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  ISRC
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Plataformas
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Streams
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((song, i) => (
                <tr
                  key={song.songId ?? i}
                  className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50"
                >
                  <td className="max-w-[180px] truncate px-4 py-3 text-[13px] font-medium text-[#111827]">
                    {song.trackTitle || "—"}
                  </td>
                  <td className="max-w-[120px] truncate px-4 py-3 text-[12px] text-[#6B7280]">
                    {song.artistName || "—"}
                  </td>
                  <td className="max-w-[100px] truncate px-4 py-3 text-[12px] text-[#6B7280]">
                    {song.artisticLabel || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#9CA3AF]">
                    {song.isrc || "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700">
                      {song.platformCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-[#6B7280]">
                    {(song.streams ?? 0) >= 1_000
                      ? `${((song.streams ?? 0) / 1_000).toFixed(0)}K`
                      : (song.streams ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] font-semibold text-green-500">
                    ${(song.netIncome ?? 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
