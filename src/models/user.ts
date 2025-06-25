export interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    payoneerAccount?: PayoneerAccount;
    percentage?: number;
    role?: string;
}

export interface PayoneerAccount {
    accountId: string;
    email: string;
    isVerified: boolean;
    isLinked: boolean;
    accountStatus: 'pending' | 'registered' | 'approved' | 'declined';
}

export interface UserResponse {
    user: User;
    token: string;
}

export interface RegisterSchema {
    username: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface PaymentRequest {
    id: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    currency: string;
    description: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    createdAt: string;
    completedAt?: string;
    payoneerPaymentId?: string;
}

export interface PaymentHistory {
    id: string;
    type: 'sent' | 'received';
    userId: string;
    amount: number;
    currency: string;
    description: string;
    status: string;
    createdAt: string;
    payoneerTransactionId: string;
}