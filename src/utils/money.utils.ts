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

/**
 * El porcentaje del owner NO compite con el de los colaboradores.
 *
 * El owner se lleva su `ownerPct%` de lo repartible antes que nadie; lo que
 * queda (el pool) es el 100% que se reparten los colaboradores. Por eso un owner
 * al 20% y un colaborador al 100% no suman 120%: son dos bases distintas. De
 * $1.000, el owner cobra $200 y el colaborador el 100% de los $800 restantes.
 *
 * Las funciones de abajo mantienen esa separación: `assignedPercentage` mide
 * solo el pool, y `effectivePercentage` traduce ambas bases a una común cuando
 * hay que pintarlas juntas en una misma barra.
 */

/** El porcentaje que se lleva el owner de lo repartible, antes del pool. */
export function ownerPercentage(shares: Share[]): number {
  return shares.find((share) => share.isOwner)?.percentage || 0;
}

/**
 * Cuánto del pool de colaboradores está repartido. El owner queda fuera a
 * propósito: su parte no sale de este 100%, sale de antes.
 */
export function assignedPercentage(shares: Share[]): number {
  return shares
    .filter((share) => !share.isOwner)
    .reduce((total, share) => total + (share.percentage || 0), 0);
}

/** Lo que queda del pool sin repartir; ese resto se lo queda el owner. */
export function unassignedPercentage(shares: Share[]): number {
  return Math.max(0, 100 - assignedPercentage(shares));
}

/** El dinero del pool: lo repartible menos la parte del owner. */
export function collaboratorPool(distributableAmount: number, ownerPct: number): number {
  const pct = Math.min(100, Math.max(0, ownerPct));
  return toCents(Math.max(0, distributableAmount) * (1 - pct / 100));
}

/**
 * El porcentaje de un split llevado a una base común: el total repartible.
 *
 * El del owner ya está en esa base; el de un colaborador es un porcentaje del
 * pool, así que hay que encogerlo por lo que se llevó el owner. Sirve para que
 * una barra apilada nunca pase del 100%.
 */
export function effectivePercentage(share: Share, ownerPct: number): number {
  const pct = share.percentage || 0;
  if (share.isOwner) return pct;
  const owner = Math.min(100, Math.max(0, ownerPct));
  return (pct * (100 - owner)) / 100;
}
