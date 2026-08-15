import { apiClient } from "@/infrastructure/http/axiosClient";
import type { Album, AlbumsResponse, AlbumResponse, AlbumsError } from "../models/album";
import type { AlbumBalance } from "../types/accounting.types";

class AlbumService {
  private readonly BASE = "/albums";

  /**
   * Obtiene todos los álbumes del usuario autenticado con paginación.
   */
  async getAlbums(skip = 0, limit = 10, search = ""): Promise<AlbumsResponse | AlbumsError> {
    try {
      const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
      if (search.trim()) params.set("search", search.trim());
      const response = await apiClient.get(`${this.BASE}/albums?${params.toString()}`);
      return response.data as AlbumsResponse;
    } catch (error: unknown) {
      const axErr = error as {
        response?: { data?: AlbumsError };
        message?: string;
      };
      if (axErr.response?.data) return axErr.response.data;
      return {
        success: false,
        message: "Error retrieving albums",
        error: axErr.message ?? "Unknown error",
      };
    }
  }

  /**
   * Obtiene un álbum específico por UPC.
   */
  async getAlbumByUPC(upc: string): Promise<AlbumResponse | AlbumsError> {
    try {
      if (!upc) return { success: false, message: "UPC parameter is required" };
      const response = await apiClient.get(`${this.BASE}/albums/${encodeURIComponent(upc)}`);
      return response.data as AlbumResponse;
    } catch (error: unknown) {
      const axErr = error as {
        response?: { data?: AlbumsError };
        message?: string;
      };
      if (axErr.response?.data) return axErr.response.data;
      return {
        success: false,
        message: "Error retrieving album",
        error: axErr.message ?? "Unknown error",
      };
    }
  }

  /**
   * Obtiene métricas mensuales de streams e ingresos de un álbum.
   */
  async getAlbumMonthlyMetrics(
    upc: string,
    months = 12,
  ): Promise<{ month: string; streams: number; revenue: number }[]> {
    try {
      if (!upc) return [];
      const response = await apiClient.get(
        `${this.BASE}/albums/${encodeURIComponent(upc)}/monthly-metrics?months=${months}`,
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch {
      return [];
    }
  }

  /**
   * Devuelve todos los álbumes del usuario (sin paginación).
   */
  async getAllAlbums(): Promise<Album[] | null> {
    try {
      const response = await this.getAlbums(0, 1000);
      return response.success && "data" in response ? response.data : null;
    } catch {
      return null;
    }
  }

  async getAlbumBalance(albumId: string): Promise<AlbumBalance | null> {
    try {
      if (!albumId || albumId.length !== 24) return null;
      const response = await apiClient.get(`/accounting/balance/album/${albumId}`);
      return response.data?.data ?? response.data;
    } catch {
      return null;
    }
  }
}

export default new AlbumService();
