/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { accountingApi, type SongBalance } from "@/services/accounting";
import { collaboratorColor } from "@/utils/collaborators.utils";
import { viewerOwnsSong } from "@/utils/ownerVisibility";
import {
  buildWaterfall,
  collaboratorPool,
  distributable,
  type Share,
} from "@/utils/money.utils";

interface UseSongMoneyOptions {
  songId: string;
  song: any;
  /** Fuerza recargar la contabilidad tras registrar un costo o un pago. */
  refreshKey?: number;
}

/**
 * Reúne las cifras de una canción en la cascada del dinero.
 *
 * El bruto y el neto vienen con la canción; los egresos, de contabilidad. Se
 * piden aquí porque el escalón de costos no se puede dibujar sin ellos, y antes
 * vivían solo dentro de su propia pestaña.
 */
export function useSongMoney({ songId, song, refreshKey = 0 }: UseSongMoneyOptions) {
  const [balance, setBalance] = useState<SongBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    if (!songId) return;
    let alive = true;
    setBalanceLoading(true);

    accountingApi
      .getBalanceBySongId(songId)
      .then((data) => alive && setBalance(data))
      .catch(() => alive && setBalance(null))
      .finally(() => alive && setBalanceLoading(false));

    return () => {
      alive = false;
    };
  }, [songId, refreshKey]);

  const grossIncome = Number(song?.totalGrossIncome ?? 0);
  const netIncome = Number(song?.totalNetIncome ?? 0);
  const expenses = Number(balance?.totalEgresos ?? 0);
  const expenseCount = Number(balance?.totalEntries ?? 0);

  const steps = useMemo(
    () =>
      buildWaterfall({
        grossIncome,
        netIncome,
        expenses,
        expenseCount,
        distributorName: song?.distributorId?.name ?? null,
      }),
    [grossIncome, netIncome, expenses, expenseCount, song?.distributorId?.name],
  );

  const repartible = useMemo(
    () => distributable(netIncome, expenses),
    [netIncome, expenses],
  );

  /**
   * El owner y los colaboradores, en el orden en que se leen. Los importes salen
   * de `amountOwed`, que el backend calcula en vivo; el porcentaje, del split.
   *
   * Las dos bases no son la misma: cada colaborador tiene su parte de lo
   * repartible y el owner retiene un porcentaje de esa parte, que puede haber
   * pactado distinto con cada uno. El cálculo de respaldo (cuando el backend no
   * manda `amountOwed`) usa la retención única, que es lo más parecido que se
   * puede reconstruir sin los montos del servidor.
   */
  const shares = useMemo<Share[]>(() => {
    const list: Share[] = [];

    // Segunda barrera: aunque la cascada solo se pinta para el dueño, si un día
    // se montara para otro, el owner no entraría en la lista igualmente.
    const ownerPct = viewerOwnsSong(song) ? Number(song?.ownerId?.split?.percentage ?? 0) : 0;
    if (ownerPct > 0) {
      list.push({
        id: "owner",
        name: "Tú (owner)",
        percentage: ownerPct,
        amount: Number(song?.ownerId?.amountOwed ?? (repartible * ownerPct) / 100),
        color: collaboratorColor(0),
        isOwner: true,
      });
    }

    const pool = collaboratorPool(repartible, ownerPct);

    (song?.collaborators ?? []).forEach((collaborator: any, index: number) => {
      const percentage = Number(collaborator?.split?.percentage ?? 0);
      if (percentage <= 0) return;
      list.push({
        id: collaborator?._id ?? collaborator?.id ?? `collab-${index}`,
        name: collaborator?.name ?? collaborator?.username ?? "Colaborador",
        role: resolveRole(collaborator),
        percentage,
        // Su retención pactada; sin ella paga la del owner, como todos.
        ownerRate: collaborator?.split?.ownerRate ?? null,
        amount: Number(collaborator?.amountOwed ?? (pool * percentage) / 100),
        pending: Number(collaborator?.amountPending ?? collaborator?.amountOwed ?? 0),
        color: collaboratorColor(index + 1),
      });
    });

    return list;
  }, [song, repartible]);

  return {
    steps,
    shares,
    repartible,
    grossIncome,
    netIncome,
    expenses,
    balance,
    balanceLoading,
  };
}

function resolveRole(collaborator: any): string | undefined {
  const roles: string[] = collaborator?.roles ?? [];
  if (roles.some((role) => String(role).toLowerCase().includes("label"))) return "Sello";
  return roles[0] ? String(roles[0]) : undefined;
}
