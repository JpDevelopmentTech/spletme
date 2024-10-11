import Title from "../../../../components/title/title";

const TableCollaborator = () => {
    return (
        <div className="col-span-6 rounded-2xl shadow-lg row-span-2 p-6">
          <div>
            <div className="flex flex-col">
              <Title title="Canciones" subtitle="Analisis de todas sus participaciones"/>
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
    );
}

export default TableCollaborator;
