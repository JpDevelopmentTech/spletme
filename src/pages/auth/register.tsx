import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, AtSign, ArrowRight } from "lucide-react";
import { AuthService } from "../../services/auth";
import { WelcomeModal } from "../../components/modal/WelcomeModal";
import logo from "../../assets/images/2 - BLANCO.png";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const set = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.passwordConfirmation) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    const response = await AuthService.register(formData);

    if (!response) {
      setErrorMessage("No se pudo crear la cuenta. Intenta nuevamente.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setShowWelcome(true);
  };

  const inputClass =
    "peer h-12 w-full rounded-[14px] border border-transparent bg-[#F4F5F7] text-[13.5px] text-[#1C1D22] placeholder-[#A6AAB2] outline-none transition-colors focus:border-[#FF5C00] focus:bg-white focus:ring-2 focus:ring-[#FF5C00]/20";
  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A6AAB2] transition-colors peer-focus:text-[#FF5C00]";

  return (
    <>
      <WelcomeModal
        isOpen={showWelcome}
        userName={formData.name}
        onContinue={() => navigate("/auth/email-login")}
      />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#FFF4EC] px-4 py-10">
        {/* Resplandores de fondo */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[460px] w-[460px] rounded-full bg-[#FF5C00] opacity-[0.10] blur-[150px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[460px] w-[460px] rounded-full bg-[#FF5C00] opacity-[0.09] blur-[150px]" />

        <div className="relative z-10 flex w-full max-w-[444px] flex-col items-center gap-6">
          {/* Tarjeta */}
          <div className="flex w-full flex-col gap-5 rounded-[32px] bg-white px-[38px] pb-8 pt-10 shadow-[0_24px_56px_-16px_rgba(28,29,34,0.14)]">
            {/* Logo */}
            <div className="flex justify-center">
              <img src={logo} alt="SplitMe" className="h-10 w-auto" />
            </div>

            {/* Encabezado */}
            <div className="flex flex-col items-center gap-1.5">
              <h2 className="text-[26px] font-bold text-[#1C1D22]">Crea tu cuenta</h2>
              <p className="text-sm text-[#71757E]">Únete a SplitMe y gestiona tus regalías</p>
            </div>

            {/* Alerta */}
            {errorMessage && (
              <div className="rounded-[14px] border border-[#FADADA] bg-[#FEECEC] px-3.5 py-2.5 text-sm text-[#EF4444]">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Usuario */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#71757E]">Nombre de usuario</label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(e) => set("username", e.target.value)}
                    placeholder="Elige un nombre de usuario"
                    required
                    className={`${inputClass} pl-[42px] pr-4`}
                  />
                  <AtSign className={iconClass} />
                </div>
              </div>

              {/* Nombre + Apellido */}
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#71757E]">Nombre</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Tu nombre"
                      required
                      className={`${inputClass} pl-[42px] pr-3`}
                    />
                    <User className={iconClass} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#71757E]">Apellido</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      placeholder="Tu apellido"
                      required
                      className={`${inputClass} pl-[42px] pr-3`}
                    />
                    <User className={iconClass} />
                  </div>
                </div>
              </div>

              {/* Correo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#71757E]">Correo electrónico</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className={`${inputClass} pl-[42px] pr-4`}
                  />
                  <Mail className={iconClass} />
                </div>
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#71757E]">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Crea una contraseña"
                    required
                    className={`${inputClass} pl-[42px] pr-[42px]`}
                  />
                  <Lock className={iconClass} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6AAB2] transition-colors hover:text-[#71757E]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#71757E]">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={(e) => set("passwordConfirmation", e.target.value)}
                    placeholder="Confirma tu contraseña"
                    required
                    className={`${inputClass} pl-[42px] pr-[42px]`}
                  />
                  <Lock className={iconClass} />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6AAB2] transition-colors hover:text-[#71757E]"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#FF5C00] text-[15px] font-semibold text-white shadow-[0_10px_24px_-6px_rgba(255,92,0,0.5)] transition hover:brightness-105 disabled:opacity-60"
              >
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>

              {/* Términos */}
              <p className="text-center text-[11.5px] leading-relaxed text-[#A6AAB2]">
                Al crear una cuenta aceptas nuestros{" "}
                <a href="#" className="font-semibold text-[#FF5C00] hover:opacity-80">
                  Términos de Servicio
                </a>{" "}
                y la{" "}
                <a href="#" className="font-semibold text-[#FF5C00] hover:opacity-80">
                  Política de Privacidad
                </a>
              </p>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#1C1D22]/[0.08]" />
              <span className="text-xs text-[#A6AAB2]">o</span>
              <div className="h-px flex-1 bg-[#1C1D22]/[0.08]" />
            </div>

            {/* Iniciar sesión */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[13.5px] text-[#71757E]">¿Ya tienes cuenta?</span>
              <Link
                to="/auth/email-login"
                className="text-[13.5px] font-semibold text-[#FF5C00] transition-opacity hover:opacity-80"
              >
                Inicia sesión
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
    </>
  );
}
