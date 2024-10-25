/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Title from "../../../../../components/title/title";
import { SpotifyService } from "../../../../../services/spotify";
import { Link } from "react-router-dom";

const CardAlbum = ({ album }: { album: any }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getAlbum(album.id);
  }, [album]);

  const getAlbum = async (id: string) => {
    const response = await SpotifyService.getAlbum(id);
    console.log(response)
    setData(response);
    
  };
  return (
    <Link to={'/panel/album/' + data?.id} className="flex gap-6 items-center shadow-lg rounded-lg">
      <img src={data?.images[0].url} alt="" className="w-48 h-48 rounded-lg" />
      <div className="flex flex-col w-full">
        <Title title={data?.name} subtitle={
            data?.artists
                ?.map((item: any) => {
                return item.name;
                })
                .join(", ")
        } />
        <div className="flex -space-x-4 mt-3"></div>
        <span className="text-3xl font-semibold my-3">$2.000,00</span>
        
      </div>
    </Link>
  );
};

export default CardAlbum;
