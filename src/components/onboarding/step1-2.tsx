import { useState } from "react";
import Select from "react-select";

interface CountryOption {
  value: string;
  label: string;
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { value: "USA", label: "USA" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "ES", label: "Spain" },
  { value: "JP", label: "Japan" },
  { value: "AUS", label: "Australia" },
];

const Step12 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const [country, setCountry] = useState<CountryOption | null>(null);

  return (
    <div>
      <h1 className="leding-tight mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:mb-6">
        Detalles de la cuenta
      </h1>
      <form action="#">
        <div className="my-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Pais
            </label>
            <Select<CountryOption>
              unstyled
              inputId="country"
              options={COUNTRY_OPTIONS}
              value={country}
              onChange={setCountry}
              placeholder="Selecciona tu pais"
              noOptionsMessage={() => "Sin resultados"}
              isClearable
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 10000 }) }}
              classNames={{
                control: ({ isFocused }) =>
                  `flex w-full items-center rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 dark:bg-gray-700 dark:text-white ${
                    isFocused
                      ? "border-gray-500 ring-1 ring-gray-500 dark:border-gray-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`,
                valueContainer: () => "flex flex-1 flex-wrap items-center gap-1",
                placeholder: () => "text-gray-500 dark:text-gray-400",
                dropdownIndicator: () => "px-1 text-gray-400",
                clearIndicator: () => "px-1 text-gray-400 hover:text-gray-600",
                menu: () =>
                  "mt-1 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700",
                option: ({ isSelected, isFocused }) =>
                  `cursor-pointer px-3 py-2 text-sm ${
                    isSelected
                      ? "bg-gray-600 text-white"
                      : isFocused
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white"
                        : "text-gray-900 dark:text-white"
                  }`,
                noOptionsMessage: () => "px-3 py-2 text-sm text-gray-500 dark:text-gray-400",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="phone-number"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Numero de telefono
            </label>
            <input
              type="number"
              name="phone-number"
              id="phone-number"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="123 567 890"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Direccion de residencia
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Cr 32 Cll 2"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Numero de identificación
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-600 focus:ring-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="123456789"
            />
          </div>
        </div>
        <div className="mb-6 space-y-3">
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="terms"
                aria-describedby="terms"
                type="checkbox"
                className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                Al registrarte, estás creando una cuenta de Flowbite y aceptas los{" "}
                <a
                  className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                  href="#"
                >
                  Términos de Uso
                </a>{" "}
                y la{" "}
                <a
                  className="font-medium text-gray-600 hover:underline dark:text-gray-500"
                  href="#"
                >
                  Política de Privacidad
                </a>{" "}
                de Flowbite.
              </label>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="newsletter"
                aria-describedby="newsletter"
                type="checkbox"
                className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="newsletter" className="font-light text-gray-500 dark:text-gray-300">
                Enviame correos con informacion de actualizaciones
              </label>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={prevStep}
            className="w-full items-center rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:py-3.5"
          >
            Atras: Informacion personal
          </button>
          <button
            onClick={nextStep}
            type="submit"
            className="w-full rounded-lg bg-gray-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:py-3.5"
          >
            Proximo: Distribuidor
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step12;
