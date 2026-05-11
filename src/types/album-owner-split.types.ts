import type { SplitCondition } from "./split.types";
import type { Album } from "./album.types";

export interface OwnerFormData {
  percentage: string;
  countriesType: "all" | "except" | "only";
  selectedCountries: { value: string; label: string }[];
  platformsType: "all" | "except" | "only";
  selectedPlatforms: { value: string; label: string }[];
  splitConditions: SplitCondition[];
  type: "general" | "specific";
}

export interface CreationProgress {
  total: number;
  completed: number;
  failed: number;
  current: string;
  errors: Array<{ songTitle: string; error: string }>;
}

export interface AlbumOwnerSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album;
  onSplitsCreated?: () => void;
}
