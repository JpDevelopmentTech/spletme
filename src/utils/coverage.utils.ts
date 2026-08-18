/**
 * Cobertura de meses de un distribuidor.
 *
 * Un distribuidor no vale solo por lo que ingresó, sino por si le falta algún mes
 * por cargar: un hueco en el calendario es dinero que todavía no se ha repartido.
 * Estas utilidades derivan esa lectura de las cargas que ya existen
 * (`startMonth` / `endMonth`, o el `quarter` de las antiguas), sin pedir ningún
 * dato nuevo al servidor.
 */

import { MONTH_SHORT_NAMES, resolvePeriod, type PeriodLike } from "./period.utils";

export interface MonthRange {
  startMonth: number;
  endMonth: number;
}

/**
 * Último mes que tiene sentido reclamar de un año.
 *
 * Los distribuidores publican el reporte de un mes con semanas de retraso, así
 * que el mes en curso nunca cuenta como hueco: del año actual se piden los meses
 * ya cerrados, y de los años pasados, los doce.
 */
export function lastRelevantMonth(year: number, today: Date = new Date()): number {
  const currentYear = today.getFullYear();
  if (year < currentYear) return 12;
  if (year > currentYear) return 0;
  return Math.max(0, today.getMonth());
}

/** Meses (1-12) que las cargas de ese año ya cubren. */
export function coveredMonths(uploads: PeriodLike[], year: number): Set<number> {
  const covered = new Set<number>();
  for (const upload of uploads) {
    if (upload.year !== year) continue;
    const period = resolvePeriod(upload);
    if (!period) continue;
    for (let month = period.startMonth; month <= period.endMonth; month += 1) covered.add(month);
  }
  return covered;
}

/**
 * Tramos contiguos de meses sin cubrir, hasta `upToMonth` incluido. Se agrupan en
 * rangos para poder decir «Abr–Jun» en vez de repetir tres avisos sueltos.
 */
export function findCoverageGaps(covered: Set<number>, upToMonth: number): MonthRange[] {
  const gaps: MonthRange[] = [];
  let start: number | null = null;

  for (let month = 1; month <= upToMonth; month += 1) {
    if (covered.has(month)) {
      if (start !== null) {
        gaps.push({ startMonth: start, endMonth: month - 1 });
        start = null;
      }
      continue;
    }
    if (start === null) start = month;
  }
  if (start !== null) gaps.push({ startMonth: start, endMonth: upToMonth });

  return gaps;
}

/** Cantidad de meses que suman todos los huecos. */
export function countMissingMonths(gaps: MonthRange[]): number {
  return gaps.reduce((total, gap) => total + (gap.endMonth - gap.startMonth + 1), 0);
}

/** Etiqueta compacta de un rango: "Abr" o "Abr–Jun". */
export function formatMonthRange({ startMonth, endMonth }: MonthRange): string {
  const from = MONTH_SHORT_NAMES[startMonth - 1];
  if (startMonth === endMonth) return from;
  return `${from}–${MONTH_SHORT_NAMES[endMonth - 1]}`;
}

/** Los huecos enumerados: "Abr–Jun · Oct". */
export function formatGaps(gaps: MonthRange[]): string {
  return gaps.map(formatMonthRange).join(" · ");
}

/** Años con actividad, del más reciente al más antiguo, incluyendo siempre el actual. */
export function availableYears(uploads: PeriodLike[], today: Date = new Date()): number[] {
  const years = new Set<number>([today.getFullYear()]);
  for (const upload of uploads) if (upload.year) years.add(upload.year);
  return [...years].sort((a, b) => b - a);
}

/**
 * Paleta de identidad de los distribuidores. El color acompaña al mismo
 * distribuidor en su avatar, en su tramo de la barra de reparto y en su regleta
 * de meses: es lo que permite leer las tres cosas como una sola.
 */
export const DISTRIBUTOR_COLORS = [
  "#FF5C00",
  "#1C1D22",
  "#2FB37E",
  "#F0A202",
  "#7C5CFF",
  "#0B7DDA",
  "#E5484D",
  "#0E9594",
];

export function distributorColor(index: number): string {
  return DISTRIBUTOR_COLORS[index % DISTRIBUTOR_COLORS.length];
}

/**
 * Color del trimestre al que pertenece un mes. Dentro de un mismo distribuidor
 * distingue cargas contiguas sin recurrir a un color por carga, que acabaría
 * siendo ruido cuando hay doce.
 */
const QUARTER_COLORS = ["#1C1D22", "#2FB37E", "#FF5C00", "#7C5CFF"];

export function quarterColor(month?: number | null): string {
  if (!month) return "#FF5C00";
  return QUARTER_COLORS[Math.floor((month - 1) / 3) % QUARTER_COLORS.length];
}

/** Texto legible del tiempo transcurrido: "hace 12 días", "hace 3 meses". */
export function formatRelativeDate(iso?: string | null, today: Date = new Date()): string {
  if (!iso) return "Sin cargas";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "—";

  const days = Math.floor((today.getTime() - then.getTime()) / 86_400_000);
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 31) return `hace ${days} días`;

  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} ${months === 1 ? "mes" : "meses"}`;

  const years = Math.floor(months / 12);
  return `hace ${years} ${years === 1 ? "año" : "años"}`;
}

/** Una carga se considera estancada si hace más de 90 días que no llega nada. */
export function isStale(iso?: string | null, today: Date = new Date()): boolean {
  if (!iso) return true;
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return false;
  return today.getTime() - then.getTime() > 90 * 86_400_000;
}
