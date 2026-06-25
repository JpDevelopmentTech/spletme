export interface OnboardingPayload {
  professions: string[];
  otherProfession: string | null;
  country: string | null;
  department: string | null;
  city: string | null;
  phoneCountryCode: string | null;
  phone: string | null;
  address: string | null;
  identification: string | null;
  distributor: string | null;
  distributorEmail: string | null;
  distributorPassword: string | null;
  whatsappVerified?: boolean;
  currentStep: number;
}
