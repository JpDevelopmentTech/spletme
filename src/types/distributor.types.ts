export type Currency = "USD" | "EUR";
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
  quarter: Quarter;
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
  revenueByQuarter: Array<{
    label: string;
    quarter: Quarter;
    year: number;
    totalNetIncome: number;
    totalStreams: number;
    songsCount: number;
    uploadedAt: string;
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
