import { ArrowRight } from "lucide-react";
import {
  formatCurrency,
  getPaymentStatusBadge,
} from "@/utils/collaborators.utils";
import type { CollaboratorPayment } from "@/types";

interface RecentPaymentsSectionProps {
  payments: CollaboratorPayment[];
}

/**
 * Sección de pagos recientes con lista de transacciones enviadas a colaboradores.
 */
export function RecentPaymentsSection({
  payments,
}: RecentPaymentsSectionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-[#111827]">
            Pagos Recientes
          </span>
          <span className="text-xs text-[#6B7280]">
            Últimos splits enviados a tus colaboradores
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-[#F97316] transition-colors hover:text-orange-600">
          Ver todos
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col">
        {payments.map((payment) => {
          const badge = getPaymentStatusBadge(payment.status);
          return (
            <div
              key={payment.id}
              className="flex h-14 items-center gap-4 border-b border-gray-100 px-6 last:border-b-0"
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: payment.avatarBg }}
              >
                <span
                  className="text-[11px] font-bold"
                  style={{ color: payment.avatarText }}
                >
                  {payment.initials}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-[13px] font-semibold text-[#111827]">
                  {payment.collaboratorName}
                </span>
                <span className="truncate text-[11px] text-[#9CA3AF]">
                  Pago por {payment.songTitle} · ISRC {payment.isrc}
                </span>
              </div>
              <div className="hidden w-28 flex-col items-end gap-0.5 md:flex">
                <span className="text-[11px] text-[#6B7280]">
                  {payment.relativeDate}
                </span>
                <span className="text-[10px] text-[#9CA3AF]">
                  {payment.date}
                </span>
              </div>
              <span
                className={`text-[13px] font-bold ${payment.status === "processing" ? "text-[#F97316]" : "text-green-500"}`}
              >
                +{formatCurrency(payment.amount)}
              </span>
              <span
                className={`hidden h-[22px] items-center px-2.5 sm:inline-flex ${badge.bg} ${badge.text} rounded-full text-[11px] font-semibold`}
              >
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
