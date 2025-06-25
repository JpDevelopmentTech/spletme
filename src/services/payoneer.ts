import axios from 'axios';
import { PaymentRequest, PaymentHistory, PayoneerAccount } from '../models/user';

const API_BASE_URL = import.meta.env.VITE_URL_API + '/api/v1/payoneer';

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

export const PayoneerService = {
    /**
     * Vincula la cuenta de Payoneer del usuario
     */
    linkPayoneerAccount: async (linkData: PayoneerLinkAccountRequest) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/link-account`, linkData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error linking Payoneer account:', error);
            throw error;
        }
    },

    /**
     * Obtiene información de la cuenta Payoneer vinculada
     */
    getPayoneerAccount: async (): Promise<PayoneerAccount | null> => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/account`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.account;
        } catch (error) {
            console.error('Error getting Payoneer account:', error);
            return null;
        }
    },

    /**
     * Envía un pago a otro usuario de Payoneer
     */
    sendPayment: async (paymentData: PayoneerPaymentRequest): Promise<PaymentRequest> => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/send-payment`, paymentData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.payment;
        } catch (error) {
            console.error('Error sending payment:', error);
            throw error;
        }
    },

    /**
     * Solicita un pago a otro usuario
     */
    requestPayment: async (requestData: PayoneerPaymentRequest): Promise<PaymentRequest> => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/request-payment`, requestData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.request;
        } catch (error) {
            console.error('Error requesting payment:', error);
            throw error;
        }
    },

    /**
     * Obtiene el historial de pagos
     */
    getPaymentHistory: async (): Promise<PaymentHistory[]> => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/payment-history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.payments;
        } catch (error) {
            console.error('Error getting payment history:', error);
            return [];
        }
    },

    /**
     * Obtiene solicitudes de pago pendientes
     */
    getPendingRequests: async (): Promise<PaymentRequest[]> => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/pending-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.requests;
        } catch (error) {
            console.error('Error getting pending requests:', error);
            return [];
        }
    },

    /**
     * Aprueba una solicitud de pago
     */
    approvePaymentRequest: async (requestId: string): Promise<PaymentRequest> => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/approve-request/${requestId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.payment;
        } catch (error) {
            console.error('Error approving payment request:', error);
            throw error;
        }
    },

    /**
     * Rechaza una solicitud de pago
     */
    declinePaymentRequest: async (requestId: string): Promise<void> => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${API_BASE_URL}/decline-request/${requestId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error declining payment request:', error);
            throw error;
        }
    },

    /**
     * Obtiene el balance de Payoneer
     */
    getBalance: async (): Promise<{amount: number, currency: string}[]> => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/balance`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.balances;
        } catch (error) {
            console.error('Error getting balance:', error);
            return [];
        }
    },

    /**
     * Busca usuarios por email de Payoneer
     */
    findUserByPayoneerEmail: async (email: string) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/find-user?email=${email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.user;
        } catch (error) {
            console.error('Error finding user:', error);
            return null;
        }
    }
}; 