import {
  Search,
  Receipt,
  SearchX,
  Users,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
  RotateCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRoyaltyPayments } from "@/hooks/useRoyaltyPayments";
import { pageWindow } from "@/utils/pagination.utils";
import { FilterFacet } from "@/components/ui/FilterFacet";
import BankAccountSection from "@/components/bank-account/BankAccountSection";
import PayoutAccountSection from "@/components/bank-account/PayoutAccountSection";
import { PaymentsKpis } from "@/components/wallet/PaymentsKpis";
import { PaymentRow } from "@/components/wallet/PaymentRow";
import {
  DATE_COLUMN_VISIBILITY,
  PAYMENTS_GRID,
  PAYMENT_COLUMNS,
  STATUS_FILTER_LABELS,
} from "@/components/wallet/paymentsColumns";
import type { PaymentStatusFilter } from "@/hooks/useRoyaltyPayments";

export default function WalletPage() {
  const {
    payments,
    loading,
    error,
    reload,
    totals,
    filtered,
    visible,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    hasFilters,
    clearFilters,
    page,
    setPage,
    totalPages,
    pageSize,
    expandedId,
    toggleExpanded,
  } = useRoyaltyPayments();

  const isEmpty = !loading && payments.length === 0;

  return (
    <div className="min-h-full bg-[#F7F7F9]">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display text-2xl font-semibold text-[#1C1D22]">Banco</h1>
          <p className="flex flex-wrap items-center gap-2 text-[13px] text-[#71757E]">
            <span>Por dónde entra y sale tu dinero</span>
            {payments.length > 0 && (
              <>
                <span className="text-[#A6AAB2]">·</span>
                <span>
                  {payments.length} {payments.length === 1 ? "movimiento" : "movimientos"}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Consola de métricas: solo cuando hay algo que resumir. */}
        {!loading && payments.length > 0 && (
          <PaymentsKpis
            paid={totals.paid}
            paidCount={totals.paidCount}
            processing={totals.processing}
            processingCount={totals.processingCount}
            pending={totals.pending}
            pendingCount={totals.pendingCount}
            failed={totals.failed}
            recipients={totals.recipients}
            onShowFailed={totals.failed > 0 ? () => setStatusFilter("failed") : undefined}
          />
        )}

        {/* Las dos cuentas, separadas por la dirección del dinero */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <BankAccountSection />
          <PayoutAccountSection />
        </div>

        {/* Historial de pagos */}
        <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
          <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5">
            <Receipt className="h-[14px] w-[14px] flex-shrink-0 text-[#71757E]" />
            <span className="font-mono text-[9.5px] font-semibold tracking-[1.2px] text-[#1C1D22]">
              HISTORIAL DE PAGOS
            </span>
            {payments.length > 0 && (
              <span className="rounded-[10px] bg-[#F4F5F7] px-1.5 py-px font-mono text-[10px] font-semibold text-[#71757E]">
                {payments.length}
              </span>
            )}

            <div className="ml-auto flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-[250px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6AAB2]"
                  size={15}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar canción o referencia…"
                  className="w-full rounded-[18px] border border-[#E8E8EC] bg-white py-2 pl-11 pr-4 text-[12px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
                />
              </div>

              <FilterFacet
                label="Estado"
                value={STATUS_FILTER_LABELS[statusFilter]}
                highlighted={statusFilter !== "all"}
              >
                <select
                  aria-label="Filtrar por estado del pago"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PaymentStatusFilter)}
                >
                  {Object.entries(STATUS_FILTER_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </FilterFacet>
            </div>
          </div>

          <div className="h-px bg-[#E8E8EC]" />

          {error ? (
            <ErrorState onRetry={reload} message={error} />
          ) : loading ? (
            <HistorySkeleton />
          ) : isEmpty ? (
            <EmptyHistory />
          ) : filtered.length === 0 ? (
            <NoResults search={search} hasFilters={hasFilters} onClear={clearFilters} />
          ) : (
            <>
              <TableHeader />
              <div className="h-px bg-[#E8E8EC]" />
              <div className="flex flex-col divide-y divide-[#E8E8EC]">
                {visible.map((payment) => (
                  <PaymentRow
                    key={payment._id}
                    payment={payment}
                    expanded={expandedId === payment._id}
                    onToggle={() => toggleExpanded(payment._id)}
                  />
                ))}
              </div>
              <div className="h-px bg-[#E8E8EC]" />
              <Pagination
                page={page}
                totalPages={totalPages}
                total={filtered.length}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Cabecera de la tabla. Sin orden: el historial va siempre del más reciente. */
function TableHeader() {
  return (
    <div className={`${PAYMENTS_GRID} px-5 py-3`}>
      <div className={DATE_COLUMN_VISIBILITY}>
        <ColumnLabel>FECHA</ColumnLabel>
      </div>
      <div className="flex min-w-0">
        <ColumnLabel>CANCIÓN</ColumnLabel>
      </div>
      {PAYMENT_COLUMNS.map((column) => (
        <div key={column.key} className={column.visibility}>
          <ColumnLabel>{column.label}</ColumnLabel>
        </div>
      ))}
      <div />
    </div>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
      {children}
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center gap-2.5 px-5 py-3">
      <span className="text-[12px] text-[#71757E]">
        Mostrando {from}–{to} de {total} {total === 1 ? "pago" : "pagos"}
      </span>

      {totalPages > 1 && (
        <div className="ml-auto flex items-center gap-1.5">
          <NavButton
            label="Página anterior"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-[15px] w-[15px]" />
          </NavButton>

          {pageWindow(page, totalPages).map((candidate, index) =>
            candidate === null ? (
              <span key={`gap-${index}`} className="px-0.5 text-[12px] text-[#A6AAB2]">
                …
              </span>
            ) : (
              <button
                key={candidate}
                onClick={() => onPageChange(candidate)}
                aria-current={candidate === page ? "page" : undefined}
                className={`h-[30px] min-w-[30px] rounded-full px-2 font-mono text-[11.5px] font-semibold transition-colors ${
                  candidate === page
                    ? "bg-[#FF5C00] text-white"
                    : "border border-[#E8E8EC] bg-white text-[#71757E] hover:text-[#1C1D22]"
                }`}
              >
                {candidate}
              </button>
            ),
          )}

          <NavButton
            label="Página siguiente"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-[15px] w-[15px]" />
          </NavButton>
        </div>
      )}
    </div>
  );
}

function NavButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#E8E8EC] bg-white text-[#71757E] transition-colors enabled:hover:text-[#1C1D22] disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/** Esqueleto con las mismas columnas, para que nada salte al llegar los datos. */
function HistorySkeleton() {
  const widths = ["w-[148px]", "w-[112px]", "w-[168px]", "w-[130px]"];
  return (
    <>
      <TableHeader />
      <div className="h-px bg-[#E8E8EC]" />
      <div className="flex flex-col divide-y divide-[#E8E8EC]">
        {widths.map((width, index) => (
          <div
            key={width}
            className={`${PAYMENTS_GRID} px-5 py-3.5`}
            style={{ opacity: 1 - index * 0.18 }}
          >
            <div className={DATE_COLUMN_VISIBILITY}>
              <div className="h-2.5 w-[70px] animate-pulse rounded-full bg-[#F4F5F7]" />
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-[34px] w-[34px] flex-shrink-0 animate-pulse rounded-[11px] bg-[#F4F5F7]" />
              <div className="flex flex-1 flex-col gap-2">
                <div className={`h-2.5 animate-pulse rounded-full bg-[#F4F5F7] ${width}`} />
                <div className="h-2 w-[84px] animate-pulse rounded-full bg-[#F4F5F7]/70" />
              </div>
            </div>
            {PAYMENT_COLUMNS.map((column) => (
              <div key={column.key} className={column.visibility}>
                <div className="h-2.5 w-[70%] animate-pulse rounded-full bg-[#F4F5F7]" />
              </div>
            ))}
            <div />
          </div>
        ))}
      </div>
    </>
  );
}

/** Historial vacío: explica de dónde saldrán los pagos, no solo que no hay. */
function EmptyHistory() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-[50px]">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
        <Receipt className="h-[22px] w-[22px] text-[#71757E]" />
      </span>
      <h3 className="font-display text-base font-semibold text-[#1C1D22]">
        Todavía no has pagado regalías
      </h3>
      <p className="max-w-[440px] text-center text-[12.5px] leading-relaxed text-[#71757E]">
        Cuando pagues a un colaborador desde una canción o un sello, el movimiento aparecerá aquí
        con su desglose.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
        <Link
          to="/panel/collaborators"
          className="flex items-center gap-2 rounded-2xl bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          <Users className="h-3.5 w-3.5" />
          Ir a Colaboradores
        </Link>
        <Link
          to="/panel/music"
          className="rounded-2xl border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
        >
          Ver mis canciones
        </Link>
      </div>
    </div>
  );
}

/** Sin resultados: dice qué está limitando la vista y ofrece deshacerlo. */
function NoResults({
  search,
  hasFilters,
  onClear,
}: {
  search: string;
  hasFilters: boolean;
  onClear: () => void;
}) {
  const term = search.trim();
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-[50px]">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
        <SearchX className="h-[22px] w-[22px] text-[#71757E]" />
      </span>
      <h3 className="text-center font-display text-base font-semibold text-[#1C1D22]">
        {term ? `Ningún pago coincide con «${term}»` : "Ningún pago coincide"}
      </h3>
      <p className="text-center text-[12.5px] text-[#71757E]">
        Revisa el término o quita el filtro de estado.
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-1 rounded-2xl bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          Limpiar búsqueda y filtro
        </button>
      )}
    </div>
  );
}

/**
 * Error de carga. Aclara que el dinero no se ha movido: en una pantalla de banco
 * esa es la primera duda cuando algo falla.
 */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 bg-[#FDECEC] px-6 py-[46px]">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-white">
        <TriangleAlert className="h-[22px] w-[22px] text-[#E5484D]" />
      </span>
      <h3 className="font-display text-base font-semibold text-[#1C1D22]">
        El historial no se pudo cargar
      </h3>
      <p className="max-w-[440px] text-center text-[12.5px] leading-relaxed text-[#71757E]">
        {message} Ningún pago se ha enviado dos veces: esto solo afecta a lo que ves.
      </p>
      <button
        onClick={onRetry}
        className="mt-1 flex items-center gap-2 rounded-2xl bg-[#1C1D22] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#101114]"
      >
        <RotateCw className="h-3.5 w-3.5" />
        Reintentar
      </button>
    </div>
  );
}
