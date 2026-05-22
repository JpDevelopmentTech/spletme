// types/accounting.types.ts

export type AccountingStatus = 'pending' | 'paid' | 'cancelled';

export interface Accounting {
  _id: string;
  concept: string;
  amount: number;
  date: string;
  description: string | null;
  status: AccountingStatus;
  songId: string;
  createdById: {
    _id: string;
    name: string;
    email: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountingDto {
  concept: string;
  amount: number;
  songId: string;
  date?: string;
  description?: string;
  status?: AccountingStatus;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}