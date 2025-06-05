import { useEffect, useState } from "react";
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
    const getDataSongs = async () => {
        const response = await songs.getSongsByFilter(country, platform, startDate, endDate);
        setSummary(response.data.summary);
    }

    useEffect(() => {
        getDataSongs();
    }, [country, platform, startDate, endDate]);
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
