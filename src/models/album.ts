export interface AlbumTrack {
  _id: string;
  isrc: string;
  trackTitle: string;
  totalStreams: number;
  totalGrossIncome: number;
  totalNetIncome: number;
  releases?: any[]; // Optional, only included in detailed album view
}

export interface Album {
  _id: string; // UPC
  upc: string;
  albumTitle: string;
  artistName: string;
  artisticLabel?: string;
  totalTracks: number;
  totalStreams: number;
  totalGrossIncome: number;
  totalNetIncome: number;
  tracks: AlbumTrack[];
  releaseTitle: string;
}

export interface AlbumsPagination {
  total: number;
  skip: number;
  limit: number;
  hasMore: boolean;
}

export interface AlbumsResponse {
  success: boolean;
  data: Album[];
  pagination: AlbumsPagination;
}

export interface AlbumResponse {
  success: boolean;
  data: Album;
}

export interface AlbumsError {
  success: false;
  message: string;
  error?: string;
}
