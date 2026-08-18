import { HandCoins, Wallet, CircleCheck, Send, Mail } from "lucide-react";
import { formatCurrency } from "@/utils/format.utils";
import type { Collaborator } from "@/types";

interface AttentionTrayProps {
  /** Con datos de cobro y saldo pendiente: se les puede pagar ya. */
  payable: Collaborator[];
  /** Con saldo pendiente pero sin datos de cobro: su dinero queda retenido. */
  blocked: Collaborator[];
  onPayAll: () => void;
  onRemind: () => void;
  /** Deja a la vista solo a las personas bloqueadas. */
  onShowBlocked?: () => void;
}

/**
 * La bandeja de trabajo de la página.
 *
 * Separa las dos únicas situaciones que piden algo de ti —alguien a quien puedes
 * pagar ya, y alguien cuyo dinero está retenido porque le faltan sus datos— y
 * pone la acción al lado. Cuando no hay ninguna, no desaparece: confirma que no
 * queda dinero por repartir, que es justo lo que se venía a comprobar.
 */
export function AttentionTray({
  payable,
  blocked,
  onPayAll,
  onRemind,
  onShowBlocked,
}: AttentionTrayProps) {
  const payableTotal = payable.reduce((sum, c) => sum + c.amountPending, 0);
  const blockedTotal = blocked.reduce((sum, c) => sum + c.amountPending, 0);
  const tasks = (payable.length > 0 ? 1 : 0) + (blocked.length > 0 ? 1 : 0);

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
        <>
          {payable.length > 0 && (
            <Task
              tone="orange"
              icon={<HandCoins className="h-[18px] w-[18px] text-[#FF5C00]" />}
              title={`${payable.length} ${
                payable.length === 1 ? "colaborador puede cobrar ya" : "colaboradores pueden cobrar ya"
              }`}
              detail="Tienen sus datos de cobro completos y saldo pendiente."
              amount={payableTotal}
              amountCaption="listo para enviar"
              action={
                <button
                  onClick={onPayAll}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-2xl bg-[#FF5C00] px-[15px] py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
                >
                  <Send className="h-3.5 w-3.5" />
                  {payable.length === 1 ? "Pagar" : `Pagar a ${payable.length}`}
                </button>
              }
            />
          )}

          {blocked.length > 0 && (
            <Task
              tone="grey"
              icon={<Wallet className="h-[18px] w-[18px] text-[#71757E]" />}
              title={`${blocked.length} ${
                blocked.length === 1
                  ? "colaborador sin datos de cobro"
                  : "colaboradores sin datos de cobro"
              }`}
              detail="Su saldo queda retenido hasta que completen su cuenta."
              amount={blockedTotal}
              amountCaption="retenido"
              onDetail={onShowBlocked}
              action={
                <button
                  onClick={onRemind}
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-2xl border border-[#E8E8EC] bg-white px-[15px] py-2.5 text-[12px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#71757E]" />
                  Enviar recordatorio
                </button>
              }
            />
          )}
        </>
      )}
    </section>
  );
}

interface TaskProps {
  tone: "orange" | "grey";
  icon: React.ReactNode;
  title: string;
  detail: string;
  amount: number;
  amountCaption: string;
  action: React.ReactNode;
  onDetail?: () => void;
}

function Task({
  tone,
  icon,
  title,
  detail,
  amount,
  amountCaption,
  action,
  onDetail,
}: TaskProps) {
  const warm = tone === "orange";
  return (
    <div
      className={`flex flex-wrap items-center gap-3.5 rounded-[18px] px-4 py-3.5 ${
        warm ? "bg-[#FFEADD]" : "bg-[#F4F5F7]"
      }`}
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[13px] bg-white">
        {icon}
      </span>

      <button
        onClick={onDetail}
        disabled={!onDetail}
        className="flex min-w-[180px] flex-1 flex-col gap-0.5 text-left disabled:cursor-default"
      >
        <span className={`text-[13px] font-semibold ${warm ? "text-[#EA580C]" : "text-[#1C1D22]"}`}>
          {title}
        </span>
        <span className={`text-[11.5px] ${warm ? "text-[#EA580C]" : "text-[#71757E]"}`}>
          {detail}
        </span>
      </button>

      <span className="flex flex-col items-end gap-0.5">
        <span
          className={`font-mono text-[15px] font-semibold ${warm ? "text-[#FF5C00]" : "text-[#71757E]"}`}
        >
          {formatCurrency(amount)}
        </span>
        <span className={`text-[10px] ${warm ? "text-[#EA580C]" : "text-[#A6AAB2]"}`}>
          {amountCaption}
        </span>
      </span>

      {action}
    </div>
  );
}
