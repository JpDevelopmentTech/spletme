import { useState, useEffect } from "react";
import { PayoneerService } from "../services/payoneer";
import { PaymentRequest, PaymentHistory, PayoneerAccount } from "../models/user";

export const usePayoneer = () => {
  const [account, setAccount] = useState<PayoneerAccount | null>(null);
  const [balance, setBalance] = useState<{ amount: number; currency: string }[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [accountData, balanceData, historyData, requestsData] = await Promise.all([
        PayoneerService.getPayoneerAccount(),
        PayoneerService.getBalance(),
        PayoneerService.getPaymentHistory(),
        PayoneerService.getPendingRequests(),
      ]);

      setAccount(accountData);
      setBalance(balanceData);
      setPaymentHistory(historyData);
      setPendingRequests(requestsData);
    } catch (error) {
      setError("Error loading Payoneer data");
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const linkAccount = async (payoneerEmail: string, payoneerAccountId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PayoneerService.linkPayoneerAccount({
        payoneerEmail,
        payoneerAccountId,
      });

      // Recargar datos de la cuenta después de vincular
      const accountData = await PayoneerService.getPayoneerAccount();
      setAccount(accountData);

      return result;
    } catch (error: any) {
      setError(error.response?.data?.message || "Error linking Payoneer account");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendPayment = async (
    toUserEmail: string,
    amount: number,
    currency: string,
    description: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const payment = await PayoneerService.sendPayment({
        toUserEmail,
        amount,
        currency,
        description,
      });

      // Refrescar historial y balance después del pago
      await refreshData();

      return payment;
    } catch (error: any) {
      setError(error.response?.data?.message || "Error sending payment");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestPayment = async (
    toUserEmail: string,
    amount: number,
    currency: string,
    description: string,
    dueDate?: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const request = await PayoneerService.requestPayment({
        toUserEmail,
        amount,
        currency,
        description,
        dueDate,
      });

      // Refrescar solicitudes pendientes
      const requestsData = await PayoneerService.getPendingRequests();
      setPendingRequests(requestsData);

      return request;
    } catch (error: any) {
      setError(error.response?.data?.message || "Error requesting payment");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    setLoading(true);
    setError(null);
    try {
      const payment = await PayoneerService.approvePaymentRequest(requestId);

      // Refrescar datos después de aprobar
      await refreshData();

      return payment;
    } catch (error: any) {
      setError(error.response?.data?.message || "Error approving request");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const declineRequest = async (requestId: string) => {
    setLoading(true);
    setError(null);
    try {
      await PayoneerService.declinePaymentRequest(requestId);

      // Refrescar solicitudes pendientes
      const requestsData = await PayoneerService.getPendingRequests();
      setPendingRequests(requestsData);
    } catch (error: any) {
      setError(error.response?.data?.message || "Error declining request");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const findUser = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await PayoneerService.findUserByPayoneerEmail(email);
      return user;
    } catch (error: any) {
      setError(error.response?.data?.message || "User not found");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [balanceData, historyData, requestsData] = await Promise.all([
        PayoneerService.getBalance(),
        PayoneerService.getPaymentHistory(),
        PayoneerService.getPendingRequests(),
      ]);

      setBalance(balanceData);
      setPaymentHistory(historyData);
      setPendingRequests(requestsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const clearError = () => setError(null);

  return {
    // State
    account,
    balance,
    paymentHistory,
    pendingRequests,
    loading,
    error,

    // Actions
    linkAccount,
    sendPayment,
    requestPayment,
    approveRequest,
    declineRequest,
    findUser,
    refreshData,
    clearError,

    // Computed values
    isLinked: account?.isLinked || false,
    isVerified: account?.isVerified || false,
  };
};
