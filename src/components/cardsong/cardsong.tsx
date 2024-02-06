import ImageProfile from "../imageprofile/imageprofile";
import image from "../../assets/images/collaborator6.jpeg"
import { Link } from "react-router-dom";

export default function CardSong() {
  return (
    <Link to={'/panel/song/1'} className="shadow-lg p-2 flex gap-3 items-center rounded-2xl duration-200 hover:scale-105">
      <div className="w-44 h-44  bg-septenary rounded-lg">
        <img src={image} className="w-full h-full object-cover rounded-lg" alt="" />
      </div>
      <div className="flex flex-col">
        <span className="text-subtitle font-bold">Nombre de la cancion</span>
        <span className="text-normal">Artistas</span>

        <div className="flex pl-2 mt-2">
          <ImageProfile />
          <ImageProfile />
          <ImageProfile />
          <ImageProfile />
        </div>

        <div className="w-full justify-between flex items-center">
          <span className="font-bold text-subtitle">$00,00</span>
          <span className="p-3 border-l-2">0%</span>
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
