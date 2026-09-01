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
  /**
   * El tramo se creó solo, para tapar el hueco que quedaba entre dos tramos
   * escritos a mano. Su porcentaje se edita como el de cualquier otro; sus
   * fechas no, porque las fijan sus vecinos.
   */
  autoFilled?: boolean;
  /**
   * Es el tramo que arranca "desde su lanzamiento": absorbe todos los meses
   * anteriores a su `from`. Lo lleva siempre el primero, y solo él.
   */
  openStart?: boolean;
}

/**
 * Estado del formulario de split de un colaborador: un porcentaje con sus
 * filtros y, opcionalmente, tramos de vigencia. Con tramos, `percentage` deja
 * de ser lo que cobra siempre y pasa a ser el porcentaje del tramo final: el
 * que rige desde que acaba el último tramo y ya no termina.
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
  /**
   * Mes (`YYYY-MM`) en que sale la canción: donde arranca la línea de tiempo de
   * los tramos. Lo calcula el backend y viaja con la distribución, porque
   * mezcla la fecha que declara el distribuidor con el primer mes con ventas
   * reportadas. `null` = no se sabe cuándo salió.
   */
  releaseMonth?: string | null;
}

/** Colaborador con el split activo que devuelve el backend por canción. */
export interface CollaboratorWithSplit extends User {
  split?: SongSplit | null;
  amountOwed?: number;
  hasActiveSplit?: boolean;
}
