/**
 * La cascada del dinero de una obra: de lo que reportó el distribuidor hasta lo
 * que le toca a cada persona.
 *
 * Estas cifras existían ya, pero repartidas entre los KPIs, la pestaña de
 * colaboradores y la de costos. Ponerlas en una sola secuencia es lo que permite
 * responder «de estos ingresos, cuánto es mío y por qué».
 */

export type StepKind = "total" | "deduction";

export interface WaterfallStep {
  kind: StepKind;
  label: string;
  detail?: string;
  amount: number;
  /** Color del importe. El neutro es el de texto principal. */
  tone: "neutral" | "positive" | "negative";
}

export interface WaterfallInput {
  /** Lo que reportó el distribuidor, antes de su comisión. */
  grossIncome: number;
  /** Lo que llegó a tu cuenta. */
  netIncome: number;
  /** Egresos extraordinarios ya registrados (mezcla, máster, diseño…). */
  expenses?: number;
  /** Cuántos conceptos de gasto hay, para el detalle del escalón. */
  expenseCount?: number;
  /** Nombre del distribuidor, si se conoce. */
  distributorName?: string | null;
  /** Cuántas pistas agrega la cascada. Solo en álbumes. */
  trackCount?: number;
}

/**
 * Construye los escalones. La comisión del distribuidor no viaja como dato
 * propio: se deduce de la diferencia entre bruto y neto, y por eso solo se
 * muestra cuando esa diferencia es real.
 */
export function buildWaterfall({
  grossIncome,
  netIncome,
  expenses = 0,
  expenseCount = 0,
  distributorName,
  trackCount,
}: WaterfallInput): WaterfallStep[] {
  const steps: WaterfallStep[] = [];
  const commission = Math.max(0, grossIncome - netIncome);
  const hasGross = grossIncome > 0 && commission > 0;

  if (hasGross) {
    steps.push({
      kind: "total",
      label: "INGRESO BRUTO",
      detail: trackCount
        ? `Lo que reportó el distribuidor por las ${trackCount} pistas`
        : "Lo que reportó el distribuidor",
      amount: grossIncome,
      tone: "neutral",
    });

    const rate = grossIncome > 0 ? Math.round((commission / grossIncome) * 100) : 0;
    steps.push({
      kind: "deduction",
      label: "Comisión del distribuidor",
      detail: distributorName ? `${rate}% que se queda ${distributorName}` : `${rate}% retenido`,
      amount: -commission,
      tone: "neutral",
    });
  }

  steps.push({
    kind: "total",
    label: "INGRESO NETO",
    detail: "Lo que llegó a tu cuenta",
    amount: netIncome,
    tone: "positive",
  });

  if (expenses > 0) {
    steps.push({
      kind: "deduction",
      label: "Costos extraordinarios",
      detail:
        expenseCount > 0
          ? `${expenseCount} ${expenseCount === 1 ? "concepto" : "conceptos"}`
          : undefined,
      amount: -expenses,
      tone: "negative",
    });
    steps.push({
      kind: "total",
      label: "REPARTIBLE",
      detail: "Lo que se divide entre los splits",
      amount: distributable(netIncome, expenses),
      tone: "neutral",
    });
  }

  return steps;
}

/**
 * Lo que queda por repartir una vez descontados los egresos.
 *
 * Se redondea a céntimos: sin eso, el error de coma flotante se arrastra a cada
 * porcentaje del reparto, que se calcula sobre esta cifra.
 */
export function distributable(netIncome: number, expenses = 0): number {
  return toCents(Math.max(0, netIncome - Math.max(0, expenses)));
}

/** Redondeo a dos decimales, que es la precisión con la que existe el dinero. */
export function toCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface Share {
  id: string;
  name: string;
  role?: string;
  /** Porcentaje del split, 0-100. */
  percentage: number;
  /** Lo que le corresponde de la cifra repartible. */
  amount: number;
  color: string;
  isOwner?: boolean;
  /** Lo que aún no ha cobrado. Solo tiene sentido en colaboradores. */
  pending?: number;
}

/** Suma de porcentajes asignados; lo que falte hasta 100 queda sin repartir. */
export function assignedPercentage(shares: Share[]): number {
  return shares.reduce((total, share) => total + (share.percentage || 0), 0);
}

export function unassignedPercentage(shares: Share[]): number {
  return Math.max(0, 100 - assignedPercentage(shares));
}
