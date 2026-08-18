export type CollaboratorSortBy =
  | "pending_desc"
  | "paid_desc"
  | "songs_desc"
  | "name_asc";

/**
 * Columnas de la tabla de colaboradores. Las comparten la cabecera,
 * `CollaboratorRow` y el esqueleto de carga, para que los anchos no se
 * desincronicen.
 *
 * La rejilla es fluida: la persona absorbe el ancho sobrante. Las columnas
 * ocultas (`display: none`) no ocupan celda, así que cada breakpoint declara
 * solo las que se ven: móvil = casilla + persona + saldo + acciones; lg suma rol
 * y catálogo; xl añade el estado.
 */
export const COLLABORATORS_GRID =
  "grid items-center gap-3 grid-cols-[28px_minmax(0,1fr)_180px_96px] " +
  "lg:grid-cols-[28px_minmax(0,1fr)_104px_128px_210px_96px] " +
  "xl:grid-cols-[28px_minmax(0,1fr)_104px_128px_210px_150px_96px]";

export interface CollaboratorColumn {
  key: string;
  label: string;
  /** Clases de visibilidad por breakpoint; deben coincidir con `COLLABORATORS_GRID`. */
  visibility: string;
  sortKey?: CollaboratorSortBy;
}

export const COLLABORATOR_COLUMNS: CollaboratorColumn[] = [
  { key: "role", label: "ROL", visibility: "hidden lg:flex" },
  { key: "catalog", label: "EN TU CATÁLOGO", visibility: "hidden lg:flex", sortKey: "songs_desc" },
  { key: "balance", label: "SALDO", visibility: "flex", sortKey: "pending_desc" },
  { key: "state", label: "ESTADO", visibility: "hidden xl:flex" },
];

export const SORT_LABELS: Record<CollaboratorSortBy, string> = {
  pending_desc: "Mayor saldo por pagar",
  paid_desc: "Más pagado",
  songs_desc: "Más canciones",
  name_asc: "Nombre (A–Z)",
};
