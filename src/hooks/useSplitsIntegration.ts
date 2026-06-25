import { useState, useEffect, useCallback } from "react";
import { useSplits } from "./useSplits";
import {
  splitsService,
  type Split,
  type CreateSplitRequest,
} from "../services/splits";

interface UseSplitsIntegrationOptions {
  songId?: string;
  userId?: string;
  autoLoad?: boolean;
}

interface UseSplitsIntegrationReturn {
  // Current split state
  splits: Split[];
  splitExists: boolean;

  // Loading states
  loading: boolean;

  // Error states
  error: string | null;

  // Split operations
  createOrUpdateSplit: (data: CreateSplitRequest) => Promise<Split | null>;
  deleteSplit: (splitId: string) => Promise<void>;

  // Clear functions
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useSplitsIntegration = (
  options: UseSplitsIntegrationOptions = {},
): UseSplitsIntegrationReturn => {
  const { songId, autoLoad = true } = options;

  // Core hooks
  const {
    loading,
    error,
    createSplit,
    deleteSplit: deleteSplitCore,
    getSplitsBySong,
    clearError: clearSplitError,
  } = useSplits();

  // Local state
  const [splits, setSplits] = useState<Split[]>([]);

  // Load splits function
  const loadSplits = useCallback(async () => {
    if (songId) {
      const result = await getSplitsBySong(songId);
      setSplits(result);
    }
  }, [songId, getSplitsBySong]);

  // Auto-load data when component mounts
  useEffect(() => {
    if (autoLoad && songId) {
      loadSplits();
    }
  }, [songId, autoLoad, loadSplits]);

  // Computed values
  const splitExists = splits.length > 0;

  // Split operations
  const createOrUpdateSplit = useCallback(
    async (data: CreateSplitRequest) => {
      const result = await createSplit(data);
      if (result && songId) {
        await loadSplits();
      }
      return result;
    },
    [createSplit, songId, loadSplits],
  );

  const deleteSplitWrapper = useCallback(
    async (splitId: string) => {
      await deleteSplitCore(splitId);
      if (songId) {
        await loadSplits();
      }
    },
    [deleteSplitCore, songId, loadSplits],
  );

  // Clear functions
  const clearError = useCallback(() => {
    clearSplitError();
  }, [clearSplitError]);

  // Refresh all data
  const refresh = useCallback(async () => {
    if (songId) {
      await loadSplits();
    }
  }, [songId, loadSplits]);

  return {
    // Current split state
    splits,
    splitExists,

    // Loading states
    loading,

    // Error states
    error,

    // Split operations
    createOrUpdateSplit,
    deleteSplit: deleteSplitWrapper,

    // Clear functions
    clearError,
    refresh,
  };
};

// Hook for quick split status check
export const useSplitStatus = (songId?: string) => {
  const [splitExists, setSplitExists] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (songId) {
      setLoading(true);
      splitsService
        .getSplitsBySong(songId)
        .then((splits) => setSplitExists(splits.length > 0))
        .catch(() => setSplitExists(false))
        .finally(() => setLoading(false));
    }
  }, [songId]);

  return { splitExists, loading };
};
