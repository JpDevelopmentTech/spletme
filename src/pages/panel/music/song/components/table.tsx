import { useEffect, useMemo, useState, type ReactNode } from "react";
import SplitsModal from "../../../../../components/modal/SplitsModal";
import OwnerSplitModal from "./ownerfrom";
import PaymentConfirmationModal from "../../../../../components/modal/PaymentConfirmationModal";
import CollaboratorPaymentHistoryModal from "../../../../../components/modal/CollaboratorPaymentHistoryModal";
import { CollaboratorDetailModal } from "../../../../../components/collaborators/CollaboratorDetailModal";
import {
  DollarSign,
  Plus,
  History,
  Users,
  Music,
  Globe,
  Radio,
  Pencil,
  CircleCheck,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { User as UserType } from "../../../../../models/user";
import PaymentsService from "@/services/payments";
import { songSplitsService } from "@/services/songSplits";
import type { SongSplitDistribution, SplitDistributionEntry } from "@/types/song-split.types";
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
  /** Se pinta en la cabecera de la tarjeta, junto a las acciones de split. */
  headerAction?: ReactNode;
}

/** Campos que el backend añade al colaborador y que `User` todavía no declara. */
type CollaboratorExtras = UserType & {
  _id?: string;
  amountPaid?: number | string;
  roles?: string[];
};

/** Lo que la canción trae sobre el split del owner, según de dónde venga poblado. */
type SongWithOwnerSplit = Omit<Song, "ownerId" | "owner"> & {
  ownerId?: string | { split?: unknown };
  owner?: { id: string; name: string; email: string; split?: unknown };
  ownerSplit?: unknown;
};

const extras = (collaborator: UserType): CollaboratorExtras => collaborator as CollaboratorExtras;

const collaboratorId = (collaborator: UserType): string =>
  String(extras(collaborator)._id || collaborator.id || "");

/** Fila ya resuelta: mezcla el colaborador con el alcance y el monto que da el backend. */
interface Row {
  key: string;
  userId: string;
  name: string;
  email: string;
  isOwnerRow: boolean;
  percentage: number | null;
  amount: number | null;
  paid: number;
  pending: number;
  scope: { label: string; worldwide: boolean } | null;
  raw?: UserType;
  index: number;
}

const formatMoney = (value: number) =>
  value.toLocaleString("es-CO", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0] ?? "")
      .join("")
      .toUpperCase() || "?"
  );
}

const idOf = (ref: SplitDistributionEntry["userId"]): string =>
  typeof ref === "string" ? ref : String(ref?._id ?? ref?.id ?? "");

/** Traduce el alcance del split a una frase corta. */
const scopeOf = (entry?: SplitDistributionEntry | null) => {
  if (!entry) return null;
  const everywhere = entry.countriesType === "all" && entry.platformsType === "all";
  if (everywhere) return { label: "Todos los países y plataformas", worldwide: true };
  const countries =
    entry.countriesType === "all" ? "Todos los países" : entry.selectedCountries?.join(", ");
  const platforms =
    entry.platformsType === "all" ? "todas las plataformas" : entry.selectedPlatforms?.join(", ");
  return { label: [countries, platforms].filter(Boolean).join(" · ") || "—", worldwide: false };
};

