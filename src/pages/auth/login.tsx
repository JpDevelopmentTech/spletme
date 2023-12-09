import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/7 - FULL LOGO.png";
import React, { useEffect } from "react";
import { AuthService } from "../../services/auth";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/states/authSlice";
import Splash from "../../components/splash/splash";


export default function Login() {
  const dispache = useDispatch()
  const navigate = useNavigate();

  const [splash, setSplash] = React.useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 4000);
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const email = (e.target as any).email.value;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const password = (e.target as any).password.value;
    
    const response = await AuthService.login(email, password);
    if (response.error) {
      alert(response.message);
    } else {
      localStorage.setItem("user", JSON.stringify(response.data))
      localStorage.setItem("isAuth", "true")
      dispache(setAuth({
        isAuth: "true",
        user: response.data
      }))
      navigate("/panel/home");
    }
  };

  return (
    <>
      <div className="w-full h-screen flex">
        {splash ? <Splash/> : <><div className="w-1/2 flex justify-center items-center bg-primary h-full ">
          <div className=" bg-black/10 h-96 w-96 rounded-full  flex flex-col items-center justify-center p-12">
            <img src={logo} alt="logo de splet me" />
            <span className="text-white font-bold tracking-widest mt-3 font-custom">
              BY ESCORCIA{" "}
              <span className="font-normal tracking-[10px]">MUSIC</span>
            </span>
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="my-6 flex flex-col items-center">
            <h1 className="text-4xl font-black font-custom">Login</h1>
            <p className="text-tertiary font-custom font-bold">
              Accede a tu Wallet
            </p>
          </div>
          <form
            action=""
            className="flex flex-col items-center"
            onSubmit={login}
          >
            <input
              type="text"
              placeholder="Correo"
              name="email"
              className="w-80 border-2  rounded-3xl text-center mt-3 p-3 font-custom mb-5"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="w-80  border-2  rounded-3xl text-center mt-3 p-3 font-custom"
            />
            <a
              href="#"
              className="text-septenary font-custom font-normal mt-3 text-center mb-5"
            >
              ¿Olvidaste tu contraseña?
            </a>
            <input
              type="submit"
              value="Ingresar"
              className="w-40 h-10 bg-quinary text-white font-bold font-custom rounded-3xl mt-3 cursor-pointer hover:-translate-y-2 hover:duration-200"
            />
          </form>
          <div className="flex items-center gap-3 my-6">
            <div className="w-28 h-0.5 bg-senary"></div>
            <p className="text-senary font-custom font-bold">
              O registrate con
            </p>
            <div className="w-28 h-0.5 bg-senary"></div>
          </div>
          <div className="flex gap-3">
            <div className=" border-senary border rounded-3xl flex justify-center items-center p-3 gap-1 cursor-pointer">
              <img
                src="https://cdn.freebiesupply.com/images/large/2x/apple-logo-transparent.png"
                alt=""
                className="w-5"
              />
              <span className="font-custom text-septenary font-bold">
                Apple
              </span>
            </div>
            <div className=" border-senary border rounded-3xl flex justify-center items-center p-3 gap-1 cursor-pointer">
              <img
                src="https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png"
                alt=""
                className="w-5"
              />
              <span className="font-custom text-septenary font-bold">
                Google
              </span>
            </div>
          </div>
        </div></>}
        
      </div>
    </>
  );
}
