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
  type: "sent" | "received";
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

export interface CollaboratorPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaboratorId: string;
  collaboratorName: string;
  collaboratorEmail: string;
  onPaymentSuccess?: () => void;
}
