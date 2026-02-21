import axios from "axios";

// Interfaces para la nueva implementación de splits
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
  song?: {
    id: string;
    isrc: string;
    trackTitle: string;
    artistName: string;
  };
  collaborator?: {
    id: string;
    name: string;
    email: string;
  };
  owner?: {
    id: string;
    name: string;
    email: string;
  };
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
  splits: Array<{
    collaboratorId: string;
    conditions: SplitCondition[];
  }>;
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
      };
}

interface MultipleSplitsResponse {
  success: boolean;
  message: string;
  data: {
    created: Split[];
    errors: Array<{
      collaboratorId: string;
      error: string;
    }>;
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

class SplitsService {
  private baseURL = import.meta.env.VITE_URL_API + "/api/v1/splits";
  private headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${this.getAuthToken()}`,
  };
  /**
   * Crear un nuevo split
   */
  async createSplit(data: CreateSplitRequest[]): Promise<Split[]> {
    try {
      const results: Split[] = [];
      for (const splitRequest of data) {
        const response = await axios.post(
          this.baseURL + "/collaborator",
          splitRequest,
          { headers: this.headers }
        );
        results.push(response.data);
      }
      return results;
    } catch (error) {
      console.error("Error creating split:", error);
      throw error;
    }
  }

async createOwnerSplit(data: CreateSplitOwnerRequest): Promise<Split> {
  try {
    const ownerSplitData = {
      songId: data.songId,
      conditions: data.conditions
    };

    console.log('Sending owner split data (without ownerId):', ownerSplitData);

    const response = await axios.post(`${this.baseURL}/owner`, ownerSplitData, {
      headers: this.headers
    });

    return response.data;
  } catch (error) {
    console.error('Error creating owner split:', error);
    throw error;
  }
}

  /**
   * Crear múltiples splits para una canción
   */
  async createMultipleSplits(
    data: CreateMultipleSplitsRequest
  ): Promise<MultipleSplitsResponse["data"]> {
    try {
      const response = await fetch(`${this.baseURL}/multiple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error creating multiple splits");
      }

      const result: MultipleSplitsResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating multiple splits:", error);
      throw error;
    }
  }

  /**
   * Obtener splits por canción
   */
  async getSplitsBySong(songId: string): Promise<Split[]> {
    try {
      const response = await fetch(`${this.baseURL}/song/${songId}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error fetching splits by song");
      }

      const result: SplitsResponse = await response.json();
      return result.data as Split[];
    } catch (error) {
      console.error("Error fetching splits by song:", error);
      throw error;
    }
  }

  async getSplitByOwner (ownerId: string): Promise<Split[]> {
    try {
      const response = await fetch(`${this.baseURL}/owner/${ownerId}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error fetching splits by owner");
      }

      const result: SplitsResponse = await response.json();
      return result.data as Split[];
    } catch (error) {
      console.error("Error fetching splits by owner:", error);
      throw error;
    }
  }

  /**
   * Obtener splits por colaborador
   */
  async getSplitsByCollaborator(collaboratorId: string): Promise<Split[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/collaborator/${collaboratorId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Error fetching splits by collaborator"
        );
      }

      const result: SplitsResponse = await response.json();
      return result.data as Split[];
    } catch (error) {
      console.error("Error fetching splits by collaborator:", error);
      throw error;
    }
  }

  /**
   * Obtener split por ID
   */
  async getSplitById(splitId: string): Promise<Split> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error fetching split");
      }

      const result: SplitsResponse = await response.json();
      return result.data as Split;
    } catch (error) {
      console.error("Error fetching split by ID:", error);
      throw error;
    }
  }

  /**
   * Actualizar split
   */
  async updateSplit(splitId: string, data: UpdateSplitRequest): Promise<Split> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating split");
      }

      const result: SplitsResponse = await response.json();
      return result.data as Split;
    } catch (error) {
      console.error("Error updating split:", error);
      throw error;
    }
  }

  /**
   * Eliminar split (soft delete)
   */
  async deleteSplit(splitId: string): Promise<Split> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error deleting split");
      }

      const result: SplitsResponse = await response.json();
      return result.data as Split;
    } catch (error) {
      console.error("Error deleting split:", error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de splits
   */
  async getSplitsStats(
    type: "owner" | "collaborator" = "owner"
  ): Promise<SplitsStats> {
    try {
      const response = await fetch(`${this.baseURL}/stats?type=${type}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error fetching splits stats");
      }

      const result: SplitsResponse = await response.json();
      return result.data as SplitsStats;
    } catch (error) {
      console.error("Error fetching splits stats:", error);
      throw error;
    }
  }

  /**
   * Calcular porcentaje total de splits para una canción
   */
  async calculateTotalPercentage(
    songId: string,
    excludeCollaboratorId?: string,
    additionalPercentage: number = 0
  ): Promise<number> {
    try {
      const params = new URLSearchParams();
      if (excludeCollaboratorId)
        params.append("excludeCollaboratorId", excludeCollaboratorId);
      if (additionalPercentage > 0)
        params.append("additionalPercentage", additionalPercentage.toString());

      const response = await fetch(
        `${this.baseURL}/song/${songId}/percentage?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error calculating total percentage");
      }

      const result: SplitsResponse = await response.json();
      return (result.data as { totalPercentage: number }).totalPercentage;
    } catch (error) {
      console.error("Error calculating total percentage:", error);
      throw error;
    }
  }

  /**
   * Obtener mis splits (con paginación)
   */
  async getMySplits(
    type: "owner" | "collaborator" = "owner",
    page: number = 1,
    limit: number = 10
  ): Promise<{
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
  }> {
    try {
      const params = new URLSearchParams({
        type,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${this.baseURL}/my-splits?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error fetching my splits");
      }

      const result: SplitsResponse = await response.json();
      return result.data as {
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
    } catch (error) {
      console.error("Error fetching my splits:", error);
      throw error;
    }
  }

  /**
   * Obtener token de autenticación
   */
  private getAuthToken(): string {
    return localStorage.getItem("token") || "";
  }
}

// Exportar la instancia del servicio
export const splitsService = new SplitsService();

// Exportar interfaces para uso en otros componentes
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
