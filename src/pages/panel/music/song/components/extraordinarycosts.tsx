import { useState } from "react";
import Button from "../../../../../components/atoms/button";
import Title from "../../../../../components/title/title";

const Extraordinarycosts = () => {
  const [viewData, setViewData] = useState(true);
  return (
    <div className="col-span-12 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center w-full">
        <Title title="Costos extraordinarios" />
        <Button onClick={() => setViewData(!viewData)} type="primary">
          {viewData ? "Ver menos" : "Ver mas"}
        </Button>
      </div>
      {viewData && (
        <div className="flex gap-12 mt-3">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                  <th scope="col" className="px-4 py-3 text-center">
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
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                    <div className="flex items-center gap-2">
                      Video grabacion
                    </div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        350,00 Pagar
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
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                    <div className="flex items-center gap-2">
                      Video grabacion
                    </div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        350,00 Pagar
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
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                    <div className="flex items-center gap-2">
                      Video grabacion
                    </div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        350,00 Pagar
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
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                    <div className="flex items-center gap-2">
                      Video grabacion
                    </div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      1 Julio 2023
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      12:35 pm
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <div>
                      <Button onClick={() => {}} type="quinary">
                        350,00 Pagar
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center border px-12 py-6 rounded-2xl">
              <Button onClick={() => {}} type="quinary">
                <svg
                  className="w-6 h-6 text-white dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 12h14m-7 7V5"
                  />
                </svg>
              </Button>
              <span className="text-sm text-septenary">
                Agregar <br /> Costo
              </span>
            </div>
            <div className="bg-quinary rounded-2xl p-3 flex items-center flex-col gap-3">
              <span className="text-white text-center">
                Has seleccionado 3 pagos
              </span>
              <span className="text-white">Total</span>
              <span className="text-white text-2xl font-semibold">
                $1.159,80
              </span>
              <Button onClick={() => {}} type="quaternary">
                <div className="flex items-center">
                  Pagar{" "}
                  <svg
                    className="w-6 h-6 text-white dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
                    />
                  </svg>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Extraordinarycosts;
