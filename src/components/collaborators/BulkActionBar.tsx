import { HandCoins } from "lucide-react";
import { formatCurrency } from "@/utils/format.utils";

interface BulkActionBarProps {
  count: number;
  total: number;
  onClear: () => void;
  onPay: () => void;
}

/**
 * Barra de acciones en lote. Aparece al marcar filas y evita el recorrido de
 * abrir el mismo modal una vez por persona, que es lo que vuelve tediosa la
 * página cuando hay varios pagos pendientes.
 */
export function BulkActionBar({ count, total, onClear, onPay }: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <div
        role="status"
        className="pointer-events-auto flex w-full max-w-[640px] flex-wrap items-center gap-3.5 rounded-[22px] bg-[#1C1D22] py-3 pl-[18px] pr-3.5 shadow-[0_14px_36px_-8px_rgba(16,17,20,0.4)]"
      >
        <span className="rounded-xl bg-[#FF5C00] px-2.5 py-1 font-mono text-[11px] font-semibold text-white">
          {count}
        </span>

        <span className="flex min-w-[150px] flex-1 flex-col gap-0.5">
          <span className="text-[12.5px] font-semibold text-white">
            {count === 1 ? "1 colaborador seleccionado" : `${count} colaboradores seleccionados`}
          </span>
          <span className="text-[10.5px] text-[#A6AAB2]">Todos pueden recibir pagos</span>
        </span>

        <span className="font-mono text-[16px] font-semibold text-white">
          {formatCurrency(total)}
        </span>

        <button
          onClick={onClear}
          className="rounded-2xl bg-white/10 px-3.5 py-2.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-white/20"
        >
          Quitar
        </button>

        <button
          onClick={onPay}
          className="flex items-center gap-1.5 rounded-2xl bg-[#FF5C00] px-3.5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          <HandCoins className="h-3.5 w-3.5" />
          {count === 1 ? "Pagar" : `Pagar a ${count}`}
        </button>
      </div>
    </div>
  );
}
