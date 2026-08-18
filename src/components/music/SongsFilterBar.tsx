import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, ChevronDown, CircleX, X } from "lucide-react";
import type {
  SortBy,
  SplitFilter,
  CollaboratorsFilter,
  OwnerSplitFilter,
} from "@/types/music.types";

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

const SPLIT_OPTIONS: { value: SplitFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "with_split", label: "Con split" },
  { value: "without_split", label: "Sin split" },
];

const COLLABORATORS_OPTIONS: { value: CollaboratorsFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "with_collaborators", label: "Con colaboradores" },
  { value: "without_collaborators", label: "Sin colaboradores" },
];

const OWNER_SPLIT_OPTIONS: { value: OwnerSplitFilter; label: string }[] = [
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

const labelOf = <T,>(options: { value: T; label: string }[], value: T) =>
  options.find((o) => o.value === value)?.label ?? "";

/**
 * Barra de filtros de canciones: un selector por faceta que muestra el valor
 * puesto, el orden, y el panel de filtros avanzados. Debajo, lo que está
 * filtrando se lista como chips que pueden quitarse de uno en uno.
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

  const activeChips: { key: string; label: string; onRemove: () => void }[] = [
    ...(splitFilter !== "all"
      ? [
          {
            key: "split",
            label: labelOf(SPLIT_OPTIONS, splitFilter),
            onRemove: () => onSplitFilterChange("all"),
          },
        ]
      : []),
    ...(collaboratorsFilter !== "all"
      ? [
          {
            key: "collaborators",
            label: labelOf(COLLABORATORS_OPTIONS, collaboratorsFilter),
            onRemove: () => onCollaboratorsFilterChange("all"),
          },
        ]
      : []),
    ...(ownerSplitFilter !== "all"
      ? [
          {
            key: "owner",
            label: labelOf(OWNER_SPLIT_OPTIONS, ownerSplitFilter),
            onRemove: () => onOwnerSplitFilterChange("all"),
          },
        ]
      : []),
    ...(artistFilter.trim()
      ? [
          {
            key: "artist",
            label: `Artista: ${artistFilter}`,
            onRemove: () => onArtistFilterChange(""),
          },
        ]
      : []),
    ...(isrcFilter.trim()
      ? [{ key: "isrc", label: `ISRC: ${isrcFilter}`, onRemove: () => onIsrcFilterChange("") }]
      : []),
    ...(countryFilter.trim()
      ? [
          {
            key: "country",
            label: `País: ${countryFilter}`,
            onRemove: () => onCountryFilterChange(""),
          },
        ]
      : []),
    ...(dateFrom
      ? [{ key: "from", label: `Desde ${dateFrom}`, onRemove: () => onDateFromChange("") }]
      : []),
    ...(dateTo
      ? [{ key: "to", label: `Hasta ${dateTo}`, onRemove: () => onDateToChange("") }]
      : []),
    ...(percentageMin
      ? [
          {
            key: "pmin",
            label: `% ≥ ${percentageMin}`,
            onRemove: () => onPercentageMinChange(""),
          },
        ]
      : []),
    ...(percentageMax
      ? [
          {
            key: "pmax",
            label: `% ≤ ${percentageMax}`,
            onRemove: () => onPercentageMaxChange(""),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <Facet
          label="Split"
          value={splitFilter}
          options={SPLIT_OPTIONS}
          onChange={onSplitFilterChange}
        />
        <Facet
          label="Colaboradores"
          value={collaboratorsFilter}
          options={COLLABORATORS_OPTIONS}
          onChange={onCollaboratorsFilterChange}
        />
        <Facet
          label="Split owner"
          value={ownerSplitFilter}
          options={OWNER_SPLIT_OPTIONS}
          onChange={onOwnerSplitFilterChange}
        />

        <div className="flex flex-1 items-center justify-end gap-2.5">
          <label className="relative flex cursor-pointer items-center gap-2 rounded-[18px] border border-[#E8E8EC] bg-white px-3.5 py-2.5 focus-within:border-[#FF5C00]">
            <ArrowUpDown className="h-[15px] w-[15px] flex-shrink-0 text-[#71757E]" />
            <span className="text-[12.5px] font-semibold text-[#1C1D22]">
              {labelOf(ORDER_OPTIONS, sortBy)}
            </span>
            <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
            <select
              aria-label="Ordenar por"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
              className="absolute inset-0 h-full w-full cursor-pointer border-0 opacity-0 focus:ring-0"
            >
              {ORDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={`flex items-center gap-2 rounded-[18px] px-3.5 py-2.5 text-[12.5px] font-semibold transition-colors ${
              expanded || advancedCount > 0
                ? "bg-[#FFEADD] text-[#FF5C00]"
                : "border border-[#E8E8EC] bg-white text-[#1C1D22] hover:text-[#FF5C00]"
            }`}
          >
            <SlidersHorizontal className="h-[15px] w-[15px]" />
            Más filtros
            {advancedCount > 0 && (
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FF5C00] font-mono text-[10px] font-semibold text-white">
                {advancedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className="flex items-center gap-1.5 rounded-2xl bg-[#F4F5F7] px-2.5 py-1.5 text-[11.5px] font-medium text-[#1C1D22] transition-colors hover:bg-[#E8E8EC]"
            >
              {chip.label}
              <X className="h-3 w-3 text-[#71757E]" />
              <span className="sr-only">Quitar filtro</span>
            </button>
          ))}
          <button
            onClick={onClearAll}
            className="text-[11.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {expanded && (
        <div className="rounded-[26px] border border-[#E8E8EC] bg-white p-[22px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[15px] font-semibold text-[#1C1D22]">
              Filtros avanzados
            </h3>
            {advancedCount > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
              >
                <CircleX className="h-[15px] w-[15px]" />
                Limpiar filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            <Field label="Artista">
              <Control
                type="text"
                value={artistFilter}
                onChange={onArtistFilterChange}
                placeholder="Nombre del artista"
              />
            </Field>
            <Field label="ISRC">
              <Control
                type="text"
                value={isrcFilter}
                onChange={onIsrcFilterChange}
                placeholder="ISRC…"
              />
            </Field>
            <Field label="País">
              <Control
                type="text"
                value={countryFilter}
                onChange={onCountryFilterChange}
                placeholder="País…"
              />
            </Field>
            <Field label="Desde">
              <Control type="date" value={dateFrom} onChange={onDateFromChange} />
            </Field>
            <Field label="Hasta">
              <Control type="date" value={dateTo} onChange={onDateToChange} />
            </Field>
            <Field label="% mínimo">
              <Control
                type="number"
                value={percentageMin}
                onChange={onPercentageMinChange}
                placeholder="0"
              />
            </Field>
            <Field label="% máximo">
              <Control
                type="number"
                value={percentageMax}
                onChange={onPercentageMaxChange}
                placeholder="100"
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

interface FacetProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

/**
 * Selector de faceta: muestra siempre qué valor está aplicado. El `select` real
 * va invisible encima para conservar el comportamiento nativo y el teclado.
 */
function Facet<T extends string>({ label, value, options, onChange }: FacetProps<T>) {
  const active = value !== "all";
  return (
    <label
      className={`relative flex cursor-pointer items-center gap-2 rounded-[18px] border bg-white px-3.5 py-2.5 focus-within:border-[#FF5C00] ${
        active ? "border-[#FF5C00]" : "border-[#E8E8EC]"
      }`}
    >
      <span className="text-[12px] text-[#A6AAB2]">{label}</span>
      <span
        className={`text-[12.5px] font-semibold ${active ? "text-[#FF5C00]" : "text-[#1C1D22]"}`}
      >
        {labelOf(options, value)}
      </span>
      <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="absolute inset-0 h-full w-full cursor-pointer border-0 opacity-0 focus:ring-0"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
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

interface ControlProps {
  type: "text" | "date" | "number";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

/** Campo de texto/fecha/número del panel avanzado; se resalta cuando tiene valor. */
function Control({ type, value, onChange, placeholder }: ControlProps) {
  const filled = value !== "";
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={type === "number" ? 0 : undefined}
      max={type === "number" ? 100 : undefined}
      className={`h-10 w-full rounded-[14px] border px-3.5 text-[12.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15 ${
        filled
          ? "border-[1.5px] border-[#FF5C00] bg-white font-semibold"
          : "border-[#E8E8EC] bg-[#F4F5F7] focus:border-[#FF5C00]"
      }`}
    />
  );
}
