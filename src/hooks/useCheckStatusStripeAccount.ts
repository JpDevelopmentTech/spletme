import stripe from "@/services/stripe";
import { useEffect, useState } from "react";

export const useCheckStatusStripeAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    data: {
      isReady: boolean;
    };
    message: string;
    error: boolean;
  }>({
    data: {
      isReady: false,
    },
    message: "",
    error: false,
  });

  useEffect(() => {
    checkStatusStripeAccount();
  }, []);

  const checkStatusStripeAccount = async () => {
    setIsLoading(true);
    const response = await stripe.checkStatus();
    setStatus(response);
    setIsLoading(false);
  };

  return {
    isLoading,
    status,
  };
};
