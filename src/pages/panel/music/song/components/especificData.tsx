import img from "../../../../../assets/images/collaborator2.jpg";
export default function EspecificData() {
  return (
    <div className="col-span-12 p-6 rounded-2xl " id="data-valora">
      <span className="text-title font-bold ">Data - Valora</span>
      <div className="flex items-center">
        <div className="mt-3 flex gap-6 pr-10">
          <div className="flex flex-col">
            <span className="font-bold">UPC:</span>
            <span className="font-bold">ISRC:</span>
            <span className="font-bold">Fecha de lanzamiento:</span>
            <span className="font-bold">Duracion:</span>
            <span className="font-bold">Sello:</span>
            <span className="font-bold">Compositor:</span>
            <span className="font-bold">Productor:</span>
          </div>
          <div className="flex flex-col">
            <span>0000000000</span>
            <span>00000</span>
            <span>10/10/2020</span>
            <span>3:30</span>
            <span>SplitMe</span>
            <span>
              Juan Camilo Escorcia, Carlos Mario Pertuz Perez, Tony Amador,
              Jesus Pineda, Martha Paredes, Nacho y JK Escorcia
            </span>
            <span>Jk Escorcia</span>
          </div>
        </div>
        <div className="px-10 border-l w-2/3 flex flex-col justify-between gap-6">
          <div className="shadow-lg p-3 rounded-2xl flex gap-3 w-full">
            <img src={img} alt="" className="w-16 h-16 rounded-full" />
            <div className="flex flex-col justify-center">
              <span className="font-bold text-subtitle">Believe</span>
              <span className="text-normal">Distribuidor actual</span>
            </div>
          </div>
          <div className="mt-3 ">
            <span className="font-bold">Distribuiodores anteriores</span>
            <div className="mt-3 flex text-normal gap-6">
              <div className="flex flex-col">
                <span className="font-bold">Symphonic:</span>
                <span className="font-bold">One RPM:</span>
                <span className="font-bold">Ditto:</span>
                <span className="font-bold">SplitMe:</span>
              </div>
              <div className="flex flex-col">
                <span>Julio 10 / 2023 - Febrero 4 / 2024</span>
                <span>Julio 10 / 2023 - Febrero 4 / 2024</span>
                <span>Julio 10 / 2023 - Febrero 4 / 2024</span>
                <span>Julio 10 / 2023 - Febrero 4 / 2024</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col font-bold">
            <span>&copy; 2021 Martha Paredes</span>
            <span>&copy; 2021 Martha Paredes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
