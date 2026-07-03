import { useOwnerBankAccount } from "@/hooks/useOwnerBankAccount";
import { usePayoutAccount } from "@/hooks/usePayoutAccount";

/**
 * Compone el estado de las dos cuentas de la billetera para el dashboard:
 * la cuenta para ENVIAR dinero (bancaria ACH del Owner) y la cuenta para
 * RECIBIR dinero (payout vía Wise). Expone únicamente si cada una está activa.
 */
export function useWalletAccountsStatus() {
  const { status: bankStatus, loadingStatus: loadingBank } = useOwnerBankAccount();
  const { status: payoutStatus, loadingStatus: loadingPayout } = usePayoutAccount();

  const loading = loadingBank || loadingPayout;
  const sendActive = Boolean(bankStatus?.hasBankAccount);
  const receiveActive = Boolean(payoutStatus?.hasRecipient);

  return {
    loading,
    sendActive,
    receiveActive,
    bothActive: sendActive && receiveActive,
  };
}
