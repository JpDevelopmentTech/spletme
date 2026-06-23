import { apiClient } from "@/infrastructure/http/axiosClient";
import type {
  CreateOwnerSplitPayload,
  CreateCollaboratorSplitPayload,
  SongSplit,
  SongSplitDistribution,
  ReleaseFiltersOptions,
} from "@/types";
import type { SplitHistoryItem, SplitHistoryResponse } from "@/types/song-split.types";

const toSelectOptions = (values: string[]) =>
  (values ?? []).map((value) => ({ value, label: value }));

class SongSplitsService {
  private readonly BASE = "/song-splits";

  async createOwnerSplit(payload: CreateOwnerSplitPayload): Promise<SongSplit> {
    const response = await apiClient.post(`${this.BASE}/owner`, payload);
    return response.data?.data ?? response.data;
  }

  async createCollaboratorSplit(payload: CreateCollaboratorSplitPayload): Promise<SongSplit> {
    const response = await apiClient.post(`${this.BASE}/collaborator`, payload);
    return response.data?.data ?? response.data;
  }

  async getSongSplits(songId: string): Promise<SongSplitDistribution> {
    const response = await apiClient.get(`${this.BASE}/song/${songId}`);
    return response.data?.data ?? response.data;
  }

  async deleteSplit(splitId: string): Promise<void> {
    await apiClient.delete(`${this.BASE}/${splitId}`);
  }

  async getReleaseFiltersForSongs(songIds: string[]): Promise<ReleaseFiltersOptions> {
    try {
      const response = await apiClient.post(`${this.BASE}/filter-options`, { songIds });
      const data = (response.data?.data ?? { countries: [], platforms: [] }) as {
        countries: string[];
        platforms: string[];
      };
      return {
        countries: toSelectOptions(data.countries),
        platforms: toSelectOptions(data.platforms),
      };
    } catch {
      return { countries: [], platforms: [] };
    }
  }

  async getSplitHistoryBySong(songId: string): Promise<SplitHistoryItem[]> {
    try {
      const response = await apiClient.get(`${this.BASE}/song/${songId}/history`);
      const data = response.data?.data;
      if (Array.isArray(data)) return data as SplitHistoryItem[];
      if (data && typeof data === "object" && Array.isArray((data as { history?: unknown }).history))
        return (data as { history: SplitHistoryItem[] }).history;
      return [];
    } catch {
      return [];
    }
  }

  async getUserSplitHistory(userId: string): Promise<SplitHistoryItem[]> {
    try {
      const response = await apiClient.get<SplitHistoryResponse>(`${this.BASE}/user/${userId}/history`);
      return response.data?.data ?? [];
    } catch {
      return [];
    }
  }
}

export const songSplitsService = new SongSplitsService();
