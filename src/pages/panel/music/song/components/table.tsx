/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApexOptions } from "apexcharts";
import { InstanceOptions, Modal, ModalOptions } from "flowbite";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import Button from "../../../../../components/atoms/button";
import ModalComponent from "../../../../../components/modal/modal";
import {Badge, Checkbox, Datepicker, Label, TextInput } from "flowbite-react";

export default function Table() {
  const [viewParticipations, setViewParticipations] = useState(false);
  const [conditionals, setConditionals] = useState<any[]>([
    {
      start: new Date().toISOString().split("T")[0],
      end: "2023-12-31",
      value: 50,
      platforms: ["youtube"],
    },
    {
      start: new Date().toISOString().split("T")[0],
      end: "2023-12-31",
      value: 50,
      platforms: ["youtube", "spotify"],
    },
  ]);
  const [formConditional, setFormConditional] = useState<{
    start: string;
    end: string;
    value: number;
    platforms: string[];
  }>({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
    value: 0,
    platforms: [],
  });
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
      ],
    },
    {
      name: "Distribuidora 1",
      data: [
        {
          x: "Ene",
          y: 1200000,
        },
        {
          x: "Feb",
          y: 1400000,
        },
        {
          x: "Mar",
          y: 1100000,
        },
        {
          x: "Abr",
          y: 1600000,
        },
        {
          x: "May",
          y: 1500000,
        },
        {
          x: "Jun",
          y: 1400000,
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
        columnWidth: "75%",
        borderRadius: 15,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Ene", "Feb", "Mar", "Apr", "May", "Jun"],
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
  useEffect(() => {
    initializateModal();
  }, []);

  const initializateModal = () => {
    const $targetModalDetail = document.getElementById("modalDetail");
    const modalOptions: ModalOptions = {
      placement: "bottom-right",
      backdrop: "dynamic",
      backdropClasses: "bg-gray-900/60 dark:bg-gray-900/80 fixed inset-0 z-40",
      closable: true,
      onHide: () => {
        console.log("modal is hidden");
      },
      onShow: () => {
        console.log("modal is shown");
      },
      onToggle: () => {
        console.log("modal has been toggled");
      },
    };
    const instanceOptions: InstanceOptions = {
      id: "modalEl",
      override: true,
    };
    return new Modal($targetModalDetail, modalOptions, instanceOptions);
  };
  const openDetails = () => {
    const modal = initializateModal();
    modal.show();
  };

  const closeDetails = () => {
    const modal = initializateModal();
    modal.hide();
  };

  const addPlatform = (platform: string) => {
    setFormConditional((prevState) => {
      const platforms = prevState.platforms.includes(platform)
        ? prevState.platforms.filter((p) => p !== platform)
        : [...prevState.platforms, platform];
      return { ...prevState, platforms };
    });
  };

  const addConditional = () => {
    setConditionals((prevState) => [...prevState, formConditional]);
    setFormConditional({
      start: new Date().toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0],
      value: 0,
      platforms: [],
    });

    console.log(conditionals);
  };
  return (
    <div className="col-span-12">
      <div
        id="modalDetail"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-6xl max-h-full">
          <div className="relative bg-white rounded-2xl shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detalles del colaborador
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => closeDetails()}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <div className="flex gap-3">
                <div className="w-2/3">
                  <div className="flex items-center gap-3">
                    Seleccionar periodo
                    <div>
                      <select
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option selected>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                      </select>
                    </div>
                  </div>
                  <ReactApexChart
                    series={series}
                    options={options}
                    height={350}
                    type="bar"
                  />
                </div>
                <div className="w-1/3">
                  <div className="flex flex-col gap-3 border-b w-full p-3">
                    <label className="text-sm">ID: 124SDFG32</label>
                    <label className="text-sm">Porcentaje: 50%</label>
                    <label className="text-sm">Pagado: $650,00</label>
                    <label className="text-sm">Generado total: $1.000,00</label>
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
                    <label htmlFor="">Participacion</label>
                    <div>
                      <Button
                        onClick={() => {
                          setViewParticipations(!viewParticipations);
                        }}
                        type="primary"
                      >
                        Ver participaciones
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {viewParticipations && (
                <div>
                  <span className="font-semibold">Condicionales</span>
                  <div className="flex flex-col gap-3">
                    {conditionals.map((conditional, index) => (
                      // tabla para condicionales
                      <div className="border p-3 rounded-lg " key={index}>
                        <div className="flex flex-col">
                          <label className="text-sm font-light flex items-center gap-3">
                            <span className="font-medium">Periodo:</span>{" "}
                            {conditional.start}{" "}
                            <span>
                              <svg
                                className="w-6 h-6 text-gray-800 dark:text-white"
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
                                  d="M19 12H5m14 0-4 4m4-4-4-4"
                                />
                              </svg>
                            </span>{" "}
                            {conditional.end}
                          </label>
                          <label className="text-sm font-light">
                            <span className="font-medium">Porcentaje:</span>{" "}
                            {conditional.value}%
                          </label>
                          <div className="mt-3">
                            <Label>Plataformas</Label>
                            <div className="flex items-center gap-2 flex-wrap">
                              {conditional.platforms.length === 0 && (
                                <Badge color="dark">No existen plataformas condicionales</Badge>
                              )}
                              {conditional.platforms.map(
                                (platform: string, index: number) => (
                                  <Badge key={index} color="dark">
                                    {platform}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <ModalComponent
                      title="Crear condicional"
                      textButton="Agregar condicional"
                      action={addConditional}
                    >
                      <form>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                          <div>
                            <label
                              htmlFor="first_name"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Desde
                            </label>
                            <Datepicker
                              onChange={(e) => {
                                setFormConditional({
                                  ...formConditional,
                                  start: e
                                    ?.toISOString()
                                    .split("T")[0] as string,
                                });
                              }}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="last_name"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Hasta
                            </label>
                            <Datepicker
                              onChange={(e) => {
                                setFormConditional({
                                  ...formConditional,
                                  end: e?.toISOString().split("T")[0] as string,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-6">
                          <Label>Opciones</Label>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="forever"
                              onChange={() =>
                                setFormConditional({
                                  ...formConditional,
                                  end: "Para siempre",
                                })
                              }
                            />
                            <Label htmlFor="youtube" className="flex">
                              Hasta siempre
                            </Label>
                          </div>
                        </div>
                        <div className="mb-6">
                          <div>
                            <Label>Porcentaje</Label>
                            <TextInput
                              type="number"
                              value={formConditional.value}
                              onChange={(e) => {
                                setFormConditional({
                                  ...formConditional,
                                  value: parseInt(e.target.value),
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-6">
                          <Label>Plataformas</Label>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="youtube"
                              onChange={() => addPlatform("youtube")}
                            />
                            <Label htmlFor="youtube" className="flex">
                              Youtube
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="spotify"
                              onChange={() => addPlatform("spotify")}
                            />
                            <Label htmlFor="spotify" className="flex">
                              Spotify
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="apple-music"
                              onChange={() => addPlatform("apple-music")}
                            />
                            <Label htmlFor="apple-music" className="flex">
                              Apple Music
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="amazon-music"
                              onChange={() => addPlatform("amazon-music")}
                            />
                            <Label htmlFor="amazon-music" className="flex">
                              Amazon Music
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="tidal"
                              onChange={() => addPlatform("tidal")}
                            />
                            <Label htmlFor="tidal" className="flex">
                              Tidal
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="deezer"
                              onChange={() => addPlatform("deezer")}
                            />
                            <Label htmlFor="deezer" className="flex">
                              Deezer
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="pandora"
                              onChange={() => addPlatform("pandora")}
                            />
                            <Label htmlFor="pandora" className="flex">
                              Pandora
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="soundcloud"
                              onChange={() => addPlatform("soundcloud")}
                            />
                            <Label htmlFor="soundcloud" className="flex">
                              SoundCloud
                            </Label>
                          </div>
                        </div>
                      </form>
                    </ModalComponent>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={() => closeDetails()}
                type="button"
                className="text-white bg-black hover:bg-black/80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto ">
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
            <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="px-4 py-2 w-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    onClick={() => null}
                    className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-4">
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                      alt=""
                      className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full-full dark:border-gray-800"
                    />
                  </div>
                  JK Escorcia
                </div>
              </th>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  $1.200,00
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  %50
                </span>
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  Artista
                </span>
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  Believe
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
                <div className="flex justify-center">
                  <button
                    onClick={() => openDetails()}
                    className="bg-blue-600 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center justify-center gap-2 "
                  >
                    $350.00
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
                        stroke-width="2"
                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                      />
                      <path
                        stroke="currentColor"
                        stroke-width="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
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
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-4">
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                      alt=""
                      className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full-full dark:border-gray-800"
                    />
                  </div>
                  JK Escorcia
                </div>
              </th>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  $1.200,00
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  %50
                </span>
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  Artista
                </span>
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  Believe
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
                <div className="flex justify-center">
                  <button
                    onClick={() => openDetails()}
                    className="bg-[#FB8500] text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center justify-center gap-2 "
                  >
                    $350.00
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
                        stroke-width="2"
                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                      />
                      <path
                        stroke="currentColor"
                        stroke-width="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
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
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-4">
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                      alt=""
                      className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full-full dark:border-gray-800"
                    />
                  </div>
                  JK Escorcia
                </div>
              </th>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  $1.200,00
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  %50
                </span>
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  Compositor
                </span>
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  Believe
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
                <div className="flex justify-center">
                  <button
                    onClick={() => openDetails()}
                    className="bg-blue-600 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center justify-center gap-2 "
                  >
                    $350.00
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
                        stroke-width="2"
                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                      />
                      <path
                        stroke="currentColor"
                        stroke-width="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
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
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-4">
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                      alt=""
                      className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full-full dark:border-gray-800"
                    />
                  </div>
                  JK Escorcia
                </div>
              </th>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  $1.200,00
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  %50
                </span>
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  Diseñador grafico
                </span>
              </td>
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                  Believe
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
                <div className="flex justify-center">
                  <button
                    onClick={() => openDetails()}
                    className="bg-[#FB8500] text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full flex items-center justify-center gap-2 "
                  >
                    $350.00
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
                        stroke-width="2"
                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                      />
                      <path
                        stroke="currentColor"
                        stroke-width="2"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 "
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span className="font-semibold text-gray-900 dark:text-white">
            1-10
          </span>
          of
          <span className="font-semibold text-gray-900 dark:text-white">
            1000
          </span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <a
              href="#"
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-full-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ...
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              100
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-full-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
