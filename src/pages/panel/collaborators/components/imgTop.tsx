import { useEffect, useState } from "react";

export default function ImgTop({ activeImg }: { activeImg: string }) {
  const [primary, setPrimaryColorDominant] = useState("rgb(0,0,0)");
  const [secondary, setSecondaryColorDominant] = useState("rgb(0,0,0)");

  useEffect(() => {
    const GetDominantColor = () => {
      const img = document.createElement("img");

      img.src = activeImg;
      const canvas = document.createElement("canvas");

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (!img) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      const colorsFrequency: { [key: string]: number } = {};

      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        const rgb = `${r},${g},${b}`;
        if (colorsFrequency[rgb]) {
          colorsFrequency[rgb] += 1;
        } else {
          colorsFrequency[rgb] = 1;
        }
      }

      const colorsSorted = Object.keys(colorsFrequency).sort(
        (a, b) => colorsFrequency[b] - colorsFrequency[a]
      );

      setPrimaryColorDominant(`rgb(${colorsSorted[0]})`);
      setSecondaryColorDominant(
        `rgb(${colorsSorted[colorsSorted.length - 1]})`
      );
    };
    setTimeout(() => {
      GetDominantColor();
    }, 50);
  }, [activeImg]);

  return (
    <>
      <div
        className="rounded-lg col-span-6 bg-blend-saturation bg-opacity-50 p-6 text-white shadow-lg flex flex-col justify-between gap-3 text-shadow-lg "
        style={{
          background: `linear-gradient(35deg, ${primary} 0%, ${secondary} 100%)`,
        }}
      >
        <div className="flex  justify-between items-center  ">
          <div className="flex flex-col">
            <span className="text-title  font-bold">El vega Life</span>
            <span className="text-normal">Fecha de vinculacion + ID</span>
          </div>
          <div>
            <button className="text-normal bg-quinary px-5 py-1 rounded-full">Detalles</button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col items-center border-r border-white p-3 text-center">
            <span className="text-title text-white font-bold">5</span>
            <span className="text-subtitle text-white font-bold">
              Canciones
            </span>
            <span className="text-normal text-white">
              Proyectos en conjunto
            </span>
          </div>
          <div className="flex flex-col items-center  border-white p-3 text-center">
            <span className="text-title text-white font-bold">39%</span>
            <span className="text-subtitle text-white font-bold">
              Colaboracion
            </span>
            <span className="text-normal text-white">Porcentaje general</span>
          </div>
          <div className="flex flex-col items-center border-l border-white p-3 text-center">
            <span className="text-title text-white font-bold">$5.892,00</span>
            <span className="text-subtitle text-white font-bold">
              Ganancias
            </span>
            <span className="text-normal text-white">
              Desde la fecha de vinculacion
            </span>
          </div>
        </div>
      </div>
      <div
        className="w-full h-full overflow-hidden relative rounded-lg col-span-3 p-6 text-white"
        style={{
          background: `linear-gradient(0deg, ${primary} 0%, ${secondary} 100%)`,
        }}
      >
        <div className="flex flex-col text-shadow-lg">
          <span className="text-subtitle">Collaborator Money In</span>
          <span className="text-normal">5 Estrellas</span>
          <span>🤍🤍🤍🤍🤍</span>
        </div>
        <div className="flex absolute bottom-6 left-6 gap-3 items-center z-10 text-shadow-xl">
          <span className="text-white text-5xl">Top</span>
          <span className="text-white text-6xl font-bold">10</span>
        </div>
        <img
          src={activeImg}
          alt=""
          className="absolute w-36 h-36 rounded-full -bottom-4 -right-4"
        />
      </div>
    </>
  );
}
