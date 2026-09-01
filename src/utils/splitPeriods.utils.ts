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

/** `"2026-01"` → `"2025-12"`. Devuelve el crudo si no tiene esa forma. */
export const prevMonth = (value: string): string => {
  const [year, month] = (value ?? "").split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) return value;
  return month === 1
    ? `${year - 1}-12`
    : `${year}-${String(month - 1).padStart(2, "0")}`;
};

/** Mes más tardío cubierto por un conjunto de tramos, o null si no hay ninguno. */
export const latestMonth = (periods: { to: string }[]): string | null =>
  periods.reduce<string | null>(
    (latest, period) => (!latest || (period.to && period.to > latest) ? period.to : latest),
    null,
  );

/**
 * Mes en que arranca el tramo final: el que ya no termina nunca. Es el mes
 * siguiente al último que cubre un tramo, para no pisar su mes de cierre.
 *
 * `null` cuando no hay ningún tramo: entonces el tramo final es el único que
 * hay y arranca en el lanzamiento de la canción, no en la cola de nadie.
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

/** Un tramo está listo para colocarse en la línea de tiempo. */
const isComplete = (period: SplitPeriodFormData): boolean =>
  Boolean(period.from && period.to && period.from <= period.to);

/**
 * Los tramos que se generan solos llevan un id derivado de sus fechas, no un
 * contador: así React conserva el input mientras el hueco siga siendo el mismo
 * —y con él el porcentaje que el usuario le haya escrito—, y lo descarta en
 * cuanto los tramos vecinos lo cambian de sitio, que es cuando ya es otro hueco.
 */
const gapId = (from: string, to: string) => `gap-${from}-${to}`;

/** Tramo que tapa un hueco: nace al 0% y sin filtros, y se puede editar. */
const gapPeriod = (
  from: string,
  to: string,
  openStart: boolean,
  previous: SplitPeriodFormData[],
): SplitPeriodFormData => {
  const id = gapId(from, to);
  const kept = previous.find((period) => period.id === id);

  if (kept) return { ...kept, from, to, autoFilled: true, openStart };

  return {
    id,
    from,
    to,
    percentage: "0",
    countriesType: "all",
    selectedCountries: [],
    platformsType: "all",
    selectedPlatforms: [],
    autoFilled: true,
    openStart,
  };
};

/** Dos tramos generados que se tocan y pagan lo mismo son un solo hueco. */
const mergeable = (a: SplitPeriodFormData, b: SplitPeriodFormData): boolean =>
  Boolean(a.autoFilled && b.autoFilled && nextMonth(a.to) === b.from && a.percentage === b.percentage);

/**
 * Deja los tramos cubriendo el calendario entero, sin huecos, desde el
 * lanzamiento de la canción hasta el arranque del tramo final.
 *
 * Un split no es una lista de excepciones sobre un porcentaje de fondo: es una
 * línea de tiempo continua en la que cada mes tiene su regla. Por eso, en
 * cuanto el usuario escribe un tramo que empieza más tarde que el anterior, el
 * hueco se tapa aquí con un tramo al 0% en lugar de dejarse en blanco: un mes
 * sin tramo pagaba 0 igualmente, pero no se veía en ninguna parte y solo se
 * descubría cobrando de menos.
 *
 * Los tramos generados se pueden editar como cualquier otro —el 0% es un punto
 * de partida, no una condena—, pero sus fechas no: las fijan sus vecinos.
 *
 * El primer tramo queda marcado `openStart`, "desde su lanzamiento", y abierto
 * por la izquierda: la fecha de lanzamiento que conocemos es la que declara el
 * distribuidor y no siempre coincide con el primer mes con ventas reportadas.
 * Anclarlo dejaría esos meses sin pagar por un desfase de calendario.
 *
 * Los tramos a medio escribir (sin fechas todavía) se quedan al final, fuera de
 * la línea de tiempo, hasta que tengan un rango con el que colocarse.
 *
 * @param periods Tramos tal y como están en el formulario.
 * @param releaseMonth Mes de lanzamiento (`YYYY-MM`), o null si no se conoce.
 */
export const reconcilePeriods = (
  periods: SplitPeriodFormData[],
  releaseMonth: string | null,
): SplitPeriodFormData[] => {
  const pending = periods.filter((period) => !isComplete(period));
  const complete = periods
    .filter(isComplete)
    .sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));

  if (complete.length === 0) return periods;

  const filled: SplitPeriodFormData[] = [];
  const [first] = complete;

  // Lo que va del lanzamiento al primer tramo es SIEMPRE una fila propia, nunca
  // una nota al pie del primer tramo: "¿y desde que salió la canción hasta
  // aquí?" es la primera pregunta que se hace quien reparte, y tiene que poder
  // contestarla poniéndole un porcentaje, no leyendo una advertencia.
  //
  // La única vez que no hay fila es cuando el primer tramo ya arranca justo en
  // el mes de lanzamiento: entonces no queda ningún mes suelto que explicar, y
  // es él quien lleva el `openStart`.
  if (releaseMonth && releaseMonth === first.from) {
    filled.push({ ...first, openStart: true });
  } else {
    // El hueco no puede empezar después de terminar. Si la fecha de lanzamiento
    // es POSTERIOR al primer tramo, manda el tramo: alguien ha escrito a mano
    // que ahí ya se cobraba, y eso pesa más que la fecha del distribuidor
    // —que en un catálogo real llega a faltar, venir solo con el año o traer la
    // del relanzamiento—. La fila sale igual, pero sin fecha que enseñar.
    const lastFreeMonth = prevMonth(first.from);
    const from = releaseMonth && releaseMonth < first.from ? releaseMonth : lastFreeMonth;
    filled.push(gapPeriod(from, lastFreeMonth, true, periods));
    filled.push({ ...first, openStart: false });
  }

  for (let i = 1; i < complete.length; i += 1) {
    const previous = complete[i - 1];
    const current = complete[i];
    const gapFrom = nextMonth(previous.to);

    if (gapFrom < current.from) {
      filled.push(gapPeriod(gapFrom, prevMonth(current.from), false, periods));
    }

    filled.push({ ...current, openStart: false });
  }

  // Borrar un tramo lo convierte en hueco, y dos huecos pegados son uno solo.
  const merged = filled.reduce<SplitPeriodFormData[]>((acc, period) => {
    const last = acc[acc.length - 1];
    if (last && mergeable(last, period)) {
      const to = period.to;
      acc[acc.length - 1] = { ...last, id: gapId(last.from, to), to };
      return acc;
    }
    acc.push(period);
    return acc;
  }, []);

  return [...merged, ...pending];
};

/**
 * Comprueba los tramos con las mismas reglas que el backend, para poder avisar
 * antes de enviar. Devuelve el primer problema encontrado, o null si están bien.
 *
 * No comprueba que no haya huecos: `reconcilePeriods` los tapa según se
 * escriben, así que un hueco aquí sería un fallo nuestro, no del usuario, y
 * bloquearle el guardado no le daría ninguna forma de arreglarlo.
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
      openStart: Boolean(period.openStart),
      autoFilled: Boolean(period.autoFilled),
      countriesType: period.countriesType,
      selectedCountries: period.selectedCountries.map((c) => c.value),
      platformsType: period.platformsType,
      selectedPlatforms: period.selectedPlatforms.map((p) => p.value),
    }));
