import axios from "axios";

export interface Label {
  label: string;
  count: number;
  totalStreams: number;
  totalGrossIncome: number;
  totalNetIncome: number;
  topSongs: Array<{
    _id: string;
    trackTitle: string;
    artistName: string;
    isrc: string;
  }>;
  splitProgress: {
    total: number;
    withSplits: number;
    percentage: number;
    hasAllSplits: boolean;
  };
}

export interface LabelSong {
  _id: string;
  isrc: string;
  upc: string;
  trackTitle: string;
  artistName: string;
  artisticLabel: string;
  releaseTitle: string;
  totalStreams: number;
  totalGrossIncome: number;
  totalNetIncome: number;
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  collaborators: any[];
  releases: any[];
  spotifyData?: any;
  paymentInfo?: {
    totalIncome: number;
    totalPaid: number;
    pendingAmount: number;
    paymentCount: number;
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
  };
}

class LabelsService {
  private readonly URI = import.meta.env.VITE_URL_API + "/api/v1/labels";

  private getAuthToken() {
    return localStorage.getItem("token");
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.getAuthToken()}`,
    };
  }

  /**
   * Obtiene todos los labels del usuario
   */
  async getLabels(): Promise<{
    error: boolean;
    data?: Label[];
    message?: string;
  }> {
    try {
      const response = await axios.get(this.URI, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting labels:", error);
      return { error: true, message: "Error getting labels" };
    }
  }

  /**
   * Obtiene todas las canciones de un label específico
   */
  async getSongsByLabel(
    label: string
  ): Promise<{ error: boolean; data?: LabelSong[]; message?: string }> {
    try {
      const response = await axios.get(`${this.URI}/${encodeURIComponent(label)}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting songs by label:", error);
      return { error: true, message: "Error getting songs by label" };
    }
  }
}

export default new LabelsService();

