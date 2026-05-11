import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AnalyticsFilters, Transaction, PaginatedResult } from '../../../../types/analytics.types';
import { analyticsService } from '../../../../services/analyticsService';

interface Props {
  filters: AnalyticsFilters;
}

export default function TransactionsTable({ filters }: Props) {
  const [result, setResult] = useState<PaginatedResult<Transaction> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    analyticsService
      .getTransactions(filters, page, 20)
      .then(setResult)
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [filters, page]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-[#111827]">Transacciones</span>
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
            Cargando transacciones...
          </div>
        ) : !result || result.data.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-[#9CA3AF]">
            Sin transacciones para los filtros seleccionados
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-gray-100">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Canción</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Artista</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Plataforma</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">País</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Periodo</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Streams</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Ingreso Bruto</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Ingreso Neto</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((tx, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium text-[#111827] max-w-[160px] truncate">
                    {tx.trackTitle || '—'}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6B7280] max-w-[120px] truncate">
                    {tx.artistName || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-full">
                      {tx.platform || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6B7280]">{tx.country || '—'}</td>
                  <td className="px-4 py-3 text-[12px] text-[#6B7280]">
                    {tx.reportMonth?.slice(0, 7) || '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-[#6B7280]">
                    {(tx.quantity ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-[#9CA3AF]">
                    ${(tx.grossIncome ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] font-semibold text-green-500">
                    ${(tx.netIncome ?? 0).toFixed(2)}
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
