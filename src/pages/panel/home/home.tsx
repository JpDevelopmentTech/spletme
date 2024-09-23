import { ApexOptions } from "apexcharts";
import "./home.css";
import ReactApexChart from "react-apexcharts";
import ingresoIcon from "../../../assets/images/Mesa de trabajo 23.svg";
import egresoIcon from "../../../assets/images/Mesa de trabajo 24.svg";
import monedaNaranjaIcon from "../../../assets/images/Mesa de trabajo 14.svg";
import checkIcon from "../../../assets/images/Mesa de trabajo 13.svg";
import StreamLogo from "../../../assets/images/Mesa de trabajo 20.svg";
import MoneyIcon from "../../../assets/images/Mesa de trabajo 18.svg";
import YoutubeIcon from "../../../assets/images/Mesa de trabajo 19.svg";

import { Link } from "react-router-dom";
import CardSong from "../../../components/cardsong/cardsong";
import { useEffect, useState } from "react";
import { SpotifyService } from "../../../services/spotify";
import Breadcrumb from "../../../components/breadcrumb/breadcrumb";

export default function Home() {
  const [topTracks, setTopTracks] = useState([]);
  useEffect(() => {
    
    const getTopTracks = async () => {
      const response = await SpotifyService.getTopTracks()
      setTopTracks(response.tracks)
    }

    getTopTracks()

    return () => {
      
    }
  }, [])
  
  

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
        <div className="col-span-10 flex gap-4 lg:flex-row flex-col">
          <select className="bg-[#E8E8E8] text-normal py-3 px-6 rounded-3xl text-black font-semibold  gap-2">
            <option value="">Concepto</option>
          </select>
          <select className="bg-[#E8E8E8]  text-normal py-3 px-6 rounded-3xl text-black font-semibold  gap-2">
            <option value="">Filtro por tiempo</option>
          </select>
          <select className="bg-[#E8E8E8] text-normal py-3 px-6 rounded-3xl text-black font-semibold  gap-2 ">
            <option value="">Formato</option>
          </select>
          <div className="flex justify-end gap-3">
            <button className="bg-black py-3  px-6 rounded-3xl flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                className="text-white"
              >
                <path
                  fill="currentColor"
                  d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363t.075-.337l-7.05-4.1q-.425.375-.95.588T6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.213t.95.587l7.05-4.1q-.05-.15-.075-.337T15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.212t-.95-.588L8.9 11.3q.05.15.075.338T9 12q0 .175-.025.363T8.9 12.7l7.05 4.1q.425-.375.95-.587T18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22Z"
                />
              </svg>
            </button>
            <button className="bg-black py-3  px-6 rounded-3xl flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                className="text-white"
              >
                <path
                  fill="currentColor"
                  d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5Zm-6 4q-.825 0-1.413-.588T4 18v-3h2v3h12v-3h2v3q0 .825-.588 1.413T18 20H6Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="col-span-2">
          <Breadcrumb />
        </div>
        <div
          className="duration-200 hover:scale-105 col-span-12 lg:col-span-6 shadow-lg rounded-2xl row-span-2  p-8 flex flex-col"
          id="chart"
        >
          <span className="text-title font-bold">Estadisticas</span>
          <span className=" text-septenary text-subtitle">
            Reporte de tu rendimiento general
          </span>
          <ReactApexChart
            options={options}
            type="area"
            height={200}
            series={series}
          />
          <div className="w-full flex justify-around p-3">
            <div className="bg-senary p-1  rounded-3xl text-septenary flex gap-2 items-center">
              <img src={StreamLogo} alt="" className="w-3 h-3" />
              <span className=" text-normal">325K Streams</span>
            </div>
            <div className="bg-senary p-1  rounded-3xl text-septenary flex gap-2 items-center">
              <img src={YoutubeIcon} alt="" className="w-3 h-3" />
              <span className=" text-normal">325K Streams</span>
            </div>
            <div className="bg-senary p-1  rounded-3xl text-septenary flex gap-2 items-center">
              <img src={MoneyIcon} alt="" className="w-3 h-3" />
              <span className=" text-normal">244,19</span>
            </div>
          </div>
        </div>
        <div className="col-span-12  lg:col-span-3 shadow-lg rounded-2xl  flex items-start p-8 justify-between duration-200 hover:scale-105">
          <div className="flex flex-col w-full h-full justify-between">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-bold text-title">Balance general</span>
                <span className="text-septenary text-subtitle">3 De junio</span>
              </div>
              <img src={monedaNaranjaIcon} alt="" className="w-10" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <img src={ingresoIcon} alt="" className="w-5" />
                <span className="font-bold text-subtitle">Ingresos</span>
                <span className="text-[#31bd3f] text-subtitle">$00,00</span>
              </div>
              <div className="flex gap-3">
                <img src={egresoIcon} alt="" className="w-5" />
                <span className="font-bold text-subtitle">Egresos</span>
                <span className="text-[#FB8500] text-subtitle">$00,00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 shadow-lg rounded-2xl items-center  lg:row-span-3 p-8 flex flex-col duration-200 hover:scale-105">
          <span className="text-left text-title font-bold">
            Mis plataformas
          </span>
          <span className="text-septenary text-subtitle">
            Comportamiento por plataforma
          </span>
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
              <span className="text-title font-bold">1250</span>
              <span className="text-septenary text-normal">
                Streams + Views
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 shadow-lg rounded-3xl p-8 flex flex-col justify-between items-start duration-200 hover:scale-105">
          <div className="flex justify-between w-full items-start">
            <div className="flex flex-col">
              <span className="font-bold text-title">En tu Ewallet</span>
            </div>
            <img src={checkIcon} alt="" className="w-10" />
          </div>

          <span className="text-septenary text-title font-bold">$00,00</span>
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col ">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold text-title">Top songs</span>
              <span className="text-septenary text-subtitle">
                Aqui tus mejores canciones
              </span>
            </div>
            <div>
              <Link to={"#"} className="font-bold text-subtitle">
                Ver todas
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
            <CardSong song={topTracks[0]}/>
            <CardSong song={topTracks[1]}/>
          </div>
        </div>
      </div>
    </>
  );
}
