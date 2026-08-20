import { Crown, Disc3 } from "lucide-react";
import { useAlbumOwnerSplit } from "@/hooks/useAlbumOwnerSplit";
import { albumSplitCoverage } from "@/utils/music.utils";
import { ModalShell, PrimaryButton, SecondaryButton } from "@/components/ui/ModalShell";
import type { AlbumOwnerSplitModalProps } from "@/types/album-owner-split.types";
import type { AlbumItem } from "@/types/music.types";
import { FieldLabel, Progress, Results, Scope } from "@/components/splits/bulkSplitPieces";

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
