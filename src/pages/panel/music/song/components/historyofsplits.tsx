import { useState } from "react";
import Title from "../../../../../components/title/title";
import Button from "../../../../../components/atoms/button";

const Historyofsplits = () => {
  const [viewData, setViewData] = useState(true);
  return (
    <div className="col-span-12 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center w-full">
        <Title title="Historial de splits" />
        <Button onClick={() => setViewData(!viewData)} type="primary">
          {viewData ? "Ver menos" : "Ver mas"}
        </Button>
      </div>
      {viewData && (
        <div className="flex gap-12 mt-3">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="checkbox-all" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Fecha
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Hora
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Colaborador
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 min-w-[14rem] text-center"
                  >
                    Editado
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
     
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
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      ></input>
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex items-center gap-2">JK Escorcia</div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      $1.200,00
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div className="flex -space-x-4 justify-center">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      Martha Paredes
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
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
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                
                  </td>
                </tr>
                <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 w-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        onClick={() => null}
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      ></input>
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex items-center gap-2">JK Escorcia</div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      $1.200,00
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div className="flex -space-x-4 justify-center">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      Martha Paredes
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
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
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                
                  </td>
                </tr>
                <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 w-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        onClick={() => null}
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      ></input>
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex items-center gap-2">JK Escorcia</div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      $1.200,00
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div className="flex -space-x-4 justify-center">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      Martha Paredes
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
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
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                
                  </td>
                </tr>
                <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 w-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        onClick={() => null}
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      ></input>
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex items-center gap-2">JK Escorcia</div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      $1.200,00
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div className="flex -space-x-4 justify-center">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      Martha Paredes
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
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
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                
                  </td>
                </tr>
                <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 w-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        onClick={() => null}
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      ></input>
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex items-center gap-2">JK Escorcia</div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      $1.200,00
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div className="flex -space-x-4 justify-center">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      Martha Paredes
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
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
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                
                  </td>
                </tr>
                <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 w-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        onClick={() => null}
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded-full border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      ></input>
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex items-center gap-2">JK Escorcia</div>
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      $1.200,00
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <div className="flex -space-x-4 justify-center">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                        alt=""
                        className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300 text-center">
                      Martha Paredes
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
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
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center border p-6 rounded-2xl justify-center">
            <span className="font-semibold">Descargar</span>
            <span className="text-center mt-3 text-sm text-septenary">Has seleccionado 3 fechas</span>
            <div className="mt-12 flex flex-col items-center">
                <span className="text-sm">Escoje el formato</span>
                <div className="flex justify-center mt-3">
                    <Button onClick={() => {}} type="quinary">PDF</Button>
                    <Button onClick={() => {}} type="quinary">Excel</Button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historyofsplits;
