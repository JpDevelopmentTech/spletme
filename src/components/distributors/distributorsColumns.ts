export type DistributorSortBy =
  | "income_desc"
  | "income_asc"
  | "songs_desc"
  | "streams_desc"
  | "coverage_asc"
  | "last_upload_desc"
  | "name_asc";

/**
 * Columnas de la tabla de distribuidores. Las comparten la cabecera,
 * `DistributorRow` y el esqueleto de carga, para que los anchos no se
 * desincronicen.
 *
 * La rejilla es fluida: el distribuidor absorbe el ancho sobrante y las columnas
 * de datos mantienen su tamaño. Las ocultas (`display: none`) no ocupan celda,
 * así que cada breakpoint declara solo las que se ven: móvil = distribuidor +
 * ingresos + acciones; md suma streams; lg suma moneda, canciones y última
 * carga; xl añade la regleta de cobertura.
 */
export const DISTRIBUTORS_GRID =
  "grid items-center gap-3 grid-cols-[minmax(0,1fr)_130px_100px] " +
  "md:grid-cols-[minmax(0,1fr)_86px_130px_100px] " +
  "lg:grid-cols-[minmax(0,1fr)_66px_78px_86px_150px_110px_100px] " +
  "xl:grid-cols-[minmax(0,1fr)_66px_78px_86px_150px_148px_110px_100px]";

export interface DistributorColumn {
  key: string;
  label: string;
  /** Clases de visibilidad por breakpoint; deben coincidir con `DISTRIBUTORS_GRID`. */
  visibility: string;
  sortKeys?: DistributorSortBy[];
}

export const DISTRIBUTOR_COLUMNS: DistributorColumn[] = [
  // Moneda en la que el distribuidor emite sus reportes, no la de la columna de
  // ingresos: esa va siempre en dólares.
  { key: "currency", label: "REPORTA EN", visibility: "hidden lg:flex" },
  { key: "songs", label: "CANCIONES", visibility: "hidden lg:flex", sortKeys: ["songs_desc"] },
  { key: "streams", label: "STREAMS", visibility: "hidden md:flex", sortKeys: ["streams_desc"] },
  {
    key: "income",
    label: "INGRESOS NETOS",
    visibility: "flex",
    sortKeys: ["income_desc", "income_asc"],
  },
  {
    key: "coverage",
    label: "COBERTURA",
    visibility: "hidden xl:flex",
    sortKeys: ["coverage_asc"],
  },
  {
    key: "lastUpload",
    label: "ÚLTIMA CARGA",
    visibility: "hidden lg:flex",
    sortKeys: ["last_upload_desc"],
  },
];

/** Criterio que aplica cada columna al pulsar su cabecera. */
export const NEXT_SORT: Record<string, (current: DistributorSortBy) => DistributorSortBy> = {
  name: () => "name_asc",
  songs: () => "songs_desc",
  streams: () => "streams_desc",
  income: (current) => (current === "income_desc" ? "income_asc" : "income_desc"),
  coverage: () => "coverage_asc",
  lastUpload: () => "last_upload_desc",
};

/** Criterios que ordenan de mayor a menor; el resto se dibujan ascendentes. */
const DESCENDING: DistributorSortBy[] = [
  "income_desc",
  "songs_desc",
  "streams_desc",
  "last_upload_desc",
];

export function isDescending(sortBy: DistributorSortBy): boolean {
  return DESCENDING.includes(sortBy);
}

export const SORT_LABELS: Record<DistributorSortBy, string> = {
  income_desc: "Mayores ingresos",
  income_asc: "Menores ingresos",
  songs_desc: "Más canciones",
  streams_desc: "Más streams",
  coverage_asc: "Menos cobertura",
  last_upload_desc: "Carga más reciente",
  name_asc: "Nombre (A–Z)",
};
