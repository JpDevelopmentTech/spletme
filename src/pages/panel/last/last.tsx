import Title from "../../../components/title/title"

export default function Last() {
  return (
    <div className="flex flex-col">
     <Title title="Ultimos lanzamientos" subtitle="Subtitulo para ultimos lanzamientos"/>
      <div className="flex mt-3 gap-3">
        <div className="p-1 text-normal bg-senary rounded-full text-black">
          Año 2023
        </div>
        <div className="p-1 text-normal bg-senary rounded-full text-black">
          Año 2023
        </div>
        <div className="p-1 text-normal bg-senary rounded-full text-black">
          Año 2023
        </div>
        <div className="p-1 text-normal bg-senary rounded-full text-black">
          Año 2023
        </div>
        <div className="p-1 text-normal bg-senary rounded-full text-black">
          Año 2023
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-6 h-full">
        <div className="bg-senary p-3 h-48 col-span-6 rounded-2xl"></div>
        <div className="bg-senary p-3 h-48 col-span-3 rounded-2xl"></div>
        <div className="bg-white shadow-lg p-3  col-span-3 rounded-2xl row-span-3 flex flex-col">
            <span className="text-title font-bold">Texto aqui</span>
            <span className="text-title text-septenary">$00,00</span>
            
        </div>
        <div className="bg-senary p-3 h-48 col-span-3 rounded-2xl "></div>
        <div className="bg-senary p-3 h-48 col-span-6 rounded-2xl"></div>
        <div className="bg-senary p-3 h-48 col-span-6 rounded-2xl "></div>
        <div className="bg-senary p-3 h-48 col-span-3 rounded-2xl"></div>
      </div>
    </div>
  );
}
