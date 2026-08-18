/**
 * Periodo de una carga de distribuidor.
 *
 * Antes las cargas eran por trimestre fijo (Q1..Q4). Ahora el usuario elige
 * libremente el mes inicial y el mes final dentro de un mismo año, de 1 a 12
 * meses. Estas utilidades son el espejo de `src/distributors/utils/period.utils.js`
 * del backend: las cargas antiguas solo tienen `quarter` y las nuevas tienen
 * `startMonth` / `endMonth`, y ambas se muestran igual.
 */

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const MONTH_SHORT_NAMES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

/** Meses (1-12) con su etiqueta, para poblar los selectores. */
export const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => ({
  value: index + 1,
  label: name,
  short: MONTH_SHORT_NAMES[index],
}));

/** Rangos de meses que cubría cada trimestre en el esquema anterior. */
export const QUARTER_RANGES: Record<string, { startMonth: number; endMonth: number }> = {
  Q1: { startMonth: 1, endMonth: 3 },
  Q2: { startMonth: 4, endMonth: 6 },
  Q3: { startMonth: 7, endMonth: 9 },
  Q4: { startMonth: 10, endMonth: 12 },
};

export interface PeriodRange {
  startMonth: number;
  endMonth: number;
}

export interface PeriodLike {
  startMonth?: number | null;
  endMonth?: number | null;
  quarter?: string | null;
  year?: number;
}

/**
 * Rango de meses de una carga, resolviendo las antiguas que solo guardaban
 * `quarter`. Devuelve null si no hay información suficiente.
 */
export function resolvePeriod(upload?: PeriodLike | null): PeriodRange | null {
  if (!upload) return null;

  const { startMonth, endMonth } = upload;
  if (startMonth && endMonth) return { startMonth, endMonth };

  const legacy = upload.quarter ? QUARTER_RANGES[upload.quarter] : null;
  return legacy ? { ...legacy } : null;
}

/**
 * Etiqueta legible: "Enero 2025" cuando es un solo mes,
 * "Enero – Marzo 2025" cuando abarca varios.
 */
export function buildPeriodLabel(
  startMonth?: number | null,
  endMonth?: number | null,
  year?: number | string,
): string {
  if (!startMonth || !endMonth) return String(year ?? "");
  if (startMonth === endMonth) return `${MONTH_NAMES[startMonth - 1]} ${year}`;
  return `${MONTH_NAMES[startMonth - 1]} – ${MONTH_NAMES[endMonth - 1]} ${year}`;
}

/** Etiqueta compacta para ejes de gráfico: "Ene–Mar 25". */
export function buildShortPeriodLabel(
  startMonth?: number | null,
  endMonth?: number | null,
  year?: number | string,
): string {
  if (!startMonth || !endMonth) return String(year ?? "");
  const suffix = String(year ?? "").slice(-2);
  if (startMonth === endMonth) return `${MONTH_SHORT_NAMES[startMonth - 1]} ${suffix}`;
  return `${MONTH_SHORT_NAMES[startMonth - 1]}–${MONTH_SHORT_NAMES[endMonth - 1]} ${suffix}`;
}

/**
 * Etiqueta de una carga ya venga con el rango nuevo o con el trimestre antiguo.
 * El backend envía `periodLabel` calculado; esto es el respaldo del cliente.
 */
export function formatUploadPeriod(
  upload?: (PeriodLike & { periodLabel?: string | null }) | null,
): string {
  if (upload?.periodLabel) return upload.periodLabel;
  const period = resolvePeriod(upload);
  return buildPeriodLabel(period?.startMonth, period?.endMonth, upload?.year);
}

/** Cantidad de meses que cubre el periodo (1 a 12). */
export function monthsCovered(startMonth?: number | null, endMonth?: number | null): number {
  if (!startMonth || !endMonth) return 0;
  return endMonth - startMonth + 1;
}

/** True si dos rangos de meses comparten al menos un mes. */
export function periodsOverlap(a: PeriodRange, b: PeriodRange): boolean {
  return a.startMonth <= b.endMonth && b.startMonth <= a.endMonth;
}

/**
 * Busca, entre las cargas ya existentes del mismo año, la primera que se solape
 * con el rango elegido. Es lo que impide subir dos veces los mismos meses.
 */
export function findOverlappingUpload<T extends PeriodLike>(
  uploads: T[],
  range: PeriodRange,
  year: number,
): T | null {
  for (const upload of uploads) {
    if (upload.year !== year) continue;
    const period = resolvePeriod(upload);
    if (period && periodsOverlap(period, range)) return upload;
  }
  return null;
}

/**
 * Valida el rango elegido. Devuelve el mensaje de error o null si es correcto.
 * Refleja las mismas reglas que valida el backend.
 */
export function validatePeriodRange(startMonth: number, endMonth: number): string | null {
  if (!startMonth || !endMonth) return "Selecciona el mes inicial y el mes final del periodo";
  if (startMonth < 1 || startMonth > 12 || endMonth < 1 || endMonth > 12) {
    return "Los meses del periodo deben estar entre 1 y 12";
  }
  if (startMonth > endMonth) return "El mes inicial no puede ser posterior al mes final";
  return null;
}
