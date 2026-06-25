import { KeyboardEvent } from "react";

const Step2 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const focusNextInput = (
    currentInput: KeyboardEvent<HTMLInputElement>,
    prevInputId: string,
    nextInputId: string,
  ) => {
    const prevInput = document.getElementById(prevInputId);
    const nextInput = document.getElementById(nextInputId);
    if (currentInput.key === "Backspace") {
      if (prevInput) {
        prevInput.focus();
      }
    } else {
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  return (
    <div className="w-full">
      <div className="mx-auto flex items-center px-4 md:w-[42rem] md:px-8 xl:px-0">
        <div className="w-full">
          <div className="mb-8 flex items-center justify-center space-x-4 lg:hidden">
            <a href="#" className="flex items-center text-2xl font-semibold">
              <img
                className="mr-2 h-8 w-8"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              />
              <span className="text-gray-900 dark:text-white">Flowbite</span>
            </a>
          </div>
          <h1 className="leding-tight mb-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Verifica tu whatsapp
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            Nosotros enviamos un código de verificación a{" "}
            <span className="font-medium text-gray-900 dark:text-white">+1 555-555-5555</span>. Por
            favor, ingresa el código a continuación.
          </p>
          <form action="#">
            <div className="my-4 flex space-x-2 sm:space-x-4 md:my-6">
              <div>
                <label htmlFor="code-1" className="sr-only">
                  First code
                </label>
                <input
                  type="text"
                  maxLength={1}
                  onKeyUp={(e) => {
                    focusNextInput(e, "code-1", "code-2");
                  }}
                  id="code-1"
                  className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                  required
                />
              </div>
              <div>
                <label htmlFor="code-2" className="sr-only">
                  Second code
                </label>
                <input
                  type="text"
                  maxLength={1}
                  onKeyUp={(e) => {
                    focusNextInput(e, "code-1", "code-3");
                  }}
                  id="code-2"
                  className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                  required
                />
              </div>
              <div>
                <label htmlFor="code-3" className="sr-only">
                  Third code
                </label>
                <input
                  type="text"
                  maxLength={1}
                  onKeyUp={(e) => {
                    focusNextInput(e, "code-2", "code-4");
                  }}
                  id="code-3"
                  className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                  required
                />
              </div>
              <div>
                <label htmlFor="code-4" className="sr-only">
                  Fourth code
                </label>
                <input
                  type="text"
                  maxLength={1}
                  onKeyUp={(e) => {
                    focusNextInput(e, "code-3", "code-5");
                  }}
                  id="code-4"
                  className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                  required
                />
              </div>
              <div>
                <label htmlFor="code-5" className="sr-only">
                  Fivth code
                </label>
                <input
                  type="text"
                  maxLength={1}
                  onKeyUp={(e) => {
                    focusNextInput(e, "code-4", "code-6");
                  }}
                  id="code-5"
                  className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                  required
                />
              </div>
              <div>
                <label htmlFor="code-6" className="sr-only">
                  Sixth code
                </label>
                <input
                  type="text"
                  maxLength={1}
                  onKeyUp={(e) => {
                    focusNextInput(e, "code-5", "code-6");
                  }}
                  id="code-6"
                  className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-gray-500 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                  required
                />
              </div>
            </div>
            <p className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400 md:mb-6">
              El token tiene una expiración de 5 minutos.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-full items-center rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:py-3.5"
              >
                Anterior: Distribuidor
              </button>
              <button
                type="submit"
                onClick={nextStep}
                className="w-full rounded-lg bg-gray-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:py-3.5"
              >
                Verificar cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step2;
