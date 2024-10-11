import { useState } from "react";
import Title from "../../../../components/title/title";
import Button from "../../../../components/atoms/button";

const Historyofpays = () => {
  const [viewSection, setViewSection] = useState(true);
  return (
    <div className="col-span-12 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between">
        <Title title="Historial de pagos" />
        <Button onClick={() => setViewSection(!viewSection)} type="primary">
          {viewSection ? "Ver menos" : "Ver más"}
        </Button>
      </div>
      <div className="flex gap-6 justify-between ">
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
                  Fecha
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Hora
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Concepto
                </th>
                <th scope="col" className="px-4 py-3 min-w-[14rem] text-center">
                  Valor
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
                  <span className="">1 Julio 2024</span>
                </th>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    12:35 pm
                  </span>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    Martha Paredes
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    $1.000
                  </span>
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
                  <span className="">1 Julio 2024</span>
                </th>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    12:35 pm
                  </span>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    Martha Paredes
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    $1.000
                  </span>
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
                  <span className="">1 Julio 2024</span>
                </th>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    12:35 pm
                  </span>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    Martha Paredes
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    $1.000
                  </span>
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
                  <span className="">1 Julio 2024</span>
                </th>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    12:35 pm
                  </span>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    Martha Paredes
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    $1.000
                  </span>
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
                  <span className="">1 Julio 2024</span>
                </th>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    12:35 pm
                  </span>
                </td>
                <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    Martha Paredes
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                    $1.003
                  </span>
                </td>
              </tr>
             
            </tbody>
          </table>
        </div>
        <div className="py-3 px-12 flex flex-col items-center border rounded-2xl justify-center">
          <span className="text-center">Descargar</span>
          <span className="text-center mt-6 text-sm">
            Has seleccionado 3 fechas
          </span>

          <span className="mt-12">Escoje el formato</span>
          <div className="flex justify-center gap-1 mt-2">
            <Button type="primary" onClick={() => {}}>
              PDF
            </Button>
            <Button type="primary" onClick={() => {}}>
              Excel
            </Button>
          </div>
          <div className="mt-6">
            <Button type="quinary" onClick={() => {}}>
              Descargar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historyofpays;
