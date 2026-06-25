import { apiClient } from "@/infrastructure/http/axiosClient";

// ── Tipos internos del servicio ───────────────────────────────────────────────

interface SplitCondition {
  fromDate?: string;
  toDate?: string;
  percentage: number;
  selectedCountries: string[];
  countriesType: "all" | "except" | "only";
  selectedPlatforms: string[];
  platformsType: "all" | "except" | "only";
  type: "general" | "specific";
}

interface GeneralCondition {
  percentage: number;
  countriesType: "all" | "except" | "only";
  selectedCountries: string[];
  platformsType: "all" | "except" | "only";
  selectedPlatforms: string[];
}

interface Split {
  id?: string;
  songId: string;
  collaboratorId: string;
  ownerId?: string;
  generalCondition: GeneralCondition;
  splitConditions: SplitCondition[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  song?: { id: string; isrc: string; trackTitle: string; artistName: string };
  collaborator?: { id: string; name: string; email: string };
  owner?: { id: string; name: string; email: string };
}

interface CreateSplitRequest {
  songId: string;
  collaboratorId: string;
  conditions: SplitCondition[];
}

interface CreateSplitOwnerRequest {
  songId: string;
  conditions: SplitCondition[];
}

interface CreateMultipleSplitsRequest {
  songId: string;
  splits: Array<{ collaboratorId: string; conditions: SplitCondition[] }>;
}

interface UpdateSplitRequest {
  generalCondition?: GeneralCondition;
  conditions?: SplitCondition[];
  isActive?: boolean;
}

interface SplitsStats {
  totalSplits: number;
  totalPercentage: number;
  averagePercentage: number;
  splits: Split[];
}

interface SplitsResponse {
  success: boolean;
  message: string;
  data:
    | Split
    | Split[]
    | SplitsStats
    | { totalPercentage: number }
    | {
        splits: Split[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
        stats: {
          totalSplits: number;
          totalPercentage: number;
          averagePercentage: number;
        };
      }
    | { songId: string; history: Split[]; total: number };
}

interface MultipleSplitsResponse {
  success: boolean;
  message: string;
  data: {
    created: Split[];
    errors: Array<{ collaboratorId: string; error: string }>;
  };
}

interface SplitPayment {
  splitId: string;
  calculation: {
    totalOwed: number;
    totalPaidPreviously: number;
    amountToPay: number;
    songDataSnapshot: {
      totalNetIncome: number;
      releasesCount: number;
      calculatedAt: Date;
    };
  };
  paymentExecution: {
    paymentIntentId: string | null;
    amount: number | null;
    totalPaidAfterThisPayment: number;
  };
  currency: string;
  paidBy: string | null;
  paidTo: string;
  status: string;
  paymentType: string;
  previousPaymentId: string | null;
}

interface SplitCalculation {
  totalOwed: number;
  totalPaidPreviously: number;
  amountToPay: number;
  breakdown: Array<{
    releaseId: string;
    platform: string;
    country: string;
    netIncome: number;
    percentage: number;
    amount: number;
  }>;
}

// ── Servicio ──────────────────────────────────────────────────────────────────

class SplitsService {
  private readonly BASE = "/splits";

  private normalizeSplitArray(data: SplitsResponse["data"]): Split[] {
    if (Array.isArray(data)) return data as Split[];
    if (
      data &&
      typeof data === "object" &&
      "history" in data &&
      Array.isArray((data as { history?: unknown }).history)
    )
      return (data as { history: Split[] }).history;
    if (
      data &&
      typeof data === "object" &&
      "splits" in data &&
      Array.isArray((data as { splits?: unknown }).splits)
    )
      return (data as { splits: Split[] }).splits;
    return [];
  }

  /** Crea un split de colaborador para una o más canciones */
  async createSplit(data: CreateSplitRequest[]): Promise<Split[]> {
    const results: Split[] = [];
    for (const splitRequest of data) {
      const response = await apiClient.post(`${this.BASE}/collaborator`, splitRequest);
      results.push(response.data);
    }
    return results;
  }

  /** Crea el split del owner para una canción */
  async createOwnerSplit(data: CreateSplitOwnerRequest): Promise<Split> {
    const response = await apiClient.post(`${this.BASE}/owner`, {
      songId: data.songId,
      conditions: data.conditions,
    });
    return response.data;
  }

