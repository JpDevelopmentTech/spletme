import { useState, useEffect, useCallback } from 'react';
import { useSplits, usePayments, useUserSplits } from './useSplits';
import { splitsService } from '../services/splits';
import type { 
  CreateSplitRequest, 
  SplitResponse, 
  PaymentRecord, 
  CalculationResponse,
  SplitsAnalytics
} from '../services/splits';

interface UseSplitsIntegrationOptions {
  songId?: string;
  userId?: string;
  autoLoad?: boolean;
}

interface UseSplitsIntegrationReturn {
  // Current split state
  split: SplitResponse | null;
  splitExists: boolean;
  
  // Loading states
  loading: boolean;
  saving: boolean;
  calculationLoading: boolean;
  
  // Error states
  error: string | null;
  
  // Split operations
  createOrUpdateSplit: (data: CreateSplitRequest) => Promise<SplitResponse | null>;
  deleteSplit: () => Promise<void>;
  duplicateSplit: (newSongId: string) => Promise<SplitResponse | null>;
  
  // Payment operations
  payments: PaymentRecord[];
  paymentLoading: boolean;
  paymentError: string | null;
  registerPayment: (paymentData: {
    amount: number;
    date?: string;
    platform?: string;
    country?: string;
  }) => Promise<PaymentRecord | null>;
  
  // Calculation operations
  calculateCurrentDistribution: (options?: {
    date?: string;
    platform?: string;
    country?: string;
    amount?: number;
  }) => Promise<CalculationResponse | null>;
  previewDistribution: (data: CreateSplitRequest, options?: {
    date?: string;
    platform?: string;
    country?: string;
    amount?: number;
  }) => Promise<CalculationResponse | null>;
  
  // User splits
  userSplits: SplitResponse[];
  userSplitsLoading: boolean;
  userSplitsError: string | null;
  
  // Analytics
  analytics: SplitsAnalytics | null;
  analyticsLoading: boolean;
  analyticsError: string | null;
  loadAnalytics: () => Promise<void>;
  
  // Utility functions
  validateSplitData: (data: CreateSplitRequest) => { isValid: boolean; errors: string[] };
  
  // Summary calculations
  getTotalEarnings: () => number;
  getAveragePayment: () => number;
  getPaymentsByPlatform: () => Record<string, number>;
  getPaymentsByCountry: () => Record<string, number>;
  
  // Clear functions
  clearError: () => void;
  clearSplit: () => void;
  refresh: () => Promise<void>;
}

