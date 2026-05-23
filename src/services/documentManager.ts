import { apiClient } from "@/infrastructure/http/axiosClient";
import type { Document, DocumentResponse, DownloadResponse, DeleteResponse } from "@/types/documentManager.types";

class DocumentManagerService {
  private readonly BASE = "/documents";

  /**
   * Obtiene todos los documentos de una canción
   */
  async getBySongId(songId: string): Promise<DocumentResponse> {
    try {
      if (!songId) {
        return { success: false, message: "Song ID is required" };
      }
      const response = await apiClient.get(`${this.BASE}/song/${songId}`);
      
      const apiResponse = response.data as any;
      
      // El backend devuelve { message: "...", data: [...] } sin campo success
      // Asumir éxito si hay data o si error es false
      const isSuccess = !apiResponse.error && (apiResponse.data || apiResponse.message);
      
      if (isSuccess) {
        let dataArray: Document[] = [];
        
        if (apiResponse.data) {
          if (Array.isArray(apiResponse.data)) {
            dataArray = apiResponse.data;
          } else if (typeof apiResponse.data === 'object') {
            dataArray = [apiResponse.data];
          }
        } else if (apiResponse.documents && Array.isArray(apiResponse.documents)) {
          dataArray = apiResponse.documents;
        }
        
        return { 
          success: true, 
          data: dataArray,
          message: apiResponse.message,
          pagination: apiResponse.pagination
        };
      }
      
      // Si no es exitosa, devolver error
      return {
        success: false,
        message: apiResponse.message || "Failed to fetch documents",
        error: apiResponse.error
      };
    } catch (error: unknown) {
      const axErr = error as { response?: { data?: DocumentResponse }; message?: string };
      if (axErr.response?.data) return axErr.response.data;
      return { 
        success: false, 
        message: "Error retrieving documents", 
        error: axErr.message ?? "Unknown error" 
      };
    }
  }

  /**
   * Obtiene un documento específico por ID
   */
  async getById(documentId: string): Promise<DocumentResponse> {
    try {
      if (!documentId) {
        return { success: false, message: "Document ID is required" };
      }
      const response = await apiClient.get(`${this.BASE}/${documentId}`);
      const apiResponse = response.data as any;
      
      const isSuccess = !apiResponse.error && (apiResponse.data || apiResponse.message);
      
      if (isSuccess && apiResponse.data) {
        return {
          success: true,
          data: apiResponse.data,
          message: apiResponse.message
        };
      }
      
      return {
        success: false,
        message: apiResponse.message || "Error retrieving document",
        error: apiResponse.error
      };
    } catch (error: unknown) {
      const axErr = error as { response?: { data?: DocumentResponse }; message?: string };
      if (axErr.response?.data) return axErr.response.data;
      return { 
        success: false, 
        message: "Error retrieving document", 
        error: axErr.message ?? "Unknown error" 
      };
    }
  }

  /**
   * Descarga un documento (obtiene la URL de descarga)
   */
  async download(documentId: string): Promise<DownloadResponse> {
    try {
      if (!documentId) {
        return { success: false, message: "Document ID is required" };
      }
      const response = await apiClient.get(`${this.BASE}/${documentId}/download`);
      const apiResponse = response.data as any;
      
      const isSuccess = !apiResponse.error && (apiResponse.url || apiResponse.message);
      
      if (isSuccess) {
        return {
          success: true,
          url: apiResponse.url,
          name: apiResponse.name,
          type: apiResponse.type,
          message: apiResponse.message
        };
      }
      
      return {
        success: false,
        message: apiResponse.message || "Error getting download URL",
        error: apiResponse.error
      };
    } catch (error: unknown) {
      const axErr = error as { response?: { data?: DownloadResponse }; message?: string };
      if (axErr.response?.data) return axErr.response.data;
      return { 
        success: false, 
        message: "Error getting download URL", 
        error: axErr.message ?? "Unknown error" 
      };
    }
  }

  /**
   * Sube un documento nuevo
   */
  async upload(songId: string, file: File): Promise<DocumentResponse> {
    try {
      if (!songId || !file) {
        return { success: false, message: "Song ID and file are required" };
      }
      
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(`${this.BASE}/song/${songId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      const apiResponse = response.data as any;
      const isSuccess = !apiResponse.error && (apiResponse.data || apiResponse.message);
      
      if (isSuccess) {
        let dataArray: Document[] = [];
        
        if (apiResponse.data) {
          if (Array.isArray(apiResponse.data)) {
            dataArray = apiResponse.data;
          } else if (typeof apiResponse.data === 'object') {
            dataArray = [apiResponse.data];
          }
        }
        
        return {
          success: true,
          data: dataArray.length > 0 ? dataArray : [apiResponse.data],
          message: apiResponse.message
        };
      }
      
      return {
        success: false,
        message: apiResponse.message || "Error uploading document",
        error: apiResponse.error
      };
    } catch (error: unknown) {
      const axErr = error as { response?: { data?: DocumentResponse }; message?: string };
      if (axErr.response?.data) return axErr.response.data;
      return { 
        success: false, 
        message: "Error uploading document", 
        error: axErr.message ?? "Unknown error" 
      };
    }
  }

  /**
   * Elimina un documento
   */
  async delete(documentId: string): Promise<DeleteResponse> {
    try {
      if (!documentId) {
        return { success: false, message: "Document ID is required" };
      }
      const response = await apiClient.delete(`${this.BASE}/${documentId}`);
      const apiResponse = response.data as any;
      
      const isSuccess = !apiResponse.error && (apiResponse.deleted || apiResponse.message);
      
      if (isSuccess) {
        return {
          success: true,
          deleted: apiResponse.deleted ?? true,
          message: apiResponse.message
        };
      }
      
      return {
        success: false,
        message: apiResponse.message || "Error deleting document",
        error: apiResponse.error
      };
    } catch (error: unknown) {
      const axErr = error as { response?: { data?: DeleteResponse }; message?: string };
      if (axErr.response?.data) return axErr.response.data;
      return { 
        success: false, 
        message: "Error deleting document", 
        error: axErr.message ?? "Unknown error" 
      };
    }
  }
}

export default new DocumentManagerService();
