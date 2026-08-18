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
    <div className="flex flex-col gap-4">
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

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-[rgba(229,72,77,0.2)] bg-[#FDECEC] px-4 py-2.5 text-[11.5px] leading-relaxed text-[#E5484D]"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <span className="min-w-0 flex-1 text-[10.5px] leading-snug text-[#A6AAB2]">
          Verificar la cuenta puede tardar unos minutos.
        </span>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-[20px] border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[#71757E] transition-colors enabled:hover:bg-[#F4F5F7] enabled:hover:text-[#1C1D22] disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!stripe || submitting}
          className="flex items-center gap-2 rounded-[20px] bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors enabled:hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:bg-[#F4F5F7] disabled:text-[#A6AAB2] disabled:shadow-none"
        >
          {submitting ? (
            <>
              <Loader2 className="h-[14px] w-[14px] animate-spin" />
              Guardando…
            </>
          ) : (
            "Confirmar y guardar"
          )}
        </button>
      </div>
    </div>
  );
}
