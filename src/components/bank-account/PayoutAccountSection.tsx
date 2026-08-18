import { useEffect, useState } from "react";
import { Banknote, Check, Loader2, Pencil, Plus, X, Coins } from "lucide-react";
import { usePayoutAccount } from "@/hooks/usePayoutAccount";
import { PAYOUT_CURRENCIES } from "@/const/currencies";
import { AccountCard, AccountBadge, AccountHeading } from "@/components/bank-account/AccountCard";
import { AccountFeedback } from "@/components/bank-account/AccountFeedback";
import type { PayoutFieldGroup } from "@/types/payout-account.types";

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

const formatType = (type: string | null): string | null => {
  if (!type) return null;
  return TYPE_LABELS[type] ?? type.replace(/_/g, " ").toUpperCase();
};

/** Nombre del país a partir del código ISO cuando se puede resolver. */
const formatCountry = (country: string | null): string | null => {
  if (!country) return null;
  try {
    const name = new Intl.DisplayNames(["es"], { type: "region" }).of(country.toUpperCase());
    return name ? `${name} (${country.toUpperCase()})` : country.toUpperCase();
  } catch {
    return country.toUpperCase();
  }
};

const fieldClass =
  "w-full rounded-2xl border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-[#2FB37E] focus:outline-none focus:ring-[3px] focus:ring-[#2FB37E]/15";

