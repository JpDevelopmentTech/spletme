import type { SplitConditionFormData } from "./split.types";
import type { User } from "./user.types";

export type FilterType = "all" | "except" | "only";

export interface CollaboratorFormData {
  percentage: string;
  countriesType: FilterType;
  selectedCountries: { value: string; label: string }[];
  platformsType: FilterType;
  selectedPlatforms: { value: string; label: string }[];
  splitConditions: SplitConditionFormData[];
  type: "general" | "specific";
}

export interface SplitsModalProps {
  collaborators: CollaboratorWithSplit[];
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  onSplitSaved: (splitId: string) => void;
}

/** Usuario extendido con el campo split que devuelve el backend por canción */
export interface CollaboratorWithSplit extends User {
  split?: { conditions?: import("./split.types").SplitCondition[] } | null;
}
