import { Users, Send, Coins, GitBranch, Clock, type LucideIcon } from "lucide-react";

interface CollaboratorsStatsGridProps {
  totalCollaborators: number;
  totalSent: string;
  totalReceived: string;
  activeSplits: number;
  pendingPayments: number;
}

interface StatTile {
  icon: LucideIcon;
  label: string;
  value: string | number;
  valueColor: string;
  iconBg: string;
  iconColor: string;
  caption: string;
}

/**
 * Cuadrícula de 5 tarjetas de resumen estadístico para la página de colaboradores.
 */
export function CollaboratorsStatsGrid({
  totalCollaborators,
  totalSent,
  totalReceived,
  activeSplits,
  pendingPayments,
}: CollaboratorsStatsGridProps) {
  const tiles: StatTile[] = [
    {
      icon: Users,
      label: "Colaboradores",
      value: totalCollaborators,
      valueColor: "text-[#1C1D22]",
      iconBg: "bg-[#FFEADD]",
      iconColor: "text-[#FF5C00]",
      caption: "en total",
    },
    {
      icon: Send,
      label: "Pagos enviados",
      value: totalSent,
      valueColor: "text-[#1C1D22]",
      iconBg: "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
      iconColor: "text-[#71757E]",
      caption: "acumulado",
    },
    {
      icon: Coins,
      label: "Pagos recibidos",
      value: totalReceived,
      valueColor: "text-[#2FB37E]",
      iconBg: "bg-[#E4F5EC]",
      iconColor: "text-[#2FB37E]",
      caption: "acumulado",
    },
    {
      icon: GitBranch,
      label: "Splits activos",
      value: activeSplits,
      valueColor: "text-[#1C1D22]",
      iconBg: "bg-[#FFEADD]",
      iconColor: "text-[#FF5C00]",
      caption: "en tus canciones",
    },
    {
      icon: Clock,
      label: "Pendientes",
      value: pendingPayments,
      valueColor: "text-[#FF5C00]",
      iconBg: "bg-[#FFEADD]",
      iconColor: "text-[#FF5C00]",
      caption: "requieren atención",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {tiles.map(({ icon: Icon, label, value, valueColor, iconBg, iconColor, caption }) => (
        <div key={label} className="flex flex-col gap-3.5 rounded-[20px] bg-[#F4F5F7] p-5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-[16px] ${iconBg}`}>
            <Icon className={`h-[19px] w-[19px] ${iconColor}`} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[#A6AAB2]">{label}</span>
            <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
            <span className="text-[11px] text-[#A6AAB2]">{caption}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
