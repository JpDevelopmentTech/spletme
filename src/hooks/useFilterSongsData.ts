import { useCallback, useEffect, useState } from "react";
import songs from "../services/songs";

const UseFilterSongsData = () => {
    const [country, setCountry] = useState("");
    const [platform, setPlatform] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState({
        matchingReleases: 0,
        songsWithMatches: 0,
        totalNetIncome: 0,
        totalStreams: 0
    });
    const getDataSongs = useCallback(async () => {
        const response = await songs.getSongsByFilter(country, platform, startDate, endDate);
        setSummary(response.data.summary);
    }, [country, platform, startDate, endDate]);

    useEffect(() => {
        getDataSongs();
    }, [getDataSongs]);
    return {
        getDataSongs,
        country,
        platform,
        startDate,
        endDate,
        setCountry,
        setPlatform,
        setStartDate,
        setEndDate,
        summary
    }
}

export default UseFilterSongsData;
