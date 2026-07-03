import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { CollaboratorPayment } from "@/types";

const TINTS = ["#FF5C00", "#2FB37E", "#A6AAB2", "#101114"];

interface RecentPaymentsSectionProps {
  payments: CollaboratorPayment[];
}

/**
 * Sección de pagos recientes con lista de transacciones enviadas a colaboradores.
 */
export function RecentPaymentsSection({ payments }: RecentPaymentsSectionProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-[28px] bg-[#F4F5F7] p-[26px]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1C1D22]">Pagos recientes</h3>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]">
          Ver todos
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {payments.map((payment, i) => (
        <div
          key={payment.id}
          className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: TINTS[i % TINTS.length] }}
          >
            <span className="text-[11px] font-bold text-white">{payment.initials}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[13px] font-semibold text-[#1C1D22]">
              {payment.collaboratorName}
            </span>
            <span className="truncate text-[11.5px] text-[#A6AAB2]">
              {`${payment.songTitle} · ${payment.relativeDate}`}
            </span>
          </div>
          <span className="text-sm font-bold text-[#1C1D22]">
            {`$${payment.amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </span>
          {payment.status === "completed" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F5EC] px-2.5 py-1 text-[11px] font-semibold text-[#2FB37E]">
              <CheckCircle2 className="h-3 w-3" />
              Completado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEADD] px-2.5 py-1 text-[11px] font-semibold text-[#FF5C00]">
              <Clock className="h-3 w-3" />
              Procesando
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
