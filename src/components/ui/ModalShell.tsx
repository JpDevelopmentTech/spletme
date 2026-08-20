import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface ModalShellProps {
  title: string;
  subtitle?: React.ReactNode;
  /** Marca de identidad del distribuidor a la izquierda del título. */
  logo?: React.ReactNode;
  /** Ancho máximo del panel. `xl` es para los modales de dos columnas. */
  width?: "md" | "lg" | "xl";
  /** Impide cerrar mientras hay una operación en curso. */
  locked?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Envoltorio común de los modales de distribuidores: fondo, panel, cabecera y
 * pie. El cuerpo es lo único que hace scroll, de modo que el título y las
 * acciones siguen a la vista en pantallas bajas.
 */
export function ModalShell({
  title,
  subtitle,
  logo,
  width = "md",
  locked = false,
  onClose,
  children,
  footer,
}: ModalShellProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !locked) onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Sin esto, la página de detrás sigue desplazándose bajo el modal.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [locked, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#101114]/65 backdrop-blur-sm"
        onClick={() => !locked && onClose()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-16px_rgba(16,17,20,0.35)] focus:outline-none ${
          width === "xl" ? "max-w-[880px]" : width === "lg" ? "max-w-[560px]" : "max-w-[520px]"
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between gap-4 px-6 pb-[18px] pt-[22px]">
          <div className="flex min-w-0 items-center gap-3">
            {logo}
            <div className="flex min-w-0 flex-col gap-0.5">
              <h2 id={titleId} className="font-display text-[19px] font-semibold text-[#1C1D22]">
                {title}
              </h2>
              {subtitle && <p className="text-[12px] text-[#71757E]">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={locked}
            aria-label="Cerrar"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F4F5F7] text-[#71757E] transition-colors enabled:hover:bg-[#E8E8EC] enabled:hover:text-[#1C1D22] disabled:opacity-40"
          >
            <X className="h-[15px] w-[15px]" />
          </button>
        </div>

        <div className="h-px flex-shrink-0 bg-[#E8E8EC]" />

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <>
            <div className="h-px flex-shrink-0 bg-[#E8E8EC]" />
            <div className="flex flex-shrink-0 flex-wrap items-center gap-3 px-6 pb-5 pt-4">
              {footer}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Etiqueta de campo, en la tipografía de datos del sistema. */
export function FieldLabel({
  children,
  required = false,
  invalid = false,
}: {
  children: React.ReactNode;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <span
      className={`font-mono text-[9.5px] font-medium tracking-[1.2px] ${
        invalid ? "text-[#E5484D]" : "text-[#71757E]"
      }`}
    >
      {children}
      {required && <span className={invalid ? "" : "text-[#FF5C00]"}> *</span>}
    </span>
  );
}

/** Botón primario del pie de los modales. */
export function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
  icon,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  icon?: React.ReactNode;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-[22px] bg-[#FF5C00] px-[18px] py-2.5 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors enabled:hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:bg-[#F4F5F7] disabled:text-[#A6AAB2] disabled:shadow-none"
    >
      {icon}
      {children}
    </button>
  );
}

/** Botón secundario del pie de los modales. */
export function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-[22px] border border-[#E8E8EC] bg-white px-[18px] py-2.5 text-[12.5px] font-semibold text-[#71757E] transition-colors enabled:hover:bg-[#F4F5F7] enabled:hover:text-[#1C1D22] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

/** Botón de acción destructiva: borrar algo que no se puede recuperar. */
export function DangerButton({
  children,
  onClick,
  disabled,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-[22px] bg-[#E5484D] px-[18px] py-2.5 text-[12.5px] font-semibold text-white transition-colors enabled:hover:bg-[#CF3F44] disabled:cursor-not-allowed disabled:bg-[#F4F5F7] disabled:text-[#A6AAB2]"
    >
      {icon}
      {children}
    </button>
  );
}

/** Marca redonda de la cabecera de un modal: un icono sobre fondo suave. */
export function ModalMark({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "danger" | "success";
}) {
  const tones = {
    neutral: "bg-[#F4F5F7] text-[#A6AAB2]",
    accent: "bg-[#FFEADD] text-[#FF5C00]",
    danger: "bg-[#FDECEC] text-[#E5484D]",
    success: "bg-[#E4F5EC] text-[#2FB37E]",
  };
  return (
    <span
      className={`grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[14px] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Nota discreta que ocupa el hueco libre del pie, a la izquierda de los botones. */
export function FooterNote({ children }: { children: React.ReactNode }) {
  return <p className="flex-1 text-[11px] leading-[1.35] text-[#A6AAB2]">{children}</p>;
}

/** Marca cuadrada con el logo del distribuidor, o su inicial si no lo tiene. */
export function DistributorMark({
  name,
  logo,
  size = 40,
  color = "#FF5C00",
}: {
  name: string;
  logo?: string | null;
  size?: number;
  color?: string;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        backgroundColor: logo ? "#FFFFFF" : color,
        borderRadius: size / 2.9,
      }}
      className="flex flex-shrink-0 items-center justify-center overflow-hidden"
    >
      {logo ? (
        <img src={logo} alt="" className="h-full w-full object-contain" />
      ) : (
        <span
          className="font-display font-semibold text-white"
          style={{ fontSize: size * 0.42 }}
        >
          {name.slice(0, 1).toUpperCase() || "?"}
        </span>
      )}
    </span>
  );
}
