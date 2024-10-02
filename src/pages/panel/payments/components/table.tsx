import { ApexOptions } from "apexcharts";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
const series = [
  {
    name: "Distribuidora 2",
    data: [
      {
        x: "Ene",
        y: 1000000,
      },
      {
        x: "Feb",
        y: 1200000,
      },
      {
        x: "Mar",
        y: 900000,
      },
      {
        x: "Abr",
        y: 1400000,
      },
      {
        x: "May",
        y: 1300000,
      },
      {
        x: "Jun",
        y: 1200000,
      },
      {
        x: "Jul",
        y: 1000000,
      },
      {
        x: "Ago",
        y: 1200000,
      },
      {
        x: "Sep",
        y: 900000,
      },
      {
        x: "Oct",
        y: 1400000,
      },
      {
        x: "Nov",
        y: 1300000,
      },
      {
        x: "Dic",
        y: 1200000,
      },
    ],
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
      columnWidth: "50%",
      borderRadius: 15,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 1,
    colors: ["transparent"],
  },
  xaxis: {
    categories: [
      "Ene",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
    },
  },
  fill: {
    opacity: 1,
  },
};

const Table = () => {
  const [openHiddenComponet, setOpenHiddenComponet] = useState(false);
  return (
    <table className="w-full mt-12">
      <thead>
        <tr>
          <th>
            <button className="border px-6 py-1 rounded-full">Nombre</button>
          </th>
          <th>
            <button className="border px-6 py-1 rounded-full">
              Generado total
            </button>
          </th>
          <th>
            <button className="border px-6 py-1 rounded-full">
              Porcentaje
            </button>
          </th>
          <th>
            <button className="border px-6 py-1 rounded-full">Rol</button>
          </th>
          <th>
            <button className="border px-6 py-1 rounded-full">
              Metodo de pago
            </button>
          </th>
          <th>
            <button className="border px-6 py-1 rounded-full">
              Pendiente por pagar
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="shadow-lg rounded-full mt-3">
          <td className="p-3 border-r ">
            <div className="flex items-center gap-3">
              <img
                src="https://placehold.co/400x400"
                alt=""
                className="rounded-full w-14 h-14"
              />
              <span className="text-2xl">Juan Perez</span>
            </div>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">$1.000,00</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">50%</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Artista</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Believe</span>
          </td>
          <td className="p-3  text-center ">
            <button
              className="bg-[#219EBC] px-6 py-2 rounded-full text-white flex items-center justify-center gap-2 w-full"
              onClick={() => setOpenHiddenComponet(!openHiddenComponet)}
            >
              $350,00
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
                className=""
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </button>
          </td>
        </tr>
        {openHiddenComponet && (
          <div className="animate-fade-up p-3 w-full shadow-lg rounded-b-2xl ">
            <div className="w-[600px]">
              <div className="flex gap-3 items-center">
                <span>Seleccionar periodo</span>
                <select name="" id="" className="bg-gray-200 p-3 rounded-full">
                  <option value="">2023</option>
                  <option value="">2022</option>
                  <option value="">2021</option>
                </select>
              </div>
              <ReactApexChart
                series={series}
                type="bar"
                options={options}
                height={350}
              />
            </div>
          </div>
        )}
        <tr className="shadow-lg rounded-full mt-3">
          <td className="p-3 border-r ">
            <div className="flex items-center gap-3">
              <img
                src="https://placehold.co/400x400"
                alt=""
                className="rounded-full w-14 h-14"
              />
              <span className="text-2xl">Juan Perez</span>
            </div>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">$1.000,00</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">50%</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Artista</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Believe</span>
          </td>
          <td className="p-3  text-center ">
            <button className="bg-[#219EBC] px-6 py-2 rounded-full text-white flex items-center justify-center gap-2 w-full">
              $350,00
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
                className=""
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </button>
          </td>
        </tr>
        <tr className="shadow-lg rounded-full mt-3">
          <td className="p-3 border-r ">
            <div className="flex items-center gap-3">
              <img
                src="https://placehold.co/400x400"
                alt=""
                className="rounded-full w-14 h-14"
              />
              <span className="text-2xl">Juan Perez</span>
            </div>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">$1.000,00</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">50%</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Artista</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Believe</span>
          </td>
          <td className="p-3  text-center ">
            <button className="bg-[#219EBC] px-6 py-2 rounded-full text-white flex items-center justify-center gap-2 w-full">
              $350,00
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
                className=""
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </button>
          </td>
        </tr>
        <tr className="shadow-lg rounded-full mt-3">
          <td className="p-3 border-r ">
            <div className="flex items-center gap-3">
              <img
                src="https://placehold.co/400x400"
                alt=""
                className="rounded-full w-14 h-14"
              />
              <span className="text-2xl">Juan Perez</span>
            </div>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">$1.000,00</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">50%</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Artista</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Believe</span>
          </td>
          <td className="p-3  text-center ">
            <button className="bg-[#219EBC] px-6 py-2 rounded-full text-white flex items-center justify-center gap-2 w-full">
              $350,00
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
                className=""
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </button>
          </td>
        </tr>
        <tr className="shadow-lg rounded-full mt-3">
          <td className="p-3 border-r ">
            <div className="flex items-center gap-3">
              <img
                src="https://placehold.co/400x400"
                alt=""
                className="rounded-full w-14 h-14"
              />
              <span className="text-2xl">Juan Perez</span>
            </div>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">$1.000,00</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">50%</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Artista</span>
          </td>
          <td className="p-3 border-r text-center">
            <span className="text-2xl text-center">Believe</span>
          </td>
          <td className="p-3  text-center ">
            <button className="bg-[#219EBC] px-6 py-2 rounded-full text-white flex items-center justify-center gap-2 w-full">
              $350,00
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
                className=""
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 9l6 6l6 -6" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;
