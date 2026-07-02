import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { CollaboratorsStatsGrid } from "@/components/collaborators/CollaboratorsStatsGrid";
import { CollaboratorsTable } from "@/components/collaborators/CollaboratorsTable";
import { FeaturedCollaboratorCard } from "@/components/collaborators/FeaturedCollaboratorCard";
import { CollaboratorDetailModal } from "@/components/collaborators/CollaboratorDetailModal";
import { CollaboratorPaymentModal } from "@/components/modal/CollaboratorPaymentModal";
import { RecentPaymentsSection } from "@/components/collaborators/RecentPaymentsSection";
import { AddCollaboratorSidebar } from "./components/AddCollaboratorSidebar";
import type { Collaborator, CollaboratorPayment } from "@/types";
import CollaboratorService from "@/services/collaborator";
import LocalStorageService from "@/services/localstorage";

const AVATAR_PALETTE = [
  { bg: "#FED7AA", text: "#9A3412" },
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FEF3C7", text: "#92400E" },
];

interface ApiCollaborator {
  userId: string;
  id: string;
  name: string;
  email: string;
  roles: string[];
  songCount: number;
  songPresencePercentage: number;
  activeSplits: number;
  splitPercentage: number | null;
  amountOwed: number;
  totalPaid: number;
  amountPending: number;
  paymentStatus: string;
  isActive: boolean;
  hasWallet: boolean;
  hasActiveStripeAccount: boolean;
}

interface ApiSummary {
  totalCollaborators: number;
  totalLabels: number;
  byRole: { collaborator: number; label: number };
  activeSplits: number;
  totalAmountSent: number;
  totalPending: number;
  totalAmountReceived: number;
}

interface MetricsResponse {
  summary: ApiSummary;
  collaborators: ApiCollaborator[];
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const resolveStatus = (c: ApiCollaborator): Collaborator["status"] => {
  if (!c.hasWallet) return "no_wallet";
  if (c.paymentStatus === "pending") return "pending";
  return "active";
};

const adaptCollaborator = (raw: ApiCollaborator, idx: number): Collaborator => {
  const palette = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
  return {
    id: raw.userId,
    externalId: raw.id,
    name: raw.name,
    email: raw.email,
    initials: getInitials(raw.name),
    avatarBg: palette.bg,
    avatarText: palette.text,
    songs: raw.songCount,
    songPresencePercentage: raw.songPresencePercentage ?? 0,
    splitPercentage: raw.splitPercentage ?? null,
    paid: raw.totalPaid,
    amountOwed: raw.amountOwed ?? 0,
    amountPending: raw.amountPending ?? 0,
    status: resolveStatus(raw),
    roles: raw.roles ?? [],
  };
};

// TODO: reemplazar con endpoint de pagos cuando esté disponible
const MOCK_PAYMENTS: CollaboratorPayment[] = [
  {
    id: "p1",
    collaboratorName: "Lucia Reyes",
    initials: "LR",
    avatarBg: "#FED7AA",
    avatarText: "#9A3412",
    songTitle: "Solar Drift",
    isrc: "USRC17608123",
    relativeDate: "Hace 2 horas",
    date: "10 may 2026",
    amount: 3180,
    status: "completed",
  },
  {
    id: "p2",
    collaboratorName: "Diego Marín",
    initials: "DM",
    avatarBg: "#DBEAFE",
    avatarText: "#1E40AF",
    songTitle: "Velvet Horizon",
    isrc: "USRC17608124",
    relativeDate: "Ayer",
    date: "9 may 2026",
    amount: 2140.5,
    status: "completed",
  },
  {
    id: "p3",
    collaboratorName: "Ana Velasco",
    initials: "AV",
    avatarBg: "#FCE7F3",
    avatarText: "#9D174D",
    songTitle: "Echo Chambers",
    isrc: "USRC17608125",
    relativeDate: "Hace 3 días",
    date: "7 may 2026",
    amount: 1820.3,
    status: "processing",
  },
  {
    id: "p4",
    collaboratorName: "Mateo Salas",
    initials: "MS",
    avatarBg: "#D1FAE5",
    avatarText: "#065F46",
    songTitle: "Quiet Skylines",
    isrc: "USRC17608126",
    relativeDate: "Hace 5 días",
    date: "5 may 2026",
    amount: 895.4,
    status: "completed",
  },
];

export default function Collaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [metrics, setMetrics] = useState<ApiSummary | null>(null);
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = LocalStorageService.getItem("user");
  const userRole = String(currentUser?.role ?? "").toLowerCase();
  const canAddCollaborator = !currentUser?.parentUserId || userRole === "label";

  const refreshMetrics = useCallback(async () => {
    const response = await CollaboratorService.getMetrics();
    const payload: MetricsResponse | null = response?.data ?? null;
    if (payload) {
      setMetrics(payload.summary);
      const list = payload.collaborators.map(adaptCollaborator);
      setCollaborators(list);
      // Conserva la selección actual; solo destaca el primero en la carga inicial.
      setFeaturedId((prev) => prev ?? (list.length > 0 ? list[0].id : null));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  const featured = collaborators.find((c) => c.id === featuredId) ?? collaborators[0];

  const totalSent = metrics?.totalAmountSent ?? 0;
  const totalReceived = metrics?.totalAmountReceived ?? 0;
  const activeSplits = metrics?.activeSplits ?? 0;
  const pendingPayments = collaborators.filter((c) => c.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="flex flex-col gap-6 px-6 py-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#111827]">Colaboradores</h1>
            <p className="text-sm text-[#6B7280]">
              Organiza y gestiona a las personas que comparten tus regalías
            </p>
            <div className="mt-1 h-0.5 w-10 rounded-full bg-[#F97316]" />
          </div>
          {canAddCollaborator && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#F97316] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Agregar Colaborador
            </button>
          )}
        </div>

        <CollaboratorsStatsGrid
          totalCollaborators={loading ? 0 : (metrics?.totalCollaborators ?? collaborators.length)}
          totalSent={
            loading
              ? "$0.00"
              : `$${totalSent.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
          }
          totalReceived={
            loading
              ? "$0.00"
              : `$${totalReceived.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
          }
          activeSplits={loading ? 0 : activeSplits}
          pendingPayments={loading ? 0 : pendingPayments}
        />

        {!loading && collaborators.length > 0 && featured && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <CollaboratorsTable
              collaborators={collaborators}
              featuredId={featuredId ?? ""}
              onSelectCollaborator={setFeaturedId}
            />
            <FeaturedCollaboratorCard
              collaborator={featured}
              onViewProfile={() => setProfileOpen(true)}
              onPaySplit={() => setPayOpen(true)}
            />
          </div>
        )}

        <RecentPaymentsSection payments={MOCK_PAYMENTS} />
      </div>

      {profileOpen && featured && (
        <CollaboratorDetailModal collaborator={featured} onClose={() => setProfileOpen(false)} isOwner />
      )}

      {featured && (
        <CollaboratorPaymentModal
          isOpen={payOpen}
          onClose={() => setPayOpen(false)}
          collaboratorId={featured.id}
          collaboratorName={featured.name}
          collaboratorEmail={featured.email}
          onPaymentSuccess={refreshMetrics}
        />
      )}

      <AddCollaboratorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
