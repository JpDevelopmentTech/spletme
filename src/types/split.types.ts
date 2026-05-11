/** Condición de split — forma que espera y devuelve el backend */
export interface SplitCondition {
  fromDate?: string;
  toDate?: string;
  percentage: number;
  selectedCountries: string[];
  countriesType: "all" | "except" | "only";
  selectedPlatforms: string[];
  platformsType: "all" | "except" | "only";
  type: "general" | "specific";
}

/** Payload para crear un split de una canción */
export interface CreateSplitRequest {
  songId: string;
  collaboratorId: string;
  conditions: SplitCondition[];
}

/**
 * Condición tal como vive en el formulario del modal.
 * selectedCountries/selectedPlatforms son objetos { value, label } en vez de string[].
 */
export interface SplitConditionFormData {
  fromDate?: string;
  toDate?: string;
  percentage: number | string;
  selectedCountries: { value: string; label: string }[];
  countriesType: "all" | "except" | "only";
  selectedPlatforms: { value: string; label: string }[];
  platformsType: "all" | "except" | "only";
  type: "general" | "specific";
}
