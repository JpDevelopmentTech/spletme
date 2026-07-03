import { Send, Banknote, ChevronRight } from "lucide-react";
import { WalletAccountStatusRow } from "./WalletAccountStatusRow";

interface WalletSectionProps {
  loading: boolean;
  sendActive: boolean;
  receiveActive: boolean;
  onGoToBank: () => void;
}

/**
 * Panel de billetera del dashboard.
 * Muestra si la cuenta para enviar y la cuenta para recibir dinero están activas.
 * Si falta alguna (o ambas), invita a configurarlas en la sección Banco.
 */
export function WalletSection({
  loading,
  sendActive,
  receiveActive,
  onGoToBank,
}: WalletSectionProps) {
  const bothActive = sendActive && receiveActive;

  return (
    <div
      className="flex flex-col gap-[18px] rounded-[36px] bg-[#F4F5F7] p-6"
      data-tour="balance-section"
    >
      <h2 className="text-base font-semibold text-[#1C1D22]">Billetera</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#FF5C00]" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            <WalletAccountStatusRow icon={Send} label="Enviar dinero" active={sendActive} />
            <WalletAccountStatusRow icon={Banknote} label="Recibir dinero" active={receiveActive} />
          </div>

          {bothActive ? (
            <button
              onClick={onGoToBank}
              className="flex w-full items-center justify-between rounded-[22px] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FBFBFC]"
            >
              <span className="text-[13px] font-medium text-[#1C1D22]">Gestionar en Banco</span>
              <ChevronRight className="h-[15px] w-[15px] text-[#A6AAB2]" />
            </button>
          ) : (
            <>
              <p className="text-xs text-[#71757E]">
                Configura tus cuentas para enviar y recibir dinero.
              </p>
              <button
                onClick={onGoToBank}
                className="flex w-full items-center justify-between rounded-[22px] bg-[#FF5C00] px-4 py-3.5 text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.35)] transition-colors hover:bg-[#EA580C]"
              >
                <span className="text-[13px] font-semibold">Configurar en Banco</span>
                <ChevronRight className="h-[15px] w-[15px]" />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
