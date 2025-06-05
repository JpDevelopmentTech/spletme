/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState } from "react";  
import { DollarSign } from "lucide-react";
import Title from "../../../../components/title/title";
import AddCollaborator from "../../collaborators/components/addCollaborator";
import Behavior from "../../dealers/components/behavior";
import EspecificData from "./components/especificData";
import Table from "./components/table";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../../components/breadcrumb/breadcrumb";
import Statistics from "./components/statistics";
import Platforms from "./components/platforms";
import Historyofsplits from "./components/historyofsplits";
import Extraordinarycosts from "./components/extraordinarycosts";
import useSong from "../../../../hooks/useSong";
import Loading from "../../../../components/loading/loading";
import ConfirmationModal from "../../../../components/confirmationModal/confirmationModal";

export default function Song() {
  const { id } = useParams();
  const { song, loading } = useSong({ id: id || "" });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  console.log("🚀 ~ Song ~ song:", song)
  
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

  const handlePayment = () => {
    // Aquí iría la lógica del pago
    setShowPaymentModal(false);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePayment}
        title="Confirmar pago"
        message="¿Estás seguro que deseas proceder con el pago? Esta acción no se puede deshacer."
        confirmText="Confirmar pago"
      />

      <div className="min-h-screen ">
        <div className="w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Title title="Canciones" subtitle="Fecha de vinculación" />
              <Breadcrumb items={items} />
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden col-span-9 row-span-1 border border-indigo-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{song?.trackTitle}</h2>
                      <p className="text-gray-600 mt-1">{song?.artistName}</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      ISRC: {song?.isrc}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Total Streams</p>
                      <p className="text-2xl font-bold text-gray-900">{song?.totalStreams?.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Net Income</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${song?.totalNetIncome?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden col-span-3 row-span-1 border border-indigo-100">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4">
                  <h3 className="text-lg font-semibold text-white">Próxima liquidación estimada</h3>
                  <p className="text-sm text-white/80">10 Julio 2024</p>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total a pagar</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      ${song?.totalNetIncome?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button 
                    className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-colors hover:bg-indigo-700 flex items-center justify-center"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <span className="mr-2">Pagar a todos</span>
                    <DollarSign className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
              <AddCollaborator />
                <Table />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <Behavior />
              </div>

              {/* Statistics card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-6 border border-indigo-100">
                <Statistics />
              </div>

              {/* Platforms card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-6 border border-indigo-100">
                <Platforms />
              </div>

              {/* Specific data card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <EspecificData />
              </div>

              {/* History of splits card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <Historyofsplits />
              </div>

              {/* Extraordinary costs card */}
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden col-span-12 border border-indigo-100">
                <Extraordinarycosts />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
