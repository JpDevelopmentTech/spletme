import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Handshake, Users, Wallet, ArrowRight, Check, ChevronRight } from "lucide-react";
import { setAuth } from "@/store/states/authSlice";

/** Siguientes pasos reales dentro del panel, en el orden en que conviene hacerlos. */
const NEXT_STEPS = [
  {
    Icon: Handshake,
    title: "Conecta un distribuidor",
    description: "Sube el reporte y calculamos el reparto",
    to: "/panel/dealers",
  },
  {
    Icon: Users,
    title: "Invita a tus colaboradores",
    description: "Cada uno ve lo que le toca",
    to: "/panel/collaborators",
  },
  {
    Icon: Wallet,
    title: "Configura tu banco",
    description: "Para recibir los pagos por Stripe o Wise",
    to: "/panel/wallet",
  },
];

const CompletionStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** Marca el onboarding como completado antes de salir, pase lo que pase en el backend. */
  const completeAndGo = (to: string) => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      user.onboardingCompleted = true;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setAuth({ isAuth: "true", user }));
    }
    navigate(to);
  };

  const firstName = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      const name = typeof user.name === "string" ? user.name.trim().split(" ")[0] : "";
      return name || "";
    } catch {
      return "";
    }
  })();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3.5">
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E4F5EC]">
          <Check className="h-8 w-8 text-[#2FB37E]" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-[28px] font-semibold text-[#1C1D22]">
            {firstName ? `¡Todo listo, ${firstName}!` : "¡Todo listo!"}
          </h1>
          <p className="text-[13.5px] leading-relaxed text-[#71757E]">
            Tu cuenta quedó verificada y tu perfil configurado. Ya puedes gestionar tus regalías.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {NEXT_STEPS.map(({ Icon, title, description, to }) => (
          <button
            key={title}
            onClick={() => completeAndGo(to)}
            className="flex items-center gap-3.5 rounded-[18px] border border-[#E8E8EC] bg-white px-4 py-3.5 text-left transition-colors hover:bg-[#F4F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00]"
          >
            <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[13px] bg-[#FFEADD]">
              <Icon className="h-[17px] w-[17px] text-[#FF5C00]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[13.5px] font-semibold text-[#1C1D22]">{title}</span>
              <span className="text-[11.5px] text-[#A6AAB2]">{description}</span>
            </span>
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#A6AAB2]" />
          </button>
        ))}
      </div>

      <button
        onClick={() => completeAndGo("/panel/home")}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[26px] bg-[#FF5C00] text-[15px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(255,92,0,0.55)] transition-colors hover:bg-[#EA580C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00]"
      >
        Entrar al panel
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CompletionStep;
