import { useState } from "react";
import Select from "react-select";
import { SlidersHorizontal, ArrowUpDown, XCircle } from "lucide-react";
import type { SortBy, SplitFilter, CollaboratorsFilter, OwnerSplitFilter } from "@/types/music.types";
import { selectStyles } from "@/components/ui/selectStyles";

interface SongsFilterBarProps {
  splitFilter: SplitFilter;
  onSplitFilterChange: (v: SplitFilter) => void;
  collaboratorsFilter: CollaboratorsFilter;
  onCollaboratorsFilterChange: (v: CollaboratorsFilter) => void;
  ownerSplitFilter: OwnerSplitFilter;
  onOwnerSplitFilterChange: (v: OwnerSplitFilter) => void;
  sortBy: SortBy;
  onSortChange: (v: SortBy) => void;
  artistFilter: string;
  onArtistFilterChange: (v: string) => void;
  isrcFilter: string;
  onIsrcFilterChange: (v: string) => void;
  countryFilter: string;
  onCountryFilterChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  percentageMin: string;
  onPercentageMinChange: (v: string) => void;
  percentageMax: string;
  onPercentageMaxChange: (v: string) => void;
  onClearAll: () => void;
}

const SPLIT_CHIPS: { value: SplitFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "with_split", label: "Con split" },
  { value: "without_split", label: "Sin split" },
];

const COLLABORATORS_CHIPS: { value: CollaboratorsFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "with_collaborators", label: "Con colaboradores" },
  { value: "without_collaborators", label: "Sin colaboradores" },
];

const OWNER_SPLIT_CHIPS: { value: OwnerSplitFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "with_owner_split", label: "Con split owner" },
  { value: "without_owner_split", label: "Sin split owner" },
];

const ORDER_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "alpha", label: "Nombre (A–Z)" },
  { value: "title_desc", label: "Nombre (Z–A)" },
  { value: "revenue", label: "Mayores ganancias" },
  { value: "streams", label: "Más streams" },
  { value: "percentage_desc", label: "Mayor %" },
  { value: "percentage_asc", label: "Menor %" },
  { value: "collaborators_desc", label: "Más colaboradores" },
  { value: "date_desc", label: "Más reciente" },
];

const controlBase =
  "w-full rounded-[16px] bg-white px-3.5 py-2.5 text-[13px] text-[#1C1D22] shadow-[0_1px_2px_rgba(0,0,0,0.04)] placeholder:text-[#A6AAB2] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/40";

/**
 * Barra de filtros de canciones: chips de estado de split, orden y un botón
 * "Más filtros" que despliega los filtros avanzados (artista, ISRC, país, fecha, %).
 */
export function SongsFilterBar({
  splitFilter,
  onSplitFilterChange,
  collaboratorsFilter,
  onCollaboratorsFilterChange,
  ownerSplitFilter,
  onOwnerSplitFilterChange,
  sortBy,
  onSortChange,
  artistFilter,
  onArtistFilterChange,
  isrcFilter,
  onIsrcFilterChange,
  countryFilter,
  onCountryFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  percentageMin,
  onPercentageMinChange,
  percentageMax,
  onPercentageMaxChange,
  onClearAll,
}: SongsFilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const advancedCount = [
    artistFilter.trim() !== "",
    isrcFilter.trim() !== "",
    countryFilter.trim() !== "",
    dateFrom !== "",
    dateTo !== "",
    percentageMin !== "",
    percentageMax !== "",
  ].filter(Boolean).length;

  const activeRing = (on: boolean) => (on ? "ring-1 ring-[#FF5C00]/30 text-[#FF5C00]" : "");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-[#F4F5F7] p-1">
            {SPLIT_CHIPS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onSplitFilterChange(value)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-medium transition-colors ${
                  splitFilter === value ? "bg-[#FF5C00] text-white" : "text-[#71757E] hover:text-[#1C1D22]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#F4F5F7] p-1">
            {COLLABORATORS_CHIPS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onCollaboratorsFilterChange(value)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-medium transition-colors ${
                  collaboratorsFilter === value
                    ? "bg-[#FF5C00] text-white"
                    : "text-[#71757E] hover:text-[#1C1D22]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#F4F5F7] p-1">
            {OWNER_SPLIT_CHIPS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onOwnerSplitFilterChange(value)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-medium transition-colors ${
                  ownerSplitFilter === value
                    ? "bg-[#FF5C00] text-white"
                    : "text-[#71757E] hover:text-[#1C1D22]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-[220px]">
            <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-[15px] w-[15px] -translate-y-1/2 text-[#71757E]" />
            <Select
              value={ORDER_OPTIONS.find((o) => o.value === sortBy) ?? null}
              onChange={(opt) => onSortChange((opt?.value ?? sortBy) as SortBy)}
              options={ORDER_OPTIONS}
              styles={{
                ...selectStyles,
                control: (base: Record<string, unknown>) => ({
                  ...selectStyles.control(base),
                  borderRadius: "9999px",
                  paddingLeft: "22px",
                }),
              }}
              menuPortalTarget={document.body}
            />
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[12.5px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors ${
              expanded ? "bg-[#FFEADD] text-[#FF5C00]" : "bg-white text-[#1C1D22] hover:text-[#FF5C00]"
            }`}
          >
            <SlidersHorizontal className="h-[15px] w-[15px]" />
            Más filtros
            {advancedCount > 0 && (
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FF5C00] text-[10px] font-bold text-white">
                {advancedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="rounded-[28px] bg-[#F4F5F7] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1C1D22]">Filtros avanzados</h3>
            {advancedCount > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
              >
                <XCircle className="h-[15px] w-[15px]" />
                Limpiar filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Field label="Artista">
              <input
                type="text"
                value={artistFilter}
                onChange={(e) => onArtistFilterChange(e.target.value)}
                placeholder="Nombre del artista"
                className={`${controlBase} ${activeRing(!!artistFilter)}`}
              />
            </Field>
            <Field label="ISRC">
              <input
                type="text"
                value={isrcFilter}
                onChange={(e) => onIsrcFilterChange(e.target.value)}
                placeholder="ISRC…"
                className={`${controlBase} ${activeRing(!!isrcFilter)}`}
              />
            </Field>
            <Field label="País">
              <input
                type="text"
                value={countryFilter}
                onChange={(e) => onCountryFilterChange(e.target.value)}
                placeholder="País…"
                className={`${controlBase} ${activeRing(!!countryFilter)}`}
              />
            </Field>
            <Field label="Desde">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className={`${controlBase} ${activeRing(!!dateFrom)}`}
              />
            </Field>
            <Field label="Hasta">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className={`${controlBase} ${activeRing(!!dateTo)}`}
              />
            </Field>
            <Field label="% mínimo">
              <input
                type="number"
                min={0}
                max={100}
                value={percentageMin}
                onChange={(e) => onPercentageMinChange(e.target.value)}
                placeholder="0"
                className={`${controlBase} ${activeRing(!!percentageMin)}`}
              />
            </Field>
            <Field label="% máximo">
              <input
                type="number"
                min={0}
                max={100}
                value={percentageMax}
                onChange={(e) => onPercentageMaxChange(e.target.value)}
                placeholder="100"
                className={`${controlBase} ${activeRing(!!percentageMax)}`}
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

/** Etiqueta + control para el panel de filtros avanzados. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-[#A6AAB2]">{label}</span>
      {children}
    </div>
  );
}
