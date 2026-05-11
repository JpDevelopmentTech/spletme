import { ArrowRight } from "lucide-react";
import { formatCurrency, getPaymentStatusBadge } from "@/utils/collaborators.utils";
import type { CollaboratorPayment } from "@/types";

interface RecentPaymentsSectionProps {
  payments: CollaboratorPayment[];
}

/**
 * Sección de pagos recientes con lista de transacciones enviadas a colaboradores.
 */
export function RecentPaymentsSection({ payments }: RecentPaymentsSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-[#111827]">Pagos Recientes</span>
          <span className="text-xs text-[#6B7280]">Últimos splits enviados a tus colaboradores</span>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:text-orange-600 transition-colors">
          Ver todos
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col">
        {payments.map((payment) => {
          const badge = getPaymentStatusBadge(payment.status);
          return (
            <div
              key={payment.id}
              className="flex items-center gap-4 px-6 h-14 border-b border-gray-100 last:border-b-0"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: payment.avatarBg }}
              >
                <span className="text-[11px] font-bold" style={{ color: payment.avatarText }}>
                  {payment.initials}
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] font-semibold text-[#111827] truncate">{payment.collaboratorName}</span>
                <span className="text-[11px] text-[#9CA3AF] truncate">
                  Pago por {payment.songTitle} · ISRC {payment.isrc}
                </span>
              </div>
              <div className="hidden md:flex flex-col items-end gap-0.5 w-28">
                <span className="text-[11px] text-[#6B7280]">{payment.relativeDate}</span>
                <span className="text-[10px] text-[#9CA3AF]">{payment.date}</span>
              </div>
              <span className={`text-[13px] font-bold ${payment.status === "processing" ? "text-[#F97316]" : "text-green-500"}`}>
                +{formatCurrency(payment.amount)}
              </span>
              <span className={`hidden sm:inline-flex items-center px-2.5 h-[22px] ${badge.bg} ${badge.text} text-[11px] font-semibold rounded-full`}>
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
