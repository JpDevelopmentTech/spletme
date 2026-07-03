import { useEffect, useState } from "react";
import SongService from "@/services/songs";

interface SongsKpisState {
  totalSongs: number;
  totalIncome: number;
  totalStreams: number;
  withoutSplits: number;
  loading: boolean;
}

const INITIAL: SongsKpisState = {
  totalSongs: 0,
  totalIncome: 0,
  totalStreams: 0,
  withoutSplits: 0,
  loading: true,
};

/**
 * Obtiene los KPIs agregados de la biblioteca de canciones: total de canciones,
 * ingresos y streams (desde el resumen de rendimiento) y cuántas están sin splits.
 */
export function useSongsKpis(): SongsKpisState {
  const [state, setState] = useState<SongsKpisState>(INITIAL);

  useEffect(() => {
    let active = true;
    Promise.all([
      SongService.getSongsByParams("90d"),
      SongService.filterSongs({ hasSplits: false, page: 1, limit: 1 }),
    ])
      .then(([params, noSplit]) => {
        if (!active) return;
        const summary = params?.summary;
        const res = noSplit as unknown as {
          data?: { pagination?: { total?: number }; total?: number };
          pagination?: { total?: number };
        } | null;
        const withoutSplits =
          res?.data?.pagination?.total ?? res?.pagination?.total ?? res?.data?.total ?? 0;
        setState({
          totalSongs: summary?.songsWithMatches ?? 0,
          totalIncome: summary?.totalNetIncome ?? 0,
          totalStreams: summary?.totalStreams ?? 0,
          withoutSplits,
          loading: false,
        });
      })
      .catch(() => {
        if (active) setState((prev) => ({ ...prev, loading: false }));
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
