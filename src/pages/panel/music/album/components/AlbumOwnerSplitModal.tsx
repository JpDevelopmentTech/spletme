import { Crown, Loader, Check, TriangleAlert, Globe, RotateCcw, Disc3 } from "lucide-react";
import { useAlbumOwnerSplit } from "@/hooks/useAlbumOwnerSplit";
import { albumSplitCoverage } from "@/utils/music.utils";
import { ModalShell, PrimaryButton, SecondaryButton } from "@/components/ui/ModalShell";
import type { AlbumOwnerSplitModalProps } from "@/types/album-owner-split.types";
import type { AlbumItem } from "@/types/music.types";
import type { SelectOption } from "@/types/select.types";

type ScopeType = "all" | "except" | "only";

const SCOPE_LABELS: { value: ScopeType; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "except", label: "Excepto" },
  { value: "only", label: "Solo" },
];

/**
 * Asigna de una vez el porcentaje del owner a las pistas de un álbum.
 *
 * Es la acción que más trabajo ahorra del módulo, así que lo primero que dice es
 * a cuántas pistas va a afectar y a cuáles no toca. El progreso va pista a pista
 * porque el servidor las crea de una en una, y si alguna falla se explica por qué
 * en vez de perderse en un contador.
 */
export default function AlbumOwnerSplitModal({
  isOpen,
  onClose,
  album,
  onSplitsCreated,
}: AlbumOwnerSplitModalProps) {
  const {
    mounted,
    ownerForm,
    isLoading,
    isLoadingFilters,
    countryOptions,
    platformOptions,
    progress,
    showResults,
    autoCloseCountdown,
    updateOwnerForm,
    createBulkOwnerSplits,
    closeWithReset,
  } = useAlbumOwnerSplit(isOpen, album, onClose, onSplitsCreated);

  if (!mounted || !isOpen) return null;

  const { withSplit, total } = albumSplitCoverage(album as AlbumItem);
  const pending = Math.max(0, total - withSplit);
  const percentage = Number(ownerForm.percentage || 0);
  const validPercentage = percentage > 0 && percentage <= 100;
  const running = Boolean(progress) && !showResults;

  const title = showResults
    ? "Splits creados"
    : running
      ? "Creando splits"
      : "Split del álbum";

  return (
    <ModalShell
      title={title}
      subtitle={`${album.albumTitle}${album.artistName ? ` · ${album.artistName}` : ""}`}
      width="lg"
      locked={running}
      onClose={closeWithReset}
      logo={
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#F4F5F7]">
          <Disc3 className="h-[19px] w-[19px] text-[#A6AAB2]" />
        </span>
      }
      footer={
        showResults ? (
          <>
            <span className="flex-1 text-[11px] text-[#A6AAB2]">
              {autoCloseCountdown !== null
                ? `Se cierra solo en ${autoCloseCountdown}s`
                : "Los álbumes ya están actualizados"}
            </span>
            {progress && progress.failed > 0 && (
              <SecondaryButton onClick={createBulkOwnerSplits}>
                Reintentar las fallidas
              </SecondaryButton>
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
              onClick={createBulkOwnerSplits}
              disabled={!validPercentage || isLoading || total === 0}
              icon={<Crown className="h-[15px] w-[15px]" />}
            >
              {total === 0
                ? "Sin pistas"
                : `Crear ${total} ${total === 1 ? "split" : "splits"}`}
            </PrimaryButton>
          </>
        )
      }
    >
      {showResults && progress ? (
        <Results progress={progress} />
      ) : running && progress ? (
        <Progress progress={progress} percentage={percentage} />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-[18px] bg-[#FFEADD] p-4">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white">
              <Crown className="h-[17px] w-[17px] text-[#FF5C00]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-[#EA580C]">
                Se aplicará a {total} {total === 1 ? "pista" : "pistas"}
              </span>
              <span className="text-[11.5px] text-[#EA580C]">
                {withSplit > 0
                  ? `${withSplit} ${withSplit === 1 ? "pista ya tiene" : "pistas ya tienen"} split y se sobrescribirá con este.`
                  : `Ninguna pista reparte todavía: ${pending} quedarán con tu porcentaje.`}
              </span>
            </span>
          </div>

          {/* Porcentaje */}
          <div className="flex flex-col gap-2.5">
            <FieldLabel>TU PORCENTAJE *</FieldLabel>
            <div className="flex items-center gap-3">
              <span
                className={`flex w-[120px] flex-shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2.5 ${
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
                  value={ownerForm.percentage}
                  onChange={(e) => updateOwnerForm("percentage", e.target.value)}
                  placeholder="0.00"
                  aria-label="Tu porcentaje"
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
                  onChange={(e) => updateOwnerForm("percentage", e.target.value)}
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
              Es lo que te queda a ti en cada pista. El resto se reparte entre los colaboradores.
            </p>
          </div>

          {/* Países */}
          <Scope
            label="PAÍSES"
            type={ownerForm.countriesType}
            onTypeChange={(value) => updateOwnerForm("countriesType", value)}
            options={countryOptions}
            selected={ownerForm.selectedCountries}
            onSelectedChange={(value) => updateOwnerForm("selectedCountries", value)}
            loading={isLoadingFilters}
            allLabel="El split se aplica en todos los países"
            placeholder="Añadir país…"
          />

          {/* Plataformas */}
          <Scope
            label="PLATAFORMAS"
            type={ownerForm.platformsType}
            onTypeChange={(value) => updateOwnerForm("platformsType", value)}
            options={platformOptions}
            selected={ownerForm.selectedPlatforms}
            onSelectedChange={(value) => updateOwnerForm("selectedPlatforms", value)}
            loading={isLoadingFilters}
            allLabel="El split se aplica en todas las plataformas"
            placeholder="Añadir plataforma…"
          />
        </>
      )}
    </ModalShell>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#71757E]">
      {children}
    </span>
  );
}

interface ScopeProps {
  label: string;
  type: ScopeType;
  onTypeChange: (value: ScopeType) => void;
  options: SelectOption[];
  selected: SelectOption[];
  onSelectedChange: (value: SelectOption[]) => void;
  loading: boolean;
  allLabel: string;
  placeholder: string;
}

/** Alcance del split: todos, todos menos unos cuantos, o solo unos cuantos. */
function Scope({
  label,
  type,
  onTypeChange,
  options,
  selected,
  onSelectedChange,
  loading,
  allLabel,
  placeholder,
}: ScopeProps) {
  const restricted = type !== "all";

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>{label}</FieldLabel>
        <div className="flex items-center gap-0.5 rounded-2xl bg-[#F4F5F7] p-0.5">
          {SCOPE_LABELS.map((option) => {
            const active = type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onTypeChange(option.value)}
                aria-pressed={active}
                className={`rounded-[13px] px-3 py-1.5 text-[11.5px] transition-colors ${
                  active
                    ? "bg-white font-semibold text-[#1C1D22] shadow-[0_2px_5px_rgba(16,17,20,0.08)]"
                    : "font-medium text-[#71757E]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {restricted ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-[#E8E8EC] p-3">
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((option) => (
                <span
                  key={option.value}
                  className="flex items-center gap-1.5 rounded-xl bg-[#F4F5F7] px-2.5 py-1"
                >
                  <span className="text-[11px] font-medium text-[#1C1D22]">{option.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectedChange(selected.filter((item) => item.value !== option.value))
                    }
                    aria-label={`Quitar ${option.label}`}
                    className="text-[#A6AAB2] transition-colors hover:text-[#1C1D22]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <select
            value=""
            disabled={loading}
            onChange={(e) => {
              const option = options.find((item) => item.value === e.target.value);
              if (option && !selected.some((item) => item.value === option.value)) {
                onSelectedChange([...selected, option]);
              }
            }}
            className="w-full rounded-xl bg-transparent text-[12px] text-[#71757E] focus:outline-none"
          >
            <option value="">{loading ? "Cargando opciones…" : placeholder}</option>
            {options
              .filter((option) => !selected.some((item) => item.value === option.value))
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        </div>
      ) : (
        <p className="flex items-center gap-2.5 rounded-[14px] bg-[#F4F5F7] px-3.5 py-2.5 text-[11.5px] text-[#71757E]">
          <Globe className="h-3.5 w-3.5 flex-shrink-0" />
          {allLabel}
        </p>
      )}
    </div>
  );
}

interface ProgressShape {
  total: number;
  completed: number;
  failed: number;
  current: string;
  errors: Array<{ songTitle: string; error: string }>;
}

function Progress({ progress, percentage }: { progress: ProgressShape; percentage: number }) {
  const done = progress.completed + progress.failed;
  const percent = progress.total > 0 ? (done / progress.total) * 100 : 0;

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[12.5px] font-semibold text-[#1C1D22]">Creando splits</span>
          <span className="font-mono text-[12px] font-semibold text-[#FF5C00]">
            {done} de {progress.total}
          </span>
        </div>
        <span className="block h-2 w-full overflow-hidden rounded-full bg-[#F4F5F7]">
          <span
            className="block h-full rounded-full bg-[#FF5C00] transition-all duration-300"
            style={{ width: `${Math.max(2, percent)}%` }}
          />
        </span>
        {progress.current && (
          <span className="flex items-center gap-2 text-[11.5px] text-[#71757E]">
            <Loader className="h-3.5 w-3.5 animate-spin text-[#FF5C00]" />
            Aplicando el {percentage}% a «{progress.current}»…
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Tile label="CREADOS" value={progress.completed} color="#2FB37E" background="#E4F5EC" />
        <Tile label="CON ERROR" value={progress.failed} color="#E5484D" background="#FDECEC" />
      </div>
    </>
  );
}

function Results({ progress }: { progress: ProgressShape }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <Tile label="CREADOS" value={progress.completed} color="#2FB37E" background="#E4F5EC" />
        <Tile label="CON ERROR" value={progress.failed} color="#E5484D" background="#FDECEC" />
      </div>

      {progress.failed === 0 ? (
        <div className="flex flex-col items-center gap-2.5 rounded-[18px] bg-[#E4F5EC] p-5">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#2FB37E]">
            <Check className="h-6 w-6 text-white" />
          </span>
          <span className="text-[13px] font-semibold text-[#1F7D58]">
            Todas las pistas reparten ya
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 rounded-[18px] border border-[#E8E8EC] p-4">
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[#1C1D22]">
            <TriangleAlert className="h-3.5 w-3.5 flex-shrink-0 text-[#E5484D]" />
            {progress.failed}{" "}
            {progress.failed === 1 ? "pista no se pudo actualizar" : "pistas no se pudieron actualizar"}
          </span>
          <ul className="flex max-h-[220px] flex-col gap-1.5 overflow-y-auto">
            {progress.errors.map((item, index) => (
              <li
                key={`${item.songTitle}-${index}`}
                className="flex flex-col gap-1 rounded-[13px] bg-[#FDECEC] px-3 py-2.5"
              >
                <span className="text-[12px] font-semibold text-[#E5484D]">{item.songTitle}</span>
                <span className="text-[11px] leading-relaxed text-[#E5484D]">{item.error}</span>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 text-[11px] text-[#71757E]">
            <RotateCcw className="h-3 w-3 flex-shrink-0" />
            Reintentar vuelve a aplicar el porcentaje a todas las pistas del álbum.
          </p>
        </div>
      )}
    </>
  );
}

function Tile({
  label,
  value,
  color,
  background,
}: {
  label: string;
  value: number;
  color: string;
  background: string;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-[16px] px-3.5 py-3"
      style={{ backgroundColor: background }}
    >
      <span
        className="font-mono text-[9.5px] font-medium tracking-[1px]"
        style={{ color }}
      >
        {label}
      </span>
      <span className="font-mono text-[22px] font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
