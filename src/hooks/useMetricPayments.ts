import { useEffect, useState } from 'react';
import SongService from '../services/songs';

interface MetricPaymentsItem {
  name: string;
  totalNetIncome: number;
  totalStreams?: number;
}

type MetricPaymentsData = MetricPaymentsItem[];

const useMetricPayments = (songId?: string, date: 'month' | 'day' | 'year' = 'month') => {
  const [metricsData, setMetricsData] = useState<MetricPaymentsData>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMetricPayments = async (id: string, dateType: 'month' | 'day' | 'year') => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await SongService.getMetricPayments(id, dateType);
      if (response && response.data) {
        setMetricsData(response.data);
      }
    } catch (error) {
      console.error('Error getting metric payments:', error);
      setError('Error al obtener las métricas de pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (songId) {
      getMetricPayments(songId, date);
    }
  }, [songId, date]);

  return {
    metricsData,
    loading,
    error,
    refetch: () => songId && getMetricPayments(songId, date),
  };
};

export default useMetricPayments;
