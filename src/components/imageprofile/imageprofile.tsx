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

  return <img src={img} alt="" className="w-8 h-8 rounded-full -ml-3" />;
}
