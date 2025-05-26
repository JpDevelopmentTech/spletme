/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApexOptions } from "apexcharts";
import { InstanceOptions, Modal, ModalOptions } from "flowbite";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import ModalComponent from "../../../../../components/modal/modal";
import {
  Badge,
  Button,
  Checkbox,
  Datepicker,
  Label,
  TextInput,
} from "flowbite-react";
import Alert from "../../../../../components/alert/alert";
import Select from "react-select";
import { platforms } from "../../../../../enums/platforms";
import countries from "../../../../../data/countries.json";
import { 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  DollarSign,
  Percent,
  User,
  CreditCard,
  Clock,
  Filter,
  Search,
  Music
} from "lucide-react";
import { motion } from "framer-motion";

export default function Table() {
  const [conditionals, setConditionals] = useState<any[]>([
    {
      start: new Date().toISOString().split("T")[0],
      end: "2023-12-31",
      value: 50,
      platforms: ["youtube"],
      regions: ["Colombia"],
      conditionalAmount: false,
      operatorConditional: ">",
      amountConditional: 0,
    },
  ]);
  const [formConditional, setFormConditional] = useState<{
    start: string;
    end: string;
    value: number;
    platforms: string[];
    regions: string[];
    conditionalAmount: boolean;
    operatorConditional: string;
    amountConditional: number;
  }>({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
    value: 0,
    platforms: [],
    regions: [],
    conditionalAmount: false,
    operatorConditional: ">",
    amountConditional: 0,
  });

  const [alert, setAlert] = useState<string>("");
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

  const addConditional = () => {
    setConditionals([...conditionals, formConditional]);
  };

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

  const saveConditionals = () => {
    //si en conditionals no existe un objeto con la propiedad end igual a forever retornar error
    if (!conditionals.find((conditional) => conditional.end === "forever")) {
      return setAlert("Debe existir un condicional 'Hasta siempre'");
    }
  };

  return (
    <div className="col-span-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300">
      <Alert message={alert} type="red" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Music className="w-6 h-6" />
          Collaborators
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search collaborators..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <Checkbox className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                Collaborator
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-white text-center">
                <div className="flex items-center justify-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Generated Total
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-white text-center">
                <div className="flex items-center justify-center gap-2">
                  <Percent className="w-4 h-4" />
                  Percentage
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-white text-center">
                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  Role
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-white text-center">
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900 dark:text-white text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending Payment
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <motion.tr 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <td className="p-4">
                <Checkbox className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
              </td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                      alt=""
                      className="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <div className="font-medium">JK Escorcia</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Artist</div>
                  </div>
                </div>
              </th>
              <td className="px-6 py-4 text-center">
                <Badge color="success" className="px-3 py-1">
                  $1,200.00
                </Badge>
              </td>
              <td className="px-6 py-4 text-center">
                <Badge color="info" className="px-3 py-1">
                  50%
                </Badge>
              </td>
              <td className="px-6 py-4 text-center">
                <Badge color="purple" className="px-3 py-1">
                  Artist
                </Badge>
              </td>
              <td className="px-6 py-4 text-center">
                <Badge color="warning" className="px-3 py-1">
                  Believe
                </Badge>
              </td>
              <td className="px-6 py-4 text-center">
                <Button
                  onClick={() => openDetails()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-200"
                >
                  $350.00
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </motion.tr>
            {/* Repeat similar structure for other rows */}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Showing</span>
          <span className="font-semibold text-gray-900 dark:text-white">1-10</span>
          <span>of</span>
          <span className="font-semibold text-gray-900 dark:text-white">1000</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 100].map((page, index) => (
              <Button
                key={index}
                className={`w-8 h-8 rounded-lg ${
                  page === 3
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
                    <label className="text-sm">
                      Fecha ultimo pago: Junio 10, 2024
                    </label>
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
                </div>
              </div>

              <div>
                <span className="font-semibold">Condicionales</span>
                <div className="flex flex-col gap-3">
                  Existen {conditionals.length} condicionales
                </div>
                <div className="mt-3 flex justify-end">
                  <ModalComponent
                    title="Crear condicional"
                    textButton="Agregar condicional"
                    action={saveConditionals}
                  >
                    <div className="flex gap-6 justify-between">
                      <form className="w-full">
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
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="forever"
                                onChange={() =>
                                  setFormConditional({
                                    ...formConditional,
                                    end: "forever",
                                  })
                                }
                              />
                              <Label htmlFor="youtube" className="flex">
                                Hasta siempre
                              </Label>
                            </div>
                          </div>
                        </div>
                        <div className="mb-6">
                          <Label className="text-lg">Plataformas</Label>
                          <div className="flex justify-between items-center">
                            <Label>Todas las plataformas</Label>
                            <Label>Menos{"<"}</Label>
                            <div className="">
                              <Select
                                className="min-w-56 max-w-56"
                                isMulti
                                onChange={(e) => {
                                  setFormConditional({
                                    ...formConditional,
                                    platforms: e.map(
                                      (platform: any) => platform.value
                                    ),
                                  });
                                }}
                                name="platforms"
                                options={platforms.map((platform) => ({
                                  value: platform,
                                  label: platform,
                                }))}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-6">
                          <Label className="text-lg">Regiones</Label>
                          <div className="flex justify-between items-center">
                            <Label>Todas las regiones</Label>
                            <Label>Menos{"<"}</Label>
                            <div className="">
                              <Select
                                className="min-w-56 max-w-56"
                                isMulti
                                name="regions"
                                options={countries.map((platform) => ({
                                  value: platform.name,
                                  label: platform.name,
                                }))}
                                onChange={(e) => {
                                  setFormConditional({
                                    ...formConditional,
                                    regions: e.map(
                                      (platform: any) => platform.value
                                    ),
                                  });
                                }}
                              />
                            </div>
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
                          <div className="flex gap-3">
                            <Label>Condicional de monto</Label>
                            <Checkbox
                              id="conditionalAmount"
                              onChange={() => {
                                setFormConditional({
                                  ...formConditional,
                                  conditionalAmount:
                                    !formConditional.conditionalAmount,
                                });
                              }}
                            />
                          </div>
                          {formConditional.conditionalAmount && (
                            <div>
                              <Label>
                                Cumplir esta condicion siempre y cuando
                              </Label>
                              <div className="flex justify-between items-center">
                                <Label>Monto generado</Label>
                                <Select
                                  onChange={(e) => {
                                    setFormConditional({
                                      ...formConditional,
                                      operatorConditional: e?.value as string,
                                    });
                                  }}
                                  className="min-w-56 max-w-56"
                                  options={[
                                    { value: ">", label: ">" },
                                    { value: "<", label: "<" },
                                    { value: "=", label: "=" },
                                  ]}
                                />
                                <TextInput
                                  type="number"
                                  value={formConditional.amountConditional}
                                  onChange={(e) => {
                                    setFormConditional({
                                      ...formConditional,
                                      amountConditional: parseInt(
                                        e.target.value
                                      ),
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end">
                          <Button color="dark" onClick={addConditional}>
                            Agregar condicional
                          </Button>
                        </div>
                      </form>
                      <div className="flex flex-col gap-3 max-h-full overflow-y-auto">
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
                                      d="M1 5h12m0 0L9 1m4 4L9 9"
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
                                <Label>Excepto las plataformas:</Label>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {conditional.platforms.length === 0 && (
                                    <Badge color="dark">
                                      No existen plataformas condicionales
                                    </Badge>
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
                              <div className="mt-3">
                                <Label>Excepto las regiones:</Label>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {conditional.regions.length === 0 && (
                                    <Badge color="dark">
                                      No existen regiones condicionales
                                    </Badge>
                                  )}
                                  {conditional.regions.map(
                                    (region: string, index: number) => (
                                      <Badge key={index} color="dark">
                                        {region}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                              {conditional.conditionalAmount && (
                                <div className="mt-3">
                                  <Label>Condicional de monto</Label>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge color="dark">
                                      {conditional.operatorConditional} $
                                      {conditional.amountConditional}
                                    </Badge>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ModalComponent>
                </div>
              </div>
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
    </div>
  );
}
