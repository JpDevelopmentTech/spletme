import { apiClient } from "@/infrastructure/http/axiosClient";
import axios from "axios";
import { toOnboardingPayload } from "@/utils/onboarding.mapper";

interface ErrorPayload {
  message?: string;
}

interface BooleanPayload {
  data?: unknown;
  [key: string]: unknown;
}

export interface OnboardingData {
  // Nombres canónicos del modelo (backend)
  professions?: string[];
  department?: string;
  phoneCountryCode?: string;
  // Nombres internos usados por los steps del flujo de onboarding
  profession?: string;
  state?: string;
  postalCode?: string;
  phoneCode?: string;
  // Campos compartidos
  otherProfession?: string;
  country?: string;
  city?: string;
  phone?: string;
  address?: string;
  identification?: string;
  distributor?: string;
  distributorEmail?: string;
  distributorPassword?: string;
  whatsappVerified?: boolean;
  currentStep: number;
}

export interface AccountVerificationRequestResponse {
  accepted: boolean;
}

export interface AccountVerificationVerifyResponse {
  verified: boolean;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    axios.isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data === "object"
  ) {
    const payload = error.response.data as ErrorPayload;
    if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  }
  return fallback;
};

const getBooleanFromPayload = (
  payload: unknown,
  key: "accepted" | "verified",
): boolean | undefined => {
  if (!payload || typeof payload !== "object") return undefined;
  const top = payload as BooleanPayload;
  if (typeof top[key] === "boolean") return top[key] as boolean;
  if (top.data && typeof top.data === "object") {
    const nested = top.data as BooleanPayload;
    if (typeof nested[key] === "boolean") return nested[key] as boolean;
  }
  return undefined;
};

const BASE = "/users";

export const OnboardingService = {
  /** Actualiza los datos de onboarding del usuario autenticado */
  updateOnboarding: async (onboardingData: OnboardingData) => {
    try {
      const payload = toOnboardingPayload(onboardingData);
      const response = await apiClient.put(`${BASE}/onboarding`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /** Solicita el envío de un código de verificación de cuenta */
  requestAccountVerificationCode: async (
    email: string,
  ): Promise<AccountVerificationRequestResponse> => {
    try {
      const response = await apiClient.post(`${BASE}/account-verification/request`, {
        email: email.trim().toLowerCase(),
      });
      const accepted =
        getBooleanFromPayload(response.data, "accepted") ??
        (response.status >= 200 && response.status < 300);
      return { accepted };
    } catch (error) {
      throw new Error(getErrorMessage(error, "No se pudo enviar el código de verificación"));
    }
  },

  /** Verifica el código de verificación de cuenta */
  verifyAccountCode: async (
    email: string,
    code: string,
  ): Promise<AccountVerificationVerifyResponse> => {
    try {
      const response = await apiClient.post(`${BASE}/account-verification/verify-code`, {
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });
      const verified =
        getBooleanFromPayload(response.data, "verified") ??
        (response.status >= 200 && response.status < 300);
      return { verified };
    } catch (error) {
      throw new Error(getErrorMessage(error, "Código inválido o expirado"));
    }
  },
};
