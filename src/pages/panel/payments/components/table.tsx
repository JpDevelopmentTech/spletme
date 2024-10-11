import { useState } from "react";
import Button from "../../../../components/atoms/button";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Link } from "react-router-dom";

const series = [
  {
    name: "Pendiente",
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  },
];

const options: ApexOptions = {
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },
};

const Table = () => {
  const [openDetails, setOpenDetails] = useState(false);
  return (
    <div className="overflow-x-auto col-span-12">
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
              Colaborador
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Generado total
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Porcentaje
            </th>
            <th scope="col" className="px-4 py-3 min-w-[14rem] text-center">
              Rol
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Metodo de pago
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Pendiente por pagar
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <td className="px-4 py-2 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <div className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <span className="ml-3">JK Escorcia</span>
              </div>
            </th>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                $1.000,00
              </span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                50%
              </span>
            </td>
            <td className="px-4 py-2 font-medium text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                Artista
              </span>
            </td>
            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                Believe
              </span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs">
              <div className="flex justify-center">
                <Button
                  onClick={() => setOpenDetails(!openDetails)}
                  type="quinary"
                >
                  <div className="flex items-center">
                    {!openDetails && ("$350,00")}
                    {openDetails ? (
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
                          d="m5 15 7-7 7 7"
                        />
                      </svg>
                    ) : (
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
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </Button>
              </div>
            </td>
          </tr>
          {openDetails && (
            <tr>
              <td colSpan={7} className=" p-3 ">
                <div className="w-full flex gap-6 shadow-lg rounded-b-2xl p-6">
                  <div className="w-2/3">
                    <ReactApexChart
                      series={series}
                      options={options}
                      type="bar"
                      height={250}
                    />
                  </div>
                  <div className="w-1/3">
                    <div className="flex flex-col gap-3 border-b w-full p-3">
                      <label className="text-sm">ID: 124SDFG32</label>
                      <label className="text-sm">Porcentaje: 50%</label>
                      <label className="text-sm">Pagado: $650,00</label>
                      <label className="text-sm">
                        Generado total: $1.000,00
                      </label>
                      <label className="text-sm">ID: 10 Julio 2023</label>
                    </div>
                    <div className="p-3 flex gap-3 items-center border-b">
                      <label htmlFor="">Colaboraciones:</label>
                      <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                        51
                      </span>
                      <Link
                        to={""}
                        type="button"
                        className="text-black  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Ver todas
                        <svg
                          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="p-3 flex flex-col gap-3">
                      <label htmlFor="">Pagado por</label>
                      <div className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 flex items-center gap-3">
                        <img
                          className="w-10 h-10 rounded-full"
                          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                          alt="Rounded avatar"
                        />
                        Believe
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
