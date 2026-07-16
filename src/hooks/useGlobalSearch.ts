import { useEffect, useRef, useState } from "react";
import SearchService, { EMPTY_SEARCH_RESULTS, type GlobalSearchResults } from "../services/search";
import useDebounce from "./useDebounce";

const MIN_QUERY_LENGTH = 2;

/**
 * Búsqueda global con debounce para el buscador del header.
 * Descarta respuestas obsoletas cuando el usuario sigue escribiendo.
 */
const useGlobalSearch = (query: string, delay = 300) => {
  const [results, setResults] = useState<GlobalSearchResults>(EMPTY_SEARCH_RESULTS);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query.trim(), delay);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults(EMPTY_SEARCH_RESULTS);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);

    SearchService.globalSearch(debouncedQuery).then((data) => {
      // Ignorar respuestas de consultas anteriores (stale)
      if (requestId !== requestIdRef.current) return;
      setResults(data);
      setLoading(false);
    });
  }, [debouncedQuery]);

  const hasResults =
    results.songs.length > 0 ||
    results.albums.length > 0 ||
    results.collaborators.length > 0 ||
    results.labels.length > 0;

  return {
    results,
    loading: loading || (query.trim().length >= MIN_QUERY_LENGTH && query.trim() !== debouncedQuery),
    hasResults,
    isActive: query.trim().length >= MIN_QUERY_LENGTH,
  };
};

export default useGlobalSearch;
