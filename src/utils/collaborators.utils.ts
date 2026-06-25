import type { CollaboratorStatus, CollaboratorPayment } from "@/types";
export { formatCurrency, formatCompactCurrency } from "@/utils/format.utils";

interface BadgeStyle {
  bg: string;
  text: string;
  dot: string;
  label: string;
}

/** Devuelve las clases Tailwind y la etiqueta para un estado de colaborador */
export const getStatusBadge = (status: CollaboratorStatus): BadgeStyle => {
  switch (status) {
    case "active":
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        dot: "bg-green-500",
        label: "Activo",
      };
    case "pending":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",
        label: "Pendiente",
      };
    case "no_wallet":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",
        label: "Sin wallet",
      };
  }
};

interface PaymentBadgeStyle {
  bg: string;
  text: string;
  label: string;
}

/** Devuelve las clases Tailwind y la etiqueta para un estado de pago */
export const getPaymentStatusBadge = (status: CollaboratorPayment["status"]): PaymentBadgeStyle => {
  switch (status) {
    case "completed":
      return { bg: "bg-green-50", text: "text-green-700", label: "Completado" };
    case "processing":
      return { bg: "bg-amber-50", text: "text-amber-700", label: "Procesando" };
    case "failed":
      return { bg: "bg-red-50", text: "text-red-700", label: "Fallido" };
  }
};
