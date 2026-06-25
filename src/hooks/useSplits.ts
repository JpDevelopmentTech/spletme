import { useState, useCallback } from "react";
import {
  splitsService,
  type Split,
  type CreateSplitRequest,
  type UpdateSplitRequest,
  type CreateSplitOwnerRequest,
} from "@/services/splits";

export const useSplits = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear un split
  const createSplit = useCallback(
    async (data: CreateSplitRequest): Promise<Split | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.createSplit([data]);
        return result?.[0] ?? null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error creating split";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Crear múltiples splits
  const createMultipleSplits = useCallback(
    async (songId: string, splits: CreateSplitRequest[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.createMultipleSplits({
          songId,
          splits: splits.map((split) => ({
            collaboratorId: split.collaboratorId,
            conditions: split.conditions,
          })),
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error creating multiple splits";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Obtener splits por canción
  const getSplitsBySong = useCallback(
    async (songId: string): Promise<Split[]> => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.getSplitsBySong(songId);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error fetching splits";
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getSongSplitHistory = useCallback(
    async (songId: string): Promise<Split[]> => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.getSongSplitHistory(songId);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error fetching split history";
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Obtener split por ID
  const getSplitById = useCallback(
    async (splitId: string): Promise<Split | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.getSplitById(splitId);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error fetching split";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Actualizar split
  const updateSplit = useCallback(
    async (
      splitId: string,
      data: UpdateSplitRequest,
    ): Promise<Split | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.updateSplit(splitId, data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error updating split";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Eliminar split
  const deleteSplit = useCallback(async (splitId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await splitsService.deleteSplit(splitId);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error deleting split";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estadísticas
  const getStats = useCallback(
    async (type: "owner" | "collaborator" = "owner") => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.getSplitsStats(type);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error fetching stats";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Calcular porcentaje total
  const calculateTotalPercentage = useCallback(
    async (
      songId: string,
      excludeCollaboratorId?: string,
      additionalPercentage: number = 0,
    ): Promise<number> => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.calculateTotalPercentage(
          songId,
          excludeCollaboratorId,
          additionalPercentage,
        );
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error calculating percentage";
        setError(errorMessage);
        return 0;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Crear split del owner
  const createOwnerSplit = useCallback(
    async (data: CreateSplitOwnerRequest): Promise<Split | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.createOwnerSplit(data);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error creating owner split";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Obtener mis splits
  const getMySplits = useCallback(
    async (
      type: "owner" | "collaborator" = "owner",
      page: number = 1,
      limit: number = 10,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const result = await splitsService.getMySplits(type, page, limit);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error fetching my splits";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createSplit,
    createMultipleSplits,
    getSplitsBySong,
    getSongSplitHistory,
    getSplitById,
    updateSplit,
    deleteSplit,
    getStats,
    calculateTotalPercentage,
    createOwnerSplit,
    getMySplits,
    clearError,
  };
};
