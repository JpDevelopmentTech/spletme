/** Formatea streams de forma compacta: 1.2M, 612K, 840 */
export const formatStreams = (val: number): string => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
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
