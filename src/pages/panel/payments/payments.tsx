import { Link } from "react-router-dom";
import Title from "../../../components/title/title";
import Table from "./components/table";
import Highcost from "./components/highcost";
import Pay from "./components/pay";
import Accounts from "./components/accounts";
import Historyofpays from "./components/historyofpays";
import logoPay from "../../../assets/images/payoneer-dark-logo.svg";

const Payments = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <Title title="Pagos" subtitle="Gestiona tus pagos" />
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="bg-white shadow-lg rounded-2xl col-span-3 p-6  hover:scale-110 duration-150 relative">
   
              <span className="text-xl text-black">Metodo de pago principal</span>

            <img src={logoPay} className="w-40 mt-6" alt="" />
            <button className="px-3 py-1 absolute bg-[#91CCE8] text-white text-xs rounded-full bottom-3 right-3">
              Configurar
            </button>
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
              <span className="text-2xl ml-3">metodo de pago</span> 
            </div>
          </Link>
        </div>
      </div>
      <Table />
      <Highcost />

      <Pay />
      <Accounts />
      <Historyofpays />
    </div>
  );
};

export default Payments;
