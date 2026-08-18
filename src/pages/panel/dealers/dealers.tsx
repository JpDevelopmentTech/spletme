import { useState } from "react";
import {
  Search,
  Plus,
  Handshake,
  SearchX,
  CirclePlus,
  FileUp,
  ChartPie,
  ArrowUp,
  ArrowDown,
  FunnelX,
  TriangleAlert,
} from "lucide-react";
import { distributorsService } from "@/services/distributorsService";
import { useDistributorsLibrary } from "@/hooks/useDistributorsLibrary";
import { DistributorsKpis } from "@/components/distributors/DistributorsKpis";
import { RevenueShareBar } from "@/components/distributors/RevenueShareBar";
import { YearCoverageCard } from "@/components/distributors/YearCoverageCard";
import { DistributorsFilterBar } from "@/components/distributors/DistributorsFilterBar";
import { DistributorRow } from "@/components/distributors/DistributorRow";
import { CoverageLegend } from "@/components/distributors/CoverageStrip";
import { DeleteDistributorDialog } from "@/components/distributors/DeleteDistributorDialog";
import {
  DISTRIBUTOR_COLUMNS,
  DISTRIBUTORS_GRID,
  NEXT_SORT,
  isDescending,
  type DistributorSortBy,
} from "@/components/distributors/distributorsColumns";
import type { DistributorListItem } from "@/components/distributors/types";
import CreateDistributorModal from "@/components/ui/CreateDistributorModal";
import EditDistributorModal from "@/components/ui/EditDistributorModal";
import UploadSongsModal from "@/components/ui/UploadSongsModal";
import { formatGaps } from "@/utils/coverage.utils";

