import { apiClient } from "@/infrastructure/http/axiosClient";
import type {
  ApiResponse,
  PayoutAccountStatus,
  PayoutRequirement,
  RegisterPayoutPayload,
} from "@/types/payout-account.types";

class PayoutAccountService {
  private readonly BASE = "/payout-account";

  /** Estado de la cuenta de recepción del usuario. */
  getStatus = async (): Promise<ApiResponse<PayoutAccountStatus>> => {
    const response = await apiClient.get(this.BASE);
    return response.data;
  };

  /** Campos requeridos por Wise para registrar una cuenta en la moneda dada. */
  getRequirements = async (
    currency: string,
  ): Promise<ApiResponse<PayoutRequirement[]>> => {
    const response = await apiClient.get(`${this.BASE}/requirements`, {
      params: { currency },
    });
    return response.data;
  };

  /** Recalcula los campos requeridos a partir de los datos parciales capturados. */
  refreshRequirements = async (
    currency: string,
    details: Record<string, unknown>,
  ): Promise<ApiResponse<PayoutRequirement[]>> => {
    const response = await apiClient.post(`${this.BASE}/requirements`, {
      currency,
      details,
    });
    return response.data;
  };

  /** Registra/actualiza la cuenta de recepción del usuario. */
  register = async (
    payload: RegisterPayoutPayload,
  ): Promise<ApiResponse<PayoutAccountStatus>> => {
    const response = await apiClient.post(this.BASE, payload);
    return response.data;
  };
}

export default new PayoutAccountService();
