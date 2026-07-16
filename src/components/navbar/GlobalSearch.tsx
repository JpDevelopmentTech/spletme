import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Music, Disc3, Users, Tag, Loader2, X } from "lucide-react";
import useGlobalSearch from "../../hooks/useGlobalSearch";
import type {
  SearchAlbumResult,
  SearchCollaboratorResult,
  SearchLabelResult,
  SearchSongResult,
} from "../../services/search";

/** Nombre completo del colaborador con fallback a username/email */
const collaboratorName = (c: SearchCollaboratorResult) =>
  [c.name, c.lastName].filter(Boolean).join(" ") || c.username || c.email || "Colaborador";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

/** Sección del dropdown con encabezado de categoría */
const Section = ({ title, children }: SectionProps) => (
  <div className="py-1">
    <span className="block px-4 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wider text-[#A6AAB2]">
      {title}
    </span>
    {children}
  </div>
);

interface ResultItemProps {
  icon: React.ReactNode;
  primary: string;
  secondary?: string;
  onClick: () => void;
}

/** Fila de resultado: ícono + texto principal + texto secundario */
const ResultItem = ({ icon, primary, secondary, onClick }: ResultItemProps) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[#F4F5F7]"
  >
    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FF5C00]/10 text-[#FF5C00]">
      {icon}
    </span>
    <span className="flex min-w-0 flex-col leading-tight">
      <span className="truncate text-[13px] font-medium text-[#1C1D22]">{primary}</span>
      {secondary && <span className="truncate text-[11px] text-[#A6AAB2]">{secondary}</span>}
    </span>
  </button>
);

/**
 * Buscador global del header: busca canciones (nombre/ISRC), álbumes
 * (nombre/UPC), colaboradores (nombre/email) y sellos (nombre), y muestra
 * los resultados agrupados en un dropdown navegable.
 */
export default function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, loading, hasResults, isActive } = useGlobalSearch(query);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const goTo = (path: string) => {
    close();
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = open && isActive;

  return (
    <div ref={containerRef} className="relative hidden sm:block sm:w-[320px] lg:w-[380px]">
      <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/55 px-5 py-3 backdrop-blur-md">
        <Search className="h-[19px] w-[19px] flex-shrink-0 text-[#A6AAB2]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar canciones, álbumes, colaboradores…"
          className="w-full border-none bg-transparent text-[13.5px] text-[#1C1D22] outline-none placeholder:text-[#A6AAB2] focus:border-none focus:outline-none focus:ring-0 focus-visible:outline-none"
        />
        {loading && isActive ? (
          <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-[#FF5C00]" />
        ) : (
          query.length > 0 && (
            <button onClick={close} className="flex-shrink-0 text-[#A6AAB2] hover:text-[#1C1D22]">
              <X className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 top-[calc(100%+10px)] z-30 max-h-[70vh] w-full overflow-y-auto rounded-[22px] border border-white/60 bg-white/95 py-2 shadow-[0_16px_40px_-12px_rgba(255,92,0,0.16)] backdrop-blur-2xl">
          {!hasResults && !loading && (
            <div className="px-4 py-6 text-center text-[13px] text-[#A6AAB2]">
              Sin resultados para «{query.trim()}»
            </div>
          )}

          {!hasResults && loading && (
            <div className="px-4 py-6 text-center text-[13px] text-[#A6AAB2]">Buscando…</div>
          )}

          {results.songs.length > 0 && (
            <Section title="Canciones">
              {results.songs.map((song: SearchSongResult) => (
                <ResultItem
                  key={song._id}
                  icon={<Music className="h-4 w-4" />}
                  primary={song.trackTitle}
                  secondary={[song.artistName, song.isrc && `ISRC ${song.isrc}`]
                    .filter(Boolean)
                    .join(" · ")}
                  onClick={() => goTo(`/panel/song/${song._id}`)}
                />
              ))}
            </Section>
          )}

          {results.albums.length > 0 && (
            <Section title="Álbumes">
              {results.albums.map((album: SearchAlbumResult) => (
                <ResultItem
                  key={album._id}
                  icon={<Disc3 className="h-4 w-4" />}
                  primary={album.albumTitle}
                  secondary={[album.artistName, album.upc && `UPC ${album.upc}`]
                    .filter(Boolean)
                    .join(" · ")}
                  onClick={() =>
                    goTo(album.upc ? `/panel/album/upc/${album.upc}` : `/panel/album/${album._id}`)
                  }
                />
              ))}
            </Section>
          )}

          {results.collaborators.length > 0 && (
            <Section title="Colaboradores">
              {results.collaborators.map((collab: SearchCollaboratorResult) => (
                <ResultItem
                  key={collab._id}
                  icon={<Users className="h-4 w-4" />}
                  primary={collaboratorName(collab)}
                  secondary={collab.email}
                  onClick={() => goTo(`/panel/collaborators/${collab._id}`)}
                />
              ))}
            </Section>
          )}

          {results.labels.length > 0 && (
            <Section title="Sellos">
              {results.labels.map((label: SearchLabelResult) => (
                <ResultItem
                  key={`${label.type}-${label._id ?? label.name}`}
                  icon={<Tag className="h-4 w-4" />}
                  primary={label.name}
                  secondary={label.type === "custom" ? "Sello personalizado" : "Sello artístico"}
                  onClick={() =>
                    goTo(
                      label.type === "custom"
                        ? `/panel/labels/custom/${encodeURIComponent(label.name)}`
                        : `/panel/labels/${encodeURIComponent(label.name)}`,
                    )
                  }
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}
