import { useState, useCallback, useEffect } from 'react';
import LabelsService, { Label, LabelSong } from '../services/labels';

export const useLabels = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadLabels = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await LabelsService.getLabels();

      if (response.error) {
        setError(response.message || 'Error al cargar los labels');
        setLabels([]);
      } else {
        setLabels(response.data || []);
      }
    } catch (err) {
      console.error('Error loading labels:', err);
      setError('Error al conectar con el servidor');
      setLabels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLabels();
  }, [loadLabels]);

  return {
    labels,
    loading,
    error,
    loadLabels,
    refreshLabels: loadLabels, // Alias para refrescar
  };
};

export const useLabelSongs = (label: string) => {
  const [songs, setSongs] = useState<LabelSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadSongs = useCallback(async () => {
    if (!label) return;

    try {
      setLoading(true);
      setError('');

      const response = await LabelsService.getSongsByLabel(label);

      if (response.error) {
        setError(response.message || 'Error al cargar las canciones');
        setSongs([]);
      } else {
        setSongs(response.data || []);
      }
    } catch (err) {
      console.error('Error loading songs by label:', err);
      setError('Error al conectar con el servidor');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [label]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  return {
    songs,
    loading,
    error,
    loadSongs,
  };
};

