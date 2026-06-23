/** Respuesta genérica del backend (responseManager). */
export interface ApiResponse<T> {
  message: string;
  data: T;
  error: boolean;
}

/** Datos del SetupIntent ACH devueltos al iniciar la vinculación bancaria. */
export interface BankAccountSetupData {
  clientSecret: string;
  setupIntentId: string;
  customerId: string;
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
