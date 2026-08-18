import {
  Landmark,
  Check,
  Hourglass,
  TriangleAlert,
  Loader2,
  Plus,
  Pencil,
  Info,
} from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useOwnerBankAccount } from "@/hooks/useOwnerBankAccount";
import { getStripe } from "@/infrastructure/stripe/stripeClient";
import BankAccountLinkForm from "@/components/bank-account/BankAccountLinkForm";
import { AccountCard, AccountBadge, AccountHeading } from "@/components/bank-account/AccountCard";
import { AccountFeedback } from "@/components/bank-account/AccountFeedback";
import type { BankAccountStatusData } from "@/types/bank-account.types";

const stripePromise = getStripe();

const STATUS: Record<
  BankAccountStatusData["status"],
  { label: string; tone: "ok" | "warn" | "error"; Icon: typeof Check }
> = {
  verified: { label: "Verificada", tone: "ok", Icon: Check },
  pending: { label: "Pendiente", tone: "warn", Icon: Hourglass },
  failed: { label: "Fallida", tone: "error", Icon: TriangleAlert },
};

/**
 * Cuenta bancaria del owner: de aquí sale el dinero hacia los colaboradores.
 *
 * El formulario de Stripe se abre dentro de la propia tarjeta y no en un modal,
 * para que la cuenta que estás cambiando siga a la vista mientras lo rellenas.
 */
export default function BankAccountSection() {
  const {
    status,
    accounts,
    loadingStatus,
    linking,
    clientSecret,
    setupIntentId,
    billingDetails,
    feedback,
    startLinking,
    cancelLinking,
    finishLinking,
  } = useOwnerBankAccount();

  const hasBankAccount = Boolean(status?.hasBankAccount);
  const config = status ? STATUS[status.status] : STATUS.pending;
  const StatusIcon = config.Icon;
  const isLinking = Boolean(clientSecret && setupIntentId);

  return (
    <AccountCard
      direction="out"
      label={hasBankAccount ? "DE AQUÍ SALE EL DINERO" : "DE AQUÍ SALDRÍA EL DINERO"}
      status={
        loadingStatus ? null : hasBankAccount ? (
          <AccountBadge tone={config.tone} icon={<StatusIcon className="h-[11px] w-[11px]" />}>
            {config.label}
          </AccountBadge>
        ) : (
          <AccountBadge>Sin vincular</AccountBadge>
        )
      }
    >
      <AccountHeading
        direction="out"
        icon={<Landmark className="h-[18px] w-[18px] text-[#FF5C00]" />}
        title={hasBankAccount ? "Cuenta bancaria" : "Aún no puedes pagar regalías"}
        description={
          hasBankAccount
            ? "Con esta cuenta pagas las regalías a tus colaboradores."
            : "Vincula la cuenta desde la que saldrá el dinero hacia tus colaboradores."
        }
      />

      {loadingStatus ? (
        <AccountSkeleton />
      ) : (
        accounts.length > 0 && (
          <div className="flex flex-col gap-2">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-3 rounded-[18px] bg-[#F4F5F7] px-3.5 py-3"
              >
                <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[11px] border border-[#E8E8EC] bg-white">
                  <Landmark className="h-[15px] w-[15px] text-[#71757E]" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                    {account.bankName ?? "Cuenta bancaria"}
                  </span>
                  <span className="truncate font-mono text-[10.5px] text-[#A6AAB2]">
                    ···· {account.last4 ?? "----"} · {account.accountType ?? "us bank account"}
                  </span>
                </span>
                {account.isActive && (
                  <span className="flex flex-shrink-0 items-center gap-1 rounded-xl bg-[#E4F5EC] px-2 py-1 text-[10px] font-semibold text-[#2FB37E]">
                    <Check className="h-[10px] w-[10px]" />
                    Activa
                  </span>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {isLinking && clientSecret && setupIntentId && (
        <div className="flex flex-col gap-3 rounded-[18px] bg-[#F4F5F7] p-4">
          <span className="flex items-center gap-2">
            <Info className="h-[13px] w-[13px] text-[#71757E]" />
            <span className="font-mono text-[9px] font-semibold tracking-[1.1px] text-[#71757E]">
              FORMULARIO SEGURO DE STRIPE
            </span>
          </span>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <BankAccountLinkForm
              setupIntentId={setupIntentId}
              defaultName={billingDetails.name}
              defaultEmail={billingDetails.email}
              onSuccess={finishLinking}
              onCancel={cancelLinking}
            />
          </Elements>
        </div>
      )}

      {feedback && <AccountFeedback type={feedback.type} text={feedback.text} />}

      {!isLinking && (
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={startLinking}
            disabled={linking || loadingStatus}
            className="flex items-center gap-2 rounded-[20px] bg-[#FF5C00] px-[17px] py-2.5 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors enabled:hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:bg-[#F4F5F7] disabled:text-[#A6AAB2] disabled:shadow-none"
          >
            {linking ? (
              <Loader2 className="h-[14px] w-[14px] animate-spin" />
            ) : hasBankAccount ? (
              <Pencil className="h-[14px] w-[14px]" />
            ) : (
              <Plus className="h-[14px] w-[14px]" />
            )}
            {linking ? "Abriendo…" : hasBankAccount ? "Actualizar cuenta" : "Vincular cuenta"}
          </button>
          <span className="min-w-0 flex-1 text-[10.5px] leading-snug text-[#A6AAB2]">
            Solo cuentas de EE. UU. Los pagos salen al instante.
          </span>
        </div>
      )}
    </AccountCard>
  );
}

function AccountSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-[#F4F5F7] px-3.5 py-3">
      <div className="h-[34px] w-[34px] flex-shrink-0 animate-pulse rounded-[11px] bg-white" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-2.5 w-[132px] animate-pulse rounded-full bg-white" />
        <div className="h-2 w-[92px] animate-pulse rounded-full bg-white/70" />
      </div>
    </div>
  );
}