export const useSplitsIntegration = (
  options: UseSplitsIntegrationOptions = {}
): UseSplitsIntegrationReturn => {
  const { songId, userId, autoLoad = true } = options;
  
  // Core hooks
  const {
    split,
    loading,
    error,
    saving,
    loadSplitBySong,
    createSplit,
    updateSplit,
    deleteSplit: deleteSplitCore,
    calculateDistribution,
    previewCalculation,
    validateSplitData,
    clearError: clearSplitError,
    clearSplit
  } = useSplits();
  
  const {
    payments,
    loading: paymentLoading,
    error: paymentError,
    loadPayments,
    registerPayment: registerPaymentCore,
    clearError: clearPaymentError
  } = usePayments();
  
  const {
    userSplits,
    loading: userSplitsLoading,
    error: userSplitsError,
    loadUserSplits,
    clearError: clearUserSplitsError
  } = useUserSplits();
  
  // Local state
  const [calculationLoading, setCalculationLoading] = useState(false);
  const [analytics, setAnalytics] = useState<SplitsAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  
  // Auto-load data when component mounts
  useEffect(() => {
    if (autoLoad) {
      if (songId) {
        loadSplitBySong(songId);
      }
      if (userId) {
        loadUserSplits(userId);
      }
    }
  }, [songId, userId, autoLoad, loadSplitBySong, loadUserSplits]);
  
  // Load payments when split is loaded
  useEffect(() => {
    if (split?.id) {
      loadPayments(split.id);
    }
  }, [split?.id, loadPayments]);
  
  // Computed values
  const splitExists = split !== null;
  
  // Split operations
  const createOrUpdateSplit = useCallback(async (data: CreateSplitRequest) => {
    let result;
    if (split?.id) {
      result = await updateSplit(split.id, data);
    } else {
      result = await createSplit(data);
    }
    return result;
  }, [split?.id, createSplit, updateSplit]);
  
  const deleteSplitWrapper = useCallback(async () => {
    if (split?.id) {
      await deleteSplitCore(split.id);
    }
  }, [split?.id, deleteSplitCore]);
  
  const duplicateSplit = useCallback(async (newSongId: string) => {
    if (split?.id) {
      try {
        const duplicatedSplit = await splitsService.duplicateSplit(split.id, newSongId);
        return duplicatedSplit;
      } catch (error) {
        console.error('Error duplicating split:', error);
        return null;
      }
    }
    return null;
  }, [split?.id]);
  
  // Payment operations
  const registerPayment = useCallback(async (paymentData: {
    amount: number;
    date?: string;
    platform?: string;
    country?: string;
  }) => {
    if (split?.id) {
      return await registerPaymentCore(split.id, paymentData);
    }
    return null;
  }, [split?.id, registerPaymentCore]);
  
  // Calculation operations
  const calculateCurrentDistribution = useCallback(async (options?: {
    date?: string;
    platform?: string;
    country?: string;
    amount?: number;
  }) => {
    if (split?.id) {
      setCalculationLoading(true);
      try {
        const result = await calculateDistribution(split.id, options);
        return result;
      } finally {
        setCalculationLoading(false);
      }
    }
    return null;
  }, [split?.id, calculateDistribution]);
  
  const previewDistribution = useCallback(async (data: CreateSplitRequest, options?: {
    date?: string;
    platform?: string;
    country?: string;
    amount?: number;
  }) => {
    setCalculationLoading(true);
    try {
      const result = await previewCalculation(data, options);
      return result;
    } finally {
      setCalculationLoading(false);
    }
  }, [previewCalculation]);
  
  // Analytics
  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    
    try {
      const analyticsData = await splitsService.getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading analytics';
      setAnalyticsError(errorMessage);
      console.error('Error loading analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);
  
  // Summary calculations
  const getTotalEarnings = useCallback(() => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);
  
  const getAveragePayment = useCallback(() => {
    const total = getTotalEarnings();
    return payments.length > 0 ? total / payments.length : 0;
  }, [payments, getTotalEarnings]);
  
  const getPaymentsByPlatform = useCallback(() => {
    return payments.reduce((acc, payment) => {
      if (payment.platform) {
        acc[payment.platform] = (acc[payment.platform] || 0) + payment.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [payments]);
  
  const getPaymentsByCountry = useCallback(() => {
    return payments.reduce((acc, payment) => {
      if (payment.country) {
        acc[payment.country] = (acc[payment.country] || 0) + payment.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [payments]);
  
  // Clear functions
  const clearError = useCallback(() => {
    clearSplitError();
    clearPaymentError();
    clearUserSplitsError();
    setAnalyticsError(null);
  }, [clearSplitError, clearPaymentError, clearUserSplitsError]);
  
  // Refresh all data
  const refresh = useCallback(async () => {
    if (songId) {
      await loadSplitBySong(songId);
    }
    if (userId) {
      await loadUserSplits(userId);
    }
    if (split?.id) {
      await loadPayments(split.id);
    }
  }, [songId, userId, split?.id, loadSplitBySong, loadUserSplits, loadPayments]);
  
  return {
    // Current split state
    split,
    splitExists,
    
    // Loading states
    loading,
    saving,
    calculationLoading,
    
    // Error states
    error,
    
    // Split operations
    createOrUpdateSplit,
    deleteSplit: deleteSplitWrapper,
    duplicateSplit,
    
    // Payment operations
    payments,
    paymentLoading,
    paymentError,
    registerPayment,
    
    // Calculation operations
    calculateCurrentDistribution,
    previewDistribution,
    
    // User splits
    userSplits,
    userSplitsLoading,
    userSplitsError,
    
    // Analytics
    analytics,
    analyticsLoading,
    analyticsError,
    loadAnalytics,
    
    // Utility functions
    validateSplitData,
    
    // Summary calculations
    getTotalEarnings,
    getAveragePayment,
    getPaymentsByPlatform,
    getPaymentsByCountry,
    
    // Clear functions
    clearError,
    clearSplit,
    refresh
  };
};

// Hook for quick split status check
export const useSplitStatus = (songId?: string) => {
  const [splitExists, setSplitExists] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (songId) {
      setLoading(true);
      splitsService.getSplitBySong(songId)
        .then(split => setSplitExists(split !== null))
        .catch(() => setSplitExists(false))
        .finally(() => setLoading(false));
    }
  }, [songId]);
  
  return { splitExists, loading };
};

// Hook for split analytics summary
export const useSplitSummary = (splitId?: string) => {
  const [summary, setSummary] = useState<{
    totalPayments: number;
    totalAmount: number;
    averageAmount: number;
    lastPaymentDate: string | null;
    platformBreakdown: Record<string, number>;
    countryBreakdown: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (splitId) {
      setLoading(true);
      splitsService.getPaymentHistory(splitId)
        .then(payments => {
          const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
          const averageAmount = payments.length > 0 ? totalAmount / payments.length : 0;
          const lastPaymentDate = payments.length > 0 
            ? payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
            : null;
          
          const platformBreakdown = payments.reduce((acc, p) => {
            if (p.platform) acc[p.platform] = (acc[p.platform] || 0) + p.amount;
            return acc;
          }, {} as Record<string, number>);
          
          const countryBreakdown = payments.reduce((acc, p) => {
            if (p.country) acc[p.country] = (acc[p.country] || 0) + p.amount;
            return acc;
          }, {} as Record<string, number>);
          
          setSummary({
            totalPayments: payments.length,
            totalAmount,
            averageAmount,
            lastPaymentDate,
            platformBreakdown,
            countryBreakdown
          });
        })
        .catch(error => {
          console.error('Error loading split summary:', error);
          setSummary(null);
        })
        .finally(() => setLoading(false));
    }
  }, [splitId]);
  
  return { summary, loading };
}; 