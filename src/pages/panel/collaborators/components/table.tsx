import { Link } from "react-router-dom";

export default function Table() {
  return (
    <div className="overflow-x-auto col-span-12">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
            <th scope="col" className="px-4 py-3 min-w-[14rem] text-center">
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
          <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-4 py-2 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <Link to={'s'} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                5
              </span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                10%
              </span>
            </td>
            <td className="px-4 py-2 font-medium whitespace-nowrap">
              <div className="flex -space-x-4 w-full justify-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
              </div>
            </td>
            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-septenary dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500 dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
              $00,00
            </td>
          </tr>
          <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-4 py-2 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <Link to={'s'} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                5
              </span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                10%
              </span>
            </td>
            <td className="px-4 py-2 font-medium whitespace-nowrap">
              <div className="flex -space-x-4 w-full justify-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
              </div>
            </td>
            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-septenary dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500 dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
              $00,00
            </td>
          </tr>
          <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-4 py-2 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <Link to={'s'} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                5
              </span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                10%
              </span>
            </td>
            <td className="px-4 py-2 font-medium whitespace-nowrap">
              <div className="flex -space-x-4 w-full justify-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
              </div>
            </td>
            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-septenary dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500 dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
              $00,00
            </td>
          </tr>
          <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-4 py-2 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <Link to={'s'} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                5
              </span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                10%
              </span>
            </td>
            <td className="px-4 py-2 font-medium whitespace-nowrap">
              <div className="flex -space-x-4 w-full justify-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
              </div>
            </td>
            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-septenary dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500 dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
              $00,00
            </td>
          </tr>
          <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-4 py-2 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <Link to={'s'} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                5
              </span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                10%
              </span>
            </td>
            <td className="px-4 py-2 font-medium whitespace-nowrap">
              <div className="flex -space-x-4 w-full justify-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
              </div>
            </td>
            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-septenary dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500 dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
              $00,00
            </td>
          </tr>
          <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="px-4 py-2 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  onClick={() => null}
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <Link to={'s'} className="flex items-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <span className="ml-3">Nombre del colaborador</span>
              </Link>
            </th>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                5
              </span>
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                10%
              </span>
            </td>
            <td className="px-4 py-2 font-medium whitespace-nowrap">
              <div className="flex -space-x-4 w-full justify-center">
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
                <img
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                  alt=""
                  className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                />
              </div>
            </td>
            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-septenary dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs">
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-500 dark:text-white"
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
            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
              $00,00
            </td>
          </tr>
         
        </tbody>
      </table>
    </div>
  );
}
