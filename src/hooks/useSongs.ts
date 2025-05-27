import { useEffect, useState } from 'react';
import SongService from '../services/songs';

interface Release {
  reportMonth: string;
  salesMonth: string;
  platform: string;
  country: string;
  upc: string;
  catalogNumber: string;
  streamingSubscriptionType: string;
  releaseType: string;
  salesType: string;
  quantity: number;
  customerPaymentCurrency: string;
  unitPrice: number;
  mechanicalReproductionCosts: number;
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
}



const UseSongs = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);

    const getSongs = async () => {
        setLoading(true);
        try {
            const response = await SongService.getSongs();
            setSongs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

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
    }

    useEffect(() => {
        getSongs();
    }, []);
    return {
        songs,
        loading,
        getSongs,
        uploadSongs
    }
}

export default UseSongs;
