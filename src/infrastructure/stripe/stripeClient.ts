import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Devuelve la instancia de Stripe.js cargada con la publishable key, reutilizando
 * la misma promesa entre llamadas (Stripe recomienda cargarlo una sola vez).
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!publishableKey) {
    return Promise.resolve(null);
  }
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};
