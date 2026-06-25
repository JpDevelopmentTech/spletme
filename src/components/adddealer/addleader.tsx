import { useState } from "react";

export default function AddDealer() {
  const [showDealersModal, setShowDealersModal] = useState(false);
  return (
    <>
      {showDealersModal && (
        <div className="fixed left-0 top-0 z-20 flex h-screen w-full items-center justify-center bg-black/60">
          <div className="animate-fade-left rounded-2xl bg-white px-10 py-3">
            <div className="flex w-full items-center justify-between">
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
              <span className="w-full text-center text-title font-bold text-quinary">
                Añadir distribuidora
              </span>
            </div>
            <div className="my-6 grid grid-cols-2 gap-6">
              <button className="flex w-full items-center justify-start gap-3 rounded-2xl border p-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="w-12 rounded-full"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex w-full items-center justify-start gap-3 rounded-2xl border p-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="w-12 rounded-full"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex w-full items-center justify-start gap-3 rounded-2xl border p-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="w-12 rounded-full"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex w-full items-center justify-start gap-3 rounded-2xl border p-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="w-12 rounded-full"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex w-full items-center justify-start gap-3 rounded-2xl border p-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="w-12 rounded-full"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
              <button className="flex w-full items-center justify-start gap-3 rounded-2xl border p-3">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa0EDf2hqneQjVkssK13tE0QjrdXaDA55iEg&s"
                  className="w-12 rounded-full"
                  alt=""
                />
                <span className="text-subtitle">Distribuidora 1</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="col-span-3 flex items-center justify-center gap-3 rounded-2xl border shadow-lg duration-200 hover:scale-105"
        onClick={() => setShowDealersModal(true)}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-quinary text-title text-white">
          <svg
            className="h-6 w-6 text-white dark:text-white"
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
