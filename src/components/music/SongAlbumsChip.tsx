import { useEffect, useRef, useState } from "react";
import { Disc3, ChevronDown } from "lucide-react";
import { SongAlbumsBreakdown } from "./SongAlbumsBreakdown";
import { albumHref } from "@/utils/music.utils";
import type { SongAlbum } from "@/types/music.types";

interface SongAlbumsChipProps {
  albums: SongAlbum[];
  loading?: boolean;
  /** UPC guardado en la canción; sirve de enlace mientras no hay hechos con álbum. */
  fallbackUpc?: string | null;
}

/**
 * Dónde vive la canción, en la línea de identidad de la cabecera.
 *
 * El nombre de un álbum sólo es fiable cuando hay uno. En cuanto la canción sale
 * bajo varios UPC, enseñar el primero es mentir por omisión, así que el nombre
 * deja paso a un contador que se despliega.
 */
export function SongAlbumsChip({ albums, loading, fallbackUpc }: SongAlbumsChipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const identified = albums.filter((album) => Boolean(album.albumId));

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (loading && albums.length === 0) {
    return <span className="h-[26px] w-[104px] animate-pulse rounded-[13px] bg-[#F4F5F7]" />;
  }

  // Un solo álbum: se puede nombrar, así que se nombra.
  if (identified.length === 1) {
    const album = identified[0];
    return (
      <a
        href={albumHref(album.upc)}
        className="flex items-center gap-1.5 font-medium text-[#FF5C00] transition-colors hover:text-[#EA580C]"
      >
        <Disc3 className="h-3.5 w-3.5" />
        <span className="max-w-[220px] truncate">{album.albumTitle ?? "Ver álbum"}</span>
      </a>
    );
  }

  // Sin hechos atribuidos todavía: queda el UPC de la canción, si lo hay.
  if (identified.length === 0) {
    if (fallbackUpc) {
      return (
        <a
          href={albumHref(fallbackUpc)}
          className="flex items-center gap-1.5 font-medium text-[#FF5C00] transition-colors hover:text-[#EA580C]"
        >
          <Disc3 className="h-3.5 w-3.5" />
          Ver álbum
        </a>
      );
    }
    return <span className="text-[#A6AAB2]">Sin lanzamiento asignado</span>;
  }

  return (
    <span ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-[13px] bg-[#FFEADD] px-2.5 py-[5px] transition-colors hover:bg-[#FFD9C2]"
      >
        <Disc3 className="h-3 w-3 text-[#EA580C]" />
        <span className="text-[12.5px] font-semibold text-[#1C1D22]">
          En {identified.length} álbumes
        </span>
        <ChevronDown
          className={`h-[11px] w-[11px] text-[#EA580C] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Álbumes de esta canción"
          className="absolute left-0 top-[calc(100%+8px)] z-30 w-[340px] overflow-hidden rounded-[20px] border border-[#E8E8EC] bg-white shadow-[0_12px_32px_-6px_rgba(28,29,34,0.14)] sm:w-[380px]"
        >
          <div className="flex flex-col gap-[3px] px-4 py-3.5">
            <p className="text-[13.5px] font-semibold text-[#1C1D22]">
              Esta canción está en {identified.length} álbumes
            </p>
            <p className="text-[11px] text-[#71757E]">Ordenados por lo que aportan al total</p>
          </div>
          <div className="h-px bg-[#E8E8EC]" />

          <SongAlbumsBreakdown albums={albums} />
        </div>
      )}
    </span>
  );
}
