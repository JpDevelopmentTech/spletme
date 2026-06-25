import { useEffect, useState } from "react";

export default function ImgTop({ activeImg }: { activeImg: string }) {
  const [primary, setPrimaryColorDominant] = useState("rgb(0,0,0)");
  const [secondary, setSecondaryColorDominant] = useState("rgb(0,0,0)");

  useEffect(() => {
    const GetDominantColor = () => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = activeImg;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;
        const colorsFrequency: { [key: string]: number } = {};

        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
          const rgb = `${r},${g},${b}`;
          colorsFrequency[rgb] = (colorsFrequency[rgb] || 0) + 1;
        }

        const colorsSorted = Object.keys(colorsFrequency).sort(
          (a, b) => colorsFrequency[b] - colorsFrequency[a],
        );

        setPrimaryColorDominant(`rgb(${colorsSorted[0]})`);
        setSecondaryColorDominant(
          `rgb(${colorsSorted[colorsSorted.length - 1]})`,
        );
      };
    };

    GetDominantColor();
  }, [activeImg]);

  return (
    <>
      <div
        className="col-span-6 flex flex-col justify-between gap-3 rounded-lg bg-opacity-50 p-6 text-white bg-blend-saturation shadow-lg text-shadow-lg"
        style={{
          background: `linear-gradient(35deg, ${primary} 0%, ${secondary} 100%)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-title font-bold">El vega Life</span>
            <span className="text-normal">Fecha de vinculacion + ID</span>
          </div>
          <div>
            <button className="rounded-full bg-quinary px-5 py-1 text-normal">
              Detalles
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col items-center border-r border-white p-3 text-center">
            <span className="text-title font-bold text-white">5</span>
            <span className="text-subtitle font-bold text-white">
              Canciones
            </span>
            <span className="text-normal text-white">
              Proyectos en conjunto
            </span>
          </div>
          <div className="flex flex-col items-center border-white p-3 text-center">
            <span className="text-title font-bold text-white">39%</span>
            <span className="text-subtitle font-bold text-white">
              Colaboracion
            </span>
            <span className="text-normal text-white">Porcentaje general</span>
          </div>
          <div className="flex flex-col items-center border-l border-white p-3 text-center">
            <span className="text-title font-bold text-white">$5.892,00</span>
            <span className="text-subtitle font-bold text-white">
              Ganancias
            </span>
            <span className="text-normal text-white">
              Desde la fecha de vinculacion
            </span>
          </div>
        </div>
      </div>
      <div
        className="relative col-span-3 h-full w-full overflow-hidden rounded-lg p-6 text-white"
        style={{
          background: `linear-gradient(0deg, ${primary} 0%, ${secondary} 100%)`,
        }}
      >
        <div className="flex flex-col text-shadow-lg">
          <span className="text-subtitle">Collaborator Money In</span>
          <span className="text-normal">5 Estrellas</span>
          <span>🤍🤍🤍🤍🤍</span>
        </div>
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 text-shadow-xl">
          <span className="text-5xl text-white">Top</span>
          <span className="text-6xl font-bold text-white">10</span>
        </div>
        <img
          src={activeImg}
          alt=""
          className="absolute -bottom-4 -right-4 h-36 w-36 rounded-full"
        />
      </div>
    </>
  );
}
