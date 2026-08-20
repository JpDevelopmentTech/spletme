import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import { formatStreams, formatCurrency } from "@/utils/format.utils";
import type { DistributorDashboard } from "@/types/distributor.types";

type TopSong = DistributorDashboard["topSongs"][number];

interface DistributorTopSongsProps {
  songs: TopSong[];
}

/**
 * Las canciones que más aportan de este distribuidor. La barra bajo cada una
 * compara contra la primera, que es lo que permite ver si el catálogo se
 * sostiene en un solo título o reparte.
 */
export function DistributorTopSongs({ songs }: DistributorTopSongsProps) {
  const max = Math.max(1, ...songs.map((song) => song.totalNetIncome ?? 0));

  return (
    <div className="flex flex-col gap-3.5 rounded-[26px] border border-[#E8E8EC] bg-white p-6 shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
      <h2 className="font-display text-base font-semibold text-[#1C1D22]">Top canciones</h2>

      {songs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
            <Music className="h-[22px] w-[22px] text-[#71757E]" />
          </span>
          <span className="text-[12.5px] text-[#A6AAB2]">Sin canciones cargadas</span>
        </div>
      ) : (
        <ol className="flex flex-col gap-3.5">
          {songs.map((song, index) => (
            <li key={song._id} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold ${
                    index === 0 ? "bg-[#FF5C00] text-white" : "bg-[#F4F5F7] text-[#71757E]"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <Link
                    to={`/panel/song/${song._id}`}
                    title={song.trackTitle}
                    className="truncate text-[12.5px] font-semibold text-[#1C1D22] transition-colors hover:text-[#FF5C00]"
                  >
                    {song.trackTitle}
                  </Link>
                  <span className="truncate text-[10.5px] text-[#A6AAB2]">{song.artistName}</span>
                </div>
                <div className="flex flex-shrink-0 flex-col items-end gap-px">
                  <span className="font-mono text-[11.5px] font-semibold text-[#2FB37E]">
                    {formatCurrency(song.totalNetIncome ?? 0)}
                  </span>
                  <span className="font-mono text-[9.5px] text-[#A6AAB2]">
                    {formatStreams(song.totalStreams ?? 0)} str.
                  </span>
                </div>
              </div>
              <span className="ml-8 h-1 overflow-hidden rounded-full bg-[#F4F5F7]">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.max(3, ((song.totalNetIncome ?? 0) / max) * 100)}%`,
                    backgroundColor: index === 0 ? "#FF5C00" : "#A6AAB2",
                  }}
                />
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
