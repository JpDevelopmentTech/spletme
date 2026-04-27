import { Link } from "react-router-dom";
import { TrendingUp, DollarSign, Music, ArrowRight, PartyPopper } from "lucide-react";

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
  {
    Icon: Music,
    title: "Catálogo",
    description: "Sincroniza tu música",
  },
];

const CompletionStep = () => {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Check circle */}
      <div
        className="flex items-center justify-center text-white font-bold"
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
        <h2 className="text-2xl font-bold text-[#111827]">
          ¡Cuenta verificada exitosamente!
        </h2>
        <p className="text-sm text-[#6B7280] max-w-md mx-auto">
          Tu perfil está configurado. Ya puedes gestionar tus regalías musicales.
        </p>
      </div>

      {/* Feature cards */}
      <div className="flex gap-3.5 w-full">
        {FEATURES.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="flex-1 flex flex-col items-center gap-2"
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
        className="flex items-start gap-3 w-full text-left"
        style={{
          backgroundColor: "#FFF7ED",
          border: "1px solid #FED7AA",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <PartyPopper size={24} color="#F97316" className="flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#9A3412]">
          ¡Bienvenido a SplitMe! Tu cuenta está lista para comenzar.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span>Perfil completo</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span>Distribuidor conectado</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span>Cuenta verificada</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        to="/panel/home"
        className="flex items-center justify-center gap-2 w-full text-white font-bold text-base transition-opacity hover:opacity-90"
        style={{
          height: 52,
          borderRadius: 12,
          backgroundColor: "#F97316",
        }}
      >
        Ir al Dashboard
        <ArrowRight size={18} />
      </Link>
    </div>
  );
};

export default CompletionStep; 
