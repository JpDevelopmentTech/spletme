import { Landmark, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { useOwnerBankAccount } from "@/hooks/useOwnerBankAccount";
import { getStripe } from "@/infrastructure/stripe/stripeClient";
import BankAccountLinkForm from "@/components/bank-account/BankAccountLinkForm";
import type { BankAccountStatusData } from "@/types/bank-account.types";

const stripePromise = getStripe();

const STATUS_CONFIG: Record<
  BankAccountStatusData["status"],
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  verified: {
    label: "Verificada",
    color: "#16A34A",
    bg: "#ECFDF5",
    icon: CheckCircle2,
  },
  pending: { label: "Pendiente", color: "#D97706", bg: "#FFFBEB", icon: Clock },
  failed: {
    label: "Fallida",
    color: "#DC2626",
    bg: "#FEF2F2",
    icon: AlertCircle,
  },
};

const FEEDBACK_COLOR: Record<string, string> = {
  success: "text-green-600",
  error: "text-red-500",
  info: "text-gray-500",
};

/**
 * Sección del dashboard (Billetera) para que el Owner vincule su cuenta bancaria
 * US vía Instant Bank Payments (Stripe Link, Payment Element) y consulte su estado.
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
  const cfg = status ? STATUS_CONFIG[status.status] : STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const isLinkingOpen = Boolean(clientSecret && setupIntentId);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
            <Landmark className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-gray-900">Cuenta bancaria</span>
            <span className="text-xs text-gray-500">
              Vincula tu cuenta bancaria de EE. UU. para pagar regalías al instante.
            </span>
          </div>
        </div>

        {!loadingStatus && hasBankAccount && (
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loadingStatus ? (
            <span className="flex items-center gap-2 text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando estado...
            </span>
          ) : hasBankAccount ? (
            <span>Tu cuenta bancaria está vinculada.</span>
          ) : (
            <span>Aún no has vinculado una cuenta bancaria.</span>
          )}
        </div>

        {!isLinkingOpen && (
          <button
            onClick={startLinking}
            disabled={linking || loadingStatus}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {linking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Landmark className="h-4 w-4" />
                {hasBankAccount ? "Actualizar cuenta" : "Vincular cuenta"}
              </>
            )}
          </button>
        )}
      </div>

      {isLinkingOpen && clientSecret && setupIntentId && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <BankAccountLinkForm
            setupIntentId={setupIntentId}
            defaultName={billingDetails.name}
            defaultEmail={billingDetails.email}
            onSuccess={finishLinking}
            onCancel={cancelLinking}
          />
        </Elements>
      )}

      {!loadingStatus && accounts.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Cuentas vinculadas
          </span>
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#F7F8FA] px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <Landmark className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {acc.bankName ?? "Cuenta bancaria"} ····
                    {acc.last4 ?? "----"}
                  </span>
                  <span className="text-xs capitalize text-gray-400">
                    {acc.accountType ?? "us bank account"}
                  </span>
                </div>
              </div>
              {acc.isActive && (
                <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Activa
                </span>
              )}
            </div>
          ))}
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
