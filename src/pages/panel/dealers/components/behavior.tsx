import Title from "../../../../components/title/title";

export default function Behavior() {
  return (
    <div id="behavior" className="col-span-6 row-span-2 p-6 rounded-2xl shadow-lg hover:scale-105 duration-200 relative">
      <div className="flex justify-between items-center">
        <Title
          title="Comportamiento"
          subtitle="Mide el comportamiento por distribuidor"
        />
        <div>
          <select
            name=""
            id=""
            className="border px-6 py-3 rounded-lg font-bold"
          >
            <option value="">Mes</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col items-center p-6 shadow-inner absolute w-full bottom-0 left-0 rounded-2xl">
        <div>
          <select name="" id="" className="border rounded-full px-6 py-1">
            <option value="">1er trimestre</option>
          </select>
        </div>
        <div className="flex justify-around w-full mt-3">
          <div className="flex flex-col items-center">
            <span className="text-subtitle font-bold">Enero</span>
            <span className="text-title font-bold ">00</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-subtitle font-bold">febrero</span>
            <span className="text-title font-bold ">00</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-subtitle font-bold">Marzo</span>
            <span className="text-title font-bold ">00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