export default function Dealers() {
  const library = useDistributorsLibrary();
  const {
    loading,
    error,
    reload,
    items,
    allItems,
    totals,
    year,
    setYear,
    years,
    upToMonth,
    search,
    setSearch,
    sortBy,
    setSortBy,
    hasFilters,
    clearAllFilters,
    missingMonths,
    globalGaps,
  } = library;

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<DistributorListItem | null>(null);
  const [deleting, setDeleting] = useState<DistributorListItem | null>(null);
  const [uploadTarget, setUploadTarget] = useState<DistributorListItem | null>(null);

  const isEmpty = allItems.length === 0;

  /** Deja a la vista solo los distribuidores a los que les falta algún mes. */
  const showOnlyGaps = () => {
    library.setCoverageFilter("with_gaps");
    library.setSortBy("coverage_asc");
  };

  return (
    <div className="min-h-full bg-[#F7F7F9]">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-display text-2xl font-semibold text-[#1C1D22]">Distribuidores</h1>
            <p className="flex flex-wrap items-center gap-2 text-[13px] text-[#71757E]">
              <span>
                {allItems.length} {allItems.length === 1 ? "distribuidor" : "distribuidores"}
              </span>
              <span className="text-[#A6AAB2]">·</span>
              <span>{totals.uploadCount} cargas</span>
              {missingMonths > 0 && (
                <>
                  <span className="text-[#A6AAB2]">·</span>
                  <button
                    onClick={showOnlyGaps}
                    className="font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
                  >
                    {missingMonths} {missingMonths === 1 ? "mes" : "meses"} sin cubrir
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-[290px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6AAB2]"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar distribuidor o proveedor…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[22px] border border-[#E8E8EC] bg-white py-2.5 pl-11 pr-4 text-[12.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-[#FF5C00] focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15"
              />
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex flex-shrink-0 items-center gap-2 rounded-[22px] bg-[#FF5C00] px-[18px] py-2.5 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors hover:bg-[#EA580C]"
            >
              <Plus className="h-[15px] w-[15px]" />
              Nuevo distribuidor
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#F5C2C4] bg-[#FDECEC] px-4 py-3">
            <TriangleAlert className="h-4 w-4 flex-shrink-0 text-[#E5484D]" />
            <span className="flex-1 text-[12.5px] text-[#E5484D]">{error}</span>
            <button
              onClick={reload}
              className="rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-semibold text-[#E5484D]"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <TableSkeleton />
        ) : isEmpty ? (
          <FirstDistributorState onCreate={() => setShowCreate(true)} />
        ) : (
          <>
            <DistributorsKpis
              distributorsCount={allItems.length}
              songsCount={totals.songsCount}
              totalNetIncome={totals.totalNetIncome}
              totalGrossIncome={totals.totalGrossIncome}
              totalStreams={totals.totalStreams}
              missingMonths={missingMonths}
              gapsLabel={formatGaps(globalGaps)}
              year={year}
              onShowGaps={missingMonths > 0 ? showOnlyGaps : undefined}
            />

            <div className="flex flex-col gap-5 lg:flex-row">
              <RevenueShareBar
                className="min-w-0 flex-1"
                slices={allItems.map((item) => ({
                  id: item.distributor._id,
                  name: item.distributor.name,
                  amount: item.kpi?.totalNetIncome ?? 0,
                  color: item.color,
                }))}
              />
              <YearCoverageCard
                countByMonth={library.countByMonth}
                distributorsCount={allItems.length}
                gaps={globalGaps}
                year={year}
                years={years}
                onYearChange={setYear}
                upToMonth={upToMonth}
                onShowGaps={missingMonths > 0 ? showOnlyGaps : undefined}
              />
            </div>

            <DistributorsFilterBar
              currencyFilter={library.currencyFilter}
              onCurrencyFilterChange={library.setCurrencyFilter}
              providerFilter={library.providerFilter}
              onProviderFilterChange={library.setProviderFilter}
              providers={library.providers}
              coverageFilter={library.coverageFilter}
              onCoverageFilterChange={library.setCoverageFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              hasFilters={hasFilters}
              onClearAll={clearAllFilters}
            />

            {items.length === 0 ? (
              <NoResultsState
                search={search}
                hasFilters={hasFilters}
                onClearFilters={clearAllFilters}
                onClearSearch={() => setSearch("")}
              />
            ) : (
              <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
                <TableHeader sortBy={sortBy} onSortChange={setSortBy} />
                <div className="h-px bg-[#E8E8EC]" />
                <div className="flex flex-col divide-y divide-[#E8E8EC]">
                  {items.map((item) => (
                    <DistributorRow
                      key={item.distributor._id}
                      item={item}
                      year={year}
                      upToMonth={upToMonth}
                      onUpload={setUploadTarget}
                      onEdit={setEditing}
                      onDelete={setDeleting}
                    />
                  ))}
                </div>
                <div className="h-px bg-[#E8E8EC]" />
                <div className="flex flex-col items-start justify-between gap-3 px-5 py-3.5 sm:flex-row sm:items-center">
                  <span className="text-[12px] text-[#71757E]">
                    {items.length}
                    {items.length === allItems.length ? "" : ` de ${allItems.length}`}{" "}
                    {items.length === 1 ? "distribuidor" : "distribuidores"} ·{" "}
                    {totals.uploadCount} cargas · {totals.songsCount.toLocaleString()} canciones
                  </span>
                  <div className="hidden xl:block">
                    <CoverageLegend />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showCreate && (
        <CreateDistributorModal
          existingNames={allItems.map((item) => item.distributor.name)}
          onClose={() => setShowCreate(false)}
          onConfirm={async (payload) => {
            const created = await distributorsService.create(payload);
            await reload();
            // Un distribuidor recién creado no sirve de nada vacío: se encadena
            // con la subida de su primer reporte.
            setUploadTarget({
              distributor: created,
              kpi: null,
              color: "#FF5C00",
              uploads: [],
              covered: new Set(),
              gaps: [],
              missingMonths: 0,
              shareOfTotal: 0,
              shareOfMax: 0,
            });
          }}
        />
      )}

      {editing && (
        <EditDistributorModal
          distributor={editing.distributor}
          onClose={() => setEditing(null)}
          onConfirm={async (payload) => {
            await distributorsService.update(editing.distributor._id, payload);
            await reload();
          }}
        />
      )}

      {deleting && (
        <DeleteDistributorDialog
          item={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await distributorsService.remove(deleting.distributor._id);
            await reload();
          }}
        />
      )}

      {uploadTarget && (
        <UploadSongsModal
          distributorName={uploadTarget.distributor.name}
          distributorLogo={uploadTarget.distributor.photoUrl}
          existingUploads={uploadTarget.uploads}
          onClose={() => setUploadTarget(null)}
          onConfirm={async (file, period, onProgress, onProcessingProgress) => {
            const result = await distributorsService.uploadSongs(
              uploadTarget.distributor._id,
              file,
              period,
              onProgress,
              onProcessingProgress,
            );
            await reload();
            return result;
          }}
        />
      )}
    </div>
  );
}

/** Cabecera de la tabla: cada columna ordena y marca el criterio activo. */
function TableHeader({
  sortBy,
  onSortChange,
}: {
  sortBy: DistributorSortBy;
  onSortChange: (v: DistributorSortBy) => void;
}) {
  return (
    <div className={`${DISTRIBUTORS_GRID} px-5 py-3`}>
      <div className="flex min-w-0">
        <ColumnButton
          label="DISTRIBUIDOR"
          active={sortBy === "name_asc"}
          descending={false}
          onClick={() => onSortChange(NEXT_SORT.name(sortBy))}
        />
      </div>
      {DISTRIBUTOR_COLUMNS.map((column) => {
        const active = Boolean(column.sortKeys?.includes(sortBy));
        return (
          <div key={column.key} className={column.visibility}>
            {column.sortKeys ? (
              <ColumnButton
                label={column.label}
                active={active}
                descending={isDescending(sortBy)}
                onClick={() => onSortChange(NEXT_SORT[column.key](sortBy))}
              />
            ) : (
              <ColumnLabel>{column.label}</ColumnLabel>
            )}
          </div>
        );
      })}
      <div />
    </div>
  );
}

function ColumnButton({
  label,
  active,
  descending,
  onClick,
}: {
  label: string;
  active: boolean;
  descending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 transition-colors ${
        active ? "text-[#FF5C00]" : "text-[#A6AAB2] hover:text-[#71757E]"
      }`}
    >
      <span className="font-mono text-[9.5px] font-medium tracking-[1.2px]">{label}</span>
      {active && (descending ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
    </button>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
      {children}
    </span>
  );
}

/** Tabla fantasma: conserva las columnas mientras llegan los datos. */
function TableSkeleton() {
  const widths = ["w-[148px]", "w-[112px]", "w-[168px]", "w-[130px]"];
  return (
    <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white">
      <div className={`${DISTRIBUTORS_GRID} px-5 py-3`}>
        <div className="min-w-0">
          <ColumnLabel>DISTRIBUIDOR</ColumnLabel>
        </div>
        {DISTRIBUTOR_COLUMNS.map((column) => (
          <div key={column.key} className={column.visibility}>
            <ColumnLabel>{column.label}</ColumnLabel>
          </div>
        ))}
        <div />
      </div>
      <div className="h-px bg-[#E8E8EC]" />
      <div className="flex flex-col divide-y divide-[#E8E8EC]">
        {widths.map((width, index) => (
          <div key={width} className={`${DISTRIBUTORS_GRID} px-5 py-3.5`}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-[42px] w-[42px] flex-shrink-0 animate-pulse rounded-[14px] bg-[#F4F5F7]" />
              <div className="flex flex-1 flex-col gap-2">
                <div className={`h-2.5 animate-pulse rounded-full bg-[#F4F5F7] ${width}`} />
                <div
                  className={`h-2 animate-pulse rounded-full bg-[#F4F5F7]/70 ${
                    index % 2 ? "w-[84px]" : "w-[108px]"
                  }`}
                />
              </div>
            </div>
            {DISTRIBUTOR_COLUMNS.map((column) => (
              <div key={column.key} className={column.visibility}>
                <div className="h-2.5 w-[70%] animate-pulse rounded-full bg-[#F4F5F7]" />
              </div>
            ))}
            <div className="flex justify-end gap-1.5">
              <div className="h-8 w-8 animate-pulse rounded-full bg-[#F4F5F7]" />
              <div className="h-8 w-8 animate-pulse rounded-full bg-[#F4F5F7]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ONBOARDING_STEPS = [
  {
    icon: <CirclePlus className="h-3.5 w-3.5 text-[#FF5C00]" />,
    title: "Conecta la cuenta",
    detail: "DistroKid, TuneCore, CD Baby…",
  },
  {
    icon: <FileUp className="h-3.5 w-3.5 text-[#FF5C00]" />,
    title: "Sube el reporte",
    detail: "CSV o Excel, tal cual lo descargas",
  },
  {
    icon: <ChartPie className="h-3.5 w-3.5 text-[#FF5C00]" />,
    title: "Ve el reparto",
    detail: "Ingresos por canción y colaborador",
  },
];

/** Pantalla vacía: explica el modelo completo, no solo ofrece un botón. */
function FirstDistributorState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[26px] border border-[#E8E8EC] bg-white px-6 py-[46px] sm:px-10">
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[22px] bg-[#FFEADD]">
        <Handshake className="h-[26px] w-[26px] text-[#FF5C00]" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <h2 className="font-display text-[19px] font-semibold text-[#1C1D22]">
          Conecta tu primer distribuidor
        </h2>
        <p className="max-w-[520px] text-center text-[12.5px] leading-relaxed text-[#71757E]">
          Splitme lee los reportes de regalías que ya descargas y reparte los ingresos entre tus
          colaboradores.
        </p>
      </div>

      <ol className="grid w-full max-w-[740px] grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
        {ONBOARDING_STEPS.map((step, index) => (
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
        onClick={onCreate}
        className="mt-2 flex items-center gap-2 rounded-[20px] bg-[#FF5C00] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors hover:bg-[#EA580C]"
      >
        <Plus className="h-[15px] w-[15px]" />
        Conectar distribuidor
      </button>
    </div>
  );
}

/** Sin resultados: dice qué está limitando la vista y ofrece deshacerlo. */
function NoResultsState({
  search,
  hasFilters,
  onClearFilters,
  onClearSearch,
}: {
  search: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onClearSearch: () => void;
}) {
  const searching = search.trim() !== "";
  return (
    <div className="flex flex-col items-center gap-3 rounded-[26px] border border-[#E8E8EC] bg-white px-6 py-[50px]">
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#F4F5F7]">
        <SearchX className="h-[22px] w-[22px] text-[#71757E]" />
      </div>
      <h3 className="font-display text-base font-semibold text-[#1C1D22]">
        {searching ? `Sin resultados para «${search}»` : "Ningún distribuidor coincide"}
      </h3>
      <p className="text-center text-[12.5px] text-[#71757E]">
        {hasFilters
          ? "Hay filtros puestos que pueden estar dejando fuera lo que buscas."
          : "Prueba con otro nombre o proveedor."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 rounded-2xl bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            <FunnelX className="h-3.5 w-3.5" />
            Limpiar filtros
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
