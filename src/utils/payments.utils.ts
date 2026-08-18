import type { RoyaltyPayment } from "@/services/payments";

/** Un pago concreto a una persona, extraído del reparto de un cobro. */
export interface RecentPayment {
  id: string;
  collaboratorName: string;
  songTitle: string;
  amount: number;
  date: string;
  status: RoyaltyPayment["status"];
}

/**
 * Aplana los cobros de regalías a una línea por persona.
 *
 * Un cobro paga una canción y se reparte entre varios colaboradores, pero lo que
 * se quiere leer en «últimos pagos» es a quién le llegó cuánto.
 */
export function flattenRoyaltyPayments(
  royaltyPayments: RoyaltyPayment[],
  limit = 5,
): RecentPayment[] {
  const rows: RecentPayment[] = [];

  for (const payment of royaltyPayments) {
    const songTitle =
      typeof payment.songId === "object" && payment.songId
        ? (payment.songId.trackTitle ?? "Canción")
        : "Canción";

    for (const [index, item] of (payment.breakdown ?? []).entries()) {
      const collaborator = item.collaboratorId;
      const name =
        typeof collaborator === "object" && collaborator
          ? (collaborator.name ?? collaborator.username ?? collaborator.email ?? "Colaborador")
          : "Colaborador";

      rows.push({
        id: `${payment._id}-${index}`,
        collaboratorName: name,
        songTitle,
        amount: item.amount,
        date: payment.createdAt,
        status: payment.status,
      });
    }
  }

  return rows
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
