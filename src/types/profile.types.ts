export interface SubprofileItem {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
}

export type ActiveSection = "edit-details" | "create-subprofile" | "change-password" | null;

export interface ProfileOnboardingData {
  country:          string | null;
  department:       string | null;
  city:             string | null;
  phoneCountryCode: string | null;
  phone:            string | null;
  address:          string | null;
  profession:       string | null;   // comma-separated list
  otherProfession:  string | null;
}

export interface ProfileUserData {
  username:  string;
  name:      string;
  lastName:  string;
  email:     string;
  userId:    string;
  onboardingData: ProfileOnboardingData;
}

export interface EditProfileForm {
  country:          string;
  department:       string;
  city:             string;
  phoneCountryCode: string;
  phone:            string;
  address:          string;
  profession:       string;   // comma-separated multi-select
  otherProfession:  string;
}
