import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthService } from "../../services/auth";
import { setAuth } from "../../store/states/authSlice";
import logo from "../../assets/images/2 - BLANCO.png";

export default function EmailLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (response && response.data) {
        const serverUser = response.data.user;
        const serverStep = Number(serverUser?.onboardingData?.currentStep || 0);
        const onboardingCompleted = Boolean(serverUser.onboardingCompleted) || serverStep >= 4;
        const userToStore = {
          ...serverUser,
          onboardingCompleted,
        };

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(userToStore));
        localStorage.setItem("isAuth", "true");
        dispatch(setAuth({ isAuth: "true", user: userToStore }));

        if (userToStore.onboardingCompleted) {
          navigate("/panel/home", { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }
      } else {
        setError("Credenciales incorrectas");
      }
    } catch {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "peer h-[50px] w-full rounded-[14px] border border-transparent bg-[#F4F5F7] text-sm text-[#1C1D22] placeholder-[#A6AAB2] outline-none transition-colors focus:border-[#FF5C00] focus:bg-white focus:ring-2 focus:ring-[#FF5C00]/20";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#FFF4EC] px-4 py-10">
      {/* Resplandores de fondo */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[460px] w-[460px] rounded-full bg-[#FF5C00] opacity-[0.10] blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[460px] w-[460px] rounded-full bg-[#FF5C00] opacity-[0.09] blur-[150px]" />

      <div className="relative z-10 flex w-full max-w-[432px] flex-col items-center gap-6">
        {/* Tarjeta */}
        <div className="flex w-full flex-col gap-[22px] rounded-[32px] bg-white px-10 pb-9 pt-[42px] shadow-[0_24px_56px_-16px_rgba(28,29,34,0.14)]">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="rounded-xl bg-white p-2">
              <img src={logo} alt="SplitMe" className="h-10 w-auto" />
            </div>
          </div>

          {/* Encabezado */}
          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-[27px] font-bold text-[#1C1D22]">Bienvenido de nuevo</h2>
            <p className="text-sm text-[#71757E]">Inicia sesión para continuar en SplitMe</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Correo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#71757E]">Correo electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  required
                  className={`${inputClass} pl-[42px] pr-4`}
                />
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#A6AAB2] transition-colors peer-focus:text-[#FF5C00]" />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#71757E]">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className={`${inputClass} pl-[42px] pr-[42px]`}
                />
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#A6AAB2] transition-colors peer-focus:text-[#FF5C00]" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6AAB2] transition-colors hover:text-[#71757E]"
                >
                  {showPassword ? <EyeOff className="h-[17px] w-[17px]" /> : <Eye className="h-[17px] w-[17px]" />}
                </button>
              </div>
            </div>

            {/* Opciones */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <span className="h-[18px] w-[18px] flex-shrink-0 rounded-md border-[1.5px] border-[#D6D8DC] bg-white" />
                <span className="text-[13.5px] text-[#71757E]">Recuérdame</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/auth/password-recovery")}
                className="text-[13.5px] font-semibold text-[#FF5C00] transition-opacity hover:opacity-80"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-center text-sm text-[#EF4444]">{error}</p>}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#FF5C00] text-[15px] font-semibold text-white shadow-[0_10px_24px_-6px_rgba(255,92,0,0.5)] transition hover:brightness-105 disabled:opacity-60"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#1C1D22]/[0.08]" />
            <span className="text-xs text-[#A6AAB2]">o</span>
            <div className="h-px flex-1 bg-[#1C1D22]/[0.08]" />
          </div>

          {/* Registro */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[13.5px] text-[#71757E]">¿No tienes cuenta?</span>
            <Link
              to="/auth/register"
              className="text-[13.5px] font-semibold text-[#FF5C00] transition-opacity hover:opacity-80"
            >
              Regístrate
            </Link>
          </div>
        </div>

        {/* Confianza */}
        <div className="flex items-center gap-1.5 text-[11.5px] text-[#A6AAB2]">
          <Lock className="h-3 w-3" />
          <span>Conexión segura · Stripe &amp; Wise</span>
        </div>
      </div>
    </div>
  );
}
