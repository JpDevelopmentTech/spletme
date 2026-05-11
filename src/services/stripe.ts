import { apiClient } from "@/infrastructure/http/axiosClient";

class StripeService {
  private readonly BASE = "/stripe";

  /** Inicia la conexión de la cuenta Stripe del usuario */
  connectStripeAccount = async () => {
    const response = await apiClient.post(`${this.BASE}/connect`, {});
    return response.data;
  };

  /** Verifica el estado de la cuenta Stripe */
  checkStatus = async () => {
    const response = await apiClient.get(`${this.BASE}/status`);
    return response.data;
  };

  /** Refresca la conexión con Stripe */
  refreshConnection = async () => {
    const response = await apiClient.post(`${this.BASE}/refresh`, {});
    return response.data;
  };

  /** Obtiene el balance de la cuenta Stripe */
  getBalance = async () => {
    const response = await apiClient.get(`${this.BASE}/balance`);
    return response.data;
  };
}

export default new StripeService();
