import { ApexOptions } from "apexcharts";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";

const PlatformsCard = () => {
  const [chart, setChart] = useState<string>("radialBar");
  const series2 = [76, 67, 61, 90, 50, 30];

  const options2: ApexOptions = {
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

const options: ApexOptions =  {
    chart: {
        type: 'bar',
        height: 350
    },
    
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
        },
    },
    xaxis: {
        categories: ['Aug', 'Sep', 'Oct'],
        labels: {
            show: false // This property hides the names on the x-axis
        }
    },
    yaxis: {
        title: {
            text: '$ (thousands)'
        }
    },
    fill: {
        opacity: 1
    },
}

  const series = [{
    name: "Youtube",
    data: [10, 41, 35]
}, {
    name: 'Amazon Music',
    data: [20, 30, 25],
}, {
    name: 'Spotify',
    data: [30, 21, 15,]
}, {
    name: 'Apple Music',
    data: [40, 11, 5, ]
}, {
    name: 'Deezer',
    data: [50, 1, 2,]
}, {
    name: 'Otra',
    data: [60, 2, 3, ]
}]
  return (
    <div className="col-span-12 lg:col-span-3 shadow-lg rounded-2xl    lg:row-span-3 p-8 flex flex-col duration-200 hover:scale-105">
      <span className="text-semibold text-xl font-bold text-left">
        Plataformas
      </span>
      <span className="text-septenary text-sm">
        Comportamiento por plataforma
      </span>
      <div className="flex justify-center items-center flex-col gap-6 h-full">
        {chart === "bar" && (
          <ReactApexChart
            options={options}
            type="bar"
            series={series}
            height={350}
          />
        )}

        {chart === "pie" && (
          <ReactApexChart
            options={options2}
            type="pie"
            series={series2}
          />
        )}

        {chart === "radialBar" && (
          <ReactApexChart
            options={options2}
            type="radialBar"
            series={series2}
          />
        )}

        <div className="w-full p-3 flex justify-around bg-[#F3F3F3] rounded-full">
          <button
            onClick={() => setChart("bar")}
            className={
              chart === "bar"
                ? "bg-[#D1D1D1] py-3 px-6 rounded-3xl"
                : "py-3 px-6 rounded-3xl"
            }
          >
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
          <button
            className={
              chart === "radialBar"
                ? "bg-[#D1D1D1] py-3 px-6 rounded-3xl"
                : "py-3 px-6 rounded-3xl"
            }
            onClick={() => setChart("radialBar")}
          >
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
          <button
            className={
              chart === "pie"
                ? "bg-[#D1D1D1] py-3 px-6 rounded-3xl"
                : "py-3 px-6 rounded-3xl"
            }
            onClick={() => setChart("pie")}
          >
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
          <span className="text-septenary text-normal">Streams + Views</span>
        </div>
      </div>
    </div>
  );
};

export default PlatformsCard;
