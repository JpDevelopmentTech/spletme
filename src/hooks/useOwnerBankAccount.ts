import { useCallback, useEffect, useState } from "react";
import bankAccountService from "@/services/bankAccount";
import { getStripe } from "@/infrastructure/stripe/stripeClient";
import type { BankAccountStatusData, LinkedBankAccount } from "@/types/bank-account.types";
import type { User } from "@/types/user.types";

type FeedbackType = "success" | "error" | "info";

interface Feedback {
  type: FeedbackType;
  text: string;
}

/** Lee el usuario autenticado desde localStorage para los billing details de Stripe. */
const getCurrentUser = (): Partial<User> => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as Partial<User>) : {};
  } catch {
    return {};
  }
};

/**
 * Maneja la vinculación de la cuenta bancaria ACH del Owner: consulta su estado y
 * ejecuta el flujo de Stripe (recolección con Financial Connections + confirmación
 * del mandato) contra el SetupIntent creado por el backend.
 */
export const useOwnerBankAccount = () => {
  const [status, setStatus] = useState<BankAccountStatusData | null>(null);
  const [accounts, setAccounts] = useState<LinkedBankAccount[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [linking, setLinking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const [statusRes, accountsRes] = await Promise.all([
        bankAccountService.getStatus(),
        bankAccountService.listAccounts(),
      ]);
      if (!statusRes.error) setStatus(statusRes.data);
      if (!accountsRes.error) setAccounts(accountsRes.data);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const linkBankAccount = useCallback(async () => {
    setFeedback(null);
    setLinking(true);
    try {
      // ─── DEBUG STRIPE (temporal — quitar tras depurar) ──────────────────────
      // Compara con el log del backend. Si el prefijo de la pk no concuerda con
      // `livemode` del backend (pk_test ↔ false, pk_live ↔ true) → ese es el bug.
      const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
      console.info("🔑 [STRIPE DEBUG] frontend", {
        publishableKeyMode: pk ? pk.slice(0, 8) : "AUSENTE", // "pk_live_" / "pk_test_"
        apiBaseUrl: import.meta.env.VITE_URL_API,
      });
      // ────────────────────────────────────────────────────────────────────────

      const stripe = await getStripe();
      if (!stripe) {
        setFeedback({
          type: "error",
          text: "Stripe no está configurado (falta VITE_STRIPE_PUBLISHABLE_KEY).",
        });
        return;
      }

      const setupRes = await bankAccountService.setup();
      const clientSecret = setupRes.data?.clientSecret;

      // ─── DEBUG STRIPE (temporal — quitar tras depurar) ──────────────────────
      console.info("🔑 [STRIPE DEBUG] SetupIntent recibido del backend", {
        setupIntentId: setupRes.data?.setupIntentId,
        // Solo el prefijo "seti_..." (antes de _secret_), nunca el secreto completo:
        setupIntentFromSecret: clientSecret ? clientSecret.split("_secret_")[0] : null,
        backendMessage: setupRes.message,
      });
      // ────────────────────────────────────────────────────────────────────────

      if (!clientSecret) {
        setFeedback({
          type: "error",
          text: setupRes.message || "No se pudo iniciar la vinculación.",
        });
        return;
      }

      const user = getCurrentUser();
      const fullName = [user.name, user.lastName].filter(Boolean).join(" ").trim();

      const collectResult = await stripe.collectBankAccountForSetup({
        clientSecret,
        params: {
          payment_method_type: "us_bank_account",
          payment_method_data: {
            billing_details: { name: fullName || "Owner", email: user.email },
          },
        },
      });

      if (collectResult.error) {
        // DEBUG STRIPE (temporal — quitar tras depurar): error crudo de Stripe.js
        console.error("🔑 [STRIPE DEBUG] collectBankAccountForSetup error", collectResult.error);
        setFeedback({
          type: "error",
          text: collectResult.error.message ?? "Error al recolectar la cuenta.",
        });
        return;
      }
      if (
        !collectResult.setupIntent ||
        collectResult.setupIntent.status === "requires_payment_method"
      ) {
        setFeedback({ type: "info", text: "Vinculación cancelada." });
        return;
      }

      const confirmResult = await stripe.confirmUsBankAccountSetup(clientSecret);
      if (confirmResult.error) {
        // DEBUG STRIPE (temporal — quitar tras depurar): error crudo de Stripe.js
        console.error("🔑 [STRIPE DEBUG] confirmUsBankAccountSetup error", confirmResult.error);
        setFeedback({
          type: "error",
          text: confirmResult.error.message ?? "Error al confirmar el mandato.",
        });
        return;
      }

      // Confirma contra el backend para guardar el método sin depender solo del
      // webhook (que actúa como respaldo idempotente). No bloquea el éxito si falla.
      try {
        await bankAccountService.confirm(setupRes.data.setupIntentId);
      } catch {
        /* el webhook setup_intent.succeeded respaldará el guardado */
      }

      const confirmedStatus = confirmResult.setupIntent?.status;
      if (confirmedStatus === "succeeded") {
        setFeedback({
          type: "success",
          text: "Cuenta bancaria vinculada y verificada.",
        });
      } else {
        setFeedback({
          type: "info",
          text: "Cuenta enviada. La verificación está en proceso (puede requerir microdepósitos).",
        });
      }
      await fetchStatus();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Error inesperado.",
      });
    } finally {
      setLinking(false);
    }
  }, [fetchStatus]);

  return {
    status,
    accounts,
    loadingStatus,
    linking,
    feedback,
    linkBankAccount,
    fetchStatus,
  };
};
