import axios from "axios";

const URI = import.meta.env.VITE_URL_API + '/api/v1/users';

interface ErrorPayload {
  message?: string;
}

interface BooleanPayload {
  data?: unknown;
  [key: string]: unknown;
}

export interface OnboardingData {
  profession?: string;
  otherProfession?: string;
  country?: string;
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

const normalizeAuthToken = (token: string | null): string =>
  (token || "").replace(/^Bearer\s+/i, "").trim();

const getRequiredAuthHeaders = (): Record<string, string> => {
  const token = normalizeAuthToken(localStorage.getItem("token"));
  if (!token) {
    throw new Error("No se encontró token de autenticación");
  }

  return { Authorization: `Bearer ${token}` };
};

const getOptionalAuthHeaders = (): Record<string, string> | undefined => {
  const token = normalizeAuthToken(localStorage.getItem("token"));
  if (!token) {
    return undefined;
  }

  return { Authorization: `Bearer ${token}` };
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    axios.isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data === "object"
  ) {
    const payload = error.response.data as ErrorPayload;
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  }

  return fallback;
};

const getBooleanFromPayload = (
  payload: unknown,
  key: "accepted" | "verified",
): boolean | undefined => {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const topLevel = payload as BooleanPayload;
  if (typeof topLevel[key] === "boolean") {
    return topLevel[key] as boolean;
  }

  if (topLevel.data && typeof topLevel.data === "object") {
    const nested = topLevel.data as BooleanPayload;
    if (typeof nested[key] === "boolean") {
      return nested[key] as boolean;
    }
  }

  return undefined;
};

export const OnboardingService = {
  updateOnboarding: async (onboardingData: OnboardingData) => {
    try {
      const endpoint = URI + '/onboarding';
      const response = await axios.put(endpoint, onboardingData, {
        headers: getRequiredAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating onboarding:', error);
      throw error;
    }
  },
  requestAccountVerificationCode: async (
    email: string,
  ): Promise<AccountVerificationRequestResponse> => {
    const normalizedEmail = email.trim().toLowerCase();
    const endpoint = URI + "/account-verification/request";

    try {
      const response = await axios.post(
        endpoint,
        { email: normalizedEmail },
        {
          headers: getOptionalAuthHeaders(),
        },
      );

      const accepted =
        getBooleanFromPayload(response.data, "accepted") ??
        (response.status >= 200 && response.status < 300);

      return {
        accepted,
      };
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "No se pudo enviar el código de verificación"),
      );
    }
  },
  verifyAccountCode: async (
    email: string,
    code: string,
  ): Promise<AccountVerificationVerifyResponse> => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();
    const endpoint = URI + "/account-verification/verify-code";

    try {
      const response = await axios.post(
        endpoint,
        { email: normalizedEmail, code: normalizedCode },
        {
          headers: getOptionalAuthHeaders(),
        },
      );

      const verified =
        getBooleanFromPayload(response.data, "verified") ??
        (response.status >= 200 && response.status < 300);

      return {
        verified,
      };
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Código inválido o expirado"),
      );
    }
  },
};

