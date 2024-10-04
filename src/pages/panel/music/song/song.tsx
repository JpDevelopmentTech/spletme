/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Title from "../../../../components/title/title";
import AddCollaborator from "../../collaborators/components/addCollaborator";
import Behavior from "../../dealers/components/behavior";
import { CardSong, Data } from "./components";
import EspecificData from "./components/especificData";
import Table from "./components/table";
import { SpotifyService } from "../../../../services/spotify";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../../components/breadcrumb/breadcrumb";

export default function Song() {
  const { id } = useParams();
  const items = [
    {
      label: "Inicio",
      url: "/panel",
    },
    {
      label: "Cancion",
      url: "/panel/song" + id,
    }
  ];
  const [data, setData] = useState<any>();
  useEffect(() => {
    const getTrack = async () => {
      const response = await SpotifyService.getTrack(id || "");
      setData(response);
    };

    getTrack();

    return () => {};
  }, [id]);

  return (
    <div>
      <div className="flex justify-between mb-6">
        <Title title="Canciones" subtitle="Fecha de vinculacion" />
        <Breadcrumb items={items} />
      </div>
      <div className="grid grid-cols-12 gap-8">
        <CardSong data={data} />
        <Data data={data} />
        <AddCollaborator />
        <div className="flex col-span-4 gap-3 shadow-lg rounded-2xl items-center justify-around">
          <span className="font-bold">
            Proxima liquidación <br /> estimada
          </span>
          <span className="bg-quinary text-white p-3 rounded-full">
            10 Julio 2024
          </span>
        </div>
        <div className="flex col-span-5 gap-3 bg-quinary rounded-2xl items-center justify-around">
          <span className="text-subtitle text-white">Pagar a todos</span>
          <span className="text-white font-semibold text-title">$1.159,80</span>
          <button className="font-bold bg-white rounded-full px-5 py-2">
            Pagar $
          </button>
        </div>
        <Table />
        <Behavior />
        <EspecificData />
      </div>
    </div>
  );
}
