interface SplitCondition {
  id?: string;
  type: 'time' | 'platforms' | 'countries' | 'time_reduced' | 'custom';
  percentage: number;
  description: string;
  parameters: {
    startDate?: string;
    endDate?: string;
    platforms?: string[];
    countries?: string[];
    finalPercentage?: number;
    text?: string;
  };
}

interface SplitParticipant {
  id?: string;
  name: string;
  role: string;
  percentage: number;
  conditions: SplitCondition[];
}

interface SplitOwner {
  name: string;
  role: string;
  percentage: number;
}

interface CreateSplitRequest {
  songId: string;
  owner: SplitOwner;
  splits: SplitParticipant[];
}

interface SplitResponse {
  id: string;
  songId: string;
  ownerId: string;
  ownerPercentage: number;
  totalPercentage: number;
  status: 'draft' | 'active' | 'expired';
  createdAt: string;
  updatedAt: string;
  owner: SplitOwner;
  participants: SplitParticipant[];
}

interface CalculationResponse {
  owner: {
    name: string;
    percentage: number;
    amount: number;
  };
  participants: Array<{
    name: string;
    percentage: number;
    amount: number;
    appliedConditions: string[];
  }>;
  totalAmount: number;
  calculationDate: string;
  filters: {
    platform?: string;
    country?: string;
  };
}

interface PaymentRecord {
  id: string;
  splitId: string;
  amount: number;
  date: string;
  platform?: string;
  country?: string;
  distribution: CalculationResponse;
}

interface SplitsAnalytics {
  totalSplits: number;
  activeSplits: number;
  totalParticipants: number;
  totalPayments: number;
  totalAmount: number;
  averageParticipantsPerSplit: number;
  mostUsedPlatforms: Array<{ platform: string; count: number }>;
  mostUsedCountries: Array<{ country: string; count: number }>;
  recentActivity: Array<{
    type: 'split_created' | 'payment_registered' | 'split_updated';
    date: string;
    description: string;
  }>;
}

class SplitsService {
  private baseURL = import.meta.env.VITE_URL_API + '/api/v1/splits';

