import { useState } from "react";
import Button from "../../../../components/atoms/button";
import Title from "../../../../components/title/title";

const Highcost = () => {
  const [showData, setShowData] = useState(false);
  return (
    <div className="p-6 rounded-2xl shadow-lg h-full col-span-12">
      <div className="flex justify-between items-center">
      <Title title="Gastos extraordinarios" subtitle="" />
      <Button onClick={() => setShowData(!showData)} type="primary">
        {showData ? "Ocultar" : "Ver"} pagos
      </Button>
      </div>
      {showData && (
        <div className="flex h-full mt-12">
          <div className="overflow-x-auto col-span-12 w-full">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                    Concepto
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Hora
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 min-w-[14rem] text-center"
                  >
                    Pendiente por pagar
                  </th>
                </tr>
              </thead>
              <tbody>
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
                    <span className="">Video grabacion</span>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        $350,00
                      </Button>
                    </div>
                  </td>
                </tr>
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
                    <span className="">Video grabacion</span>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        $350,00
                      </Button>
                    </div>
                  </td>
                </tr>
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
                    <span className="">Video grabacion</span>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        $350,00
                      </Button>
                    </div>
                  </td>
                </tr>
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
                    <span className="">Video grabacion</span>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        $350,00
                      </Button>
                    </div>
                  </td>
                </tr>
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
                    <span className="">Video grabacion</span>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        $350,00
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
      )}
    </div>
  );
};

export default Highcost;
