import { Wallet, Plus, Send, DollarSign, History, ChevronRight } from "lucide-react";

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
      className="col-span-2 row-span-2 bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-5"
      data-tour="balance-section"
    >
      {walletLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : hasWallet ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Billetera</h2>
            <span className="px-2.5 py-1 bg-green-50 text-green-500 text-[11px] font-semibold rounded-full">
              Activa
            </span>
          </div>

          <div className="flex flex-col gap-1 py-4 border-y border-gray-100">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              Balance Disponible
            </span>
            <span className="text-[32px] font-bold text-green-500 leading-tight">
              ${Number(balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-[11px] text-gray-400">USD</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onTransfer}
              className="w-full flex items-center justify-between px-4 py-3 bg-orange-500 text-white rounded-[10px] hover:bg-orange-600 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4" />
                <span className="text-[13px] font-semibold">Enviar dinero</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onWithdrawal}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#F7F8FA] border border-gray-200 rounded-[10px] hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-[13px] font-medium text-gray-700">Retirar fondos</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between px-4 py-3 bg-[#F7F8FA] border border-gray-200 rounded-[10px] hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-gray-500" />
                <span className="text-[13px] font-medium text-gray-700">Ver historial</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Billetera</h2>
          </div>
          <div className="flex flex-col items-center text-center py-6 gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Sin billetera conectada</h3>
            <p className="text-xs text-gray-500">
              Crea tu billetera de pago para comenzar a recibir pagos
            </p>
          </div>
          <button
            onClick={onCreateWallet}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-[10px] text-[13px] font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear billetera
          </button>
        </>
      )}
    </div>
  );
}
