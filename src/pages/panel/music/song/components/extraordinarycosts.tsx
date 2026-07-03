import { useEffect, useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Coins, Plus, Trash2, X } from "lucide-react";
import { accountingApi } from "@/services/accounting";
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
  pending: "bg-[#FFEADD] text-[#FF5C00]",
  paid: "bg-[#E4F5EC] text-[#2FB37E]",
  cancelled: "bg-[#EDEEF1] text-[#71757E]",
};

const CONCEPT_LABELS: Record<string, string> = {
  INCOME: "Ingreso",
  EXPENSE: "Egreso",
};

const conceptLabel = (concept: string): string => CONCEPT_LABELS[concept.toUpperCase()] ?? concept;

const isIncome = (concept: string): boolean =>
  concept.toUpperCase() === "INCOME" || concept === "Ingreso";

// ─── Helpers ────────────────────────────────────────────────────────────────────

const toNum = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const cleaned = String(v).replace(/,/g, "");
  const parsed = parseFloat(cleaned);
  return isFinite(parsed) ? parsed : 0;
};

const fmt = (v: unknown): string =>
  toNum(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

const formatDate = (v?: string) => {
  if (!v) return "—";
  const p = new Date(v);
  if (Number.isNaN(p.getTime())) return "—";
  return p.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
};

const initialForm = (): FormState => ({
  concept: "INCOME",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  status: "pending",
});

const INPUT_CLASS =
  "w-full rounded-[16px] border border-[#EDEEF1] bg-white px-3.5 py-2.5 text-[13px] text-[#1C1D22] shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus:ring-2 focus:ring-[#FF5C00]/40";

// ─── Main Component ─────────────────────────────────────────────────────────────

const ExtraordinaryCosts = ({ songId }: ExtraordinaryCostsProps) => {
  const [costs, setCosts] = useState<Accounting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm());

  useEffect(() => {
    if (!songId) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await accountingApi.getBySongId(songId);
        if (active) setCosts(Array.isArray(data) ? data : []);
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

  const ingresos = useMemo(
    () => costs.filter((c) => isIncome(c.concept)).reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );
  const egresos = useMemo(
    () => costs.filter((c) => !isIncome(c.concept)).reduce((s, c) => s + toNum(c.amount), 0),
    [costs],
  );
  const balance = ingresos - egresos;

  const resetForm = () => setForm(initialForm());

  const handleCreate = async () => {
    if (!songId) {
      setError("No se encontró la canción.");
      return;
    }
    const concept = form.concept.trim().toUpperCase();
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
    } catch {
      setError("No se pudo eliminar el costo.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-[14px] rounded-[28px] bg-[#F4F5F7] p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Coins className="h-[19px] w-[19px] text-[#1C1D22]" />
            <h3 className="text-base font-semibold text-[#1C1D22]">Costos Extraordinarios</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-[16px] bg-[#FF5C00] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar
          </button>
        </div>

        {/* Balance */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-[16px] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] text-[#71757E]">Ingresos</p>
            <p className="text-base font-bold text-[#2FB37E]">${fmt(ingresos)}</p>
          </div>
          <div className="rounded-[16px] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] text-[#71757E]">Egresos</p>
            <p className="text-base font-bold text-[#EF4444]">${fmt(egresos)}</p>
          </div>
          <div className="rounded-[16px] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] text-[#71757E]">Balance</p>
            <p className={`text-base font-bold ${balance < 0 ? "text-[#EF4444]" : "text-[#1C1D22]"}`}>
              {balance < 0 ? "-" : ""}${fmt(Math.abs(balance))}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-[16px] bg-[#FEECEC] px-3.5 py-2.5 text-sm text-[#EF4444]">
            {error}
          </div>
        )}

        {/* Entries */}
        <div className="flex max-h-80 flex-col gap-2 overflow-auto">
          {loading ? (
            <div className="rounded-[16px] bg-white px-4 py-8 text-center text-[13px] text-[#A6AAB2] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              Cargando costos...
            </div>
          ) : costs.length === 0 ? (
            <div className="rounded-[16px] bg-white px-4 py-8 text-center text-[13px] text-[#A6AAB2] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              No hay costos registrados para esta canción.
            </div>
          ) : (
            costs.map((item) => {
              const income = isIncome(item.concept);
              return (
                <div
                  key={item._id}
                  className="flex items-center gap-3 rounded-[16px] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  {income ? (
                    <ArrowUpCircle className="h-[22px] w-[22px] shrink-0 text-[#2FB37E]" />
                  ) : (
                    <ArrowDownCircle className="h-[22px] w-[22px] shrink-0 text-[#EF4444]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#1C1D22]">
                      {item.description || conceptLabel(item.concept)}
                    </p>
                    <p className="text-[11px] text-[#A6AAB2]">{formatDate(item.date || item.createdAt)}</p>
                  </div>
                  <p
                    className={`shrink-0 whitespace-nowrap text-[13px] font-bold ${income ? "text-[#2FB37E]" : "text-[#EF4444]"}`}
                  >
                    {income ? "+" : "-"}${fmt(item.amount)}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${STATUS_CLASSES[item.status]}`}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    aria-label="Eliminar costo"
                    className="shrink-0 text-[#A6AAB2] transition-colors hover:text-[#EF4444]"
                  >
                    <Trash2 className="h-[15px] w-[15px]" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EDEEF1] px-5 py-4">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#FF5C00]" />
                <span className="text-sm font-semibold text-[#1C1D22]">Nuevo costo</span>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Cerrar"
                className="grid h-8 w-8 place-items-center rounded-[12px] bg-[#F4F5F7] text-[#71757E]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 px-5 py-4">
              {error && (
                <div className="rounded-[16px] bg-[#FEECEC] px-3.5 py-2.5 text-sm text-[#EF4444]">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71757E]">Tipo</label>
                  <select
                    value={form.concept}
                    onChange={(e) => setForm((p) => ({ ...p, concept: e.target.value }))}
                    className={INPUT_CLASS}
                  >
                    <option value="INCOME">Ingreso</option>
                    <option value="EXPENSE">Egreso</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-[#71757E]">Estado</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value as AccountingStatus }))
                    }
                    className={INPUT_CLASS}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#71757E]">Monto</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#A6AAB2]">
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm((p) => ({ ...p, amount: fmtInput(e.target.value) }))}
                    className={`${INPUT_CLASS} pl-7`}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#71757E]">Fecha</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className={INPUT_CLASS}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#71757E]">
                  Descripción <span className="text-[#A6AAB2]">(opcional)</span>
                </label>
                <textarea
                  placeholder="Agrega una nota..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className={`${INPUT_CLASS} resize-none`}
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-[#EDEEF1] bg-[#F4F5F7] px-5 py-4">
              <button
                type="button"
                onClick={handleCreate}
                className="rounded-[16px] bg-[#FF5C00] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#EA580C]"
              >
                {saving ? "Guardando..." : "Guardar costo"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="rounded-[16px] bg-[#F4F5F7] px-3.5 py-2 text-xs font-semibold text-[#71757E]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtraordinaryCosts;
