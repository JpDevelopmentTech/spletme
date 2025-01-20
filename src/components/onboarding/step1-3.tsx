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
      <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:mb-6 leding-tight dark:text-white">
        Elige tu distribuidor
      </h1>
      <div className="flex items-center gap-9">
        <div>
          <input
            type="radio"
            id="believe"
            name="profession"
            value="believe"
            className="hidden peer"
            onChange={() => setSelectedDistributor("believe")}
            required
          />
          <label
            htmlFor="believe"
            className="inline-flex items-center justify-center w-32 h-32 p-5 text-gray-500 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary peer-checked:text-primary bg-gray-50 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
            className="hidden peer"
            onChange={(e) => setSelectedDistributor(e.target.value)}
            required
          />
          <label
            htmlFor="onerpm"
            className="inline-flex items-center justify-center w-32 h-32 p-5 text-gray-500 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary peer-checked:text-primary bg-gray-50 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
            className="hidden peer"
            onChange={(e) => setSelectedDistributor(e.target.value)}
            required
          />
          <label
            htmlFor="orchard"
            className="inline-flex items-center justify-center w-32 h-32 p-5 text-gray-500 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary peer-checked:text-primary bg-gray-50 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
            className="hidden peer"
            onChange={(e) => setSelectedDistributor(e.target.value)}
            required
          />
          <label
            htmlFor="symphonic"
            className="inline-flex items-center justify-center w-32 h-32 p-5 text-gray-500 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary peer-checked:text-primary bg-gray-50 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
            <div className="grid gap-5 my-6 sm:grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Correo electronico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="admin@admin.com"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="*********"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="flex space-x-3 mt-12">
        <button
          onClick={prevStep}
          className="text-center items-center w-full py-2.5 sm:py-3.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Atras: Detalles de la cuenta
        </button>
        <button
          onClick={nextStep}
          type="submit"
          className="w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 sm:py-3.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Proxima: Verificacion de cuenta
        </button>
      </div>
    </div>
  );
};

export default Step13;
