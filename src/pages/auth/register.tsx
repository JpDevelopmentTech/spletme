import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, AtSign } from "lucide-react";
import { AuthService } from "../../services/auth";
import { OnboardingService } from "../../services/onboarding";

const FEATURES = [
  "Rastrea streams en todas las plataformas",
  "Divide regalías con colaboradores",
  "Gestiona billeteras y retiros de pagos",
];

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
  const [successMessage, setSuccessMessage] = useState("");

  const set = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

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

    try {
      await OnboardingService.requestAccountVerificationCode(formData.email);
    } catch {
      // el backend envía el código al registrarse
    }

    setSuccessMessage("¡Cuenta creada! Te enviamos un código de verificación.");
    setIsSubmitting(false);
    setTimeout(() => navigate("/auth/email-login"), 1200);
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    height: 46,
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingLeft: 40,
    paddingRight: 14,
    fontSize: 14,
    color: "#111827",
    outline: "none",
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo */}
      <div
        className="hidden lg:flex flex-col justify-center gap-9 flex-shrink-0"
        style={{ width: 500, backgroundColor: "#0F172A", padding: "60px 50px" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#F97316" }}
          >
            S
          </div>
          <span className="text-white font-bold text-xl">SplitMe</span>
        </div>

        {/* Encabezado */}
        <div className="flex flex-col gap-4">
          <h1 className="text-white font-bold" style={{ fontSize: 42, lineHeight: 1.2 }}>
            Gestiona tus
            <br />
            regalías musicales.
          </h1>
          <p className="text-[#94A3B8] text-sm" style={{ lineHeight: 1.6 }}>
            Rastrea streams, divide pagos y gestiona colaboradores en un solo lugar.
          </p>
        </div>

        {/* Acento naranja */}
        <div style={{ width: 48, height: 3, borderRadius: 2, backgroundColor: "#F97316" }} />

        {/* Características */}
        <div className="flex flex-col gap-3.5">
          {FEATURES.map((feat) => (
            <div key={feat} className="flex items-center gap-2.5">
              <div
                className="flex-shrink-0 rounded-full"
                style={{ width: 8, height: 8, backgroundColor: "#F97316" }}
              />
              <span className="text-[#CBD5E1] text-sm">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div
        className="flex-1 flex items-center justify-center p-6 overflow-y-auto"
        style={{ backgroundColor: "#F7F8FA" }}
      >
        {/* Tarjeta del formulario */}
        <div
          className="w-full flex flex-col gap-5 my-6"
          style={{
            maxWidth: 420,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            padding: 40,
          }}
        >
          {/* Logo de la tarjeta */}
          <div
            className="flex items-center justify-center text-white font-bold text-[22px] self-start"
            style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: "#F97316" }}
          >
            S
          </div>

          {/* Encabezado */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[26px] font-bold text-[#111827]">Crea tu cuenta</h2>
            <p className="text-sm text-[#6B7280]">
              Únete a SplitMe y comienza a gestionar tus regalías
            </p>
          </div>

          {/* Alertas */}
          {errorMessage && (
            <div
              className="text-sm text-red-700"
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div
              className="text-sm text-green-700"
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Usuario */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Nombre de usuario</label>
              <div className="relative">
                <AtSign
                  size={16}
                  color="#9CA3AF"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => set("username", e.target.value)}
                  placeholder="Elige un nombre de usuario"
                  required
                  style={inputBase}
                />
              </div>
            </div>

            {/* Nombre + Apellido */}
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#374151]">Nombre</label>
                <div className="relative">
                  <User
                    size={16}
                    color="#9CA3AF"
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Tu nombre"
                    required
                    style={inputBase}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#374151]">Apellido</label>
                <div className="relative">
                  <User
                    size={16}
                    color="#9CA3AF"
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    placeholder="Tu apellido"
                    required
                    style={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Correo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Correo electrónico</label>
              <div className="relative">
                <Mail
                  size={16}
                  color="#9CA3AF"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="Ingresa tu correo"
                  required
                  style={inputBase}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Contraseña</label>
              <div className="relative">
                <Lock
                  size={16}
                  color="#9CA3AF"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Crea una contraseña"
                  required
                  style={{ ...inputBase, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Confirmar contraseña</label>
              <div className="relative">
                <Lock
                  size={16}
                  color="#9CA3AF"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={(e) => set("passwordConfirmation", e.target.value)}
                  placeholder="Confirma tu contraseña"
                  required
                  style={{ ...inputBase, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botón crear cuenta */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-semibold text-[15px] transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ height: 46, borderRadius: 10, backgroundColor: "#F97316" }}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {/* Términos */}
            <p className="text-xs text-center text-[#9CA3AF]">
              Al crear una cuenta aceptas nuestros{" "}
              <a href="#" className="text-[#F97316] hover:opacity-80">
                Términos de Servicio
              </a>{" "}
              y la{" "}
              <a href="#" className="text-[#F97316] hover:opacity-80">
                Política de Privacidad
              </a>
            </p>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">o</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Iniciar sesión */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm text-[#6B7280]">¿Ya tienes cuenta?</span>
            <Link
              to="/auth/email-login"
              className="text-sm font-semibold text-[#F97316] hover:opacity-80 transition-opacity"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
