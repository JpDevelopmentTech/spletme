import { useState } from "react";
import SplitsModal from "../../../../../components/modal/SplitsModal";
import PaymentHistoryModal from "../../../../../components/modal/PaymentHistoryModal";
import OwnerSplitModal from "./ownerfrom";
import RegisterPaymentModal from "../../../../../components/modal/RegisterPaymentModal";
import PaymentConfirmationModal from "../../../../../components/modal/PaymentConfirmationModal";
import CollaboratorPaymentHistoryModal from "../../../../../components/modal/CollaboratorPaymentHistoryModal";
import { DollarSign, Plus, History, Wallet, Users, Music } from "lucide-react";
import { User as UserType } from "../../../../../models/user";
import PaymentsService from "@/services/payments";
import { useWallet } from "@/hooks/useWallet";
import { Link } from "react-router-dom";
import LocalStorageService from "@/services/localstorage";
import ValidationToastQueue, {
  ValidationToastItem,
  ValidationToastType,
} from "../../../../../components/alert/ValidationToastQueue";

interface Song {
  id?: string;
  _id?: string;
  trackTitle: string;
  artistName?: string;
  isrc?: string;
  ownerId?: string;
  owner?: { id: string; name: string; email: string };
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
  requesterRole?: "admin" | "collaborator" | "label";
  ownerEarnings?: number;
  collaboratorsEarnings?: number;
}

