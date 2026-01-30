import axios from "axios";

const URI = import.meta.env.VITE_URL_API + '/api/v1/users';

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

export const OnboardingService = {
  updateOnboarding: async (onboardingData: OnboardingData) => {
    try {
      const endpoint = URI + '/onboarding';
      const response = await axios.put(endpoint, onboardingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating onboarding:', error);
      throw error;
    }
  }
};

