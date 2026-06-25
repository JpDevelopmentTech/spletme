import { Link } from "react-router-dom";

export default function Table() {
  return (
    <div className="col-span-12 overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-4 py-3">
              Colaborador
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Canciones
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Rendimiento
            </th>
            <th scope="col" className="min-w-[14rem] px-4 py-3 text-center">
              Distribuidores
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Propietario
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Invitado
            </th>
            <th scope="col" className="px-4 py-3 text-center">
              Ultimo pago
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
            <td className="w-4 px-4 py-2">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
            >
              <Link to={"s"} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                5
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                10%
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium">
              <div className="flex w-full justify-center -space-x-4">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-septenary dark:text-white"
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
                    stroke-width="2"
                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-xs font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center text-xs font-medium text-gray-900 dark:text-white">
              $00,00
            </td>
          </tr>
          <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
            <td className="w-4 px-4 py-2">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
            >
              <Link to={"s"} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                5
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                10%
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium">
              <div className="flex w-full justify-center -space-x-4">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-septenary dark:text-white"
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
                    stroke-width="2"
                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-xs font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center text-xs font-medium text-gray-900 dark:text-white">
              $00,00
            </td>
          </tr>
          <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
            <td className="w-4 px-4 py-2">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
            >
              <Link to={"s"} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                5
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                10%
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium">
              <div className="flex w-full justify-center -space-x-4">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-septenary dark:text-white"
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
                    stroke-width="2"
                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-xs font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center text-xs font-medium text-gray-900 dark:text-white">
              $00,00
            </td>
          </tr>
          <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
            <td className="w-4 px-4 py-2">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
            >
              <Link to={"s"} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                5
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                10%
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium">
              <div className="flex w-full justify-center -space-x-4">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-septenary dark:text-white"
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
                    stroke-width="2"
                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-xs font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center text-xs font-medium text-gray-900 dark:text-white">
              $00,00
            </td>
          </tr>
          <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
            <td className="w-4 px-4 py-2">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
            >
              <Link to={"s"} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                5
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                10%
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium">
              <div className="flex w-full justify-center -space-x-4">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-septenary dark:text-white"
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
                    stroke-width="2"
                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-xs font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center text-xs font-medium text-gray-900 dark:text-white">
              $00,00
            </td>
          </tr>
          <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
            <td className="w-4 px-4 py-2">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
            >
              <Link to={"s"} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                5
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center">
              <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2.5 py-0.5 text-center text-xs font-medium">
                10%
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium">
              <div className="flex w-full justify-center -space-x-4">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-septenary dark:text-white"
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
                    stroke-width="2"
                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-xs font-medium text-gray-900 dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-center text-xs font-medium text-gray-900 dark:text-white">
              $00,00
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
