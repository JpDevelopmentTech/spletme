// Entidades del dominio — re-exportan desde types/ hasta migración completa
export type { User, OnboardingData } from "../../types/user.types";
export type { Album, AlbumTrack } from "../../types/album.types";
export type { SplitCondition } from "../../types/split.types";
export type {
  PaymentRequest,
  PaymentHistory,
  PayoneerAccount,
} from "../../types/payment.types";
