import { useCallback, useEffect, useMemo, useState } from "react";
import PaymentsService, {
  type RoyaltyPayment,
  type RoyaltyBreakdownItem,
} from "@/services/payments";

const PAGE_SIZE = 10;

export type PaymentStatusFilter = "all" | RoyaltyPayment["status"];

/** Título de la canción del pago; `songId` puede venir poblado o como id suelto. */
export function songTitle(songId: RoyaltyPayment["songId"]): string {
  if (songId && typeof songId === "object") return songId.trackTitle || "Canción sin título";
  return "Canción sin título";
}

/** Nombre del destinatario del reparto, con los alias que traiga poblados. */
export function collaboratorName(collaboratorId: RoyaltyBreakdownItem["collaboratorId"]): string {
  if (collaboratorId && typeof collaboratorId === "object") {
    return collaboratorId.name || collaboratorId.username || collaboratorId.email || "Colaborador";
  }
  return "Colaborador";
}

/**
 * Estado del historial de pagos: carga, búsqueda, filtro por estado, paginación
 * y los totales que resumen lo que se ha movido.
 *
 * Los totales salen de los pagos que la página ya descarga, así que no cuestan
 * ninguna petición extra: es el mismo dato de la tabla, sumado.
 */
export function useRoyaltyPayments() {
  const [payments, setPayments] = useState<RoyaltyPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await PaymentsService.getRoyaltyPayments();
      if (response.error || !response.data) {
        setError(response.message ?? "El historial no se pudo cargar.");
        setPayments([]);
        return;
      }
      setPayments(response.data);
    } catch {
      setError("No se pudo conectar con el servidor.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Lo que de verdad se ha movido. `failed` se cuenta aparte y en unidades, no
   * en dinero: un pago fallido no es un importe que esté en algún sitio, es una
   * tarea pendiente.
   */
  const totals = useMemo(() => {
    let paid = 0;
    let processing = 0;
    let pending = 0;
    let failed = 0;
    const recipients = new Set<string>();

    for (const payment of payments) {
      if (payment.status === "succeeded") {
        paid += payment.amount ?? 0;
        for (const item of payment.breakdown ?? []) {
          const id =
            item.collaboratorId && typeof item.collaboratorId === "object"
              ? item.collaboratorId._id
              : item.collaboratorId;
          if (id) recipients.add(String(id));
        }
      } else if (payment.status === "processing") processing += payment.amount ?? 0;
      else if (payment.status === "pending") pending += payment.amount ?? 0;
      else if (payment.status === "failed") failed += 1;
    }

    return {
      paid,
      paidCount: payments.filter((p) => p.status === "succeeded").length,
      processing,
      processingCount: payments.filter((p) => p.status === "processing").length,
      pending,
      pendingCount: payments.filter((p) => p.status === "pending").length,
      failed,
      recipients: recipients.size,
      currency: payments[0]?.currency?.toUpperCase() || "USD",
    };
  }, [payments]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      if (statusFilter !== "all" && payment.status !== statusFilter) return false;
      if (!query) return true;
      return (
        songTitle(payment.songId).toLowerCase().includes(query) ||
        (payment.stripePaymentIntentId ?? "").toLowerCase().includes(query)
      );
    });
  }, [payments, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  // Cualquier cambio del filtro deja la página en 1: mantener la 4 tras filtrar
  // suele dejar la tabla vacía sin explicar por qué.
  useEffect(() => {
    setPage(1);
    setExpandedId(null);
  }, [search, statusFilter]);

  const hasFilters = statusFilter !== "all" || search.trim() !== "";

  return {
    payments,
    loading,
    error,
    reload: load,
    totals,
    filtered,
    visible,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    hasFilters,
    clearFilters: () => {
      setSearch("");
      setStatusFilter("all");
    },
    page: currentPage,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    expandedId,
    toggleExpanded: (id: string) => setExpandedId((current) => (current === id ? null : id)),
  };
}
