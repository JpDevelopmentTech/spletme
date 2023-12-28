export default function Symphonic() {
  return (
    <div className="col-span-6 shadow-lg rounded-2xl hover:scale-105 duration-200 p-6 flex justify-between items-center">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-septenary rounded-lg"></div>
        <div className="flex flex-col justify-center">
          <span className="text-subtitle font-bold">Symphonic</span>
          <span className="text-normal">Distribuidor con mas canciones</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-normal font-bold">5 estrellas</span>
        <div>
            ⭐⭐⭐⭐⭐
        </div>
      </div>
      <div>
        <select name="" id="" className="rounded-lg border ">
          <option value="">Mas canciones</option>
        </select>
      </div>
    </div>
  );
}