interface TableProps {
  collaborators: UserType[];
  songId?: string;
  song?: Song;
  isOwner?: boolean;
}

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-rose-500",
  "bg-teal-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Table({
  collaborators,
  songId,
  song,
  isOwner = false,
}: TableProps) {
  const [isSplitsModalOpen, setIsSplitsModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] =
    useState(false);
  const [isRegisterPaymentModalOpen, setIsRegisterPaymentModalOpen] =
    useState(false);
  const [currentSplitId, setCurrentSplitId] = useState<string>("");
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);
  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] =
    useState(false);
  const [historyModal, setHistoryModal] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });
  const [paymentData, setPaymentData] = useState<{
    collaboratorId: string;
    collaboratorName: string;
    collaboratorEmail: string;
    amount: number;
    songId: string;
  } | null>(null);
  const [toasts, setToasts] = useState<ValidationToastItem[]>([]);

  const { hasWallet } = useWallet();
  const currentUser = LocalStorageService.getItem("user");
  const rawUserType = String(
    currentUser?.role ||
      currentUser?.type ||
      currentUser?.userType ||
      currentUser?.accountType ||
      "",
  ).toLowerCase();
  const isLabelUser = rawUserType.includes("label");
  const hasOwnerSplit = Boolean(
    (song as any)?.ownerId?.split ||
    (song as any)?.owner?.split ||
    (song as any)?.ownerSplit,
  );

  const addToast = (type: ValidationToastType, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now() + Math.floor(Math.random() * 1000), type, message },
    ]);
  };

  const dequeueToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleOpenSplitsModal = () => {
    if (isLabelUser && !hasOwnerSplit) {
      addToast(
        "error",
        "Error al crear split: el owner de la cancion a un no crea su split",
      );
      return;
    }
    setIsSplitsModalOpen(true);
  };

  const openPaymentHistoryModal = (splitId: string) => {
    setCurrentSplitId(splitId);
    setIsPaymentHistoryModalOpen(true);
  };

  const openRegisterPaymentModal = (splitId: string) => {
    setCurrentSplitId(splitId);
    setIsRegisterPaymentModalOpen(true);
  };

  const handleSplitSaved = (splitId: string) => {
    setCurrentSplitId(splitId);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleOwnerSplitCreated = () => {
    setIsOwnerSplitModalOpen(false);
    window.location.reload();
  };

  const handlePaymentRegistered = () => {};

  const openPaymentConfirmation = (
    collaboratorId: string,
    collaboratorName: string,
    collaboratorEmail: string,
    amount: number,
    songId: string,
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

  const paymentToCollaborator = async () => {
    if (!paymentData) return;
    // Cobro ACH dirigido a un solo colaborador (su pendiente) y payout vía Wise.
    const response = await PaymentsService.payRoyalties(
      paymentData.songId,
      paymentData.collaboratorId,
    );
    if (response.error) {
      throw new Error(response.message || "Error al procesar el pago");
    }
  };

  return (
    <>
      <ValidationToastQueue toasts={toasts} onDequeue={dequeueToast} />
      {/* Modals */}
      <SplitsModal
        collaborators={collaborators}
        isOpen={isSplitsModalOpen}
        onClose={() => setIsSplitsModalOpen(false)}
        songId={songId || ""}
        onSplitSaved={handleSplitSaved}
      />
      <PaymentHistoryModal
        isOpen={isPaymentHistoryModalOpen}
        onClose={() => {
          setIsPaymentHistoryModalOpen(false);
          setCurrentSplitId("");
        }}
        splitId={currentSplitId}
        songTitle="Canción"
      />
      <RegisterPaymentModal
        isOpen={isRegisterPaymentModalOpen}
        onClose={() => {
          setIsRegisterPaymentModalOpen(false);
          setCurrentSplitId("");
        }}
        splitId={currentSplitId}
        songTitle="Canción"
        onPaymentRegistered={handlePaymentRegistered}
      />
      <OwnerSplitModal
        isOpen={isOwnerSplitModalOpen}
        onClose={() => setIsOwnerSplitModalOpen(false)}
        songId={songId || ""}
        song={song || { id: songId || "", trackTitle: "" }}
        onSplitCreated={handleOwnerSplitCreated}
      />
      <CollaboratorPaymentHistoryModal
        isOpen={historyModal.open}
        onClose={() => setHistoryModal({ open: false, id: "", name: "" })}
        songId={songId || ""}
        collaboratorId={historyModal.id}
        collaboratorName={historyModal.name}
      />
      <PaymentConfirmationModal
        isOpen={isPaymentConfirmationOpen}
        onClose={() => {
          setIsPaymentConfirmationOpen(false);
          setPaymentData(null);
        }}
        onConfirm={paymentToCollaborator}
        collaboratorName={paymentData?.collaboratorName || ""}
        collaboratorEmail={paymentData?.collaboratorEmail || ""}
        amount={paymentData?.amount || 0}
        currency="USD"
      />

      {/* Actions bar */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
        {isOwner && song?.requesterRole === "admin" && (
          <button
            onClick={() => setIsOwnerSplitModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#F97316] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Owner Split
          </button>
        )}
        {song?.requesterRole === "admin" && (
          <button
            onClick={handleOpenSplitsModal}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Music className="h-3.5 w-3.5" />
            Configurar Splits
          </button>
        )}
        {currentSplitId && (
          <>
            <button
              onClick={() => openPaymentHistoryModal(currentSplitId)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <History className="h-3.5 w-3.5" />
              Historial
            </button>
            {hasWallet ? (
              <button
                onClick={() => openRegisterPaymentModal(currentSplitId)}
                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Nuevo Pago
              </button>
            ) : (
              <Link to="/panel/home">
                <button className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600">
                  <Wallet className="h-3.5 w-3.5" />
                  Vincular Wallet
                </button>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Table */}
      {collaborators && collaborators.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Split %
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pagado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pendiente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {collaborators.map((collaborator, idx) => {
              const hasActiveSplit =
                collaborator.percentage &&
                parseFloat(String(collaborator.percentage)) > 0;
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

              return (
                <tr
                  key={collaborator.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full ${avatarColor} flex flex-shrink-0 items-center justify-center`}
                      >
                        <span className="text-xs font-semibold text-white">
                          {getInitials(collaborator.name || "?")}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {collaborator.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {collaborator.email}
                    </span>
                  </td>

                  {/* Split % */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {collaborator.percentage
                        ? `${collaborator.percentage}%`
                        : "—"}
                    </span>
                  </td>

                  {/* Pagado */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-500">
                      {(collaborator as any).amountPaid
                        ? `$${(collaborator as any).amountPaid}`
                        : "$0.00"}
                    </span>
                  </td>

                  {/* Pendiente */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {collaborator.amountToPay
                        ? `$${collaborator.amountToPay}`
                        : "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    {hasActiveSplit ? (
                      <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                        Sin split
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          setHistoryModal({
                            open: true,
                            id: String(
                              (collaborator as any)._id ||
                                collaborator.id ||
                                "",
                            ),
                            name: collaborator.name || "",
                          })
                        }
                        className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        <History className="h-3.5 w-3.5" />
                        Historial
                      </button>

                      {Number(collaborator.amountToPay) > 0 ? (
                        <button
                          onClick={() =>
                            openPaymentConfirmation(
                              String(
                                (collaborator as any)._id ||
                                  collaborator.id ||
                                  "",
                              ),
                              collaborator.name,
                              collaborator.email,
                              Number(collaborator.amountToPay) || 0,
                              songId || "",
                            )
                          }
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
                        >
                          <DollarSign className="h-3.5 w-3.5" />
                          Pagar
                        </button>
                      ) : (
                        <span className="px-2.5 py-1.5 text-xs font-medium text-gray-400">
                          Pagado
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <Users className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-gray-900">
            Sin colaboradores
          </h3>
          <p className="mb-5 max-w-xs text-sm text-gray-500">
            Agrega colaboradores para gestionar splits y pagos de esta canción.
          </p>
          {isOwner && song?.requesterRole === "admin" && (
            <button
              onClick={handleOpenSplitsModal}
              className="flex items-center gap-2 rounded-lg bg-[#F97316] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Configurar Splits
            </button>
          )}
        </div>
      )}
    </>
  );
}

export type { Song };
