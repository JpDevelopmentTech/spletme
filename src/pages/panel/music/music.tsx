import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Rows3, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { MusicKpis } from "@/components/music/MusicKpis";
import { MusicModeSwitch } from "@/components/music/MusicModeSwitch";
import { useMusicSummary } from "@/hooks/useMusicSummary";
import { SongsView } from "./views/SongsView";
import { AlbumsView } from "./views/AlbumsView";
import type { MusicLayout, MusicMode } from "@/types/music.types";

/**
 * Música: un catálogo, dos formas de mirarlo.
 *
 * Canciones y álbumes no son dos catálogos distintos —un álbum es un grupo de
 * canciones con el mismo UPC—, así que dejan de ser dos páginas y pasan a ser dos
 * agrupaciones del mismo listado. El modo, la búsqueda y la disposición viven en
 * la URL para que compartir un enlace conserve lo que estabas viendo.
 *
 * Cada modo se monta por separado y con su propio hook: son dos endpoints con
 * paginación propia, y montar solo el activo evita pedir el catálogo entero dos
 * veces.
 */
export default function Music() {
  const [params, setParams] = useSearchParams();

  const mode: MusicMode = params.get("view") === "albums" ? "albums" : "songs";
  const layout: MusicLayout = params.get("layout") === "grid" ? "grid" : "list";
  const query = params.get("q") ?? "";

  const [songsCount, setSongsCount] = useState<number>();
  const [albumsCount, setAlbumsCount] = useState<number>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const summary = useMusicSummary();

  /** Escribe en la URL sin apilar una entrada nueva en el historial por tecla. */
  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const setMode = useCallback((next: MusicMode) => patchParams({ view: next }), [patchParams]);
  const setLayout = useCallback((next: MusicLayout) => patchParams({ layout: next }), [patchParams]);
  const setQuery = useCallback((next: string) => patchParams({ q: next }), [patchParams]);

  const counts = useMemo(
    () => ({
      songs: songsCount ?? (summary.loading ? undefined : summary.totalSongs),
      albums: albumsCount ?? (summary.loading ? undefined : summary.totalAlbums),
    }),
    [songsCount, albumsCount, summary],
  );

  const viewProps = {
    query,
    onQueryChange: setQuery,
    layout,
    filtersOpen,
    onFiltersOpenChange: setFiltersOpen,
    onActiveFiltersChange: setActiveFilters,
  };

  return (
    <div className="min-h-full bg-[#F7F7F9]">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-display text-2xl font-semibold text-[#1C1D22]">Música</h1>
            <p className="flex flex-wrap items-center gap-2 text-[13px] text-[#71757E]">
              <span>{summary.totalSongs.toLocaleString()} canciones</span>
              <span className="text-[#A6AAB2]">en</span>
              <span>{summary.totalAlbums.toLocaleString()} álbumes</span>
              {summary.withoutSplits > 0 && (
                <>
                  <span className="text-[#A6AAB2]">·</span>
                  <button
                    onClick={() => setFiltersOpen(true)}
                    className="font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
                  >
                    {summary.withoutSplits.toLocaleString()} sin split
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-[320px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6AAB2]"
                size={16}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  mode === "albums"
                    ? "Buscar por título de álbum, artista o UPC…"
                    : "Buscar por título, artista o ISRC…"
                }
                className="w-full rounded-[22px] border border-[#E8E8EC] bg-white py-2.5 pl-11 pr-4 text-[12.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
              />
            </div>

            <div className="flex flex-shrink-0 items-center gap-0.5 rounded-[22px] bg-[#F4F5F7] p-[3px]">
              <LayoutButton
                active={layout === "list"}
                onClick={() => setLayout("list")}
                title="Lista"
              >
                <Rows3 className="h-4 w-4" />
              </LayoutButton>
              <LayoutButton
                active={layout === "grid"}
                onClick={() => setLayout("grid")}
                title="Cuadrícula"
              >
                <LayoutGrid className="h-4 w-4" />
              </LayoutButton>
            </div>
          </div>
        </div>

        <MusicKpis
          totalSongs={summary.totalSongs}
          totalAlbums={summary.totalAlbums}
          totalIncome={summary.totalIncome}
          totalStreams={summary.totalStreams}
          withoutSplits={summary.withoutSplits}
          onShowWithoutSplits={
            summary.withoutSplits > 0 ? () => setFiltersOpen(true) : undefined
          }
        />

        {/* Agrupación y filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <MusicModeSwitch
            mode={mode}
            onChange={setMode}
            songsCount={counts.songs}
            albumsCount={counts.albums}
          />

          <button
            onClick={() => setFiltersOpen(true)}
            className={`relative flex flex-shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
              activeFilters > 0
                ? "bg-[#FFEADD] text-[#FF5C00]"
                : "border border-[#E8E8EC] bg-white text-[#1C1D22] hover:bg-[#F4F5F7]"
            }`}
          >
            <SlidersHorizontal
              className={`h-3.5 w-3.5 ${activeFilters > 0 ? "text-[#FF5C00]" : "text-[#71757E]"}`}
            />
            Filtros
            {activeFilters > 0 && (
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FF5C00] font-mono text-[10px] font-semibold text-white">
                {activeFilters}
              </span>
            )}
          </button>

          <span className="ml-auto hidden text-[11.5px] text-[#A6AAB2] lg:block">
            {mode === "albums"
              ? "Despliega un álbum para ver sus pistas"
              : "Cambia a álbumes para verlas agrupadas"}
          </span>
        </div>

        {mode === "songs" ? (
          <SongsView
            {...viewProps}
            onCountChange={setSongsCount}
            onSwitchToAlbums={() => setMode("albums")}
          />
        ) : (
          <AlbumsView
            {...viewProps}
            onCountChange={setAlbumsCount}
            onSwitchToSongs={() => setMode("songs")}
          />
        )}
      </div>
    </div>
  );
}

function LayoutButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
        active ? "bg-[#FF5C00] text-white" : "text-[#A6AAB2] hover:text-[#71757E]"
      }`}
    >
      {children}
    </button>
  );
}
