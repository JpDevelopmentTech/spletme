import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserIcon from "../../assets/images/Mesa de trabajo 28.svg";
import Sidebar from "../../components/sidebar/sidebar";
import { useAuth0 } from "@auth0/auth0-react";
import { SpotifyService } from "../../services/spotify";
import {
  Drawer,
  DrawerOptions,
  initDropdowns,
  InstanceOptions,
} from "flowbite";

export default function Panel() {

  const {logout} = useAuth0();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const SignInSpotify = async () => {
      await SpotifyService.getAccessToken();
    };

    SignInSpotify();
    flowbite();

    return () => {};
  }, []);

  const flowbite = () => {
    initDropdowns();
  };

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
      override: true,
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
              <button
                type="button"
                data-dropdown-toggle="notification-dropdown"
                className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">View notifications</span>

                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 14 20"
                >
                  <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
                </svg>
              </button>

              <div
                className="hidden overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white rounded divide-y divide-gray-100 shadow-lg dark:divide-gray-600 dark:bg-gray-700"
                id="notification-dropdown"
              >
                <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  Notifications
                </div>
                <div>
                  <a
                    href="#"
                    className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-11 h-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                        alt="Bonnie Green avatar"
                      />
                      <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 rounded-full border border-white bg-primary-700 dark:border-gray-700">
                        <svg
                          className="w-2 h-2 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 18"
                        >
                          <path d="M15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783ZM6 2h6a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm7 5H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Z" />
                          <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="pl-3 w-full">
                      <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                        New message from{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Bonnie Green
                        </span>
                        : "Hey, what's up? All set for the presentation?"
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        a few moments ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-11 h-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                        alt="Jese Leos avatar"
                      />
                      <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-gray-900 rounded-full border border-white dark:border-gray-700">
                        <svg
                          className="w-2 h-2 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="pl-3 w-full">
                      <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Jese leos
                        </span>{" "}
                        and{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          5 others
                        </span>{" "}
                        started following you.
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        10 minutes ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-11 h-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
                        alt="Joseph McFall avatar"
                      />
                      <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-red-600 rounded-full border border-white dark:border-gray-700">
                        <svg
                          className="w-2 h-2 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          {" "}
                          <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />{" "}
                        </svg>
                      </div>
                    </div>
                    <div className="pl-3 w-full">
                      <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Joseph Mcfall
                        </span>{" "}
                        and{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          141 others
                        </span>{" "}
                        love your story. See it and view more stories.
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        44 minutes ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-11 h-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png"
                        alt="Roberta Casas image"
                      />
                      <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-green-400 rounded-full border border-white dark:border-gray-700">
                        <svg
                          className="w-2 h-2 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="pl-3 w-full">
                      <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Leslie Livingston
                        </span>{" "}
                        mentioned you in a comment:{" "}
                        <span className="font-medium text-primary-700 dark:text-primary-500">
                          @bonnie.green
                        </span>{" "}
                        what do you say?
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        1 hour ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-11 h-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/robert-brown.png"
                        alt="Robert image"
                      />
                      <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-purple-500 rounded-full border border-white dark:border-gray-700">
                        <svg
                          className="w-2 h-2 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 14"
                        >
                          <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="pl-3 w-full">
                      <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Robert Brown
                        </span>{" "}
                        posted a new video: Glassmorphism - learn how to
                        implement the new design trend.
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        3 hours ago
                      </div>
                    </div>
                  </a>
                </div>
                <a
                  href="#"
                  className="block py-2 text-base font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline"
                >
                  <div className="inline-flex items-center ">
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path
                        fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    View all
                  </div>
                </a>
              </div>

              <button
                className="w-10 h-10 rounded-full bg-slate-300"
                onClick={() => {
                  initMenuUser().show();
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
        className="fixed z-40 h-screen w-80 overflow-y-auto bg-white p-4 dark:bg-gray-800 flex flex-col justify-between"
        tabIndex={-1}
        aria-labelledby="drawer-js-label"
      >
        <div>
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
        <div>
          <button
            type="button"
            onClick={() => logout({
              logoutParams: {
                returnTo: window.location.origin,
              }
            })}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </>
  );
}
