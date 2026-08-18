import { X, Check, Calendar, Info } from "lucide-react";
import type { MusicMode, SortBy, SplitFilter } from "@/types/music.types";

interface MusicFilterDrawerProps {
  isOpen: boolean;
  mode: MusicMode;
  sortBy: SortBy;
  splitFilter: SplitFilter;
  artistFilter: string;
  isrcFilter: string;
  upcFilter: string;
  countryFilter: string;
  dateFrom: string;
  dateTo: string;
  groupAlbumsByTrackCount: boolean;
  activeFilterCount: number;
  /** Cuántos resultados quedan con lo que hay puesto. */
  resultCount?: number;
  onClose: () => void;
  onSortChange: (v: SortBy) => void;
  onSplitFilterChange: (v: SplitFilter) => void;
  onArtistFilterChange: (v: string) => void;
  onIsrcFilterChange: (v: string) => void;
  onUpcFilterChange: (v: string) => void;
  onCountryFilterChange: (v: string) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  percentageMin: string;
  percentageMax: string;
  onPercentageMinChange: (v: string) => void;
  onPercentageMaxChange: (v: string) => void;
  onGroupByTrackCountChange: (v: boolean) => void;
  onClearAll: () => void;
}

const SPLIT_OPTIONS: { value: SplitFilter; label: string; detail: string }[] = [
  { value: "all", label: "Todas", detail: "Sin filtrar por split" },
  { value: "with_split", label: "Con split asignado", detail: "Ya tienen reparto" },
  { value: "without_split", label: "Sin split", detail: "Aún no reparten nada" },
];

const SORT_OPTIONS: Record<MusicMode, { value: SortBy; label: string }[]> = {
  songs: [
    { value: "revenue", label: "Mayores ingresos" },
    { value: "streams", label: "Más streams" },
    { value: "alpha", label: "Título (A → Z)" },
    { value: "title_desc", label: "Título (Z → A)" },
    { value: "percentage_desc", label: "Mayor porcentaje" },
    { value: "collaborators_desc", label: "Más colaboradores" },
  ],
  albums: [
    { value: "revenue", label: "Mayores ingresos" },
    { value: "streams", label: "Más streams" },
    { value: "alpha", label: "Título (A → Z)" },
    { value: "title_desc", label: "Título (Z → A)" },
    { value: "artist_asc", label: "Artista (A → Z)" },
    { value: "date_desc", label: "Más reciente" },
  ],
};

/**
 * Filtros del catálogo, uno solo para los dos modos.
 *
 * Cada grupo dice a qué agrupación aplica, en vez de mostrar campos que se
 * ignoran en silencio cuando no corresponden al modo activo.
 */
