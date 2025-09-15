import { useState } from "react";
import { DollarSign, Music, Users, Play, Calendar, BarChart3, Award } from "lucide-react";
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
import { motion } from "framer-motion";

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
  console.log("🚀 ~ Song ~ song:", song?.ownerId?._id);
  console.log("🚀 ~ Song ~ Owner Percentage:", ownerPercentage);
  console.log("🚀 ~ Song ~ Owner Info:", getOwnerTotalOwed());

  // Función para obtener el porcentaje del usuario actual con fallback
  const getUserDisplayPercentage = () => {
    const collaboratorPercentage = getCurrentUserPercentage();
    if (collaboratorPercentage && collaboratorPercentage > 0) {
      return collaboratorPercentage;
    }
    return getOwnerPercentage();
  };

  // Función para obtener el monto del usuario actual con fallback
  const getUserDisplayAmount = () => {
    const collaboratorAmount = getCurrentUserAmount();
    if (collaboratorAmount && parseFloat(collaboratorAmount) > 0) {
      return collaboratorAmount;
    }
    // Si no es colaborador, calcular el monto del owner
    const ownerPercentage = getOwnerPercentage();
    const totalIncome = song?.totalNetIncome || 0;
    return ((ownerPercentage / 100) * totalIncome).toFixed(2);
  };

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
    console.log("Login exitoso en Stripe Connect, procediendo con el pago...");

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
    console.log("Pago procesado exitosamente");

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) return <Loading />;

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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Title title="Canciones" subtitle="Fecha de vinculación" />
              <Breadcrumb items={items} />
            </div>
          </motion.div>

          {/* Loading state */}
          {loading ? (
            <Loading />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 lg:space-y-8"
            >
              {/* Hero Section - Song Info */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Song Image Section */}
                    <motion.div 
                      className="w-full lg:w-64 h-48 lg:h-64 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {song?.spotifyData?.album?.images &&
                      song?.spotifyData?.album?.images.length > 0 ? (
                        <img
                          src={song.spotifyData.album.images[0].url}
                          alt={`${song.trackTitle} cover`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200/20 to-gray-300/20 flex items-center justify-center">
                          <Music className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl"
                        >
                          <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
                        </motion.button>
                      </motion.div>
                    </motion.div>

                    {/* Song Info Section */}
                    <div className="flex-1 space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-2">
                            <motion.h2 
                              className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {song?.trackTitle}
                            </motion.h2>
                            <motion.p 
                              className="text-xl text-gray-600 dark:text-gray-300 flex items-center gap-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Users className="w-5 h-5" />
                              {song?.artistName}
                            </motion.p>
                          </div>
                          <motion.span 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            ISRC: {song?.isrc}
                          </motion.span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <motion.div 
                            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 border border-blue-200/50"
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Total Streams</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                  {song?.totalStreams?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div 
                            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4 border border-green-200/50"
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Net Income</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                  ${song?.totalNetIncome?.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div 
                            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 border border-purple-200/50"
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <Award className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Mi porcentaje</p>
                                <div className="flex items-baseline gap-2">
                                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${getUserDisplayAmount()}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {getUserDisplayPercentage()}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Section */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="text-center lg:text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 mb-3"
                      >
                        <Calendar className="w-6 h-6 text-white/80" />
                        <h3 className="text-xl lg:text-2xl font-bold text-white">
                          Próxima liquidación estimada
                        </h3>
                      </motion.div>
                      <p className="text-white/80 text-lg">10 Julio 2024</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="text-center">
                        <span className="text-white/80 text-sm">Total a pagar</span>
                        <p className="text-3xl lg:text-4xl font-bold text-white">
                          ${song?.totalNetIncome?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-3"
                        onClick={handlePayAllClick}
                      >
                        <DollarSign className="w-5 h-5" />
                        <span>Pagar a todos</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Collaborators Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <AddCollaborator />
                  <Table
                    collaborators={getCollaboratorsInfo()}
                    songId={song?._id || song?.id}
                    song={song}
                  />
                </div>
              </motion.div>

              {/* Behavior Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <Behavior songId={id} />
                </div>
              </motion.div>

              {/* Stats and Platforms Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <motion.div
                  variants={itemVariants}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                >
                  <div className="p-6 lg:p-8">
                    <Statistics />
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                >
                  <div className="p-6 lg:p-8">
                    <Platforms />
                  </div>
                </motion.div>
              </div>

              {/* Specific Data Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <EspecificData />
                </div>
              </motion.div>

              {/* History of Splits Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <Historyofsplits />
                </div>
              </motion.div>

              {/* Extraordinary Costs Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <Extraordinarycosts />
                </div>
              </motion.div>

              {/* Payment History Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-6 lg:p-8">
                  <PaymentHistory
                    title="Historial de Pagos Realizados"
                    maxHeight="500px"
                    refreshTrigger={paymentHistoryRefresh}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}