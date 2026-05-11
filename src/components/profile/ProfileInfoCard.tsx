import { Hash, User, Mail, AtSign, Check, Copy } from "lucide-react";
import type { ProfileUserData } from "@/types/profile.types";

interface ProfileInfoCardProps {
  userData: ProfileUserData;
  copied: boolean;
  onCopyId: () => void;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
  action?: React.ReactNode;
  hasBorder?: boolean;
}

function InfoRow({ icon, label, value, accent, action, hasBorder = true }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 px-5" style={{ height: 60, borderBottom: hasBorder ? "1px solid #E5E7EB" : undefined }}>
      <div className="flex items-center justify-center flex-shrink-0"
        style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: accent ? "#FDBA74" : "#F3F4F6" }}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>{label}</span>
        <span className={`text-sm font-${accent ? "bold" : "medium"} truncate`}
          style={{ color: accent ? "#92400E" : "#111827" }}>
          {value}
        </span>
      </div>
      {action}
    </div>
  );
}

/**
 * Tarjeta de información de cuenta: ID, nombre, email y username.
 */
export function ProfileInfoCard({ userData, copied, onCopyId }: ProfileInfoCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <InfoRow
        icon={<Hash size={16} color="#FFFFFF" />}
        label="ID de Usuario"
        value={userData.userId}
        accent
        action={
          <button onClick={onCopyId}
            className="flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
            style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: "#F97316" }}>
            {copied ? <Check size={14} color="#FFFFFF" /> : <Copy size={14} color="#FFFFFF" />}
          </button>
        }
      />
      <InfoRow icon={<User size={16} color="#9CA3AF" />} label="Nombre completo" value={`${userData.name} ${userData.lastName}`} />
      <InfoRow icon={<Mail size={16} color="#9CA3AF" />} label="Correo electrónico" value={userData.email} />
      <InfoRow icon={<AtSign size={16} color="#9CA3AF" />} label="Nombre de usuario" value={`@${userData.username}`} hasBorder={false} />
    </div>
  );
}
