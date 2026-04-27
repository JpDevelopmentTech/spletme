import axios from "axios";
import type { RegisterSchema } from "../models/user";

const URI = import.meta.env.VITE_URL_API + "/api/v1/users";

export interface RegisterSubuserSchema {
  parentUserId: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  lastName: string;
}

export interface UpdateUserSchema {
  userId: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
}

export type updateSubuserSchema = UpdateUserSchema;

export interface PasswordRecoveryResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface CodeVerificationResponse {
  success: boolean;
  message: string;
  status: number;
  token?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface UnlinkSubuserResponse {
  success: boolean;
  message: string;
}

const getMessageFromPayload = (payload: unknown, fallback: string): string => {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }
  return fallback;
};

const normalizeAuthToken = (token: string | null | undefined): string => {
  const rawToken = (token || "").trim();
  if (!rawToken) {
    return "";
  }

  return rawToken.replace(/^Bearer\s+/i, "").trim();
};

const getAuthHeaders = (): Record<string, string> => {
  const token = normalizeAuthToken(localStorage.getItem("token"));
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const AuthService = {
  login: async (email: string, password: string) => {
    try {
      const endpoint = URI + "/sign-in";
      const response = await axios.post(endpoint, { email, password });
      return response.data;
    } catch {
      return null;
    }
  },

  logout: () => {
    // API call to logout
  },

  register: async (payload: RegisterSchema) => {
    try {
      const endpoint = URI + "/sign-up";
      const response = await axios.post(endpoint, payload);
      return response.data;
    } catch {
      return null;
    }
  },

  registerSubuser: async (payload: RegisterSubuserSchema) => {
    try {
      const endpoint = URI + "/sign-up-subuser";
      const response = await axios.post(endpoint, payload);
      return response.data;
    } catch (error) {
      console.error("Error registering subuser:", error);
      return null;
    }
  },

  getSubUsersByUser: async () => {
    try {
      const endpoint = URI + "/subusers";
      const response = await axios.get(endpoint, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error getting subusers by user:", error);
      return null;
    }
  },

  unlinkSubuser: async (subuserId: string): Promise<UnlinkSubuserResponse> => {
    if (!subuserId.trim()) {
      return {
        success: false,
        message: "ID de subperfil inválido",
      };
    }

    try {
      const endpoint = `${URI}/subusers/unlink`;
      const response = await axios.post(
        endpoint,
        {
          subuserId,
        },
        {
          headers: getAuthHeaders(),
        },
      );

      return {
        success: true,
        message: response.data?.message || "Subperfil desvinculado correctamente",
      };
    } catch (error) {
      return {
        success: false,
        message: getMessageFromPayload(
          axios.isAxiosError(error) ? error.response?.data : undefined,
          "No se pudo desvincular el subperfil",
        ),
      };
    }
  },

  updateUser: async (payload: UpdateUserSchema) => {
    try {
      const endpoint = `${URI}/update/${payload.userId}`;
      const response = await axios.put(endpoint, payload, {
        headers: getAuthHeaders(),
      });
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  },

  sentPasswordRecoveryRequest: async (
    email: string,
  ): Promise<PasswordRecoveryResponse> => {
    try {
      const endpoint = URI + "/password-recovery/request";
      const response = await axios.post(
        endpoint,
        { email },
        {
          validateStatus: (status) =>
            (status >= 200 && status < 300) || status === 404 || status === 409,
        },
      );

      if (response.status === 404 || response.status === 409) {
        return {
          success: false,
          message: "correo no encontrado",
          status: response.status,
        };
      }

      return {
        success: true,
        message:
          response.data?.message ||
          "If the email exists, the recovery code was sent",
        status: response.status,
      };
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 404 || error.response?.status === 409)
      ) {
        return {
          success: false,
          message: "correo no encontrado",
          status: error.response.status,
        };
      }

      return {
        success: false,
        message: "No se pudo enviar el código",
        status: 500,
      };
    }
  },

  sentcodeForPasswordRecovery: async (
    email: string,
    code: string,
  ): Promise<CodeVerificationResponse> => {
    try {
      const endpoint = URI + "/password-recovery/verify-code";
      const response = await axios.post(endpoint, { email, code });
      return {
        success: true,
        message: response.data?.message || "Código verificado correctamente",
        status: response.status,
        token: response.data?.token,
      };
    } catch {
      return {
        success: false,
        message: "Código inválido o expirado",
        status: 400,
      };
    }
  },

  resetPasswordByCode: async (
    email: string,
    code: string,
    newPassword: string,
    newPasswordConfirmation: string,
  ): Promise<ResetPasswordResponse> => {
    try {
      const endpoint = URI + "/password-recovery/reset";
      const response = await axios.post(
        endpoint,
        {
          email,
          code,
          newPassword,
          newPasswordConfirmation,
        },
        {
          validateStatus: (status) =>
            (status >= 200 && status < 300) ||
            status === 400 ||
            status === 401 ||
            status === 404 ||
            status === 409 ||
            status === 422,
        },
      );

      if (response.status < 200 || response.status >= 300) {
        return {
          success: false,
          message: getMessageFromPayload(
            response.data,
            "Error al restablecer la contraseña",
          ),
          status: response.status,
        };
      }

      return {
        success: true,
        message:
          response.data?.message || "Contraseña restablecida correctamente",
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: getMessageFromPayload(
            error.response?.data,
            "Error al restablecer la contraseña",
          ),
          status: error.response?.status || 500,
        };
      }

      return {
        success: false,
        message: "Error al restablecer la contraseña",
        status: 500,
      };
    }
  },

  changePassword: async (
    newPassword: string,
    newPasswordConfirmation: string,
    currentPassword?: string,
    token?: string,
  ): Promise<ChangePasswordResponse> => {
    try {
      const endpoint = URI + "/password/change";
      const authToken = normalizeAuthToken(token || localStorage.getItem("token"));

      if (!authToken) {
        return {
          success: false,
          message: "No se encontró token de autenticación",
          status: 401,
        };
      }

      const payload = {
        newPassword,
        newPasswordConfirmation,
        token: authToken,
        ...(currentPassword ? { currentPassword } : {}),
      };

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        validateStatus: (status) =>
          (status >= 200 && status < 300) ||
          status === 400 ||
          status === 401 ||
          status === 404 ||
          status === 409 ||
          status === 422,
      });

      if (response.status < 200 || response.status >= 300) {
        return {
          success: false,
          message: getMessageFromPayload(
            response.data,
            "Error al cambiar la contraseña",
          ),
          status: response.status,
        };
      }

      return {
        success: true,
        message: response.data?.message || "Contraseña cambiada correctamente",
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: getMessageFromPayload(
            error.response?.data,
            "Error al cambiar la contraseña",
          ),
          status: error.response?.status || 500,
        };
      }

      return {
        success: false,
        message: "Error al cambiar la contraseña",
        status: 500,
      };
    }
  },
};
