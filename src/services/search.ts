import { apiClient } from "@/infrastructure/http/axiosClient";

export interface SearchSongResult {
  _id: string;
  trackTitle: string;
  artistName?: string;
  isrc?: string;
  upc?: string;
}

export interface SearchAlbumResult {
  _id: string;
  albumTitle: string;
  artistName?: string;
  upc?: string;
  totalTracks?: number;
}

export interface SearchCollaboratorResult {
  _id: string;
  name?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

export interface SearchLabelResult {
  type: "artistic" | "custom";
  name: string;
  _id?: string;
}

export interface GlobalSearchResults {
  songs: SearchSongResult[];
  albums: SearchAlbumResult[];
  collaborators: SearchCollaboratorResult[];
  labels: SearchLabelResult[];
}

export const EMPTY_SEARCH_RESULTS: GlobalSearchResults = {
  songs: [],
  albums: [],
  collaborators: [],
  labels: [],
};

class SearchService {
  /**
   * Búsqueda global: canciones (título/artista/ISRC/UPC), álbumes (título/UPC),
   * colaboradores (nombre/email) y sellos (nombre).
   */
  async globalSearch(query: string, limit = 5): Promise<GlobalSearchResults> {
    try {
      const response = await apiClient.get("/search", {
        params: { q: query, limit },
      });
      return (response.data?.data as GlobalSearchResults) ?? EMPTY_SEARCH_RESULTS;
    } catch {
      return EMPTY_SEARCH_RESULTS;
    }
  }
}

export default new SearchService();
