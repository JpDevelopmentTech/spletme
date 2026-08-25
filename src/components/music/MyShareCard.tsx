import { HandCoins, Globe, Radio, Clock3, CircleCheck } from "lucide-react";
import { formatCurrency } from "@/utils/format.utils";

interface MyShareCardProps {
  /** El porcentaje del split propio, tal cual está firmado. */
  percentage: number;
  /** Lo devengado hasta hoy con ese split. */
  amount: number;
  /** Lo ya cobrado, si consta. */
  paid?: number;
  /** El alcance del split, cuando está limitado a países o plataformas. */
  scope?: { label: string; worldwide: boolean } | null;
  /** Estado de la solicitud de regalías, para no repetir el aviso de arriba. */
  requestPending?: boolean;
  onRequest?: () => void;
}

/**
 * Lo que cobra quien no es el dueño de la canción.
 *
 * Sustituye a la cascada del dinero, que es una vista de owner: cuenta el
 * ingreso de la canción y quién se lo lleva, incluido el propio owner. Aquí solo
 * está lo que le toca a quien mira —su porcentaje, su dinero, su alcance—, que
 * es cierto y es lo único que le concierne. Ver `utils/ownerVisibility.ts`.
 */
export function MyShareCard({
  percentage,
  amount,
  paid = 0,
  scope,
  requestPending = false,
  onRequest,
}: MyShareCardProps) {
  const pending = Math.max(0, amount - paid);

  return (
    <section className="col-span-12 flex min-w-0 flex-col gap-4 rounded-[26px] border border-[#E8E8EC] bg-white p-[26px] shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] xl:col-span-8">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-lg font-semibold text-[#1C1D22]">Tu parte</h2>
        <p className="text-[12.5px] text-[#71757E]">Lo que te corresponde de esta canción</p>
      </div>

      <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
        <span className="flex flex-col gap-1">
          <span className="font-mono text-[9.5px] font-medium tracking-[1.3px] text-[#71757E]">
            TU SPLIT
          </span>
          <span className="font-mono text-[30px] font-semibold leading-none text-[#1C1D22]">
            {percentage}%
          </span>
        </span>

        <span className="flex flex-col gap-1">
          <span className="font-mono text-[9.5px] font-medium tracking-[1.3px] text-[#71757E]">
            DEVENGADO
          </span>
          <span className="font-mono text-[30px] font-semibold leading-none text-[#2FB37E]">
            {formatCurrency(amount)}
          </span>
        </span>

        {paid > 0 && (
          <span className="flex flex-col gap-1">
            <span className="font-mono text-[9.5px] font-medium tracking-[1.3px] text-[#71757E]">
              YA COBRADO
            </span>
            <span className="font-mono text-[20px] font-semibold leading-none text-[#71757E]">
              {formatCurrency(paid)}
            </span>
          </span>
        )}
      </div>

      {scope && (
        <p className="flex items-center gap-2 rounded-[16px] bg-[#F4F5F7] px-3.5 py-3 text-[11.5px] text-[#71757E]">
          {scope.worldwide ? (
            <Globe className="h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
          ) : (
            <Radio className="h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
          )}
          {scope.worldwide
            ? "Tu split aplica en todos los países y plataformas"
            : `Tu split aplica en ${scope.label}`}
        </p>
      )}

      <div className="h-px bg-[#E8E8EC]" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2.5">
          {pending > 0 ? (
            <Clock3 className="h-3.5 w-3.5 text-[#EA580C]" />
          ) : (
            <CircleCheck className="h-3.5 w-3.5 text-[#2FB37E]" />
          )}
          <span
            className={`text-[12.5px] font-semibold ${pending > 0 ? "text-[#EA580C]" : "text-[#2FB37E]"}`}
          >
            {pending > 0 ? `${formatCurrency(pending)} por cobrar` : "Estás al día"}
          </span>
        </span>

        {pending > 0 && onRequest && !requestPending && (
          <button
            onClick={onRequest}
            className="flex items-center gap-2 rounded-[20px] bg-[#FF5C00] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            <HandCoins className="h-3.5 w-3.5" />
            Solicitar mis regalías
          </button>
        )}
      </div>
    </section>
  );
}
