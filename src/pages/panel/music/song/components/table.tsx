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
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <Music className="w-6 h-6" />
          Collaborators
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search collaborators..."
              className="pl-10 pr-4 py-2 border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-indigo-600 dark:text-white transition-all duration-200"
            />
          </div>
          <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900 p-4 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="w-12 h-12 rounded-full ring-2 ring-indigo-200 dark:ring-indigo-700"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="font-medium text-lg text-gray-900 dark:text-white">JK Escorcia</div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400">Artist</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Generated Total</span>
              <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">$1,200.00</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Percentage</span>
              <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">50%</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
              <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Artist</span>
            </div>

            <div className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method</span>
              <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Believe</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <motion.button
              onClick={() => openDetails()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 "
            >
              <Clock className="w-4 h-4" />
              Pending Payment: $350.00
            </motion.button>
          </div>
        </motion.div>

        {/* Repeat similar structure for other collaborators */}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
          <span>Showing</span>
          <span className="font-semibold text-indigo-900 dark:text-indigo-100">1-10</span>
          <span>of</span>
          <span className="font-semibold text-indigo-900 dark:text-indigo-100">1000</span>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            className="flex items-center gap-2 px-3 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 dark:border-indigo-700 dark:hover:bg-indigo-900/30 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </motion.button>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 100].map((page, index) => (
              <motion.button
                key={index}
                className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                  page === 3
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-white text-indigo-700 hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                }`}
              >
                {page}
              </motion.button>
            ))}
          </div>
          
          <motion.button
            className="flex items-center gap-2 px-3 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 dark:border-indigo-700 dark:hover:bg-indigo-900/30 transition-all duration-200"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div
        id="modalDetail"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm"
      >
        <div className="relative p-4 w-full max-w-6xl max-h-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-lg dark:bg-gray-800"
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100">
                  Detalles del colaborador
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="text-indigo-400 bg-transparent hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300 transition-all duration-200"
                onClick={() => closeDetails()}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white  rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Estadísticas</h4>
                      <div className="flex items-center gap-2">
                        <select
                          className="bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-100 dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
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
                      options={{
                        ...options,
                        colors: ['#6366f1', '#818cf8'],
                        theme: {
                          mode: 'dark'
                        }
                      }}
                      height={350}
                      type="bar"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4"
                  >
                    <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Información</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                          <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                          <p className="text-indigo-900 dark:text-indigo-100 font-medium">124SDFG32</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                          <Percent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Porcentaje</p>
                          <p className="text-indigo-900 dark:text-indigo-100 font-medium">50%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                          <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Pagado</p>
                          <p className="text-indigo-900 dark:text-indigo-100 font-medium">$650,00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                          <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Generado total</p>
                          <p className="text-indigo-900 dark:text-indigo-100 font-medium">$1.000,00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Último pago</p>
                          <p className="text-indigo-900 dark:text-indigo-100 font-medium">Junio 10, 2024</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Colaboraciones</h4>
                      <Badge color="indigo" className="px-3 py-1">
                        51
                      </Badge>
                    </div>
                    <Link
                      to={""}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Ver todas
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Condicionales</h4>
                    <Badge color="indigo" className="px-3 py-1">
                      {conditionals.length}
                    </Badge>
                  </div>
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
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            key={index}
                            className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-sm text-indigo-900 dark:text-indigo-100">
                                  {conditional.start} - {conditional.end}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Percent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-sm text-indigo-900 dark:text-indigo-100">
                                  {conditional.value}%
                                </span>
                              </div>
                              {conditional.platforms.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-xs text-indigo-600 dark:text-indigo-400">Plataformas excluidas:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {conditional.platforms.map((platform: string, idx: number) => (
                                      <Badge key={idx} color="indigo" className="text-xs">
                                        {platform}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {conditional.regions.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-xs text-indigo-600 dark:text-indigo-400">Regiones excluidas:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {conditional.regions.map((region: string, idx: number) => (
                                      <Badge key={idx} color="indigo" className="text-xs">
                                        {region}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {conditional.conditionalAmount && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                  <span className="text-sm text-indigo-900 dark:text-indigo-100">
                                    {conditional.operatorConditional} ${conditional.amountConditional}
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ModalComponent>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-end p-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => closeDetails()}
                type="button"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
