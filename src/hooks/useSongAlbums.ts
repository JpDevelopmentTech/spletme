import { useEffect, useState } from "react";
import SongService from "@/services/songs";
import type { SongAlbum } from "@/types/music.types";

/**
 * Álbumes en los que vive una canción.
 *
 * `count` sólo cuenta los identificados: la entrada sin `albumId` es histórico
 * del que no se sabe la procedencia, y sumarla diría que hay un álbum más de
 * los que se pueden nombrar.
 */
const useSongAlbums = (songId?: string) => {
  const [albums, setAlbums] = useState<SongAlbum[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!songId) {
      setAlbums([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    SongService.getSongAlbums(songId)
      .then((response) => {
        if (cancelled) return;
        setAlbums(Array.isArray(response?.data) ? response.data : []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [songId]);

  const identified = albums.filter((album) => Boolean(album.albumId));

  return { albums, identified, count: identified.length, loading };
};

export default useSongAlbums;
