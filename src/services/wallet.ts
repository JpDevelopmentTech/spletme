import axios from "axios";

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
  accounts?: Array<{
    balance: number;
    currency: string;
  }>;
  [key: string]: unknown;
}

interface WalletResponse {
  error: boolean;
  data?: WalletData;
  message?: string;
}

class WalletService {
  private readonly URI = import.meta.env.VITE_URL_API + "/api/v1/wallet";

  private getAuthToken() {
    return localStorage.getItem("token");
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.getAuthToken()}`,
    };
  }

  /**
   * Crea una wallet para el usuario
   */
  async createWallet(data: CreateWalletData): Promise<WalletResponse> {
    try {
      const response = await axios.post(
        `${this.URI}/create-wallet`,
        data,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating wallet:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      return { 
        error: true, 
        message: errorMessage || "Error creating wallet" 
      };
    }
  }

  /**
   * Obtiene la wallet del usuario
   */
  async getWallet(): Promise<WalletResponse> {
    try {
      const response = await axios.get(`${this.URI}/get-wallet`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error getting wallet:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      return { 
        error: true, 
        message: errorMessage || "Error getting wallet" 
      };
    }
  }

  /**
   * Paga a un colaborador
   */
  async payCollaborator(data: {
    collaboratorId: string;
    songId: string;
    amount: number;
  }): Promise<WalletResponse> {
    try {
      const response = await axios.post(
        `${this.URI}/pay-collaborator`,
        data,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error paying collaborator:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      return { 
        error: true, 
        message: errorMessage || "Error paying collaborator" 
      };
    }
  }

  /**
   * Obtiene los métodos de pago disponibles
   */
  async getPayoutMethodTypes(): Promise<WalletResponse> {
    try {
      const response = await axios.get(`${this.URI}/get-payout-method-types`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error getting payout method types:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      return { 
        error: true, 
        message: errorMessage || "Error getting payout method types" 
      };
    }
  }

  /**
   * Obtiene los campos requeridos para un método de pago específico
   */
  async getRequiredFieldsForPayoutMethod(payoutMethodType: string): Promise<WalletResponse> {
    try {
      const response = await axios.get(
        `${this.URI}/get-required-fields-for-payout-method`,
        {
          headers: this.headers,
          params: { payoutMethodType },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error getting required fields:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      return { 
        error: true, 
        message: errorMessage || "Error getting required fields" 
      };
    }
  }

  /**
   * Solicita un retiro de dinero
   */
  async requestWithdrawal(data: {
    amount: number;
    payoutMethodType: string;
    beneficiaryDetails: Record<string, unknown>;
  }): Promise<WalletResponse> {
    try {
      const response = await axios.post(
        `${this.URI}/request-withdrawal`,
        data,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error requesting withdrawal:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      return { 
        error: true, 
        message: errorMessage || "Error requesting withdrawal" 
      };
    }
  }

  async createDeposit(data: { amount: number; currency: string; country: string }) {
    try {
      const response = await axios.post(`${this.URI}/create-deposit`, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating deposit:", error);
      return { error: true, message: "Error creating deposit" };
    }
  }

  async getTransactions(pageNumber = 1, pageSize = 25) {
    try {
      const response = await axios.get(`${this.URI}/get-transactions`, {
        headers: this.headers,
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error getting transactions:", error);
      return { error: true, message: "Error getting transactions" };
    }
  }

  /**
   * Envía fondos a otro usuario
   */
  async sendFundsToUser(data: {
    amount: number;
    recipientEmail: string;
    note?: string;
  }): Promise<WalletResponse> {
    try {
      const response = await axios.post(
        `${this.URI}/send-funds-to-user`,
        data,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error sending funds to user:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      return { 
        error: true, 
        message: errorMessage || "Error sending funds to user" 
      };
    }
  }
}

export default new WalletService();

