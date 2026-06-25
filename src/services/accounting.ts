import { apiClient } from "@/infrastructure/http/axiosClient";
import type {
  Accounting,
  CreateAccountingDto,
  ApiResponse,
} from "../types/accounting.types";

const BASE_URL = "/accounting";

// ─── Balance response type ──────────────────────────────────────────────────────

export interface SongBalance {
  songId: string;
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  totalEntries: number;
}

// ─── API ────────────────────────────────────────────────────────────────────────

export const accountingApi = {
  /**
   * POST /accounting
   * Crea un nuevo registro de costo para una canción.
   */
  create: async (data: CreateAccountingDto): Promise<Accounting> => {
    const res = await apiClient.post<ApiResponse<Accounting>>(
      `${BASE_URL}`,
      data,
    );
    return res.data.data;
  },

  /**
   * GET /accounting/song/:songId
   * Trae todos los costos asociados a una canción.
   */
  getBySongId: async (songId: string): Promise<Accounting[]> => {
    const res = await apiClient.get<ApiResponse<Accounting[]>>(
      `${BASE_URL}/song/${songId}`,
    );
    return res.data.data;
  },

  /**
   * GET /accounting/balance/song/:songId
   * Retorna el balance neto de una canción:
   * totalIngresos − totalEgresos (sin importar estado).
   */
  getBalanceBySongId: async (songId: string): Promise<SongBalance> => {
    const res = await apiClient.get<ApiResponse<SongBalance>>(
      `${BASE_URL}/balance/song/${songId}`,
    );
    return res.data.data;
  },

  /**
   * DELETE /accounting/:id
   * Elimina un registro de costo por su ID.
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  /**
   * PUT /accounting/:id
   * Actualiza un registro de costo.
   */
  update: async (
    id: string,
    data: Partial<Accounting>,
  ): Promise<Accounting> => {
    const res = await apiClient.put<ApiResponse<Accounting>>(
      `${BASE_URL}/${id}`,
      data,
    );
    return res.data.data;
  },
};
