import { useEffect, useState } from 'react';
import SongService from '../services/songs';
const UseSongs = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSongs = async () => {
        setLoading(true);
        const response = await SongService.getSongs();
        if(response === null){
            setSongs([]);
        }else{
            setSongs(response.data);
        }
        setLoading(false);
    }

    const uploadSongs = async (file: FormData) => {
        setLoading(true);
        try {
            const response = await SongService.uploadSongs(file);
            if (response) {
                setSongs(response);
            }
        } catch (error) {
            console.error("Error in uploadSongs:", error);
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
