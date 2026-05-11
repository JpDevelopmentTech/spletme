import { apiClient } from "@/infrastructure/http/axiosClient";

interface CreateWalletData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  contact_type: string;
  country: string;
}

interface WalletData {
  id: string;
  status: string;
  accounts?: Array<{ balance: number; currency: string }>;
  [key: string]: unknown;
}

interface WalletResponse {
  error: boolean;
  data?: WalletData;
  message?: string;
}

const errorMessage = (error: unknown, fallback: string): string => {
  const axErr = error as { response?: { data?: { message?: string } } };
  return axErr.response?.data?.message ?? fallback;
};

class WalletService {
  private readonly BASE = "/wallet";

  /** Crea una wallet para el usuario autenticado */
  async createWallet(data: CreateWalletData): Promise<WalletResponse> {
    try {
      const response = await apiClient.post(`${this.BASE}/create-wallet`, data);
      return response.data;
    } catch (error) {
      return { error: true, message: errorMessage(error, "Error creating wallet") };
    }
  }

  /** Obtiene la wallet del usuario autenticado */
  async getWallet(): Promise<WalletResponse> {
    try {
      const response = await apiClient.get(`${this.BASE}/get-wallet`);
      return response.data;
    } catch (error) {
      return { error: true, message: errorMessage(error, "Error getting wallet") };
    }
  }

  /** Paga a un colaborador desde la wallet */
  async payCollaborator(data: { collaboratorId: string; songId: string; amount: number }): Promise<WalletResponse> {
    try {
      const response = await apiClient.post(`${this.BASE}/pay-collaborator`, data);
      return response.data;
    } catch (error) {
      return { error: true, message: errorMessage(error, "Error paying collaborator") };
    }
  }

  /** Obtiene los métodos de retiro disponibles */
  async getPayoutMethodTypes(): Promise<WalletResponse> {
    try {
      const response = await apiClient.get(`${this.BASE}/get-payout-method-types`);
      return response.data;
    } catch (error) {
      return { error: true, message: errorMessage(error, "Error getting payout method types") };
    }
  }

  /** Obtiene los campos requeridos para un método de retiro */
  async getRequiredFieldsForPayoutMethod(payoutMethodType: string): Promise<WalletResponse> {
    try {
      const response = await apiClient.get(`${this.BASE}/get-required-fields-for-payout-method`, {
        params: { payoutMethodType },
      });
      return response.data;
    } catch (error) {
      return { error: true, message: errorMessage(error, "Error getting required fields") };
    }
  }

  /** Solicita un retiro de fondos */
  async requestWithdrawal(data: {
    amount: number;
    payoutMethodType: string;
    beneficiaryDetails: Record<string, unknown>;
  }): Promise<WalletResponse> {
    try {
      const response = await apiClient.post(`${this.BASE}/request-withdrawal`, data);
      return response.data;
    } catch (error) {
      return { error: true, message: errorMessage(error, "Error requesting withdrawal") };
    }
  }

  /** Crea un depósito */
  async createDeposit(data: { amount: number; currency: string; country: string }) {
    try {
      const response = await apiClient.post(`${this.BASE}/create-deposit`, data);
      return response.data;
    } catch {
      return { error: true, message: "Error creating deposit" };
    }
  }

  /** Obtiene el historial de transacciones */
  async getTransactions(pageNumber = 1, pageSize = 25) {
    try {
      const response = await apiClient.get(`${this.BASE}/get-transactions`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch {
      return { error: true, message: "Error getting transactions" };
    }
  }

  /** Envía fondos a otro usuario por email */
  async sendFundsToUser(data: { amount: number; recipientEmail: string; note?: string }): Promise<WalletResponse> {
    try {
      const response = await apiClient.post(`${this.BASE}/send-funds-to-user`, data);
      return response.data;
    } catch (error) {
      return { error: true, message: errorMessage(error, "Error sending funds to user") };
    }
  }
}

export default new WalletService();
