export type Currency = "USD" | "EUR";
/** Sólo para cargas anteriores al rango de meses. */
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type UploadStatus = "processing" | "done" | "error";

export interface Distributor {
  _id: string;
  name: string;
  /** Nombre oficial del distribuidor seleccionado del catálogo de Spotify. */
  provider: string | null;
  currency: Currency;
  photoUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DistributorUpload {
  _id: string;
  distributorId: string;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
    username?: string;
  } | null;
  /** Mes inicial del periodo (1-12). Null en cargas antiguas por trimestre. */
  startMonth: number | null;
  /** Mes final del periodo (1-12). Null en cargas antiguas por trimestre. */
  endMonth: number | null;
  /** Meses que cubre la carga (1-12). */
  monthsCovered: number;
  /** "Enero – Marzo 2025", ya resuelto por el backend. */
  periodLabel: string;
  /** "Ene–Mar 25", para ejes de gráfico. */
  periodShortLabel: string;
  /** Trimestre de las cargas antiguas; las nuevas no lo traen. */
  quarter?: Quarter | null;
  year: number;
  fileName: string | null;
  totalStreams: number;
  totalGrossIncome: number;
  totalNetIncome: number;
  songsCount: number;
  status: UploadStatus;
  songIds: string[];
  createdAt: string;
}

export interface DistributorKpi {
  distributorId: string;
  name: string;
  currency: Currency;
  photoUrl: string | null;
  totalStreams: number;
  totalNetIncome: number;
  totalGrossIncome: number;
  uploadCount: number;
  songsCount: number;
  lastUpload: string | null;
}

export interface DistributorDashboard {
  distributor: Distributor;
  totals: {
    totalNetIncome: number;
    totalGrossIncome: number;
    totalStreams: number;
    songsCount: number;
    uploadCount: number;
  };
  revenueByPeriod: Array<{
    /** Etiqueta compacta para el eje del gráfico ("Ene–Mar 25"). */
    label: string;
    /** Etiqueta completa ("Enero – Marzo 2025"). */
    periodLabel: string;
    startMonth: number | null;
    endMonth: number | null;
    monthsCovered: number;
    year: number;
    totalNetIncome: number;
    totalStreams: number;
    songsCount: number;
    uploadedAt: string;
    fileName: string | null;
  }>;
  topSongs: Array<{
    _id: string;
    trackTitle: string;
    artistName: string;
    totalNetIncome: number;
    totalStreams: number;
    isrc: string;
  }>;
  uploads: DistributorUpload[];
}

export interface CreateDistributorPayload {
  /** Alias que el usuario le da al distribuidor. */
  name: string;
  currency: Currency;
  /** Nombre oficial del distribuidor seleccionado del catálogo de Spotify. */
  provider?: string | null;
  /** Logo del distribuidor seleccionado. */
  photoUrl?: string | null;
}

/** Periodo que se envía al subir un archivo. */
export interface UploadPeriodPayload {
  startMonth: number;
  endMonth: number;
  year: number;
}
