import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

const Platforms = () => {
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
    <div className="col-span-6 p-6 border rounded-2xl">
      <div className="flex flex-col">
        <span className="font-semibold text-xl">Mis plataformas</span>
        <span className="text-sm">Comportamiento por plataforma</span>
      </div>
      <div className="flex mt-6 items-center gap-6">
        <div className="w-1/2">
          <ReactApexChart
            options={options2}
            type="radialBar"
            series={series2}
          />
          <div className="w-full p-3 flex justify-around bg-[#F3F3F3] rounded-full">
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
        </div>
        <div className="w-1/2 flex flex-col gap-3">
          <div className="flex justify-between w-full">
            <div className="flex gap-1">
              <svg
                className="w-6 h-6 text-green-400 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Spotify</span>
            </div>
            <span>00%</span>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex gap-1">
              <svg
                className="w-6 h-6 text-black dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Apple Music</span>
            </div>
            <span>00%</span>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex gap-1">
              <svg
                className="w-6 h-6 text-pink-400 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Deezer</span>
            </div>
            <span>00%</span>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex gap-1">
              <svg
                className="w-6 h-6 text-red-400 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Youtube</span>
            </div>
            <span>00%</span>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex gap-1">
              <svg
                className="w-6 h-6 text-blue-400 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Amazon Music</span>
            </div>
            <span>00%</span>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex gap-1">
              <svg
                className="w-6 h-6 text-gray-400 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Otra</span>
            </div>
            <span>00%</span>
          </div>
          <div className="mt-3 flex justify-center">
            <button className="bg-quinary text-white p-3 rounded-full flex gap-3">
              Editar plataformas
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
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold">
              1250
            </span>
            <span className="text-septenary text-sm">Streams + Views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platforms;
