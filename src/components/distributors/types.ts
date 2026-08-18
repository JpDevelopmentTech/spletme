import type { Distributor, DistributorKpi, DistributorUpload } from "@/types/distributor.types";
import type { MonthRange } from "@/utils/coverage.utils";

/**
 * Un distribuidor tal y como lo necesita la lista: sus datos, sus KPIs y la
 * cobertura del año, que se deriva de sus cargas y no viaja en la API.
 */
export interface DistributorListItem {
  distributor: Distributor;
  kpi: DistributorKpi | null;
  /** Color de identidad, compartido con la barra de reparto y la regleta. */
  color: string;
  uploads: DistributorUpload[];
  /** Meses del año seleccionado que ya tienen reporte. */
  covered: Set<number>;
  gaps: MonthRange[];
  missingMonths: number;
  /** Participación sobre el total de ingresos, 0-100. */
  shareOfTotal: number;
  /** Participación sobre el distribuidor que más ingresa, 0-100. */
  shareOfMax: number;
}
