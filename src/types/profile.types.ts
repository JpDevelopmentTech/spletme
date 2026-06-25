export interface SubprofileItem {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
}

export type ActiveSection =
  | "edit-profile"
  | "create-subprofile"
  | "change-password"
  | null;

export interface ProfileUserData {
  username: string;
  name: string;
  lastName: string;
  email: string;
  userId: string;
  onboardingData: {
    country: string | null;
    address: string | null;
    profession: string | null;
    otherProfession: string | null;
  };
}

export interface EditProfileForm {
  country: string;
  profession: string;
  otherProfession: string;
  address: string;
}
