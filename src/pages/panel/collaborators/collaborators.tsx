import { useState } from "react";
import { Plus } from "lucide-react";
import { CollaboratorsStatsGrid } from "@/components/collaborators/CollaboratorsStatsGrid";
import { CollaboratorsTable } from "@/components/collaborators/CollaboratorsTable";
import { FeaturedCollaboratorCard } from "@/components/collaborators/FeaturedCollaboratorCard";
import { RecentPaymentsSection } from "@/components/collaborators/RecentPaymentsSection";
import type { Collaborator, CollaboratorPayment } from "@/types";

// TODO: reemplazar con datos reales del hook useCollaborators cuando esté integrado
const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: "1", name: "Lucia Reyes", email: "lucia.reyes@email.com",
    initials: "LR", avatarBg: "#FED7AA", avatarText: "#9A3412",
    songs: 12, splitPercentage: 30, paid: 3180, status: "active",
    role: "Productor principal",
    recentSongs: [
      { title: "Solar Drift", streams: "612K streams", percentage: 30 },
      { title: "Velvet Horizon", streams: "480K streams", percentage: 30 },
      { title: "Echo Chambers", streams: "352K streams", percentage: 30 },
    ],
  },
  {
    id: "2", name: "Diego Marín", email: "diego.marin@email.com",
    initials: "DM", avatarBg: "#DBEAFE", avatarText: "#1E40AF",
    songs: 8, splitPercentage: 25, paid: 2140.5, status: "active",
  },
  {
    id: "3", name: "Ana Velasco", email: "ana.velasco@email.com",
    initials: "AV", avatarBg: "#FCE7F3", avatarText: "#9D174D",
    songs: 15, splitPercentage: 40, paid: 1820.3, status: "pending",
  },
  {
    id: "4", name: "Mateo Salas", email: "mateo.salas@email.com",
    initials: "MS", avatarBg: "#D1FAE5", avatarText: "#065F46",
    songs: 5, splitPercentage: 15, paid: 895.4, status: "active",
  },
  {
    id: "5", name: "Sofia Castro", email: "sofia.castro@email.com",
    initials: "SC", avatarBg: "#EDE9FE", avatarText: "#5B21B6",
    songs: 7, splitPercentage: 20, paid: 1240.8, status: "no_wallet",
  },
  {
    id: "6", name: "Javier Torres", email: "javier.torres@email.com",
    initials: "JT", avatarBg: "#FEF3C7", avatarText: "#92400E",
    songs: 3, splitPercentage: 10, paid: 420.1, status: "active",
  },
];

// TODO: reemplazar con datos reales del hook usePayments cuando esté integrado
const MOCK_PAYMENTS: CollaboratorPayment[] = [
  {
    id: "p1", collaboratorName: "Lucia Reyes", initials: "LR",
    avatarBg: "#FED7AA", avatarText: "#9A3412",
    songTitle: "Solar Drift", isrc: "USRC17608123",
    relativeDate: "Hace 2 horas", date: "10 may 2026", amount: 3180, status: "completed",
  },
  {
    id: "p2", collaboratorName: "Diego Marín", initials: "DM",
    avatarBg: "#DBEAFE", avatarText: "#1E40AF",
    songTitle: "Velvet Horizon", isrc: "USRC17608124",
    relativeDate: "Ayer", date: "9 may 2026", amount: 2140.5, status: "completed",
  },
  {
    id: "p3", collaboratorName: "Ana Velasco", initials: "AV",
    avatarBg: "#FCE7F3", avatarText: "#9D174D",
    songTitle: "Echo Chambers", isrc: "USRC17608125",
    relativeDate: "Hace 3 días", date: "7 may 2026", amount: 1820.3, status: "processing",
  },
  {
    id: "p4", collaboratorName: "Mateo Salas", initials: "MS",
    avatarBg: "#D1FAE5", avatarText: "#065F46",
    songTitle: "Quiet Skylines", isrc: "USRC17608126",
    relativeDate: "Hace 5 días", date: "5 may 2026", amount: 895.4, status: "completed",
  },
];

export default function Collaborators() {
  const [featuredId, setFeaturedId] = useState(MOCK_COLLABORATORS[0].id);
  const featured = MOCK_COLLABORATORS.find((c) => c.id === featuredId) ?? MOCK_COLLABORATORS[0];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="px-6 lg:px-10 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#111827]">Colaboradores</h1>
            <p className="text-sm text-[#6B7280]">Organiza y gestiona a las personas que comparten tus regalías</p>
            <div className="w-10 h-0.5 rounded-full bg-[#F97316] mt-1" />
          </div>
          <button className="flex items-center gap-2 px-4 h-10 bg-[#F97316] hover:bg-orange-600 text-white text-[13px] font-semibold rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Agregar Colaborador
          </button>
        </div>

        <CollaboratorsStatsGrid
          totalCollaborators={24}
          totalSent="$8,420.00"
          totalReceived="$3,180.00"
          activeSplits={58}
          pendingPayments={12}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <CollaboratorsTable
            collaborators={MOCK_COLLABORATORS}
            featuredId={featuredId}
            onSelectCollaborator={setFeaturedId}
          />
          <FeaturedCollaboratorCard collaborator={featured} />
        </div>

        <RecentPaymentsSection payments={MOCK_PAYMENTS} />
      </div>
    </div>
  );
}
