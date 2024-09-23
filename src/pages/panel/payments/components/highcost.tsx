import Title from "../../../../components/title/title";
import Table from "./table";

const Highcost = () => {
  return (
    <div className="p-12 rounded-2xl shadow-lg h-full">
      <Title title="Costos extraordinarios" subtitle="" />
      <div className="flex h-full">
        <Table />
        <div className="ml-12 flex flex-col h-full gap-3">
          <button className="col-span-3 w-72 rounded-2xl border border-[#F2F2F2] p-6 flex justify-center items-center hover:scale-110 duration-150">
            <div className="rounded-full w-12 h-12 bg-[#FB8500] flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-6 h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl ml-3">Agregar</span>
              <span className="text-md ml-3">Pago</span>
            </div>
          </button>
          <div className="w-full p-12 bg-[#FC8904] h-full rounded-2xl flex flex-col justify-center items-center text-white text-center">
            <span>Has seleccionado 3 pagos</span>
            <span className="mt-3">Total</span>
            <span className="mt-3 text-3xl">$1.159,80</span>
            <button className="rounded-full px-6 py-3 bg-white text-black flex items-center justify-center mt-6">
              Pagar{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-6 h-6"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2" />
                <path d="M12 3v3m0 12v3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Highcost;