export function MusicFilterDrawer({
  isOpen,
  mode,
  sortBy,
  splitFilter,
  artistFilter,
  isrcFilter,
  upcFilter,
  countryFilter,
  dateFrom,
  dateTo,
  groupAlbumsByTrackCount,
  activeFilterCount,
  resultCount,
  onClose,
  onSortChange,
  onSplitFilterChange,
  onArtistFilterChange,
  onIsrcFilterChange,
  onUpcFilterChange,
  onCountryFilterChange,
  onDateFromChange,
  onDateToChange,
  percentageMin,
  percentageMax,
  onPercentageMinChange,
  onPercentageMaxChange,
  onGroupByTrackCountChange,
  onClearAll,
}: MusicFilterDrawerProps) {
  if (!isOpen) return null;

  const songsMode = mode === "songs";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#101114]/65 backdrop-blur-sm" onClick={onClose} />

      <aside
        role="dialog"
        aria-label="Filtros del catálogo"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col bg-white shadow-[-16px_0_48px_-12px_rgba(16,17,20,0.35)]"
      >
        <div className="flex flex-shrink-0 items-start justify-between gap-3.5 px-6 pb-[18px] pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold text-[#1C1D22]">Filtros</h2>
            <p className="text-[12px] text-[#71757E]">
              Se aplican al catálogo completo, en los dos modos.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar filtros"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F4F5F7] text-[#71757E] transition-colors hover:bg-[#E8E8EC] hover:text-[#1C1D22]"
          >
            <X className="h-[15px] w-[15px]" />
          </button>
        </div>

        <div className="h-px flex-shrink-0 bg-[#E8E8EC]" />

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-[18px]">
          {/* Orden */}
          <Group title="ORDEN" scope="Ambos">
            <Field label="Ordenar por">
              <select
                aria-label="Ordenar catálogo"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortBy)}
                className="w-full rounded-[14px] border border-[#E8E8EC] bg-white px-3.5 py-2.5 text-[12.5px] font-medium text-[#1C1D22] focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
              >
                {SORT_OPTIONS[mode].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </Group>

          {/* Estado del split */}
          <Group title="ESTADO DEL SPLIT" scope="Ambos">
            <div className="flex flex-col gap-1.5">
              {SPLIT_OPTIONS.map((option) => {
                const active = splitFilter === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => onSplitFilterChange(option.value)}
                    aria-pressed={active}
                    className={`flex items-center gap-2.5 rounded-[14px] px-3.5 py-2.5 text-left transition-colors ${
                      active
                        ? "border-[1.5px] border-[#FF5C00] bg-[#FFEADD]"
                        : "border border-[#E8E8EC] bg-white hover:border-[#D9DAE0]"
                    }`}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={`text-[12.5px] font-semibold ${
                          active ? "text-[#EA580C]" : "text-[#1C1D22]"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span
                        className={`text-[10.5px] ${active ? "text-[#EA580C]" : "text-[#A6AAB2]"}`}
                      >
                        {option.detail}
                      </span>
                    </span>
                    {active && <Check className="h-[15px] w-[15px] flex-shrink-0 text-[#FF5C00]" />}
                  </button>
                );
              })}
            </div>
          </Group>

          {/* Quién y dónde */}
          <Group title="QUIÉN Y DÓNDE" scope="Ambos">
            <Field label="Artista">
              <Input
                value={artistFilter}
                onChange={onArtistFilterChange}
                placeholder="Nombre del artista"
              />
            </Field>
            <Field label="País">
              <Input
                value={countryFilter}
                onChange={onCountryFilterChange}
                placeholder="Todos los países"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Desde">
                <DateInput value={dateFrom} onChange={onDateFromChange} />
              </Field>
              <Field label="Hasta">
                <DateInput value={dateTo} onChange={onDateToChange} />
              </Field>
            </div>
          </Group>

          {/* Solo canciones */}
          <Group title="SOLO EN CANCIONES" scope="Por canción" dimmed={!songsMode}>
            <Field label="ISRC">
              <Input
                value={isrcFilter}
                onChange={onIsrcFilterChange}
                placeholder="Ej. USRC17607839"
                disabled={!songsMode}
              />
            </Field>
            <Field label="Tu porcentaje">
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  value={percentageMin}
                  onChange={onPercentageMinChange}
                  placeholder="Mín. 0%"
                  disabled={!songsMode}
                />
                <Input
                  value={percentageMax}
                  onChange={onPercentageMaxChange}
                  placeholder="Máx. 100%"
                  disabled={!songsMode}
                />
              </div>
            </Field>
          </Group>

          {/* Solo álbumes */}
          <Group title="SOLO EN ÁLBUMES" scope="Por álbum" dimmed={songsMode}>
            <Field label="UPC">
              <Input
                value={upcFilter}
                onChange={onUpcFilterChange}
                placeholder="Ej. 00602448291"
                disabled={songsMode}
              />
            </Field>
            <button
              onClick={() => onGroupByTrackCountChange(!groupAlbumsByTrackCount)}
              disabled={songsMode}
              aria-pressed={groupAlbumsByTrackCount}
              className="flex items-center gap-3 rounded-[14px] bg-[#F4F5F7] px-3.5 py-3 text-left transition-colors enabled:hover:bg-[#E8E8EC] disabled:cursor-not-allowed"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[12px] font-semibold text-[#1C1D22]">
                  Agrupar por número de pistas
                </span>
                <span className="text-[10.5px] text-[#A6AAB2]">
                  Separa sencillos, EP y álbumes largos
                </span>
              </span>
              <span
                className={`flex h-[22px] w-[38px] flex-shrink-0 items-center rounded-full p-0.5 transition-colors ${
                  groupAlbumsByTrackCount ? "bg-[#FF5C00]" : "bg-[#E8E8EC]"
                }`}
              >
                <span
                  className={`h-[18px] w-[18px] rounded-full bg-white transition-transform ${
                    groupAlbumsByTrackCount ? "translate-x-4" : ""
                  }`}
                />
              </span>
            </button>
          </Group>

          <p className="flex items-start gap-2.5 rounded-[14px] bg-[#F4F5F7] px-3.5 py-3 text-[11px] leading-relaxed text-[#71757E]">
            <Info className="mt-px h-3.5 w-3.5 flex-shrink-0" />
            Los grupos atenuados no aplican a la agrupación que tienes activa, pero se conservan
            al cambiar de modo.
          </p>
        </div>

        <div className="h-px flex-shrink-0 bg-[#E8E8EC]" />

        <div className="flex flex-shrink-0 items-center gap-2.5 px-6 pb-5 pt-4">
          <span className="flex-1 text-[11.5px] font-semibold text-[#71757E]">
            {activeFilterCount === 0
              ? "Sin filtros"
              : `${activeFilterCount} ${activeFilterCount === 1 ? "filtro puesto" : "filtros puestos"}`}
          </span>
          <button
            onClick={onClearAll}
            disabled={activeFilterCount === 0}
            className="rounded-[20px] border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#71757E] transition-colors enabled:hover:bg-[#F4F5F7] disabled:opacity-40"
          >
            Limpiar
          </button>
          <button
            onClick={onClose}
            className="rounded-[20px] bg-[#FF5C00] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors hover:bg-[#EA580C]"
          >
            {resultCount === undefined
              ? "Ver resultados"
              : `Ver ${resultCount.toLocaleString()} ${
                  mode === "albums" ? "álbumes" : "canciones"
                }`}
          </button>
        </div>
      </aside>
    </>
  );
}

function Group({
  title,
  scope,
  dimmed = false,
  children,
}: {
  title: string;
  scope: string;
  dimmed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`flex flex-col gap-3 ${dimmed ? "opacity-45" : ""}`}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
          {title}
        </span>
        <span
          className={`rounded-[10px] px-[7px] py-[2px] text-[9.5px] font-semibold ${
            scope === "Ambos" ? "bg-[#F4F5F7] text-[#71757E]" : "bg-[#FFEADD] text-[#FF5C00]"
          }`}
        >
          {scope}
        </span>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] text-[#71757E]">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-[14px] px-3.5 py-2.5 text-[12.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15 disabled:cursor-not-allowed ${
        value
          ? "border-[1.5px] border-[#FF5C00] font-medium"
          : "border border-[#E8E8EC] focus:border-[#FF5C00]"
      }`}
    />
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <span className="relative flex items-center">
      <Calendar className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-[#A6AAB2]" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-[14px] py-2.5 pl-9 pr-3 text-[12.5px] text-[#1C1D22] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15 ${
          value
            ? "border-[1.5px] border-[#FF5C00] font-medium"
            : "border border-[#E8E8EC] focus:border-[#FF5C00]"
        }`}
      />
    </span>
  );
}
