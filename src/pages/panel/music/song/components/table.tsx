import { useState } from "react";
import { Button, Checkbox } from "flowbite-react";
import SplitsModal from "../../../../../components/modal/SplitsModal";
import PaymentHistoryModal from "../../../../../components/modal/PaymentHistoryModal";
import OwnerSplitModal from "./ownerfrom";
import RegisterPaymentModal from "../../../../../components/modal/RegisterPaymentModal";
import PaymentConfirmationModal from "../../../../../components/modal/PaymentConfirmationModal";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Percent,
  User,
  CreditCard,
  Clock,
  Filter,
  Search,
  Music,
  History,
  Plus,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { User as UserType } from "../../../../../models/user";
import WalletService from "@/services/wallet";
import { useWallet } from "@/hooks/useWallet";
import { Link } from "react-router-dom";

interface Song {
  id?: string;
  _id?: string;
  trackTitle: string;
  artistName?: string;
  isrc?: string;
  ownerId?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  collaborators?: Array<{
    id: string;
    _id?: string;
    name: string;
    email: string;
    hasActiveSplit?: boolean;
  }>;
  totalNetIncome?: number;
  releases?: Array<{
    id: string;
    platform: string;
    country: string;
    reportMonth: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}
interface TableProps {
  collaborators: UserType[];
  songId?: string;
  song?: Song;
}

export default function Table({ collaborators, songId, song }: TableProps) {
  const [isSplitsModalOpen, setIsSplitsModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] =
    useState(false);
  const [isRegisterPaymentModalOpen, setIsRegisterPaymentModalOpen] =
    useState(false);
  const [currentSplitId, setCurrentSplitId] = useState<string>("");
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);
  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    collaboratorId: string;
    collaboratorName: string;
    collaboratorEmail: string;
    amount: number;
    songId: string;
  } | null>(null);
  
  // Hook de wallet
  const { wallet, hasWallet, loading: walletLoading } = useWallet();

  // Log collaborators for debugging (remove in production)
  // console.log("Collaborators:", collaborators);
  // console.log("Song ID:", songId);
  // console.log("Is Owner:", isOwner);

  const openSplitsModal = () => {
    setIsSplitsModalOpen(true);
  };

  const closeSplitsModal = () => {
    setIsSplitsModalOpen(false);
  };

  const openPaymentHistoryModal = (splitId: string) => {
    setCurrentSplitId(splitId);
    setIsPaymentHistoryModalOpen(true);
  };

  const closePaymentHistoryModal = () => {
    setIsPaymentHistoryModalOpen(false);
    setCurrentSplitId("");
  };

  const openRegisterPaymentModal = (splitId: string) => {
    setCurrentSplitId(splitId);
    setIsRegisterPaymentModalOpen(true);
  };

  const closeRegisterPaymentModal = () => {
    setIsRegisterPaymentModalOpen(false);
    setCurrentSplitId("");
  };
  const openOwnerSplitModal = () => {
    setIsOwnerSplitModalOpen(true);
  };

  const closeOwnerSplitModal = () => {
    setIsOwnerSplitModalOpen(false);
  };

  const handleSplitSaved = (splitId: string) => {
    console.log("Split saved with ID:", splitId);
    setCurrentSplitId(splitId);
    // Recargar la página para mostrar los cambios
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleOwnerSplitCreated = () => {
    console.log("Owner split created, refreshing data...");
    setIsOwnerSplitModalOpen(false);
    window.location.reload();
  };

  const handlePaymentRegistered = (paymentId: string) => {
    console.log("Payment registered with ID:", paymentId);
    // You can add additional logic here, like refreshing data or showing a notification
  };

  const openPaymentConfirmation = (
    collaboratorId: string,
    collaboratorName: string,
    collaboratorEmail: string,
    amount: number,
    songId: string
  ) => {
    setPaymentData({
      collaboratorId,
      collaboratorName,
      collaboratorEmail,
      amount,
      songId,
    });
    setIsPaymentConfirmationOpen(true);
  };

  const closePaymentConfirmation = () => {
    setIsPaymentConfirmationOpen(false);
    setPaymentData(null);
  };

  const paymentToCollaborator = async () => {
    if (!paymentData) return;
    
    console.log("=== PAYMENT DEBUG ===");
    console.log("Collaborator ID:", paymentData.collaboratorId);
    console.log("Song ID:", paymentData.songId);
    console.log("Amount:", paymentData.amount);
    console.log("Payment data completo:", paymentData);
    console.log("===================");
    
    // Llamar al endpoint de wallet para pagar al colaborador
    const response = await WalletService.payCollaborator({
      collaboratorId: paymentData.collaboratorId,
      songId: paymentData.songId,
      amount: paymentData.amount,
    });
    
    console.log("Response:", response);
    
    if (response.error) {
      throw new Error(response.message || "Error al procesar el pago");
    }
    
 
  };

  return (
    <>
      <SplitsModal
        collaborators={collaborators}
        isOpen={isSplitsModalOpen}
        onClose={closeSplitsModal}
        songId={songId || ""}
        onSplitSaved={handleSplitSaved}
      />

      <PaymentHistoryModal
        isOpen={isPaymentHistoryModalOpen}
        onClose={closePaymentHistoryModal}
        splitId={currentSplitId}
        songTitle="Canción" // You can pass the actual song title here
      />

      <RegisterPaymentModal
        isOpen={isRegisterPaymentModalOpen}
        onClose={closeRegisterPaymentModal}
        splitId={currentSplitId}
        songTitle="Canción" // You can pass the actual song title here
        onPaymentRegistered={handlePaymentRegistered}
      />

      <OwnerSplitModal
        isOpen={isOwnerSplitModalOpen}
        onClose={closeOwnerSplitModal}
        songId={songId || ""}
        song={
          song || {
            id: songId || "",
            trackTitle: "",
            artistName: "",
            isrc: "",
          }
        }
        onSplitCreated={handleOwnerSplitCreated}
      />

      <PaymentConfirmationModal
        isOpen={isPaymentConfirmationOpen}
        onClose={closePaymentConfirmation}
        onConfirm={paymentToCollaborator}
        collaboratorName={paymentData?.collaboratorName || ""}
        collaboratorEmail={paymentData?.collaboratorEmail || ""}
        amount={paymentData?.amount || 0}
        walletBalance={wallet?.data?.accounts?.[0]?.balance || 0}
        currency="USD"
      />

      <div className="col-span-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300">
        {/* Wallet Warning Banner */}
        {!walletLoading && !hasWallet && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                  Wallet No Vinculada
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                  Para poder realizar pagos a tus colaboradores, necesitas vincular una wallet de pago. 
                  Es rápido y seguro.
                </p>
                <Link to="/panel/home">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow-md transition-all duration-200"
                  >
                    <Wallet className="w-4 h-4" />
                    Vincular Wallet Ahora
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <Music className="w-6 h-6" />
            Collaborators & Splits
          </h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search collaborators..."
                className="pl-10 pr-4 py-2 border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-indigo-600 dark:text-white transition-all duration-200"
              />
            </div>
            <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Split Management Actions */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Gestión de Splits y Pagos
              </span>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={openOwnerSplitModal}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Crear Owner Split</span>
              </motion.button>

              <motion.button
                onClick={openSplitsModal}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Music className="w-4 h-4" />
                <span className="text-sm">Configurar Splits</span>
              </motion.button>

              {currentSplitId && (
                <>
                  <motion.button
                    onClick={() => openPaymentHistoryModal(currentSplitId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <History className="w-4 h-4" />
                    <span className="text-sm">Historial</span>
                  </motion.button>

                  {hasWallet ? (
                    <motion.button
                      onClick={() => openRegisterPaymentModal(currentSplitId)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Nuevo Pago</span>
                    </motion.button>
                  ) : (
                    <Link to="/panel/home">
                      <motion.button
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Vincular Wallet</span>
                      </motion.button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {collaborators?.map((collaborator) => (
            <motion.div
              key={collaborator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900 p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                      alt=""
                      className="w-12 h-12 rounded-full ring-2 ring-indigo-200 dark:ring-indigo-700"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <div className="font-medium text-lg text-gray-900 dark:text-white">
                      {collaborator.name}
                    </div>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400">
                      {collaborator.role || "Artist"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Generated Total
                  </span>
                  <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    {" "}
                    ${collaborator.amountToPay || "0.00"}
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Split Percentage
                  </span>
                  <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    {collaborator.percentage
                      ? `${collaborator.percentage}%`
                      : "Por definir"}
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Role
                  </span>
                  <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    {collaborator.role || "Artist"}
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Payment Method
                  </span>
                  <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    Payoneer
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Última actualización: Hace 2 días</span>
                </div>

                <div className="flex gap-2">
                  <>
                    <motion.button
                      onClick={() => openPaymentHistoryModal(currentSplitId)}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md transition-all duration-200 hover:scale-105"
                    >
                      <History className="w-3 h-3" />
                      Historial
                    </motion.button>

                    {hasWallet ? (
                      <motion.button
                        onClick={() =>
                          openPaymentConfirmation(
                            collaborator.id,
                            collaborator.name,
                            collaborator.email,
                            Number(collaborator.amountToPay) || 0,
                            songId || ""
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-md transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="w-3 h-3" />
                        Pagar
                      </motion.button>
                    ) : (
                      <Link to="/panel/home">
                        <motion.button
                          className="flex items-center gap-1 px-3 py-1 text-xs bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-md transition-all duration-200 hover:scale-105"
                          title="Necesitas vincular una wallet para realizar pagos"
                        >
                          <Wallet className="w-3 h-3" />
                          Vincular Wallet
                        </motion.button>
                      </Link>
                    )}
                  </>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty state */}
          {(!collaborators || collaborators.length === 0) && (
            <div className="text-center py-12">
              <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay colaboradores
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Agrega colaboradores para comenzar a gestionar los splits
              </p>
              <motion.button
                onClick={openSplitsModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Configurar Splits
              </motion.button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
            <span>Showing</span>
            <span className="font-semibold text-indigo-900 dark:text-indigo-100">
              1-{collaborators?.length || 0}
            </span>
            <span>of</span>
            <span className="font-semibold text-indigo-900 dark:text-indigo-100">
              {collaborators?.length || 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button className="flex items-center gap-2 px-3 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 dark:border-indigo-700 dark:hover:bg-indigo-900/30 transition-all duration-200">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>

            <div className="flex items-center gap-1">
              {[1].map((page, index) => (
                <motion.button
                  key={index}
                  className="w-8 h-8 rounded-lg transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button className="flex items-center gap-2 px-3 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 dark:border-indigo-700 dark:hover:bg-indigo-900/30 transition-all duration-200">
              Next
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}

export type { Song };
