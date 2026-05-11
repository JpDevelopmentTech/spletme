export interface SplitCondition {
  fromDate?: string;
  toDate?: string;
  percentage: number;
  countries: string[];
  typeCountries: "all" | "except" | "only";
  platforms: string[];
  typePlatforms: "all" | "except" | "only";
  type: "general" | "specific";
}
