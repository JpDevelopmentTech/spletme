import type { LucideIcon } from "lucide-react";
import { CheckCircle2, XCircle } from "lucide-react";

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
    <div className="flex items-center justify-between rounded-[22px] bg-white px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <Icon className="h-[18px] w-[18px] text-[#71757E]" />
        <span className="text-[13px] font-medium text-[#1C1D22]">{label}</span>
      </div>
      {active ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F5EC] px-2.5 py-1 text-[11px] font-semibold text-[#2FB37E]">
          <CheckCircle2 className="h-3 w-3" />
          Activa
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEC] px-2.5 py-1 text-[11px] font-semibold text-[#E5484D]">
          <XCircle className="h-3 w-3" />
          Inactiva
        </span>
      )}
    </div>
  );
}
