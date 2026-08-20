import { HandCoins, CircleCheck, Send } from "lucide-react";
import { formatCurrency } from "@/utils/format.utils";
import type { Collaborator } from "@/types";

interface AttentionTrayProps {
  /** Con datos de cobro y saldo pendiente: se les puede pagar ya. */
  payable: Collaborator[];
  onPayAll: () => void;
}

/**
 * La bandeja de trabajo de la página.
 *
 * Recoge la única situación que pide algo de ti —alguien a quien puedes pagar
 * ya— y pone la acción al lado. Cuando no hay nadie, no desaparece: confirma que
 * no queda dinero por repartir, que es justo lo que se venía a comprobar.
 */
export function AttentionTray({ payable, onPayAll }: AttentionTrayProps) {
  const payableTotal = payable.reduce((sum, c) => sum + c.amountPending, 0);
  const tasks = payable.length > 0 ? 1 : 0;

  return (
    <section className="flex flex-col gap-3.5 rounded-[26px] border border-[#E8E8EC] bg-white p-6 shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="font-display text-[15px] font-semibold text-[#1C1D22]">
          Requiere tu atención
        </h2>
        <span
          className={`rounded-[10px] px-2 py-0.5 font-mono text-[10px] font-semibold text-white ${
            tasks > 0 ? "bg-[#FF5C00]" : "bg-[#2FB37E]"
          }`}
        >
          {tasks}
        </span>
        <span className="ml-auto text-[11px] text-[#A6AAB2]">
          Se actualiza con cada reporte que cargas
        </span>
      </div>

      {tasks === 0 ? (
        <div className="flex flex-wrap items-center gap-3.5 rounded-[18px] bg-[#E4F5EC] px-[18px] py-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white">
            <CircleCheck className="h-[19px] w-[19px] text-[#2FB37E]" />
          </span>
          <span className="flex min-w-[180px] flex-1 flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-[#1F7D58]">
              No le debes nada a nadie
            </span>
            <span className="text-[11.5px] text-[#2FB37E]">
              Volverá a aparecer trabajo aquí en cuanto cargues un reporte nuevo.
            </span>
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3.5 rounded-[18px] bg-[#FFEADD] px-4 py-3.5">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[13px] bg-white">
            <HandCoins className="h-[18px] w-[18px] text-[#FF5C00]" />
          </span>

          <span className="flex min-w-[180px] flex-1 flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-[#EA580C]">
              {payable.length}{" "}
              {payable.length === 1
                ? "colaborador puede cobrar ya"
                : "colaboradores pueden cobrar ya"}
            </span>
            <span className="text-[11.5px] text-[#EA580C]">
              Tienen sus datos de cobro completos y saldo pendiente.
            </span>
          </span>

          <span className="flex flex-col items-end gap-0.5">
            <span className="font-mono text-[15px] font-semibold text-[#FF5C00]">
              {formatCurrency(payableTotal)}
            </span>
            <span className="text-[10px] text-[#EA580C]">listo para enviar</span>
          </span>

          <button
            onClick={onPayAll}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-2xl bg-[#FF5C00] px-[15px] py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            <Send className="h-3.5 w-3.5" />
            {payable.length === 1 ? "Pagar" : `Pagar a ${payable.length}`}
          </button>
        </div>
      )}
    </section>
  );
}
