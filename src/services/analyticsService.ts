import { apiClient } from "../infrastructure/http/axiosClient";
import type {
  AnalyticsFilters,
  AnalyticsKpis,
  Transaction,
  PaginatedResult,
  RevenueByPlatformData,
  PieChartEntry,
  TopSong,
  TopArtist,
  TopLabel,
  HistoricalTotal,
  PlatformCountryRow,
  AnalyticsSong,
  SplitOwnerInfo,
  FilterOptions,
} from "../types/analytics.types";

function toParams(filters: object): Record<string, string> {
  const out: Record<string, string> = {};
  Object.entries(filters as Record<string, unknown>).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") out[k] = String(v);
  });
  return out;
}

export const analyticsService = {
  getKpis(filters: AnalyticsFilters): Promise<AnalyticsKpis> {
    return apiClient
      .get("/analytics/kpis", { params: toParams(filters) })
      .then((r) => r.data.data);
  },

  getTransactions(
    filters: AnalyticsFilters,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Transaction>> {
    return apiClient
      .get("/analytics/transactions", {
        params: toParams({ ...filters, page, limit }),
      })
      .then((r) => r.data.data);
  },

  getRevenueByPlatform(
    filters: AnalyticsFilters,
  ): Promise<RevenueByPlatformData> {
    return apiClient
      .get("/analytics/revenue-by-platform", { params: toParams(filters) })
      .then((r) => r.data.data);
  },

  getRevenueByStore(filters: AnalyticsFilters): Promise<PieChartEntry[]> {
    return apiClient
      .get("/analytics/revenue-by-store", { params: toParams(filters) })
      .then((r) => r.data.data);
  },

  getRevenueByCountry(filters: AnalyticsFilters): Promise<PieChartEntry[]> {
    return apiClient
      .get("/analytics/revenue-by-country", { params: toParams(filters) })
      .then((r) => r.data.data);
  },

  getTopSongs(filters: AnalyticsFilters): Promise<TopSong[]> {
    return apiClient
      .get("/analytics/top-songs", { params: toParams(filters) })
      .then((r) => r.data.data);
  },

  getTopArtists(filters: AnalyticsFilters): Promise<TopArtist[]> {
    return apiClient
      .get("/analytics/top-artists", { params: toParams(filters) })
      .then((r) => r.data.data);
  },

  getTopLabels(filters: AnalyticsFilters): Promise<TopLabel[]> {
    return apiClient
      .get("/analytics/top-labels", { params: toParams(filters) })
      .then((r) => r.data.data);
  },

  getHistoricalTotal(): Promise<HistoricalTotal> {
    return apiClient
      .get("/analytics/historical-total")
      .then((r) => r.data.data);
  },

  getPlatformCountrySummary(
    filters: AnalyticsFilters,
  ): Promise<PlatformCountryRow[]> {
    return apiClient
      .get("/analytics/platform-country-summary", { params: toParams(filters) })
      .then((r) => r.data.data);
  },

  getSongs(
    filters: AnalyticsFilters,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<AnalyticsSong>> {
    return apiClient
      .get("/analytics/songs", {
        params: toParams({ ...filters, page, limit }),
      })
      .then((r) => r.data.data);
  },

  getSplitOwnerInfo(): Promise<SplitOwnerInfo> {
    return apiClient
      .get("/analytics/split-owner-info")
      .then((r) => r.data.data);
  },

  getFilterOptions(): Promise<FilterOptions> {
    return apiClient.get("/analytics/filter-options").then((r) => r.data.data);
  },

  getSongPlatformSummary(isrc: string): Promise<PlatformCountryRow[]> {
    return apiClient
      .get("/analytics/platform-country-summary", { params: { isrc } })
      .then((r) => r.data.data);
  },
};
