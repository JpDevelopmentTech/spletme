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

export interface updateSubuserSchema {
  userId: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
}

export interface PasswordRecoveryResponse {
  success: boolean;
  message: string;
  status: number;
}

export const AuthService = {
  login: async (email: string, password: string) => {
    try {
      const endpoint = URI + "/sign-in";
      const response = await axios.post(endpoint, { email, password });
      console.log(response.data);
      return response.data;
    } catch (error) {
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
    } catch (error) {
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting subusers by user:", error);
      return null;
    }
  },

  updateUser: async (payload: updateSubuserSchema) => {
    try {
      const endpoint = `${URI}/update/${payload.userId}`;
      const response = await axios.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
};
