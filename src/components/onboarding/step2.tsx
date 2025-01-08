import { KeyboardEvent } from "react";

const Step2 = ({
    nextStep,
    prevStep
}: {
    nextStep: () => void;
    prevStep: () => void;
}) => {
  const focusNextInput = (
    currentInput: KeyboardEvent<HTMLInputElement>,
    prevInputId: string,
    nextInputId: string
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
      <div className="flex items-center mx-auto md:w-[42rem] px-4 md:px-8 xl:px-0">
        <div className="w-full">
          <div className="flex items-center justify-center mb-8 space-x-4 lg:hidden">
            <a href="#" className="flex items-center text-2xl font-semibold">
              <img
                className="w-8 h-8 mr-2"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              />
              <span className="text-gray-900 dark:text-white">Flowbite</span>
            </a>
          </div>
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900 leding-tight dark:text-white">
            Verifica tu whatsapp
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            Nosotros enviamos un código de verificación a{" "}
            <span className="font-medium text-gray-900 dark:text-white">
                +1 555-555-5555
            </span>
            . Por favor, ingresa el código a continuación.
          </p>
          <form action="#">
            <div className="flex my-4 space-x-2 sm:space-x-4 md:my-6">
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
                  className="block w-12 h-12 py-3 text-2xl font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg sm:py-4 sm:text-4xl sm:w-16 sm:h-16 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                  className="block w-12 h-12 py-3 text-2xl font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg sm:py-4 sm:text-4xl sm:w-16 sm:h-16 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                  className="block w-12 h-12 py-3 text-2xl font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg sm:py-4 sm:text-4xl sm:w-16 sm:h-16 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                  className="block w-12 h-12 py-3 text-2xl font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg sm:py-4 sm:text-4xl sm:w-16 sm:h-16 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                  className="block w-12 h-12 py-3 text-2xl font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg sm:py-4 sm:text-4xl sm:w-16 sm:h-16 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                  className="block w-12 h-12 py-3 text-2xl font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg sm:py-4 sm:text-4xl sm:w-16 sm:h-16 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
            </div>
            <p className="p-4 mb-4 text-sm text-gray-500 rounded-lg bg-gray-50 dark:text-gray-400 md:mb-6 dark:bg-gray-800">
              El token tiene una expiración de 5 minutos.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="text-center items-center w-full py-2.5 sm:py-3.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Prev: Account Info
              </button>
              <button
                type="submit"
                onClick={nextStep}
                className="w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 sm:py-3.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Verify account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step2;
