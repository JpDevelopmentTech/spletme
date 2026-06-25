import type { TopSong, TopArtist, TopLabel } from "../../../../types/analytics.types";

interface Props {
  topSongs: TopSong[];
  topArtists: TopArtist[];
  topLabels: TopLabel[];
  loading: boolean;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtStreams(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const RANK_COLORS = [
  "text-yellow-500",
  "text-gray-400",
  "text-amber-600",
  "text-[#9CA3AF]",
  "text-[#9CA3AF]",
];

function TopCard<T>({
  title,
  items,
  getLabel,
  getSub,
  getIncome,
  getStreams,
  loading,
}: {
  title: string;
  items: T[];
  getLabel: (i: T) => string;
  getSub: (i: T) => string;
  getIncome: (i: T) => number;
  getStreams: (i: T) => number;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-[#111827]">{title}</h2>
      {loading ? (
        <div className="flex h-[160px] items-center justify-center text-sm text-[#9CA3AF]">
          Cargando...
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-[160px] items-center justify-center text-sm text-[#9CA3AF]">
          Sin datos
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`w-5 flex-shrink-0 text-[13px] font-bold ${RANK_COLORS[i]}`}>
                #{i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#111827]">
                  {getLabel(item)}
                </p>
                <p className="truncate text-[11px] text-[#9CA3AF]">{getSub(item)}</p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
                <span className="text-[12px] font-bold text-green-500">{fmt(getIncome(item))}</span>
                <span className="text-[10px] text-[#9CA3AF]">
                  {fmtStreams(getStreams(item))} streams
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopChartsSection({ topSongs, topArtists, topLabels, loading }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <TopCard<TopSong>
        title="Top 5 Canciones"
        items={topSongs}
        getLabel={(s) => s.trackTitle}
        getSub={(s) => s.artistName}
        getIncome={(s) => s.netIncome}
        getStreams={(s) => s.streams}
        loading={loading}
      />
      <TopCard<TopArtist>
        title="Top 5 Artistas"
        items={topArtists}
        getLabel={(a) => a.artistName || "Desconocido"}
        getSub={(a) => `${a.songCount} canción${a.songCount !== 1 ? "es" : ""}`}
        getIncome={(a) => a.netIncome}
        getStreams={(a) => a.streams}
        loading={loading}
      />
      <TopCard<TopLabel>
        title="Top 5 Sellos"
        items={topLabels}
        getLabel={(l) => l.labelName || "Sin sello"}
        getSub={(l) => `${l.songCount} canción${l.songCount !== 1 ? "es" : ""}`}
        getIncome={(l) => l.netIncome}
        getStreams={(l) => l.streams}
        loading={loading}
      />
    </div>
  );
}
