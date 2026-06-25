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
    console.log(response);
    setData(response);
  };
  return (
    <Link
      to={"/panel/album/" + data?.id}
      className="flex items-center gap-6 rounded-lg shadow-lg"
    >
      <img src={data?.images[0].url} alt="" className="h-48 w-48 rounded-lg" />
      <div className="flex w-full flex-col">
        <Title
          title={data?.name}
          subtitle={data?.artists
            ?.map((item: any) => {
              return item.name;
            })
            .join(", ")}
        />
        <div className="mt-3 flex -space-x-4"></div>
        <span className="my-3 text-3xl font-semibold">$2.000,00</span>
      </div>
    </Link>
  );
};

export default CardAlbum;
