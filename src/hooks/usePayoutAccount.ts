import { useCallback, useEffect, useState } from "react";
import payoutAccountService from "@/services/payoutAccount";
import type { PayoutAccountStatus, PayoutRequirement } from "@/types/payout-account.types";

type FeedbackType = "success" | "error" | "info";
interface Feedback {
  type: FeedbackType;
  text: string;
}

/** Asigna un valor en un objeto siguiendo una key anidada por puntos (a.b.c). */
const setDeep = (obj: Record<string, unknown>, path: string, value: string) => {
  const keys = path.split(".");
  let cur = obj;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value;
    else {
      cur[k] = (cur[k] as Record<string, unknown>) || {};
      cur = cur[k] as Record<string, unknown>;
    }
  });
};

/** Construye el objeto `details` para Wise a partir de los valores del formulario. */
const buildDetails = (requirement: PayoutRequirement | null, values: Record<string, string>) => {
  const details: Record<string, unknown> = {};
  if (!requirement) return details;
  requirement.fields.forEach((field) =>
    field.group.forEach((g) => {
      if (g.key === "accountHolderName") return;
      const v = values[g.key];
      if (v !== undefined && v !== "") setDeep(details, g.key, v);
    }),
  );
  return details;
};

/**
 * Maneja el registro de la cuenta de recepción (payout Wise) de cualquier usuario:
 * consulta el estado, descubre los campos por moneda, refresca los que dependen de
 * otros y envía el registro. Los campos son dinámicos según la moneda destino.
 */
export const usePayoutAccount = () => {
  const [status, setStatus] = useState<PayoutAccountStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [currency, setCurrency] = useState("");
  const [requirements, setRequirements] = useState<PayoutRequirement[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [loadingFields, setLoadingFields] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [accountHolderName, setAccountHolderName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const res = await payoutAccountService.getStatus();
      if (!res.error) setStatus(res.data);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const selectCurrency = useCallback(async (next: string) => {
    setCurrency(next);
    setValues({});
    setFeedback(null);
    setRequirements([]);
    setSelectedType("");
    if (!next) return;
    setLoadingFields(true);
    try {
      const res = await payoutAccountService.getRequirements(next);
      if (res.error) {
        setFeedback({
          type: "error",
          text: res.message || "No se pudieron cargar los campos.",
        });
        return;
      }
      setRequirements(res.data);
      setSelectedType(res.data[0]?.type ?? "");
    } catch {
      setFeedback({
        type: "error",
        text: "No se pudieron cargar los campos de esta moneda.",
      });
    } finally {
      setLoadingFields(false);
    }
  }, []);

  const current = requirements.find((r) => r.type === selectedType) ?? null;

  const setField = useCallback(
    async (key: string, value: string, refresh = false) => {
      const nextValues = { ...values, [key]: value };
      setValues(nextValues);
      if (!refresh) return;
      try {
        const res = await payoutAccountService.refreshRequirements(
          currency,
          buildDetails(current, nextValues),
        );
        if (!res.error) setRequirements(res.data);
      } catch {
        /* se conserva el formulario actual si el refresh falla */
      }
    },
    [values, currency, current],
  );

  const submit = useCallback(async () => {
    setFeedback(null);
    if (!currency || !selectedType || accountHolderName.trim().length < 2) {
      setFeedback({
        type: "error",
        text: "Completa la moneda y el titular de la cuenta.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await payoutAccountService.register({
        currency,
        type: selectedType,
        accountHolderName: accountHolderName.trim(),
        details: buildDetails(current, values),
      });
      if (res.error) {
        setFeedback({
          type: "error",
          text: res.message || "No se pudo registrar la cuenta.",
        });
        return;
      }
      setFeedback({
        type: "success",
        text: "Cuenta de recepción registrada correctamente.",
      });
      await fetchStatus();
    } catch {
      setFeedback({
        type: "error",
        text: "Error inesperado al registrar la cuenta.",
      });
    } finally {
      setSubmitting(false);
    }
  }, [currency, selectedType, accountHolderName, current, values, fetchStatus]);

  return {
    status,
    loadingStatus,
    currency,
    requirements,
    selectedType,
    setSelectedType,
    current,
    loadingFields,
    values,
    accountHolderName,
    setAccountHolderName,
    submitting,
    feedback,
    selectCurrency,
    setField,
    submit,
  };
};
