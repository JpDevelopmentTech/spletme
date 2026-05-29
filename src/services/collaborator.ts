import { apiClient } from "@/infrastructure/http/axiosClient";

class CollaboratorService {
  private readonly BASE = "/collaborators";

  /** Obtiene todos los colaboradores del owner autenticado con métricas por canción */
  async getAll() {
    try {
      const response = await apiClient.get(this.BASE);
      return response.data;
    } catch {
      return null;
    }
  }

  /** Obtiene resumen general + detalle de cada colaborador del owner autenticado */
  async getMetrics() {
    try {
      const response = await apiClient.get(`${this.BASE}/metrics`);
      return response.data;
    } catch {
      return null;
    }
  }

  /** Obtiene un colaborador específico por ID */
  async getById(collaboratorId: string) {
    try {
      const response = await apiClient.get(`${this.BASE}/${collaboratorId}`);
      return response.data;
    } catch {
      return null;
    }
  }
}

export default new CollaboratorService();
