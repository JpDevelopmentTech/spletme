import { Music, Disc3 } from "lucide-react";
import type { MusicMode } from "@/types/music.types";

interface MusicModeSwitchProps {
  mode: MusicMode;
  onChange: (mode: MusicMode) => void;
  songsCount?: number;
  albumsCount?: number;
}

/**
 * Conmutador de agrupación.
 *
 * No navega a otra página: reagrupa el mismo catálogo. Por eso lleva el recuento
 * a cada lado —dice cuánto hay en la otra forma de mirarlo— y por eso la
 * búsqueda y los filtros sobreviven al cambio.
 */
export function MusicModeSwitch({
  mode,
  onChange,
  songsCount,
  albumsCount,
}: MusicModeSwitchProps) {
  const options: { value: MusicMode; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      value: "songs",
      label: "Por canción",
      icon: <Music className="h-[15px] w-[15px]" />,
      count: songsCount,
    },
    {
      value: "albums",
      label: "Por álbum",
      icon: <Disc3 className="h-[15px] w-[15px]" />,
      count: albumsCount,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Agrupación del catálogo"
      className="flex flex-shrink-0 items-center gap-[3px] rounded-[22px] bg-[#F4F5F7] p-[3px]"
    >
      {options.map((option) => {
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 rounded-[19px] px-3.5 py-2 transition-colors ${
              active
                ? "bg-white shadow-[0_2px_6px_rgba(16,17,20,0.08)]"
                : "hover:bg-white/50"
            }`}
          >
            <span className={active ? "text-[#FF5C00]" : "text-[#A6AAB2]"}>{option.icon}</span>
            <span
              className={`text-[12.5px] ${
                active ? "font-semibold text-[#1C1D22]" : "font-medium text-[#71757E]"
              }`}
            >
              {option.label}
            </span>
            {option.count !== undefined && option.count > 0 && (
              <span
                className={`rounded-[10px] px-[7px] py-[2px] font-mono text-[10px] font-semibold ${
                  active ? "bg-[#FFEADD] text-[#FF5C00]" : "bg-white text-[#A6AAB2]"
                }`}
              >
                {option.count.toLocaleString()}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
