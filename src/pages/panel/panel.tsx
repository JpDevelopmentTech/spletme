import { useState } from "react";
import { Outlet } from "react-router-dom";
import UserIcon from '../../assets/images/Mesa de trabajo 28.svg'
import lupaIcon from '../../assets/images/Mesa de trabajo 16.svg'
import Sidebar from "../../components/sidebar/sidebar";
export default function Panel() {
  const [showMenu, setShowMenu] = useState(false);






  return (
    <>
      <div className="w-full h-screen bg-[#FFFFFF] bg-no-repeat bg-cover flex font-custom relative">
        <Sidebar />
        <div className="w-full h-full overflow-y-auto">
          <div className="w-full border-b-2 h-24 flex items-center justify-between p-6 gap-12">
            

          
            <div className="w-1/3 py-3 bg-senary rounded-full flex items-center gap-3 mr-12 px-6">
              
              <img src={lupaIcon} alt="" className="w-7"/>
              <input
                type="text"
                placeholder="Buscar"
                className="bg-transparent w-full focus-visible:outline-none"
              />
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
              ><img src={UserIcon} alt="" /></button>
            </div>
          </div>
          <div className="p-6 ">
            <Outlet />
          </div>
        </div>
        {showMenu && (
          <div className="fixed w-full h-screen bg-black/40 z-20">
            <div className="absolute w-96 h-full bg-white right-0 top-0 rounded-2xl ">
              <button onClick={() => {
                setShowMenu(!showMenu);
              }}>Atras</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