/**
 * Cuenta donde el usuario recibe su dinero: aquí entra, vía Wise.
 *
 * La moneda va sola y primero porque es la que decide qué campos pide Wise
 * después: para un IBAN europeo no son los mismos datos que para una cuenta ABA.
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

  // Al guardar con éxito se cierra la edición y se muestra la cuenta nueva.
  useEffect(() => {
    if (feedback?.type === "success") setEditing(false);
  }, [feedback]);

  const hasRecipient = !loadingStatus && Boolean(status?.hasRecipient);
  const showForm = !loadingStatus && (editing || !hasRecipient);
  const account = status?.account;

  const renderField = (group: PayoutFieldGroup) => {
    const value = values[group.key] ?? "";
    const onChange = (next: string) => setField(group.key, next, group.refreshRequirementsOnChange);
    const isSelect = (group.type === "select" || group.type === "radio") && group.valuesAllowed;

    return (
      <label key={group.key} className="flex flex-col gap-1.5">
        <FieldLabel required={group.required}>{group.name.toUpperCase()}</FieldLabel>
        {isSelect ? (
          <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Seleccionar…</option>
            {group.valuesAllowed!.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={fieldClass}
            value={value}
            placeholder={group.example || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </label>
    );
  };

  return (
    <AccountCard
      direction="in"
      label={hasRecipient ? "AQUÍ ENTRA TU DINERO" : "AQUÍ ENTRARÍA TU DINERO"}
      status={
        loadingStatus ? null : hasRecipient ? (
          <AccountBadge tone="ok" icon={<Check className="h-[11px] w-[11px]" />}>
            {status?.payoutCurrency || "Registrada"}
          </AccountBadge>
        ) : (
          <AccountBadge>Sin registrar</AccountBadge>
        )
      }
    >
      <AccountHeading
        direction="in"
        icon={<Banknote className="h-[18px] w-[18px] text-[#2FB37E]" />}
        title={hasRecipient ? "Cuenta para recibir pagos" : "Aún no puedes cobrar"}
        description={
          hasRecipient
            ? "Donde te llega tu parte. Los pagos se envían vía Wise."
            : "Registra dónde quieres recibir tu parte de las regalías."
        }
      />

      {/* Cuenta registrada */}
      {hasRecipient && !showForm && account && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-[18px] bg-[#F4F5F7] px-3.5 py-3">
            <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[11px] border border-[#E8E8EC] bg-white">
              <Banknote className="h-[15px] w-[15px] text-[#71757E]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                {account.bankIdentifier || "Cuenta bancaria"}
              </span>
              <span className="truncate font-mono text-[10.5px] text-[#A6AAB2]">
                {account.last4 ? `···· ${account.last4}` : "Cuenta registrada"}
              </span>
            </span>
          </div>

          <dl className="flex flex-wrap gap-x-6 gap-y-3">
            <Detail label="TITULAR" value={account.accountHolderName} />
            <Detail label="MONEDA" value={account.currency} />
            <Detail label="PAÍS" value={formatCountry(account.country)} />
            <Detail label="TIPO" value={account.accountType || formatType(account.type)} />
          </dl>
        </div>
      )}

      {loadingStatus && (
        <div className="flex items-center gap-3 rounded-[18px] bg-[#F4F5F7] px-3.5 py-3">
          <div className="h-[34px] w-[34px] flex-shrink-0 animate-pulse rounded-[11px] bg-white" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-2.5 w-[132px] animate-pulse rounded-full bg-white" />
            <div className="h-2 w-[92px] animate-pulse rounded-full bg-white/70" />
          </div>
        </div>
      )}

      {/* Formulario: alta o reemplazo */}
      {showForm && (
        <div className="flex flex-col gap-4">
          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 self-end text-[11.5px] font-semibold text-[#71757E] transition-colors hover:text-[#1C1D22]"
            >
              <X className="h-3.5 w-3.5" />
              Cancelar
            </button>
          )}

          <label className="flex flex-col gap-1.5 rounded-[18px] bg-[#E4F5EC] p-3.5">
            <FieldLabel required>MONEDA EN LA QUE QUIERES RECIBIR</FieldLabel>
            <div className="relative">
              <Coins
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2FB37E]"
                size={15}
              />
              <select
                className={`${fieldClass} pl-11`}
                value={currency}
                onChange={(e) => selectCurrency(e.target.value)}
              >
                <option value="">Seleccionar moneda…</option>
                {PAYOUT_CURRENCIES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10.5px] text-[#71757E]">
              Cambiarla vuelve a pedir los datos de la cuenta.
            </span>
          </label>

          {loadingFields && (
            <span className="flex items-center gap-2 text-[12px] text-[#A6AAB2]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando los campos de esta moneda…
            </span>
          )}

          {!loadingFields && current && (
            <div className="flex flex-col gap-3.5">
              {requirements.length > 1 && (
                <label className="flex flex-col gap-1.5">
                  <FieldLabel>TIPO DE CUENTA</FieldLabel>
                  <select
                    className={fieldClass}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {requirements.map((requirement) => (
                      <option key={requirement.type} value={requirement.type}>
                        {requirement.title}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="flex flex-col gap-1.5">
                <FieldLabel required>TITULAR DE LA CUENTA</FieldLabel>
                <input
                  className={fieldClass}
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Nombre completo del titular"
                />
              </label>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {current.fields.flatMap((field) => field.group.slice(0, 1)).map(renderField)}
              </div>
            </div>
          )}
        </div>
      )}

      {feedback && <AccountFeedback type={feedback.type} text={feedback.text} />}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
        {showForm ? (
          <>
            <button
              onClick={submit}
              disabled={submitting || loadingFields || !current}
              className="flex items-center gap-2 rounded-[20px] bg-[#2FB37E] px-[17px] py-2.5 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(47,179,126,0.4)] transition-colors enabled:hover:bg-[#249668] disabled:cursor-not-allowed disabled:bg-[#F4F5F7] disabled:text-[#A6AAB2] disabled:shadow-none"
            >
              {submitting ? (
                <Loader2 className="h-[14px] w-[14px] animate-spin" />
              ) : (
                <Check className="h-[14px] w-[14px]" />
              )}
              {submitting ? "Guardando…" : hasRecipient ? "Reemplazar cuenta" : "Guardar cuenta"}
            </button>
            <span className="min-w-0 flex-1 text-[10.5px] leading-snug text-[#A6AAB2]">
              {hasRecipient ? "Guardar reemplaza la cuenta anterior." : "Se envía vía Wise."}
            </span>
          </>
        ) : (
          !loadingStatus && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-[20px] border border-[#E8E8EC] bg-white px-[17px] py-2.5 text-[12.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
              >
                {hasRecipient ? (
                  <Pencil className="h-[14px] w-[14px]" />
                ) : (
                  <Plus className="h-[14px] w-[14px]" />
                )}
                {hasRecipient ? "Actualizar cuenta" : "Registrar cuenta"}
              </button>
              <span className="min-w-0 flex-1 text-[10.5px] leading-snug text-[#A6AAB2]">
                Cambiarla reemplaza la anterior.
              </span>
            </>
          )
        )}
      </div>
    </AccountCard>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
      {children}
      {required && <span className="text-[#FF5C00]"> *</span>}
    </span>
  );
}

/** Dato del resumen. Se oculta si no hay valor, para no dejar huecos vacíos. */
function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="font-mono text-[9px] font-medium tracking-[1px] text-[#A6AAB2]">{label}</dt>
      <dd className="truncate text-[12px] font-semibold text-[#1C1D22]">{value}</dd>
    </div>
  );
}