export default function Table({
  collaborators,
  songId,
  song,
  isOwner = false,
  headerAction,
}: TableProps) {
  const [isSplitsModalOpen, setIsSplitsModalOpen] = useState(false);
  const [isOwnerSplitModalOpen, setIsOwnerSplitModalOpen] = useState(false);
  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = useState(false);
  const [distribution, setDistribution] = useState<SongSplitDistribution | null>(null);
  const [historyModal, setHistoryModal] = useState<{
    open: boolean;
    id: string;
    name: string;
    pending: number;
  }>({ open: false, id: "", name: "", pending: 0 });
  const [paymentData, setPaymentData] = useState<{
    collaboratorId: string;
    collaboratorName: string;
    collaboratorEmail: string;
    amount: number;
    songId: string;
  } | null>(null);
  const [toasts, setToasts] = useState<ValidationToastItem[]>([]);
  const [detailCollaborator, setDetailCollaborator] = useState<Collaborator | null>(null);

  const currentUser = LocalStorageService.getItem("user");
  const rawUserType = String(
    currentUser?.role ||
      currentUser?.type ||
      currentUser?.userType ||
      currentUser?.accountType ||
      "",
  ).toLowerCase();
  const isLabelUser = rawUserType.includes("label");
  const songWithSplit = song as SongWithOwnerSplit | undefined;
  const ownerIdRef = songWithSplit?.ownerId;
  const hasOwnerSplit = Boolean(
    (typeof ownerIdRef === "object" ? ownerIdRef?.split : undefined) ||
      songWithSplit?.owner?.split ||
      songWithSplit?.ownerSplit,
  );

  // El alcance de cada split y el monto que le toca solo vienen en la distribución.
  useEffect(() => {
    if (!songId) return;
    let active = true;
    songSplitsService
      .getSongSplits(songId)
      .then((data) => {
        if (active) setDistribution(data);
      })
      .catch(() => {
        if (active) setDistribution(null);
      });
    return () => {
      active = false;
    };
  }, [songId]);

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
      addToast("error", "No puedes crear splits hasta que el owner cree el suyo.");
      return;
    }
    setIsSplitsModalOpen(true);
  };

  const handleSplitSaved = () => {
    // El backend recalcula la distribución al guardar; la página se relee entera.
    setTimeout(() => window.location.reload(), 500);
  };

  const handleOwnerSplitCreated = () => {
    setIsOwnerSplitModalOpen(false);
    window.location.reload();
  };

  const openPaymentConfirmation = (
    collaboratorId: string,
    collaboratorName: string,
    collaboratorEmail: string,
    amount: number,
    targetSongId: string,
  ) => {
    setPaymentData({
      collaboratorId,
      collaboratorName,
      collaboratorEmail,
      amount,
      songId: targetSongId,
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
      id: collaboratorId(collaborator),
      name: collaborator.name || "",
      email: collaborator.email || "",
      initials: getInitials(collaborator.name || "?"),
      avatarBg: palette.bg,
      avatarText: palette.text,
      songs: 1,
      songPresencePercentage: 0,
      paid: parseFloat(String(extras(collaborator).amountPaid || 0)),
      amountOwed: parseFloat(String(collaborator.amountToPay || 0)),
      amountPending: parseFloat(String(collaborator.amountToPay || 0)),
      status: "active",
      roles: extras(collaborator).roles ?? [],
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

  /** Owner primero y luego los colaboradores, cada uno con su alcance resuelto. */
  const rows = useMemo<Row[]>(() => {
    const byUser = new Map<string, SplitDistributionEntry>();
    for (const entry of distribution?.collaborators ?? []) {
      const id = idOf(entry.userId);
      if (id) byUser.set(id, entry);
    }

    const ownerEntry = distribution?.owner ?? null;
    const ownerRow: Row[] = ownerEntry
      ? [
          {
            key: "owner",
            userId: idOf(ownerEntry.userId),
            name: isOwner ? "Tú (owner)" : song?.owner?.name || "El owner",
            email: song?.owner?.email || "",
            isOwnerRow: true,
            percentage: ownerEntry.percentage ?? null,
            amount: ownerEntry.amount ?? null,
            paid: 0,
            pending: 0,
            scope: scopeOf(ownerEntry),
            index: -1,
          },
        ]
      : [];

    const collaboratorRows: Row[] = (collaborators ?? []).map((collaborator, index) => {
      const id = collaboratorId(collaborator);
      const entry = byUser.get(id);
      const pending = Number(collaborator.amountToPay ?? 0) || 0;
      return {
        key: id || `collaborator-${index}`,
        userId: id,
        name: collaborator.name || "—",
        email: collaborator.email || "",
        isOwnerRow: false,
        percentage:
          entry?.percentage ??
          (collaborator.percentage != null ? Number(collaborator.percentage) : null),
        amount: entry?.amount ?? null,
        paid: Number(extras(collaborator).amountPaid ?? 0) || 0,
        pending,
        scope: scopeOf(entry),
        raw: collaborator,
        index,
      };
    });

    return [...ownerRow, ...collaboratorRows];
  }, [collaborators, distribution, isOwner, song]);

  const assigned = rows.reduce((sum, row) => sum + (row.percentage ?? 0), 0);
  const distributable = distribution?.collaboratorsPool ?? 0;
  const balanced = Math.round(assigned) === 100;

  const canManageSplits = song?.requesterRole === "admin" || song?.requesterRole === "label";

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

      <SplitsModal
        collaborators={collaborators}
        isOpen={isSplitsModalOpen}
        onClose={() => setIsSplitsModalOpen(false)}
        songId={songId || ""}
        onSplitSaved={handleSplitSaved}
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
        onClose={() => setHistoryModal({ open: false, id: "", name: "", pending: 0 })}
        songId={songId || ""}
        collaboratorId={historyModal.id}
        collaboratorName={historyModal.name}
        songTitle={song?.trackTitle}
        pendingAmount={historyModal.pending}
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
        songTitle={song?.trackTitle}
      />

      <section className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
        <header className="flex flex-wrap items-center justify-between gap-3.5 px-5 py-[18px]">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-display text-[18px] font-semibold text-[#1C1D22]">
              Quién cobra de esta canción
            </h3>
            <p
              className={`text-[12.5px] font-medium ${balanced ? "text-[#2FB37E]" : "text-[#EA580C]"}`}
            >
              {rows.length === 0
                ? "Todavía no hay nadie asignado"
                : balanced
                  ? "El 100% está asignado · no queda nada suelto"
                  : `Falta repartir ${Math.max(0, 100 - Math.round(assigned))}%`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isOwner && song?.requesterRole === "admin" && (
              <button
                type="button"
                onClick={() => setIsOwnerSplitModalOpen(true)}
                className="inline-flex items-center gap-[7px] rounded-[20px] border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#71757E] transition-colors hover:text-[#1C1D22]"
              >
                <Plus className="h-3.5 w-3.5" />
                Mi split
              </button>
            )}
            {canManageSplits && (
              <button
                type="button"
                onClick={handleOpenSplitsModal}
                className="inline-flex items-center gap-[7px] rounded-[20px] border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#71757E] transition-colors hover:text-[#1C1D22]"
              >
                <Music className="h-3.5 w-3.5" />
                Repartir splits
              </button>
            )}
            {headerAction}
          </div>
        </header>

        <div className="h-px bg-[#E8E8EC]" />

        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-16 text-center">
            <span className="grid h-[58px] w-[58px] place-items-center rounded-[20px] bg-[#FFEADD]">
              <Users className="h-6 w-6 text-[#FF5C00]" />
            </span>
            <p className="text-[15px] font-semibold text-[#1C1D22]">Nadie cobra de esta canción</p>
            <p className="max-w-[400px] text-[13px] text-[#71757E]">
              Reparte los splits para decidir quién cobra y cuánto le toca de lo que entra.
            </p>
            {canManageSplits && (
              <button
                type="button"
                onClick={handleOpenSplitsModal}
                className="mt-1 inline-flex items-center gap-[7px] rounded-[20px] bg-[#FF5C00] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
              >
                <Plus className="h-3.5 w-3.5" />
                Repartir splits
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden items-center gap-3.5 px-5 py-[13px] lg:flex">
              <span className="flex-1 font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
                COLABORADOR
              </span>
              <span className="w-[152px] font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
                ALCANCE
              </span>
              <span className="w-[70px] font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
                %
              </span>
              <span className="w-[130px] font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
                LE CORRESPONDE
              </span>
              <span className="w-[148px] font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
                ESTADO
              </span>
              <span className="w-[110px]" />
            </div>

            <div className="h-px bg-[#E8E8EC]" />

            <ul>
              {rows.map((row, index) => (
                <li key={row.key}>
                  {index > 0 && <div className="h-px bg-[#E8E8EC]" />}
                  <div
                    className={`flex flex-wrap items-center gap-3.5 px-5 py-3 ${
                      row.isOwnerRow ? "bg-[#FF5C00]/[0.04]" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        !row.isOwnerRow && row.raw && openCollaboratorDetail(row.raw, row.index)
                      }
                      disabled={row.isOwnerRow}
                      className="flex min-w-[200px] flex-1 items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] disabled:cursor-default"
                    >
                      <span
                        className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-[11.5px] font-semibold text-white ${
                          row.isOwnerRow ? "bg-[#FF5C00]" : "bg-[#1C1D22]"
                        }`}
                      >
                        {getInitials(row.name)}
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-[13px] font-semibold text-[#1C1D22]">
                          {row.name}
                        </span>
                        <span className="truncate text-[11px] text-[#A6AAB2]">
                          {row.email || "—"}
                        </span>
                      </span>
                    </button>

                    <span className="flex w-[152px] items-center gap-1.5">
                      {row.scope ? (
                        <>
                          {row.scope.worldwide ? (
                            <Globe className="h-3 w-3 shrink-0 text-[#A6AAB2]" />
                          ) : (
                            <Radio className="h-3 w-3 shrink-0 text-[#A6AAB2]" />
                          )}
                          <span className="truncate text-[11px] text-[#71757E]">
                            {row.scope.label}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-[#A6AAB2]">Sin split</span>
                      )}
                    </span>

                    <span className="w-[70px] font-mono text-[14px] font-semibold text-[#1C1D22]">
                      {row.percentage != null ? `${row.percentage}%` : "—"}
                    </span>

                    <span className="w-[130px] font-mono text-[13px] font-semibold text-[#2FB37E]">
                      {row.amount != null ? formatMoney(row.amount) : "—"}
                    </span>

                    <span className="w-[148px]">
                      <StatusChip row={row} />
                    </span>

                    <span className="flex w-[110px] items-center justify-end gap-1.5">
                      {!row.isOwnerRow && (
                        <>
                          <IconButton
                            label="Editar el split"
                            onClick={handleOpenSplitsModal}
                            disabled={!canManageSplits}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </IconButton>
                          <IconButton
                            label="Ver sus pagos"
                            onClick={() =>
                              setHistoryModal({
                                open: true,
                                id: row.userId,
                                name: row.name,
                                pending: row.pending,
                              })
                            }
                          >
                            <History className="h-3.5 w-3.5" />
                          </IconButton>
                          {row.pending > 0 && isOwner && (
                            <IconButton
                              label={`Pagarle ${formatMoney(row.pending)}`}
                              accent
                              onClick={() =>
                                openPaymentConfirmation(
                                  row.userId,
                                  row.name,
                                  row.email,
                                  row.pending,
                                  songId || "",
                                )
                              }
                            >
                              <DollarSign className="h-3.5 w-3.5" />
                            </IconButton>
                          )}
                        </>
                      )}
                      {row.isOwnerRow && isOwner && song?.requesterRole === "admin" && (
                        <IconButton
                          label="Editar mi split"
                          onClick={() => setIsOwnerSplitModalOpen(true)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </IconButton>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="h-px bg-[#E8E8EC]" />

            <footer className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
              <span className="flex items-center gap-2.5">
                {balanced ? (
                  <CircleCheck className="h-3.5 w-3.5 text-[#2FB37E]" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-[#EA580C]" />
                )}
                <span
                  className={`text-[12px] font-semibold ${balanced ? "text-[#2FB37E]" : "text-[#EA580C]"}`}
                >
                  {Math.round(assigned)}% asignado
                </span>
                <span className="text-[12px] text-[#A6AAB2]">·</span>
                <span className="text-[12px] text-[#71757E]">
                  {rows.length} {rows.length === 1 ? "participante" : "participantes"}
                  {distributable > 0 ? ` sobre ${formatMoney(distributable)} repartibles` : ""}
                </span>
              </span>
              <span className="text-[11px] text-[#A6AAB2]">
                El alcance limita en qué países o plataformas aplica cada split
              </span>
            </footer>
          </>
        )}
      </section>

    </>
  );
}

const StatusChip = ({ row }: { row: Row }) => {
  if (row.percentage == null) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#F4F5F7] px-2.5 py-[5px] text-[10.5px] font-semibold text-[#71757E]">
        Sin split
      </span>
    );
  }
  if (row.isOwnerRow) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#FFEADD] px-2.5 py-[5px] text-[10.5px] font-semibold text-[#FF5C00]">
        Es tu parte
      </span>
    );
  }
  if (row.pending > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#FFEADD] px-2.5 py-[5px] text-[10.5px] font-semibold text-[#EA580C]">
        <Clock3 className="h-[11px] w-[11px]" />
        Por pagar
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#E4F5EC] px-2.5 py-[5px] text-[10.5px] font-semibold text-[#2FB37E]">
      <CircleCheck className="h-[11px] w-[11px]" />
      Al día
    </span>
  );
};

const IconButton = ({
  children,
  label,
  accent,
  disabled,
  onClick,
}: {
  children: ReactNode;
  label: string;
  accent?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className={`grid h-[30px] w-[30px] place-items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] disabled:opacity-40 ${
      accent
        ? "border-[#2FB37E] bg-[#2FB37E] text-white hover:brightness-95"
        : "border-[#E8E8EC] bg-white text-[#71757E] hover:bg-[#F4F5F7]"
    }`}
  >
    {children}
  </button>
);

export type { Song };
