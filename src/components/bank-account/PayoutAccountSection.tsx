import { useEffect, useState } from "react";
import { Banknote, CheckCircle2, Loader2, Pencil, X } from "lucide-react";
import { usePayoutAccount } from "@/hooks/usePayoutAccount";
import { PAYOUT_CURRENCIES } from "@/const/currencies";
import type { PayoutFieldGroup } from "@/types/payout-account.types";

const FEEDBACK_COLOR: Record<string, string> = {
  success: "text-green-600",
  error: "text-red-500",
  info: "text-gray-500",
};

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400";

/**
 * Sección del dashboard (Billetera) donde cualquier usuario registra la cuenta
 * bancaria donde quiere recibir su dinero. Si ya hay una cuenta, se muestra su
 * resumen y un botón para actualizarla; el formulario dinámico (campos por moneda
 * según Wise) solo aparece al registrar por primera vez o al pulsar "Actualizar".
 */
export default function PayoutAccountSection() {
  const {
    status,
    loadingStatus,
    currency,
    selectedType,
    setSelectedType,
    requirements,
    current,
    loadingFields,
    values,
    accountHolderName,
    setAccountHolderName,
    submitting,
    feedback,
    selectCurrency,
    setField,
    submit,
  } = usePayoutAccount();

  const [editing, setEditing] = useState(false);

  // Al guardar con éxito, se cierra el modo edición y se muestra la nueva cuenta.
  useEffect(() => {
    if (feedback?.type === "success") setEditing(false);
  }, [feedback]);

  const hasRecipient = !loadingStatus && Boolean(status?.hasRecipient);
  const showForm = !loadingStatus && (editing || !hasRecipient);

  const renderField = (group: PayoutFieldGroup) => {
    const value = values[group.key] ?? "";
    const onChange = (v: string) => setField(group.key, v, group.refreshRequirementsOnChange);
    const isSelect = (group.type === "select" || group.type === "radio") && group.valuesAllowed;

    return (
      <div key={group.key} className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">
          {group.name}
          {group.required && <span className="text-red-400"> *</span>}
        </label>
        {isSelect ? (
          <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Seleccionar…</option>
            {group.valuesAllowed!.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={inputClass}
            value={value}
            placeholder={group.example || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50">
            <Banknote className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-gray-900">Cuenta para recibir pagos</span>
            <span className="text-xs text-gray-500">
              Registra dónde quieres recibir tu dinero. Los pagos se envían vía Wise.
            </span>
          </div>
        </div>
        {hasRecipient && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-600">
            <CheckCircle2 className="w-3 h-3" />
            {status?.payoutCurrency || "Registrada"}
          </span>
        )}
      </div>

      {/* Cuenta registrada actual + botón actualizar (cuando no se está editando) */}
      {hasRecipient && !showForm && (
        <div className="flex flex-col gap-3">
          {status?.account && (
            <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-white border border-gray-200">
                  <Banknote className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {status.account.bankIdentifier || "Cuenta bancaria"}
                    {status.account.last4 ? ` ····${status.account.last4}` : ""}
                  </span>
                  <span className="text-xs text-gray-500">
                    {status.account.accountHolderName || "—"} · {status.account.currency}
                    {status.account.accountType ? ` · ${status.account.accountType}` : ""}
                  </span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setEditing(true)}
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Actualizar cuenta
          </button>
        </div>
      )}

      {/* Formulario (registro inicial o actualización) */}
      {showForm && (
        <div className="flex flex-col gap-4">
          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="self-end flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </button>
          )}

          {/* Selector de moneda */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">
              Moneda en la que quieres recibir
            </label>
            <select
              className={inputClass}
              value={currency}
              onChange={(e) => selectCurrency(e.target.value)}
            >
              <option value="">Seleccionar moneda…</option>
              {PAYOUT_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {loadingFields && (
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando campos requeridos…
            </span>
          )}

          {/* Formulario dinámico */}
          {!loadingFields && current && (
            <div className="flex flex-col gap-3">
              {requirements.length > 1 && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Tipo de cuenta</label>
                  <select
                    className={inputClass}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {requirements.map((r) => (
                      <option key={r.type} value={r.type}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">
                  Titular de la cuenta <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputClass}
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Nombre completo del titular"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.fields.flatMap((f) => f.group.slice(0, 1)).map(renderField)}
              </div>

              <button
                onClick={submit}
                disabled={submitting}
                className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
                {hasRecipient ? "Reemplazar cuenta" : "Guardar cuenta"}
              </button>
            </div>
          )}
        </div>
      )}

      {feedback && (
        <p className={`text-xs ${FEEDBACK_COLOR[feedback.type] ?? "text-gray-500"}`}>{feedback.text}</p>
      )}
    </div>
  );
}
