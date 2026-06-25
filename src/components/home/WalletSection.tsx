import {
  Wallet,
  Plus,
  Send,
  DollarSign,
  History,
  ChevronRight,
} from "lucide-react";

interface WalletSectionProps {
  walletLoading: boolean;
  hasWallet: boolean;
  balance: number;
  onCreateWallet: () => void;
  onTransfer: () => void;
  onWithdrawal: () => void;
}

/**
 * Panel lateral de billetera del dashboard.
 * Muestra el balance y acciones si hay wallet, o el CTA de creación si no.
 */
export function WalletSection({
  walletLoading,
  hasWallet,
  balance,
  onCreateWallet,
  onTransfer,
  onWithdrawal,
}: WalletSectionProps) {
  return (
    <div
      className="col-span-3 row-span-2 flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6"
      data-tour="balance-section"
    >
      {walletLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500" />
        </div>
      ) : hasWallet ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Billetera</h2>
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-500">
              Activa
            </span>
          </div>

          <div className="flex flex-col gap-1 border-y border-gray-100 py-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Balance Disponible
            </span>
            <span className="text-[32px] font-bold leading-tight text-green-500">
              $
              {Number(balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-[11px] text-gray-400">USD</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onTransfer}
              className="flex w-full items-center justify-between rounded-[10px] bg-orange-500 px-4 py-3 text-white transition-colors hover:bg-orange-600"
            >
              <div className="flex items-center gap-2.5">
                <Send className="h-4 w-4" />
                <span className="text-[13px] font-semibold">Enviar dinero</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={onWithdrawal}
              className="flex w-full items-center justify-between rounded-[10px] border border-gray-200 bg-[#F7F8FA] px-4 py-3 transition-colors hover:bg-gray-100"
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-[13px] font-medium text-gray-700">
                  Retirar fondos
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button className="flex w-full items-center justify-between rounded-[10px] border border-gray-200 bg-[#F7F8FA] px-4 py-3 transition-colors hover:bg-gray-100">
              <div className="flex items-center gap-2.5">
                <History className="h-4 w-4 text-gray-500" />
                <span className="text-[13px] font-medium text-gray-700">
                  Ver historial
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Billetera</h2>
          </div>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              Sin billetera conectada
            </h3>
            <p className="text-xs text-gray-500">
              Crea tu billetera de pago para comenzar a recibir pagos
            </p>
          </div>
          <button
            onClick={onCreateWallet}
            className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-orange-500 px-4 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Crear billetera
          </button>
        </>
      )}
    </div>
  );
}
