import type { SplitPeriod, SplitPeriodFormData } from "@/types";

const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

/** `"2025-01"` → `"ene 2025"`. Devuelve el crudo si no tiene esa forma. */
export const formatMonth = (value?: string): string => {
  if (!value) return "—";
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || !MONTHS[index]) return value;
  return `${MONTHS[index]} ${year}`;
};

/** `"ene 2025 → dic 2025"`, o `"ene 2025"` cuando el tramo dura un solo mes. */
export const formatPeriodRange = (period: { from: string; to: string }): string =>
  period.from === period.to
    ? formatMonth(period.from)
    : `${formatMonth(period.from)} → ${formatMonth(period.to)}`;

/** `"2026-12"` → `"2027-01"`. Devuelve el crudo si no tiene esa forma. */
export const nextMonth = (value: string): string => {
  const [year, month] = (value ?? "").split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) return value;
  return month === 12
    ? `${year + 1}-01`
    : `${year}-${String(month + 1).padStart(2, "0")}`;
};

/** Mes más tardío cubierto por un conjunto de tramos, o null si no hay ninguno. */
export const latestMonth = (periods: { to: string }[]): string | null =>
  periods.reduce<string | null>(
    (latest, period) => (!latest || (period.to && period.to > latest) ? period.to : latest),
    null,
  );

/**
 * Mes en que arranca el tramo final: el que paga el porcentaje base y ya no
 * termina nunca. Es el mes siguiente al último que cubre un tramo, para no
 * pisar el mes de cierre de este.
 *
 * `null` cuando no hay ningún tramo completo: sin tramos el porcentaje base se
 * cobra siempre, sin fecha de inicio que enseñar.
 */
export const finalPeriodStart = (
  periods: { from: string; to: string }[],
): string | null => {
  const complete = periods.filter((period) => period.from && period.to && period.from <= period.to);
  const last = latestMonth(complete);
  return last ? nextMonth(last) : null;
};

/** Mes más temprano de un conjunto de tramos, o null si no hay ninguno. */
export const earliestMonth = (periods: { from: string }[]): string | null =>
  periods.reduce<string | null>(
    (earliest, period) =>
      !earliest || (period.from && period.from < earliest) ? period.from : earliest,
    null,
  );

/**
 * Comprueba los tramos con las mismas reglas que el backend, para poder avisar
 * antes de enviar. Devuelve el primer problema encontrado, o null si están bien.
 */
export const validatePeriods = (periods: SplitPeriodFormData[]): string | null => {
  const filled = periods.filter((p) => p.from || p.to || p.percentage);

  for (const period of filled) {
    if (!period.from || !period.to) return "Completa el mes de inicio y el de fin de cada tramo.";
    if (period.from > period.to) {
      return `El tramo ${formatMonth(period.from)} → ${formatMonth(period.to)} termina antes de empezar.`;
    }
    const pct = parseFloat(period.percentage);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      return `El porcentaje de ${formatPeriodRange(period)} tiene que estar entre 0 y 100.`;
    }
  }

  const sorted = [...filled].sort((a, b) => (a.from < b.from ? -1 : 1));
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].from <= sorted[i - 1].to) {
      return `${formatPeriodRange(sorted[i - 1])} y ${formatPeriodRange(sorted[i])} se solapan.`;
    }
  }

  return null;
};

/** Pasa los tramos del formulario al formato que espera el backend. */
export const toPayloadPeriods = (periods: SplitPeriodFormData[]): SplitPeriod[] =>
  periods
    .filter((period) => period.from && period.to)
    .map((period) => ({
      from: period.from,
      to: period.to,
      percentage: parseFloat(period.percentage) || 0,
      countriesType: period.countriesType,
      selectedCountries: period.selectedCountries.map((c) => c.value),
      platformsType: period.platformsType,
      selectedPlatforms: period.selectedPlatforms.map((p) => p.value),
    }));
