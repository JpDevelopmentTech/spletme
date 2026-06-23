/** Moneda destino para el payout (recepción de dinero vía Wise). */
export interface PayoutCurrency {
  code: string;
  label: string;
}

/**
 * Monedas de recepción ofrecidas en el selector. Los campos bancarios de cada una
 * los resuelve Wise dinámicamente (account-requirements); esta lista solo acota las
 * opciones mostradas al usuario (USD + principales de Latinoamérica).
 */
export const PAYOUT_CURRENCIES: PayoutCurrency[] = [
  { code: "USD", label: "🇺🇸 Dólar estadounidense (USD)" },
  { code: "COP", label: "🇨🇴 Peso colombiano (COP)" },
  { code: "MXN", label: "🇲🇽 Peso mexicano (MXN)" },
  { code: "ARS", label: "🇦🇷 Peso argentino (ARS)" },
  { code: "BRL", label: "🇧🇷 Real brasileño (BRL)" },
  { code: "CLP", label: "🇨🇱 Peso chileno (CLP)" },
  { code: "PEN", label: "🇵🇪 Sol peruano (PEN)" },
  { code: "EUR", label: "🇪🇺 Euro (EUR)" },
];
