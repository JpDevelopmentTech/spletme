import { apiClient } from "../infrastructure/http/axiosClient";
import type {
  Distributor,
  DistributorUpload,
  DistributorKpi,
  DistributorDashboard,
  CreateDistributorPayload,
  UploadPeriodPayload,
} from "../types/distributor.types";

export interface RejectedSong {
  isrc: string;
  trackTitle: string;
  artistName: string;
  upc: string;
}

export interface UploadSongsResult {
  uploadId: string;
  songsProcessed: number;
  rejected: RejectedSong[];
  rejectedCount: number;
}

export const distributorsService = {
  getAll(): Promise<Distributor[]> {
    return apiClient.get("/distributors").then((r) => r.data.data);
  },

  getById(id: string): Promise<Distributor> {
    return apiClient.get(`/distributors/${id}`).then((r) => r.data.data);
  },

  create(payload: CreateDistributorPayload): Promise<Distributor> {
    return apiClient.post("/distributors", payload).then((r) => r.data.data);
  },

  update(id: string, payload: Partial<CreateDistributorPayload>): Promise<Distributor> {
    return apiClient.put(`/distributors/${id}`, payload).then((r) => r.data.data);
  },

  remove(id: string): Promise<void> {
    return apiClient.delete(`/distributors/${id}`).then(() => undefined);
  },

  getUploads(distributorId: string): Promise<DistributorUpload[]> {
    return apiClient.get(`/distributors/${distributorId}/uploads`).then((r) => r.data.data);
  },

  /**
   * Sube un archivo asociándolo a un rango de meses de un año.
   *
   * @param period - { startMonth, endMonth, year }, con los meses de 1 a 12.
   */
  uploadSongs(
    distributorId: string,
    file: File,
    period: UploadPeriodPayload,
    onUploadProgress?: (percent: number) => void,
  ): Promise<UploadSongsResult> {
    const form = new FormData();
    form.append("csvFile", file);
    form.append("startMonth", String(period.startMonth));
    form.append("endMonth", String(period.endMonth));
    form.append("year", String(period.year));
    return apiClient
      .post(`/distributors/${distributorId}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (!onUploadProgress) return;
          const total = e.total ?? 0;
          const percent = total > 0 ? Math.round((e.loaded / total) * 100) : 0;
          onUploadProgress(percent);
        },
      })
      .then((r) => r.data.data);
  },

  getKpis(): Promise<DistributorKpi[]> {
    return apiClient.get("/distributors/kpis").then((r) => r.data.data);
  },

  getDashboard(distributorId: string): Promise<DistributorDashboard> {
    return apiClient.get(`/distributors/${distributorId}/dashboard`).then((r) => r.data.data);
  },
};
