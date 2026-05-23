import type { SplitCondition } from "./split.types";

export interface AlbumTrack {
  _id: string;
  isrc: string;
  trackTitle: string;
  totalStreams: number;
  totalGrossIncome: number;
  totalNetIncome: number;
  releases?: unknown[];
  split?: { conditions?: SplitCondition[] } | null;
  ownerId?: { split?: { conditions?: SplitCondition[] } | null } | null;
  spotifyData?: {
    album?: { images?: Array<{ url: string; width?: number; height?: number }> };
  };
  collaborators?: { _id?: string; name?: string; image?: string }[];
}

export interface Album {
  _id?: string;
  id?: string;
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
  coverImage?: { url: string; height: number; width: number }[][];
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
