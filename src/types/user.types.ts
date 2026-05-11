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

export interface User {
  amountToPay: string;
  id: string;
  name: string;
  lastName: string;
  email: string;
  percentage?: number;
  role?: string;
  _id?: string;
  accountVerified?: boolean;
  accountVerification?: {
    codeHash?: string;
    expiresAt?: string;
    attempts?: number;
  };
  onboardingCompleted?: boolean;
  onboardingData?: OnboardingData;
  splitInfo?: {
    splitId: string;
    paymentDetails: {
      totalOwed: number;
      amountToPay: number;
    };
  };
}

export interface RegisterSchema {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  lastName: string;
}

export interface RegisterSubuserSchema {
  parentUserId: string;
  username: string;
  email: string;
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

export interface UpdateProfileInfoSchema {
  country?: string | null;
  profession?: string | null;
  address?: string | null;
}

export type UpdateSubuserSchema = UpdateUserSchema;
