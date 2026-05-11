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

export interface PlatformTourResponse {
  success: boolean;
  message: string;
  status: number;
}

export interface UnlinkSubuserResponse {
  success: boolean;
  message: string;
}

export interface SwitchAccountResponse {
  success: boolean;
  message: string;
  status: number;
  data?: {
    user?: Record<string, unknown>;
    token?: string;
    [key: string]: unknown;
  };
}
