import { useState } from "react";

export default function AddDealer() {
  const [showDealersModal, setShowDealersModal] = useState(false);
  return (
    <>
      {showDealersModal && (
        <div className="fixed z-20 w-full h-screen flex items-center justify-center bg-black/60 left-0 top-0 ">
          <div className="bg-white px-10 py-3 rounded-2xl  animate-fade-left">
            <div className="w-full flex justify-between items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 24 24"
                className="cursor-pointer"
                onClick={() => setShowDealersModal(false)}
              >
                <path
                  fill="currentColor"
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"
                />
              </svg>
              <span className="text-title text-center w-full font-bold text-quinary">
                Añadir distribuidora
              </span>
            </div>
            <div className="my-6 grid grid-cols-2 gap-6">
              <button className="flex  items-center justify-start gap-3 p-3 border w-full rounded-2xl">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="rounded-full w-12"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex  items-center justify-start gap-3 p-3 border w-full rounded-2xl">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="rounded-full w-12"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex  items-center justify-start gap-3 p-3 border w-full rounded-2xl">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="rounded-full w-12"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex  items-center justify-start gap-3 p-3 border w-full rounded-2xl">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="rounded-full w-12"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex  items-center justify-start gap-3 p-3 border w-full rounded-2xl">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="rounded-full w-12"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex  items-center justify-start gap-3 p-3 border w-full rounded-2xl">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="rounded-full w-12"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="border rounded-2xl col-span-3 flex items-center justify-center gap-3 hover:scale-105 duration-200 shadow-lg"
        onClick={() => setShowDealersModal(true)}
      >
        <div className="rounded-full w-10 h-10 bg-quinary text-white text-title flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14m-7 7V5"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-subtitle font-bold">Agregar</span>
          <span className="text-normal">Distribuidor</span>
        </div>
      </button>
    </>
  );
}
