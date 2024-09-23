/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Data({ data }: { data: any }) {
  return (
    <div className="col-span-5 border-l px-10">
      <div className="flex justify-between items-center">
        <span className="text-title font-bold">Data</span>
        <button
          className="text-quinary font-bold text-subtitle"
          onClick={() => {
            document
              .getElementById("data-valora")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Ver mas
        </button>
      </div>
      <div className="flex flex-col border-b py-5">
        <span>&copy; 2021 Martha Paredes</span>
        <span>&copy; 2021 Martha Paredes</span>
      </div>
      <div className="py-5">
        <div className="flex justify-between items-center">
          <span className="font-bold">UPC:</span>
          <span>000000000</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">ISRC:</span>
          <span>{data?.external_ids.isrc}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Lanzamiento:</span>
          <span>10 Julio 2023</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Duracion:</span>
          <span>02:54</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Sello:</span>
          <span>SplitMe</span>
        </div>
      </div>
    </div>
  );
}
