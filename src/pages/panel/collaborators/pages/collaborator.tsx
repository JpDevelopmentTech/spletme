import { useState } from "react";

import image from "../../../../assets/images/collaborator3.jpg";
import Title from "../../../../components/title/title";

const Collaborator = () => {
  const [typeMoney, setTypeMoney] = useState<"in" | "out">("in");
  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-title font-bold">Colaboradores</span>
            <span className="text-subtitle">Organiza tus colaboradores</span>
          </div>
          <div className="bg-[#DEDEDE] rounded-full">
            <button
              onClick={() => setTypeMoney("in")}
              className={
                typeMoney === "in"
                  ? "p-3 rounded-full bg-[#219EBC] text-white"
                  : "p-3 rounded-full bg-[#DEDEDE] text-[#8A8A8A]"
              }
            >
              Money in
            </button>
            <button
              onClick={() => setTypeMoney("out")}
              className={
                typeMoney === "out"
                  ? "p-3 rounded-full bg-[#219EBC] text-white"
                  : "p-3 rounded-full bg-[#DEDEDE] text-[#8A8A8A]"
              }
            >
              Money Out
            </button>
          </div>
        </div>
     
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="rounded-2xl shadow-lg col-span-7 p-6 flex flex-col ">
          <div className="flex justify-between">
            <div className="flex items-center gap-6">
              <img src={image} alt="" className="rounded-full w-36" />
              <div className="flex flex-col">
                <span className="text-3xl font-light">Martha Paredes</span>
                <span>Fecha de vinculacion</span>
                <span>ID: ######</span>
              </div>
            </div>
            <div className="">
              <button className="bg-black rounded-full px-3 py-1 mx-1">
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
                  className="stroke-white"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                  <path d="M7 11l5 5l5 -5" />
                  <path d="M12 4l0 12" />
                </svg>
              </button>
              <button className="bg-black rounded-full px-3 py-1 mx-1">
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
                  className="stroke-white"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M8.7 10.7l6.6 -3.4" />
                  <path d="M8.7 13.3l6.6 3.4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex mt-6">
            <div className="flex flex-col items-center border-r px-12 justify-center">
              <span className="text-[#FDDDB8] text-3xl flex items-center gap-3">
                Top <span className="text-5xl">3</span>
              </span>
              <span>Colaborador</span>
              <span>MoneyIn</span>
              <span className="text-xs">⭐⭐⭐⭐⭐</span>
            </div>
            <div className="flex flex-col items-center border-r px-12 justify-center">
              <span className="text-5xl">5</span>
              <span className="text-center">Canciones</span>
              <span className="text-xs text-center">Proyectos en conjunto</span>
            </div>
            <div className="flex flex-col items-center border-r px-12 justify-center">
              <span className="text-5xl">39%</span>
              <span className="text-center">Colaboracion</span>
              <span className="text-xs text-center">Porcentaje general</span>
            </div>
            <div className="flex flex-col items-center px-12 justify-center">
              <span className="text-5xl">$5.892,00</span>
              <span>Ganancia</span>
              <span className="text-xs">Desde la fecha de vinculación</span>
            </div>
          </div>
        </div>
        <div className="col-span-5 rounded-2xl shadow-lg row-span-2 p-6">
          <div>
            <div className="flex flex-col">
              <Title title="Canciones" subtitle="Analisis de todas sus participaciones"></Title>
            </div>
          </div>
          <table className="w-full mt-3">
            <thead>
              <tr>
                <th className="text-center">
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
                    className="w-5 h-5 text-center"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
                  </svg>
                </th>
                <th className="font-light text-left">Cancion</th>
                <th className="font-light">Ganancia</th>
                <th className="font-light">Porcentaje</th>
                <th className="font-light">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
              <tr className="border-b border-dotted">
                <th>
                  <div className="bg-gray-400 p-3 h-12 w-12 rounded-lg"></div>
                </th>
                <th className="text-left">
                  <div className="flex flex-col ">
                    <span className="text-xl font-light">Cancion 1</span>
                    <span className="text-xs font-ligth w-36 text-gray-400">
                      JK Escorcia y Martha Paredes
                    </span>
                  </div>
                </th>
                <th>
                  <span className="text-xl font-light">$425,99</span>
                </th>
                <th>
                  <span className="text-xl font-light">45%</span>
                </th>
                <th>
                  <span className="text-normal font-light bg-[#219EBC] text-white px-3 py-1 rounded-full">
                    Solicitar
                  </span>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl shadow-lg col-span-7 p-6 flex flex-col ">
          <div className="flex justify-between items-center">
            <Title title="Actividad" subtitle="Escoge el año y analiza la actividad"></Title>
            <div>

            <select name="" id="" className="px-6 py-1 rounded-full border">
                <option value="">2023</option>
            </select>
            </div>
          </div>
       
        </div>
      </div>
    </div>
  );
};

export default Collaborator;
