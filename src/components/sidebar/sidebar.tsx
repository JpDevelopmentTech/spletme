import { NavLink } from "react-router-dom";
import HomeIcon from "../../assets/images/1 - HOME ICON.png";
import MusicIcon from "../../assets/images/CANCIONES.svg";
import DistribuidoresIcon from '../../assets/images/DISTRIBUIDORES.svg'
import ColaboradoresIcon from '../../assets/images/COLABORADORES.svg'
import IngresosIcon from '../../assets/images/INGRESOS.svg'
import GastosIcon from '../../assets/images/GASTOS.svg'
import BalanceIcon from '../../assets/images/BALANCE.svg'
import PagosIcon from '../../assets/images/PAGOS.svg'
import Logo from "../../assets/images/2 - BLANCO.png";
import logo from "../../assets/images/5 - LOGO.png";
import { useAuth0 } from "@auth0/auth0-react";
export default function Sidebar() {
  const {user} = useAuth0()

  
  
  return (
    <>
      <div className="lg:w-80  w-full lg:fixed  left-0 lg:h-full p-9 bg-[#FBFBFB]  lg:flex flex-col overflow-y-auto z-20 animate-fade ">
        <div className="w-8 h-10 flex items-center mb-5" onClick={close}>
          <img src={logo} alt="" className="w-full h-full" />
        </div>
        <div className="flex flex-col">
          
        <span className="font-bold text-subtitle text-septenary">¡Bienvenido!</span>
        <span className="font-bold text-title">{user?.name}</span>
        <span className="text-xs text-neutral-400">ID: #JKE2365</span>
        </div>
        <div className="w-full h-full flex flex-col mt-6  ">
          <span className="text-septenary mb-2 text-subtitle">Musica</span>
          <NavLink
          onClick={close}
            to={"/panel/home"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6  text-subtitle  "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  font-medium text-subtitle"
            }
          >
            <>
              <img src={HomeIcon} alt="" className="w-5 h-5 " />
              <span>Inicio</span>
            </>
          </NavLink>

          <NavLink
          onClick={close}
            to={"/panel/music"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6  text-subtitle "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  font-medium text-subtitle"
            }
          >
            <>
              <img src={MusicIcon} alt="" className="w-5 h-5 " />
              <span>Musica</span>
            </>
          </NavLink>
          <NavLink
          onClick={close}
            to={"/panel/dealers"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6  text-subtitle "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  font-medium text-subtitle"
            }
          >
            <>
              <img src={DistribuidoresIcon} alt="" className="w-5 h-5 " />
              <span>Distribuidores</span>
            </>
          </NavLink>
          <NavLink
          onClick={close}
            to={"/panel/collaborators"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6  text-subtitle "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  font-medium text-subtitle"
            }
          >
            <>
              <img src={ColaboradoresIcon} alt="" className="w-5 h-5 " />
              <span>Colaboradores</span>
            </>
          </NavLink>
         
        </div>
        <div className="w-full h-full flex flex-col mt-6  ">
          <span className="text-septenary mb-2">Reportes</span>

          <NavLink
          onClick={close}
            to={"/panel/income"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6  text-subtitle "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  font-medium text-subtitle"
            }
          >
            <>
              <img src={IngresosIcon} alt="" className="w-5 h-5 " />
              <span>Ingresos</span>
            </>
          </NavLink>
          <NavLink
          onClick={close}
            to={"/panel/bills"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6  text-subtitle "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  font-medium text-subtitle"
            }
          >
            <>
              <img src={GastosIcon} alt="" className="w-5 h-5 " />
              <span>Gastos</span>
            </>
          </NavLink>
          <NavLink
          onClick={close}
            to={"/panel/balance"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6  text-subtitle "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  font-medium text-subtitle"
            }
          >
            <>
              <img src={BalanceIcon} alt="" className="w-5 h-5 " />
              <span>Balance</span>
            </>
          </NavLink>
          <NavLink
          onClick={close}
            to={"/panel/pagos"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6  text-subtitle "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  font-medium text-subtitle"
            }
          >
            <>
              <img src={PagosIcon} alt="" className="w-5 h-5 " />
              <span>Pagos</span>
            </>
          </NavLink>
        </div>

        <div className="6">
          <span>Descarga nuestra app</span>
          <div className="flex gap-2 mt-2">
            <a href="">
              <img
                className="w-28 h-10"
                src="data:image/png;base64,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  "
                alt=""
              />
            </a>
            <a href="">
              <img
                className="w-32 h-10"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                alt=""
              />
            </a>
          </div>
        </div>
        <div className="w-full my-6  flex">
          <img src={Logo} alt="logo splet me" className="w-36" />
        </div>
      </div>
    </>
  );
}
