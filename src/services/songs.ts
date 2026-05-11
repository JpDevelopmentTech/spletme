import { apiClient } from "@/infrastructure/http/axiosClient";

export type PaymentValidationSeverity = "success" | "info" | "warning" | "error";

export interface PaymentValidationIssue {
  code: string;
  severity: PaymentValidationSeverity;
  message: string;
}

export interface PaymentValidationResult {
  canProceed: boolean;
  totalCollaborators: number;
  payableCollaborators: number;
  issues: PaymentValidationIssue[];
}

// ── Helpers de validación de pagos (sin dependencias de red) ──────────────────

const getPercentageFromSplitConditions = (collaborator: Record<string, unknown>): number => {
  const conditions = collaborator?.split as { conditions?: unknown[] } | undefined;
  if (!Array.isArray(conditions?.conditions) || conditions.conditions.length === 0) return 0;
  const cond = conditions.conditions.find((c: unknown) => {
    const co = c as Record<string, unknown>;
    return co?.type === "percentage" || co?.percentage !== undefined || co?.value !== undefined;
  }) as Record<string, unknown> | undefined;
  return Number(cond?.percentage ?? cond?.value ?? 0);
};

const getCollaboratorPercentage = (collaborator: Record<string, unknown>): number => {
  const direct = Number(collaborator?.percentage ?? 0);
  return direct > 0 ? direct : getPercentageFromSplitConditions(collaborator);
};

const getCollaboratorAmountToPay = (collaborator: Record<string, unknown>): number => {
  const direct = Number(collaborator?.amountToPay ?? 0);
  if (direct > 0) return direct;
  const splits = collaborator?.splitPayment as Array<{ calculation?: { amountToPay?: number } }> | undefined;
  return Number(splits?.[0]?.calculation?.amountToPay ?? 0);
};

const hasActiveWallet = (collaborator: Record<string, unknown>): boolean => {
  const wallet = collaborator?.wallet as Record<string, unknown> | undefined;
  const status = String(wallet?.status ?? collaborator?.walletStatus ?? "").toLowerCase();
  return Boolean(
    collaborator?.hasWallet === true ||
    collaborator?.walletActive === true ||
    wallet?.isActive === true ||
    collaborator?.stripeConnected === true ||
    collaborator?.stripeAccountConnected === true ||
    (collaborator?.stripeConnect as Record<string, unknown>)?.isLoggedIn === true ||
    status === "active" || status === "enabled" || status === "verified"
  );
};

const getDisplayName = (collaborator: Record<string, unknown>, idx: number): string =>
  String(collaborator?.name ?? collaborator?.username ?? collaborator?.email ??
    collaborator?.id ?? collaborator?._id ?? `Colaborador ${idx + 1}`);

export const validatePayAllPayment = ({
  song,
  isStripeConnected,
}: {
  song: Record<string, unknown> | null;
  isStripeConnected: boolean;
}): PaymentValidationResult => {
  const issues: PaymentValidationIssue[] = [];
  const collaborators = Array.isArray(song?.collaborators) ? (song.collaborators as Record<string, unknown>[]) : [];
  const totalCollaborators = collaborators.length;

  if (!song) {
    issues.push({ code: "song-not-found", severity: "error", message: "No se pudo cargar la canción. Recarga la página e inténtalo de nuevo." });
    return { canProceed: false, totalCollaborators: 0, payableCollaborators: 0, issues };
  }

  if (!isStripeConnected) {
    issues.push({ code: "wallet-not-connected", severity: "error", message: "No puedes pagar a todos porque tu wallet de Stripe no está conectada o no está activa." });
  }

  let payableCollaborators = 0;

  collaborators.forEach((collaborator, idx) => {
    const name = getDisplayName(collaborator, idx);
    const percentage = getCollaboratorPercentage(collaborator);
    const amountToPay = getCollaboratorAmountToPay(collaborator);
    const walletActive = hasActiveWallet(collaborator);

    if (percentage <= 0) {
      issues.push({ code: "no-split-percentage", severity: "warning", message: `${name} no tiene un porcentaje de split asignado.` });
    }
    if (amountToPay <= 0) {
      issues.push({ code: "no-amount-to-pay", severity: "info", message: `${name} no tiene monto pendiente de pago.` });
    }
    if (!walletActive) {
      issues.push({ code: "wallet-inactive", severity: "warning", message: `${name} no tiene una wallet activa para recibir pagos.` });
    }

    if (percentage > 0 && amountToPay > 0 && walletActive) {
      payableCollaborators++;
      issues.push({ code: "all-valid", severity: "success", message: `${name} puede recibir el pago de $${amountToPay.toFixed(2)}.` });
    }
  });

  const hasBlockingIssues = issues.some((i) => i.code !== "all-valid");
  return { canProceed: !hasBlockingIssues && isStripeConnected && payableCollaborators > 0, totalCollaborators, payableCollaborators, issues };
};

