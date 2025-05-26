import CardSong from "../../../components/cardsong/cardsong";
import {  useState } from "react";
import { Link } from "react-router-dom";
import CardAlbum from "./song/components/cardAlbum";
import { motion } from "framer-motion";
import UploadModal from "./components/UploadModal";
import {Music as MusicIcon,Disc, Search, Upload, Loader2 } from "lucide-react";
import UseSongs from "../../../hooks/useSongs";



export default function Music() {
  const [mode, setMode] = useState<"songs" | "albums">("songs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { songs, uploadSongs, loading, getSongs } = UseSongs();

  const handleFileSelect = async (file: File) => {
    // Here you can handle the file upload
    // For example, you could send it to your backend
    const formData = new FormData();
    formData.append('csvFile', file);
    await uploadSongs(formData);
    setIsModalOpen(false);
    getSongs();
  };


 
  return (
    <>
    {loading ? (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    ): (
      <>
          <div className="animate-fade-left">
        <div className="w-full flex flex-col">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
              <motion.button
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  mode === 'songs' 
                    ? 'bg-quinary text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setMode('songs')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  backgroundColor: mode === 'songs' ? '#FF4800' : '#ffffff'
                }}
              >
                <MusicIcon size={18} />
                Canciones
              </motion.button>
              <motion.button
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  mode === 'albums'
                    ? 'bg-quinary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setMode('albums')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  backgroundColor: mode === 'albums' ? '#FF4800' : '#ffffff'
                }}
              >
                <Disc size={18} />
                Álbumes
              </motion.button>
            </div>
          </div>
          {songs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full mt-10">
              <MusicIcon size={100} color="gray"/>
              <h1 className="text-2xl font-bold text-gray-500">No songs found</h1>
            </div>
          )}
          {mode === "songs" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
              <CardSong song={songs[0]} />
              <CardSong song={songs[1]} />
              <CardSong song={songs[2]} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
              <CardAlbum album={songs[0]} />
              <CardAlbum album={songs[1]} />
              <CardAlbum album={songs[2]} />
            </div>
          )}
        </div>

        <div className="border-b dark:border-gray-700 mx-4 mt-3">
          <div className="flex items-center justify-between space-x-4 pt-3">
            <div className="flex-1 flex items-center space-x-3">
              <h5 className="dark:text-white font-semibold">All Songs</h5>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <Upload size={18} />
                Upload Songs
              </motion.button>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row items-center justify-between md:space-x-4 py-3">
            <div className="w-full lg:w-2/3 flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center">
              <form className="w-full md:max-w-sm flex-1 md:mr-4">
                <label
                  htmlFor="default-search"
                  className="text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search..."
                  />
                  <button
                    type="submit"
                    className="text-white absolute right-0 bottom-0 top-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-r-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
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
                  Cancion
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Porcentaje
                </th>
                <th scope="col" className="px-4 py-3">
                  Colaboradores
                </th>
                <th scope="col" className="px-4 py-3 min-w-[14rem] text-center">
                  Propietario
                </th>
                <th scope="col" className="px-4 py-3">
                  Distribuidor
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Fecha de lanzamiento
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {songs.length === 0 && (
                <tr>
                  <td colSpan={100} className="text-center">
                    No songs found
                  </td>
                </tr>
              )}
              {mode === "songs" && (
                <>
                  {songs.map((song: any) => (
                    <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 w-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            onClick={() => null}
                            className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                        <Link to={"/panel/song/s"}>{song.trackTitle}</Link>
                      </th>
                      <td className="px-4 py-2 whitespace-nowrap text-center">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                          0%
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex -space-x-4 w-28">
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-3.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                          <a
                            href="#"
                            className="flex-shrink-0 flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                          >
                            +5
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium whitespace-nowrap">
                        <div className="flex -space-x-4 w-full justify-center">
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex -space-x-4 w-full justify-center">
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
                        23 Nov 2022
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
                    </tr>
                  ))}
                </>
              )}

              {mode === "albums" && (
                <>
                  {songs.map((album) => (
                    <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 w-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            onClick={() => null}
                            className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                        <Link to={"/panel/song/s"}>{}</Link>
                      </th>
                      <td className="px-4 py-2 whitespace-nowrap text-center">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300 text-center">
                          0%
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex -space-x-4 w-28">
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-3.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                          <a
                            href="#"
                            className="flex-shrink-0 flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                          >
                            +5
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium whitespace-nowrap">
                        <div className="flex -space-x-4 w-full justify-center">
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-10.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex -space-x-4 w-full justify-center">
                          <img
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/avatar-1.png"
                            alt=""
                            className="w-10 h-10 flex-shrink-0 border-2 border-white rounded-full dark:border-gray-800"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs text-center">
                        23 Nov 2022
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
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span className="font-semibold text-gray-900 dark:text-white">
              1-10
            </span>
            of
            <span className="font-semibold text-gray-900 dark:text-white">
              1000
            </span>
          </span>
          <ul className="inline-flex items-stretch -space-x-px">
            <li>
              <a
                href="#"
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                ...
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                100
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={handleFileSelect}
      />
      </>
    )}
    
    </>
  );
}
