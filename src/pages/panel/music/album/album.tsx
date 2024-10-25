/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SpotifyService } from "../../../../services/spotify";
import EspecificData from "../song/components/especificData";
import Extraordinarycosts from "../song/components/extraordinarycosts";

const Album = () => {
  const params = useParams();
  const [album, setAlbum] = useState<any>(null);

  useEffect(() => {
    getAlbum();
  }, []);

  const getAlbum = async () => {
    const response = await SpotifyService.getAlbum(params.id || "");
    console.log("ALBUM => ", response);
    setAlbum(response);
  };

  return (
    <>
      {album && (
        <div className="flex flex-col gap-12">
          <div className="flex gap-6">
            <img
              src={album.images[0].url}
              className="rounded-xl w-96 object-cover"
              alt=""
            />
            <div>
              <h1 className="text-3xl font-semibold my-3">{album.name}</h1>
              <p className="text-lg font-light">
                {album.artists.map((item: any) => item.name).join(", ")}
              </p>
              <p className="text-lg font-light">
                {album.total_tracks} Canciones
              </p>
            </div>
          </div>
          <h3 className="font-bold text-xl mt-12">Canciones</h3>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-all" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  Nombre
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Tipo
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Duracion
                </th>
                <th scope="col" className="px-4 py-3 min-w-[14rem] text-center">
                  Artistas
                </th>
              </tr>
            </thead>
            <tbody>
              {album.tracks.items.map((item: any) => (
                <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 w-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        onClick={() => null}
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      ></input>
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex items-center overflow-x-hidden max-w-96">
                      
                      <span className="ml-3">{item.name}</span>
                    </div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                        {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                        { (item.duration_ms / 60000).toFixed(2).replace('.', ':') } min
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <div className="flex flex-wrap space-x-4 w-full justify-center">
                        {item.artists.map((artist: any) => (
                            <span className="font-light">{artist.name}</span>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Extraordinarycosts />
          <EspecificData />
        </div>
      )}
    </>
  );
};

export default Album;
