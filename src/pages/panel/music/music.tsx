import CardSong from "../../../components/cardsong/cardsong";
import ImageProfile from "../../../components/imageprofile/imageprofile";
import image from "../../../assets/images/collaborator6.jpeg";
import { useEffect, useState } from "react";
import { SpotifyService } from "../../../services/spotify";
import Breadcrumb from "../../../components/breadcrumb/breadcrumb";

export default function Music() {
  const [topTracks, setTopTracks] = useState([]);
  useEffect(() => {
    const getTopTracks = async () => {
      const response = await SpotifyService.getTopTracks();
      console.log(response);
      setTopTracks(response.tracks);
    };

    getTopTracks();
    return () => {};
  }, []);
  return (
    <div className="animate-fade-left">
      <>
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-title font-bold">Top Songs</span>
              <span className="text-subtitle">Aqui tus mejores canciones</span>
            </div>
            <Breadcrumb />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CardSong song={topTracks[0]} />
            <CardSong song={topTracks[1]} />
            <CardSong song={topTracks[2]} />
          </div>

          <div className="flex justify-between mt-10 items-center gap-3">
            <span className="text-title font-bold">Catalogo</span>
            <div className="flex gap-6">
              <select name="" id="" className="font-bold text-subtitle">
                <option value="">Filtrar por fecha</option>
              </select>
              <button className="text-subtitle font-bold">Descargar</button>
            </div>
          </div>
          <table>
            <thead>
              <tr className="">
                <th className="text-left p-3 text-normal   bg-[#E9E9E9] ">
                  Cancion
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Porcentaje
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Colaboradores
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Propietario
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Distribuidor
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Fecha de lanzamiento
                </th>
                <th className="text-center p-3 text-normal   bg-[#E9E9E9] ">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 bg-septenary">
                      <img
                        src={image}
                        className="w-full h-full object-cover rounded-lg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">✅ | 🚫 | 🕓</td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 bg-septenary">
                      <img
                        src={image}
                        className="w-full h-full object-cover rounded-lg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">✅ | 🚫 | 🕓</td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 bg-septenary">
                      <img
                        src={image}
                        className="w-full h-full object-cover rounded-lg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">✅ | 🚫 | 🕓</td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 bg-septenary">
                      <img
                        src={image}
                        className="w-full h-full object-cover rounded-lg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">✅ | 🚫 | 🕓</td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 bg-septenary">
                      <img
                        src={image}
                        className="w-full h-full object-cover rounded-lg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">✅ | 🚫 | 🕓</td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 bg-septenary">
                      <img
                        src={image}
                        className="w-full h-full object-cover rounded-lg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">✅ | 🚫 | 🕓</td>
              </tr>
              <tr className="border-b-2">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 rounded-lg w-10 bg-septenary">
                      <img
                        src={image}
                        className="w-full h-full object-cover rounded-lg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-subtitle font-bold">
                        Nombre de la cancion
                      </span>
                      <span className="text-normal">Nombre de la cancion</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-subtitle text-center">0%</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center">
                    <ImageProfile />
                  </div>
                </td>
                <td className="p-3 text-center text-subtitle">
                  Junio 12, 2021
                </td>
                <td className="p-3 text-center text-subtitle">✅ | 🚫 | 🕓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
}
