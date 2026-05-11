import { apiClient } from "@/infrastructure/http/axiosClient";

export interface Payment {
  _id: string;
  idCollaborator: string;
  amount: number;
  description?: string;
  owner: string;
  createdAt: string;
}

class PaymentsService {
  private readonly BASE = "/splits-payments";

  /** Procesa el pago de un split a un colaborador */
  async createPayment(collaboratorId: string, splitId: string) {
    try {
      const response = await apiClient.post(`${this.BASE}/split/${splitId}/process-payment`, { recipientId: collaboratorId });
      return response.data;
    } catch {
      return { error: true, message: "Error creating payment" };
    }
  }

  /** Obtiene todos los pagos del usuario autenticado */
  async getPayments(): Promise<{ error: boolean; data?: Payment[]; message?: string }> {
    try {
      const response = await apiClient.get(`${this.BASE}/by-user`);
      return response.data;
    } catch {
      return { error: true, message: "Error getting payments" };
    }
  }

  /** Obtiene los pagos de un colaborador específico */
  async getPaymentsByCollaborator(idCollaborator: string): Promise<{ error: boolean; data?: Payment[]; message?: string }> {
    try {
      const response = await apiClient.get(`${this.BASE}/by-collaborator/${idCollaborator}`);
      return response.data;
    } catch {
      return { error: true, message: "Error getting payments by collaborator" };
    }
  }

  /** Registra un pago manual para una canción */
  async registerSongPayment(songId: string, amount: number, description?: string): Promise<{ error: boolean; data?: unknown; message?: string }> {
    try {
      const response = await apiClient.post(`${this.BASE}/song/${songId}/register-payment`, {
        amount,
        description,
        paymentDate: new Date().toISOString(),
      });
      return response.data;
    } catch {
      return { error: true, message: "Error registering song payment" };
    }
  }
}

export default new PaymentsService();
