import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TrendingUp, DollarSign, Music, ArrowRight, PartyPopper } from "lucide-react";
import { setAuth } from "@/store/states/authSlice";

const FEATURES = [
  {
    Icon: TrendingUp,
    title: "Analytics",
    description: "Monitorea tus ingresos",
  },
  {
    Icon: DollarSign,
    title: "Regalías",
    description: "Gestiona tus ganancias",
  },
  { Icon: Music, title: "Catálogo", description: "Sincroniza tu música" },
];

const CompletionStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoToDashboard = () => {
    // Garantiza la marca antes de navegar, independiente del backend
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      user.onboardingCompleted = true;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setAuth({ isAuth: "true", user }));
    }
    navigate("/panel/home");
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Check circle */}
      <div
        className="flex items-center justify-center font-bold text-white"
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: "#22C55E",
          fontSize: 40,
          lineHeight: 1,
        }}
      >
        ✓
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[#111827]">¡Cuenta configurada exitosamente!</h2>
        <p className="mx-auto max-w-md text-sm text-[#6B7280]">
          Tu perfil está listo. Ya puedes gestionar tus regalías musicales.
        </p>
      </div>

      {/* Feature cards */}
      <div className="flex w-full gap-3.5">
        {FEATURES.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-1 flex-col items-center gap-2"
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              padding: 20,
            }}
          >
            <Icon size={28} color="#F97316" />
            <span className="text-sm font-semibold text-[#111827]">{title}</span>
            <span className="text-xs text-[#6B7280]">{description}</span>
          </div>
        ))}
      </div>

      {/* Welcome banner */}
      <div
        className="flex w-full items-center gap-3 text-left"
        style={{
          backgroundColor: "#FFF7ED",
          border: "1px solid #FED7AA",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <PartyPopper size={24} color="#F97316" className="flex-shrink-0" />
        <p className="text-sm text-[#9A3412]">
          ¡Bienvenido a SplitMe! Tu cuenta está lista para comenzar.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleGoToDashboard}
        className="flex w-full items-center justify-center gap-2 text-base font-bold text-white transition-opacity hover:opacity-90"
        style={{ height: 52, borderRadius: 12, backgroundColor: "#F97316" }}
      >
        Ir al Dashboard
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default CompletionStep;
