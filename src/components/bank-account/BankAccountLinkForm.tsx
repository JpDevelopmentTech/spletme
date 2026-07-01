import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import bankAccountService from "@/services/bankAccount";
import type { BankAccountLinkFormProps } from "@/types/bank-account.types";

/**
 * Formulario embebido (renderizado dentro de <Elements>) para vincular la cuenta
 * bancaria del Owner vía Link/Instant Bank Payments. Muestra el PaymentElement,
 * confirma el SetupIntent con confirmSetup y, al éxito, persiste el método en el
 * backend y notifica al padre. No maneja el layout externo ni el estado del hook.
 */
export default function BankAccountLinkForm({
  setupIntentId,
  defaultName,
  defaultEmail,
  onSuccess,
  onCancel,
}: BankAccountLinkFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: `${window.location.origin}/panel/wallet` },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message ?? "No se pudo confirmar la vinculación.");
        return;
      }

      // Persiste el método en el backend sin depender solo del webhook
      // (setup_intent.succeeded actúa como respaldo idempotente).
      try {
        await bankAccountService.confirm(setupIntentId);
      } catch {
        /* el webhook setup_intent.succeeded respaldará el guardado */
      }

      onSuccess(setupIntent?.status === "succeeded");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
      <PaymentElement
        options={{
          defaultValues: {
            billingDetails: {
              name: defaultName || undefined,
              email: defaultEmail || undefined,
            },
          },
        }}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!stripe || submitting}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Confirmar y guardar"
          )}
        </button>
      </div>
    </div>
  );
}
