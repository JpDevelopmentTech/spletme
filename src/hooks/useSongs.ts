import { useEffect, useState, useCallback } from 'react';
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



const UseSongs = ( page :number, limit :number ) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const getSongs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await SongService.getSongs(page, limit);
            setSongs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    const searchSongs = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        
        setIsSearching(true);
        try {
            const response = await SongService.searchSongs(query, 1, limit);
            setSearchResults(response.data);
        } catch (error) {
            console.error(error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [limit]);

    const clearSearch = useCallback(() => {
        setSearchResults([]);
        setIsSearching(false);
    }, []);

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
    }, [page, limit]);
    
    return {
        songs,
        loading,
        getSongs,
        uploadSongs,
        searchSongs,
        searchResults,
        isSearching,
        clearSearch
    }
}

export default UseSongs;
