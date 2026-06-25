import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, AtSign } from "lucide-react";
import { AuthService } from "../../services/auth";

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
        className="hidden flex-shrink-0 flex-col justify-center gap-9 lg:flex"
        style={{ width: 500, backgroundColor: "#0F172A", padding: "60px 50px" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex flex-shrink-0 items-center justify-center text-xl font-bold text-white"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "#F97316",
            }}
          >
            S
          </div>
          <span className="text-xl font-bold text-white">SplitMe</span>
        </div>

        {/* Encabezado */}
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-white" style={{ fontSize: 42, lineHeight: 1.2 }}>
            Gestiona tus
            <br />
            regalías musicales.
          </h1>
          <p className="text-sm text-[#94A3B8]" style={{ lineHeight: 1.6 }}>
            Rastrea streams, divide pagos y gestiona colaboradores en un solo lugar.
          </p>
        </div>

        {/* Acento naranja */}
        <div
          style={{
            width: 48,
            height: 3,
            borderRadius: 2,
            backgroundColor: "#F97316",
          }}
        />

        {/* Características */}
        <div className="flex flex-col gap-3.5">
          {FEATURES.map((feat) => (
            <div key={feat} className="flex items-center gap-2.5">
              <div
                className="flex-shrink-0 rounded-full"
                style={{ width: 8, height: 8, backgroundColor: "#F97316" }}
              />
              <span className="text-sm text-[#CBD5E1]">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div
        className="flex flex-1 items-center justify-center overflow-y-auto p-6"
        style={{ backgroundColor: "#F7F8FA" }}
      >
        {/* Tarjeta del formulario */}
        <div
          className="my-6 flex w-full flex-col gap-5"
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
            className="flex items-center justify-center self-start text-[22px] font-bold text-white"
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              backgroundColor: "#F97316",
            }}
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
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-medium text-[#374151]">Nombre</label>
                <div className="relative">
                  <User
                    size={16}
                    color="#9CA3AF"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-medium text-[#374151]">Apellido</label>
                <div className="relative">
                  <User
                    size={16}
                    color="#9CA3AF"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
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
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botón crear cuenta */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{
                height: 46,
                borderRadius: 10,
                backgroundColor: "#F97316",
              }}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {/* Términos */}
            <p className="text-center text-xs text-[#9CA3AF]">
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
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">o</span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          {/* Iniciar sesión */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm text-[#6B7280]">¿Ya tienes cuenta?</span>
            <Link
              to="/auth/email-login"
              className="text-sm font-semibold text-[#F97316] transition-opacity hover:opacity-80"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
