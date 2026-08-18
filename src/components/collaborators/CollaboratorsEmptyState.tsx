import { Users, Music, UserPlus, Percent, SearchX } from "lucide-react";

const STEPS = [
  {
    icon: <Music className="h-3.5 w-3.5 text-[#FF5C00]" />,
    title: "Elige una canción",
    detail: "De las que ya tienes en tu catálogo",
  },
  {
    icon: <UserPlus className="h-3.5 w-3.5 text-[#FF5C00]" />,
    title: "Invita por correo",
    detail: "O con su código si ya usa Splitme",
  },
  {
    icon: <Percent className="h-3.5 w-3.5 text-[#FF5C00]" />,
    title: "Asigna su parte",
    detail: "El porcentaje que le corresponde",
  },
];

/**
 * Pantalla vacía. Explica el modelo que la página daba por supuesto: un
 * colaborador no se «crea», se invita a una canción concreta.
 */
export function FirstCollaboratorState({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[26px] border border-[#E8E8EC] bg-white px-6 py-[46px] sm:px-10">
      <span className="flex h-[60px] w-[60px] items-center justify-center rounded-[22px] bg-[#FFEADD]">
        <Users className="h-[26px] w-[26px] text-[#FF5C00]" />
      </span>

      <div className="flex flex-col items-center gap-1.5">
        <h2 className="font-display text-[19px] font-semibold text-[#1C1D22]">
          Todavía no compartes regalías con nadie
        </h2>
        <p className="max-w-[540px] text-center text-[12.5px] leading-relaxed text-[#71757E]">
          Cuando invitas a alguien a una de tus canciones, aparece aquí con su parte del reparto y
          lo que le vas debiendo.
        </p>
      </div>

      <ol className="grid w-full max-w-[740px] grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2 rounded-[18px] bg-[#F4F5F7] p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[9px] bg-white">
                {step.icon}
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-[1px] text-[#A6AAB2]">
                0{index + 1}
              </span>
            </div>
            <span className="text-[12.5px] font-semibold text-[#1C1D22]">{step.title}</span>
            <span className="text-[11px] leading-snug text-[#A6AAB2]">{step.detail}</span>
          </li>
        ))}
      </ol>

      <button
        onClick={onInvite}
        className="mt-2 flex items-center gap-2 rounded-[20px] bg-[#FF5C00] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors hover:bg-[#EA580C]"
      >
        <UserPlus className="h-[15px] w-[15px]" />
        Invitar a una canción
      </button>
    </div>
  );
}

interface NoResultsStateProps {
  search: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onClearSearch: () => void;
  onInvite: () => void;
}

/** Sin resultados: ofrece la salida más probable, que casi siempre es invitar. */
export function NoResultsState({
  search,
  hasFilters,
  onClearFilters,
  onClearSearch,
  onInvite,
}: NoResultsStateProps) {
  const searching = search.trim() !== "";

  return (
    <div className="flex flex-col items-center gap-3 rounded-[26px] border border-[#E8E8EC] bg-white px-6 py-[50px]">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
        <SearchX className="h-[22px] w-[22px] text-[#71757E]" />
      </span>

      <h3 className="font-display text-base font-semibold text-[#1C1D22]">
        {searching ? `Nadie coincide con «${search}»` : "Ningún colaborador coincide"}
      </h3>
      <p className="text-center text-[12.5px] text-[#71757E]">
        {hasFilters
          ? "Hay filtros puestos que pueden estar dejando fuera lo que buscas."
          : "Puede que aún no le hayas invitado a ninguna canción."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
        {hasFilters ? (
          <button
            onClick={onClearFilters}
            className="rounded-2xl bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            Limpiar filtros
          </button>
        ) : (
          <button
            onClick={onInvite}
            className="flex items-center gap-1.5 rounded-2xl bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invitar a una canción
          </button>
        )}
        {searching && (
          <button
            onClick={onClearSearch}
            className="rounded-2xl border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
          >
            Borrar búsqueda
          </button>
        )}
      </div>
    </div>
  );
}
