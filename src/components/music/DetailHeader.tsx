import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";

interface DetailHeaderProps {
  /** Portada; si no hay, se dibuja el icono de reserva. */
  cover?: string | null;
  fallbackIcon: React.ReactNode;
  title: string;
  /** Etiqueta del código: ISRC en canciones, UPC en álbumes. */
  codeLabel?: string;
  code?: string | null;
  /** Línea de contexto: artista, álbum, fecha… */
  meta?: React.ReactNode;
  /** Cifra destacada a la derecha, con su rótulo. */
  highlightLabel?: string;
  highlightValue?: string;
  highlightColor?: string;
  actions?: React.ReactNode;
  backTo?: string;
}

/**
 * Cabecera de identidad, común a canción y álbum.
 *
 * Las dos páginas describen el mismo tipo de objeto —una obra con dinero
 * repartido—, así que comparten anatomía: quién es, cómo se identifica y qué
 * puedes hacer con ella.
 */
export function DetailHeader({
  cover,
  fallbackIcon,
  title,
  codeLabel,
  code,
  meta,
  highlightLabel,
  highlightValue,
  highlightColor = "#1C1D22",
  actions,
  backTo = "/panel/music",
}: DetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <button
          onClick={() => navigate(backTo)}
          aria-label="Volver"
          className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full border border-[#E8E8EC] bg-white text-[#71757E] transition-colors hover:text-[#1C1D22]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <span className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#F4F5F7] sm:h-[88px] sm:w-[88px] sm:rounded-[22px]">
          {cover ? (
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            fallbackIcon
          )}
        </span>

        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            {/* Sin recortes manuales: el título se trunca por CSS y queda entero en el title */}
            <h1
              title={title}
              className="min-w-0 truncate font-display text-[22px] font-semibold text-[#1C1D22] sm:text-[26px]"
            >
              {title}
            </h1>
            {code && (
              <span className="flex flex-shrink-0 items-center gap-1.5 rounded-[14px] bg-[#F4F5F7] px-2.5 py-[5px]">
                {codeLabel && (
                  <span className="font-mono text-[9.5px] font-medium tracking-[1px] text-[#A6AAB2]">
                    {codeLabel}
                  </span>
                )}
                <span className="font-mono text-[11px] font-semibold text-[#1C1D22]">{code}</span>
                <CopyButton value={code} title={`Copiar ${codeLabel ?? "código"}`} />
              </span>
            )}
          </div>
          {meta && (
            <div className="flex min-w-0 flex-wrap items-center gap-2 text-[13px] text-[#71757E]">
              {meta}
            </div>
          )}
        </div>
      </div>

      {(highlightValue || actions) && (
        <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
          {highlightValue && (
            <div className="flex flex-col items-end">
              {highlightLabel && (
                <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
                  {highlightLabel}
                </span>
              )}
              <span
                className="font-mono text-[22px] font-semibold"
                style={{ color: highlightColor }}
              >
                {highlightValue}
              </span>
            </div>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}
