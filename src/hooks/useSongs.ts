import { useEffect, useRef, useState, useCallback } from "react";
import SongService from "../services/songs";
import type { SongsListParams, SongsListPagination } from "../services/songs";

// Refleja exactamente lo que el backend persiste en `releases[]`. Los campos
// del CSV que no se guardan (catalogNumber, streamingSubscriptionType,
// releaseType, customerPaymentCurrency, unitPrice, mechanicalReproductionCosts,
// clientIncomeRate) ya no llegan: ver `ignoredCsvColumns` en el backend.
// `upc` y `releaseTitle` viven en el nivel de la canción, no del release.
interface Release {
  reportMonth: string;
  salesMonth: string;
  platform: string;
  country: string;
  salesType: string;
  quantity: number;
  grossIncome: number;
  netIncome: number;
}

interface Song {
  _id: string;
  isrc: string;
  artistName: string;
  artisticLabel: string;
  releases: Release[];
  totalGrossIncome: number;
  totalNetIncome: number;
  totalStreams: number;
  trackTitle: string;
  spotifyData?: {
    album?: {
      images?: { url: string; width: number; height: number }[];
    };
  };
}

/**
 * Lee una página del catálogo desde el servidor.
 *
 * El hook no filtra ni ordena nada: `params` describe la página que se quiere y
 * el servidor devuelve exactamente esa, junto con cuántas canciones hay detrás.
 * Antes esto traía una página y la sección la recortaba y reordenaba en
 * memoria, con lo que el orden solo valía dentro de la página y el contador
 * decía cuántas filas se veían, no cuántas hay.
 *
 * `params` tiene que ser estable entre renders (memorízalo en quien llama): es
 * lo que decide cuándo se vuelve a pedir.
 */
const UseSongs = (params: SongsListParams) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [pagination, setPagination] = useState<SongsListPagination | null>(null);

  // Escribir la página que llega tarde encima de la que ya se está viendo deja
  // la tabla enseñando la anterior. Solo se acepta la respuesta de la última
  // petición lanzada.
  const requestId = useRef(0);

  const getSongs = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);

    try {
      const response = await SongService.getSongs(params);
      if (current !== requestId.current) return;

      const payload = response?.data;
      setSongs(Array.isArray(payload?.songs) ? (payload.songs as Song[]) : []);
      setPagination(payload?.pagination ?? null);
    } catch (error) {
      if (current !== requestId.current) return;
      console.error(error);
      setSongs([]);
      setPagination(null);
    } finally {
      if (current === requestId.current) {
        setLoading(false);
        setHasLoaded(true);
      }
    }
  }, [params]);

  const uploadSongs = async (file: FormData) => {
    setLoading(true);
    try {
      await SongService.uploadSongs(file);
      await getSongs();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSongs();
  }, [getSongs]);

  return {
    songs,
    loading,
    hasLoaded,
    pagination,
    getSongs,
    uploadSongs,
  };
};

export default UseSongs;
