import { formatCurrency } from "@/utils/format.utils";
import {
  assignedPercentage,
  collaboratorPool,
  effectivePercentage,
  ownerPercentage,
  unassignedPercentage,
  type Share,
  type WaterfallStep,
} from "@/utils/money.utils";

interface MoneyWaterfallProps {
  steps: WaterfallStep[];
  shares: Share[];
  /** Cifra sobre la que se calcula el reparto. */
  distributable: number;
  title?: string;
  subtitle?: string;
  /** Aviso propio del contexto: en álbumes, las pistas que aún no reparten. */
  notice?: React.ReactNode;
  /** Nota al pie del reparto. En álbumes explica que el % es un promedio. */
  footnote?: string;
  onEditSplits?: () => void;
}

const TONE_COLOR: Record<WaterfallStep["tone"], string> = {
  neutral: "#1C1D22",
  positive: "#2FB37E",
  negative: "#E5484D",
};

/**
 * A dónde va el dinero, en una sola lectura vertical.
 *
 * Cada escalón dice de dónde sale lo que se resta, no solo cuánto; y al final,
 * quién cobra de lo que queda. Es la cuenta completa que antes había que
 * reconstruir saltando entre pestañas.
 */
export function MoneyWaterfall({
  steps,
  shares,
  distributable,
  title = "A dónde va el dinero",
  subtitle,
  notice,
  footnote,
  onEditSplits,
}: MoneyWaterfallProps) {
  // El owner cobra su parte antes del reparto: el 100% que se mide aquí es el
  // del pool que queda después de él, no el de lo repartible entero.
  const ownerPct = ownerPercentage(shares);
  const unassigned = unassignedPercentage(shares);
  const assigned = assignedPercentage(shares);
  const pool = collaboratorPool(distributable, ownerPct);

  return (
    <section className="col-span-12 flex min-w-0 flex-col gap-4 rounded-[26px] border border-[#E8E8EC] bg-white p-[26px] shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] xl:col-span-8">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-lg font-semibold text-[#1C1D22]">{title}</h2>
        {subtitle && <p className="text-[12.5px] text-[#71757E]">{subtitle}</p>}
      </div>

      {/* Escalones */}
      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const last = index === steps.length - 1;
          const isTotal = step.kind === "total";
          return (
            <li key={`${step.label}-${index}`} className="flex items-start gap-3.5">
              {/* Raíl con el nodo y la línea que conecta */}
              <span className="flex w-[22px] flex-shrink-0 flex-col items-center" aria-hidden="true">
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                    isTotal ? "" : "bg-transparent"
                  }`}
                  style={isTotal ? { backgroundColor: TONE_COLOR[step.tone] } : undefined}
                >
                  <span
                    className={`rounded-full ${
                      isTotal ? "h-[5px] w-[5px] bg-white" : "h-[7px] w-[7px] bg-[#E8E8EC]"
                    }`}
                  />
                </span>
                {!last && <span className={`w-0.5 flex-1 bg-[#E8E8EC] ${isTotal ? "min-h-[30px]" : "min-h-[26px]"}`} />}
              </span>

              <span
                className={`flex flex-1 items-start justify-between gap-3.5 ${
                  last ? "" : isTotal ? "pb-4" : "pb-3.5"
                }`}
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  {isTotal ? (
                    <span className="font-mono text-[9.5px] font-medium tracking-[1.3px] text-[#71757E]">
                      {step.label}
                    </span>
                  ) : (
                    <span className="text-[12.5px] text-[#71757E]">{step.label}</span>
                  )}
                  {step.detail && (
                    <span className="text-[11px] text-[#A6AAB2]">{step.detail}</span>
                  )}
                </span>

                <span
                  className={`flex-shrink-0 font-mono font-semibold ${isTotal ? "text-[20px]" : "text-[13px]"}`}
                  style={{ color: step.amount < 0 ? TONE_COLOR[step.tone] : TONE_COLOR[step.tone] }}
                >
                  {step.amount < 0 ? `−${formatCurrency(Math.abs(step.amount))}` : formatCurrency(step.amount)}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="h-px bg-[#E8E8EC]" />

      {/* Reparto */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12.5px] font-semibold text-[#1C1D22]">
            {shares.length === 0
              ? "Todavía no se reparte"
              : `Se reparte entre ${shares.length}`}
          </span>
          {onEditSplits && (
            <button
              onClick={onEditSplits}
              className="text-[11.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
            >
              Editar splits
            </button>
          )}
        </div>

        {shares.length > 0 && (
          <>
            {/* Anchos en base común (% de lo repartible): el del colaborador se
                encoge por lo que ya se llevó el owner, para que la barra sume 100. */}
            <span className="flex h-4 w-full gap-[2px] overflow-hidden rounded-lg">
              {shares.map((share) => (
                <span
                  key={share.id}
                  title={
                    share.isOwner
                      ? `${share.name}: ${share.percentage}% de lo repartible`
                      : `${share.name}: ${share.percentage}% de lo que queda tras el owner`
                  }
                  className="h-full min-w-[3px]"
                  style={{
                    width: `${effectivePercentage(share, ownerPct)}%`,
                    backgroundColor: share.color,
                  }}
                />
              ))}
              {unassigned > 0 && (
                <span
                  title={`Sin repartir: ${unassigned.toFixed(0)}% del pool`}
                  className="h-full bg-[#E8E8EC]"
                  style={{ width: `${(unassigned * (100 - ownerPct)) / 100}%` }}
                />
              )}
            </span>

            <ul className="flex flex-col gap-2.5">
              {shares.map((share) => (
                <li key={share.id} className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: share.color }}
                  >
                    <span className="text-[9.5px] font-semibold text-white">
                      {initials(share.name, share.isOwner)}
                    </span>
                  </span>

                  <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <span className="truncate text-[12.5px] font-medium text-[#1C1D22]">
                      {share.name}
                    </span>
                    {share.role && (
                      <span className="rounded-[11px] bg-[#F4F5F7] px-[7px] py-[3px] text-[10px] text-[#71757E]">
                        {share.role}
                      </span>
                    )}
                    {(share.pending ?? 0) > 0 && (
                      <span className="rounded-[11px] bg-[#FFEADD] px-[7px] py-[3px] text-[10px] font-semibold text-[#FF5C00]">
                        Por pagar
                      </span>
                    )}
                  </span>

                  <span className="flex flex-shrink-0 flex-col items-end">
                    <span className="font-mono text-[11.5px] font-semibold text-[#71757E]">
                      {share.percentage}%
                    </span>
                    {!share.isOwner && ownerPct > 0 && (
                      <span className="font-mono text-[9.5px] text-[#A6AAB2]">
                        de lo que queda
                      </span>
                    )}
                  </span>
                  <span className="w-[96px] flex-shrink-0 text-right font-mono text-[13px] font-semibold text-[#1C1D22]">
                    {formatCurrency(share.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {notice}

        {ownerPct > 0 && (
          <p className="text-[11px] leading-relaxed text-[#A6AAB2]">
            Tu {ownerPct}% de owner sale primero de {formatCurrency(distributable)} repartibles. Los
            colaboradores se reparten los {formatCurrency(pool)} restantes, y ese es el 100% que se
            mide aquí.
          </p>
        )}

        {unassigned > 0 && shares.length > 0 && (
          <p className="text-[11px] leading-relaxed text-[#A6AAB2]">
            Queda un {unassigned.toFixed(unassigned % 1 === 0 ? 0 : 1)}% sin repartir de{" "}
            {formatCurrency(ownerPct > 0 ? pool : distributable)}: ese resto se queda contigo.
          </p>
        )}

        {assigned > 100 && (
          <p className="rounded-[14px] bg-[#FDECEC] px-3.5 py-3 text-[11.5px] font-medium text-[#E5484D]">
            Los colaboradores suman {assigned.toFixed(1)}% de lo que queda tras tu parte de owner,
            más del 100%. Hay que corregirlo antes de poder pagar.
          </p>
        )}

        {footnote && <p className="text-[11px] leading-relaxed text-[#A6AAB2]">{footnote}</p>}
      </div>
    </section>
  );
}

function initials(name: string, isOwner?: boolean): string {
  if (isOwner) return "TÚ";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
