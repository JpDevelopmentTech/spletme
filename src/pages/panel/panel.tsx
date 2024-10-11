import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserIcon from "../../assets/images/Mesa de trabajo 28.svg";
import Sidebar from "../../components/sidebar/sidebar";
import { SpotifyService } from "../../services/spotify";
import { Drawer, DrawerOptions, InstanceOptions } from "flowbite";
export default function Panel() {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const SignInSpotify = async () => {
      await SpotifyService.getAccessToken();
    };

    SignInSpotify();

    return () => {};
  }, []);

  const initMenuUser = () => {
    const userMenu = document.getElementById("user-menu");
    const options: DrawerOptions = {
      placement: "right",
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      edgeOffset: "",
      backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30",
      onHide: () => {
        console.log("drawer is hidden");
      },
      onShow: () => {
        console.log("drawer is shown");
      },
      onToggle: () => {
        console.log("drawer has been toggled");
      },
    };

    const instanceOptions: InstanceOptions = {
      id: "user-menu",
      override: true
    };

    return new Drawer(userMenu, options, instanceOptions);
  };

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
                  initMenuUser().show()
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
      <div
        id="user-menu"
        className="fixed z-40 h-screen w-80 overflow-y-auto bg-white p-4 dark:bg-gray-800"
        tabIndex={-1}
        aria-labelledby="drawer-js-label"
      >
        <h5
          id="drawer-js-label"
          className="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
        >
          <svg
            className="me-2 h-5 w-5"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Info
        </h5>
        <button
          onClick={() => {
            initMenuUser().hide();
          }}
          type="button"
          aria-controls="drawer-example"
          className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Supercharge your hiring by taking advantage of our
          <a
            href="#"
            className="font-medium text-blue-600 underline hover:no-underline dark:text-blue-500"
          >
            limited-time sale
          </a>
          for Flowbite Docs + Job Board. Unlimited access to over 190K
          top-ranked candidates and the #1 design job board.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="#"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Learn more
          </a>
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Get access
            <svg
              className="ms-2 h-3.5 w-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