  // Create or update a split
  async createSplit(data: CreateSplitRequest): Promise<SplitResponse> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creating split');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating split:', error);
      throw error;
    }
  }

  // Update an existing split
  async updateSplit(splitId: string, data: CreateSplitRequest): Promise<SplitResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error updating split');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating split:', error);
      throw error;
    }
  }

  // Get split by song ID
  async getSplitBySong(songId: string): Promise<SplitResponse | null> {
    try {
      const response = await fetch(`${this.baseURL}/song/${songId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching split');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching split by song:', error);
      throw error;
    }
  }

  // Get split by ID
  async getSplit(splitId: string): Promise<SplitResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching split');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching split:', error);
      throw error;
    }
  }

  // Calculate current distribution
  async calculateDistribution(
    splitId: string,
    options?: {
      date?: string;
      platform?: string;
      country?: string;
      amount?: number;
    }
  ): Promise<CalculationResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.date) params.append('date', options.date);
      if (options?.platform) params.append('platform', options.platform);
      if (options?.country) params.append('country', options.country);
      if (options?.amount) params.append('amount', options.amount.toString());

      const url = `${this.baseURL}/${splitId}/calculate${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error calculating distribution');
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating distribution:', error);
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(splitId: string): Promise<PaymentRecord[]> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}/payments`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching payment history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  // Register a payment
  async registerPayment(
    splitId: string,
    paymentData: {
      amount: number;
      date?: string;
      platform?: string;
      country?: string;
    }
  ): Promise<PaymentRecord> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...paymentData,
          date: paymentData.date || new Date().toISOString()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error registering payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering payment:', error);
      throw error;
    }
  }

  // Get splits where user participates
  async getUserSplits(userId: string): Promise<SplitResponse[]> {
    try {
      const response = await fetch(`${this.baseURL}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching user splits');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user splits:', error);
      throw error;
    }
  }

  // Preview calculation without saving
  async previewCalculation(
    splitData: CreateSplitRequest,
    options?: {
      date?: string;
      platform?: string;
      country?: string;
      amount?: number;
    }
  ): Promise<CalculationResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.date) params.append('date', options.date);
      if (options?.platform) params.append('platform', options.platform);
      if (options?.country) params.append('country', options.country);
      if (options?.amount) params.append('amount', options.amount.toString());

      const url = `${this.baseURL}/preview${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(splitData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error previewing calculation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error previewing calculation:', error);
      throw error;
    }
  }

  // Duplicate split for new song
  async duplicateSplit(splitId: string, newSongId: string): Promise<SplitResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ songId: newSongId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error duplicating split');
      }

      return await response.json();
    } catch (error) {
      console.error('Error duplicating split:', error);
      throw error;
    }
  }

  // Delete split (soft delete)
  async deleteSplit(splitId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/${splitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error deleting split');
      }
    } catch (error) {
      console.error('Error deleting split:', error);
      throw error;
    }
  }

  // Get analytics/statistics
  async getAnalytics(): Promise<SplitsAnalytics> {
    try {
      const response = await fetch(`${this.baseURL}/../analytics/splits`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error fetching analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Helper method to get auth token
  private getAuthToken(): string {
    // Get token from localStorage or your auth system
    return localStorage.getItem('authToken') || '';
  }

  // Validate split data before sending
  validateSplitData(data: CreateSplitRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if percentages sum to 100
    const totalPercentage = data.owner.percentage + 
      data.splits.reduce((sum, participant) => sum + participant.percentage, 0);

    if (totalPercentage !== 100) {
      errors.push(`Los porcentajes deben sumar exactamente 100% (actual: ${totalPercentage}%)`);
    }

    // Validate owner percentage
    if (data.owner.percentage <= 0 || data.owner.percentage > 100) {
      errors.push('El porcentaje del dueño debe estar entre 1 y 100');
    }

    // Validate participants
    data.splits.forEach((participant, index) => {
      if (participant.percentage <= 0 || participant.percentage > 100) {
        errors.push(`El porcentaje del participante ${index + 1} debe estar entre 1 y 100`);
      }

      if (!participant.name.trim()) {
        errors.push(`El nombre del participante ${index + 1} es requerido`);
      }

      // Validate conditions
      participant.conditions.forEach((condition, condIndex) => {
        if (condition.percentage < 0 || condition.percentage > participant.percentage) {
          errors.push(`El porcentaje de la condición ${condIndex + 1} del participante ${index + 1} no puede ser mayor al porcentaje base`);
        }

        // Validate time conditions
        if (condition.type === 'time' || condition.type === 'time_reduced') {
          if (!condition.parameters.startDate || !condition.parameters.endDate) {
            errors.push(`Las fechas son requeridas para la condición de tiempo del participante ${index + 1}`);
          } else if (new Date(condition.parameters.startDate) >= new Date(condition.parameters.endDate)) {
            errors.push(`La fecha de inicio debe ser anterior a la fecha de fin en la condición del participante ${index + 1}`);
          }
        }

        // Validate platform conditions
        if (condition.type === 'platforms' && (!condition.parameters.platforms || condition.parameters.platforms.length === 0)) {
          errors.push(`Debe seleccionar al menos una plataforma para la condición del participante ${index + 1}`);
        }

        // Validate country conditions
        if (condition.type === 'countries' && (!condition.parameters.countries || condition.parameters.countries.length === 0)) {
          errors.push(`Debe seleccionar al menos un país para la condición del participante ${index + 1}`);
        }

        // Validate custom conditions
        if (condition.type === 'custom' && !condition.parameters.text?.trim()) {
          errors.push(`Debe describir la condición personalizada del participante ${index + 1}`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const splitsService = new SplitsService();
export type { 
  SplitCondition, 
  SplitParticipant, 
  SplitOwner, 
  CreateSplitRequest, 
  SplitResponse, 
  CalculationResponse, 
  PaymentRecord,
  SplitsAnalytics
}; 