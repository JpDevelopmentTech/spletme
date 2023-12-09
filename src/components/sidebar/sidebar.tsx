import { NavLink } from "react-router-dom";
import HomeIcon from "../../assets/images/1 - HOME ICON.png";
import MusicIcon from "../../assets/images/CANCIONES.svg";
import UltimosLanzamientosIcon from '../../assets/images/ULTIMOS_LANZAMIENTOS.svg'
import DistribuidoresIcon from '../../assets/images/DISTRIBUIDORES.svg'
import ColaboradoresIcon from '../../assets/images/COLABORADORES.svg'
import UltimoAnoIcon from '../../assets/images/ULTIMO_ANO.svg'
import IngresosIcon from '../../assets/images/INGRESOS.svg'
import GastosIcon from '../../assets/images/GASTOS.svg'
import BalanceIcon from '../../assets/images/BALANCE.svg'
import PagosIcon from '../../assets/images/PAGOS.svg'
import Logo from "../../assets/images/7 - FULL LOGO.png";
import logo from "../../assets/images/5 - LOGO.png";
import { useSelector } from "react-redux";
export default function Sidebar() {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth.user);
  return (
    <>
      <div className="w-96  h-full p-9 bg-[#FBFBFB]  flex flex-col overflow-y-auto  ">
        <div className="w-8 h-10 flex items-center mb-5">
          <img src={logo} alt="" className="w-full h-full" />
        </div>
        <span className="font-bold text-2xl text-septenary">¡Bienvenido!</span>
        <span className="font-bold text-3xl">{user.name + ' ' + user.surname}</span>
        <span className="mt-2 mb-3 text-septenary">Tu balance actual es:</span>
        <span className="text-3xl font-bold">$100.000,00</span>
        <div className="w-full h-full flex flex-col mt-6  ">
          <span className="text-septenary mb-2">Musica</span>
          <NavLink
            to={"/panel/home"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={HomeIcon} alt="" className="w-5 h-5 " />
              <span>Inicio</span>
            </>
          </NavLink>

          <NavLink
            to={"/panel/music"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={MusicIcon} alt="" className="w-5 h-5 " />
              <span>Musica</span>
            </>
          </NavLink>
          <NavLink
            to={"/panel/last"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={UltimosLanzamientosIcon} alt="" className="w-5 h-5 " />
              <span>Ultimos lanzamientos</span>
            </>
          </NavLink>
          <NavLink
            to={"/panel/dealers"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6  mt-3 font-medium"
            }
          >
            <>
              <img src={DistribuidoresIcon} alt="" className="w-5 h-5 " />
              <span>Distribuidores</span>
            </>
          </NavLink>
          <NavLink
            to={"/panel/collaborators"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={ColaboradoresIcon} alt="" className="w-5 h-5 " />
              <span>Colaboradores</span>
            </>
          </NavLink>
          <NavLink
            to={"/panel/lastyear"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={UltimoAnoIcon} alt="" className="w-5 h-5 " />
              <span>Ultimo año</span>
            </>
          </NavLink>
        </div>
        <div className="w-full h-full flex flex-col mt-6  ">
          <span className="text-septenary mb-2">Reportes</span>

          <NavLink
            to={"/panel/income"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={IngresosIcon} alt="" className="w-5 h-5 " />
              <span>Ingresos</span>
            </>
          </NavLink>
          <NavLink
            to={"/panel/bills"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={GastosIcon} alt="" className="w-5 h-5 " />
              <span>Gastos</span>
            </>
          </NavLink>
          <NavLink
            to={"/panel/balance"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={BalanceIcon} alt="" className="w-5 h-5 " />
              <span>Balance</span>
            </>
          </NavLink>
          <NavLink
            to={"/panel/payments"}
            className={({ isActive }) =>
              isActive
                ? "w-full gap-3  rounded-3xl text-quinary bg-[#F3F3F3] p-2  flex  items-center  font-bold pl-6 mt-1   "
                : "w-full gap-3  rounded-3xl text-black  flex  items-center p-2   pl-6 mt-1 font-medium"
            }
          >
            <>
              <img src={PagosIcon} alt="" className="w-5 h-5 " />
              <span>Pagos</span>
            </>
          </NavLink>
        </div>

        <div className="mt-16">
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
                className="w-28 h-10"
                src="data:image/png;base64,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"
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
