import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Music,
  Users,
  Award,
  ArrowLeft,
  AlertCircle,
  Play,
  LayoutDashboard,
  Receipt,
  GitBranch,
  FolderOpen,
} from "lucide-react";
import PaymentsService from "@/services/payments";
import type { PaymentReadiness } from "@/services/payments";
import AddCollaborator from "../../collaborators/components/addCollaborator";
import Table from "./components/table";
import { useParams, useNavigate } from "react-router-dom";
import Platforms from "./components/platforms";
import Historyofsplits from "./components/historyofsplits";
import Extraordinarycosts from "./components/extraordinarycosts";
import useSong from "../../../../hooks/useSong";
import StripeConnectLoginModal from "../../../../components/modal/StripeConnectLoginModal";
import StripePaymentModal from "../../../../components/modal/StripePaymentModal";
import LocalStorageService from "../../../../services/localstorage";
import SongPaymentsHistory from "../../../../components/PaymentHistory/SongPaymentsHistory";
import useCurrentCollaborator from "../../../../hooks/useCurrentCollaborator";
import ValidationToastQueue, {
  ValidationToastItem,
  ValidationToastType,
} from "../../../../components/alert/ValidationToastQueue";
import Behavior from "../../dealers/components/behavior";
import DocumentManager from "./components/documentManager";
import { CopyButton } from "@/components/ui/CopyButton";
import { SongCollaboratorsSummary } from "@/components/music/SongCollaboratorsSummary";
import { SongRecentPayments } from "@/components/music/SongRecentPayments";
import RoyaltiesService from "@/services/royalties";
import type { RoyaltyRequest } from "@/services/royalties";

