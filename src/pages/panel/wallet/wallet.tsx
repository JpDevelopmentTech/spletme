import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import PaymentsService from "@/services/payments";
import type { RoyaltyPayment, RoyaltyBreakdownItem } from "@/services/payments";
import BankAccountSection from "@/components/bank-account/BankAccountSection";
import PayoutAccountSection from "@/components/bank-account/PayoutAccountSection";

const STATUS_CONFIG: Record<
  RoyaltyPayment["status"],
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  succeeded: {
    label: "Completado",
    color: "#16A34A",
    bg: "#ECFDF5",
    icon: CheckCircle2,
  },
  processing: {
    label: "En proceso",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    icon: Clock,
  },
  pending: { label: "Pendiente", color: "#D97706", bg: "#FFFBEB", icon: Clock },
  failed: {
    label: "Fallido",
    color: "#DC2626",
    bg: "#FFF1F2",
    icon: AlertCircle,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Devuelve el título de la canción del pago (songId puede venir poblado o como id). */
function getSongTitle(songId: RoyaltyPayment["songId"]) {
  if (songId && typeof songId === "object") return songId.trackTitle || "—";
  return "—";
}

/** Devuelve el nombre del colaborador destinatario (poblado o id). */
function getCollaboratorName(collaboratorId: RoyaltyBreakdownItem["collaboratorId"]) {
  if (collaboratorId && typeof collaboratorId === "object")
    return collaboratorId.name || collaboratorId.username || collaboratorId.email || "Colaborador";
  return "Colaborador";
}

const PAGE_SIZE = 10;

export default function WalletPage() {
  const [payments, setPayments] = useState<RoyaltyPayment[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    PaymentsService.getRoyaltyPayments().then((res) => {
      if (!res.error && res.data) setPayments(res.data);
      setLoadingTx(false);
    });
  }, []);

  const filtered = payments.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const title = getSongTitle(p.songId).toLowerCase();
    const matchesSearch =
      !search ||
      title.includes(search.toLowerCase()) ||
      (p.stripePaymentIntentId ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#F7F8FA] p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">Banco</h1>
          <p className="text-sm text-gray-500">
            Tus cuentas bancarias y el historial de pagos
          </p>
        </div>
      </div>

      {/* Cuenta bancaria del Owner (ACH) — para PAGAR regalías */}
      <BankAccountSection />

      {/* Cuenta de recepción (Wise) — para RECIBIR dinero (cualquier usuario) */}
      <PayoutAccountSection />

      {/* Transaction Table */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="text-[15px] font-bold text-gray-900">Transaction History</span>
          <div className="flex items-center gap-2">
            <div className="flex w-48 items-center gap-2 rounded-lg border border-gray-200 bg-[#F7F8FA] px-3 py-2">
              <Search className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar canción o ID..."
                className="w-full bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="cursor-pointer rounded-lg border border-gray-200 bg-[#F7F8FA] px-3 py-2 text-xs text-gray-700 outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="processing">En proceso</option>
              <option value="succeeded">Completado</option>
              <option value="pending">Pendiente</option>
              <option value="failed">Fallido</option>
            </select>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[120px_1fr_220px_140px_120px] gap-0 border-b border-gray-100 bg-[#F7F8FA] px-5 py-2.5">
          {["Fecha", "Canción", "ID de cobro", "Estado", "Monto"].map((h) => (
            <span key={h} className="text-xs font-semibold text-gray-500">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {loadingTx ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando pagos...</span>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            No hay pagos registrados.
          </div>
        ) : (
          paginated.map((p, idx) => {
            const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const ref = p.stripePaymentIntentId || p._id;
            const isOpen = expandedId === p._id;
            const recipients = p.breakdown ?? [];
            return (
              <div
                key={p._id}
                className={idx < paginated.length - 1 ? "border-b border-gray-50" : ""}
              >
                <div
                  onClick={() => setExpandedId(isOpen ? null : p._id)}
                  className="grid cursor-pointer grid-cols-[120px_1fr_220px_140px_120px] items-center gap-0 px-5 py-3.5 transition-colors hover:bg-gray-50"
                >
                  <span className="text-xs text-gray-500">{formatDate(p.createdAt)}</span>
                  <span className="truncate pr-4 text-xs font-medium text-gray-700">
                    {getSongTitle(p.songId)}
                  </span>
                  <span className="truncate pr-4 text-xs text-gray-500" title={ref}>
                    {ref}
                  </span>
                  <div className="flex items-center">
                    <span
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      <Icon className="h-2.5 w-2.5" />
                      {cfg.label}
                    </span>
                  </div>
                  <span className="flex items-center justify-between gap-1 text-xs font-bold text-gray-900">
                    <span>
                      $
                      {p.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {(p.currency || "usd").toUpperCase()}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </span>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-[#FAFAFA] px-5 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Repartido a
                    </span>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {recipients.length > 0 ? (
                        recipients.map((b, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-700">
                              {getCollaboratorName(b.collaboratorId)}
                            </span>
                            <span className="text-gray-500">
                              {b.percentage}% · $
                              {b.amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Sin desglose disponible.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination */}
        {!loadingTx && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
            <span className="text-xs text-gray-400">
              Mostrando {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
              {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-gray-200 bg-[#F7F8FA] p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center gap-1.5">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-1 text-xs text-gray-400">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`h-7 min-w-[28px] rounded-md text-xs font-semibold transition-colors ${
                        p === page
                          ? "bg-orange-500 text-white"
                          : "border border-gray-200 bg-[#F7F8FA] text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-gray-200 bg-[#F7F8FA] p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
