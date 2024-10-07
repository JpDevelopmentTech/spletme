import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserIcon from "../../assets/images/Mesa de trabajo 28.svg";
import Sidebar from "../../components/sidebar/sidebar";
import { SpotifyService } from "../../services/spotify";
export default function Panel() {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const SignInSpotify = async () => {
      await SpotifyService.getAccessToken();
    };

    SignInSpotify();

    return () => {};
  }, []);

  return (
    <>
      <div className="w-full h-screen bg-[#FFFFFF] bg-no-repeat bg-cover flex font-custom relative">
        <Sidebar />
        <div className="w-full h-full ml-80">
          <div className="w-full border-b-2 h-24 flex items-center justify-between p-6 gap-12">
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
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
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
            <div className="flex gap-6 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5rem"
                height="1.5rem"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21 19v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.29c2.97.88 5 3.61 5 6.71v6l2 2m-7 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2"
                />
              </svg>

              <button
                className="w-10 h-10 rounded-full bg-slate-300"
                onClick={() => {
                  setShowMenu(!showMenu);
                }}
              >
                <img src={UserIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </div>
        {showMenu && (
          <div className="fixed w-full h-screen bg-black/40 z-20">
            <div className="absolute w-96 h-full bg-white right-0 top-0 rounded-2xl ">
              <button
                onClick={() => {
                  setShowMenu(!showMenu);
                }}
              >
                Atras
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