// ── SongService ───────────────────────────────────────────────────────────────

class SongService {
  private readonly BASE = "/songs";

  /** Obtiene canciones del usuario con paginación */
  async getSongs(page: number, limit: number) {
    try {
      const response = await apiClient.get(`${this.BASE}/by-user?page=${page}&limit=${limit}`);
      return response.data;
    } catch {
      return null;
    }
  }

  /** Sube canciones desde un archivo CSV */
  async uploadSongs(file: FormData) {
    try {
      const response = await apiClient.post(`${this.BASE}/by-csv`, file);
      return response.data;
    } catch {
      return null;
    }
  }

  /** Acepta una invitación de colaboración */
  async acceptCollaboration(token: string) {
    try {
      const response = await apiClient.post(`${this.BASE}/accept-invitation`, { token });
      return response.data;
    } catch {
      return null;
    }
  }

  /** Agrega un colaborador a una canción */
  async addCollaborator({ songId, collaboratorEmail, collaboratorId }: {
    songId: string;
    collaboratorEmail?: string;
    collaboratorId?: string;
  }) {
    try {
      const response = await apiClient.post(`${this.BASE}/${songId}/add-collaborator`, {
        collaboratorEmail,
        collaboratorId,
      });
      return response.data;
    } catch {
      return null;
    }
  }

  /** Obtiene una canción por ID */
  async getSong(id: string) {
    try {
      const response = await apiClient.get(`${this.BASE}/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }

  /** Obtiene una canción por su ISRC */
  async getSongByIsrc(isrc: string) {
    try {
      const response = await apiClient.get(`${this.BASE}/by-isrc/${encodeURIComponent(isrc)}`);
      return response.data;
    } catch {
      return null;
    }
  }

  /** Obtiene canciones filtradas por país, plataforma y fechas */
  async getSongsByFilter(country: string, platform: string, startDate: string, endDate: string) {
    try {
      const response = await apiClient.get(`${this.BASE}/by-params`, {
        params: { country, platform, startDate, endDate },
      });
      return response.data;
    } catch {
      return null;
    }
  }

  /** Obtiene métricas de pagos de una canción por período */
  async getMetricPayments(songId: string, date: "month" | "day" | "year") {
    try {
      const response = await apiClient.get(`${this.BASE}/get-metric-payments/${songId}/${date}`);
      return response.data;
    } catch {
      return null;
    }
  }

  /** Busca canciones por texto */
  async searchSongs(query: string, page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`${this.BASE}/search`, {
        params: { q: query, page, limit },
      });
      return response.data;
    } catch {
      return null;
    }
  }

  /** Busca canciones por código ISRC o UPC */
  async searchSongsByCode(code: string, page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`${this.BASE}/search-code`, {
        params: { code, page, limit },
      });
      return response.data;
    } catch {
      return null;
    }
  }

  /** Obtiene las canciones con más streams */
  async getTopByStreams() {
    try {
      const response = await apiClient.get(`${this.BASE}/top-by-streams`);
      return response.data;
    } catch {
      return null;
    }
  }

  /** Obtiene estadísticas por plataforma de todas las canciones */
  async getStadisticsByPlatformAll() {
    try {
      const response = await apiClient.get(`${this.BASE}/getStadisticsByPlatformAll`);
      return response.data;
    } catch {
      return null;
    }
  }
}

export default new SongService();
