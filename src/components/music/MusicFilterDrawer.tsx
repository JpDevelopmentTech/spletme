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
  groupAlbumsByTrackCount: boolean;
  activeFilterCount: number;
  onClose: () => void;
  onSortChange: (v: SortBy) => void;
  onSplitFilterChange: (v: SplitFilter) => void;
  onArtistFilterChange: (v: string) => void;
  onIsrcFilterChange: (v: string) => void;
  onUpcFilterChange: (v: string) => void;
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

function RadioOption({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
        selected ? "border-orange-200 bg-orange-50 text-orange-700 font-semibold" : "border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? "border-orange-500" : "border-gray-300"}`}>
        {selected && <span className="w-2 h-2 rounded-full bg-orange-500" />}
      </span>
      {label}
    </button>
  );
}

/**
 * Drawer lateral de filtros y ordenación para la biblioteca musical.
 */
export function MusicFilterDrawer({
  isOpen, mode, sortBy, splitFilter, artistFilter, isrcFilter, upcFilter,
  groupAlbumsByTrackCount, activeFilterCount, onClose, onSortChange,
  onSplitFilterChange, onArtistFilterChange, onIsrcFilterChange,
  onUpcFilterChange, onGroupByTrackCountChange, onClearAll,
}: MusicFilterDrawerProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={18} className="text-gray-700" />
            <h3 className="text-base font-bold text-gray-900">Filtros</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Ordenar por</p>
            <div className="space-y-2">
              {SORT_OPTIONS.map(({ value, label }) => (
                <RadioOption key={value} selected={sortBy === value} label={label} onClick={() => onSortChange(value)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Estado de Split</p>
            <div className="space-y-2">
              {SPLIT_OPTIONS.map(({ value, label }) => (
                <RadioOption key={value} selected={splitFilter === value} label={label} onClick={() => onSplitFilterChange(value)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Artista</p>
            <input
              type="text"
              value={artistFilter}
              onChange={(e) => onArtistFilterChange(e.target.value)}
              placeholder="Filtrar por nombre de artista"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {mode === "songs" ? "ISRC" : "UPC"}
            </p>
            {mode === "songs" ? (
              <input
                type="text"
                value={isrcFilter}
                onChange={(e) => onIsrcFilterChange(e.target.value)}
                placeholder="Filtrar por ISRC"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            ) : (
              <input
                type="text"
                value={upcFilter}
                onChange={(e) => onUpcFilterChange(e.target.value)}
                placeholder="Filtrar por UPC"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            )}
          </div>

          {mode === "albums" && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Álbumes</p>
              <button
                onClick={() => onGroupByTrackCountChange(!groupAlbumsByTrackCount)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${groupAlbumsByTrackCount ? "border-orange-200 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <span>Agrupar por nº canciones</span>
                <span className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${groupAlbumsByTrackCount ? "bg-orange-500" : "bg-gray-300"}`}>
                  <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${groupAlbumsByTrackCount ? "translate-x-4" : "translate-x-0"}`} />
                </span>
              </button>
            </div>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={onClearAll}
              className="w-full py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar todos los filtros ({activeFilterCount})
            </button>
          </div>
        )}
      </div>
    </>
  );
}
