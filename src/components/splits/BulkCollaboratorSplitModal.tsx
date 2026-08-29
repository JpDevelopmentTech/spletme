import { Users, TriangleAlert, Crown, UserPlus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useBulkCollaboratorSplit, type BulkSplitTrack } from "@/hooks/useBulkCollaboratorSplit";
import { ModalShell, PrimaryButton, SecondaryButton } from "@/components/ui/ModalShell";
import { FieldLabel, Progress, Results, Scope } from "./bulkSplitPieces";
// FUNCIONALIDAD TEMPORAL — perfiles sin cuenta. Ver docs/PERFILES_TEMPORALES.md.
import {
  PlaceholderAvatar,
  PlaceholderChip,
} from "@/components/collaborators/PlaceholderAvatar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Título del conjunto: el nombre del álbum o del sello. */
  name: string;
  /** Línea de contexto bajo el título. */
  context?: string;
  /** Marca del conjunto en la cabecera del modal. */
  logo: React.ReactNode;
  /** Canciones sobre las que se reparte. */
  tracks: BulkSplitTrack[];
  /** Cómo se llama una canción aquí: «pista» en un álbum, «canción» en un sello. */
  unit?: { one: string; many: string };
  /** Cómo se llama el conjunto: «álbum» o «sello». */
  scopeNoun?: string;
  onSplitsCreated?: () => void;
  /** Abre la asignación del split del owner, requisito para repartir. */
  onAssignOwnerSplit?: () => void;
  /**
   * Si quien reparte es el dueño de las canciones. Solo entonces se nombra su
   * split: es el único que puede asignarlo y el único que puede saber que
   * existe. Ver `utils/ownerVisibility.ts`.
   */
  showOwnerContext?: boolean;
  /** Abre la invitación, para sumar a alguien a las canciones que le faltan. */
  onInvite?: () => void;
}

/**
 * Reparte a UN colaborador su porcentaje en todas las canciones de un conjunto
 * —un álbum o un sello— donde esa persona figura.
 *
 * El gemelo del modal del owner, con la diferencia que impone el reparto: el
 * porcentaje de un colaborador sale de lo que el owner deja, así que una canción
 * sin split del owner lo rechaza. Eso se comprueba al elegir a la persona y se
 * dice antes de empezar —con el botón que lo arregla al lado— en vez de dejar
 * que la pasada termine con doce errores idénticos.
 */
