export interface User {
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
        }
    }
}

