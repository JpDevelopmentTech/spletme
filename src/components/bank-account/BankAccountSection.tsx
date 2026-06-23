import { Landmark, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useOwnerBankAccount } from "@/hooks/useOwnerBankAccount";
import type { BankAccountStatusData } from "@/types/bank-account.types";

const STATUS_CONFIG: Record<
  BankAccountStatusData["status"],
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  verified: { label: "Verificada", color: "#16A34A", bg: "#ECFDF5", icon: CheckCircle2 },
  pending: { label: "Pendiente", color: "#D97706", bg: "#FFFBEB", icon: Clock },
  failed: { label: "Fallida", color: "#DC2626", bg: "#FEF2F2", icon: AlertCircle },
};

const FEEDBACK_COLOR: Record<string, string> = {
  success: "text-green-600",
  error: "text-red-500",
  info: "text-gray-500",
};

/**
 * Sección del dashboard (Billetera) para que el Owner vincule su cuenta bancaria
 * US vía ACH (Stripe Financial Connections) y consulte su estado.
 */
export default function BankAccountSection() {
  const { status, accounts, loadingStatus, linking, feedback, linkBankAccount } =
    useOwnerBankAccount();

  const hasBankAccount = Boolean(status?.hasBankAccount);
  const cfg = status ? STATUS_CONFIG[status.status] : STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50">
            <Landmark className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-gray-900">Cuenta bancaria (ACH)</span>
            <span className="text-xs text-gray-500">
              Vincula tu cuenta bancaria de EE. UU. para pagar regalías por débito ACH.
            </span>
          </div>
        </div>

        {!loadingStatus && hasBankAccount && (
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            <StatusIcon className="w-3 h-3" />
            {cfg.label}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loadingStatus ? (
            <span className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando estado...
            </span>
          ) : hasBankAccount ? (
            <span>Tu cuenta bancaria está vinculada.</span>
          ) : (
            <span>Aún no has vinculado una cuenta bancaria.</span>
          )}
        </div>

        <button
          onClick={linkBankAccount}
          disabled={linking || loadingStatus}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {linking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Landmark className="w-4 h-4" />
              {hasBankAccount ? "Actualizar cuenta" : "Vincular cuenta"}
            </>
          )}
        </button>
      </div>

      {!loadingStatus && accounts.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Cuentas vinculadas
          </span>
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#F7F8FA] px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white border border-gray-200">
                  <Landmark className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {acc.bankName ?? "Cuenta bancaria"} ····{acc.last4 ?? "----"}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">
                    {acc.accountType ?? "us bank account"}
                  </span>
                </div>
              </div>
              {acc.isActive && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  Activa
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {feedback && (
        <p className={`text-xs ${FEEDBACK_COLOR[feedback.type] ?? "text-gray-500"}`}>{feedback.text}</p>
      )}
    </div>
  );
}
