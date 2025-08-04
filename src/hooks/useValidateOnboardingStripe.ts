import stripe from "@/services/stripe"
import { useEffect, useState } from "react"

export const useValidateOnboardingStripe = () => {
    const [validateOnboarding, setValidateOnboarding] = useState(null)


    useEffect(() => {
        validateOnboardingStripe()
    }, [])

    const validateOnboardingStripe = async () => {
        const response = await stripe.refreshConnection()
        if(response.message === "Onboarding link refreshed") {
            window.location.href = response.data.onboardingUrl
        } else {
            setValidateOnboarding(response)
        }
    }
  return {
    validateOnboarding,
  }
}
