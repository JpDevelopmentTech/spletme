import AddDealer from "../../../../components/adddealer/addleader";

export default function NavBar() {
  const navigateToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <button
          className="col-span-3 hover:scale-105 duration-200 flex flex-col p-6 shadow-lg bg-gradient-to-t to-[#91CDE9] from-[#A4DFFB] rounded-2xl"
          onClick={() => navigateToId("behavior")}
        >
          <span className="text-white text-subtitle font-bold">
            Comportamiento
          </span>
          <span className="text-white text-normal">Status general</span>
          <span className="bg-white px-3 text-black text-normal rounded-2xl mt-3">
            Ver
          </span>
        </button>
        <button
          className="col-span-3 hover:scale-105 duration-200 flex flex-col  p-6 shadow-lg bg-gradient-to-t to-[#FB8601] from-[#FF9911] rounded-2xl"
          onClick={() => navigateToId("income")}
        >
          <span className="text-white text-subtitle font-bold">Ingresos</span>
          <span className="text-white text-normal">Status general</span>
          <span className="bg-white px-3 text-black text-normal rounded-2xl mt-3">
            Ver
          </span>
        </button>
        <button
          className="col-span-3 hover:scale-105 duration-200 flex flex-col p-6 shadow-lg bg-gradient-to-t to-[#023047] from-[#023047] rounded-2xl"
          onClick={() => navigateToId("high_performance")}
        >
          <span className="text-white text-subtitle font-bold">
            Comportamiento
          </span>
          <span className="text-white text-normal">Status general</span>
          <span className="bg-white px-3 text-black text-normal rounded-2xl mt-3">
            Ver
          </span>
        </button>
        <AddDealer />
      </div>
    </div>
  );
}
