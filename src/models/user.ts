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

