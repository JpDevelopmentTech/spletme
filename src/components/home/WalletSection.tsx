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
      className="flex flex-col gap-3.5 rounded-[26px] border border-[#E8E8EC] bg-white p-[22px] shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]"
      data-tour="balance-section"
    >
      <h2 className="font-display text-base font-semibold text-[#1C1D22]">Billetera</h2>

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
              className="flex w-full items-center justify-between rounded-[20px] border border-[#E8E8EC] bg-white px-4 py-3.5 transition-colors hover:bg-[#F4F5F7]"
            >
              <span className="text-[13px] font-semibold text-[#1C1D22]">Gestionar en Banco</span>
              <ChevronRight className="h-[15px] w-[15px] text-[#A6AAB2]" />
            </button>
          ) : (
            <>
              <p className="text-[11.5px] leading-relaxed text-[#71757E]">
                Configura tus cuentas para enviar y recibir dinero.
              </p>
              <button
                onClick={onGoToBank}
                className="flex w-full items-center justify-between rounded-[20px] bg-[#FF5C00] px-4 py-3.5 text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.35)] transition-colors hover:bg-[#EA580C]"
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
