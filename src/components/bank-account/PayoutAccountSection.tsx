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

/** Etiquetas legibles para los tipos de cuenta (recipient type) de Wise. */
const TYPE_LABELS: Record<string, string> = {
  aba: "Cuenta bancaria (ABA/ACH)",
  iban: "IBAN",
  swift_code: "Transferencia SWIFT",
  sort_code: "Sort code (Reino Unido)",
  clabe: "CLABE (México)",
  interac: "Interac (Canadá)",
  email: "Correo electrónico",
};

/** Convierte el tipo técnico de Wise en una etiqueta legible. */
const formatType = (type: string | null): string | null => {
  if (!type) return null;
  return TYPE_LABELS[type] ?? type.replace(/_/g, " ").toUpperCase();
};

/** Muestra el nombre del país a partir del código ISO cuando es posible. */
const formatCountry = (country: string | null): string | null => {
  if (!country) return null;
  try {
    const name = new Intl.DisplayNames(["es"], { type: "region" }).of(
      country.toUpperCase(),
    );
    return name ? `${name} (${country.toUpperCase()})` : country.toUpperCase();
  } catch {
    return country.toUpperCase();
  }
};

/** Fila etiqueta/valor dentro del resumen de la cuenta. Se oculta si no hay valor. */
function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="truncate text-sm font-semibold text-gray-800">{value}</dd>
    </div>
  );
}

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
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
            <Banknote className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-gray-900">Cuenta para recibir pagos</span>
            <span className="text-xs text-gray-500">
              Registra dónde quieres recibir tu dinero. Los pagos se envían vía Wise.
            </span>
          </div>
        </div>
        {hasRecipient && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            {status?.payoutCurrency || "Registrada"}
          </span>
        )}
      </div>

      {/* Cuenta registrada actual + botón actualizar (cuando no se está editando) */}
      {hasRecipient && !showForm && (
        <div className="flex flex-col gap-3">
          {status?.account && (
            <div className="flex flex-col gap-3 rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
              {/* Encabezado: banco + número enmascarado */}
              <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <Banknote className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-gray-800">
                    {status.account.bankIdentifier || "Cuenta bancaria"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {status.account.last4
                      ? `Cuenta terminada en ····${status.account.last4}`
                      : "Cuenta registrada"}
                  </span>
                </div>
              </div>

              {/* Detalles de la cuenta guardada */}
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                <DetailItem label="Titular" value={status.account.accountHolderName} />
                <DetailItem label="Moneda" value={status.account.currency} />
                <DetailItem label="País" value={formatCountry(status.account.country)} />
                <DetailItem
                  label="Tipo de cuenta"
                  value={status.account.accountType || formatType(status.account.type)}
                />
                <DetailItem
                  label="Banco / Identificador"
                  value={status.account.bankIdentifier}
                />
                <DetailItem
                  label="N.º de cuenta"
                  value={status.account.last4 ? `····${status.account.last4}` : null}
                />
              </dl>
            </div>
          )}
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
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
              className="flex items-center gap-1.5 self-end text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" />
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
              <Loader2 className="h-4 w-4 animate-spin" />
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {current.fields.flatMap((f) => f.group.slice(0, 1)).map(renderField)}
              </div>

              <button
                onClick={submit}
                disabled={submitting}
                className="flex items-center gap-2 self-start rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Banknote className="h-4 w-4" />
                )}
                {hasRecipient ? "Reemplazar cuenta" : "Guardar cuenta"}
              </button>
            </div>
          )}
        </div>
      )}

      {feedback && (
        <p className={`text-xs ${FEEDBACK_COLOR[feedback.type] ?? "text-gray-500"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
