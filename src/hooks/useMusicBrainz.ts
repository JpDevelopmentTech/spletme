import { useState } from 'react';
import MusicBrainzService from '../services/musicbrainz';

interface Recording {
  id: string;
  title: string;
  artist: string;
  release: string;
  coverArt?: string;
}

const useMusicBrainz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecordingByISRC = async (isrc: string): Promise<Recording | null> => {
    setLoading(true);
    setError(null);
    try {
      const recording = await MusicBrainzService.getRecordingByISRC(isrc);
      if (!recording) {
        setError("No se encontró la grabación");
        return null;
      }

      // Get the first recording from the response
      const firstRecording = recording.recordings?.[0];
      if (!firstRecording) {
        setError("No se encontró la grabación");
        return null;
      }

      // Get cover art if available
      let coverArt;
      if (firstRecording.id) {
        const coverArtData = await MusicBrainzService.getReleaseCoverArt(firstRecording.id);
        if (coverArtData?.images?.[0]) {
          coverArt = coverArtData.images[0].image;
        }
      }

      return {
        id: firstRecording.id,
        title: firstRecording.title,
        artist: firstRecording['artist-credit']?.[0]?.name || 'Unknown Artist',
        release: firstRecording.releases?.[0]?.title || 'Unknown Release',
        coverArt,
      };
    } catch (error) {
      setError("Error al buscar la grabación");
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getRecordingByISRC,
    loading,
    error,
  };
};

export default useMusicBrainz;