export default function Song() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { song, loading, getCollaboratorsInfo, getOwnerPercentage, getOwnerTotalOwed } = useSong({
    id: id || "",
  });
  const { getCurrentUserPercentage, getCurrentUserAmount } = useCurrentCollaborator({
    collaborators: song?.collaborators || [],
  });
  const [showStripeLoginModal, setShowStripeLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toasts, setToasts] = useState<ValidationToastItem[]>([]);
  const [paymentHistoryRefresh, setPaymentHistoryRefresh] = useState(0);
  const [readiness, setReadiness] = useState<PaymentReadiness | null>(null);
  const [myRoyaltyRequest, setMyRoyaltyRequest] = useState<RoyaltyRequest | null>(null);
  const [royaltyRequestLoading, setRoyaltyRequestLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "resumen" | "colaboradores" | "pagos" | "splits" | "documentos"
  >("resumen");

  useEffect(() => {
    if (!id) return;
    PaymentsService.getPaymentReadiness(id).then((res) => {
      if (!res.error && res.data) setReadiness(res.data);
    });
  }, [id, paymentHistoryRefresh]);

  useEffect(() => {
    RoyaltiesService.getMyRequests().then((res) => {
      if (!res.error && res.data) {
        const match = res.data.find((r) => {
          const songIdVal = typeof r.songId === "string" ? r.songId : r.songId._id;
          return songIdVal === id;
        });
        setMyRoyaltyRequest(match ?? null);
      }
    });
  }, [id]);

  const addToast = (
    type: ValidationToastType,
    message: string,
    extra?: Partial<ValidationToastItem>,
  ) => {
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type,
        message,
        ...extra,
      },
    ]);
  };

  const dequeueToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getUserDisplayPercentage = () => {
    const collaboratorPercentage = getCurrentUserPercentage();
    if (collaboratorPercentage && collaboratorPercentage > 0) {
      return collaboratorPercentage;
    }
    return getOwnerPercentage();
  };

  const getUserDisplayAmount = () => {
    const collaboratorAmount = getCurrentUserAmount();
    if (collaboratorAmount && parseFloat(collaboratorAmount) > 0) {
      return collaboratorAmount;
    }
    const ownerPct = getOwnerPercentage();
    const totalIncome = song?.totalNetIncome || 0;
    return ((ownerPct / 100) * totalIncome).toFixed(2);
  };

  const handlePayAllClick = () => {
    // Pre-chequeo: si la canción no está lista para pagar, se avisan los problemas
    // y no se abre el modal. El backend revalida lo mismo al confirmar el pago.
    if (readiness && !readiness.canPay) {
      readiness.issues.forEach((issue) => addToast("error", issue.message));
      return;
    }
    setShowPaymentModal(true);
  };

  const handleStripeLoginSuccess = () => {
    addToast(
      "success",
      "¡Inicio de sesión exitoso! Te has conectado correctamente con Stripe Connect.",
    );
  };

  const handleRequestRoyalties = async () => {
    if (!id) return;
    setRoyaltyRequestLoading(true);
    const res = await RoyaltiesService.requestRoyalties(id);
    setRoyaltyRequestLoading(false);
    if (res.error) {
      addToast("error", res.message || "Error al solicitar regalías");
    } else {
      addToast("success", "¡Solicitud enviada! El owner recibirá un correo para aprobarla.");
      // Refresh the request status
      const listRes = await RoyaltiesService.getMyRequests();
      if (!listRes.error && listRes.data) {
        const match = listRes.data.find((r) => {
          const songIdVal = typeof r.songId === "string" ? r.songId : r.songId._id;
          return songIdVal === id;
        });
        setMyRoyaltyRequest(match ?? null);
      }
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentHistoryRefresh((prev) => prev + 1);
    addToast(
      "success",
      "¡Pago procesado exitosamente! Los colaboradores recibirán su parte correspondiente.",
    );
  };

  const ownerAmount = getOwnerTotalOwed();
  const totalNetIncome = song?.totalNetIncome || 0;
  // Usar collaboratorsEarnings del backend si está disponible, si no calcular
  // Total a pagar = lo PENDIENTE de los colaboradores (devengado − ya pagado).
  const totalToPay =
    song?.collaboratorsPending ??
    song?.collaboratorsEarnings ??
    Math.max(0, (song?.totalNetIncome || 0) - ownerAmount);
  const currentUser = LocalStorageService.getItem("user");
  const normalizeIdentity = (value: unknown) =>
    String(value || "")
      .trim()
      .toLowerCase();
  const currentUserIds = [currentUser?.id, currentUser?._id, currentUser?.userId]
    .filter(Boolean)
    .map((value) => String(value));
  const currentUserEmail = normalizeIdentity(currentUser?.email);
  const currentUserUsername = normalizeIdentity(currentUser?.username);
  const ownerIds = [
    typeof song?.ownerId === "string" ? song?.ownerId : undefined,
    song?.ownerId?._id,
    song?.ownerId?.id,
    song?.owner?._id,
    song?.owner?.id,
  ]
    .filter(Boolean)
    .map((value) => String(value));
  const ownerEmails = [song?.ownerId?.email, song?.owner?.email]
    .filter(Boolean)
    .map((value) => normalizeIdentity(value));
  const ownerUsernames = [song?.ownerId?.username, song?.owner?.username]
    .filter(Boolean)
    .map((value) => normalizeIdentity(value));
  const hasOwnerIdentity = ownerEmails.length > 0 || ownerUsernames.length > 0;
  const emailMatchesOwner = currentUserEmail !== "" && ownerEmails.includes(currentUserEmail);
  const usernameMatchesOwner =
    currentUserUsername !== "" && ownerUsernames.includes(currentUserUsername);
  const idMatchesOwner =
    ownerIds.length > 0 && currentUserIds.some((currentId) => ownerIds.includes(currentId));
  const isSubuserSession = Boolean(currentUser?.parentUserId);
  const isOwnerUser =
    emailMatchesOwner ||
    usernameMatchesOwner ||
    (!isSubuserSession && !hasOwnerIdentity && idMatchesOwner);

  // El owner ve el Net Income completo. Un colaborador (no-owner) lo ve ya
  // descontado por la parte que le corresponde al split del owner.
  const displayNetIncome = isOwnerUser ? totalNetIncome : Math.max(0, totalNetIncome - ownerAmount);

  const streamsDisplay = (song?.totalStreams ?? 0).toLocaleString();
  const netIncomeDisplay = `$${displayNetIncome.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const myAmount = myRoyaltyRequest
    ? myRoyaltyRequest.calculatedAmount.toFixed(2)
    : getUserDisplayAmount();
  const myPercentage = myRoyaltyRequest
    ? myRoyaltyRequest.splitPercentage
    : getUserDisplayPercentage();

  const TABS = [
    { key: "resumen", label: "Resumen", icon: LayoutDashboard },
    { key: "colaboradores", label: "Colaboradores", icon: Users },
    { key: "pagos", label: "Pagos", icon: Receipt },
    { key: "splits", label: "Splits", icon: GitBranch },
    { key: "documentos", label: "Documentos", icon: FolderOpen },
  ] as const;

  return (
    <React.Fragment>
      <StripeConnectLoginModal
        isOpen={showStripeLoginModal}
        onClose={() => setShowStripeLoginModal(false)}
        onLoginSuccess={handleStripeLoginSuccess}
      />
      <StripePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        songTitle={song?.trackTitle}
        songId={song?._id || song?.id}
        totalAmount={totalToPay}
        collaborators={getCollaboratorsInfo()}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <ValidationToastQueue toasts={toasts} onDequeue={dequeueToast} />
      <div className="min-h-full bg-white">
        <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-[16px]  px-4 py-2 text-sm font-medium text-[#71757E] transition-colors hover:text-[#1C1D22]"
            >
              <ArrowLeft className="h-4 w-4" />
              Regresar
            </button>
            <div className="hidden items-center gap-2 text-[13px] sm:flex">
              <span className="text-[#A6AAB2]">Inicio</span>
              <span className="text-[#A6AAB2]">/</span>
              <span className="text-[#A6AAB2]">Canciones</span>
              <span className="text-[#A6AAB2]">/</span>
              <span className="font-semibold text-[#1C1D22]">{song?.trackTitle || "Detalle"}</span>
            </div>
          </div>

          {/* Hero */}
          {loading ? (
            <div className="flex items-center gap-5 rounded-[36px] bg-[#F4F5F7] p-6">
              <div className="h-[104px] w-[104px] flex-shrink-0 animate-pulse rounded-[22px] bg-black/[0.06]" />
              <div className="flex flex-1 flex-col gap-3">
                <div className="h-5 w-1/3 animate-pulse rounded-full bg-black/[0.06]" />
                <div className="h-3.5 w-1/5 animate-pulse rounded-full bg-black/[0.06]" />
                <div className="mt-1 flex flex-wrap gap-2">
                  <div className="h-7 w-28 animate-pulse rounded-full bg-black/[0.06]" />
                  <div className="h-7 w-24 animate-pulse rounded-full bg-black/[0.06]" />
                  <div className="h-7 w-24 animate-pulse rounded-full bg-black/[0.06]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 rounded-[36px] bg-[#F4F5F7] p-6 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-5">
              <div className="flex h-[104px] w-[104px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-[#FF5C00]/15">
                {song?.spotifyData?.album?.images?.length ? (
                  <img
                    src={song.spotifyData.album.images[0].url}
                    alt={song.trackTitle}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Music className="h-10 w-10 text-[#FF5C00]/50" />
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[21px] font-bold text-[#1C1D22]">{song?.trackTitle.slice(0, 30) + "..." || "—"}</h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5C00] px-2.5 py-1 text-[11px] font-semibold text-white">
                    ISRC: {song?.isrc || "—"}
                    {song?.isrc && (
                      <CopyButton
                        value={song.isrc}
                        title="Copiar ISRC"
                        className="text-white/80 hover:bg-white/20 hover:text-white"
                      />
                    )}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-sm text-[#71757E]">
                  <Users className="h-3.5 w-3.5" />
                  {song?.artistName || "—"}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <StatPill
                    icon={<Play className="h-3 w-3 text-[#A6AAB2]" />}
                    text={`${streamsDisplay} streams`}
                  />
                  <StatPill
                    icon={<DollarSign className="h-3 w-3 text-[#71757E]" />}
                    text={netIncomeDisplay}
                    valueClass="text-[#2FB37E]"
                  />
                  <StatPill
                    icon={<Award className="h-3 w-3 text-[#FF5C00]" />}
                    text={`Mi parte ${myPercentage}%`}
                    valueClass="text-[#FF5C00]"
                  />
                </div>
              </div>
            </div>

            {/* Payment / Royalties CTA */}
            <div className="flex flex-shrink-0 items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#A6AAB2]">
                  {isOwnerUser ? "Total a pagar" : "Mi parte"}
                </span>
                <span className="text-2xl font-bold text-[#1C1D22]">
                  ${isOwnerUser ? totalToPay.toFixed(2) : myAmount}
                </span>
              </div>
              {isOwnerUser ? (
                <button
                  onClick={handlePayAllClick}
                  disabled={readiness !== null && !readiness.canPay}
                  className="inline-flex items-center gap-2 rounded-[16px] bg-[#FF5C00] px-5 py-3 text-sm font-bold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.35)] transition-colors hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <DollarSign className="h-4 w-4" />
                  Pagar a todos
                </button>
              ) : myRoyaltyRequest?.status === "pending" ? (
                <span className="inline-flex items-center gap-2 rounded-[16px] bg-white px-5 py-3 text-sm font-semibold text-[#71757E]">
                  Solicitud pendiente
                </span>
              ) : myRoyaltyRequest?.status === "accepted" ? (
                <span className="inline-flex items-center gap-2 rounded-[16px] bg-[#E4F5EC] px-5 py-3 text-sm font-semibold text-[#2FB37E]">
                  <Award className="h-4 w-4" /> Aceptada
                </span>
              ) : (
                <button
                  onClick={handleRequestRoyalties}
                  disabled={royaltyRequestLoading || myRoyaltyRequest?.status === "rejected"}
                  className="inline-flex items-center gap-2 rounded-[16px] bg-[#FF5C00] px-5 py-3 text-sm font-bold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.35)] transition-colors hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <DollarSign className="h-4 w-4" />
                  {royaltyRequestLoading
                    ? "Enviando..."
                    : myRoyaltyRequest?.status === "rejected"
                      ? "Rechazada"
                      : "Solicitar regalías"}
                </button>
              )}
            </div>
          </div>
          )}

          {/* Alertas de estado */}
          {isOwnerUser && readiness !== null && !readiness.canPay && (
            <div className="rounded-[22px] border border-[#FF5C00]/20 bg-[#FFEADD] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#EA580C]">
                <AlertCircle className="h-4 w-4" />
                Falta esto para poder pagar:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 pl-1">
                {readiness.issues.map((issue) => (
                  <li key={issue.code} className="text-[12.5px] leading-snug text-[#C2410C]">
                    {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!isOwnerUser && myRoyaltyRequest?.status === "pending" && (
            <div className="rounded-[22px] bg-[#F4F5F7] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#1C1D22]">
                <AlertCircle className="h-4 w-4 text-[#71757E]" />
                Solicitud de regalías pendiente de aprobación
              </p>
              <p className="mt-1 text-[12.5px] text-[#71757E]">
                El owner recibirá un correo para aceptar o rechazar tu solicitud.
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {TABS.map((t) => {
              const active = activeTab === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors ${
                    active ? "bg-[#FFEADD] text-[#FF5C00]" : "text-[#71757E] hover:text-[#1C1D22]"
                  }`}
                >
                  <Icon
                    className={`h-[15px] w-[15px] ${active ? "text-[#FF5C00]" : "text-[#A6AAB2]"}`}
                  />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Contenido según pestaña */}
          {loading ? (
            <div className="rounded-[28px] bg-[#F4F5F7] p-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#FF5C00]" />
              <p className="mt-4 text-sm text-[#A6AAB2]">Cargando…</p>
            </div>
          ) : (
            <>
          {activeTab === "resumen" && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
                <Behavior songId={id} compact />
                <Platforms reproductions={song?.reproductions} />
              </div>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <SongCollaboratorsSummary
                  collaborators={getCollaboratorsInfo()}
                  onViewAll={() => setActiveTab("colaboradores")}
                />
                <SongRecentPayments
                  songId={id}
                  refreshTrigger={paymentHistoryRefresh}
                  onViewAll={() => setActiveTab("pagos")}
                />
              </div>
            </div>
          )}

          {activeTab === "colaboradores" && (
            <div className="rounded-[28px] bg-[#F4F5F7] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Users className="h-5 w-5 text-[#1C1D22]" />
                  <h3 className="text-base font-semibold text-[#1C1D22]">Colaboradores</h3>
                </div>
                <AddCollaborator compact isOwner={isOwnerUser || song?.requesterRole === "label"} />
              </div>
              <Table
                collaborators={getCollaboratorsInfo()}
                songId={song?._id || song?.id}
                song={song}
                isOwner={isOwnerUser}
              />
            </div>
          )}

          {activeTab === "pagos" && (
            <SongPaymentsHistory
              songId={id}
              refreshTrigger={paymentHistoryRefresh}
              pendingAmount={totalToPay}
            />
          )}

          {activeTab === "splits" && (
            <div className="grid grid-cols-2 items-start gap-5 lg:grid-cols-2">
              <Historyofsplits songId={id} isOwner={isOwnerUser} />
              <Extraordinarycosts songId={id || ""} />
            </div>
          )}

          {activeTab === "documentos" && <DocumentManager songId={id || ""} />}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

/** Pill de estadística del hero (streams, ingresos, mi parte). */
function StatPill({
  icon,
  text,
  valueClass = "text-[#1C1D22]",
}: {
  icon: React.ReactNode;
  text: string;
  valueClass?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {icon}
      <span className={valueClass}>{text}</span>
    </span>
  );
}
