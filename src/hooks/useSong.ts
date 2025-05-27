/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import songs from '../services/songs';

const UseSong = ({id}: {id: string}) => {
    const [song, setSong] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const getSong = async (id: string) => {
        setLoading(true);
        const response = await songs.getSong(id)
        setSong(response.data);
        setLoading(false);
    }

    useEffect(() => {
        getSong(id);
    }, [id]);
    return {
        song,
        getSong,
        loading
    }
}

export default UseSong;
