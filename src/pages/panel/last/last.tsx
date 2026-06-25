import Title from "../../../components/title/title";

export default function Last() {
  return (
    <div className="flex flex-col">
      <Title
        title="Ultimos lanzamientos"
        subtitle="Subtitulo para ultimos lanzamientos"
      />
      <div className="mt-3 flex gap-3">
        <div className="rounded-full bg-senary p-1 text-normal text-black">
          Año 2023
        </div>
        <div className="rounded-full bg-senary p-1 text-normal text-black">
          Año 2023
        </div>
        <div className="rounded-full bg-senary p-1 text-normal text-black">
          Año 2023
        </div>
        <div className="rounded-full bg-senary p-1 text-normal text-black">
          Año 2023
        </div>
        <div className="rounded-full bg-senary p-1 text-normal text-black">
          Año 2023
        </div>
      </div>
      <div className="mt-6 grid h-full grid-cols-12 gap-3">
        <div className="col-span-6 h-48 rounded-2xl bg-senary p-3"></div>
        <div className="col-span-3 h-48 rounded-2xl bg-senary p-3"></div>
        <div className="col-span-3 row-span-3 flex flex-col rounded-2xl bg-white p-3 shadow-lg">
          <span className="text-title font-bold">Texto aqui</span>
          <span className="text-title text-septenary">$00,00</span>
        </div>
        <div className="col-span-3 h-48 rounded-2xl bg-senary p-3"></div>
        <div className="col-span-6 h-48 rounded-2xl bg-senary p-3"></div>
        <div className="col-span-6 h-48 rounded-2xl bg-senary p-3"></div>
        <div className="col-span-3 h-48 rounded-2xl bg-senary p-3"></div>
      </div>
    </div>
  );
}
