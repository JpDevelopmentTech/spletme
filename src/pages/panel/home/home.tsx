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

export default function Home() {
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
      <div className="w-full  grid grid-cols-12 gap-6 ">
        <div className="col-span-12 flex gap-4">
          <select className="bg-[#E8E8E8] py-3 px-6 rounded-3xl text-black font-semibold flex gap-2">
            <option value="">Concepto</option>
          </select>
          <select className="bg-[#E8E8E8] py-3 px-6 rounded-3xl text-black font-semibold flex gap-2">
            <option value="">Filtro por tiempo</option>
          </select>
          <select className="bg-[#E8E8E8] py-3 px-6 rounded-3xl text-black font-semibold flex gap-2">
            <option value="">Formato</option>
          </select>
          <button className="bg-black py-3  px-6 rounded-3xl">
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
          <button className="bg-black py-3  px-6 rounded-3xl">
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
        <div
          className="hover:shadow-xl hover:scale-100 hover:duration-500  col-span-12 lg:col-span-6 shadow-lg rounded-3xl row-span-2  p-8 flex flex-col"
          id="chart"
        >
          <span className="text-3xl font-bold">Estadisticas</span>
          <span className=" text-septenary text-lg">
            Reporte de tu rendimiento general
          </span>
          <ReactApexChart
            options={options}
            type="area"
            height={250}
            series={series}
          />
          <div className="w-full flex justify-around p-3">
            <div className="bg-senary p-2 rounded-3xl text-septenary flex gap-2">
              <img src={StreamLogo} alt="" className="w-6 h-6" />
              <span className="font-medium">325K Streams</span>
            </div>
            <div className="bg-senary p-2 rounded-3xl text-septenary flex gap-2">
              <img src={YoutubeIcon} alt="" className="w-6 h-6" />
              <span className="font-medium">325K Streams</span>
            </div>
            <div className="bg-senary p-2 rounded-3xl text-septenary flex gap-2">
              <img src={MoneyIcon} alt="" className="w-6 h-6" />
              <span className="font-medium">244,19</span>
            </div>
          </div>
        </div>
        <div className="col-span-12  lg:col-span-3 shadow-2xl rounded-3xl  flex items-start p-8 justify-between">
          <div className="flex flex-col w-full h-full justify-between">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-bold text-3xl">Balance general</span>
                <span className="text-septenary text-lg">3 De junio</span>
              </div>
              <img src={monedaNaranjaIcon} alt="" className="w-10" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <img src={ingresoIcon} alt="" className="w-5" />
                <span className="font-bold text-2xl">Ingresos</span>
                <span className="text-[#31bd3f] text-2xl">$00,00</span>
              </div>
              <div className="flex gap-3">
                <img src={egresoIcon} alt="" className="w-5" />
                <span className="font-bold text-2xl">Egresos</span>
                <span className="text-[#FB8500] text-2xl">$00,00</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 shadow-2xl rounded-3xl  lg:row-span-3 p-8 flex flex-col">
          <span className="text-left text-3xl font-bold">Mis plataformas</span>
          <span className="text-septenary text-lg">
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
                <span>Youtube</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#94C8E5] w-3 h-3 rounded-full"></div>
                <span>Amazon Music</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#89D062] w-3 h-3 rounded-full"></div>
                <span>Spotify</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#000000] w-3 h-3 rounded-full"></div>
                <span>Apple Music</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#E55FFE] w-3 h-3 rounded-full"></div>
                <span>Deezer</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#666666] w-3 h-3 rounded-full"></div>
                <span>Otra</span>
              </div>
            </div>

            <div>
              <Link
                to={"#"}
                className="bg-quinary py-2 px-6 text-white rounded-2xl"
              >
                Editar plataformas
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold">1250</span>
              <span className="text-septenary">Streams + Views</span>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 shadow-2xl rounded-3xl p-8 flex flex-col justify-between items-start">
          <div className="flex justify-between w-full items-start">
            <div className="flex flex-col">
              <span className="font-bold text-3xl">En tu Ewallet</span>
            </div>
            <img src={checkIcon} alt="" className="w-10" />
          </div>
          

          <span className="text-septenary text-5xl font-bold">$00,00</span>
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col ">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold text-3xl">Top songs</span>
              <span className="text-septenary text-lg">
                Aqui tus mejores canciones
              </span>
            </div>
            <div>
              <Link to={"#"} className="font-bold text-lg">
                Ver todas
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 mt-3">
            <div className="col-span-12 lg:col-span-6 rounded-3xl hidden   gap-3 bg-white shadow-2xl p-2 lg:flex items-center">
              <div className="w-1/3 h-full">
                <img
                  className="w-full h-full rounded-3xl"
                  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTExIWFhUVFxgXFxcYFxgXFxcXFxUXFxcWFxcYHSggGBolHRcWIjEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAAAQIDBAUGB//EAEEQAAEDAgQCBwUGBAYBBQAAAAEAAhEDIQQSMUFRYQUTInGBkaEyscHR8AYUQlLh8WJykqIVIzOCssLiQ1NUY5P/xAAbAQACAwEBAQAAAAAAAAAAAAAAAQIDBAUGB//EADURAAEDAgQDBwMDAwUAAAAAAAEAAhEDIQQSMUFRcfATImGRobHRBYHBYuHxFDJSI0JTktL/2gAMAwEAAhEDEQA/AIljrXsLcZH8U7qyk2B3achsFVQxYJhwNN38eh/lfoffySxLjBc1zWgakXJ5Fumq9RmGoXz7K4nKbdeHupYmsDLCQBlMncOGnDv8FayrAuSYMSRre1lz6WPJIJIzDeNuH7hWYpzpmYFzMBp9dQOXooh4BVxoEgBbnYqGkhva4ARc7+Skyi0mcxc7ibn9NToufSxUwA762M3juErRTHESNnXHfZAO6T2EA3A9FrLR9WVRptP7kpnfWO9VsqsmA9nODPI6eKmTFiVnYwk90E8lLDOaNBlixzRB4QJ7vJTyhx1AmYJ00mB5D5rNUxTbX5EkWBgdm/eEU8Ta8iwMkEhw3yOHM6GCqszZsVty1LZhbh1fq6006pIgjQazI2F470jWH6+sXU2UYcMxgGBJsD5hOqQL5XOiPYEm/kpyAs8F20/PX5KzV5zAgu4WAGxEc/0V1N+k5Z2ifUbJuZNo09D4Hv8AVUva8ezExMm/a5jhr+ihlA7wV5qufDCACL7afF54SrQ6LgDxy+OqrNUCwEySDJmNz33IsOKso0THaLS4btENPgXE6J4fDS8NzZJOskCeJI+tEni0j9/jrZW0KveDXmZ04eF9TfawUKTALBuusDjFo20UntBkEGDEjQGOMK6qxzXRYjiCZ234a89FJ5AESPD4BJrBAUquMqtcbCfG/wDHUKihhwHdoAgaT2iDxGt43XSe6RqR4R+yz02zfjPDmOFlbcc9/h81LKBosr676l3fwgPi8zPOVU57vqNoUpaPl9aKrqgdDfeNFIAKgk6JGpfX4JtE7n4BSNDibe5LI6fZsIvm8zopZhCG03E391Exy8lZSjUjS9+O3fdWCh368J4/orAA0Xi/H0+uaiXbKbacGSshnWCdJJjukk81Pq4uddr803VQBe8+iw1nk7/XK6kJKjLR4rVmP8KFij6kIUoVebkpPMzMHwt5Fcs9HueXENyXsNF1G1CBxPAfCVbTqTePA93BI6qxlQsBjdcMYF0O0GTeRA4AH8ysoVYAAZ2yYLiTJvaDPZ8F2zBGguO8Ty4rlVnZqpHaLQQMoEidCYNrWVZhamVXOMHrrgoYfCBpmXZnZnDJYgASXETvoJ4rbQoGO1Uqydg8COUtEnzUcJTew5abWtJBcSSTAmwJAudTbh4rTTBnMHNIywBBHa4zrHDvUGtbuEqtR5uCOZg/g2RSwDY/GSNM9So4b3u6P3VeKY1gLRTZLwZ7OWYgRI1MuaIlXUomC6TFxI842UKlIlwMARYb2nhvumWwLKDKne7zj5kD8ea5FGhFoAmDpAuSBEECYEXkrXUbTI7bW2JOtu+ditfUT7d7zBuJur2N9yG04CtfjgXC0+Mx1ZZOjqFCn24mZGUF+TSxAda1itfXSDkf2TtwB4AjlqOSG0hsB4AKJpDTILd1kCnB2UamLDxfNzmfXU/dZauFbIdLs0W7RZEkcIvbnw3VzWkQBBtq4neTMk38VW9wkg57cQckzsdDorKBcAXZSROrRJk2A0SJps70geibRXrQ2C77T5psqbETG7dz3bKUOIkNOvK3fdIV5mZsdxF+HohhB3878VKnUDx3T+VXXpdif9RkeY/JHuraj3RlzSG6QZF4MAg8gPBFN8DnH0fJWxrpPH38CsrWAHRSaLKio+TM9c1c1/A213N/HRXZiLzaL8VjztB4+akAHR5C49Uy3iotcVcxp1O6ue8kdkTGp27uazsoGYDo5C48/kmGfhzeEH3wkYKsAcJsUOcQDfyU2Nc7QiO8Sqi0izot3FWdSNbkb6+VtEyQotDp/dAY+YI7/ioPDiT2TfuV5pwCQYJ8O+PG3gqiwjeJ8UgZum5sWI8fhVOw++/uv+3mkKCtM9/M6eWizvJUxKrIA2VuU8GpKm/D1CE0pcqWOJHBZsTVJcAJtvwJED3rQ8gOY2xfUOVo3nyWXp7Gupu6ul2TTPbeIlzoA0IsB71RWxDadtTwXQwmCdV7+jeJ/A39FZ0ZjKRLaWctfOUSIbmJgAumw5wpgGhUeHEjNIjiZEmRqB8V5Kk+ILwX9rtdohzhNzmF53mV1ujqjGCHGrlNyC5rhPEdkekLHTxTy6HiR7LrP+mUSw5DDjPiD8fZejcwQb6xIvFrR3ctEMqOsAIkmf5RYRG+idfCka6bOA3vcHzVZeeBXRADrhecfnacrhcbGVaJE3nyt9c0Sqw/h4qUKQHBVvmbqQP1xT6w7JDw4a8EnDzRqlcap551MJV6+RsnXbh4wfRE/RXm+nekT1mSLMieeh+Kz4mp2bMwW3AYcV62U6ankF1a3SLYInTXS54DkOP0ejhOn8MxuWoJgGSC4ySLxwG3mvGtfY7TqPgsGIrCdfrRcao3Pd5leuoEU+7TaAOS9pS6epCqCxjcogFrhZ19SJvGxXbGEp1WE0MucGcpMFwkzkE8pXytj+C6/R3SFRpEEj3juVTaZa4OYYIWh7m1GFlRsgr2bXWgmCDpzU7HaY8FU3FmoG1C0FzpzaC4Ptd51Qap4ADmR7136ZzNDl4jEUuyquZsD6beilUaSbgDlCq6tzb/AEPPRM4jYEH6+uCj1zzp628laJhZ4vdRqVHjVtt8pJ8xKiKh1mPEn0zKwuO89/7LTRwrnDM0kifqO6QmSALpiXGGhZm1hETPLUJjKO86AH5K44czBnnJ0CTWAXI035fuolwCGMk3mPjX0SOJBFjYX+ioOeOIPcEyxnAeAA8lQ+qANgOaYAFgk5xcSVLP4KMnwVQrE+yPHZTZQcbk/AKfNLLCMw/ME1Z93Zx9ChLME8rev5XPrVjmgdYBaHscQ4HkdQPFaMXSNRoaXk3/ABGZ7yd+fNY3VKhIlpDeWvmrs7gLNLuVvilkabwry94AANheJtPHhK42IwOQ29beSgWwJM+JPmt+Mr5jGQgjW4mOCg/Dte3s2PDX6Ky1MNAJb5Lp08Y63aefysuB6bqsJEyw/hOns5ZjuXrMNQdUpiq0Sy99YjlqF4ytQIXR6B6erYQnq3dk6jULDTrPpTHXwunXw9DFtAqWI0I289R4LttYBMb853J18VORxWvovG0Mc7LajWOhHsudzbsTyVGLwlSk8seIc3X5jiF06GIZUsNeC83jsBWwxzPuDoRp+x8D9pVYcO9HWRoPFRuo5uSvhYQrS/kvG9J9rEOA0JifQrt9O47JSJaAXFwZpxXn8EJcXZrt1EzrPkubjqgzCn9/deh+kYVwaa58RHkpYl0DKNlxsRiHA2YI7138Q0Bc6qdVgcF3aaOisDUreywk6mOCjXxgp1cs5SLGR4XChTrEQIMC5M3PCFvrtZXe11Vv+ZlAcSZmCQ2TaezluoclcANV67o54LGWm2/G0kX0WrKOAWOhR6pjHaAgxw+rKTK2bQ/BdvDNPZheN+pA/wBQ46aLXmbwHgEy4clmLN/eoGk43AJ/3WV5ACwgZlrzN4hLpOkXPptyOLWNJJaQCHOMxfcDJbmpYDDNBzuDZbcAmxf+AHlNz3Lt9HPyUy5xMOl0z+GZzd7jmda8W2WLEvEhq6306jANX7BcHDnFSYbVqMiW9Y2RNoBJM8RY8FJ+IJs6lUpZZ2D2mNTlPa9+i9f0fjGuzZQRFzPMWgSeGi5fSWNbTc5+pBA0s98SBGzWiJPgs9NzpgLoVWUntzO035arzuIa4OLSLixJCrbTAuRJ42CjVLnEm8m5Otybqk0Tu0nvk+mi64EBecMEmDHqVo6/hHgJVL8SZImTzvHgLBWtaY2A+thCrLgDFu82B7gNUQENgzZU9a7l/SPmhaY50/6ChEp5hw9/hTzJueFhOKZx93wSqYphFnGeQj1TSFFx2WfHvBdYg7afV08HRBMkgAcd1AOY113B3E3keSvr0WwC1pdO8m3mo6LUbANvz/mFZjcK0iW+XyXDrMiy67Kb+HhMecQrcTgJbO/AT71kr4fP3m6+604XFCjDHukceC4ODqPY9pYTnkZY1naOa+p4GlQrUWtxVfLidC4uByx+EjQgfRXzN9JzHS2Q4aEag8uaobmmZPmubDmukGCu/np1KWR4zNO2y9r0jh3UnEEZhs5hBafHbxWLrhwPlPuXCo9JVWGcxO3mu90V9rm025X0BUHE6z8lvGNhtxJ8lyD9Fpud3HwPG/rIWfpKh1tNzQCSIItbM0yNfq68zhcGaToyPEjtEgxI79V2cR0uwvLhThp/Bw7iqOkemaGWA14O1vNQrGjVGcmCFZhm4nCHsWtzNJmRtt8ahZa7lzcU86BsnhounmDhKy4qjI0uueV1WOuuI/EPmzWwNiTPnsV3MNUz5NZFiDr3rJQw7nOuAT9cCvRYLCdppIEgRHBDQtLjELrYSpOWm4SA1xvoJLB/ylb2uZadhaI9VgoNL3QxjnGAIDSTANrDvW2v0fXpiX0HtA3LHAecLs0WZGhrjfhoV5HHudWql1NstAAkCQd5kdQAh7mT9W80m1G81lbB4ps6uRmHZm+9t9FeWgC65oOYwE8fTqPpl1MZmtMHaZBAAPqt+A6Wp5cr3RZrbmCJaItv4cVfg8cKzXZGyQIY0EZJcHQ0lpkNAjs2km/Lm9KYbC1wS+m4VSLm2ZpAyxksABGw2F1ynOL3EgL0tOi2lTDC6Yn1uuy/Hsw1OGEuc68kzPCTymY5FczpKvLgwS4M7MxEu1e6XRq6fILzo+zjzdtYF1oHazbDcQPM8l3sfhDh6Weq9ubsgtBl+dwmCNiBMyrKDmtfLrKrF4epUphtIZuMbR+J9YVDzOrX9wN/MGFk6QrMYQcwmJ3e7WIy6A95WTGdOsAhgJcRqYAGt4i5hculTcWueRbmrX4kf7FXhvphF6tvAH3+AvX5iQCwtLXWY5zg3NwgWk6WWWrhnkw8xF4bfytp5ryrKtU5cl8oIAuey+xm8xy5niV3+jMdFNtN9DKQSM4dEawchBmT70qWJcTDh5BTxP0pjGF9JwngeF9LTK1/4c38zvMIVXXO/K/z/RC3yuL/AKnH1Hyoiv8A/WPMKZeTo0Rzn4BUjEEWg+II+agcYzePX5IUuznQdeayV6QBOg5QfNWYGkSbWHl6xCrxVYOPZP8AeY9dFbQcQPa9Wn4oWo5sq6NtSR3g/QUm1P4m/XcVQzFt0OvGx9xKsZXadHM9fmhY3NcNQVY+iHakHuWapgBstHWD8zf6j8VDr+bf6lB9Nrv7lKlVrU/7TbhaFiqYPiIWB1CD4rtnEHkqawDtvHZZKmEES0ro0Me8GHhcN4EqqpQa4XWrF4cgrKbLnu8V3aZtIKppscywPcrWYh83YD/KfmlErRQpWVYB2UyBun9/YxuYscPD0UaPSr6rg0A06ZIzH8ZE3Aj2UVqYOt+CrpUwi5tKszBgmF9CP2vpMhrGktAAgWEDWI35rJi/thiC4FvZaCOxqDycN15/AYeSO9X4zDy62kn0MJik0eKDiXHwXXx/2noPyn7o3PHbuWt5QGkLsU6VBzWh+HyVHAHLLnOaLEEg2BImxM3C8dRb1b2vyh2Uh0OEgkGwI4L0mFxOYdYRnB9o/iDpkyR7Jv7UZSNQNFawuEDMfMrLUcw3yNnjlHwih0M2kS93ZaJcTcQADvF/aAtwXSbh6GIpMc4BzjLQ+O12QZBOto0K2dGFtai6i98kjXU6yCO4gck8P0OaAd2swJLjYjKTExJJIhu53RmgwqssjMF5d+Kdh2VnAQ6mAxh2zPdlDuZGV504LyFQufcknvPHUr2HTmTq2An/AFXurGAdJLWd258VyWPoN4+S0Mw733G6rdjKdIZTJPAXXn6uBcYIG8elloeHxlAIAEdy7JxlHTKT/tCf3+n+T+1aG4QAarKfqdSe7SMeK87haLho4NLrXsYmfBdnA1HsBzU6NQ7EugjyMeijin0antMjmOyfeo4d7GAgBxk/iIMdybMNlMSY8CR6IrYs1GzkHJzQfIyPIhdD/Enf/Hb/APv/AOCFj+9D8qFd2I/yd5/ssOcf8LPI/wDtWsNT8p81RjGmCSw98qIPAR4lU18/AkK5VsZ3tuvulRo5hdvrC008OR+QeMrPSzaByvax/EJKbyeKm6mdnjuASaxw1JjkArQ4/UlWNJ4f2ohVF5Czgg6B/wDQPmmabjoT5NC1NeSmGcj5lNQNQjr+FjGFO4J9Qg4Zo/CPULeG/wAKpxLoHsxNtUiYukKziY691ixY7K5LmyV1ahkLE2iZXIriXLvYJ4ay6g2hCmDsFYDyVDgZgKiIW1jpuVF91pwOEzKo0HLtdDUt+CGtM6K0vblmVpp0RRbmM/MnYBVMxNrNd3QrsQ4udc+zt8Vlc5oOk+ZXYpUWtFxdebxWJdVdAmyVTFHdvnHwCdDHPYczOyeP1qECqP8A2yP9pUus/haPruVnZs4DyVPbVBuf+37roYPGCoRld1dUfhkim/fsn/03E+BXVw2LyU6jnh7AHZerJyh7y3QGZy3k91iZXmRiBPszykx32aivjajgAXOIbYB2Qx6LO7CtLrab/t1ZamY14YQRfY/OyljaTqzy972yYEAENaAIDWjYBZz0aOPwVRrO4M9PgmHO4j+75rUBFgspNX/JW/cmjX3qQpNG3nHxVIqP/MPI/IpGs7dzvI/NNRIedT7rVlHAeQ+CYcBsAsOc8SfCfeUCodm/2BCXZeK3T/GELF1r/wAv9g+aESjs+XX2R1zfylQrVWxZt+ao8QkfBCvDBO6QctVKsYu4jzWMFSz80lY5krcMUdnA+D1L719Q5c/OeKl1pG/uTVZoha3YqNv7PmVZSqvd7Mc5EACYudFjFc8fRej+zvQdSscz+y0T2nCQDBiAPadyVVWqKbMxKtoYQ1XhobPXJUYRp9p7esY0jPlsOTRvtqqccWl0tblBiBexLQSL3iZ8IXY6VxrKDH02umS0SBBlo1vpEnQakLz1J2ds9/vKxNqucSSdtOt1sxOHp0wxrGjW58efBV5oTDJRUpFFOkVnJMqxrRFlbTwu6oDL6La98NVFN44IICsuLQraLZK7dCm1jJA5rBg2hxAhdDpMhlFx5R52VtJsuCVYgMNl5uvWdMyRedlB1V35v7v1VPXypFwOwXUXFyxqFY2oNwD/ALvkrOuA0YPNZg8KQqDgmkW9XVv3riB/R+yDiQdj/QFV1g2AR13d5IRlA0HXkrm1xwP13KLnA7X8VT1qOsSRk4K0A8T5x8VCOPq5RDglITUspCsIH8P9X6qIb/J6KJP1dK3BJMNOysy8meiarkcEISynh6LEFIBMIUZXRDGoTlSdsopSplgSlCkkESVHI0LTg7EOI1MDjzjnsvUVvtC6mxtOMoaLNG1t43Xn24wUgQ0doiMx1A3DeE7nUysLqhcVza7sz5O2i10nhlPubpYzFue6SVp6KfctOhMjvhPC9Hlx0WyvRp0hDzc6NFzHwVbA4uso1cpbBVpoHigU1lw/SEmCLbTr4rS7FDJnboTALpF+7fdaHUw0wdVlaXaJ4ltk8PR4op4umYzObNtJifJWPxjG7E9w+ZUXU4uVNtWbBbsNQA0Ku6ewD6mGe8GOqLXluksi59QfArFg8eXGwgea9C89cHCRJYR/M3JBb3wLKGctu1amUgRFThbmvm4UpUIIsdRY94Ul05WIMbCcolRTRKA0JyiU4ShCllCJTShOEIIQmCowmAhKE5RKIThJOEsyEkJqKzgKQCgCpoTamghEoSU00JJhNJXPZmgjf3rfgejtzYDcrlsqFuh+SnWxT32c4kcNvJZnYcF0yk0lggLq4rpUUxlpQTu7Yd3FcZ7ySSTJOpOqiUK9jA0QFEkk3UgrXOAYxo2mT3xCqQjKJBUpIEJrXhaubsu8D8CsaaHNDhBUV2cM0tK7mFqaXXlMPjiLOuOO/wCq04jpYluVkibEnWOAjRZf6cgwNFc2uYh2q51cy5x4uJ8yUgoSmtiqlSCEk5QnKklCJQki6E0pQhAKcJhKUwUICEOQkUJIlCSE0lmDk0w1OE0wlKYQApQknJUU5ThEISlIlEpkJQmok3USUByaAEJbp5kiUQnCESgFPMkAiEJgolSDlGEoQQiSrJSlKE0k5TlOUoTQhNEpQhClKZRKAU4SRKAUpTQhJEpkoSKaJRKEIQkswKw/4qBW6ktIJ0No0n9FtBXnenhlqU6o2fB8MpHxVGJe6m0OGxE8t1fhmNqOyu4W5rrYjpPq2F7mGA/JqJPMclXiumW02MeWGKgkAESLA381l+0Dpw7udX4lYumv9DDd3/VqorVnszQdADoOMK+lSY/LI1JG/CV6Klj2moaRBDwJjYjkVTgelBVe9gaQWTMkXIMWWOjRLsYag9hrYzbE5YgHf9FlwhyYyuOLHnxOVwUjWeCJ0zEcxFkuyZB45QeRm/ouxiukRTpCq5pgx2bTf0VmNxopsNSCQI01uuZ9qGf5IGzYPuYP+S1Uf8zD0gfxNYD5QVMPfncwahojmqSxga18akzyVtDpAPYx7Wkh5y7CCJ15WKlice2m+mwzNQwOWgv5rj/Zyr2TTOrKk+bHfEHzS+0RirSfs1wHiCHfJQOIcKHaTe34lWf07TX7OOPtZeilSlQQt654KYTUU4QmEyUgUimEJEpypquVIlRKkCpgpqGZNJSlTRKhKkhCkChRlOUJoQkSmChCaRSQUKKEIhJCJVAXI6fo5qLz+Wpm9wPoSuzC5ZzBr2uZUIfJOZ9ERNrXEDRVVwHNyncH2WigYdI2j3XNxtQuwLCd3j0kfBV9N/6GG/l/6tXQqNa6mKGR0AzZ9HNOvHmjFYE1Gsa6lVinpDqPLW/ILE6k5zSP0tGh1BvstjXta8E/5E7aEc0MrFuNLQey5txtIbM99lnxbCMcyPxAT3QZ9y11cKXVBV6qqHRBh1K4iL3tY7K11Mmq2r1FTM0FoGalF5563VhplwI/XmFjpvtzVYeGkH9MG418+KOm706ovZg2JEgl+u2yq6EfOHp8nx5OKteHkPBpViKkzelaQGwL8AqMPhXMaGNZXADs3tUdeBvorIPa54OhGnjIVRjs8k7g6jhB3WTCsLMa5uznF3vd8SpfaMTSmDaodjGhbr4BbalImqK3UVQ4DL7VKN7+1rdU4oh1MUntqRrOegHGD/MqnUyKb2cSYsd4jZWCoDUY87AA3G2q62GfmY13FgPmFYquj6eWm1sOGUQA/KTA0uyyvhdBrrBYHN7xhKU5QhNRgqKIThACcpZSUJoyqcJSpZVBNPKnkRKIKQThMBMhRTDVEBSlACIQiCkohWQokIRCcqJKkQokJpEFEpIhCErqIC8jXYe29wIzvqNdsRdpaPEe5eyDVB9FrhDmgg7ESFnxFDtWxMLZh6wpmYXjMQxhqBxaXCqJEODS1wgESbazrxC6Bxb6PV1A57mODmlpeHQ4aEFtrxNua7/3Clp1bYF/ZGp19ysbSAEAADgFnp4RzZIMHwG/53Wh+KabRI8evVeVxVaq0sa+o6QzM+XPAlxs3/LvYQqcUHONWJhjmDNmJLGi0hs3BjUr2UKHUNknKJNiYFxwKk/Bl1s3URx++35Cbi8t49uM8By6v5cVHNrl7HFwcC9okw9kdtvJwv5JUauIInNVIdTqETMiJDNN5AXq20gNGgdwAThSbhSDObefNVvxQNsvh1br28di2VWhr3B5LMgvN3QXE84kCVVWDA2q10ZmBjGDec0vcPGfNe4hZquApOMupsJ4loJVb8FMw7zHgR8eQU24zi3y5g/P2JVfRWIFSkxw4AHvFitRUmMDRAAAGwsouW5gIABWJ5EkhJCA5PMpKAKUICkCmEk4SATTTQmowpFCSE0BNJMoSSTQgFCaEJpFCSEiUykQhJEoUYQhRhSQ1CEKaZQhCEFJAQhCaChCEICQUkIQkk5VBCFIKJQhNCCotUlJCFFWJpJIQhMKSEIQkkhCEKRUQhCEwmUIQhJNyRQhCEkIQhC//9k="
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-around h-full text-sm w-2/3">
                <div className="flex flex-col">
                  <span className="font-bold text-xl">Amor</span>
                  <span className="font-semibold text-septenary">
                    El vega life
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-3xl">$00,00</span>
                  <div className="border-l p-3 border-gray-300">0%</div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-2 rounded-3xl  gap-1 bg-white shadow-2xl p-2 flex flex-col items-center">
              <div
                className="   w-full h-32
              "
              >
                <img
                  className="w-full h-full object-cover object-top rounded-3xl"
                  src="data:image/jpeg;base64,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"
                  alt=""
                />
              </div>
              <div className="flex flex-col text-sm  w-full">
                <span className="font-bold text-lg text-left">Cancion</span>
                <span className=" text-sm text-left text-septenary">
                  Lorem.
                </span>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold ">$00,00</span>
                  <div className="border-l p-1 border-gray-300">0%</div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-2 rounded-3xl  gap-1 bg-white shadow-2xl p-2 flex flex-col items-center">
              <div
                className="   w-full h-32
              "
              >
                <img
                  className="w-full h-full object-cover object-top rounded-3xl"
                  src="data:image/jpeg;base64,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"
                  alt=""
                />
              </div>
              <div className="flex flex-col text-sm  w-full">
                <span className="font-bold text-lg text-left">Cancion</span>
                <span className=" text-sm text-left text-septenary">
                  Lorem.
                </span>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold ">$00,00</span>
                  <div className="border-l p-1 border-gray-300">0%</div>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-2 rounded-3xl  gap-1 bg-white shadow-2xl p-2 flex flex-col items-center">
              <div
                className="    w-full h-32
              "
              >
                <img
                  className="w-full h-full object-cover object-top rounded-3xl"
                  src="data:image/jpeg;base64,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"
                  alt=""
                />
              </div>
              <div className="flex flex-col text-sm  w-full">
                <span className="font-bold text-lg text-left">Cancion</span>
                <span className=" text-sm text-left text-septenary">
                  Lorem.
                </span>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold ">$00,00</span>
                  <div className="border-l p-1 border-gray-300">0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
