import { useMemo, useState } from "react";
import { Search, Check } from "lucide-react";
import { formatCurrency, formatStreams } from "@/utils/format.utils";
import { FieldLabel } from "@/components/ui/ModalShell";
import type { Label } from "@/services/labels";

interface ArtisticLabelPickerProps {
  availableLabels: Label[];
  selected: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

/**
 * Selector de los sellos artísticos que agrupa un sello personalizado.
 *
 * Lo comparten crear y editar: son el mismo formulario, y tenerlo dos veces
 * garantizaba que uno se quedase atrás al tocar el otro.
 *
 * Cada opción muestra sus canciones e ingresos porque la pregunta al agrupar no
 * es «cómo se llama», sino «cuánto trae».
 */
export function ArtisticLabelPicker({
  availableLabels,
  selected,
  onChange,
  disabled = false,
}: ArtisticLabelPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableLabels;
    return availableLabels.filter((label) => (label.label ?? "").toLowerCase().includes(q));
  }, [availableLabels, query]);

  const visibleNames = filtered.map((label) => label.label).filter(Boolean);
  const allVisibleSelected =
    visibleNames.length > 0 && visibleNames.every((name) => selected.includes(name));

  const toggle = (name: string) => {
    onChange(selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name]);
  };

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      onChange(selected.filter((name) => !visibleNames.includes(name)));
      return;
    }
    onChange([...new Set([...selected, ...visibleNames])]);
  };

  const totals = useMemo(() => {
    const chosen = availableLabels.filter((label) => selected.includes(label.label));
    return chosen.reduce(
      (acc, label) => ({
        songs: acc.songs + (label.count ?? 0),
        streams: acc.streams + (label.totalStreams ?? 0),
        income: acc.income + (label.totalNetIncome ?? 0),
      }),
      { songs: 0, streams: 0, income: 0 },
    );
  }, [availableLabels, selected]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <FieldLabel required>SELLOS ARTÍSTICOS</FieldLabel>
        {selected.length > 0 && (
          <span className="rounded-[10px] bg-[#FFEADD] px-[7px] py-px font-mono text-[10px] font-semibold text-[#FF5C00]">
            {selected.length} {selected.length === 1 ? "elegido" : "elegidos"}
          </span>
        )}
        {visibleNames.length > 0 && (
          <button
            type="button"
            onClick={toggleAllVisible}
            disabled={disabled}
            className="ml-auto text-[11.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C] disabled:opacity-50"
          >
            {allVisibleSelected ? "Quitar todos" : "Seleccionar todos"}
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6AAB2]" size={15} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder="Buscar sello artístico…"
          className="w-full rounded-2xl border border-[#E8E8EC] bg-white py-2.5 pl-11 pr-4 text-[12.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15 disabled:opacity-50"
        />
      </div>

      <div className="max-h-[240px] overflow-y-auto rounded-[18px] border border-[#E8E8EC]">
        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-[12px] text-[#A6AAB2]">
            {availableLabels.length === 0
              ? "Todavía no hay sellos artísticos que agrupar."
              : `Ningún sello coincide con «${query}»`}
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-[#E8E8EC]">
            {filtered.map((label) => {
              const name = label.label;
              const isSelected = selected.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggle(name)}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors disabled:opacity-50 ${
                    isSelected ? "bg-[#FFEADD]" : "bg-white hover:bg-[#F4F5F7]"
                  }`}
                >
                  <span
                    className={`flex h-[19px] w-[19px] flex-shrink-0 items-center justify-center rounded-md border-[1.5px] transition-colors ${
                      isSelected ? "border-[#FF5C00] bg-[#FF5C00]" : "border-[#E8E8EC] bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                      {name || "Sin sello"}
                    </span>
                    <span className="truncate text-[11px] text-[#A6AAB2]">
                      {(label.count ?? 0).toLocaleString()}{" "}
                      {label.count === 1 ? "canción" : "canciones"} ·{" "}
                      {formatStreams(label.totalStreams ?? 0)} streams
                    </span>
                  </span>
                  <span className="flex-shrink-0 font-mono text-[11.5px] font-medium text-[#71757E]">
                    {formatCurrency(label.totalNetIncome ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex items-center divide-x divide-[#E8E8EC] rounded-[18px] bg-[#F4F5F7] px-1 py-3">
          <SummaryCell label="CANCIONES" value={totals.songs.toLocaleString()} />
          <SummaryCell label="STREAMS" value={formatStreams(totals.streams)} />
          <SummaryCell
            label="INGRESOS"
            value={formatCurrency(totals.income)}
            valueClassName="text-[#2FB37E]"
          />
        </div>
      )}
    </div>
  );
}

function SummaryCell({
  label,
  value,
  valueClassName = "text-[#1C1D22]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1 px-3.5">
      <span className="font-mono text-[9px] font-medium tracking-[1.1px] text-[#A6AAB2]">
        {label}
      </span>
      <span className={`truncate font-mono text-[15px] font-semibold ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}
