import type { ApiResponse } from "./bank-account.types";

export type { ApiResponse };

/** Valor permitido para un campo tipo select de Wise. */
export interface PayoutFieldValue {
  key: string;
  name: string;
}

/** Un campo concreto (grupo) dentro de un requirement de Wise. */
export interface PayoutFieldGroup {
  key: string;
  name: string;
  type: string; // 'text' | 'select' | 'radio' | 'date' | ...
  required: boolean;
  refreshRequirementsOnChange?: boolean;
  example?: string;
  valuesAllowed?: PayoutFieldValue[] | null;
}

/** Un campo de alto nivel (puede agrupar variantes en `group`). */
export interface PayoutField {
  name: string;
  group: PayoutFieldGroup[];
}

/** Un tipo de cuenta requerido por Wise para una moneda (p. ej. aba, swift_code). */
export interface PayoutRequirement {
  type: string;
  title: string;
  fields: PayoutField[];
}

/** Resumen de la cuenta de recepción registrada (datos del recipient de Wise). */
export interface PayoutAccountSummary {
  accountHolderName: string | null;
  currency: string | null;
  country: string | null;
  type: string | null;
  accountType: string | null;
  last4: string | null;
  bankIdentifier: string | null;
}

/** Estado de la cuenta de recepción del usuario. */
export interface PayoutAccountStatus {
  hasRecipient: boolean;
  payoutCurrency: string | null;
  status: "pending" | "registered" | "failed";
  account: PayoutAccountSummary | null;
}

/** Payload para registrar la cuenta de recepción. */
export interface RegisterPayoutPayload {
  currency: string;
  type: string;
  accountHolderName: string;
  details: Record<string, unknown>;
}
