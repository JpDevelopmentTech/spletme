import { useState, useCallback } from 'react';
import PaymentsService, { Payment } from '../services/payments';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadPayments = useCallback(async (collaboratorId?: string) => {
    try {
      setLoading(true);
      setError('');

      let response;
      if (collaboratorId) {
        response = await PaymentsService.getPaymentsByCollaborator(collaboratorId);
      } else {
        response = await PaymentsService.getPayments();
      }

      if (response.error) {
        setError(response.message || 'Error al cargar los pagos');
        setPayments([]);
      } else {
        setPayments(response.data || []);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (idCollaborator: string, amount: number, description: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await PaymentsService.createPayment(idCollaborator, amount, description);
      
      if (response.error) {
        setError(response.message || 'Error al crear el pago');
        return { success: false, error: response.message };
      }

      // Recargar la lista de pagos después de crear uno nuevo
      await loadPayments();
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = 'Error al crear el pago';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadPayments]);

  const refreshPayments = useCallback(() => {
    loadPayments();
  }, [loadPayments]);

  const getTotalAmount = useCallback(() => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  }, [payments]);

  const getPaymentsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }, [payments]);

  return {
    payments,
    loading,
    error,
    loadPayments,
    createPayment,
    refreshPayments,
    getTotalAmount,
    getPaymentsByDateRange
  };
}; 