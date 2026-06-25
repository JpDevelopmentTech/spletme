import { apiClient } from "@/infrastructure/http/axiosClient";
import type {
  PaymentRequest,
  PaymentHistory,
  PayoneerAccount,
} from "../models/user";

export interface PayoneerPaymentRequest {
  toUserEmail: string;
  amount: number;
  currency: string;
  description: string;
  dueDate?: string;
}

export interface PayoneerLinkAccountRequest {
  payoneerEmail: string;
  payoneerAccountId?: string;
}

const BASE = "/payoneer";

export const PayoneerService = {
  /** Vincula la cuenta de Payoneer del usuario */
  linkPayoneerAccount: async (linkData: PayoneerLinkAccountRequest) => {
    const response = await apiClient.post(`${BASE}/link-account`, linkData);
    return response.data;
  },

  /** Obtiene información de la cuenta Payoneer vinculada */
  getPayoneerAccount: async (): Promise<PayoneerAccount | null> => {
    try {
      const response = await apiClient.get(`${BASE}/account`);
      return response.data.account;
    } catch {
      return null;
    }
  },

  /** Envía un pago a otro usuario de Payoneer */
  sendPayment: async (
    paymentData: PayoneerPaymentRequest,
  ): Promise<PaymentRequest> => {
    const response = await apiClient.post(`${BASE}/send-payment`, paymentData);
    return response.data.payment;
  },

  /** Solicita un pago a otro usuario */
  requestPayment: async (
    requestData: PayoneerPaymentRequest,
  ): Promise<PaymentRequest> => {
    const response = await apiClient.post(
      `${BASE}/request-payment`,
      requestData,
    );
    return response.data.request;
  },

  /** Obtiene el historial de pagos */
  getPaymentHistory: async (): Promise<PaymentHistory[]> => {
    try {
      const response = await apiClient.get(`${BASE}/payment-history`);
      return response.data.payments;
    } catch {
      return [];
    }
  },

  /** Obtiene solicitudes de pago pendientes */
  getPendingRequests: async (): Promise<PaymentRequest[]> => {
    try {
      const response = await apiClient.get(`${BASE}/pending-requests`);
      return response.data.requests;
    } catch {
      return [];
    }
  },

  /** Aprueba una solicitud de pago */
  approvePaymentRequest: async (requestId: string): Promise<PaymentRequest> => {
    const response = await apiClient.post(
      `${BASE}/approve-request/${requestId}`,
      {},
    );
    return response.data.payment;
  },

  /** Rechaza una solicitud de pago */
  declinePaymentRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`${BASE}/decline-request/${requestId}`, {});
  },

  /** Obtiene el balance de Payoneer */
  getBalance: async (): Promise<{ amount: number; currency: string }[]> => {
    try {
      const response = await apiClient.get(`${BASE}/balance`);
      return response.data.balances;
    } catch {
      return [];
    }
  },

  /** Busca usuarios por email de Payoneer */
  findUserByPayoneerEmail: async (email: string) => {
    try {
      const response = await apiClient.get(`${BASE}/find-user?email=${email}`);
      return response.data.user;
    } catch {
      return null;
    }
  },
};
