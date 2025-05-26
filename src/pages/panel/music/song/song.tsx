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
import Statistics from "./components/statistics";
import Platforms from "./components/platforms";
import Historyofsplits from "./components/historyofsplits";
import Extraordinarycosts from "./components/extraordinarycosts";

export default function Song() {
  const { id } = useParams();
  const items = [
    {
      label: "Inicio",
      url: "/panel",
    },
    {
      label: "Canción",
      url: `/panel/song/${id}`,
    },
  ];
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTrack = async () => {
      setIsLoading(true);
      try {
        const response = await SpotifyService.getTrack(id || "");
        setData(response);
      } catch (error) {
        console.error("Error fetching track:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTrack();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Title title="Canciones" subtitle="Fecha de vinculación" />
            <Breadcrumb items={items} />
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-t-4 border-quinary border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden col-span-6 row-span-1">
              <CardSong data={data} />
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden col-span-6 row-span-2">
              <Data data={data} />
            </div>
            <div className="bg-gradient-to-r from-quinary to-quinary/90 rounded-xl p-6 text-white overflow-hidden col-span-3 row-span-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Próxima liquidación estimada
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                    10 Julio 2024
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold">Pagar a todos</span>
                  <span className="text-2xl font-bold">$1.159,80</span>
                </div>
                <button className="w-full bg-white text-quinary font-bold py-3 rounded-lg transition-colors hover:bg-white/90">
                  Pagar $
                </button>
              </div>
            </div>
            <AddCollaborator />
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12">
              <Table />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12">
              <Behavior />
            </div>

            {/* Sidebar - 1/3 width */}

            {/* Collaborator card */}

            {/* Payment card with gradient */}

            {/* Statistics card */}
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-6">
              <Statistics />
            </div>

            {/* Platforms card */}
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-6">
              <Platforms />
            </div>

            {/* Specific data card */}
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12">
              <EspecificData />
            </div>

            {/* History of splits card */}
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12">
              <Historyofsplits />
            </div>

            {/* Extraordinary costs card */}
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12">
              <Extraordinarycosts />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
