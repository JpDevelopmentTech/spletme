import { formatCurrency } from "@/utils/format.utils";

export interface ShareSlice {
  id: string;
  name: string;
  amount: number;
  color: string;
}

interface RevenueShareBarProps {
  slices: ShareSlice[];
  className?: string;
}

/**
 * Reparto de ingresos entre distribuidores en una sola barra apilada.
 *
 * Sustituye al gráfico de barras horizontales, que crecía en alto con cada
 * distribuidor y respondía peor a la única pregunta que importa aquí: quién pesa
 * cuánto sobre el total.
 */
export function RevenueShareBar({ slices, className = "" }: RevenueShareBarProps) {
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);

  if (total <= 0) {
    return (
      <div
        className={`flex flex-col gap-[18px] rounded-[26px] border border-[#E8E8EC] bg-white p-6 shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] ${className}`}
      >
        <Header />
        <p className="text-[12.5px] text-[#71757E]">
          Todavía no hay ingresos registrados en ningún distribuidor.
        </p>
      </div>
    );
  }

  const withShare = slices
    .map((slice) => ({ ...slice, share: (slice.amount / total) * 100 }))
    .sort((a, b) => b.share - a.share);

  return (
    <div
      className={`flex flex-col gap-[18px] rounded-[26px] border border-[#E8E8EC] bg-white p-6 shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] ${className}`}
    >
      <Header />

      <div className="flex h-4 gap-[2px] overflow-hidden rounded-lg">
        {withShare.map((slice) => (
          <span
            key={slice.id}
            title={`${slice.name}: ${formatCurrency(slice.amount)} (${slice.share.toFixed(1)}%)`}
            style={{ backgroundColor: slice.color, width: `${slice.share}%` }}
            className="h-full min-w-[3px]"
          />
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {withShare.map((slice) => (
          <li key={slice.id} className="flex min-w-0 items-center gap-2.5">
            <span
              className="h-[9px] w-[9px] flex-shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-[12px] font-semibold text-[#1C1D22]">
                {slice.name}
              </span>
              <span className="font-mono text-[10.5px] text-[#71757E]">
                {formatCurrency(slice.amount)} · {slice.share.toFixed(1)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-0.5">
      <h2 className="font-display text-[15px] font-semibold text-[#1C1D22]">
        Reparto de ingresos
      </h2>
      <p className="text-[11.5px] text-[#71757E]">
        Participación de cada distribuidor en el neto acumulado
      </p>
    </div>
  );
}
