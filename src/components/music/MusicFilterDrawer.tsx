import { X, SlidersHorizontal } from "lucide-react";
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
  percentageMin: string;
  percentageMax: string;
  groupAlbumsByTrackCount: boolean;
  activeFilterCount: number;
  onClose: () => void;
  onSortChange: (v: SortBy) => void;
  onSplitFilterChange: (v: SplitFilter) => void;
  onArtistFilterChange: (v: string) => void;
  onIsrcFilterChange: (v: string) => void;
  onUpcFilterChange: (v: string) => void;
  onCountryFilterChange: (v: string) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onPercentageMinChange: (v: string) => void;
  onPercentageMaxChange: (v: string) => void;
  onGroupByTrackCountChange: (v: boolean) => void;
  onClearAll: () => void;
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "alpha", label: "Nombre (A–Z)" },
  { value: "revenue", label: "Mayores ganancias" },
  { value: "streams", label: "Más streams" },
];

const SPLIT_OPTIONS: { value: SplitFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "with_split", label: "Con split asignado" },
  { value: "without_split", label: "Sin split" },
];

function RadioOption({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
        selected
          ? "border-orange-200 bg-orange-50 font-semibold text-orange-700"
          : "border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-orange-500" : "border-gray-300"}`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-orange-500" />}
      </span>
      {label}
    </button>
  );
}

/**
 * Drawer lateral de filtros y ordenación para la biblioteca musical.
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
  percentageMin,
  percentageMax,
  groupAlbumsByTrackCount,
  activeFilterCount,
  onClose,
  onSortChange,
  onSplitFilterChange,
  onArtistFilterChange,
  onIsrcFilterChange,
  onUpcFilterChange,
  onCountryFilterChange,
  onDateFromChange,
  onDateToChange,
  onPercentageMinChange,
  onPercentageMaxChange,
  onGroupByTrackCountChange,
  onClearAll,
}: MusicFilterDrawerProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={18} className="text-gray-700" />
            <h3 className="text-base font-bold text-gray-900">Filtros</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Ordenar por
            </p>
            <div className="space-y-2">
              {SORT_OPTIONS.map(({ value, label }) => (
                <RadioOption
                  key={value}
                  selected={sortBy === value}
                  label={label}
                  onClick={() => onSortChange(value)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Estado de Split
            </p>
            <div className="space-y-2">
              {SPLIT_OPTIONS.map(({ value, label }) => (
                <RadioOption
                  key={value}
                  selected={splitFilter === value}
                  label={label}
                  onClick={() => onSplitFilterChange(value)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Artista
            </p>
            <input
              type="text"
              value={artistFilter}
              onChange={(e) => onArtistFilterChange(e.target.value)}
              placeholder="Filtrar por nombre de artista"
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {mode === "songs" ? "ISRC" : "UPC"}
            </p>
            {mode === "songs" ? (
              <input
                type="text"
                value={isrcFilter}
                onChange={(e) => onIsrcFilterChange(e.target.value)}
                placeholder="Filtrar por ISRC"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <input
                type="text"
                value={upcFilter}
                onChange={(e) => onUpcFilterChange(e.target.value)}
                placeholder="Filtrar por UPC"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            )}
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              País
            </p>
            <input
              type="text"
              value={countryFilter}
              onChange={(e) => onCountryFilterChange(e.target.value)}
              placeholder="Filtrar por país"
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Fecha de lanzamiento
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Desde</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => onDateFromChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Hasta</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => onDateToChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {mode === "songs" && (
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Porcentaje de split
              </p>
              <div className="flex gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-xs text-gray-500">Mínimo (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={percentageMin}
                    onChange={(e) => onPercentageMinChange(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-xs text-gray-500">Máximo (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={percentageMax}
                    onChange={(e) => onPercentageMaxChange(e.target.value)}
                    placeholder="100"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {mode === "albums" && (
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Álbumes
              </p>
              <button
                onClick={() => onGroupByTrackCountChange(!groupAlbumsByTrackCount)}
                className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${groupAlbumsByTrackCount ? "border-orange-200 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <span>Agrupar por nº canciones</span>
                <span
                  className={`flex h-5 w-9 flex-shrink-0 items-center rounded-full px-0.5 transition-colors ${groupAlbumsByTrackCount ? "bg-orange-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${groupAlbumsByTrackCount ? "translate-x-4" : "translate-x-0"}`}
                  />
                </span>
              </button>
            </div>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="border-t border-gray-100 px-5 py-4">
            <button
              onClick={onClearAll}
              className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Limpiar todos los filtros ({activeFilterCount})
            </button>
          </div>
        )}
      </div>
    </>
  );
}
