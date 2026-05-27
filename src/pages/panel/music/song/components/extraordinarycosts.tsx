import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import Button from "../../../../../components/atoms/button";
import { accountingApi } from "@/services/accounting";
import type { SongBalance } from "../../../../../services/accounting";
import type {
  Accounting,
  AccountingStatus,
  CreateAccountingDto,
} from "../../../../../types/accounting.types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ExtraordinaryCostsProps {
  songId: string;
}

type FormState = {
  concept: string;
  amount: string;
  date: string;
  description: string;
  status: AccountingStatus;
};

// ─── Constants ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<AccountingStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  cancelled: "Cancelado",
};

const STATUS_CLASSES: Record<AccountingStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300",
  cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300",
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Always returns a proper float.
 * Handles: number, string "1234.56", string "1,234.56", undefined, null.
 */
const toNum = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const cleaned = String(v).replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  return isFinite(parsed) ? parsed : 0;
};

const fmt = (v: unknown): string =>
  toNum(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtInput = (v: string) => {
  const s = v.replace(/,/g, "").replace(/[^\d.]/g, "");
  if (!s) return "";
  const [intRaw, decRaw = ""] = s.split(".");
  const intVal = intRaw.replace(/^0+(?=\d)/, "");
  const intFmt = intVal ? Number(intVal).toLocaleString("en-US") : "0";
  const dec = decRaw.slice(0, 2);
  return s.includes(".") ? `${intFmt}.${dec}` : intFmt;
};

const parseAmt = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;

const dateParts = (v?: string) => {
  if (!v) return { date: "—", time: "—" };
  const p = new Date(v);
  if (Number.isNaN(p.getTime())) return { date: "—", time: "—" };
  return {
    date: p.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: p.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const initialForm = (): FormState => ({
  concept: "Ingreso",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  status: "pending",
});

// ─── StatPill ───────────────────────────────────────────────────────────────────

const StatPill = ({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "green" | "orange" | "red" | "blue" | "default";
}) => {
  const valueClass = {
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-500 dark:text-orange-400",
    red: "text-red-600 dark:text-red-400",
    blue: "text-blue-600 dark:text-blue-400",
    default: "text-gray-900 dark:text-white",
  }[accent ?? "default"];

  return (
    <div className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3 flex flex-col gap-0.5">
      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-base font-bold leading-tight ${valueClass}`}>
        {value}
      </p>
      {sub && (
        <p className="text-[11px] text-yellow-600 dark:text-yellow-400">
          {sub}
        </p>
      )}
    </div>
  );
};

// ─── BalanceFace ────────────────────────────────────────────────────────────────

interface BalanceFaceProps {
  songId: string;
  costs: Accounting[];
  /** totalNetIncome from song model — added to ingresos */
  onFlip: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
  /** Bumped after every mutation so the balance re-fetches */
  balanceKey: number;
}

const BalanceFace = ({
  songId,
  costs,
  onFlip,
  expanded,
  onToggleExpand,
  balanceKey,
}: BalanceFaceProps) => {
  const [balance, setBalance] = useState<SongBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState(false);

  // ── Fetch authoritative balance from backend ──
  useEffect(() => {
    if (!songId) return;
    let active = true;
    setLoadingBalance(true);
    setBalanceError(false);

    accountingApi
      .getBalanceBySongId(songId)
      .then((data) => {
        if (active) setBalance(data);
      })
      .catch(() => {
        if (active) setBalanceError(true);
      })
      .finally(() => {
        if (active) setLoadingBalance(false);
      });

    return () => {
      active = false;
    };
  }, [songId, balanceKey]);

  // ── Local fallback while loading / on error ──
  const localIngresos = useMemo(
    () =>
      costs
        .filter((c) => c.concept === "Ingreso")
        .reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );
  const localEgresos = useMemo(
    () =>
      costs
        .filter((c) => c.concept !== "Ingreso")
        .reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );

  // Backend ingresos + song's own totalNetIncome
  const accountingIngresos = toNum(balance?.totalIngresos ?? localIngresos);
  const totalIngresos = accountingIngresos;
  const totalEgresos = toNum(balance?.totalEgresos ?? localEgresos);
  const netBalance = totalIngresos - totalEgresos;
  const isPositive = netBalance >= 0;

  // ── Pending amounts — always derived locally ──
  const pendingIngresos = useMemo(
    () =>
      costs
        .filter((c) => c.concept === "Ingreso" && c.status === "pending")
        .reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );
  const pendingEgresos = useMemo(
    () =>
      costs
        .filter((c) => c.concept !== "Ingreso" && c.status === "pending")
        .reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );

  const totalForBar = totalIngresos + totalEgresos;
  const ingPct = totalForBar > 0 ? (totalIngresos / totalForBar) * 100 : 50;

  return (
    <div className="p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            Balance
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {balance?.totalEntries ?? costs.length} mov.
          </span>
          {loadingBalance && (
            <RefreshCw className="h-3 w-3 text-gray-400 animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFlip}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Ver detalle
          </button>
          <Button onClick={onToggleExpand} type="primary">
            {expanded ? "Ver menos" : "Ver más"}
          </Button>
        </div>
      </div>

      {/* Error notice */}
      {balanceError && (
        <p className="shrink-0 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2">
          No se pudo actualizar el balance desde el servidor. Mostrando datos
          locales.
        </p>
      )}

      {/* Net balance */}
      <div
        className={`shrink-0 rounded-xl px-4 py-3 flex items-center justify-between ${
          isPositive
            ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40"
            : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40"
        }`}
      >
        <div>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Balance neto
          </p>
          <p
            className={`text-2xl font-bold leading-tight ${
              isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? "+" : "-"}${fmt(Math.abs(netBalance))}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isPositive
              ? "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300"
          }`}
        >
          {isPositive ? "Superávit" : "Déficit"}
        </span>
      </div>

      {/* Ingresos / Egresos grid */}
      <div className="shrink-0 grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowUpCircle className="h-3.5 w-3.5 text-green-500" />
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Ingresos
            </p>
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            ${fmt(totalIngresos)}
          </p>
          {/* {songNetIncome > 0 && (
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
              Incl. ${fmt(songNetIncome)} ganancia canción
            </p>
          )} */}
          {pendingIngresos > 0 && (
            <p className="text-[11px] text-yellow-600 dark:text-yellow-400 mt-0.5">
              ${fmt(pendingIngresos)} pendiente
            </p>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowDownCircle className="h-3.5 w-3.5 text-orange-500" />
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Egresos
            </p>
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">
            ${fmt(totalEgresos)}
          </p>
          {pendingEgresos > 0 && (
            <p className="text-[11px] text-yellow-600 dark:text-yellow-400 mt-0.5">
              ${fmt(pendingEgresos)} pendiente
            </p>
          )}
        </div>
      </div>

      {/* Only visible when expanded */}
      {expanded && (
        <>
          {/* Visual bar */}
          {totalForBar > 0 && (
            <div className="shrink-0">
              <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500 mb-1.5">
                <span>Ingresos {ingPct.toFixed(0)}%</span>
                <span>Egresos {(100 - ingPct).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-orange-200 dark:bg-orange-900/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${ingPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Paid / pending counts */}
          <div className="shrink-0 grid grid-cols-2 gap-3">
            <StatPill
              label="Pagados"
              value={`${costs.filter((c) => c.status === "paid").length} ítems`}
              accent="green"
            />
            <StatPill
              label="Pendientes"
              value={`${costs.filter((c) => c.status === "pending").length} ítems`}
              accent="orange"
            />
          </div>

          {/* Song net income breakdown */}
          {/* {songNetIncome > 0 && (
            <div className="shrink-0 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl px-4 py-3">
              <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-0.5">
                Ganancia propia de la canción
              </p>
              <p className="text-base font-bold text-blue-700 dark:text-blue-300">
                ${fmt(songNetIncome)}
              </p>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────

const ExtraordinaryCosts = ({ songId }: ExtraordinaryCostsProps) => {
  /* ── song data (for totalNetIncome) ── */

  /* ── state ── */
  const [isFlipped, setIsFlipped] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [suppressFlip, setSuppressFlip] = useState(false);
  const [costs, setCosts] = useState<Accounting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [balanceKey, setBalanceKey] = useState(0);
  const bumpBalance = useCallback(() => setBalanceKey((k) => k + 1), []);

  /* ── load costs ── */
  useEffect(() => {
    if (!songId) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await accountingApi.getBySongId(songId);
        if (active) {
          setCosts(Array.isArray(data) ? data : []);
          setSelectedIds([]);
        }
      } catch {
        if (active) setError("No se pudieron cargar los costos.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [songId]);

  /* ── derived ── */
  const pendingCosts = useMemo(
    () => costs.filter((i) => i.status === "pending"),
    [costs],
  );
  const selectedCosts = useMemo(
    () => pendingCosts.filter((i) => selectedIds.includes(i._id)),
    [pendingCosts, selectedIds],
  );
  const selectedTotal = useMemo(
    () => selectedCosts.reduce((t, i) => t + toNum(i.amount), 0),
    [selectedCosts],
  );
  // Mirror the exact same formula used in BalanceFace
  const tableIngresos = useMemo(
    () =>
      costs
        .filter((c) => c.concept === "Ingreso")
        .reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );
  const tableEgresos = useMemo(
    () =>
      costs
        .filter((c) => c.concept !== "Ingreso")
        .reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );
  const tableBalance = tableIngresos - tableEgresos;
  const tableBalancePositive = tableBalance >= 0;
  const allSelected =
    pendingCosts.length > 0 && selectedIds.length === pendingCosts.length;

  /* ── handlers ── */
  const toggleSelection = (id: string) => {
    const t = costs.find((i) => i._id === id);
    if (!t || t.status !== "pending") return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? [] : pendingCosts.map((i) => i._id));

  const resetForm = () => setForm(initialForm());

  const collapse = () => {
    setSuppressFlip(true);
    setIsFlipped(false);
    setExpanded(false);
    setTimeout(() => setSuppressFlip(false), 60);
  };

  const toggleExpand = () => (expanded ? collapse() : setExpanded(true));

  const handleCreate = async () => {
    if (!songId) {
      setError("No se encontró la canción.");
      return;
    }
    const concept = form.concept.trim();
    const amountValue = parseAmt(form.amount);
    if (!concept) {
      setError("El concepto es obligatorio.");
      return;
    }
    if (!isFinite(amountValue) || amountValue <= 0) {
      setError("El monto debe ser mayor a cero.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: CreateAccountingDto = {
        concept,
        amount: amountValue,
        songId,
        date: form.date ? new Date(form.date).toISOString() : undefined,
        description: form.description.trim() || undefined,
        status: form.status,
      };
      const created = await accountingApi.create(payload);
      setCosts((prev) => [created, ...prev]);
      bumpBalance();
      resetForm();
      setShowForm(false);
    } catch {
      setError("No se pudo crear el costo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await accountingApi.delete(id);
      setCosts((prev) => prev.filter((i) => i._id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      bumpBalance();
    } catch {
      setError("No se pudo eliminar el costo.");
    }
  };

  const handleMarkAsPaid = async () => {
    if (selectedCosts.length === 0) return;
    setMarkingPaid(true);
    setError(null);
    try {
      await Promise.all(
        selectedCosts.map((i) =>
          accountingApi.update(i._id, { status: "paid" }),
        ),
      );
      setCosts((prev) =>
        prev.map((i) =>
          selectedIds.includes(i._id) ? { ...i, status: "paid" } : i,
        ),
      );
      setSelectedIds([]);
      bumpBalance();
    } catch {
      setError("No se pudieron actualizar los costos seleccionados.");
    } finally {
      setMarkingPaid(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none";

  return (
    <>
      {/* ── Flip container ── */}
      <div
        className="col-span-12 md:col-span-2"
        style={{ perspective: "1200px" }}
      >
        <div
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            transition: suppressFlip
              ? "none"
              : "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ──────────── FRONT FACE ──────────── */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              position: isFlipped ? "absolute" : "relative",
              inset: 0,
              width: "100%",
              visibility: isFlipped ? "hidden" : "visible",
            }}
          >
            <div className="p-5 flex flex-col gap-4">
              {/* Header */}
              <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    Contabilidad
                  </span>
                  {costs.length > 0 && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {costs.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {expanded && (
                    <button
                      type="button"
                      onClick={() => setIsFlipped(true)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Balance
                    </button>
                  )}
                  <Button onClick={toggleExpand} type="primary">
                    {expanded ? "Ver menos" : "Ver más"}
                  </Button>
                </div>
              </div>

              {expanded && (
                <>
                  {/* Toolbar */}
                  <div className="flex items-center justify-between shrink-0">
                    <div className="grid grid-cols-4 gap-3 flex-1 mr-3">
                      {/* Ingresos — same value as BalanceFace */}
                      <div className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3">
                        <div className="flex items-center gap-1 mb-0.5">
                          <ArrowUpCircle className="h-3 w-3 text-green-500 shrink-0" />
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Ingresos
                          </p>
                        </div>
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                          ${fmt(tableIngresos)}
                        </p>
                      </div>
                      {/* Egresos — same value as BalanceFace */}
                      <div className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3">
                        <div className="flex items-center gap-1 mb-0.5">
                          <ArrowDownCircle className="h-3 w-3 text-orange-500 shrink-0" />
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Egresos
                          </p>
                        </div>
                        <p className="text-sm font-bold text-orange-500 dark:text-orange-400">
                          ${fmt(tableEgresos)}
                        </p>
                      </div>
                      {/* Balance neto — same value as BalanceFace */}
                      <div
                        className={`rounded-xl p-3 ${
                          tableBalancePositive
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "bg-red-50 dark:bg-red-900/20"
                        }`}
                      >
                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                          Balance
                        </p>
                        <p
                          className={`text-sm font-bold ${
                            tableBalancePositive
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {tableBalancePositive ? "+" : "-"}$
                          {fmt(Math.abs(tableBalance))}
                        </p>
                      </div>
                      {/* Selection total */}
                      <div className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3">
                        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                          Selección
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {selectedCosts.length > 0
                            ? `$${fmt(selectedTotal)}`
                            : `${selectedCosts.length} ítems`}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => setShowForm(true)} type="quinary">
                      <span className="flex items-center gap-1.5">
                        <Plus className="h-4 w-4" />
                        Nuevo
                      </span>
                    </Button>
                  </div>

                  {/* Mark-as-paid toolbar */}
                  {selectedCosts.length > 0 && (
                    <div className="shrink-0 flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 rounded-xl px-4 py-2.5">
                      <span className="text-sm text-primary-700 dark:text-primary-300">
                        {selectedCosts.length} ítem(s) seleccionado(s)
                      </span>
                      <Button onClick={handleMarkAsPaid} type="quinary">
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4" />
                          {markingPaid ? "Marcando..." : "Marcar como pagado"}
                        </span>
                      </Button>
                    </div>
                  )}

                  {error && (
                    <div className="shrink-0 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}

                  {/* Table */}
                  <div className="overflow-auto rounded-xl border border-gray-100 dark:border-gray-700 max-h-80">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                        <tr>
                          <th className="p-3 w-10">
                            <input
                              id="checkbox-all"
                              type="checkbox"
                              checked={allSelected}
                              onChange={toggleSelectAll}
                              className="w-4 h-4 rounded accent-primary-600"
                            />
                          </th>
                          <th className="px-3 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Concepto
                          </th>
                          <th className="px-3 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center">
                            Tipo
                          </th>
                          <th className="px-3 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center">
                            Fecha
                          </th>
                          <th className="px-3 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">
                            Monto
                          </th>
                          <th className="px-3 py-3 text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center">
                            Estado
                          </th>
                          <th className="w-10" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loading && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-8 text-center text-gray-400 text-sm"
                            >
                              Cargando costos...
                            </td>
                          </tr>
                        )}
                        {!loading && costs.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-8 text-center text-gray-400 text-sm"
                            >
                              No hay costos registrados para esta canción.
                            </td>
                          </tr>
                        )}
                        {!loading &&
                          costs.map((item) => {
                            const { date, time } = dateParts(
                              item.date || item.createdAt,
                            );
                            const isSelected = selectedIds.includes(item._id);
                            return (
                              <tr
                                key={item._id}
                                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                  isSelected
                                    ? "bg-primary-50/50 dark:bg-primary-900/10"
                                    : ""
                                }`}
                              >
                                <td className="p-3">
                                  <input
                                    id={`checkbox-${item._id}`}
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelection(item._id)}
                                    disabled={item.status !== "pending"}
                                    className="w-4 h-4 rounded accent-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                </td>
                                <td className="px-3 py-3">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {item.concept}
                                  </p>
                                  {item.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {item.description}
                                    </p>
                                  )}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span
                                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                      item.concept === "Ingreso"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300"
                                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300"
                                    }`}
                                  >
                                    {item.concept}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                  <p className="text-xs text-gray-600 dark:text-gray-300">
                                    {date}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {time}
                                  </p>
                                </td>
                                {/* toNum ensures decimals always render correctly */}
                                <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                  ${fmt(item.amount)}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span
                                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_CLASSES[item.status]}`}
                                  >
                                    {STATUS_LABELS[item.status]}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    aria-label="Eliminar costo"
                                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ──────────── BACK FACE ──────────── */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: isFlipped ? "relative" : "absolute",
              inset: 0,
              width: "100%",
              visibility: isFlipped ? "visible" : "hidden",
            }}
          >
            <BalanceFace
              songId={songId}
              costs={costs}
              onFlip={() => setIsFlipped(false)}
              expanded={expanded}
              onToggleExpand={toggleExpand}
              balanceKey={balanceKey}
            />
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  Nuevo costo
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Cerrar"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Tipo
                  </label>
                  <select
                    value={form.concept}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, concept: e.target.value }))
                    }
                    className={inputClass}
                  >
                    <option value="Ingreso">Ingreso</option>
                    <option value="Egreso">Egreso</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Estado
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        status: e.target.value as AccountingStatus,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Monto
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        amount: fmtInput(e.target.value),
                      }))
                    }
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Fecha
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">
                  Descripción <span className="text-gray-400">(opcional)</span>
                </label>
                <textarea
                  placeholder="Agrega una nota..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className={`${inputClass} resize-none`}
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <Button onClick={handleCreate} type="primary">
                {saving ? "Guardando..." : "Guardar costo"}
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                type="secondary"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtraordinaryCosts;
