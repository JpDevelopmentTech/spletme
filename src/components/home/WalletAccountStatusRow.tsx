import type { LucideIcon } from "lucide-react";
import { CircleCheck, CircleX } from "lucide-react";

interface WalletAccountStatusRowProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
}

/**
 * Fila de la billetera del dashboard que muestra una cuenta y si está activa o no.
 */
export function WalletAccountStatusRow({ icon: Icon, label, active }: WalletAccountStatusRowProps) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-[#F4F5F7] px-3.5 py-3">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-[#71757E]" />
        <span className="text-[13px] font-medium text-[#1C1D22]">{label}</span>
      </div>
      {active ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F5EC] px-2.5 py-1 text-[10.5px] font-semibold text-[#2FB37E]">
          <CircleCheck className="h-3 w-3" />
          Activa
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEC] px-2.5 py-1 text-[10.5px] font-semibold text-[#E5484D]">
          <CircleX className="h-3 w-3" />
          Inactiva
        </span>
      )}
    </div>
  );
}
