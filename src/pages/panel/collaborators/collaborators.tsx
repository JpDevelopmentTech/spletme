import { useState } from "react";
import {
  Plus,
  Users,
  ArrowUp,
  ArrowDown,
  Percent,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Crown,
  Music,
  ArrowRight,
} from "lucide-react";

type CollaboratorStatus = "active" | "pending" | "no_wallet";

interface RecentSong {
  title: string;
  streams: string;
  percentage: number;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  songs: number;
  splitPercentage: number;
  paid: number;
  status: CollaboratorStatus;
  role?: string;
  recentSongs?: RecentSong[];
}

interface Payment {
  id: string;
  collaboratorName: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  songTitle: string;
  isrc: string;
  relativeDate: string;
  date: string;
  amount: number;
  status: "completed" | "processing" | "failed";
}

const collaborators: Collaborator[] = [
  {
    id: "1",
    name: "Lucia Reyes",
    email: "lucia.reyes@email.com",
    initials: "LR",
    avatarBg: "#FED7AA",
    avatarText: "#9A3412",
    songs: 12,
    splitPercentage: 30,
    paid: 3180,
    status: "active",
    role: "Productor principal",
    recentSongs: [
      { title: "Solar Drift", streams: "612K streams", percentage: 30 },
      { title: "Velvet Horizon", streams: "480K streams", percentage: 30 },
      { title: "Echo Chambers", streams: "352K streams", percentage: 30 },
    ],
  },
  {
    id: "2",
    name: "Diego Marín",
    email: "diego.marin@email.com",
    initials: "DM",
    avatarBg: "#DBEAFE",
    avatarText: "#1E40AF",
    songs: 8,
    splitPercentage: 25,
    paid: 2140.5,
    status: "active",
  },
  {
    id: "3",
    name: "Ana Velasco",
    email: "ana.velasco@email.com",
    initials: "AV",
    avatarBg: "#FCE7F3",
    avatarText: "#9D174D",
    songs: 15,
    splitPercentage: 40,
    paid: 1820.3,
    status: "pending",
  },
  {
    id: "4",
    name: "Mateo Salas",
    email: "mateo.salas@email.com",
    initials: "MS",
    avatarBg: "#D1FAE5",
    avatarText: "#065F46",
    songs: 5,
    splitPercentage: 15,
    paid: 895.4,
    status: "active",
  },
  {
    id: "5",
    name: "Sofia Castro",
    email: "sofia.castro@email.com",
    initials: "SC",
    avatarBg: "#EDE9FE",
    avatarText: "#5B21B6",
    songs: 7,
    splitPercentage: 20,
    paid: 1240.8,
    status: "no_wallet",
  },
  {
    id: "6",
    name: "Javier Torres",
    email: "javier.torres@email.com",
    initials: "JT",
    avatarBg: "#FEF3C7",
    avatarText: "#92400E",
    songs: 3,
    splitPercentage: 10,
    paid: 420.1,
    status: "active",
  },
];

const recentPayments: Payment[] = [
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

const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatCompactCurrency = (value: number) => {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

const statusBadge = (status: CollaboratorStatus) => {
  switch (status) {
    case "active":
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        dot: "bg-green-500",
        label: "Activo",
      };
    case "pending":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",
        label: "Pendiente",
      };
    case "no_wallet":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",
        label: "Sin wallet",
      };
  }
};

const paymentStatusBadge = (status: Payment["status"]) => {
  switch (status) {
    case "completed":
      return { bg: "bg-green-50", text: "text-green-700", label: "Completado" };
    case "processing":
      return { bg: "bg-amber-50", text: "text-amber-700", label: "Procesando" };
    case "failed":
      return { bg: "bg-red-50", text: "text-red-700", label: "Fallido" };
  }
};

