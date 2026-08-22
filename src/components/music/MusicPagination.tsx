import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface MusicPaginationProps {
  pageStart: number;
  pageEnd: number;
  total: number;
  page: number;
  limit: number;
  onLimitChange: (value: number) => void;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** Nombre de lo que se está paginando, en plural. */
  noun: string;
}

const PAGE_SIZES = [10, 20, 50, 100];

/** Rango mostrado, tamaño de página y paso entre páginas. */
export function MusicPagination({
  pageStart,
  pageEnd,
  total,
  page,
  limit,
  onLimitChange,
  canGoNext,
  onPrev,
  onNext,
  noun,
}: MusicPaginationProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <span className="text-[12px] text-[#71757E]">
        Mostrando {total === 0 ? 0 : pageStart + 1}–{Math.min(pageEnd, total)} de {total} {noun}
      </span>

      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2">
          <span className="hidden text-[12px] text-[#71757E] sm:inline">Por página</span>
          <div className="relative">
            <select
              aria-label={`${noun} por página`}
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="appearance-none rounded-full border border-[#E8E8EC] bg-white py-1.5 pl-3 pr-7 font-mono text-[11.5px] font-semibold text-[#1C1D22] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#71757E]" />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            aria-label="Página anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8E8EC] bg-white text-[#71757E] transition-colors enabled:hover:text-[#1C1D22] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[28px] text-center font-mono text-[12px] font-semibold text-[#1C1D22]">
            {page}
          </span>
          <button
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Página siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8E8EC] bg-white text-[#71757E] transition-colors enabled:hover:text-[#1C1D22] disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
