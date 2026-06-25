import { X, ArrowRight, Music as MusicIcon } from "lucide-react";
import {
  formatDuration,
  formatReleaseDate,
  countAssignedSplits,
  countTotalSplits,
  countReleases,
} from "@/utils/music.utils";
import { CopyButton } from "@/components/ui/CopyButton";
import type { SongItem } from "@/types/music.types";

interface SongDetailsModalProps {
  song: SongItem;
  songDetails: SongItem | null;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onNavigate: (songId: string) => void;
}

/**
 * Modal de detalle rápido de una canción con ISRC, splits, streams y más.
 */
export function SongDetailsModal({
  song,
  songDetails,
  isLoading,
  error,
  onClose,
  onNavigate,
}: SongDetailsModalProps) {
  const source = songDetails ?? song;

  const getField = (...keys: (keyof SongItem)[]): string | number | undefined =>
    keys.map((k) => source?.[k]).find((v) => v !== undefined && v !== null && v !== "") as
      | string
      | number
      | undefined;

  const coverUrl =
    songDetails?.spotifyData?.album?.images?.[0]?.url ?? song?.spotifyData?.album?.images?.[0]?.url;

  const releaseDate = formatReleaseDate(
    getField("releaseDate", "release_date", "releasedAt", "release") ??
      source?.releases?.[0]?.releaseDate ??
      source?.releases?.[0]?.release_date ??
      source?.spotifyData?.album?.release_date,
  );

  const duration = formatDuration(
    getField("duration", "durationMs", "duration_ms") ?? source?.spotifyData?.duration_ms,
  );

  const assignedSplits = countAssignedSplits(source);
  const unassignedSplits = Math.max(countTotalSplits(source) - assignedSplits, 0);
  const releasesCount = countReleases(source);

  const upc = getField("upc", "ean") ?? source?.releases?.[0]?.upc ?? "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="text-base font-bold text-gray-900">Song Details</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={source?.trackTitle ?? "Song cover"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <MusicIcon size={24} className="text-gray-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-gray-900">
                {getField("trackTitle") ?? "Sin título"}
              </p>
              <p className="truncate text-sm text-gray-500">
                {getField("artistName") ?? "Artista desconocido"}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-sm text-gray-500">Loading details...</div>
          ) : (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">ISRC</p>
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-mono text-sm font-semibold text-gray-900">
                      {getField("isrc") ?? "N/A"}
                    </p>
                    {getField("isrc") && (
                      <CopyButton value={String(getField("isrc"))} title="Copiar ISRC" />
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">UPC / EAN</p>
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-mono text-sm font-semibold text-gray-900">
                      {String(upc)}
                    </p>
                    {upc && String(upc) !== "N/A" && (
                      <CopyButton value={String(upc)} title="Copiar UPC" />
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-green-700">
                    Splits asignados
                  </p>
                  <p className="text-lg font-bold text-green-700">{assignedSplits}</p>
                </div>
                <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-orange-700">
                    Splits no asignados
                  </p>
                  <p className="text-lg font-bold text-orange-700">{unassignedSplits}</p>
                </div>
              </div>

              <div className="pt-1">
                <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                  Información de la canción
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Release date", value: releaseDate },
                    { label: "Releases", value: releasesCount },
                    {
                      label: "Streams",
                      value: (Number(getField("totalStreams", "streams")) || 0).toLocaleString(),
                    },
                    {
                      label: "Ganancia",
                      value: `$${(Number(getField("totalNetIncome", "netIncome", "earning", "earnings")) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    },
                    {
                      label: "Sello",
                      value: String(getField("artisticLabel", "label") ?? "N/A"),
                    },
                    { label: "Duración", value: duration },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2"
                    >
                      <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                      <p className="text-sm font-semibold text-gray-900">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          )}

          <button
            onClick={() => onNavigate(song._id)}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Ver información completa
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
