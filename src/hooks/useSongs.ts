import { useEffect, useState, useCallback } from "react";
import SongService from "../services/songs";

interface Release {
  reportMonth: string;
  salesMonth: string;
  platform: string;
  country: string;
  upc: string;
  catalogNumber: string;
  streamingSubscriptionType: string;
  releaseType: string;
  salesType: string;
  quantity: number;
  customerPaymentCurrency: string;
  unitPrice: number;
  mechanicalReproductionCosts: number;
  grossIncome: number;
  netIncome: number;
}

interface Song {
  _id: string;
  isrc: string;
  artistName: string;
  artisticLabel: string;
  releases: Release[];
  totalGrossIncome: number;
  totalNetIncome: number;
  totalStreams: number;
  trackTitle: string;
  spotifyData?: {
    album?: {
      images?: { url: string; width: number; height: number }[];
    };
  };
}

interface SongsPagination {
  total: number | null;
  page: number;
  limit: number;
  totalPages: number | null;
  hasMore: boolean | null;
}

const UseSongs = (page: number, limit: number) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<SongsPagination | null>(null);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const getSongs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await SongService.getSongs(page, limit);
      const data = Array.isArray(response?.data) ? response.data : [];
      setSongs(data);

      const rawPagination = response?.pagination ?? response?.meta?.pagination ?? null;

      const resolvedPage = Number(rawPagination?.page ?? response?.page ?? page);
      const resolvedLimit = Number(rawPagination?.limit ?? response?.limit ?? limit);

      const rawTotal =
        rawPagination?.total ??
        response?.total ??
        response?.totalCount ??
        response?.totalItems ??
        response?.count;
      const numericTotal = Number(rawTotal);
      const resolvedTotal = Number.isFinite(numericTotal) ? numericTotal : null;

      const rawTotalPages = rawPagination?.totalPages ?? response?.totalPages;
      const numericTotalPages = Number(rawTotalPages);
      const resolvedTotalPages = Number.isFinite(numericTotalPages)
        ? numericTotalPages
        : resolvedTotal !== null
          ? Math.max(1, Math.ceil(resolvedTotal / resolvedLimit))
          : null;

      const rawHasMore = rawPagination?.hasMore ?? response?.hasMore;
      const resolvedHasMore =
        typeof rawHasMore === "boolean"
          ? rawHasMore
          : resolvedTotalPages !== null
            ? resolvedPage < resolvedTotalPages
            : null;

      setPagination({
        total: resolvedTotal,
        limit: resolvedLimit,
        page: resolvedPage,
        totalPages: resolvedTotalPages,
        hasMore: resolvedHasMore,
      });
    } catch (error) {
      console.error(error);
      setSongs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const searchSongs = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await SongService.searchSongs(query, 1, limit);
        setSearchResults(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [limit],
  );

  const searchSongsByCode = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await SongService.searchSongsByCode(code, 1, limit);
        setSearchResults(response?.data || []);
      } catch (error) {
        console.error(error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [limit],
  );

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  const uploadSongs = async (file: FormData) => {
    setLoading(true);
    try {
      await SongService.uploadSongs(file);
      await getSongs();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSongs();
  }, [getSongs]);

  return {
    songs,
    loading,
    pagination,
    getSongs,
    uploadSongs,
    searchSongs,
    searchResults,
    isSearching,
    clearSearch,
    searchSongsByCode,
  };
};

export default UseSongs;
