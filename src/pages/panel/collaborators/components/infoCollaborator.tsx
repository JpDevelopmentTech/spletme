import image from '../../../../assets/images/collaborator3.jpg'
const InfoCollaborator = () => {
    return (
        <div className="rounded-2xl shadow-lg col-span-6 p-6 flex flex-col ">
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
          <div className="flex mt-6 gap-3 flex-wrap justify-center">
            <div className="flex flex-col items-center border-r p-3 justify-center">
              <span className="text-[#FDDDB8] text-3xl flex items-center gap-3">
                Top <span className="text-5xl">3</span>
              </span>
              <span>Colaborador</span>
              <span>MoneyIn</span>
              <span className="text-xs">⭐⭐⭐⭐⭐</span>
            </div>
            <div className="flex flex-col items-center border-r p-3  justify-center">
              <span className="text-2xl">5</span>
              <span className="text-center">Canciones</span>
              <span className="text-xs text-center">Proyectos en conjunto</span>
            </div>
            <div className="flex flex-col items-center border-r p-3  justify-center">
              <span className="text-2xl">39%</span>
              <span className="text-center">Colaboracion</span>
              <span className="text-xs text-center">Porcentaje general</span>
            </div>
            <div className="flex flex-col items-center p-3  justify-center">
              <span className="text-2xl">$5.892,00</span>
              <span>Ganancia</span>
              <span className="text-xs">Desde la fecha de vinculación</span>
            </div>
          </div>
        </div>
    );
}

export default InfoCollaborator;
