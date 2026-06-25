import { useState, useEffect } from "react";
import { Mic, SlidersHorizontal, Music, User, Check, LucideIcon } from "lucide-react";
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
  { id: "artista",    name: "Artista",     description: "Cantante, músico o intérprete",   Icon: Mic              },
  { id: "productor",  name: "Productor",   description: "Productor musical o de audio",     Icon: SlidersHorizontal },
  { id: "compositor", name: "Compositor",  description: "Compositor o escritor de canciones", Icon: Music           },
  { id: "otro",       name: "Otro",        description: "Otra profesión musical",            Icon: User             },
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

const parse = (val?: string): string[] =>
  val ? val.split(",").map((s) => s.trim()).filter(Boolean) : [];

const ProfessionStep = ({ nextStep, initialData }: ProfessionStepProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedOther, setSelectedOther] = useState<string[]>([]);

  useEffect(() => {
    if (initialData?.profession)      setSelected(parse(initialData.profession));
    if (initialData?.otherProfession) setSelectedOther(parse(initialData.otherProfession));
  }, [initialData]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleOther = (prof: string) => {
    setSelectedOther((prev) =>
      prev.includes(prof) ? prev.filter((p) => p !== prof) : [...prev, prof]
    );
  };

  const showOther = selected.includes("otro");
  const canContinue =
    selected.length > 0 && (!showOther || selectedOther.length > 0);

  const handleSubmit = () => {
    if (!canContinue) return;
    // Replace "otro" with the specific professions chosen inside it
    const finalProfs = [
      ...selected.filter((p) => p !== "otro"),
      ...(showOther ? selectedOther : []),
    ];
    nextStep({
      profession:      finalProfs.join(","),
      otherProfession: showOther ? selectedOther.join(",") : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Mic size={40} color="#F97316" />
        <h2 className="text-[22px] font-bold text-[#111827]">¿Cuál es tu profesión?</h2>
        <p className="text-sm text-[#6B7280]">
          Puedes seleccionar una o varias opciones
        </p>
      </div>

      {/* Cards grid — 2×2 */}
      <div className="flex flex-col gap-3.5">
        {[PROFESSIONS.slice(0, 2), PROFESSIONS.slice(2, 4)].map((row, ri) => (
          <div key={ri} className="flex gap-3.5">
            {row.map(({ id, name, description, Icon }) => {
              const isSelected = selected.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  className="flex-1 flex flex-col items-center gap-2.5 text-center transition-all relative"
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    backgroundColor: isSelected ? "#FFF7ED" : "#FFFFFF",
                    border: isSelected ? "2px solid #F97316" : "1px solid #E5E7EB",
                  }}
                >
                  {/* checkmark badge */}
                  {isSelected && (
                    <span
                      className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: "#F97316" }}
                    >
                      <Check size={11} color="#fff" strokeWidth={3} />
                    </span>
                  )}
                  <Icon size={28} color={isSelected ? "#F97316" : "#9CA3AF"} />
                  <span className="text-[15px] font-semibold text-[#111827]">{name}</span>
                  <span className="text-xs" style={{ color: isSelected ? "#C2410C" : "#9CA3AF" }}>
                    {description}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected summary pill */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((id) => {
            const p = PROFESSIONS.find((pr) => pr.id === id);
            return (
              <span
                key={id}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#FFF7ED", color: "#C2410C", border: "1px solid #FED7AA" }}
              >
                {p?.name}
                <button
                  onClick={() => toggle(id)}
                  className="ml-0.5 hover:opacity-70 transition-opacity"
                  aria-label={`Quitar ${p?.name}`}
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Other profession picker */}
      {showOther && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[#374151]">
            ¿Cuál(es) son tus profesiones específicas?{" "}
            <span className="text-[#9CA3AF] font-normal">(selecciona las que apliquen)</span>
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {OTHER_PROFESSIONS.map((prof) => {
              const isSelected = selectedOther.includes(prof);
              return (
                <button
                  key={prof}
                  onClick={() => toggleOther(prof)}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition-colors"
                  style={{
                    borderRadius: 8,
                    backgroundColor: isSelected ? "#FFF7ED" : "#FFFFFF",
                    border: isSelected ? "2px solid #F97316" : "1px solid #E5E7EB",
                    color: isSelected ? "#C2410C" : "#374151",
                  }}
                >
                  <span>{prof}</span>
                  {isSelected && <Check size={13} color="#F97316" strokeWidth={2.5} />}
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
