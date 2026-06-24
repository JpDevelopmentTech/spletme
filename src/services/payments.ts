import axios from "axios";
import { apiClient } from "@/infrastructure/http/axiosClient";

/** Extrae el mensaje de error devuelto por el backend en una llamada fallida. */
const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
};

export interface Payment {
  _id: string;
  idCollaborator: string;
  amount: number;
  description?: string;
  owner: string;
  createdAt: string;
}

/** Un destinatario del reparto de un cobro de regalías. */
export interface RoyaltyBreakdownItem {
  collaboratorId:
    | { _id: string; name?: string; email?: string; username?: string }
    | string;
  amount: number;
  percentage: number;
}

/** Un problema que impide pagar una canción (pre-chequeo). */
export interface PaymentReadinessIssue {
  code: string;
  message: string;
}

/** Resultado del pre-chequeo de pago de una canción. */
export interface PaymentReadiness {
  canPay: boolean;
  amount: number;
  issues: PaymentReadinessIssue[];
}

/** Una canción con pendiente del colaborador en el pre-chequeo de pago completo. */
export interface CollaboratorReadinessSong {
  songId: string;
  trackTitle: string;
  pendingAmount: number;
}

/** Pre-chequeo del pago completo (todas las canciones) a un colaborador. */
export interface CollaboratorReadiness {
  canPay: boolean;
  totalPending: number;
  songs: CollaboratorReadinessSong[];
  issues: PaymentReadinessIssue[];
}

/** Un pago hecho a un colaborador en una canción (histórico). */
export interface CollaboratorPaymentHistoryItem {
  royaltyPaymentId: string;
  date: string;
  amount: number;
  percentage: number | null;
  paymentStatus: "pending" | "processing" | "succeeded" | "failed";
  payoutStatus: string | null;
}

/** Cobro ACH de regalías (pago hecho a Stripe por el owner). */
export interface RoyaltyPayment {
  _id: string;
  songId?: { _id: string; trackTitle?: string; artistName?: string } | string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string | null;
  status: "pending" | "processing" | "succeeded" | "failed";
  escrowStatus?: string;
  breakdown?: RoyaltyBreakdownItem[];
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

  /** Historial de cobros ACH de regalías hechos a Stripe por el owner. */
  async getRoyaltyPayments(): Promise<{ error: boolean; data?: RoyaltyPayment[]; message?: string }> {
    try {
      const response = await apiClient.get("/payments");
      return response.data;
    } catch {
      return { error: true, message: "Error getting royalty payments" };
    }
  }

  /** Pre-chequeo de si una canción está lista para pagar regalías (sin cobrar). */
  async getPaymentReadiness(
    songId: string
  ): Promise<{ error: boolean; data?: PaymentReadiness; message?: string }> {
    try {
      const response = await apiClient.get(`/payments/readiness/${songId}`);
      return response.data;
    } catch {
      return { error: true, message: "Error checking payment readiness" };
    }
  }

  /** Histórico de todos los cobros realizados para una canción. */
  async getSongHistory(
    songId: string
  ): Promise<{ error: boolean; data?: RoyaltyPayment[]; message?: string }> {
    try {
      const response = await apiClient.get(`/payments/song/${songId}/history`);
      return response.data;
    } catch {
      return { error: true, message: "Error getting song payment history" };
    }
  }

  /** Histórico de pagos hechos a un colaborador en una canción. */
  async getCollaboratorHistory(
    songId: string,
    collaboratorId: string
  ): Promise<{ error: boolean; data?: CollaboratorPaymentHistoryItem[]; message?: string }> {
    try {
      const response = await apiClient.get(
        `/payments/song/${songId}/collaborator/${collaboratorId}/history`
      );
      return response.data;
    } catch {
      return { error: true, message: "Error getting collaborator history" };
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

  /**
   * Inicia el cobro ACH de regalías de una canción (Stripe) y su reparto a los
   * colaboradores vía Wise. El monto lo calcula el backend a partir de los splits.
   */
  async payRoyalties(
    songId: string,
    collaboratorId?: string
  ): Promise<{ error: boolean; data?: unknown; message?: string }> {
    try {
      const response = await apiClient.post("/payments/pay", { songId, collaboratorId });
      return response.data;
    } catch (error) {
      return { error: true, message: extractErrorMessage(error, "Error al procesar el pago") };
    }
  }

  /**
   * Pre-chequeo del pago completo a un colaborador (sin cobrar): total pendiente,
   * desglose por canción e issues que lo impiden.
   */
  async getCollaboratorReadiness(
    collaboratorId: string
  ): Promise<{ error: boolean; data?: CollaboratorReadiness; message?: string }> {
    try {
      const response = await apiClient.get(`/payments/readiness/collaborator/${collaboratorId}`);
      return response.data;
    } catch (error) {
      return { error: true, message: extractErrorMessage(error, "Error checking collaborator readiness") };
    }
  }

  /**
   * Inicia el cobro ACH del total pendiente de un colaborador (todas sus canciones,
   * un solo débito) y su reparto vía Wise. El backend calcula el monto.
   */
  async payCollaborator(
    collaboratorId: string
  ): Promise<{ error: boolean; data?: unknown; message?: string }> {
    try {
      const response = await apiClient.post("/payments/pay-collaborator", { collaboratorId });
      return response.data;
    } catch (error) {
      return { error: true, message: extractErrorMessage(error, "Error al procesar el pago") };
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
