import type { SongItem, AlbumItem } from "@/types/music.types";

/** Detecta si el item tiene un split asignado al owner */
export const hasOwnerSplit = (item: SongItem | AlbumItem): boolean => {
  const ownerSplit = item?.ownerId?.split;
  if (!ownerSplit) return false;
  if (Array.isArray(ownerSplit?.conditions)) return ownerSplit.conditions.length > 0;
  return true;
};

/** Detecta si el item (canción o álbum) tiene algún split configurado */
export const hasAnySplit = (item: SongItem | AlbumItem): boolean => {
  if (Boolean(item?.split) || hasOwnerSplit(item)) return true;
  if ("tracks" in item && Array.isArray(item.tracks)) {
    return item.tracks.some(
      (track) => Boolean(track?.split) || Boolean(track?.ownerId?.split)
    );
  }
  return false;
};

/** Determina si una query parece un código UPC (8-14 dígitos) */
export const looksLikeUPC = (q: string): boolean =>
  /^[0-9]{8,14}$/.test(q.replace(/\s|-/g, ""));

/** Determina si una query parece un código ISRC */
export const looksLikeISRC = (q: string): boolean =>
  /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/i.test(q.replace(/\s|-/g, "").toUpperCase());

/** Formatea duración en ms o segundos como MM:SS */
export const formatDuration = (rawDuration: unknown): string => {
  if (rawDuration === undefined || rawDuration === null || rawDuration === "") return "N/A";
  const durationNumber = Number(rawDuration);
  if (Number.isNaN(durationNumber)) return String(rawDuration);
  const totalSeconds = durationNumber > 10000
    ? Math.round(durationNumber / 1000)
    : Math.round(durationNumber);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/** Normaliza una fecha de release a string legible */
export const formatReleaseDate = (rawDate: unknown): string => {
  if (!rawDate) return "N/A";
  const parsedDate = new Date(String(rawDate));
  return Number.isNaN(parsedDate.getTime()) ? String(rawDate) : parsedDate.toLocaleDateString();
};

/** Cuenta colaboradores con split asignado */
export const countAssignedSplits = (song: SongItem): number => {
  const collaborators = song?.collaborators;
  if (Array.isArray(collaborators) && collaborators.length > 0) {
    return collaborators.filter((c) =>
      c?.split?.conditions?.some((cond) => {
        const val = Number(cond?.percentage ?? cond?.value);
        return Number.isFinite(val) && val > 0;
      })
    ).length;
  }
  const conditions = song?.split?.conditions;
  if (Array.isArray(conditions) && conditions.length > 0) {
    return conditions.filter((cond) => {
      const val = Number(cond?.percentage ?? cond?.value);
      return Number.isFinite(val) && val > 0;
    }).length;
  }
  return 0;
};

/** Cuenta total de splits (colaboradores o condiciones) */
export const countTotalSplits = (song: SongItem): number => {
  const collaboratorsCount = song?.collaborators?.length ?? 0;
  const conditionsCount = song?.split?.conditions?.length ?? 0;
  return Math.max(collaboratorsCount, conditionsCount);
};

/** Cuenta releases de la canción */
export const countReleases = (song: SongItem): number => {
  if (Array.isArray(song?.releases)) return song.releases.length;
  const count = Number(song?.releasesCount ?? song?.totalReleases);
  return Number.isFinite(count) ? count : 0;
};
