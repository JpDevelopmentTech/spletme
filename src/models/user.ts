export interface User {
    amountToPay: string;
    id: string;
    name: string;
    lastName: string;
    email: string;
    percentage?: number;
    role?: string;
    _id?: string;
    splitInfo?: {
        splitId: string;
        paymentDetails: {
            totalOwed: number;
            amountToPay: number;
        }
    }
}

export interface RegisterSchema {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    name: string;
    lastName: string;
}

export interface PaymentRequest {
    id: string;
    amount: number;
    recipient: string;
    status: string;
    createdAt: string;
}

export interface PaymentHistory {
    id: string;
    amount: number;
    date: string;
    type: 'sent' | 'received';
    status: string;
    currency: string;
    description: string;
    createdAt: string;
    payoneerTransactionId: string;
}

export interface PayoneerAccount {
    id: string;
    email: string;
    isVerified: boolean;
    balance: number;
    isLinked: boolean;
}

