import axios from "axios";

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

const getPercentageFromSplitConditions = (collaborator: any) => {
  const conditions = collaborator?.split?.conditions;
  if (!Array.isArray(conditions) || conditions.length === 0) return 0;

  const percentageCondition = conditions.find(
    (condition: any) =>
      condition?.type === "percentage" ||
      condition?.percentage !== undefined ||
      condition?.value !== undefined,
  );

  if (!percentageCondition) return 0;
  return Number(percentageCondition.percentage ?? percentageCondition.value ?? 0);
};

const getCollaboratorPercentage = (collaborator: any) => {
  const directPercentage = Number(collaborator?.percentage ?? 0);
  if (directPercentage > 0) return directPercentage;
  return getPercentageFromSplitConditions(collaborator);
};

const getCollaboratorAmountToPay = (collaborator: any) => {
  const directAmount = Number(collaborator?.amountToPay ?? 0);
  if (directAmount > 0) return directAmount;

  const splitPaymentAmount = Number(
    collaborator?.splitPayment?.[0]?.calculation?.amountToPay ?? 0,
  );
  return splitPaymentAmount > 0 ? splitPaymentAmount : 0;
};

const hasActiveWallet = (collaborator: any) => {
  const wallet = collaborator?.wallet;
  const walletStatus = String(wallet?.status ?? collaborator?.walletStatus ?? "").toLowerCase();

  return Boolean(
    collaborator?.hasWallet === true ||
      collaborator?.walletActive === true ||
      collaborator?.wallet?.isActive === true ||
      collaborator?.stripeConnected === true ||
      collaborator?.stripeAccountConnected === true ||
      collaborator?.stripeConnect?.isLoggedIn === true ||
      walletStatus === "active" ||
      walletStatus === "enabled" ||
      walletStatus === "verified",
  );
};

const getDisplayName = (collaborator: any, idx: number) =>
  collaborator?.name ||
  collaborator?.username ||
  collaborator?.email ||
  collaborator?.id ||
  collaborator?._id ||
  `Colaborador ${idx + 1}`;

export const validatePayAllPayment = ({
  song,
  isStripeConnected,
}: {
  song: any;
  isStripeConnected: boolean;
}): PaymentValidationResult => {
  const issues: PaymentValidationIssue[] = [];
  const collaborators = Array.isArray(song?.collaborators) ? song.collaborators : [];
  const totalCollaborators = collaborators.length;

  if (!song) {
    issues.push({
      code: "song-not-found",
      severity: "error",
      message: "No se pudo cargar la canción. Recarga la página e inténtalo de nuevo.",
    });
    return { canProceed: false, totalCollaborators: 0, payableCollaborators: 0, issues };
  }

  if (!isStripeConnected) {
    issues.push({
      code: "wallet-not-connected",
      severity: "error",
      message:
        "No puedes pagar a todos porque tu wallet de Stripe no está conectada o no está activa.",
    });
  }

  if (Number(song?.totalNetIncome ?? 0) <= 0) {
    issues.push({
      code: "no-income",
      severity: "error",
      message:
        "No puedes pagar a todos porque esta canción no tiene ingresos netos disponibles para distribuir.",
    });
  }

  if (totalCollaborators === 0) {
    issues.push({
      code: "no-collaborators",
      severity: "error",
      message: "No puedes pagar a todos porque esta canción no tiene colaboradores registrados.",
    });
  }

  const collaboratorsWithoutSplit: string[] = [];
  const collaboratorsWithoutWallet: string[] = [];
  const collaboratorsWithoutAmount: string[] = [];
  let payableCollaborators = 0;

  collaborators.forEach((collaborator: any, idx: number) => {
    const displayName = getDisplayName(collaborator, idx);
    const hasSplit = getCollaboratorPercentage(collaborator) > 0;
    const hasWallet = hasActiveWallet(collaborator);
    const amountToPay = getCollaboratorAmountToPay(collaborator);

    if (!hasSplit) collaboratorsWithoutSplit.push(displayName);
    if (!hasWallet) collaboratorsWithoutWallet.push(displayName);
    if (amountToPay <= 0) collaboratorsWithoutAmount.push(displayName);

    if (hasSplit && hasWallet && amountToPay > 0) {
      payableCollaborators += 1;
    }
  });

  if (collaboratorsWithoutSplit.length > 0) {
    issues.push({
      code: "inactive-splits",
      severity: "error",
      message: `No puedes pagar a todos: estos colaboradores no tienen split activo (${collaboratorsWithoutSplit.join(", ")}).`,
    });
  }

  if (collaboratorsWithoutWallet.length > 0) {
    issues.push({
      code: "inactive-wallets",
      severity: "error",
      message: `No puedes pagar a todos: estos colaboradores no tienen wallet activa (${collaboratorsWithoutWallet.join(", ")}).`,
    });
  }

  if (collaboratorsWithoutAmount.length > 0) {
    issues.push({
      code: "no-amount-to-pay",
      severity: "error",
      message: `No puedes pagar a todos: falta monto por pagar para (${collaboratorsWithoutAmount.join(", ")}).`,
    });
  }

  if (payableCollaborators === 0) {
    issues.push({
      code: "no-eligible-collaborators",
      severity: "error",
      message: "No hay colaboradores elegibles para ejecutar el pago masivo.",
    });
  }

  if (issues.length === 0) {
    issues.push({
      code: "all-valid",
      severity: "success",
      message: `Validación completada: ${payableCollaborators} colaboradores listos para pago.`,
    });
  }

  const hasBlockingIssues = issues.some((issue) => issue.code !== "all-valid");
  const canProceed = !hasBlockingIssues && isStripeConnected && payableCollaborators > 0;

  return {
    canProceed,
    totalCollaborators,
    payableCollaborators,
    issues,
  };
};

