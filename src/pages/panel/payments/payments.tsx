import { Link } from "react-router-dom";
import Title from "../../../components/title/title";
import Table from "./components/table";
import Highcost from "./components/highcost";
import Pay from "./components/pay";
import Accounts from "./components/accounts";

const Payments = () => {
  return (
    <div>
      <div>
        <Title title="Pagos" subtitle="Gestiona tus pagos" />
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="bg-[#91CCE8] rounded-2xl col-span-3 p-6 flex justify-between items-center hover:scale-110 duration-150">
            <div className="flex flex-col text-white ">
              <span className="text-2xl">Ajustes</span>
              <span className="text-xs">Ajusta tus cuentas</span>
              <button className="px-3 py-1 bg-white text-[#91CCE8] text-xs rounded-full mt-3">
                Ver
              </button>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-white w-16 h-16"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
            </svg>
          </div>
          <div className="shadow-lg col-span-6 p-6 rounded-2xl flex items-center justify-between hover:scale-110 duration-150">
            <div className="flex flex-col">
              <Title
                title="Total a pagar"
                subtitle="Unificado de todos los colaboradores"
              />
              <span className="text-4xl mt-3 text-[#FB8500]">$1.159,80</span>
            </div>
            <div>
              <button className="flex items-center gap-1 bg-[#FB8500] p-3 rounded-full text-white">
                Pagar a todos{" "}
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
          <Link
            to={""}
            className="col-span-3 rounded-2xl border border-[#F2F2F2] p-6 flex justify-center items-center hover:scale-110 duration-150"
          >
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
          </Link>
        </div>
      </div>
      <div>
        <Table />
        <Highcost />
        <div className="mt-6 flex gap-6">
          <Pay />
          <Accounts />
        </div>
      </div>
    </div>
  );
};

export default Payments;
