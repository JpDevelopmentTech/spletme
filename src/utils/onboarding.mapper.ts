import type { OnboardingData } from "@/services/onboarding";
import type { OnboardingPayload } from "@/types/onboarding.types";

const parseList = (val?: string): string[] =>
  val ? val.split(",").map((s) => s.trim()).filter(Boolean) : [];

/**
 * Normaliza los datos recolectados por el flujo de onboarding a la forma
 * canónica que espera el backend (modelo `onboardingData`): `professions`
 * (array), `department` y `phoneCountryCode`. Tolera los nombres internos
 * de los steps (`profession`, `state`, `phoneCode`) y descarta campos que
 * el modelo no posee (ej. `postalCode`).
 */
export const toOnboardingPayload = (data: OnboardingData): OnboardingPayload => ({
  professions:
    Array.isArray(data.professions) && data.professions.length > 0
      ? data.professions
      : parseList(data.profession),
  otherProfession: data.otherProfession ?? null,
  country: data.country ?? null,
  department: data.department ?? data.state ?? null,
  city: data.city ?? null,
  phoneCountryCode: data.phoneCountryCode ?? data.phoneCode ?? null,
  phone: data.phone ?? null,
  address: data.address ?? null,
  identification: data.identification ?? null,
  distributor: data.distributor ?? null,
  distributorEmail: data.distributorEmail ?? null,
  distributorPassword: data.distributorPassword ?? null,
  whatsappVerified: data.whatsappVerified,
  currentStep: data.currentStep,
});
