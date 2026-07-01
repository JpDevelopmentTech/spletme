/** Respuesta genérica del backend (responseManager). */
export interface ApiResponse<T> {
  message: string;
  data: T;
  error: boolean;
}

/** Datos del SetupIntent devueltos al iniciar la vinculación bancaria (Instant Bank). */
export interface BankAccountSetupData {
  clientSecret: string;
  setupIntentId: string;
  customerId: string;
}

/** Props del formulario embebido de vinculación (dentro de <Elements>). */
export interface BankAccountLinkFormProps {
  setupIntentId: string;
  defaultName?: string;
  defaultEmail?: string;
  onSuccess: (verified: boolean) => void;
  onCancel: () => void;
}

/** Estado de la cuenta bancaria del Owner. */
export interface BankAccountStatusData {
  hasCustomer: boolean;
  hasBankAccount: boolean;
  status: "pending" | "verified" | "failed";
}

/** Cuenta bancaria vinculada del Owner (us_bank_account en Stripe). */
export interface LinkedBankAccount {
  id: string;
  bankName: string | null;
  last4: string | null;
  accountType: string | null;
  routingNumber: string | null;
  isActive: boolean;
}
