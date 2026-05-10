import axios from "axios";
import type { Album, AlbumsResponse, AlbumResponse, AlbumsError } from "../models/album";

class AlbumService {
  private readonly URI = import.meta.env.VITE_URL_API + "/api/v1/albums";
  
  private getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  private getHeaders() {
    const token = this.getAuthToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Get all albums for the authenticated user with pagination
   * @param skip Number of records to skip (default: 0)
   * @param limit Number of records to return (default: 10)
   * @returns Promise<AlbumsResponse | AlbumsError>
   */
  async getAlbums(skip: number = 0, limit: number = 10): Promise<AlbumsResponse | AlbumsError> {
    try {
      const endpoint = `${this.URI}/albums?skip=${skip}&limit=${limit}`;
      const response = await axios.get(endpoint, {
        headers: this.getHeaders(),
      });
      
      return response.data as AlbumsResponse;
    } catch (error: any) {
      console.error("Error getting albums:", error);
      
      if (error.response?.data) {
        return error.response.data as AlbumsError;
      }
      
      return {
        success: false,
        message: "Error retrieving albums",
        error: error.message || "Unknown error",
      };
    }
  }

  /**
   * Get a specific album by UPC
   * @param upc The UPC code of the album
   * @returns Promise<AlbumResponse | AlbumsError>
   */
  async getAlbumByUPC(upc: string): Promise<AlbumResponse | AlbumsError> {
    try {
      if (!upc) {
        return {
          success: false,
          message: "UPC parameter is required",
        };
      }

      const endpoint = `${this.URI}/albums/${encodeURIComponent(upc)}`;
      const response = await axios.get(endpoint, {
        headers: this.getHeaders(),
      });
      
      return response.data as AlbumResponse;
    } catch (error: any) {
      console.error("Error getting album by UPC:", error);
      
      if (error.response?.data) {
        return error.response.data as AlbumsError;
      }
      
      return {
        success: false,
        message: "Error retrieving album",
        error: error.message || "Unknown error",
      };
    }
  }

  /**
   * Get monthly streams + revenue metrics for an album
   */
  async getAlbumMonthlyMetrics(
    upc: string,
    months: number = 12
  ): Promise<{ month: string; streams: number; revenue: number }[]> {
    try {
      if (!upc) return [];
      const endpoint = `${this.URI}/albums/${encodeURIComponent(upc)}/monthly-metrics?months=${months}`;
      const response = await axios.get(endpoint, { headers: this.getHeaders() });
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error getting album monthly metrics:", error);
      return [];
    }
  }

  /**
   * Get all albums (utility method for backward compatibility)
   * @returns Promise<Album[] | null>
   */
  async getAllAlbums(): Promise<Album[] | null> {
    try {
      const response = await this.getAlbums(0, 1000); // Get a large number of albums
      
      if (response.success && 'data' in response) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting all albums:", error);
      return null;
    }
  }
}

export default new AlbumService();
