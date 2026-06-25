import type {
  User,
  UpdateUserSchema,
  UpdateProfileInfoSchema,
} from "../../types/user.types";

/**
 * Puerto que define el contrato del servicio de gestión de usuarios.
 */
export interface IUserService {
  getSubUsersByUser(): Promise<unknown>;
  getListOfSubusers(): Promise<unknown>;
  updateUser(payload: UpdateUserSchema): Promise<User | null>;
  updateProfileInfo(payload: UpdateProfileInfoSchema): Promise<unknown>;
}
