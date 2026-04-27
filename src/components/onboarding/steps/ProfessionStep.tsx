import { useState, useEffect } from "react";
import { Mic, SlidersHorizontal, Music, User, LucideIcon } from "lucide-react";
import { OnboardingData } from "../../../services/onboarding";

interface ProfessionStepProps {
  nextStep: (data?: Partial<OnboardingData>) => void;
  initialData?: OnboardingData;
}

interface Profession {
  id: string;
  name: string;
  description: string;
  Icon: LucideIcon;
}

const PROFESSIONS: Profession[] = [
  { id: "artista", name: "Artista", description: "Cantante, músico o intérprete", Icon: Mic },
  { id: "productor", name: "Productor", description: "Productor musical o de audio", Icon: SlidersHorizontal },
  { id: "compositor", name: "Compositor", description: "Compositor o escritor de canciones", Icon: Music },
  { id: "otro", name: "Otro", description: "Otra profesión musical", Icon: User },
];

const OTHER_PROFESSIONS = [
  "Ingeniero de sonido",
  "Diseñador de sonido",
  "Diseñador de audio",
  "Ingeniero de mezcla",
  "Ingeniero de masterización",
  "Ingeniero de grabación",
  "Manager musical",
  "Promotor de eventos",
  "DJ",
  "Locutor",
  "Podcaster",
];

const ProfessionStep = ({ nextStep, initialData }: ProfessionStepProps) => {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedOtherProfession, setSelectedOtherProfession] = useState("");

  useEffect(() => {
    if (initialData?.profession) setSelectedProfession(initialData.profession);
    if (initialData?.otherProfession) setSelectedOtherProfession(initialData.otherProfession);
  }, [initialData]);

  const handleSelect = (id: string) => {
    setSelectedProfession(id);
    if (id !== "otro") setSelectedOtherProfession("");
  };

  const canContinue =
    selectedProfession && (selectedProfession !== "otro" || selectedOtherProfession);

  const handleSubmit = () => {
    if (!canContinue) return;
    nextStep({
      profession: selectedProfession,
      otherProfession: selectedProfession === "otro" ? selectedOtherProfession : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Mic size={40} color="#F97316" />
        <h2 className="text-[22px] font-bold text-[#111827]">
          ¿Cuál es tu profesión?
        </h2>
        <p className="text-sm text-[#6B7280]">
          Cuéntanos sobre ti para personalizar tu experiencia
        </p>
      </div>

      {/* Cards grid — 2×2 */}
      <div className="flex flex-col gap-3.5">
        {[PROFESSIONS.slice(0, 2), PROFESSIONS.slice(2, 4)].map((row, ri) => (
          <div key={ri} className="flex gap-3.5">
            {row.map(({ id, name, description, Icon }) => {
              const isSelected = selectedProfession === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className="flex-1 flex flex-col items-center gap-2.5 text-center transition-colors"
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    backgroundColor: isSelected ? "#FFF7ED" : "#FFFFFF",
                    border: isSelected ? "2px solid #F97316" : "1px solid #E5E7EB",
                  }}
                >
                  <Icon size={28} color={isSelected ? "#F97316" : "#9CA3AF"} />
                  <span className="text-[15px] font-semibold text-[#111827]">
                    {name}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: isSelected ? "#C2410C" : "#9CA3AF" }}
                  >
                    {description}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Other profession picker */}
      {selectedProfession === "otro" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[#374151]">
            ¿Cuál es tu profesión específica?
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {OTHER_PROFESSIONS.map((prof) => {
              const isSelected = selectedOtherProfession === prof;
              return (
                <button
                  key={prof}
                  onClick={() => setSelectedOtherProfession(prof)}
                  className="px-3 py-2 text-sm text-center transition-colors"
                  style={{
                    borderRadius: 8,
                    backgroundColor: isSelected ? "#FFF7ED" : "#FFFFFF",
                    border: isSelected ? "2px solid #F97316" : "1px solid #E5E7EB",
                    color: isSelected ? "#C2410C" : "#374151",
                  }}
                >
                  {prof}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={handleSubmit}
        disabled={!canContinue}
        className="w-full font-semibold text-[15px] text-white transition-opacity"
        style={{
          height: 46,
          borderRadius: 10,
          backgroundColor: "#F97316",
          opacity: canContinue ? 1 : 0.4,
          cursor: canContinue ? "pointer" : "not-allowed",
        }}
      >
        Continuar
      </button>
    </div>
  );
};

export default ProfessionStep;
