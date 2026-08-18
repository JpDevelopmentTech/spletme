import { useState, useEffect } from "react";
import { Mic, SlidersHorizontal, Music, User, Check, ArrowRight, LucideIcon } from "lucide-react";
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
  {
    id: "productor",
    name: "Productor",
    description: "Productor musical o de audio",
    Icon: SlidersHorizontal,
  },
  {
    id: "compositor",
    name: "Compositor",
    description: "Compositor o escritor de canciones",
    Icon: Music,
  },
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

const parse = (val?: string): string[] =>
  val
    ? val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

const ProfessionStep = ({ nextStep, initialData }: ProfessionStepProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedOther, setSelectedOther] = useState<string[]>([]);

  useEffect(() => {
    const initProfs =
      initialData?.professions && initialData.professions.length > 0
        ? initialData.professions
        : parse(initialData?.profession);
    if (initProfs.length > 0) setSelected(initProfs);
    if (initialData?.otherProfession) setSelectedOther(parse(initialData.otherProfession));
  }, [initialData]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const toggleOther = (prof: string) => {
    setSelectedOther((prev) =>
      prev.includes(prof) ? prev.filter((p) => p !== prof) : [...prev, prof],
    );
  };

  const showOther = selected.includes("otro");
  const canContinue = selected.length > 0 && (!showOther || selectedOther.length > 0);

  const handleSubmit = () => {
    if (!canContinue) return;
    // "otro" se reemplaza por las profesiones concretas elegidas dentro de él
    const finalProfs = [
      ...selected.filter((p) => p !== "otro"),
      ...(showOther ? selectedOther : []),
    ];
    nextStep({
      profession: finalProfs.join(","),
      otherProfession: showOther ? selectedOther.join(",") : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[28px] font-semibold text-[#1C1D22]">
          ¿Cuál es tu profesión?
        </h1>
        <p className="text-[13.5px] text-[#71757E]">Elige todas las que apliquen.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PROFESSIONS.map(({ id, name, description, Icon }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(id)}
              className={`flex flex-col gap-2.5 rounded-[18px] border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] ${
                isSelected
                  ? "border-[1.5px] border-[#FF5C00] bg-[#FFEADD]"
                  : "border-[#E8E8EC] bg-white hover:border-[#A6AAB2]"
              }`}
            >
              <span className="flex items-start justify-between">
                <Icon className={`h-6 w-6 ${isSelected ? "text-[#FF5C00]" : "text-[#A6AAB2]"}`} />
                {isSelected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5C00]">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[14.5px] font-semibold text-[#1C1D22]">{name}</span>
                <span
                  className={`text-[11.5px] leading-snug ${isSelected ? "text-[#EA580C]" : "text-[#A6AAB2]"}`}
                >
                  {description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-[#A6AAB2]">Elegidas:</span>
          {selected.map((id) => {
            const p = PROFESSIONS.find((pr) => pr.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                aria-label={`Quitar ${p?.name}`}
                className="flex items-center gap-1.5 rounded-[14px] bg-[#FFEADD] px-2.5 py-1.5 text-[11.5px] font-semibold text-[#FF5C00] transition-opacity hover:opacity-80"
              >
                {p?.name}
                <span aria-hidden="true">✕</span>
              </button>
            );
          })}
        </div>
      )}

      {showOther && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[12.5px] font-medium text-[#71757E]">
            ¿Cuál en concreto? Elige las que apliquen.
          </p>
          <div className="grid max-h-56 grid-cols-2 gap-2.5 overflow-y-auto pr-1">
            {OTHER_PROFESSIONS.map((prof) => {
              const isSelected = selectedOther.includes(prof);
              return (
                <button
                  key={prof}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleOther(prof)}
                  className={`flex items-center justify-between gap-2 rounded-[14px] border px-3 py-2.5 text-left text-[12.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] ${
                    isSelected
                      ? "border-[1.5px] border-[#FF5C00] bg-[#FFEADD] font-semibold text-[#FF5C00]"
                      : "border-[#E8E8EC] bg-white text-[#1C1D22] hover:border-[#A6AAB2]"
                  }`}
                >
                  <span>{prof}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canContinue}
        className={`flex h-[50px] w-full items-center justify-center gap-2 rounded-[25px] text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] ${
          canContinue
            ? "bg-[#FF5C00] text-white shadow-[0_8px_20px_-6px_rgba(255,92,0,0.55)] hover:bg-[#EA580C]"
            : "cursor-not-allowed bg-[#F4F5F7] text-[#A6AAB2]"
        }`}
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProfessionStep;
