import { useState } from "react";
import SplitsModal from "../../../../../components/modal/SplitsModal";
import PaymentHistoryModal from "../../../../../components/modal/PaymentHistoryModal";
import OwnerSplitModal from "./ownerfrom";
import RegisterPaymentModal from "../../../../../components/modal/RegisterPaymentModal";
import PaymentConfirmationModal from "../../../../../components/modal/PaymentConfirmationModal";
import CollaboratorPaymentHistoryModal from "../../../../../components/modal/CollaboratorPaymentHistoryModal";
import { CollaboratorDetailModal } from "../../../../../components/collaborators/CollaboratorDetailModal";
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
import type { Collaborator } from "@/types";

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

export default function Table({ collaborators, songId, song, isOwner = false }: TableProps) {
  const [isSplitsModalOpen, setIsSplitsModalOpen] = useState(false);
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false);
  const [isRegisterPaymentModalOpen, setIsRegisterPaymentModalOpen] = useState(false);
  const [currentSplitId, setCurrentSplitId] = useState<string>("");
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);
  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = useState(false);
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
  const [detailCollaborator, setDetailCollaborator] = useState<Collaborator | null>(null);

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
    (song as any)?.ownerId?.split || (song as any)?.owner?.split || (song as any)?.ownerSplit,
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
      addToast("error", "Error al crear split: el owner de la cancion a un no crea su split");
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

  const AVATAR_DETAIL_PALETTE = [
    { bg: "#FED7AA", text: "#9A3412" },
    { bg: "#DBEAFE", text: "#1E40AF" },
    { bg: "#FCE7F3", text: "#9D174D" },
    { bg: "#D1FAE5", text: "#065F46" },
    { bg: "#EDE9FE", text: "#5B21B6" },
    { bg: "#FEF3C7", text: "#92400E" },
  ];

  const openCollaboratorDetail = (collaborator: UserType, idx: number) => {
    const palette = AVATAR_DETAIL_PALETTE[idx % AVATAR_DETAIL_PALETTE.length];
    const adapted: Collaborator = {
      id: String((collaborator as any)._id || collaborator.id || ""),
      name: collaborator.name || "",
      email: collaborator.email || "",
      initials: getInitials(collaborator.name || "?"),
      avatarBg: palette.bg,
      avatarText: palette.text,
      songs: 1,
      songPresencePercentage: 0,
      paid: parseFloat(String((collaborator as any).amountPaid || 0)),
      amountOwed: parseFloat(String((collaborator as any).amountToPay || 0)),
      amountPending: parseFloat(String((collaborator as any).amountToPay || 0)),
      status: "active",
      roles: (collaborator as any).roles ?? [],
    };
    setDetailCollaborator(adapted);
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
      {detailCollaborator && (
        <CollaboratorDetailModal
          collaborator={detailCollaborator}
          onClose={() => setDetailCollaborator(null)}
          isOwner={isOwner}
        />
      )}
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
      <div className="flex items-center gap-2 px-1 pb-4">
        {/* Owner Split solo disponible para admin, label no puede crearlo */}
        {isOwner && song?.requesterRole === "admin" && (
          <button
            onClick={() => setIsOwnerSplitModalOpen(true)}
            className="flex items-center gap-1.5 rounded-[16px] bg-[#FF5C00] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            <Plus className="h-3.5 w-3.5" />
            Owner Split
          </button>
        )}
        {/* Configurar Splits disponible para admin y label */}
        {(song?.requesterRole === "admin" || song?.requesterRole === "label") && (
          <button
            onClick={handleOpenSplitsModal}
            className="flex items-center gap-1.5 rounded-[16px] bg-white px-3.5 py-2 text-xs font-semibold text-[#1C1D22] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FBFBFC]"
          >
            <Music className="h-3.5 w-3.5" />
            Configurar Splits
          </button>
        )}
        {currentSplitId && (
          <>
            <button
              onClick={() => openPaymentHistoryModal(currentSplitId)}
              className="flex items-center gap-1.5 rounded-[16px] bg-white px-3.5 py-2 text-xs font-semibold text-[#1C1D22] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FBFBFC]"
            >
              <History className="h-3.5 w-3.5" />
              Historial
            </button>
            {hasWallet ? (
              <button
                onClick={() => openRegisterPaymentModal(currentSplitId)}
                className="flex items-center gap-1.5 rounded-[16px] bg-[#2FB37E] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:brightness-95"
              >
                <Plus className="h-3.5 w-3.5" />
                Nuevo Pago
              </button>
            ) : (
              <Link to="/panel/home">
                <button className="flex items-center gap-1.5 rounded-[16px] bg-[#FFEADD] px-3.5 py-2 text-xs font-semibold text-[#FF5C00] transition-colors hover:brightness-95">
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
        <div className="flex flex-col gap-2">
          {/* Header row */}
          <div className="hidden items-center gap-3 px-4 py-2 lg:flex">
            <span className="flex-1 text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
              Nombre
            </span>
            <span className="w-[220px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
              Email
            </span>
            <span className="w-[80px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
              Split %
            </span>
            <span className="w-[100px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
              Pagado
            </span>
            <span className="w-[110px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
              Pendiente
            </span>
            <span className="w-[100px] text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
              Estado
            </span>
            <span className="flex w-[184px] justify-end text-[10.5px] font-semibold uppercase tracking-wide text-[#A6AAB2]">
              Acciones
            </span>
          </div>

          {collaborators.map((collaborator, idx) => {
            const hasActiveSplit =
              collaborator.percentage && parseFloat(String(collaborator.percentage)) > 0;
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <div
                key={collaborator.id}
                onClick={() => openCollaboratorDetail(collaborator, idx)}
                className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                {/* Name */}
                <div className="flex flex-1 items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full ${avatarColor} flex flex-shrink-0 items-center justify-center`}
                  >
                    <span className="text-xs font-semibold text-white">
                      {getInitials(collaborator.name || "?")}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#1C1D22]">{collaborator.name}</span>
                </div>

                {/* Email */}
                <span className="w-[220px] truncate text-sm text-[#71757E]">
                  {collaborator.email}
                </span>

                {/* Split % */}
                <span className="w-[80px] text-sm font-semibold text-[#1C1D22]">
                  {collaborator.percentage ? `${collaborator.percentage}%` : "—"}
                </span>

                {/* Pagado */}
                <span className="w-[100px] text-sm font-medium text-[#71757E]">
                  {(collaborator as any).amountPaid
                    ? `$${(collaborator as any).amountPaid}`
                    : "$0.00"}
                </span>

                {/* Pendiente */}
                <span className="w-[110px] text-sm font-semibold text-[#1C1D22]">
                  {collaborator.amountToPay ? `$${collaborator.amountToPay}` : "—"}
                </span>

                {/* Status */}
                <div className="w-[100px]">
                  {hasActiveSplit ? (
                    <span className="inline-flex rounded-full bg-[#E4F5EC] px-2.5 py-1 text-[10.5px] font-semibold text-[#2FB37E]">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-[#FFEADD] px-2.5 py-1 text-[10.5px] font-semibold text-[#FF5C00]">
                      Sin split
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div
                  className="flex w-[184px] items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      setHistoryModal({
                        open: true,
                        id: String((collaborator as any)._id || collaborator.id || ""),
                        name: collaborator.name || "",
                      })
                    }
                    className="flex items-center gap-1.5 rounded-[16px] bg-[#F4F5F7] px-2.5 py-1.5 text-[11px] font-medium text-[#1C1D22] transition-colors hover:bg-[#E7E9EC]"
                  >
                    <History className="h-3 w-3" />
                    Historial
                  </button>

                  {Number(collaborator.amountToPay) > 0 ? (
                    <button
                      onClick={() =>
                        openPaymentConfirmation(
                          String((collaborator as any)._id || collaborator.id || ""),
                          collaborator.name,
                          collaborator.email,
                          Number(collaborator.amountToPay) || 0,
                          songId || "",
                        )
                      }
                      className="flex items-center gap-1.5 rounded-[16px] bg-[#2FB37E] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:brightness-95"
                    >
                      <DollarSign className="h-3 w-3" />
                      Pagar
                    </button>
                  ) : (
                    <span className="text-[11.5px] font-medium text-[#A6AAB2]">
                      Pagado
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[16px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <Users className="h-6 w-6 text-[#A6AAB2]" />
          </div>
          <h3 className="mb-1 text-sm font-semibold text-[#1C1D22]">Sin colaboradores</h3>
          <p className="mb-5 max-w-xs text-sm text-[#71757E]">
            Agrega colaboradores para gestionar splits y pagos de esta canción.
          </p>
          {(song?.requesterRole === "admin" || song?.requesterRole === "label") && (
            <button
              onClick={handleOpenSplitsModal}
              className="flex items-center gap-2 rounded-[12px] bg-[#FF5C00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#EA580C]"
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
