import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Music,
  Users,
  Calendar,
  BarChart3,
  Award,
  ArrowLeft,
  AlertCircle,
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
import Loading from "../../../../components/loading/loading";
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

export default function Song() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    song,
    loading,
    getCollaboratorsInfo,
    getOwnerPercentage,
    getOwnerTotalOwed,
  } = useSong({ id: id || "" });
  const { getCurrentUserPercentage, getCurrentUserAmount } =
    useCurrentCollaborator({ collaborators: song?.collaborators || [] });
  const [showStripeLoginModal, setShowStripeLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toasts, setToasts] = useState<ValidationToastItem[]>([]);
  const [paymentHistoryRefresh, setPaymentHistoryRefresh] = useState(0);
  const [readiness, setReadiness] = useState<PaymentReadiness | null>(null);

  useEffect(() => {
    if (!id) return;
    PaymentsService.getPaymentReadiness(id).then((res) => {
      if (!res.error && res.data) setReadiness(res.data);
    });
  }, [id, paymentHistoryRefresh]);

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
  const currentUserIds = [
    currentUser?.id,
    currentUser?._id,
    currentUser?.userId,
  ]
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
  const emailMatchesOwner =
    currentUserEmail !== "" && ownerEmails.includes(currentUserEmail);
  const usernameMatchesOwner =
    currentUserUsername !== "" && ownerUsernames.includes(currentUserUsername);
  const idMatchesOwner =
    ownerIds.length > 0 &&
    currentUserIds.some((currentId) => ownerIds.includes(currentId));
  const isSubuserSession = Boolean(currentUser?.parentUserId);
  const isOwnerUser =
    emailMatchesOwner ||
    usernameMatchesOwner ||
    (!isSubuserSession && !hasOwnerIdentity && idMatchesOwner);

  // El owner ve el Net Income completo. Un colaborador (no-owner) lo ve ya
  // descontado por la parte que le corresponde al split del owner.
  const displayNetIncome = isOwnerUser
    ? totalNetIncome
    : Math.max(0, totalNetIncome - ownerAmount);

  if (loading) return <Loading />;

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
      <div className="min-h-screen space-y-6 bg-[#F7F8FA] px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Regresar
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detalle de Canción
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Información de la pista y regalías
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="cursor-pointer text-gray-400 hover:text-gray-600">
              Inicio
            </span>
            <span className="text-gray-300">/</span>
            <span className="cursor-pointer text-gray-400 hover:text-gray-600">
              Música
            </span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900">
              Detalle de Canción
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* Hero Card */}
          <div
            className={`flex gap-6 rounded-xl border border-gray-200 bg-white p-6 ${
              isOwnerUser ? "col-span-3" : "col-span-4"
            }`}
          >
            {/* Album Art */}
            <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
              {song?.spotifyData?.album?.images?.length > 0 ? (
                <img
                  src={song.spotifyData.album.images[0].url}
                  alt={`${song.trackTitle} cover`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Music className="h-12 w-12 text-gray-300" />
              )}
            </div>

            {/* Song Info */}
            <div className="flex flex-1 flex-col gap-5">
              {/* Title row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {song?.trackTitle || "—"}
                  </h2>
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    {song?.artistName || "—"}
                  </p>
                </div>
                <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-[#F97316] px-3 py-1.5 text-xs font-semibold text-white">
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

              {/* Stat Cards */}
              <div
                className={`grid gap-2 ${isOwnerUser ? "grid-cols-3" : "grid-cols-2"}`}
              >
                {/* Streams */}
                <div className="space-y-2 rounded-xl bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      Total Streams
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {song?.totalStreams?.toLocaleString() || "0"}
                  </p>
                </div>

                {/* Net Income */}
                <div className="space-y-2 rounded-xl bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      Net Income
                    </span>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    $
                    {displayNetIncome.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                {/* My Percentage */}
                {isOwnerUser && (
                  <div className="space-y-2 rounded-xl bg-purple-50 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        Mi porcentaje
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-xl font-bold text-purple-600">
                        ${getUserDisplayAmount()}
                      </p>
                      <span className="text-xs text-gray-400">
                        {getUserDisplayPercentage()}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Banner */}
          {isOwnerUser && (
            <div className="relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl bg-[#F97316] p-6">
              {/* Decoración de fondo */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/10" />

              {/* Próxima liquidación */}
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    Próxima liquidación
                  </span>
                </div>
                <p className="pl-10 text-base font-semibold text-white">
                  10 Julio 2024
                </p>
              </div>

              <div className="relative z-10 my-5 border-t border-white/20" />

              {/* Total + botón */}
              <div className="relative z-10 space-y-4">
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                    Total a pagar
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-white">
                    ${totalToPay.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handlePayAllClick}
                  disabled={readiness !== null && !readiness.canPay}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#F97316] transition-all hover:bg-orange-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                >
                  <DollarSign className="h-4 w-4" />
                  Pagar a todos
                </button>

                {readiness !== null && !readiness.canPay && (
                  <div className="space-y-1.5 rounded-xl border border-white/20 bg-white/10 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Falta esto para poder pagar:
                    </p>
                    <ul className="list-inside list-disc space-y-1">
                      {readiness.issues.map((issue) => (
                        <li
                          key={issue.code}
                          className="text-[11px] leading-snug text-white/85"
                        >
                          {issue.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Collaborators Card */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-2.5">
              <Users className="h-5 w-5 text-gray-900" />
              <h3 className="text-base font-bold text-gray-900">
                Colaboradores
              </h3>
            </div>
            <AddCollaborator compact isOwner={isOwnerUser} />
          </div>
          <Table
            collaborators={getCollaboratorsInfo()}
            songId={song?._id || song?.id}
            song={song}
            isOwner={isOwnerUser}
          />
        </div>
        {/* Behavior / Revenue Chart */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <Behavior songId={id} compact />
          {/*Platforms */}
          <Platforms reproductions={song?.reproductions} />
        </div>
        {/* Payment History + Platforms */}

        <SongPaymentsHistory
          songId={id}
          refreshTrigger={paymentHistoryRefresh}
        />

        <div className="grid grid-cols-4 gap-4">
          {/* History of Splits */}
          <div className="col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
            <Historyofsplits songId={id} />
          </div>
          {/* Extraordinary Costs */}
          <div className="col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
            <Extraordinarycosts songId={id || ""} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Specific Data */}
          {/* <div className="bg-white border border-gray-200 rounded-xl overflow-hidden col-span-1 lg:col-span-2">
            <EspecificData song={song} />
          </div> */}
          <div className="col-span-1 overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-4">
            <DocumentManager songId={id || ""} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
