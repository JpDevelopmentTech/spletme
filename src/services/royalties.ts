import { apiClient } from "@/infrastructure/http/axiosClient";

export type RoyaltyStatus = "pending" | "accepted" | "rejected";

export interface RoyaltyRequest {
  _id: string;
  songId: { _id: string; trackTitle: string; artistName: string; isrc?: string } | string;
  collaboratorId: string;
  ownerId: string;
  splitPercentage: number;
  calculatedAmount: number;
  status: RoyaltyStatus;
  createdAt: string;
}

export interface RequestRoyaltiesResult {
  requestId: string;
  status: RoyaltyStatus;
  splitPercentage: number;
  calculatedAmount: number;
}

class RoyaltiesService {
  private readonly BASE = "/royalties";

  async requestRoyalties(
    songId: string,
  ): Promise<{ error: boolean; data?: RequestRoyaltiesResult; message?: string }> {
    try {
      const response = await apiClient.post(`${this.BASE}/request`, { songId });
      return response.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Error al solicitar regalías";
      return { error: true, message: msg };
    }
  }

  async getMyRequests(): Promise<{ error: boolean; data?: RoyaltyRequest[]; message?: string }> {
    try {
      const response = await apiClient.get(`${this.BASE}/my-requests`);
      return response.data;
    } catch {
      return { error: true, message: "Error al obtener solicitudes" };
    }
  }

  async getIncomingRequests(): Promise<{
    error: boolean;
    data?: RoyaltyRequest[];
    message?: string;
  }> {
    try {
      const response = await apiClient.get(`${this.BASE}/incoming`);
      return response.data;
    } catch {
      return { error: true, message: "Error al obtener solicitudes entrantes" };
    }
  }
}

export default new RoyaltiesService();
