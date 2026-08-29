import type { User } from "./user.types";
import type { SelectOption } from "./select.types";
import type { SongSplit } from "./song-split.types";

export type FilterType = "all" | "except" | "only";

/**
 * Un tramo de vigencia mientras se edita. `id` es solo la clave de React: no
 * viaja al backend, que identifica los tramos por sus fechas.
 */
export interface SplitPeriodFormData {
  id: string;
  from: string;
  to: string;
  percentage: string;
  countriesType: FilterType;
  selectedCountries: SelectOption[];
  platformsType: FilterType;
  selectedPlatforms: SelectOption[];
}

/**
 * Estado del formulario de split de un colaborador: un porcentaje con sus
 * filtros y, opcionalmente, tramos de vigencia. Con tramos, `percentage` deja
 * de ser lo que cobra siempre y pasa a ser lo que cobra fuera de ellos.
 */
export interface CollaboratorFormData {
  percentage: string;
  countriesType: FilterType;
  selectedCountries: SelectOption[];
  platformsType: FilterType;
  selectedPlatforms: SelectOption[];
  periods: SplitPeriodFormData[];
  /**
   * Retención que el owner le cobra a este colaborador, como texto del input.
   * Vacío = hereda la del split del owner, que es lo que pasaba siempre antes
   * de poder pactarla persona a persona. Solo lo edita el dueño de la canción.
   */
  ownerRate: string;
}

export interface SplitsModalProps {
  collaborators: CollaboratorWithSplit[];
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  onSplitSaved?: (splitId: string) => void;
  /**
   * Si quien reparte es el dueño de la canción. Un sello también reparte splits,
   * y a él no se le explica que hay una parte descontada antes. Por defecto no
   * se enseña: ver `utils/ownerVisibility.ts`.
   */
  showOwnerContext?: boolean;
}

/** Colaborador con el split activo que devuelve el backend por canción. */
export interface CollaboratorWithSplit extends User {
  split?: SongSplit | null;
  amountOwed?: number;
  hasActiveSplit?: boolean;
}
