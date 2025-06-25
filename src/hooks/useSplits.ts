import { useState, useEffect, useCallback } from 'react';
import { 
  splitsService, 
  CreateSplitRequest, 
  SplitResponse, 
  CalculationResponse, 
  PaymentRecord,
  SplitParticipant,
  SplitCondition
} from '../services/splits';

interface UseSplitsReturn {
  // State
  split: SplitResponse | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  
  // Actions
  loadSplitBySong: (songId: string) => Promise<void>;
  createSplit: (data: CreateSplitRequest) => Promise<SplitResponse | null>;
  updateSplit: (splitId: string, data: CreateSplitRequest) => Promise<SplitResponse | null>;
  deleteSplit: (splitId: string) => Promise<void>;
  calculateDistribution: (splitId: string, options?: {
    date?: string;
    platform?: string;
    country?: string;
    amount?: number;
  }) => Promise<CalculationResponse | null>;
  previewCalculation: (data: CreateSplitRequest, options?: {
    date?: string;
    platform?: string;
    country?: string;
    amount?: number;
  }) => Promise<CalculationResponse | null>;
  
  // Utility functions
  validateSplitData: (data: CreateSplitRequest) => { isValid: boolean; errors: string[] };
  generateConditionDescription: (condition: SplitCondition) => string;
  clearError: () => void;
  clearSplit: () => void;
}

export const useSplits = (): UseSplitsReturn => {
  const [split, setSplit] = useState<SplitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSplit = useCallback(() => {
    setSplit(null);
  }, []);

  const loadSplitBySong = useCallback(async (songId: string) => {
    if (!songId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const splitData = await splitsService.getSplitBySong(songId);
      setSplit(splitData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading split';
      setError(errorMessage);
      console.error('Error loading split by song:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSplit = useCallback(async (data: CreateSplitRequest): Promise<SplitResponse | null> => {
    setSaving(true);
    setError(null);
    
    try {
      // Validate data before sending
      const validation = splitsService.validateSplitData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const newSplit = await splitsService.createSplit(data);
      setSplit(newSplit);
      return newSplit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating split';
      setError(errorMessage);
      console.error('Error creating split:', err);
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateSplit = useCallback(async (splitId: string, data: CreateSplitRequest): Promise<SplitResponse | null> => {
    setSaving(true);
    setError(null);
    
    try {
      // Validate data before sending
      const validation = splitsService.validateSplitData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const updatedSplit = await splitsService.updateSplit(splitId, data);
      setSplit(updatedSplit);
      return updatedSplit;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating split';
      setError(errorMessage);
      console.error('Error updating split:', err);
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteSplit = useCallback(async (splitId: string) => {
    setSaving(true);
    setError(null);
    
    try {
      await splitsService.deleteSplit(splitId);
      setSplit(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting split';
      setError(errorMessage);
      console.error('Error deleting split:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  const calculateDistribution = useCallback(async (
    splitId: string, 
    options?: {
      date?: string;
      platform?: string;
      country?: string;
      amount?: number;
    }
  ): Promise<CalculationResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const calculation = await splitsService.calculateDistribution(splitId, options);
      return calculation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error calculating distribution';
      setError(errorMessage);
      console.error('Error calculating distribution:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const previewCalculation = useCallback(async (
    data: CreateSplitRequest,
    options?: {
      date?: string;
      platform?: string;
      country?: string;
      amount?: number;
    }
  ): Promise<CalculationResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate data before sending
      const validation = splitsService.validateSplitData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const preview = await splitsService.previewCalculation(data, options);
      return preview;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error previewing calculation';
      setError(errorMessage);
      console.error('Error previewing calculation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateSplitData = useCallback((data: CreateSplitRequest) => {
    return splitsService.validateSplitData(data);
  }, []);

  const generateConditionDescription = useCallback((condition: SplitCondition): string => {
    switch (condition.type) {
      case 'time':
        return `${condition.percentage}% desde ${condition.parameters.startDate || 'fecha inicio'} hasta ${condition.parameters.endDate || 'fecha fin'}`;
      case 'platforms':
        return `${condition.percentage}% solo en ${condition.parameters.platforms?.join(', ') || 'plataformas seleccionadas'}`;
      case 'countries':
        return `${condition.percentage}% solo en ${condition.parameters.countries?.join(', ') || 'países seleccionados'}`;
      case 'time_reduced':
        return `${condition.percentage}% desde ${condition.parameters.startDate || 'inicio'} hasta ${condition.parameters.endDate || 'fin'}, luego ${condition.parameters.finalPercentage || 0}%`;
      case 'custom':
        return condition.parameters.text || 'Condición personalizada';
      default:
        return 'Condición sin definir';
    }
  }, []);

  return {
    // State
    split,
    loading,
    error,
    saving,
    
    // Actions
    loadSplitBySong,
    createSplit,
    updateSplit,
    deleteSplit,
    calculateDistribution,
    previewCalculation,
    
    // Utility functions
    validateSplitData,
    generateConditionDescription,
    clearError,
    clearSplit
  };
};

// Hook específico para pagos
interface UsePaymentsReturn {
  payments: PaymentRecord[];
  loading: boolean;
  error: string | null;
  
  loadPayments: (splitId: string) => Promise<void>;
  registerPayment: (splitId: string, paymentData: {
    amount: number;
    date?: string;
    platform?: string;
    country?: string;
  }) => Promise<PaymentRecord | null>;
  clearError: () => void;
}

export const usePayments = (): UsePaymentsReturn => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadPayments = useCallback(async (splitId: string) => {
    if (!splitId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const paymentHistory = await splitsService.getPaymentHistory(splitId);
      setPayments(paymentHistory);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading payments';
      setError(errorMessage);
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerPayment = useCallback(async (
    splitId: string,
    paymentData: {
      amount: number;
      date?: string;
      platform?: string;
      country?: string;
    }
  ): Promise<PaymentRecord | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newPayment = await splitsService.registerPayment(splitId, paymentData);
      setPayments(prev => [newPayment, ...prev]);
      return newPayment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error registering payment';
      setError(errorMessage);
      console.error('Error registering payment:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    payments,
    loading,
    error,
    loadPayments,
    registerPayment,
    clearError
  };
};

// Hook para estadísticas de usuario
interface UseUserSplitsReturn {
  userSplits: SplitResponse[];
  loading: boolean;
  error: string | null;
  
  loadUserSplits: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const useUserSplits = (): UseUserSplitsReturn => {
  const [userSplits, setUserSplits] = useState<SplitResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadUserSplits = useCallback(async (userId: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const splits = await splitsService.getUserSplits(userId);
      setUserSplits(splits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading user splits';
      setError(errorMessage);
      console.error('Error loading user splits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    userSplits,
    loading,
    error,
    loadUserSplits,
    clearError
  };
}; 