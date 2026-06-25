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
import AlbumService from "../../../../../services/albums";
import type {
  AlbumBalance,
  Accounting,
  AccountingStatus,
  CreateAccountingDto,
} from "../../../../../types/accounting.types";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface TrackRef {
  _id: string;
  trackTitle: string;
}

interface AlbumExtraordinaryCostsProps {
  albumId: string;
  tracks: TrackRef[];
}

type FormState = {
  songId: string;
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
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-500",
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

const toNum = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const parsed = parseFloat(String(v).replace(/,/g, ""));
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
    time: p.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
  };
};

const initialForm = (firstTrackId: string): FormState => ({
  songId: firstTrackId,
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
  accent,
}: {
  label: string;
  value: string;
  accent?: "green" | "orange" | "red" | "default";
}) => {
  const valueClass = {
    green: "text-green-600",
    orange: "text-orange-500",
    red: "text-red-600",
    default: "text-gray-900",
  }[accent ?? "default"];

  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-gray-50 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`text-base font-bold leading-tight ${valueClass}`}>{value}</p>
    </div>
  );
};

// ─── BalanceFace ────────────────────────────────────────────────────────────────

interface BalanceFaceProps {
  albumId: string;
  costs: Accounting[];
  onFlip: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
  balanceKey: number;
}

