import { useEffect, useState } from "react";
import songs from "../services/songs";

const UseFilterSongsData = () => {
    const [country, setCountry] = useState("");
    const [platform, setPlatform] = useState("");
    const [summary, setSummary] = useState({
        matchingReleases: 0,
        songsWithMatches: 0,
        totalNetIncome: 0,
        totalStreams: 0
    });
    const getDataSongs = async () => {
        const response = await songs.getSongsByFilter(country, platform);
        setSummary(response.data.summary);
    }

    useEffect(() => {
        getDataSongs();
    }, [country, platform]);
    return {
        getDataSongs,
        country,
        platform,
        setCountry,
        setPlatform,
        summary
    }
}

export default UseFilterSongsData;