export default function BulkCollaboratorSplitModal({
  isOpen,
  onClose,
  name,
  context,
  logo,
  tracks,
  unit = { one: "pista", many: "pistas" },
  scopeNoun = "álbum",
  onSplitsCreated,
  onAssignOwnerSplit,
  onInvite,
  showOwnerContext = false,
}: Props) {
  const {
    mounted,
    collaborators,
    collaboratorId,
    selected,
    targetTracks,
    form,
    ownerRate,
    setOwnerRate,
    isLoading,
    isLoadingFilters,
    countryOptions,
    platformOptions,
    progress,
    showResults,
    autoCloseCountdown,
    error,
    selectCollaborator,
    updateForm,
    createBulkCollaboratorSplits,
    closeWithReset,
  } = useBulkCollaboratorSplit(isOpen, tracks, onClose, onSplitsCreated);

  if (!mounted || !isOpen) return null;

  const totalTracks = tracks.length;
  const percentage = Number(form.percentage || 0);
  const validPercentage = percentage > 0 && percentage <= 100;
  const running = Boolean(progress) && !showResults;

  /** Pistas suyas que hoy no admiten reparto por faltarles el split del owner. */
  const blocked = selected?.blockedTracks.length ?? 0;
  /** Canciones del conjunto en las que esa persona no colabora. */
  const missing = selected ? totalTracks - selected.tracks.length : 0;

  const title = showResults
    ? "Reparto aplicado"
    : running
      ? "Repartiendo"
      : "Split de un colaborador";

  return (
    <ModalShell
      title={title}
      subtitle={`${name}${context ? ` · ${context}` : ""}`}
      width="xl"
      locked={running}
      onClose={closeWithReset}
      logo={logo}
      footer={
        showResults ? (
          <>
            <span className="flex-1 text-[11px] text-[#A6AAB2]">
              {autoCloseCountdown !== null
                ? `Se cierra solo en ${autoCloseCountdown}s`
                : "El reparto ya está actualizado"}
            </span>
            {progress && progress.failed > 0 && (
              <SecondaryButton onClick={createBulkCollaboratorSplits}>Reintentar</SecondaryButton>
            )}
            <PrimaryButton onClick={closeWithReset}>Hecho</PrimaryButton>
          </>
        ) : running ? (
          <span className="flex-1 text-[11px] text-[#A6AAB2]">
            No cierres la ventana hasta que termine.
          </span>
        ) : (
          <>
            <span className="flex-1" />
            <SecondaryButton onClick={closeWithReset}>Cancelar</SecondaryButton>
            <PrimaryButton
              onClick={createBulkCollaboratorSplits}
              disabled={!selected || !validPercentage || isLoading || targetTracks.length === 0}
              icon={<Users className="h-[15px] w-[15px]" />}
            >
              {!selected
                ? "Elige a alguien"
                : targetTracks.length === 0
                  ? `Sin ${unit.many} que repartir`
                  : `Repartir en ${targetTracks.length} ${
                      targetTracks.length === 1 ? unit.one : unit.many
                    }`}
            </PrimaryButton>
          </>
        )
      }
    >
      {showResults && progress ? (
        <Results progress={progress} />
      ) : running && progress ? (
        <Progress progress={progress} percentage={percentage} />
      ) : collaborators.length === 0 ? (
        <EmptyState onInvite={onInvite} scopeNoun={scopeNoun} />
      ) : (
        /* Dos columnas: a la izquierda a quién se reparte, a la derecha cuánto y
           dónde. La lista se queda fija mientras se configura, así que se puede
           comparar en cuántas canciones está cada uno sin perder el formulario de
           vista. En pantallas estrechas vuelven a apilarse. */
        <div className="grid gap-5 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-6">
          {/* A quién */}
          <div className="flex min-w-0 flex-col gap-2.5 md:border-r md:border-[#E8E8EC] md:pr-6">
            <FieldLabel>COLABORADOR *</FieldLabel>
            <div className="flex max-h-[360px] flex-col gap-1.5 overflow-y-auto">
              {collaborators.map((person) => {
                const active = person.id === collaboratorId;
                return (
                  <button
                    key={person.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => selectCollaborator(person.id)}
                    className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-[1.5px] border-[#FF5C00] bg-[#FFEADD]"
                        : "border border-[#E8E8EC] bg-white hover:border-[#D9DAE0]"
                    }`}
                  >
                    {person.placeholderId ? (
                      <PlaceholderAvatar name={person.name} size={32} />
                    ) : (
                      <span
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                          active ? "bg-[#FF5C00] text-white" : "bg-[#F4F5F7] text-[#71757E]"
                        }`}
                      >
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                          {person.name}
                        </span>
                        {person.placeholderId && <PlaceholderChip />}
                      </span>
                      {/* En cuántas está: es el alcance real de su reparto. */}
                      <span
                        className={`font-mono text-[10.5px] ${
                          active ? "text-[#EA580C]" : "text-[#A6AAB2]"
                        }`}
                      >
                        {person.tracks.length} de {totalTracks} {unit.many}
                      </span>
                    </span>
                    {active && <Check className="h-[15px] w-[15px] flex-shrink-0 text-[#FF5C00]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cuánto y dónde */}
          <div className="flex min-w-0 flex-col gap-5">
            {!selected ? (
              <PickSomeone />
            ) : (
              <>
                {/* Lo que el reparto no puede cubrir, dicho antes de empezar. */}
                {showOwnerContext && blocked > 0 && (
                  <Blocker
                    tone="danger"
                    icon={<Crown className="h-[17px] w-[17px] text-[#E5484D]" />}
                    title={`${blocked} ${
                      blocked === 1
                        ? `${unit.one} suya no reparte`
                        : `${unit.many} suyas no reparten`
                    } todavía`}
                    detail={`Su porcentaje sale de lo que deja el owner, así que primero hay que asignar el split del owner en esas ${unit.many}.`}
                    actionLabel="Asignar split del owner"
                    onAction={onAssignOwnerSplit}
                  />
                )}

                {missing > 0 && (
                  <Blocker
                    tone="neutral"
                    icon={<UserPlus className="h-[17px] w-[17px] text-[#71757E]" />}
                    title={`No colabora en ${missing} ${
                      missing === 1 ? unit.one : unit.many
                    } del ${scopeNoun}`}
                    detail={`El reparto solo llega a las ${unit.many} donde figura. Si quieres que entre en todas, invítala al ${scopeNoun} completo.`}
                    actionLabel={`Invitar al ${scopeNoun}`}
                    onAction={onInvite}
                  />
                )}

                {/* Porcentaje */}
                <div className="flex flex-col gap-2.5">
                  <FieldLabel>SU PORCENTAJE *</FieldLabel>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex w-[136px] flex-shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2.5 ${
                        validPercentage
                          ? "border-[1.5px] border-[#FF5C00]"
                          : "border border-[#E8E8EC]"
                      }`}
                    >
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.01"
                        value={form.percentage}
                        onChange={(e) => updateForm("percentage", e.target.value)}
                        placeholder="0.00"
                        aria-label="Porcentaje del colaborador"
                        className="w-full bg-transparent font-mono text-[20px] font-semibold text-[#1C1D22] focus:outline-none"
                      />
                      <span className="font-mono text-[15px] font-semibold text-[#A6AAB2]">%</span>
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={Number.isFinite(percentage) ? percentage : 0}
                        onChange={(e) => updateForm("percentage", e.target.value)}
                        aria-label="Ajustar porcentaje"
                        className="w-full accent-[#FF5C00]"
                      />
                      <span className="flex justify-between font-mono text-[9.5px] text-[#A6AAB2]">
                        {["0%", "25%", "50%", "75%", "100%"].map((mark) => (
                          <span key={mark}>{mark}</span>
                        ))}
                      </span>
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#A6AAB2]">
                    {showOwnerContext
                      ? "Es la parte de cada "
                      : "Es el mismo en cada "}
                    {unit.one}
                    {showOwnerContext ? " que le asignas, y es la misma en todas" : ""}. Entre todos
                    los colaboradores no puede pasar del 100%.
                  </p>
                </div>

                {/* Retención del owner con esta persona. Solo la ve el dueño. */}
                {showOwnerContext && (
                  <div className="flex flex-col gap-2.5">
                    <FieldLabel>TU RETENCIÓN CON ESTA PERSONA</FieldLabel>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex w-[136px] flex-shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2.5 ${
                          ownerRate.trim() === ""
                            ? "border border-[#E8E8EC]"
                            : "border-[1.5px] border-[#FF5C00]"
                        }`}
                      >
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step="0.01"
                          value={ownerRate}
                          onChange={(e) => setOwnerRate(e.target.value)}
                          placeholder="La tuya"
                          aria-label="Retención del owner para este colaborador"
                          className="w-full bg-transparent font-mono text-[20px] font-semibold text-[#1C1D22] focus:outline-none"
                        />
                        <span className="font-mono text-[15px] font-semibold text-[#A6AAB2]">
                          %
                        </span>
                      </span>
                      <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-[#A6AAB2]">
                        {ownerRate.trim() === ""
                          ? "Vacío = le aplicas tu porcentaje de owner, el mismo que a todos. Rellénalo solo si con esta persona pactaste otro."
                          : "De la parte que le toque en cada " +
                            unit.one +
                            ", te quedas ese porcentaje y ella cobra el resto."}
                      </p>
                    </div>
                  </div>
                )}

                <Scope
                  label="PAÍSES"
                  type={form.countriesType}
                  onTypeChange={(value) => updateForm("countriesType", value)}
                  options={countryOptions}
                  selected={form.selectedCountries}
                  onSelectedChange={(value) => updateForm("selectedCountries", value)}
                  loading={isLoadingFilters}
                  allLabel="Cobra en todos los países"
                  placeholder="Añadir país…"
                />

                <Scope
                  label="PLATAFORMAS"
                  type={form.platformsType}
                  onTypeChange={(value) => updateForm("platformsType", value)}
                  options={platformOptions}
                  selected={form.selectedPlatforms}
                  onSelectedChange={(value) => updateForm("selectedPlatforms", value)}
                  loading={isLoadingFilters}
                  allLabel="Cobra en todas las plataformas"
                  placeholder="Añadir plataforma…"
                />

                {error && (
                  <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#E5484D]">
                    <TriangleAlert className="h-3.5 w-3.5 flex-shrink-0" />
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </ModalShell>
  );
}

/**
 * Un obstáculo del reparto con la acción que lo quita al lado. Decir «faltan
 * cosas» sin ofrecer el camino obliga a cerrar el modal y buscarlo.
 */
function Blocker({
  tone,
  icon,
  title,
  detail,
  actionLabel,
  onAction,
}: {
  tone: "danger" | "neutral";
  icon: React.ReactNode;
  title: string;
  detail: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  const danger = tone === "danger";
  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-[18px] p-4 ${
        danger ? "bg-[#FDECEC]" : "bg-[#F4F5F7]"
      }`}
    >
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white">
        {icon}
      </span>
      <span className="flex min-w-[180px] flex-1 flex-col gap-0.5">
        <span
          className={`text-[12.5px] font-semibold ${danger ? "text-[#E5484D]" : "text-[#1C1D22]"}`}
        >
          {title}
        </span>
        <span
          className={`text-[11px] leading-relaxed ${danger ? "text-[#E5484D]" : "text-[#71757E]"}`}
        >
          {detail}
        </span>
      </span>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`flex-shrink-0 rounded-[14px] px-3.5 py-2 text-[11.5px] font-semibold transition-colors ${
            danger
              ? "bg-[#E5484D] text-white hover:bg-[#C93B40]"
              : "border border-[#E8E8EC] bg-white text-[#1C1D22] hover:bg-[#F4F5F7]"
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * La columna de configuración antes de elegir a nadie. Deja el hueco ocupado y
 * dice de dónde sale lo que va a aparecer, en vez de mostrar un formulario
 * apagado que no se sabe a quién aplicaría.
 */
function PickSomeone() {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2.5 rounded-[18px] border border-dashed border-[#E8E8EC] px-5 py-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F5F7]">
        <Users className="h-5 w-5 text-[#A6AAB2]" />
      </span>
      <span className="text-[12.5px] font-semibold text-[#1C1D22]">
        Elige a alguien de la lista
      </span>
      <span className="max-w-[280px] text-[11.5px] leading-relaxed text-[#71757E]">
        Aquí aparecerá su porcentaje y en qué países y plataformas lo cobra.
      </span>
    </div>
  );
}

/** Sin colaboradores no hay nada que repartir: el camino es invitar a alguien. */
function EmptyState({ onInvite, scopeNoun }: { onInvite?: () => void; scopeNoun: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[18px] bg-[#F4F5F7] px-5 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
        <Users className="h-[22px] w-[22px] text-[#A6AAB2]" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[13px] font-semibold text-[#1C1D22]">
          Nadie colabora todavía en este {scopeNoun}
        </span>
        <span className="text-[11.5px] leading-relaxed text-[#71757E]">
          Invita a alguien y podrás repartirle su porcentaje desde esta ventana.
        </span>
      </span>
      {onInvite && (
        <button
          type="button"
          onClick={onInvite}
          className="flex items-center gap-2 rounded-[18px] bg-[#FF5C00] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          <UserPlus className="h-[15px] w-[15px]" />
          Invitar al {scopeNoun}
        </button>
      )}
      {/* FUNCIONALIDAD TEMPORAL — perfiles sin cuenta: la salida cuando la
          persona todavía no está en Splitme y no se la puede invitar. */}
      <Link
        to="/panel/placeholder-profiles"
        className="text-[11.5px] font-semibold text-[#71757E] underline decoration-dashed underline-offset-4 transition-colors hover:text-[#1C1D22]"
      >
        O crea a alguien sin cuenta
      </Link>
    </div>
  );
}
