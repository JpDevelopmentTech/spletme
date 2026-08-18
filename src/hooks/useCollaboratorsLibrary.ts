import { useCallback, useEffect, useMemo, useState } from "react";
import CollaboratorService from "@/services/collaborator";
import PaymentsService from "@/services/payments";
import { flattenRoyaltyPayments, type RecentPayment } from "@/utils/payments.utils";
import {
  collaboratorColor,
  initialsOf,
  resolveCollaboratorState,
} from "@/utils/collaborators.utils";
import type { Collaborator } from "@/types";
import type { CollaboratorSortBy } from "@/components/collaborators/collaboratorsColumns";

/* ── Contrato del API ──────────────────────────────────────────────────────── */

interface ApiCollaborator {
  userId: string;
  id: string;
  name: string;
  email: string;
  roles: string[];
  songCount: number;
  songPresencePercentage: number;
  activeSplits: number;
  amountOwed: number;
  totalPaid: number;
  amountPending: number;
  paymentStatus: string;
  isActive: boolean;
  hasWallet: boolean;
  hasActiveStripeAccount: boolean;
}

interface ApiSummary {
  totalCollaborators: number;
  totalLabels: number;
  byRole: { collaborator: number; label: number };
  activeSplits: number;
  totalAmountSent: number;
  totalPending: number;
  totalAmountReceived: number;
}

export type StateFilter = "all" | "can_pay" | "no_payout_data" | "settled";

const resolveStatus = (raw: ApiCollaborator): Collaborator["status"] => {
  if (!raw.hasWallet) return "no_wallet";
  if (raw.paymentStatus === "pending") return "pending";
  return "active";
};

const adapt = (raw: ApiCollaborator, index: number): Collaborator => ({
  id: raw.userId,
  externalId: raw.id,
  name: raw.name,
  email: raw.email,
  initials: initialsOf(raw.name),
  // El color de identidad se deriva del orden, y es el mismo en la tabla, el
  // perfil y la lista de pagos.
  avatarBg: collaboratorColor(index),
  avatarText: "#FFFFFF",
  songs: raw.songCount,
  songPresencePercentage: raw.songPresencePercentage ?? 0,
  paid: raw.totalPaid,
  amountOwed: raw.amountOwed ?? 0,
  amountPending: raw.amountPending ?? 0,
  status: resolveStatus(raw),
  roles: raw.roles ?? [],
});

/**
 * Estado de la página de colaboradores: datos, filtros y selección múltiple.
 *
 * Los colaboradores y el resumen salen de `/collaborators/metrics`; los pagos
 * recientes, del historial real de cobros de regalías —antes eran cuatro
 * registros inventados en el propio componente—.
 */
export function useCollaboratorsLibrary() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [summary, setSummary] = useState<ApiSummary | null>(null);
  const [payments, setPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<CollaboratorSortBy>("pending_desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CollaboratorService.getMetrics();
      const payload = response?.data as
        | { summary: ApiSummary; collaborators: ApiCollaborator[] }
        | undefined;

      if (!payload) {
        setError("No se pudieron cargar los colaboradores. Vuelve a intentarlo.");
        setCollaborators([]);
        setSummary(null);
        return;
      }

      setSummary(payload.summary);
      setCollaborators(payload.collaborators.map(adapt));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const response = await PaymentsService.getRoyaltyPayments();
      setPayments(response.error ? [] : flattenRoyaltyPayments(response.data ?? []));
    } catch {
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadPayments();
  }, [load, loadPayments]);

  const refresh = useCallback(async () => {
    // Un pago cambia tanto los saldos como el historial.
    await Promise.all([load(), loadPayments()]);
    setSelectedIds(new Set());
  }, [load, loadPayments]);

  /** Quienes tienen saldo pendiente y pueden recibirlo ya. */
  const payable = useMemo(
    () => collaborators.filter((c) => resolveCollaboratorState(c) === "can_pay"),
    [collaborators],
  );

  /** Quienes tienen saldo pendiente pero no pueden cobrarlo todavía. */
  const blocked = useMemo(
    () =>
      collaborators.filter(
        (c) => resolveCollaboratorState(c) === "no_payout_data" && c.amountPending > 0,
      ),
    [collaborators],
  );

  const roles = useMemo(() => {
    const names = new Set<string>();
    for (const c of collaborators) for (const role of c.roles ?? []) names.add(role);
    return [...names].sort((a, b) => a.localeCompare(b, "es"));
  }, [collaborators]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = collaborators.filter((c) => {
      if (query && !`${c.name} ${c.email}`.toLowerCase().includes(query)) return false;
      if (roleFilter !== "all" && !(c.roles ?? []).includes(roleFilter)) return false;
      if (stateFilter === "all") return true;

      const state = resolveCollaboratorState(c);
      if (stateFilter === "settled") return state === "settled" || state === "no_activity";
      return state === stateFilter;
    });

    return [...filtered].sort(comparators[sortBy]);
  }, [collaborators, search, roleFilter, stateFilter, sortBy]);

  /** Solo se pueden seleccionar quienes pueden cobrar: el resto no es pagable. */
  const selected = useMemo(
    () => payable.filter((c) => selectedIds.has(c.id)),
    [payable, selectedIds],
  );

  const selectedTotal = useMemo(
    () => selected.reduce((sum, c) => sum + c.amountPending, 0),
    [selected],
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const visiblePayable = visible.filter((c) => resolveCollaboratorState(c) === "can_pay");
      const allSelected =
        visiblePayable.length > 0 && visiblePayable.every((c) => prev.has(c.id));
      return allSelected ? new Set() : new Set(visiblePayable.map((c) => c.id));
    });
  }, [visible]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const totals = useMemo(() => {
    const totalPaid = collaborators.reduce((sum, c) => sum + c.paid, 0);
    const totalPending = collaborators.reduce((sum, c) => sum + c.amountPending, 0);
    return {
      totalPaid,
      totalPending,
      // El resumen del API es la fuente para lo que él calcula; el resto se
      // deriva de la lista para que cuadre siempre con lo que se ve en la tabla.
      activeSplits: summary?.activeSplits ?? 0,
      people: summary?.byRole?.collaborator ?? collaborators.length,
      labels: summary?.byRole?.label ?? 0,
      totalCollaborators: summary?.totalCollaborators ?? collaborators.length,
    };
  }, [collaborators, summary]);

  /** Canciones distintas con split, para leer la presencia como fracción. */
  const catalogSize = useMemo(
    () => collaborators.reduce((max, c) => Math.max(max, c.songs), 0),
    [collaborators],
  );

  const hasFilters = stateFilter !== "all" || roleFilter !== "all";

  const clearFilters = useCallback(() => {
    setStateFilter("all");
    setRoleFilter("all");
  }, []);

  return {
    loading,
    paymentsLoading,
    error,
    refresh,
    reload: load,
    collaborators,
    visible,
    payable,
    blocked,
    payments,
    roles,
    totals,
    catalogSize,
    search,
    setSearch,
    stateFilter,
    setStateFilter,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    hasFilters,
    clearFilters,
    selected,
    selectedIds,
    selectedTotal,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  };
}

type Comparator = (a: Collaborator, b: Collaborator) => number;

const comparators: Record<CollaboratorSortBy, Comparator> = {
  pending_desc: (a, b) => b.amountPending - a.amountPending || b.paid - a.paid,
  paid_desc: (a, b) => b.paid - a.paid,
  songs_desc: (a, b) => b.songs - a.songs,
  name_asc: (a, b) => a.name.localeCompare(b.name, "es"),
};
