import { ArrowUpRight, Loader, Hourglass, TriangleAlert, Users, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/format.utils";

interface PaymentsKpisProps {
  paid: number;
  paidCount: number;
  processing: number;
  processingCount: number;
  pending: number;
  pendingCount: number;
  failed: number;
  recipients: number;
  /** Filtra el historial a los pagos fallidos. */
  onShowFailed?: () => void;
}

/**
 * Consola de métricas del banco.
 *
 * La página se llamaba Banco y no decía cuánto habías pagado, cuánto iba en
 * camino ni cuánto quedaba pendiente: el historial estaba, los totales no.
 *
 * Los fallidos van en rojo y en unidades, no en dinero: no son un importe que
 * esté en algún sitio, son la única fila que exige actuar hoy.
 */
export function PaymentsKpis({
  paid,
  paidCount,
  processing,
  processingCount,
  pending,
  pendingCount,
  failed,
  recipients,
  onShowFailed,
}: PaymentsKpisProps) {
  return (
    <div className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:flex-row lg:divide-x lg:divide-y-0">
      <Channel
        label="PAGADO"
        labelClassName="text-[#FF5C00]"
        icon={<ArrowUpRight className="h-[13px] w-[13px] text-[#FF5C00]" />}
        value={formatCurrency(paid)}
        className="bg-[#FFEADD] lg:w-[290px] lg:flex-shrink-0"
      >
        <span className="text-[10.5px] text-[#EA580C]">
          {paidCount} {paidCount === 1 ? "pago completado" : "pagos completados"}
        </span>
      </Channel>

      <Channel
        label="EN PROCESO"
        icon={<Loader className="h-[13px] w-[13px] text-[#71757E]" />}
        value={formatCurrency(processing)}
      >
        <span className="text-[10.5px] text-[#A6AAB2]">
          {processingCount === 0 ? "nada en camino" : `${processingCount} en camino`}
        </span>
      </Channel>

      <Channel
        label="PENDIENTE"
        icon={<Hourglass className="h-[13px] w-[13px] text-[#71757E]" />}
        value={formatCurrency(pending)}
      >
        <span className="text-[10.5px] text-[#A6AAB2]">
          {pendingCount === 0 ? "nada sin enviar" : `${pendingCount} sin enviar`}
        </span>
      </Channel>

      <Channel
        label="FALLIDOS"
        labelClassName={failed > 0 ? "text-[#E5484D]" : "text-[#71757E]"}
        icon={
          <TriangleAlert
            className={`h-[13px] w-[13px] ${failed > 0 ? "text-[#E5484D]" : "text-[#71757E]"}`}
          />
        }
        value={failed > 0 ? String(failed) : "0"}
        valueClassName={`text-[26px] ${failed > 0 ? "text-[#E5484D]" : "text-[#1C1D22]"}`}
      >
        {failed > 0 ? (
          <button
            onClick={onShowFailed}
            disabled={!onShowFailed}
            className="flex items-center gap-1.5 text-left text-[11px] font-semibold text-[#E5484D] transition-colors enabled:hover:text-[#C93B3F] disabled:cursor-default"
          >
            Revisar y reintentar
            {onShowFailed && <ArrowRight className="h-3 w-3 flex-shrink-0" />}
          </button>
        ) : (
          <span className="text-[10.5px] text-[#A6AAB2]">ningún pago rechazado</span>
        )}
      </Channel>

      <Channel
        label="DESTINATARIOS"
        icon={<Users className="h-[13px] w-[13px] text-[#71757E]" />}
        value={String(recipients)}
      >
        <span className="text-[10.5px] text-[#A6AAB2]">
          {recipients === 1 ? "colaborador pagado" : "colaboradores pagados"}
        </span>
      </Channel>
    </div>
  );
}

interface ChannelProps {
  label: string;
  labelClassName?: string;
  icon: React.ReactNode;
  value: string;
  valueClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

/** Canal de la consola: etiqueta, cifra y una lectura de apoyo. */
function Channel({
  label,
  labelClassName = "text-[#71757E]",
  icon,
  value,
  valueClassName = "text-[#1C1D22] text-[24px]",
  className = "",
  children,
}: ChannelProps) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col justify-center gap-2 px-6 py-[22px] ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={`font-mono text-[9.5px] font-medium tracking-[1.3px] ${labelClassName}`}>
          {label}
        </span>
      </div>
      <p className={`font-mono font-semibold leading-none tracking-tight ${valueClassName}`}>
        {value}
      </p>
      {children}
    </div>
  );
}