  /** Crea múltiples splits en una sola llamada */
  async createMultipleSplits(
    data: CreateMultipleSplitsRequest,
  ): Promise<MultipleSplitsResponse["data"]> {
    const response = await apiClient.post(`${this.BASE}/multiple`, data);
    return response.data.data ?? response.data;
  }

  /** Obtiene los splits de una canción */
  async getSplitsBySong(songId: string): Promise<Split[]> {
    const response = await apiClient.get<SplitsResponse>(`${this.BASE}/song/${songId}`);
    return this.normalizeSplitArray(response.data.data);
  }

  /** Obtiene el historial de splits de un usuario específico */
  // async getUserSplitHistory(userId: string): Promise<Split[]> {
  //   try {
  //     const response = await apiClient.get<SplitsResponse>(`${this.BASE}/user/${userId}/history`);
  //     return this.normalizeSplitArray(response.data.data);
  //   } catch {
  //     return [];
  //   }
  // }

  /** Obtiene el historial de splits de una canción */
  async getSongSplitHistory(songId: string): Promise<Split[]> {
    const response = await apiClient.get<SplitsResponse>(`${this.BASE}/song/${songId}/history`);
    return this.normalizeSplitArray(response.data.data);
  }

  /** Obtiene los splits de un owner */
  async getSplitByOwner(ownerId: string): Promise<Split[]> {
    const response = await apiClient.get<SplitsResponse>(`${this.BASE}/owner/${ownerId}`);
    return response.data.data as Split[];
  }

  /** Obtiene los splits de un colaborador */
  async getSplitsByCollaborator(collaboratorId: string): Promise<Split[]> {
    const response = await apiClient.get<SplitsResponse>(
      `${this.BASE}/collaborator/${collaboratorId}`,
    );
    return response.data.data as Split[];
  }

  /** Obtiene un split por ID */
  async getSplitById(splitId: string): Promise<Split> {
    const response = await apiClient.get<SplitsResponse>(`${this.BASE}/${splitId}`);
    return response.data.data as Split;
  }

  /** Actualiza un split existente */
  async updateSplit(splitId: string, data: UpdateSplitRequest): Promise<Split> {
    const response = await apiClient.put<SplitsResponse>(`${this.BASE}/${splitId}`, data);
    return response.data.data as Split;
  }

  /** Elimina un split (soft delete) */
  async deleteSplit(splitId: string): Promise<Split> {
    const response = await apiClient.delete<SplitsResponse>(`${this.BASE}/${splitId}`);
    return response.data.data as Split;
  }

  /** Obtiene estadísticas de splits */
  async getSplitsStats(type: "owner" | "collaborator" = "owner"): Promise<SplitsStats> {
    const response = await apiClient.get<SplitsResponse>(`${this.BASE}/stats?type=${type}`);
    return response.data.data as SplitsStats;
  }

  /** Calcula el porcentaje total de splits para una canción */
  async calculateTotalPercentage(
    songId: string,
    excludeCollaboratorId?: string,
    additionalPercentage = 0,
  ): Promise<number> {
    const params = new URLSearchParams();
    if (excludeCollaboratorId) params.append("excludeCollaboratorId", excludeCollaboratorId);
    if (additionalPercentage > 0)
      params.append("additionalPercentage", additionalPercentage.toString());
    const response = await apiClient.get<SplitsResponse>(
      `${this.BASE}/song/${songId}/percentage?${params}`,
    );
    return (response.data.data as { totalPercentage: number }).totalPercentage;
  }

  /** Obtiene los splits propios con paginación */
  async getMySplits(type: "owner" | "collaborator" = "owner", page = 1, limit = 10) {
    const response = await apiClient.get<SplitsResponse>(
      `${this.BASE}/my-splits?${new URLSearchParams({ type, page: String(page), limit: String(limit) })}`,
    );
    return response.data.data as {
      splits: Split[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
      stats: {
        totalSplits: number;
        totalPercentage: number;
        averagePercentage: number;
      };
    };
  }
}

export const splitsService = new SplitsService();

export type {
  Split,
  SplitCondition,
  GeneralCondition,
  CreateSplitRequest,
  CreateSplitOwnerRequest,
  CreateMultipleSplitsRequest,
  UpdateSplitRequest,
  SplitsStats,
  SplitsResponse,
  MultipleSplitsResponse,
  SplitPayment,
  SplitCalculation,
};
