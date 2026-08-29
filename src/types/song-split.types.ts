import type { FilterType } from "./splits-modal.types";

export type SplitRole = "owner" | "collaborator";

/** Referencia a usuario que el backend puede devolver poblada o como id. */
export type SplitUserRef =
  | string
  | {
      _id: string;
      id?: string;
      name?: string;
      email?: string;
      username?: string;
    };

/**
 * Tramo de vigencia de un split. `from` y `to` son meses inclusivos `YYYY-MM`,
 * la resolución con la que el distribuidor reporta las ventas.
 */
export interface SplitPeriod {
  from: string;
  to: string;
  percentage: number;
  countriesType: FilterType;
  selectedCountries: string[];
  platformsType: FilterType;
  selectedPlatforms: string[];
}

export interface SongSplit {
  _id: string;
  songId: string;
  userId: SplitUserRef;
  role: SplitRole;
  percentage: number;
  countriesType: FilterType;
  selectedCountries: string[];
  platformsType: FilterType;
  selectedPlatforms: string[];
  status: "active" | "superseded" | "deleted";
  version: number;
  /** Vacío = el split aplica siempre; con tramos, `percentage` es el fallback. */
  periods?: SplitPeriod[];
  /**
   * Retención que el owner le cobra a ESTE participante sobre su parte.
   * `null` = hereda la del split del owner. Dato del owner: no se le enseña a
   * quien cobra del pool (ver `utils/ownerVisibility.ts`).
   */
  ownerRate?: number | null;
}

/** Campos de porcentaje + filtros que comparten owner y colaborador. */
export interface SplitFilterPayload {
  percentage: number;
  countriesType: FilterType;
  selectedCountries: string[];
  platformsType: FilterType;
  selectedPlatforms: string[];
}

export interface CreateOwnerSplitPayload extends SplitFilterPayload {
  songId: string;
}

export interface CreateCollaboratorSplitPayload extends SplitFilterPayload {
  songId: string;
  collaboratorId: string;
  /** Tramos de vigencia; con ellos, `percentage` es lo que cobra fuera de ellos. */
  periods?: SplitPeriod[];
  /** Retención del owner solo para este participante; `null` = hereda la suya. */
  ownerRate?: number | null;
}

/** Entrada del desglose de distribución calculada en vivo por el backend. */
export interface SplitDistributionEntry {
  splitId: string;
  userId: SplitUserRef;
  percentage: number;
  countriesType: FilterType;
  selectedCountries: string[];
  platformsType: FilterType;
  selectedPlatforms: string[];
  periods?: SplitPeriod[];
  /** Retención pactada con este participante; `null` = hereda la del owner. */
  ownerRate?: number | null;
  /** Su parte antes de la retención del owner. Dato del owner. */
  grossAmount?: number;
  /** Lo que el owner le retiene de esa parte. Dato del owner. */
  ownerCut?: number;
  /** Lo que cobra: `grossAmount - ownerCut`. */
  amount: number;
}

export interface SongSplitDistribution {
  owner: SplitDistributionEntry | null;
  collaborators: SplitDistributionEntry[];
  songTotalNetIncome: number;
  collaboratorsPool: number;
}

export interface SplitHistoryItem {
  _id: string;
  action: "create" | "update" | "delete";
  isDeleted: boolean;
  percentage: number;
  countriesType: string;
  selectedCountries: string[];
  platformsType: string;
  selectedPlatforms: string[];
  version: number;
  role: string;
  userId: string;
  songId: string;
  splitId: string | null;
  periods?: SplitPeriod[];
  createdAt: string;
  updatedAt: string;
  updatedBy: { _id: string; username: string; name: string; email: string };
  conditions: [];
}

export interface SplitHistoryResponse {
  data: SplitHistoryItem[];
}
