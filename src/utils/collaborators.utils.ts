import type { CollaboratorStatus, CollaboratorPayment } from "@/types";

/** Formatea un número como moneda con 2 decimales: $1,234.56 */
export const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Formatea un número de forma compacta: $1.2K */
export const formatCompactCurrency = (value: number) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

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
      return { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Activo" };
    case "pending":
      return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pendiente" };
    case "no_wallet":
      return { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Sin wallet" };
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
