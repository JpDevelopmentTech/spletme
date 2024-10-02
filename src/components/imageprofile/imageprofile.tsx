import { useEffect, useState } from "react";
import { SpotifyService } from "../../services/spotify";

export default function ImageProfile({ id }: { id?: string }) {
  const [img, setImg] = useState<string>("");
  useEffect(() => {
    const getArtist = async () => {
      const response = await SpotifyService.getArtist(id || "");
      setImg(response.images[0].url);
    };
    getArtist();
  }, [id]);

  return <img className="w-10 h-10 rounded-full" src={img} alt="Rounded avatar"></img>;
}
