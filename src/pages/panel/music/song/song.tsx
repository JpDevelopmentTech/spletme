import React, { useState } from "react";
import {
  DollarSign,
  Music,
  Users,
  Calendar,
  BarChart3,
  Award,
  ArrowLeft,
} from "lucide-react";
import AddCollaborator from "../../collaborators/components/addCollaborator";
import Behavior from "../../dealers/components/behavior";
import EspecificData from "./components/especificData";
import Table from "./components/table";
import { useParams, useNavigate } from "react-router-dom";
import Platforms from "./components/platforms";
import Historyofsplits from "./components/historyofsplits";
import Extraordinarycosts from "./components/extraordinarycosts";
import useSong from "../../../../hooks/useSong";
import Loading from "../../../../components/loading/loading";
import StripeConnectLoginModal from "../../../../components/modal/StripeConnectLoginModal";
import StripePaymentModal from "../../../../components/modal/StripePaymentModal";
import AlertComponent from "../../../../components/alert/alert";
import LocalStorageService from "../../../../services/localstorage";
import PaymentHistory from "../../../../components/PaymentHistory/PaymentHistory";
import useCurrentCollaborator from "../../../../hooks/useCurrentCollaborator";

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
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [paymentHistoryRefresh, setPaymentHistoryRefresh] = useState(0);

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

  const isStripeConnected = () => {
    const authData = LocalStorageService.getItem("stripe_connect_auth");
    return authData?.isLoggedIn === true;
  };

  const handlePayAllClick = () => {
    if (isStripeConnected()) {
      setShowPaymentModal(true);
    } else {
      setShowStripeLoginModal(true);
    }
  };

  const handleStripeLoginSuccess = () => {
    setAlertMessage(
      "¡Inicio de sesión exitoso! Te has conectado correctamente con Stripe Connect."
    );
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const handlePaymentSuccess = () => {
    setPaymentHistoryRefresh((prev) => prev + 1);
    setAlertMessage(
      "¡Pago procesado exitosamente! Los colaboradores recibirán su parte correspondiente."
    );
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  if (loading) return <Loading />;

  const ownerAmount = getOwnerTotalOwed();
  const totalToPay = Math.max(0, (song?.totalNetIncome || 0) - ownerAmount);

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
        totalAmount={song?.totalNetIncome || 0}
        collaborators={song?.collaborators || []}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <AlertComponent message={alertMessage} type={alertType} />

      <div className="min-h-screen bg-[#F7F8FA] px-10 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detalle de Canción
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Información de la pista y regalías
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer">
              Inicio
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer">
              Música
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-600">Detalle de Canción</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex gap-6">
          {/* Album Art */}
          <div className="w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
            {song?.spotifyData?.album?.images?.length > 0 ? (
              <img
                src={song.spotifyData.album.images[0].url}
                alt={`${song.trackTitle} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-12 h-12 text-gray-300" />
            )}
          </div>

          {/* Song Info */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold text-gray-900">
                  {song?.trackTitle || "—"}
                </h2>
                <p className="flex items-center gap-2 text-gray-500 text-sm">
                  <Users className="w-4 h-4" />
                  {song?.artistName || "—"}
                </p>
              </div>
              <span className="flex-shrink-0 bg-[#F97316] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                ISRC: {song?.isrc || "—"}
              </span>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Streams */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Total Streams
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {song?.totalStreams?.toLocaleString() || "0"}
                </p>
              </div>

              {/* Net Income */}
              <div className="bg-green-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Net Income
                  </span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  $
                  {song?.totalNetIncome?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </p>
              </div>

              {/* My Percentage */}
              <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
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
            </div>
          </div>
        </div>

        {/* Payment Banner */}
        {(
          
          <div className="bg-[#F97316] rounded-xl px-7 py-5 flex items-center justify-between">
         
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-base">
                Próxima liquidación estimada
              </span>
            </div>
            <p className="text-orange-100 text-sm pl-7">10 Julio 2024</p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-orange-100 text-xs font-medium">
                Total a pagar
              </p>
              <p className="text-white text-2xl font-bold">
                ${totalToPay.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handlePayAllClick}
              className="flex items-center gap-2 bg-white text-[#F97316] font-bold text-sm px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              Pagar a todos
            </button>
          </div>
        </div>
        )}

        {/* Collaborators Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-gray-900" />
              <h3 className="text-base font-bold text-gray-900">
                Colaboradores
              </h3>
            </div>
            <AddCollaborator compact />
          </div>
          <Table
            collaborators={getCollaboratorsInfo()}
            songId={song?._id || song?.id}
            song={song}
          />
        </div>

        {/* Behavior / Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <Behavior songId={id} />
        </div>

        {/* Payment History + Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <PaymentHistory
              title="Historial de Pagos Realizados"
              maxHeight="400px"
              refreshTrigger={paymentHistoryRefresh}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Platforms reproductions={song?.reproductions} />
          </div>
        </div>

        {/* Specific Data */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <EspecificData song={song} />
        </div>

        {/* History of Splits */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <Historyofsplits />
        </div>

        {/* Extraordinary Costs */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <Extraordinarycosts />
        </div>
      </div>
    </React.Fragment>
  );
}
