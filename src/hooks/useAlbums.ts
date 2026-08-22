import { useState, useEffect, useRef, useCallback } from "react";
import AlbumService from "../services/albums";
import type { Album, AlbumsPagination, AlbumsListParams } from "../models/album";

interface UseAlbumsReturn {
  albums: Album[];
  loading: boolean;
  /** Falso hasta que vuelve la primera respuesta: distingue «vacío» de «aún no sé». */
  hasLoaded: boolean;
  error: string | null;
  pagination: AlbumsPagination | null;
  getAlbumByUPC: (upc: string) => Promise<Album | null>;
  refreshAlbums: () => Promise<void>;
  clearError: () => void;
}

/**
 * Lee una página del catálogo de álbumes desde el servidor.
 *
 * El hook no filtra ni ordena nada: `params` describe la página que se quiere y
 * el servidor devuelve exactamente esa, junto con cuántos álbumes hay detrás.
 * Antes esto traía una página y la sección volvía a recortarla con `slice`
 * usando el desplazamiento global, así que a partir de la segunda página el
 * recorte caía fuera del array y la tabla salía vacía.
 *
 * `params` tiene que ser estable entre renders (memorízalo en quien llama): es
 * lo que decide cuándo se vuelve a pedir. Con `null` no se pide ningún listado:
 * es lo que usa el detalle de un álbum, que solo necesita `getAlbumByUPC`.
 */
export const useAlbums = (params: AlbumsListParams | null): UseAlbumsReturn => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<AlbumsPagination | null>(null);

  // Solo se acepta la respuesta de la última petición lanzada: escribir la
  // página que llega tarde encima de la actual deja la tabla en la anterior.
  const requestId = useRef(0);

  const getAlbums = useCallback(async () => {
    if (!params) return;

    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const response = await AlbumService.getAlbums(params);
      if (current !== requestId.current) return;

      if (response.success && "data" in response) {
        setAlbums(response.data);
        setPagination(response.pagination);
      } else if ("message" in response) {
        setAlbums([]);
        setPagination(null);
        setError(response.message);
      }
    } catch (err) {
      if (current !== requestId.current) return;
      setAlbums([]);
      setPagination(null);
      setError(err instanceof Error ? err.message : "Error loading albums");
    } finally {
      if (current === requestId.current) {
        setLoading(false);
        setHasLoaded(true);
      }
    }
  }, [params]);

  const getAlbumByUPC = useCallback(async (upc: string): Promise<Album | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await AlbumService.getAlbumByUPC(upc);

      if (response.success && "data" in response) return response.data;
      if ("message" in response) setError(response.message);

      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading album");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    getAlbums();
  }, [getAlbums]);

  return {
    albums,
    loading,
    hasLoaded,
    error,
    pagination,
    getAlbumByUPC,
    refreshAlbums: getAlbums,
    clearError,
  };
};

export default useAlbums;
