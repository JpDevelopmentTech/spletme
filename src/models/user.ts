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

