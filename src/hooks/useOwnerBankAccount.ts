import { useCallback, useEffect, useMemo, useState } from "react";
import bankAccountService from "@/services/bankAccount";
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
 * Maneja la vinculación de la cuenta bancaria del Owner (Instant Bank Payments vía
 * Link): consulta su estado y orquesta el SetupIntent del backend. La confirmación
 * la ejecuta BankAccountLinkForm dentro de <Elements>; el hook expone el
 * clientSecret y recibe el resultado para refrescar el estado.
 */
export const useOwnerBankAccount = () => {
  const [status, setStatus] = useState<BankAccountStatusData | null>(null);
  const [accounts, setAccounts] = useState<LinkedBankAccount[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [linking, setLinking] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const billingDetails = useMemo(() => {
    const user = getCurrentUser();
    const fullName = [user.name, user.lastName].filter(Boolean).join(" ").trim();
    return { name: fullName, email: user.email ?? "" };
  }, []);

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

  /** Pide un SetupIntent al backend y expone el clientSecret para montar <Elements>. */
  const startLinking = useCallback(async () => {
    setFeedback(null);
    setLinking(true);
    try {
      const setupRes = await bankAccountService.setup();
      if (setupRes.error || !setupRes.data?.clientSecret) {
        setFeedback({
          type: "error",
          text: setupRes.message || "No se pudo iniciar la vinculación.",
        });
        return;
      }
      setClientSecret(setupRes.data.clientSecret);
      setSetupIntentId(setupRes.data.setupIntentId);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Error inesperado.",
      });
    } finally {
      setLinking(false);
    }
  }, []);

  /** Cierra el formulario de vinculación sin guardar. */
  const cancelLinking = useCallback(() => {
    setClientSecret(null);
    setSetupIntentId(null);
  }, []);

  /** Cierra el formulario tras confirmar y refresca el estado de la cuenta. */
  const finishLinking = useCallback(
    async (verified: boolean) => {
      setClientSecret(null);
      setSetupIntentId(null);
      setFeedback(
        verified
          ? { type: "success", text: "Cuenta bancaria vinculada y verificada." }
          : { type: "info", text: "Cuenta enviada. La verificación está en proceso." },
      );
      await fetchStatus();
    },
    [fetchStatus],
  );

  return {
    status,
    accounts,
    loadingStatus,
    linking,
    clientSecret,
    setupIntentId,
    billingDetails,
    feedback,
    startLinking,
    cancelLinking,
    finishLinking,
    fetchStatus,
  };
};
