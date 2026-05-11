import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import type { AnalyticsFilters, AnalyticsSong, PaginatedResult } from '../../../../types/analytics.types';
import { analyticsService } from '../../../../services/analyticsService';

interface Props {
  filters: AnalyticsFilters;
}

export default function SongsAnalyticsView({ filters }: Props) {
  const [result, setResult] = useState<PaginatedResult<AnalyticsSong> | null>(null);
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Music className="w-4 h-4 text-[#F97316]" />
          <span className="text-sm font-semibold text-[#111827]">Canciones en Analytics</span>
          {result && (
            <span className="px-2.5 py-0.5 bg-gray-100 text-[#6B7280] text-[11px] font-bold rounded-full">
              {result.total}
            </span>
          )}
        </div>
        {result && result.pages > 1 && (
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span>{page} / {result.pages}</span>
            <button
              disabled={page === result.pages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm text-[#9CA3AF]">
            Cargando canciones...
          </div>
        ) : !result || result.data.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-[#9CA3AF]">
            Sin canciones para los filtros seleccionados
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-gray-100">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Canción</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Artista</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Sello</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">ISRC</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Plataformas</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Streams</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((song, i) => (
                <tr key={song.songId ?? i} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium text-[#111827] max-w-[180px] truncate">
                    {song.trackTitle || '—'}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6B7280] max-w-[120px] truncate">
                    {song.artistName || '—'}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6B7280] max-w-[100px] truncate">
                    {song.artisticLabel || '—'}
                  </td>
                  <td className="px-4 py-3 text-[11px] font-mono text-[#9CA3AF]">
                    {song.isrc || '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[11px] font-bold rounded-full">
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
