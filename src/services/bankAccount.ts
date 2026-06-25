import { apiClient } from "@/infrastructure/http/axiosClient";
import type {
  ApiResponse,
  BankAccountSetupData,
  BankAccountStatusData,
  LinkedBankAccount,
} from "@/types/bank-account.types";

class BankAccountService {
  private readonly BASE = "/stripe/bank-account";

  /** Inicia la vinculación de la cuenta bancaria del Owner y devuelve el client_secret del SetupIntent. */
  setup = async (): Promise<ApiResponse<BankAccountSetupData>> => {
    const response = await apiClient.post(`${this.BASE}/setup`, {});
    return response.data;
  };

  /** Confirma la vinculación tras autorizar el mandato y devuelve el estado actualizado. */
  confirm = async (
    setupIntentId: string,
  ): Promise<ApiResponse<BankAccountStatusData>> => {
    const response = await apiClient.post(`${this.BASE}/confirm`, {
      setupIntentId,
    });
    return response.data;
  };

  /** Consulta el estado de la cuenta bancaria del Owner. */
  getStatus = async (): Promise<ApiResponse<BankAccountStatusData>> => {
    const response = await apiClient.get(this.BASE);
    return response.data;
  };

  /** Lista las cuentas bancarias vinculadas del Owner (con marca de la activa). */
  listAccounts = async (): Promise<ApiResponse<LinkedBankAccount[]>> => {
    const response = await apiClient.get(`${this.BASE}/accounts`);
    return response.data;
  };
}

export default new BankAccountService();
