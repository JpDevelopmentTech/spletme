import { Loader, Check, TriangleAlert, Globe, RotateCcw } from "lucide-react";
import type { SelectOption } from "@/types/select.types";

/**
 * Piezas comunes de los dos modales de split por álbum —el del owner y el de un
 * colaborador—. Ambos hacen lo mismo con distinto sujeto: un porcentaje, dos
 * filtros de alcance y una pasada pista a pista con su resultado. Vivían dentro
 * del modal del owner; se sacan aquí para que el segundo modal no las copie y
 * los dos no se separen visualmente con el tiempo.
 */

type ScopeType = "all" | "except" | "only";

const SCOPE_LABELS: { value: ScopeType; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "except", label: "Excepto" },
  { value: "only", label: "Solo" },
];

/** Avance de la pasada pista a pista, con el detalle de lo que falló. */
interface ProgressShape {
  total: number;
  completed: number;
  failed: number;
  current: string;
  errors: Array<{ songTitle: string; error: string }>;
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
      {children}
    </span>
  );
}

interface ScopeProps {
  label: string;
  type: ScopeType;
  onTypeChange: (value: ScopeType) => void;
  options: SelectOption[];
  selected: SelectOption[];
  onSelectedChange: (value: SelectOption[]) => void;
  loading: boolean;
  allLabel: string;
  placeholder: string;
}

/** Alcance del split: todos, todos menos unos cuantos, o solo unos cuantos. */
export function Scope({
  label,
  type,
  onTypeChange,
  options,
  selected,
  onSelectedChange,
  loading,
  allLabel,
  placeholder,
}: ScopeProps) {
  const restricted = type !== "all";

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        <div className="flex items-center gap-0.5 rounded-2xl bg-[#F4F5F7] p-0.5">
          {SCOPE_LABELS.map((option) => {
            const active = type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onTypeChange(option.value)}
                aria-pressed={active}
                className={`rounded-[13px] px-3 py-1.5 text-[11.5px] transition-colors ${
                  active
                    ? "bg-white font-semibold text-[#1C1D22] shadow-[0_2px_5px_rgba(16,17,20,0.08)]"
                    : "font-medium text-[#71757E]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {restricted ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-[#E8E8EC] p-3">
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((option) => (
                <span
                  key={option.value}
                  className="flex items-center gap-1.5 rounded-xl bg-[#F4F5F7] px-2.5 py-1"
                >
                  <span className="text-[11px] font-medium text-[#1C1D22]">{option.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectedChange(selected.filter((item) => item.value !== option.value))
                    }
                    aria-label={`Quitar ${option.label}`}
                    className="text-[#A6AAB2] transition-colors hover:text-[#1C1D22]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <select
            value=""
            disabled={loading}
            onChange={(e) => {
              const option = options.find((item) => item.value === e.target.value);
              if (option && !selected.some((item) => item.value === option.value)) {
                onSelectedChange([...selected, option]);
              }
            }}
            className="w-full rounded-xl bg-transparent text-[12px] text-[#71757E] focus:outline-none"
          >
            <option value="">{loading ? "Cargando opciones…" : placeholder}</option>
            {options
              .filter((option) => !selected.some((item) => item.value === option.value))
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        </div>
      ) : (
        <p className="flex items-center gap-2.5 rounded-[14px] bg-[#F4F5F7] px-3.5 py-2.5 text-[11.5px] text-[#71757E]">
          <Globe className="h-3.5 w-3.5 flex-shrink-0" />
          {allLabel}
        </p>
      )}
    </div>
  );
}

export function Progress({
  progress,
  percentage,
}: {
  progress: ProgressShape;
  percentage: number;
}) {
  const done = progress.completed + progress.failed;
  const percent = progress.total > 0 ? (done / progress.total) * 100 : 0;

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[12.5px] font-semibold text-[#1C1D22]">Creando splits</span>
          <span className="font-mono text-[12px] font-semibold text-[#FF5C00]">
            {done} de {progress.total}
          </span>
        </div>
        <span className="block h-2 w-full overflow-hidden rounded-full bg-[#F4F5F7]">
          <span
            className="block h-full rounded-full bg-[#FF5C00] transition-all duration-300"
            style={{ width: `${Math.max(2, percent)}%` }}
          />
        </span>
        {progress.current && (
          <span className="flex items-center gap-2 text-[11.5px] text-[#71757E]">
            <Loader className="h-3.5 w-3.5 animate-spin text-[#FF5C00]" />
            Aplicando el {percentage}% a «{progress.current}»…
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Tile label="CREADOS" value={progress.completed} color="#2FB37E" background="#E4F5EC" />
        <Tile label="CON ERROR" value={progress.failed} color="#E5484D" background="#FDECEC" />
      </div>
    </>
  );
}

export function Results({ progress }: { progress: ProgressShape }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <Tile label="CREADOS" value={progress.completed} color="#2FB37E" background="#E4F5EC" />
        <Tile label="CON ERROR" value={progress.failed} color="#E5484D" background="#FDECEC" />
      </div>

      {progress.failed === 0 ? (
        <div className="flex flex-col items-center gap-2.5 rounded-[18px] bg-[#E4F5EC] p-5">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#2FB37E]">
            <Check className="h-6 w-6 text-white" />
          </span>
          <span className="text-[13px] font-semibold text-[#1F7D58]">
            Todas las pistas reparten ya
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 rounded-[18px] border border-[#E8E8EC] p-4">
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[#1C1D22]">
            <TriangleAlert className="h-3.5 w-3.5 flex-shrink-0 text-[#E5484D]" />
            {progress.failed}{" "}
            {progress.failed === 1
              ? "pista no se pudo actualizar"
              : "pistas no se pudieron actualizar"}
          </span>
          <ul className="flex max-h-[220px] flex-col gap-1.5 overflow-y-auto">
            {progress.errors.map((item, index) => (
              <li
                key={`${item.songTitle}-${index}`}
                className="flex flex-col gap-1 rounded-[13px] bg-[#FDECEC] px-3 py-2.5"
              >
                <span className="text-[12px] font-semibold text-[#E5484D]">{item.songTitle}</span>
                <span className="text-[11px] leading-relaxed text-[#E5484D]">{item.error}</span>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 text-[11px] text-[#71757E]">
            <RotateCcw className="h-3 w-3 flex-shrink-0" />
            Reintentar vuelve a aplicar el porcentaje a todas las pistas del álbum.
          </p>
        </div>
      )}
    </>
  );
}

export function Tile({
  label,
  value,
  color,
  background,
}: {
  label: string;
  value: number;
  color: string;
  background: string;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-[16px] px-3.5 py-3"
      style={{ backgroundColor: background }}
    >
      <span className="font-mono text-[9.5px] font-medium tracking-[1px]" style={{ color }}>
        {label}
      </span>
      <span className="font-mono text-[22px] font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
