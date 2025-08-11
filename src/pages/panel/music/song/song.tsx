import { useState } from "react";
import { DollarSign } from "lucide-react";
import Title from "../../../../components/title/title";
import AddCollaborator from "../../collaborators/components/addCollaborator";
import Behavior from "../../dealers/components/behavior";
import EspecificData from "./components/especificData";
import Table from "./components/table";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../../components/breadcrumb/breadcrumb";
import Statistics from "./components/statistics";
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
  const {
    song,
    loading,
    getCollaboratorsInfo,
    getOwnerPercentage,
    getOwnerTotalOwed,
  } = useSong({
    id: id || "",
  });
  const {
    getCurrentUserPercentage,
    getCurrentUserAmount,
    isCurrentUserCollaborator,
  } = useCurrentCollaborator({ collaborators: song?.collaborators || [] });
  const [showStripeLoginModal, setShowStripeLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [paymentHistoryRefresh, setPaymentHistoryRefresh] = useState(0);

  console.log(
    "🚀 ~ Is current user collaborator:",
    isCurrentUserCollaborator()
  );
  const ownerPercentage = getOwnerPercentage();
  // const ownerId = 
  console.log("🚀 ~ Song ~ song:", song?.ownerId?._id);
  console.log("🚀 ~ Song ~ Owner Percentage:", ownerPercentage);
  console.log("🚀 ~ Song ~ Owner Info:", getOwnerTotalOwed());

  const items = [
    {
      label: "Inicio",
      url: "/panel",
    },
    {
      label: "Canción",
      url: `/panel/song/${id}`,
    },
  ];

  // Verificar si hay sesión activa en localStorage
  const isStripeConnected = () => {
    const authData = LocalStorageService.getItem("stripe_connect_auth");
    return authData?.isLoggedIn === true;
  };

  // Manejar click en botón "Pagar a todos"
  const handlePayAllClick = () => {
    if (isStripeConnected()) {
      // Si ya está conectado, mostrar modal de pago
      setShowPaymentModal(true);
    } else {
      // Si no está conectado, mostrar modal de login
      setShowStripeLoginModal(true);
    }
  };

  const handleStripeLoginSuccess = () => {
    // Aquí podríamos proceder con el pago después del login exitoso
    console.log("Login exitoso en Stripe Connect, procediendo con el pago...");

    // Mostrar alerta de éxito
    setAlertMessage(
      "¡Inicio de sesión exitoso! Te has conectado correctamente con Stripe Connect."
    );
    setAlertType("success");

    // Limpiar la alerta después de 5 segundos
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const handlePaymentSuccess = () => {
    // Manejar éxito del pago
    console.log("Pago procesado exitosamente");

    // Refrescar el historial de pagos
    setPaymentHistoryRefresh((prev) => prev + 1);

    // Mostrar alerta de éxito del pago
    setAlertMessage(
      "¡Pago procesado exitosamente! Los colaboradores recibirán su parte correspondiente."
    );
    setAlertType("success");

    // Limpiar la alerta después de 5 segundos
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  return (
    <>
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

      <div className="min-h-screen ">
        <div className="w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Title title="Canciones" subtitle="Fecha de vinculación" />
              <Breadcrumb items={items} />
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden col-span-9 row-span-1 border border-indigo-100">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Song Image Section */}
                    <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                      {song?.spotifyData?.album?.images &&
                      song?.spotifyData?.album?.images.length > 0 ? (
                        <img
                          src={song.spotifyData.album.images[0].url}
                          alt={`${song.trackTitle} cover`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Song Info Section */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {song?.trackTitle}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {song?.artistName}
                          </p>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          ISRC: {song?.isrc}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Total Streams
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {song?.totalStreams?.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Net Income
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            $
                            {song?.totalNetIncome?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Mi porcentaje
                          </p>
                          <div className="flex gap-3">
                            <p className="text-2xl font-bold text-gray-900">
                              ${getCurrentUserAmount()}
                            </p>
                            <p className="text-xs text-gray-500 mt-3">
                              {getCurrentUserPercentage() ||
                                getOwnerPercentage()}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden col-span-3 row-span-1 border border-indigo-100">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4">
                  <h3 className="text-lg font-semibold text-white">
                    Próxima liquidación estimada
                  </h3>
                  <p className="text-sm text-white/80">10 Julio 2024</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total a pagar</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      $
                      {song?.totalNetIncome?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <button
                    className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-colors hover:bg-indigo-700 flex items-center justify-center"
                    onClick={handlePayAllClick}
                  >
                    <span className="mr-2">Pagar a todos</span>
                    <DollarSign className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <AddCollaborator />
                <Table
                  collaborators={getCollaboratorsInfo()}
                  songId={song?._id || song?.id}
                  song={song}
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <Behavior />
              </div>

              {/* Statistics card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-6 border border-indigo-100">
                <Statistics />
              </div>

              {/* Platforms card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-6 border border-indigo-100">
                <Platforms />
              </div>

              {/* Specific data card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <EspecificData />
              </div>

              {/* History of splits card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <Historyofsplits />
              </div>

              {/* Extraordinary costs card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <Extraordinarycosts />
              </div>

              {/* Payment History card */}
              <div className="col-span-12">
                <PaymentHistory
                  title="Historial de Pagos Realizados"
                  maxHeight="500px"
                  refreshTrigger={paymentHistoryRefresh}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
