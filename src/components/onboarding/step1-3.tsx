import believeLogo from "../../assets/images/believe.png";
import onerpmLogo from "../../assets/images/ONErpm.svg.png";
import theorchardLogo from "../../assets/images/The_Orchard_Logo.svg.png";
import symphonicLogo from "../../assets/images/SymPhoNic_Logo_Square_BGwhite_BlackText-1024x1024.png";
import { useState } from "react";

const Step13 = ({
  nextStep,
  prevStep,
}: {
  nextStep: VoidFunction;
  prevStep: VoidFunction;
}) => {
  const [selectedDistributor, setSelectedDistributor] = useState<
    string | null
  >();

  return (
    <div>
      <h1 className="leding-tight mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:mb-6">
        Elige tu distribuidor
      </h1>
      <div className="flex items-center gap-9">
        <div>
          <input
            type="radio"
            id="believe"
            name="profession"
            value="believe"
            className="peer hidden"
            onChange={() => setSelectedDistributor("believe")}
            required
          />
          <label
            htmlFor="believe"
            className="inline-flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-gray-500 peer-checked:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-500"
          >
            <img
              src={believeLogo}
              alt="believe"
              className="h-full w-full object-contain"
            />
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="onerpm"
            name="profession"
            value="onerpm"
            className="peer hidden"
            onChange={(e) => setSelectedDistributor(e.target.value)}
            required
          />
          <label
            htmlFor="onerpm"
            className="inline-flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-gray-500 peer-checked:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-500"
          >
            <img
              src={onerpmLogo}
              alt="believe"
              className="h-full w-full object-contain"
            />
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="orchard"
            name="profession"
            value="orchard"
            className="peer hidden"
            onChange={(e) => setSelectedDistributor(e.target.value)}
            required
          />
          <label
            htmlFor="orchard"
            className="inline-flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-gray-500 peer-checked:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-500"
          >
            <img
              src={theorchardLogo}
              alt="believe"
              className="h-full w-full object-contain"
            />
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="symphonic"
            name="profession"
            value="symphonic"
            className="peer hidden"
            onChange={(e) => setSelectedDistributor(e.target.value)}
            required
          />
          <label
            htmlFor="symphonic"
            className="inline-flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-gray-500 peer-checked:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-500"
          >
            <img
              src={symphonicLogo}
              alt="believe"
              className="h-full w-full object-contain"
            />
          </label>
        </div>
      </div>
      {selectedDistributor && (
        <div>
          <form action="#">
            <div className="my-6 grid gap-5 sm:grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Correo electronico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="admin@admin.com"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="*********"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="mt-12 flex space-x-3">
        <button
          onClick={prevStep}
          className="w-full items-center rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:py-3.5"
        >
          Atras: Detalles de la cuenta
        </button>
        <button
          onClick={nextStep}
          type="submit"
          className="w-full rounded-lg bg-gray-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:py-3.5"
        >
          Proxima: Verificacion de cuenta
        </button>
      </div>
    </div>
  );
};

export default Step13;
