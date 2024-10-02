import { ApexOptions } from "apexcharts";
import "./home.css";
import ReactApexChart from "react-apexcharts";
import ingresoIcon from "../../../assets/images/Mesa de trabajo 23.svg";
import egresoIcon from "../../../assets/images/Mesa de trabajo 24.svg";
import monedaNaranjaIcon from "../../../assets/images/Mesa de trabajo 14.svg";

import { Link } from "react-router-dom";
import CardSong from "../../../components/cardsong/cardsong";
import { useEffect, useState } from "react";
import { SpotifyService } from "../../../services/spotify";
import Breadcrumb from "../../../components/breadcrumb/breadcrumb";

export default function Home() {
  const [topTracks, setTopTracks] = useState([]);
  useEffect(() => {
    const getTopTracks = async () => {
      const response = await SpotifyService.getTopTracks();
      setTopTracks(response.tracks);
    };

    getTopTracks();

    return () => {};
  }, []);

  const series = [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];

  const options: ApexOptions = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  const series2 = [76, 67, 61, 90, 50, 30];

  const options2: ApexOptions = {
    chart: {
      height: 50,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    colors: ["#CF5650", "#94C8E5", "#89D062", "#000000", "#E55FFE", "#666666"],
    labels: [
      "Youtube",
      "Amazon Music",
      "Spotify",
      "Apple Music",
      "Deezer",
      "Otra",
    ],
    legend: {
      show: false,
      floating: true,
      fontSize: "16px",
      position: "left",
      offsetX: 160,
      offsetY: 15,
      labels: {
        useSeriesColors: true,
      },
      formatter: function (seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        vertical: 3,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <>
      <div className="w-full  grid grid-cols-12 gap-6 animate-fade-left">
        <div className="col-span-10 flex gap-4 lg:flex-row flex-col items-center">
          <div>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Concept</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>
          </div>
          <div>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Filtro por tiempo</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>
          </div>
          <div>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Formato</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>
          </div>
          <button
            type="button"
            className="text-white bg-black hover:bg-black/80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-6 h-6 text-white dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.5 3a3.5 3.5 0 0 0-3.456 4.06L8.143 9.704a3.5 3.5 0 1 0-.01 4.6l5.91 2.65a3.5 3.5 0 1 0 .863-1.805l-5.94-2.662a3.53 3.53 0 0 0 .002-.961l5.948-2.667A3.5 3.5 0 1 0 17.5 3Z" />
            </svg>

            <span className="sr-only">Icon description</span>
          </button>
          <button
            type="button"
            className="text-white bg-black hover:bg-black/80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
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
                d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
              />
            </svg>

            <span className="sr-only">Icon description</span>
          </button>
        </div>
        <div className="col-span-2">
          <Breadcrumb />
        </div>
        <div
          className="duration-200 hover:scale-105 col-span-12 lg:col-span-6 shadow-lg rounded-2xl row-span-2  p-8 flex flex-col"
          id="chart"
        >
          <span className="font-semibold text-xl">Estadisticas</span>
          <span className=" text-septenary text-sm">
            Reporte de tu rendimiento general
          </span>
          <ReactApexChart
            options={options}
            type="area"
            height={200}
            series={series}
          />
          <div className="w-full flex justify-around p-3">
            <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full me-2 dark:bg-gray-700 dark:text-gray-400 border  ">
              <svg
                className="w-3 h-3 me-1.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15 6.037c0-1.724-1.978-2.665-3.28-1.562L7.638 7.933H6c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z" />
                <path
                  fill-rule="evenodd"
                  d="M16.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 20 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 18 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z"
                  clip-rule="evenodd"
                />
              </svg>
              325k Streams
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full me-2 dark:bg-gray-700 dark:text-gray-400 border  ">
              <svg
                className="w-3 h-3 me-1.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
                  clip-rule="evenodd"
                />
              </svg>
              325K streams
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full me-2 dark:bg-gray-700 dark:text-gray-400 border  ">
              <svg
                className="w-3 h-3 me-1.5"
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
              244,19
            </span>
          </div>
        </div>
        <div className="col-span-12  lg:col-span-3 shadow-lg row-span-2 rounded-2xl  flex items-start p-8 justify-between duration-200 hover:scale-105">
          <div className="flex flex-col w-full h-full justify-start gap-12">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-semibold text-xl">Balance general</span>
                <span className="text-septenary ">3 De junio</span>
              </div>
              <img src={monedaNaranjaIcon} alt="" className="w-10" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <img src={ingresoIcon} alt="" className="w-5" />
                <span className="font-bold ">Ingresos</span>
                <span className="text-[#31bd3f] ">$00,00</span>
              </div>
              <div className="flex gap-3">
                <img src={egresoIcon} alt="" className="w-5" />
                <span className="font-bold ">Egresos</span>
                <span className="text-[#FB8500] ">$00,00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 shadow-lg rounded-2xl items-center  lg:row-span-3 p-8 flex flex-col duration-200 hover:scale-105">
          <span className="text-semibold text-xl font-bold">
            Mis plataformas
          </span>
          <span className="text-septenary ">Comportamiento por plataforma</span>
          <div className="flex justify-center items-center flex-col gap-6 h-full">
            <ReactApexChart
              options={options2}
              type="radialBar"
              series={series2}
            />
            <div className="w-full p-3 flex justify-around bg-[#F3F3F3] rounded-3xl">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M16 20v-7h4v7h-4Zm-6 0V4h4v16h-4Zm-6 0V9h4v11H4Z"
                  />
                </svg>
              </button>
              <button className="bg-[#D1D1D1] py-3 px-6 rounded-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M16 30A14.016 14.016 0 0 1 2 16h2A12 12 0 1 0 16 4V2a14 14 0 0 1 0 28Z"
                  />
                  <path
                    fill="currentColor"
                    d="M16 26A10.011 10.011 0 0 1 6 16h2a8 8 0 1 0 8-8V6a10 10 0 0 1 0 20Z"
                  />
                  <path
                    fill="currentColor"
                    d="M16 22a6.007 6.007 0 0 1-6-6h2a4 4 0 1 0 4-4v-2a6 6 0 0 1 0 12Z"
                  />
                </svg>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    fill="currentColor"
                    d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-616-64h536c4.4 0 8-3.6 8-8V284c0-7.2-8.7-10.7-13.7-5.7L592 488.6l-125.4-124a8.03 8.03 0 0 0-11.3 0l-189 189.6a7.87 7.87 0 0 0-2.3 5.6V720c0 4.4 3.6 8 8 8z"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2  gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-[#CF5650] w-3 h-3 rounded-full"></div>
                <span className="text-normal">Youtube</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#94C8E5] w-3 h-3 rounded-full"></div>
                <span className="text-normal">Amazon Music</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#89D062] w-3 h-3 rounded-full"></div>
                <span className="text-normal">Spotify</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#000000] w-3 h-3 rounded-full"></div>
                <span className="text-normal">Apple Music</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#E55FFE] w-3 h-3 rounded-full"></div>
                <span className="text-normal">Deezer</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#666666] w-3 h-3 rounded-full"></div>
                <span className="text-normal">Otra</span>
              </div>
            </div>

            <div>
              <Link
                to={"#"}
                className="bg-quinary py-2 px-6 text-white rounded-2xl text-normal"
              >
                Editar plataformas
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <span className="semibold text-xl font-bold">1250</span>
              <span className="text-septenary text-normal">
                Streams + Views
              </span>
            </div>
          </div>
        </div>
        {/* <div className="col-span-12 lg:col-span-3 shadow-lg rounded-3xl p-8 flex flex-col justify-between items-start duration-200 hover:scale-105">
          <div className="flex justify-between w-full items-start">
            <div className="flex flex-col">
              <span className="font-semibold text-xl">En tu Ewallet</span>
            </div>
            <img src={checkIcon} alt="" className="w-10" />
          </div>

          <span className="text-septesemibold text-xl font-bold">$00,00</span>
        </div> */}

        <div className="col-span-12 lg:col-span-9 flex flex-col ">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-semibold text-xl">Top songs</span>
              <span className="text-septenary ">
                Aqui tus mejores canciones
              </span>
            </div>
            <div>
              <Link to={"#"} className="font-bold ">
                Ver todas
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
            <CardSong song={topTracks[0]} />
            <CardSong song={topTracks[1]} />
          </div>
        </div>
      </div>
    </>
  );
}
