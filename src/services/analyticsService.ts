import axios from 'axios';
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
} from '../types/analytics.types';
import LocalStorageService from './localstorage';

const BASE = import.meta.env.VITE_BACKEND_URL ?? '';

function authHeaders() {
  const token = LocalStorageService.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
}

function toQueryString(filters: object): string {
  const params = new URLSearchParams();
  Object.entries(filters as Record<string, unknown>).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return params.toString() ? `?${params.toString()}` : '';
}

export const analyticsService = {
  getKpis(filters: AnalyticsFilters): Promise<AnalyticsKpis> {
    return axios
      .get(`${BASE}/api/v1/analytics/kpis${toQueryString(filters)}`, authHeaders())
      .then((r) => r.data.data);
  },

  getTransactions(
    filters: AnalyticsFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedResult<Transaction>> {
    return axios
      .get(
        `${BASE}/api/v1/analytics/transactions${toQueryString({ ...filters, page, limit })}`,
        authHeaders()
      )
      .then((r) => r.data.data);
  },

  getRevenueByPlatform(filters: AnalyticsFilters): Promise<RevenueByPlatformData> {
    return axios
      .get(`${BASE}/api/v1/analytics/revenue-by-platform${toQueryString(filters)}`, authHeaders())
      .then((r) => r.data.data);
  },

  getRevenueByStore(filters: AnalyticsFilters): Promise<PieChartEntry[]> {
    return axios
      .get(`${BASE}/api/v1/analytics/revenue-by-store${toQueryString(filters)}`, authHeaders())
      .then((r) => r.data.data);
  },

  getRevenueByCountry(filters: AnalyticsFilters): Promise<PieChartEntry[]> {
    return axios
      .get(`${BASE}/api/v1/analytics/revenue-by-country${toQueryString(filters)}`, authHeaders())
      .then((r) => r.data.data);
  },

  getTopSongs(filters: AnalyticsFilters): Promise<TopSong[]> {
    return axios
      .get(`${BASE}/api/v1/analytics/top-songs${toQueryString(filters)}`, authHeaders())
      .then((r) => r.data.data);
  },

  getTopArtists(filters: AnalyticsFilters): Promise<TopArtist[]> {
    return axios
      .get(`${BASE}/api/v1/analytics/top-artists${toQueryString(filters)}`, authHeaders())
      .then((r) => r.data.data);
  },

  getTopLabels(filters: AnalyticsFilters): Promise<TopLabel[]> {
    return axios
      .get(`${BASE}/api/v1/analytics/top-labels${toQueryString(filters)}`, authHeaders())
      .then((r) => r.data.data);
  },

  getHistoricalTotal(): Promise<HistoricalTotal> {
    return axios
      .get(`${BASE}/api/v1/analytics/historical-total`, authHeaders())
      .then((r) => r.data.data);
  },

  getPlatformCountrySummary(filters: AnalyticsFilters): Promise<PlatformCountryRow[]> {
    return axios
      .get(
        `${BASE}/api/v1/analytics/platform-country-summary${toQueryString(filters)}`,
        authHeaders()
      )
      .then((r) => r.data.data);
  },

  getSongs(
    filters: AnalyticsFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResult<AnalyticsSong>> {
    return axios
      .get(
        `${BASE}/api/v1/analytics/songs${toQueryString({ ...filters, page, limit })}`,
        authHeaders()
      )
      .then((r) => r.data.data);
  },

  getSplitOwnerInfo(): Promise<SplitOwnerInfo> {
    return axios
      .get(`${BASE}/api/v1/analytics/split-owner-info`, authHeaders())
      .then((r) => r.data.data);
  },

  getFilterOptions(): Promise<FilterOptions> {
    return axios
      .get(`${BASE}/api/v1/analytics/filter-options`, authHeaders())
      .then((r) => r.data.data);
  },
};
