/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageProfile from "../imageprofile/imageprofile";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SpotifyService } from "../../services/spotify";


export default function CardSong({ song }: { song: any }) {
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!song) return;
    const getTrack = async () => {
      const response = await SpotifyService.getTrack(song?.id);
      setData(response);
      console.log(response.images[0].url);
      console.log(response);
    };

    getTrack();

    return () => {};
  }, [song]);

  return (
    <Link
      to={"/panel/song/" + song?.id}
      className="shadow-lg p-2 flex gap-3 items-center rounded-2xl duration-200 hover:scale-105 w-full"
    >
        <img
        src={data?.album.images[0].url}
          className="w-44 h-44 object-cover rounded-lg"
          alt=""
        />
      <div className="flex flex-col justify-between w-1/2 h-full">
        <span className="text-subtitle font-bold overflow-hidden whitespace-nowrap overflow-ellipsis w-full">{data?.name}</span>
        <span className="text-normal overflow-hidden whitespace-nowrap overflow-ellipsis w-full">
          {data?.artists.map((artist: any) => artist.name).join(", ")}
        </span>

        <div className="flex -space-x-4 rtl:space-x-reverse">
          {data?.artists.map((artist: any) => (
            <ImageProfile key={artist.id} id={artist.id} />
          ))}
        </div>

        <div className="w-full justify-between flex items-center">
          <span className="font-bold text-subtitle">$00,00</span>
          <span className="p-3 ">0%</span>
        </div>

        <div className="flex">
          <div className="text-normal bg-senary p-1 rounded-full">
            325K Streams
          </div>
        </div>
      </div>
    </Link>
  );
}
