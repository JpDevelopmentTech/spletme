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

/** Estado de una carga que el servidor procesa en segundo plano. */
export interface UploadStatus {
  uploadId: string;
  status: "processing" | "done" | "error";
  /** Avance de la lectura del archivo, 0-100. */
  progress: number;
  processedRows: number;
  songsProcessed: number;
  totalStreams: number;
  totalGrossIncome: number;
  totalNetIncome: number;
  rejected: RejectedSong[];
  rejectedCount: number;
  errorMessage: string | null;
}

/** Cada cuánto se pregunta al servidor por el avance de una carga. */
const UPLOAD_POLL_INTERVAL_MS = 1500;

/** Tope defensivo para no sondear indefinidamente si algo va muy mal. */
const UPLOAD_POLL_TIMEOUT_MS = 2 * 60 * 60 * 1000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  /** Estado y avance de una carga en curso o terminada. */
  getUploadStatus(distributorId: string, uploadId: string): Promise<UploadStatus> {
    return apiClient
      .get(`/distributors/${distributorId}/uploads/${uploadId}/status`)
      .then((r) => r.data.data);
  },

  /**
   * Sube un archivo asociándolo a un rango de meses de un año.
   *
   * El servidor responde 202 en cuanto registra la carga y procesa el archivo en
   * segundo plano, así que esta función sondea el estado hasta que termina. De
   * cara a quien la llama, el contrato no cambia: sigue resolviendo con el
   * resultado final o lanzando si la ingesta falla.
   *
   * @param period               - { startMonth, endMonth, year }, con los meses de 1 a 12.
   * @param onUploadProgress     - Avance de la transferencia del archivo (0-100).
   * @param onProcessingProgress - Avance del procesamiento en el servidor.
   */
  async uploadSongs(
    distributorId: string,
    file: File,
    period: UploadPeriodPayload,
    onUploadProgress?: (percent: number) => void,
    onProcessingProgress?: (status: UploadStatus) => void,
  ): Promise<UploadSongsResult> {
    const form = new FormData();
    form.append("csvFile", file);
    form.append("startMonth", String(period.startMonth));
    form.append("endMonth", String(period.endMonth));
    form.append("year", String(period.year));

    const accepted = await apiClient
      .post(`/distributors/${distributorId}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (!onUploadProgress) return;
          const total = e.total ?? 0;
          const percent = total > 0 ? Math.round((e.loaded / total) * 100) : 0;
          onUploadProgress(percent);
        },
      })
      .then((r) => r.data.data as { uploadId: string; status: string });

    const deadline = Date.now() + UPLOAD_POLL_TIMEOUT_MS;

    for (;;) {
      await wait(UPLOAD_POLL_INTERVAL_MS);

      const status = await distributorsService.getUploadStatus(distributorId, accepted.uploadId);
      onProcessingProgress?.(status);

      if (status.status === "error") {
        throw new Error(status.errorMessage || "No se pudo procesar el archivo");
      }

      if (status.status === "done") {
        return {
          uploadId: status.uploadId,
          songsProcessed: status.songsProcessed,
          rejected: status.rejected,
          rejectedCount: status.rejectedCount,
        };
      }

      if (Date.now() > deadline) {
        throw new Error(
          "El procesamiento está tardando más de lo previsto. Revisa el historial de cargas del distribuidor en unos minutos.",
        );
      }
    }
  },

  getKpis(): Promise<DistributorKpi[]> {
    return apiClient.get("/distributors/kpis").then((r) => r.data.data);
  },

  getDashboard(distributorId: string): Promise<DistributorDashboard> {
    return apiClient.get(`/distributors/${distributorId}/dashboard`).then((r) => r.data.data);
  },
};
