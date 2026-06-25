import type { RegisterSchema } from "../../types/user.types";
import type {
  PasswordRecoveryResponse,
  CodeVerificationResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  PlatformTourResponse,
  SwitchAccountResponse,
  UnlinkSubuserResponse,
} from "../../types/auth.types";

/**
 * Puerto (interfaz) que define el contrato del servicio de autenticación.
 * Cualquier implementación concreta debe cumplir este contrato.
 */
export interface IAuthService {
  login(email: string, password: string): Promise<unknown>;
  register(payload: RegisterSchema): Promise<unknown>;
  logout(): Promise<void>;
  sentPasswordRecoveryRequest(email: string): Promise<PasswordRecoveryResponse>;
  sentcodeForPasswordRecovery(
    email: string,
    code: string,
  ): Promise<CodeVerificationResponse>;
  resetPasswordByCode(
    email: string,
    code: string,
    newPassword: string,
    newPasswordConfirmation: string,
  ): Promise<ResetPasswordResponse>;
  changePassword(
    newPassword: string,
    newPasswordConfirmation: string,
    currentPassword?: string,
    token?: string,
  ): Promise<ChangePasswordResponse>;
  completeDashboardTour(completed: boolean): Promise<PlatformTourResponse>;
  switchAccount(targetUserId: string): Promise<SwitchAccountResponse>;
  unlinkSubuser(subuserId: string): Promise<UnlinkSubuserResponse>;
}
