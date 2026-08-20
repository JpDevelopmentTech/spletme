/** Formatea streams de forma compacta: 1.2M, 612K, 840 */
export const formatStreams = (val: number): string => {
  const compact = (num: number) => num.toFixed(1).replace(/\.0$/, "");
  if (val >= 1_000_000) return `${compact(val / 1_000_000)}M`;
  if (val >= 1_000) return `${compact(val / 1_000)}K`;
  return val?.toLocaleString() ?? "0";
};

/** Formatea un número como moneda con 2 decimales: $1,234.56 */
export const formatCurrency = (val: number): string =>
  `$${val?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}`;

/** Formatea un número de forma compacta: $1.2K */
export const formatCompactCurrency = (val: number): string => {
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${val.toFixed(0)}`;
};

/** Símbolo de cada moneda admitida en los reportes de distribuidores. */
export const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "€" };

export const currencySymbol = (currency?: string | null): string =>
  CURRENCY_SYMBOLS[currency ?? "USD"] ?? "$";

/**
 * Como `formatCurrency`, pero con el símbolo de otra moneda.
 *
 * Ya no sirve para pintar importes guardados: todo el dinero del sistema vive en
 * dólares desde que la ingesta convierte los reportes en moneda extranjera. Se
 * usa para hablar del archivo ORIGEN —el ejemplo del tipo de cambio, el total en
 * euros que quedó como rastro en el historial de cargas— y no debe volver a
 * colgarse de `distributor.currency`, que hoy sólo dice en qué moneda reporta.
 */
export const formatMoney = (val: number, currency?: string | null): string =>
  `${currencySymbol(currency)}${(val ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** Versión compacta con moneda: €1.2K, $48.2K */
export const formatCompactMoney = (val: number, currency?: string | null): string => {
  const symbol = currencySymbol(currency);
  const amount = val ?? 0;
  if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1)}K`;
  return `${symbol}${amount.toFixed(2)}`;
};
