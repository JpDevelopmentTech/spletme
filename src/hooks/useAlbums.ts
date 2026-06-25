import { useState, useEffect, useCallback } from "react";
import AlbumService from "../services/albums";
import type { Album, AlbumsPagination } from "../models/album";

interface UseAlbumsReturn {
  // State
  albums: Album[];
  loading: boolean;
  error: string | null;
  pagination: AlbumsPagination | null;

  // Actions
  getAlbums: (skip?: number, limit?: number) => Promise<void>;
  getAlbumByUPC: (upc: string) => Promise<Album | null>;
  loadMoreAlbums: () => Promise<void>;
  refreshAlbums: () => Promise<void>;
  clearError: () => void;

  // Computed
  hasMoreAlbums: boolean;
}

export const useAlbums = (
  page: number,
  limit: number,
  autoLoad: boolean = true,
): UseAlbumsReturn => {
  const currentSkip = Math.max(0, (page - 1) * limit);
  const initialSkip = currentSkip;
  const initialLimit = limit;

  // State
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<AlbumsPagination | null>(null);

  // Get albums with pagination
  const getAlbums = useCallback(
    async (skip: number = initialSkip, limit: number = initialLimit) => {
      setLoading(true);
      setError(null);

      try {
        const response = await AlbumService.getAlbums(skip, limit);

        if (response.success && "data" in response) {
          if (skip === 0) {
            // Replace albums if starting from beginning
            setAlbums(response.data);
          } else {
            // Append albums if loading more
            setAlbums((prev) => [...prev, ...response.data]);
          }
          setPagination(response.pagination);
        } else if ("message" in response) {
          setError(response.message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error loading albums";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [initialSkip, initialLimit],
  );

  // Get specific album by UPC
  const getAlbumByUPC = useCallback(async (upc: string): Promise<Album | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await AlbumService.getAlbumByUPC(upc);

      if (response.success && "data" in response) {
        return response.data;
      } else if ("message" in response) {
        setError(response.message);
        return null;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error loading album";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more albums (pagination)
  const loadMoreAlbums = useCallback(async () => {
    if (!pagination || loading) return;

    const nextSkip = pagination.skip + pagination.limit;
    await getAlbums(nextSkip, pagination.limit);
  }, [pagination, loading, getAlbums]);

  // Refresh albums (reload from beginning)
  const refreshAlbums = useCallback(async () => {
    await getAlbums(0, initialLimit);
  }, [getAlbums, initialLimit]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Computed values
  const hasMoreAlbums = pagination?.hasMore ?? false;

  // Auto-load albums on mount
  useEffect(() => {
    if (autoLoad) {
      getAlbums(currentSkip, limit);
    }
  }, [autoLoad, getAlbums, currentSkip, limit]);

  return {
    // State
    albums,
    loading,
    error,
    pagination,

    // Actions
    getAlbums,
    getAlbumByUPC,
    loadMoreAlbums,
    refreshAlbums,
    clearError,

    // Computed
    hasMoreAlbums,
  };
};

export default useAlbums;
