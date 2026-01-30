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
  isCustom?: boolean; // Para diferenciar labels personalizados
}

export interface CustomLabel {
  _id: string;
  name: string;
  artisticLabels: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalSongs: number;
    totalStreams: number;
    totalGrossIncome: number;
    totalNetIncome: number;
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
  ownerSplit: {
    _id: string;
      conditions: Array<{
        type: string;
        percentage: number;
      }>;
  };
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
      // Agregar timestamp para evitar caché del navegador
      const response = await axios.get(`${this.URI}?t=${Date.now()}`, {
        headers: {
          ...this.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
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

  /**
   * Crea un nuevo label personalizado
   */
  async createLabel(data: {
    name: string;
    artisticLabels: string[];
  }): Promise<{
    error: boolean;
    data?: {
      label: {
        _id: string;
        name: string;
        artisticLabels: string[];
        ownerId: string;
        createdAt: string;
        updatedAt: string;
      };
      stats: {
        totalSongs: number;
        totalStreams: number;
        totalGrossIncome: number;
        totalNetIncome: number;
      };
      warnings?: {
        message: string;
        excludedLabels: string[];
      };
    };
    message?: string;
  }> {
    try {
      const response = await axios.post(`${this.URI}/create-label`, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating label:", error);
      return { 
        error: true, 
        message: error.response?.data?.message || "Error creating label" 
      };
    }
  }

  /**
   * Obtiene los labels personalizados creados por el usuario
   */
  async getCustomLabels(): Promise<{
    error: boolean;
    data?: CustomLabel[];
    message?: string;
  }> {
    try {
      const response = await axios.get(`${this.URI}/custom`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting custom labels:", error);
      return { error: true, message: "Error getting custom labels", data: [] };
    }
  }

  /**
   * Obtiene las canciones de un label personalizado
   */
  async getSongsByCustomLabel(labelName: string): Promise<{
    error: boolean;
    data?: {
      customLabel: {
        _id: string;
        name: string;
        artisticLabels: string[];
        createdAt: string;
      };
      songs: LabelSong[];
    };
    message?: string;
  }> {
    try {
      const response = await axios.get(
        `${this.URI}/custom/${encodeURIComponent(labelName)}`,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting songs by custom label:", error);
      return { error: true, message: "Error getting songs by custom label" };
    }
  }

  /**
   * Crea splits para todas las canciones de un label personalizado
   */
  async createSplitByCustomLabel(data: {
    labelName: string;
    conditions: Array<{
      type: 'specific' | 'general';
      percentage: number;
      description?: string;
      parameters?: {
        countries?: string[];
        platforms?: string[];
        platformsType?: 'streaming' | 'download' | 'all';
        dateRange?: {
          start?: string;
          end?: string;
        };
      };
    }>;
  }): Promise<{
    error: boolean;
    data?: {
      customLabel: {
        name: string;
        artisticLabels: string[];
      };
      successful: Array<{
        songId: string;
        trackTitle: string;
        artistName: string;
        isrc: string;
        artisticLabel: string;
        splitId: string;
        status: 'created' | 'updated';
        calculation: {
          totalOwed: number;
          releaseCount: number;
        };
      }>;
      failed: Array<{
        songId: string;
        trackTitle: string;
        artisticLabel: string;
        reason: string;
        status: 'error';
      }>;
      summary: {
        total: number;
        created: number;
        updated: number;
        skipped: number;
        errors: number;
      };
    };
    message?: string;
  }> {
    try {
      const response = await axios.post(
        `${this.URI}/create-split-by-custom-label`,
        data,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating split by custom label:", error);
      return {
        error: true,
        message: error.response?.data?.message || "Error creating split by custom label",
      };
    }
  }

  /**
   * Actualiza un label personalizado
   */
  async updateLabel(labelId: string, data: {
    name?: string;
    artisticLabels?: string[];
  }): Promise<{
    error: boolean;
    data?: {
      label: {
        _id: string;
        name: string;
        artisticLabels: string[];
        ownerId: string;
        createdAt: string;
        updatedAt: string;
      };
      stats: {
        totalSongs: number;
        totalStreams: number;
        totalGrossIncome: number;
        totalNetIncome: number;
      };
      warnings?: {
        message: string;
        excludedLabels: string[];
      } | null;
    };
    message?: string;
  }> {
    try {
      const response = await axios.put(`${this.URI}/custom/${labelId}`, data, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating label:", error);
      return { 
        error: true, 
        message: error.response?.data?.message || "Error updating label" 
      };
    }
  }

  /**
   * Elimina un label personalizado
   */
  async deleteLabel(labelId: string): Promise<{
    error: boolean;
    message?: string;
  }> {
    try {
      const response = await axios.delete(`${this.URI}/custom/${labelId}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error deleting label:", error);
      return { 
        error: true, 
        message: error.response?.data?.message || "Error deleting label" 
      };
    }
  }

  // ========== INVITACIONES DE COLABORADORES A LABELS ==========

  /**
   * Invita a un colaborador a un label por email
   * Al aceptar, el colaborador será agregado a todas las canciones del label (sin crear splits)
   */
  async inviteCollaboratorToLabel(data: {
    labelType: 'artistic' | 'custom';
    labelIdentifier: string;
    collaboratorEmail: string;
  }): Promise<{
    error: boolean;
    data?: {
      _id: string;
      labelType: string;
      labelName: string;
      collaboratorId: string;
      collaboratorName: string;
      collaboratorEmail: string;
      status: string;
      totalSongs: number;
      expiresAt: string;
    };
    message?: string;
  }> {
    try {
      const response = await axios.post(
        `${this.URI}/invite-collaborator`,
        data,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error inviting collaborator to label:", error);
      return {
        error: true,
        message: error.response?.data?.message || "Error inviting collaborator",
      };
    }
  }

  /**
   * Acepta una invitación a un label
   */
  async acceptLabelInvitation(token: string): Promise<{
    error: boolean;
    data?: {
      labelName: string;
      labelType: string;
      results: {
        successful: Array<{
          songId: string;
          trackTitle: string;
          artistName: string;
          artisticLabel: string;
        }>;
        alreadyCollaborator: Array<{
          songId: string;
          trackTitle: string;
          artistName: string;
          artisticLabel: string;
        }>;
        failed: Array<{
          songId: string;
          trackTitle: string;
          artisticLabel: string;
          reason: string;
        }>;
        summary: {
          total: number;
          added: number;
          alreadyExists: number;
          errors: number;
        };
      };
    };
    message?: string;
  }> {
    try {
      const response = await axios.post(
        `${this.URI}/accept-invitation`,
        { token },
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error accepting label invitation:", error);
      return {
        error: true,
        message: error.response?.data?.message || "Error accepting invitation",
      };
    }
  }

  /**
   * Rechaza una invitación a un label
   */
  async rejectLabelInvitation(token: string): Promise<{
    error: boolean;
    message?: string;
  }> {
    try {
      const response = await axios.post(
        `${this.URI}/reject-invitation`,
        { token },
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error rejecting label invitation:", error);
      return {
        error: true,
        message: error.response?.data?.message || "Error rejecting invitation",
      };
    }
  }

  /**
   * Obtiene las invitaciones pendientes (como colaborador)
   */
  async getPendingInvitations(): Promise<{
    error: boolean;
    data?: Array<{
      _id: string;
      labelType: string;
      labelIdentifier: string;
      labelName: string;
      ownerId: {
        _id: string;
        name: string;
        email: string;
      };
      conditions: Array<{
        type: string;
        percentage: number;
      }>;
      status: string;
      songsInfo: {
        totalSongs: number;
      };
      expiresAt: string;
      createdAt: string;
    }>;
    message?: string;
  }> {
    try {
      const response = await axios.get(`${this.URI}/invitations/pending`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error getting pending invitations:", error);
      return {
        error: true,
        message: error.response?.data?.message || "Error getting invitations",
        data: [],
      };
    }
  }

  /**
   * Obtiene las invitaciones enviadas (como owner)
   */
  async getSentInvitations(): Promise<{
    error: boolean;
    data?: Array<{
      _id: string;
      labelType: string;
      labelIdentifier: string;
      labelName: string;
      collaboratorId: {
        _id: string;
        name: string;
        email: string;
      };
      conditions: Array<{
        type: string;
        percentage: number;
      }>;
      status: string;
      songsInfo: {
        totalSongs: number;
      };
      expiresAt: string;
      createdAt: string;
      acceptanceResult?: {
        processedAt: string;
        summary: {
          total: number;
          created: number;
          updated: number;
          errors: number;
        };
      };
    }>;
    message?: string;
  }> {
    try {
      const response = await axios.get(`${this.URI}/invitations/sent`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error getting sent invitations:", error);
      return {
        error: true,
        message: error.response?.data?.message || "Error getting invitations",
        data: [],
      };
    }
  }

  /**
   * Cancela una invitación (como owner)
   */
  async cancelInvitation(invitationId: string): Promise<{
    error: boolean;
    message?: string;
  }> {
    try {
      const response = await axios.delete(
        `${this.URI}/invitations/${invitationId}/cancel`,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error canceling invitation:", error);
      return {
        error: true,
        message: error.response?.data?.message || "Error canceling invitation",
      };
    }
  }

  /**
   * Rechaza una invitación (como colaborador)
   */
  async rejectInvitation(invitationId: string): Promise<{
    error: boolean;
    message?: string;
  }> {
    try {
      const response = await axios.post(
        `${this.URI}/invitations/${invitationId}/reject`,
        {},
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error rejecting invitation:", error);
      return {
        error: true,
        message: error.response?.data?.message || "Error rejecting invitation",
      };
    }
  }
}

export default new LabelsService();