export default function Collaborators() {
  const [featuredId, setFeaturedId] = useState(collaborators[0].id);
  const featured =
    collaborators.find((c) => c.id === featuredId) ?? collaborators[0];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="px-6 lg:px-10 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#111827]">Colaboradores</h1>
            <p className="text-sm text-[#6B7280]">
              Organiza y gestiona a las personas que comparten tus regalías
            </p>
            <div className="w-10 h-0.5 rounded-full bg-[#F97316] mt-1" />
          </div>
          <button className="flex items-center gap-2 px-4 h-10 bg-[#F97316] hover:bg-orange-600 text-white text-[13px] font-semibold rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Agregar Colaborador
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">
                Total Colaboradores
              </span>
              <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#6B7280]" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-[#111827] leading-none">
              24
            </p>
            <span className="text-[11px] font-medium text-green-500">
              +3 este mes
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">
                Pagos Enviados
              </span>
              <div className="w-7 h-7 bg-red-50 rounded-md flex items-center justify-center">
                <ArrowUp className="w-3.5 h-3.5 text-red-500" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-[#111827] leading-none">
              $8,420.00
            </p>
            <span className="text-[11px] font-medium text-[#9CA3AF]">
              32 pagos en total
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">
                Pagos Recibidos
              </span>
              <div className="w-7 h-7 bg-green-50 rounded-md flex items-center justify-center">
                <ArrowDown className="w-3.5 h-3.5 text-green-500" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-green-500 leading-none">
              $3,180.00
            </p>
            <span className="text-[11px] font-medium text-[#F97316]">
              12 pagos pendientes
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">
                Splits Activos
              </span>
              <div className="w-7 h-7 bg-orange-50 rounded-md flex items-center justify-center">
                <Percent className="w-3.5 h-3.5 text-[#F97316]" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-[#111827] leading-none">
              58
            </p>
            <span className="text-[11px] font-medium text-[#9CA3AF]">
              En 24 canciones
            </span>
          </div>
        </div>

        {/* Two-column main */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Table */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-[#111827]">
                  Listado de Colaboradores
                </span>
                <span className="px-2.5 py-0.5 bg-gray-100 text-[#6B7280] text-[11px] font-bold rounded-full">
                  {collaborators.length}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="relative w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Buscar colaborador..."
                    className="w-full pl-9 pr-3 h-9 border border-gray-200 rounded-lg text-[13px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
                <button className="flex items-center gap-1.5 px-3 h-9 border border-gray-200 rounded-lg text-[12px] font-medium text-[#6B7280] hover:bg-gray-50 transition-colors">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filtros
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Colaborador
                  </th>
                  <th className="text-left px-3 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[110px]">
                    Canciones
                  </th>
                  <th className="text-left px-3 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[90px]">
                    Split %
                  </th>
                  <th className="text-left px-3 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[120px]">
                    Pagado
                  </th>
                  <th className="text-left px-3 py-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider w-[110px]">
                    Estado
                  </th>
                  <th className="w-[60px]" />
                </tr>
              </thead>
              <tbody>
                {collaborators.map((collaborator) => {
                  const badge = statusBadge(collaborator.status);
                  const isActive = collaborator.id === featuredId;
                  return (
                    <tr
                      key={collaborator.id}
                      onClick={() => setFeaturedId(collaborator.id)}
                      className={`border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                        isActive ? "bg-orange-50/40" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: collaborator.avatarBg }}
                          >
                            <span
                              className="text-[12px] font-bold"
                              style={{ color: collaborator.avatarText }}
                            >
                              {collaborator.initials}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[13px] font-semibold text-[#111827] truncate">
                              {collaborator.name}
                            </span>
                            <span className="text-[11px] text-[#9CA3AF] truncate">
                              {collaborator.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-[13px] font-semibold text-[#111827]">
                        {collaborator.songs}
                      </td>
                      <td className="px-3 py-4 text-[13px] font-semibold text-[#F97316]">
                        {collaborator.splitPercentage}%
                      </td>
                      <td className="px-3 py-4 text-[13px] font-semibold text-green-500">
                        {formatCurrency(collaborator.paid)}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${badge.bg} ${badge.text} text-[11px] font-semibold rounded-full`}
                        >
                          <span
                            className={`w-1.5 h-1.5 ${badge.dot} rounded-full`}
                          />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <button className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Featured card */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            <div className="relative h-[140px] bg-[#0F172A] flex items-start justify-center pt-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 h-[22px] bg-[#1E293B] rounded-full">
                <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full" />
                <span className="text-[10px] font-bold text-[#F97316] tracking-wider">
                  COLABORADOR DESTACADO
                </span>
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 w-24 h-24 bg-white rounded-full p-1 shadow-sm">
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: featured.avatarBg }}
                >
                  <span
                    className="text-[28px] font-bold"
                    style={{ color: featured.avatarText }}
                  >
                    {featured.initials}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 pt-16 pb-6 flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-lg font-bold text-[#111827]">
                  {featured.name}
                </h3>
                <p className="text-xs text-[#6B7280]">{featured.email}</p>
              </div>

              {featured.role && (
                <span className="inline-flex items-center gap-1.5 px-2.5 h-6 bg-orange-50 rounded-full">
                  <Crown className="w-3 h-3 text-[#F97316]" />
                  <span className="text-[11px] font-semibold text-orange-900">
                    {featured.role}
                  </span>
                </span>
              )}

              <div className="grid grid-cols-3 w-full border-y border-gray-100">
                <div className="flex flex-col items-center gap-1 py-3">
                  <span className="text-xl font-bold text-[#111827]">
                    {featured.songs}
                  </span>
                  <span className="text-[10px] text-[#6B7280]">Canciones</span>
                </div>
                <div className="flex flex-col items-center gap-1 py-3 border-x border-gray-100">
                  <span className="text-xl font-bold text-[#F97316]">
                    {featured.splitPercentage}%
                  </span>
                  <span className="text-[10px] text-[#6B7280]">Split avg</span>
                </div>
                <div className="flex flex-col items-center gap-1 py-3">
                  <span className="text-xl font-bold text-green-500">
                    {formatCompactCurrency(featured.paid)}
                  </span>
                  <span className="text-[10px] text-[#6B7280]">Pagado</span>
                </div>
              </div>

              {featured.recentSongs && featured.recentSongs.length > 0 && (
                <div className="w-full flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold text-[#9CA3AF] tracking-wider">
                    CANCIONES RECIENTES
                  </span>
                  <div className="flex flex-col gap-2">
                    {featured.recentSongs.map((song) => (
                      <div
                        key={song.title}
                        className="flex items-center gap-3 px-3 h-12 bg-[#F9FAFB] rounded-lg"
                      >
                        <div className="w-7 h-7 bg-orange-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <Music className="w-3.5 h-3.5 text-[#F97316]" />
                        </div>
                        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                          <span className="text-xs font-semibold text-[#111827] truncate">
                            {song.title}
                          </span>
                          <span className="text-[10px] text-[#9CA3AF]">
                            {song.streams}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#F97316]">
                          {song.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full flex items-center gap-2">
                <button className="flex-1 h-10 bg-[#F97316] hover:bg-orange-600 text-white text-[13px] font-semibold rounded-lg transition-colors">
                  Ver perfil
                </button>
                <button className="flex-1 h-10 bg-white border border-gray-200 hover:bg-gray-50 text-[#111827] text-[13px] font-semibold rounded-lg transition-colors">
                  Pagar split
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent payments */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-[#111827]">
                Pagos Recientes
              </span>
              <span className="text-xs text-[#6B7280]">
                Últimos splits enviados a tus colaboradores
              </span>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:text-orange-600 transition-colors">
              Ver todos
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col">
            {recentPayments.map((payment) => {
              const badge = paymentStatusBadge(payment.status);
              return (
                <div
                  key={payment.id}
                  className="flex items-center gap-4 px-6 h-14 border-b border-gray-100 last:border-b-0"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: payment.avatarBg }}
                  >
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: payment.avatarText }}
                    >
                      {payment.initials}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <span className="text-[13px] font-semibold text-[#111827] truncate">
                      {payment.collaboratorName}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] truncate">
                      Pago por {payment.songTitle} · ISRC {payment.isrc}
                    </span>
                  </div>
                  <div className="hidden md:flex flex-col items-end gap-0.5 w-28">
                    <span className="text-[11px] text-[#6B7280]">
                      {payment.relativeDate}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">
                      {payment.date}
                    </span>
                  </div>
                  <span
                    className={`text-[13px] font-bold ${
                      payment.status === "processing"
                        ? "text-[#F97316]"
                        : "text-green-500"
                    }`}
                  >
                    +{formatCurrency(payment.amount)}
                  </span>
                  <span
                    className={`hidden sm:inline-flex items-center px-2.5 h-[22px] ${badge.bg} ${badge.text} text-[11px] font-semibold rounded-full`}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
