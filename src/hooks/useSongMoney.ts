/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { accountingApi, type SongBalance } from "@/services/accounting";
import { collaboratorColor } from "@/utils/collaborators.utils";
import { buildWaterfall, distributable, type Share } from "@/utils/money.utils";

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
   */
  const shares = useMemo<Share[]>(() => {
    const list: Share[] = [];

    const ownerPercentage = Number(song?.ownerId?.split?.percentage ?? 0);
    if (ownerPercentage > 0) {
      list.push({
        id: "owner",
        name: "Tú (owner)",
        percentage: ownerPercentage,
        amount: Number(song?.ownerId?.amountOwed ?? (repartible * ownerPercentage) / 100),
        color: collaboratorColor(0),
        isOwner: true,
      });
    }

    (song?.collaborators ?? []).forEach((collaborator: any, index: number) => {
      const percentage = Number(collaborator?.split?.percentage ?? 0);
      if (percentage <= 0) return;
      list.push({
        id: collaborator?._id ?? collaborator?.id ?? `collab-${index}`,
        name: collaborator?.name ?? collaborator?.username ?? "Colaborador",
        role: resolveRole(collaborator),
        percentage,
        amount: Number(collaborator?.amountOwed ?? (repartible * percentage) / 100),
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