class SongService {
  private readonly URI = import.meta.env.VITE_URL_API + "/api/v1/songs";
  private readonly token = localStorage.getItem("token");

  async getSongs(page :number, limit :number) {
    try {
        const endpoint = this.URI + "/by-user?page=" + page + "&limit=" + limit;
        const response = await axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting songs:", error);
        return null;
    }
  }

  async uploadSongs(file: FormData) {
    try {
      console.log(this.token);
      const endpoint = this.URI + "/by-csv";
      const response = await axios.post(endpoint, file, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading songs:", error);
      return null;
    }
  }

  async acceptCollaboration(token: string){
    try {
      const endpoint = this.URI + "/accept-invitation";
      const response = await axios.post(endpoint, {
        token
      },{
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return null
    }
  }

  async addCollaborator({
    songId,
    collaboratorEmail,
    collaboratorId,
  }: {
    songId: string;
    collaboratorEmail?: string;
    collaboratorId?: string;
  }){
    try {
      const endpoint = this.URI + "/" + songId + "/add-collaborator";
      const response = await axios.post(endpoint, {
        collaboratorEmail,
        collaboratorId,
      }, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return null
    }
  }

  async getSong(id: string) {
    try {
      const endpoint = this.URI + "/" + id;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting song:", error);
      return null;
    }
  }

  async getSongsByFilter(country: string, platform: string, startDate: string, endDate: string) {
    try {
      const endpoint = this.URI + "/by-params?country=" + country + "&platform=" + platform + "&startDate=" + startDate + "&endDate=" + endDate;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting songs by filter:", error);
        return null;
      }
  }

  async getMetricPayments(songId: string, date: 'month' | 'day' | 'year') {
    try {
      const endpoint = this.URI + "/get-metric-payments/" + songId + "/" + date;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting metric payments:", error);
      return null;
    }
  }

  async searchSongs(query: string, page: number = 1, limit: number = 10) {
    try {
      const endpoint = this.URI + "/search?q=" + encodeURIComponent(query) + "&page=" + page + "&limit=" + limit;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching songs:", error);
      return null;
    }
  }

  async searchSongsByCode(code: string, page: number = 1, limit: number = 10) {
    try {
      const endpoint = this.URI + "/search-code?code=" + encodeURIComponent(code) + "&page=" + page + "&limit=" + limit;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching songs by code:", error);
      return null;
    }
  }

  async getTopByStreams() {
    try {
      const endpoint = this.URI + "/top-by-streams";
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting top songs by streams:", error);
      return null;
    }
  }

  async getStadisticsByPlatformAll() {
    try {
      const endpoint = this.URI + "/getStadisticsByPlatformAll";
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting stadistics by platform:", error);
      return null;
    }
  }
}

export default new SongService();