const BalanceFace = ({
  albumId,
  costs,
  onFlip,
  expanded,
  onToggleExpand,
  balanceKey,
}: BalanceFaceProps) => {
  const [balance, setBalance] = useState<AlbumBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState(false);

  useEffect(() => {
    if (!albumId) return;
    let active = true;
    setLoadingBalance(true);
    setBalanceError(false);
    AlbumService.getAlbumBalance(albumId)
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
  }, [albumId, balanceKey]);

  const localIngresos = useMemo(
    () => costs.filter((c) => c.concept === "Ingreso").reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );
  const localEgresos = useMemo(
    () => costs.filter((c) => c.concept !== "Ingreso").reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );

  const totalIngresos = toNum(balance?.totalIngresos ?? localIngresos);
  const totalEgresos = toNum(balance?.totalEgresos ?? localEgresos);
  const netBalance = totalIngresos - totalEgresos;
  const isPositive = netBalance >= 0;
  const totalEntries = balance?.totalEntries ?? costs.length;

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
    <div className="flex h-full flex-col gap-4 p-5">
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900">Balance del Álbum</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {totalEntries} mov.
          </span>
          {loadingBalance && <RefreshCw className="h-3 w-3 animate-spin text-gray-400" />}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFlip}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Ver detalle
          </button>
          <Button onClick={onToggleExpand} type="primary">
            {expanded ? "Ver menos" : "Ver más"}
          </Button>
        </div>
      </div>

      {balanceError && (
        <p className="shrink-0 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-600">
          No se pudo actualizar el balance desde el servidor. Mostrando datos locales.
        </p>
      )}

      <div
        className={`flex shrink-0 items-center justify-between rounded-xl px-4 py-3 ${
          isPositive ? "border border-green-100 bg-green-50" : "border border-red-100 bg-red-50"
        }`}
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            Balance neto
          </p>
          <p
            className={`text-2xl font-bold leading-tight ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isPositive ? "+" : "-"}${fmt(Math.abs(netBalance))}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? "Superávit" : "Déficit"}
        </span>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <ArrowUpCircle className="h-3.5 w-3.5 text-green-500" />
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
              Ingresos
            </p>
          </div>
          <p className="text-base font-bold text-gray-900">${fmt(totalIngresos)}</p>
          {/* {albumNetIncome > 0 && (
            <p className="text-[11px] text-blue-600 mt-0.5">Incl. ${fmt(albumNetIncome)} ganancia álbum</p>
          )} */}
          {pendingIngresos > 0 && (
            <p className="mt-0.5 text-[11px] text-yellow-600">${fmt(pendingIngresos)} pendiente</p>
          )}
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <ArrowDownCircle className="h-3.5 w-3.5 text-orange-500" />
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Egresos</p>
          </div>
          <p className="text-base font-bold text-gray-900">${fmt(totalEgresos)}</p>
          {pendingEgresos > 0 && (
            <p className="mt-0.5 text-[11px] text-yellow-600">${fmt(pendingEgresos)} pendiente</p>
          )}
        </div>
      </div>

      {expanded && (
        <>
          {totalForBar > 0 && (
            <div className="shrink-0">
              <div className="mb-1.5 flex justify-between text-[11px] text-gray-400">
                <span>Ingresos {ingPct.toFixed(0)}%</span>
                <span>Egresos {(100 - ingPct).toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-orange-200">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${ingPct}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid shrink-0 grid-cols-2 gap-3">
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

          {/* {albumNetIncome > 0 && (
            <div className="shrink-0 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wide mb-0.5">
                Ganancia neta del álbum
              </p>
              <p className="text-base font-bold text-blue-700">${fmt(albumNetIncome)}</p>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────

const AlbumExtraordinaryCosts = ({ albumId, tracks }: AlbumExtraordinaryCostsProps) => {
  const trackMap = useMemo(() => new Map(tracks.map((t) => [t._id, t.trackTitle])), [tracks]);

  const [isFlipped, setIsFlipped] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [suppressFlip, setSuppressFlip] = useState(false);
  const [costs, setCosts] = useState<Accounting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(() => initialForm(tracks[0]?._id ?? ""));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [balanceKey, setBalanceKey] = useState(0);
  const bumpBalance = useCallback(() => setBalanceKey((k) => k + 1), []);

  useEffect(() => {
    if (tracks.length === 0) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.allSettled(
          tracks.map((t) => accountingApi.getBySongId(t._id)),
        );
        if (!active) return;
        const all: Accounting[] = [];
        for (const r of results) {
          if (r.status === "fulfilled" && Array.isArray(r.value)) all.push(...r.value);
        }
        all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCosts(all);
        setSelectedIds([]);
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
  }, [tracks]);

  const pendingCosts = useMemo(() => costs.filter((i) => i.status === "pending"), [costs]);
  const selectedCosts = useMemo(
    () => pendingCosts.filter((i) => selectedIds.includes(i._id)),
    [pendingCosts, selectedIds],
  );
  const selectedTotal = useMemo(
    () => selectedCosts.reduce((t, i) => t + toNum(i.amount), 0),
    [selectedCosts],
  );
  const tableIngresos = useMemo(
    () => costs.filter((c) => c.concept === "Ingreso").reduce((s, c) => s + toNum(c.amount), 0) + 0,
    [costs],
  );
  const tableEgresos = useMemo(
    () => costs.filter((c) => c.concept !== "Ingreso").reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );
  const tableBalance = tableIngresos - tableEgresos;
  const tableBalancePositive = tableBalance >= 0;
  const allSelected = pendingCosts.length > 0 && selectedIds.length === pendingCosts.length;

  const toggleSelection = (id: string) => {
    const t = costs.find((i) => i._id === id);
    if (!t || t.status !== "pending") return;
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => setSelectedIds(allSelected ? [] : pendingCosts.map((i) => i._id));

  const resetForm = () => setForm(initialForm(tracks[0]?._id ?? ""));

  const collapse = () => {
    setSuppressFlip(true);
    setIsFlipped(false);
    setExpanded(false);
    setTimeout(() => setSuppressFlip(false), 60);
  };

  const toggleExpand = () => (expanded ? collapse() : setExpanded(true));

  const handleCreate = async () => {
    if (!form.songId) {
      setError("Selecciona una canción.");
      return;
    }
    const amountValue = parseAmt(form.amount);
    if (!isFinite(amountValue) || amountValue <= 0) {
      setError("El monto debe ser mayor a cero.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: CreateAccountingDto = {
        concept: form.concept.trim(),
        amount: amountValue,
        songId: form.songId,
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
      await Promise.all(selectedCosts.map((i) => accountingApi.update(i._id, { status: "paid" })));
      setCosts((prev) =>
        prev.map((i) => (selectedIds.includes(i._id) ? { ...i, status: "paid" } : i)),
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
    "w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none";

  return (
    <>
      <div className="col-span-12 md:col-span-2" style={{ perspective: "1200px" }}>
        <div
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            transition: suppressFlip ? "none" : "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ── FRONT FACE ── */}
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
            <div className="flex flex-col gap-4 p-5">
              <div className="flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-gray-900">
                    Contabilidad del Álbum
                  </span>
                  {costs.length > 0 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {costs.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {expanded && (
                    <button
                      type="button"
                      onClick={() => setIsFlipped(true)}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
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
                  <div className="flex shrink-0 items-center justify-between">
                    <div className="mr-3 grid flex-1 grid-cols-4 gap-3">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="mb-0.5 flex items-center gap-1">
                          <ArrowUpCircle className="h-3 w-3 shrink-0 text-green-500" />
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Ingresos
                          </p>
                        </div>
                        <p className="text-sm font-bold text-green-600">${fmt(tableIngresos)}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="mb-0.5 flex items-center gap-1">
                          <ArrowDownCircle className="h-3 w-3 shrink-0 text-orange-500" />
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Egresos
                          </p>
                        </div>
                        <p className="text-sm font-bold text-orange-500">${fmt(tableEgresos)}</p>
                      </div>
                      <div
                        className={`rounded-xl p-3 ${tableBalancePositive ? "bg-green-50" : "bg-red-50"}`}
                      >
                        <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                          Balance
                        </p>
                        <p
                          className={`text-sm font-bold ${tableBalancePositive ? "text-green-600" : "text-red-600"}`}
                        >
                          {tableBalancePositive ? "+" : "-"}${fmt(Math.abs(tableBalance))}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                          Selección
                        </p>
                        <p className="text-sm font-bold text-gray-900">
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

                  {selectedCosts.length > 0 && (
                    <div className="bg-primary-50 flex shrink-0 items-center justify-between rounded-xl px-4 py-2.5">
                      <span className="text-primary-700 text-sm">
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
                    <div className="shrink-0 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">
                      {error}
                    </div>
                  )}

                  <div className="max-h-80 overflow-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 z-10 bg-gray-50">
                        <tr>
                          <th className="w-10 p-3">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={toggleSelectAll}
                              className="accent-primary-600 h-4 w-4 rounded"
                            />
                          </th>
                          <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Concepto
                          </th>
                          <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Canción
                          </th>
                          <th className="px-3 py-3 text-center text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Tipo
                          </th>
                          <th className="px-3 py-3 text-center text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Fecha
                          </th>
                          <th className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Monto
                          </th>
                          <th className="px-3 py-3 text-center text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Estado
                          </th>
                          <th className="w-10" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {loading && (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                              Cargando costos...
                            </td>
                          </tr>
                        )}
                        {!loading && costs.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                              No hay costos registrados para este álbum.
                            </td>
                          </tr>
                        )}
                        {!loading &&
                          costs.map((item) => {
                            const { date, time } = dateParts(item.date || item.createdAt);
                            const isSelected = selectedIds.includes(item._id);
                            const songTitle = trackMap.get(item.songId) ?? "—";
                            return (
                              <tr
                                key={item._id}
                                className={`transition-colors hover:bg-gray-50 ${isSelected ? "bg-primary-50/50" : ""}`}
                              >
                                <td className="p-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelection(item._id)}
                                    disabled={item.status !== "pending"}
                                    className="accent-primary-600 h-4 w-4 rounded disabled:cursor-not-allowed disabled:opacity-50"
                                  />
                                </td>
                                <td className="px-3 py-3">
                                  <p className="font-medium text-gray-900">{item.concept}</p>
                                  {item.description && (
                                    <p className="mt-0.5 text-xs text-gray-500">
                                      {item.description}
                                    </p>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  <p
                                    className="max-w-[120px] truncate text-xs text-gray-600"
                                    title={songTitle}
                                  >
                                    {songTitle}
                                  </p>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      item.concept === "Ingreso"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-orange-100 text-orange-800"
                                    }`}
                                  >
                                    {item.concept}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 text-center">
                                  <p className="text-xs text-gray-600">{date}</p>
                                  <p className="text-xs text-gray-400">{time}</p>
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-gray-900">
                                  ${fmt(item.amount)}
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span
                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[item.status]}`}
                                  >
                                    {STATUS_LABELS[item.status]}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
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

          {/* ── BACK FACE ── */}
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
              albumId={albumId}
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
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-semibold text-gray-900">Nuevo costo</span>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 px-5 py-4">
              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{error}</div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Canción</label>
                <select
                  value={form.songId}
                  onChange={(e) => setForm((p) => ({ ...p, songId: e.target.value }))}
                  className={inputClass}
                >
                  {tracks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.trackTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Tipo</label>
                  <select
                    value={form.concept}
                    onChange={(e) => setForm((p) => ({ ...p, concept: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="Ingreso">Ingreso</option>
                    <option value="Egreso">Egreso</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Estado</label>
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
                <label className="text-xs text-gray-500">Monto</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
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
                <label className="text-xs text-gray-500">Fecha</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">
                  Descripción <span className="text-gray-400">(opcional)</span>
                </label>
                <textarea
                  placeholder="Agrega una nota..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className={`${inputClass} resize-none`}
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4">
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

export default AlbumExtraordinaryCosts;
