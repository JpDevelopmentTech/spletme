import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Music,
  Play,
  DollarSign,
  FileStack,
  CalendarOff,
  Building2,
  CircleDollarSign,
  History,
  TriangleAlert,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";
import type {
  Currency,
  DistributorDashboard,
  UploadPeriodPayload,
} from "@/types/distributor.types";
import { distributorsService } from "@/services/distributorsService";
import { formatStreams, formatMoney } from "@/utils/format.utils";
import {
  availableYears,
  countMissingMonths,
  coveredMonths,
  findCoverageGaps,
  formatMonthRange,
  formatRelativeDate,
  lastRelevantMonth,
  type MonthRange,
} from "@/utils/coverage.utils";
import { DistributorRevenueChart } from "@/components/distributors/DistributorRevenueChart";
import { UploadHistoryList } from "@/components/distributors/UploadHistoryList";
import { DistributorTopSongs } from "@/components/distributors/DistributorTopSongs";
import { DetailCoveragePanel } from "@/components/distributors/DetailCoveragePanel";
import { RowActionsMenu } from "@/components/distributors/RowActionsMenu";
import { DeleteDistributorDialog } from "@/components/distributors/DeleteDistributorDialog";
import { DistributorMark } from "@/components/ui/ModalShell";
import UploadSongsModal from "@/components/ui/UploadSongsModal";
import EditDistributorModal from "@/components/ui/EditDistributorModal";
import Loading from "@/components/loading/loading";

export default function DistributorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<DistributorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [showUpload, setShowUpload] = useState(false);
  const [presetPeriod, setPresetPeriod] = useState<UploadPeriodPayload | undefined>();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setDashboard(await distributorsService.getDashboard(id));
    } catch {
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  /** Cargas de más reciente a más antigua; el orden de la API no está garantizado. */
  const sortedUploads = useMemo(
    () =>
      [...(dashboard?.uploads ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [dashboard],
  );
  /** Las cargas con error no cubren su periodo: ese mes sigue pendiente. */
  const uploads = useMemo(
    () => sortedUploads.filter((u) => u.status !== "error"),
    [sortedUploads],
  );
  const upToMonth = useMemo(() => lastRelevantMonth(year), [year]);
  const covered = useMemo(() => coveredMonths(uploads, year), [uploads, year]);
  const gaps = useMemo(() => findCoverageGaps(covered, upToMonth), [covered, upToMonth]);
  const years = useMemo(() => availableYears(uploads), [uploads]);
  const missingMonths = countMissingMonths(gaps);

  if (loading) return <Loading />;

  if (!dashboard) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 bg-[#F7F7F9] px-4">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#FDECEC]">
          <TriangleAlert className="h-[22px] w-[22px] text-[#E5484D]" />
        </span>
        <h2 className="font-display text-base font-semibold text-[#1C1D22]">
          No se pudo cargar el distribuidor
        </h2>
        <p className="text-[12.5px] text-[#71757E]">
          Puede que ya no exista o que la conexión haya fallado.
        </p>
        <div className="flex items-center gap-2.5 pt-1.5">
          <button
            onClick={load}
            className="rounded-2xl bg-[#FF5C00] px-4 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#EA580C]"
          >
            Reintentar
          </button>
          <button
            onClick={() => navigate("/panel/dealers")}
            className="rounded-2xl border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
          >
            Volver a distribuidores
          </button>
        </div>
      </div>
    );
  }

  const { distributor, totals, revenueByPeriod, topSongs } = dashboard;
  const retained =
    totals.totalGrossIncome > 0
      ? Math.round((totals.totalNetIncome / totals.totalGrossIncome) * 100)
      : 0;
  const lastUpload = sortedUploads[0]?.createdAt ?? null;

  const openUpload = (period?: MonthRange) => {
    setPresetPeriod(
      period ? { startMonth: period.startMonth, endMonth: period.endMonth, year } : undefined,
    );
    setShowUpload(true);
  };

  return (
    <div className="min-h-full bg-[#F7F7F9]">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <button
              onClick={() => navigate("/panel/dealers")}
              aria-label="Volver a distribuidores"
              className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full border border-[#E8E8EC] bg-white text-[#71757E] transition-colors hover:text-[#1C1D22]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <DistributorMark name={distributor.name} logo={distributor.photoUrl} size={54} />
            <div className="flex min-w-0 flex-col gap-1.5">
              <h1 className="truncate font-display text-2xl font-semibold text-[#1C1D22]">
                {distributor.name}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5">
                {distributor.provider && (
                  <Chip icon={<Building2 className="h-3 w-3" />}>{distributor.provider}</Chip>
                )}
                <Chip
                  icon={<CircleDollarSign className="h-3 w-3" />}
                  tone={{ bg: "#E4F5EC", fg: "#2FB37E" }}
                >
                  {distributor.currency === "USD" ? "USD · Dólar" : "EUR · Euro"}
                </Chip>
                <Chip icon={<FileStack className="h-3 w-3" />}>
                  {totals.uploadCount} {totals.uploadCount === 1 ? "carga" : "cargas"}
                </Chip>
                <Chip icon={<History className="h-3 w-3" />}>
                  Última {formatRelativeDate(lastUpload)}
                </Chip>
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2.5">
            <button
              onClick={() => openUpload()}
              className="flex items-center gap-2 rounded-[22px] bg-[#FF5C00] px-[18px] py-2.5 text-[12.5px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.4)] transition-colors hover:bg-[#EA580C]"
            >
              <Upload className="h-[15px] w-[15px]" />
              Subir reporte
            </button>
            <RowActionsMenu
              label={`Acciones de ${distributor.name}`}
              actions={[
                {
                  key: "edit",
                  label: "Editar nombre y moneda",
                  icon: <Pencil className="h-4 w-4" />,
                  onSelect: () => setEditing(true),
                },
                {
                  key: "export",
                  label: "Exportar cargas (CSV)",
                  icon: <Download className="h-4 w-4" />,
                  onSelect: () => exportUploads(dashboard),
                  disabled: sortedUploads.length === 0,
                },
                {
                  key: "delete",
                  label: "Eliminar distribuidor",
                  icon: <Trash2 className="h-4 w-4" />,
                  danger: true,
                  onSelect: () => setDeleting(true),
                },
              ]}
            />
          </div>
        </div>

        {/* Consola de métricas */}
        <div className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:flex-row lg:divide-x lg:divide-y-0">
          <Channel
            label="INGRESOS NETOS"
            icon={<DollarSign className="h-[13px] w-[13px] text-[#2FB37E]" />}
            value={formatMoney(totals.totalNetIncome, distributor.currency)}
            valueClassName="text-[#2FB37E] text-[26px] sm:text-[30px]"
            className="lg:w-[300px] lg:flex-shrink-0"
          >
            {totals.totalGrossIncome > 0 && (
              <span className="text-[10.5px] text-[#A6AAB2]">
                bruto {formatMoney(totals.totalGrossIncome, distributor.currency)} · {retained}%
                retenido
              </span>
            )}
          </Channel>
          <Channel
            label="STREAMS"
            icon={<Play className="h-[13px] w-[13px] text-[#71757E]" />}
            value={formatStreams(totals.totalStreams)}
          />
          <Channel
            label="CANCIONES"
            icon={<Music className="h-[13px] w-[13px] text-[#71757E]" />}
            value={totals.songsCount.toLocaleString()}
          />
          <Channel
            label="CARGAS"
            icon={<FileStack className="h-[13px] w-[13px] text-[#71757E]" />}
            value={String(totals.uploadCount)}
          />
          <Channel
            label={`SIN CARGAR ${year}`}
            labelClassName="text-[#FF5C00]"
            icon={<CalendarOff className="h-[13px] w-[13px] text-[#FF5C00]" />}
            value={missingMonths > 0 ? gaps.map(formatMonthRange).join(" · ") : "Al día"}
            valueClassName="text-[#FF5C00] text-[22px]"
            className="bg-[#FFEADD] lg:w-[240px] lg:flex-shrink-0"
          >
            <span className="text-[10.5px] font-semibold text-[#EA580C]">
              {missingMonths > 0
                ? `${missingMonths} ${missingMonths === 1 ? "mes" : "meses"} de ${year}`
                : `Todo ${year} cubierto`}
            </span>
          </Channel>
        </div>

        {/* Cuerpo */}
        <div className="flex flex-col gap-5 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <DistributorRevenueChart
              periods={revenueByPeriod}
              currency={distributor.currency}
            />
            <UploadHistoryList
              uploads={sortedUploads}
              currency={distributor.currency}
              onUpload={() => openUpload()}
            />
          </div>

          <div className="flex flex-col gap-5 xl:w-[352px] xl:flex-shrink-0">
            <DetailCoveragePanel
              covered={covered}
              gaps={gaps}
              year={year}
              years={years}
              onYearChange={setYear}
              upToMonth={upToMonth}
              onFillGap={openUpload}
            />
            <DistributorTopSongs songs={topSongs} currency={distributor.currency} />
          </div>
        </div>
      </div>

      {showUpload && (
        <UploadSongsModal
          distributorName={distributor.name}
          distributorLogo={distributor.photoUrl}
          existingUploads={uploads}
          initialPeriod={presetPeriod}
          onClose={() => {
            setShowUpload(false);
            setPresetPeriod(undefined);
          }}
          onConfirm={async (file, period, onProgress, onProcessingProgress) => {
            if (!id) return;
            const result = await distributorsService.uploadSongs(
              id,
              file,
              period,
              onProgress,
              onProcessingProgress,
            );
            await load();
            return result;
          }}
        />
      )}

      {editing && (
        <EditDistributorModal
          distributor={distributor}
          onClose={() => setEditing(false)}
          onConfirm={async (payload: { name: string; currency: Currency }) => {
            if (!id) return;
            await distributorsService.update(id, payload);
            await load();
          }}
        />
      )}

      {deleting && (
        <DeleteDistributorDialog
          item={{
            distributor,
            kpi: {
              distributorId: distributor._id,
              name: distributor.name,
              currency: distributor.currency,
              photoUrl: distributor.photoUrl,
              totalStreams: totals.totalStreams,
              totalNetIncome: totals.totalNetIncome,
              totalGrossIncome: totals.totalGrossIncome,
              uploadCount: totals.uploadCount,
              songsCount: totals.songsCount,
              lastUpload,
            },
            color: "#FF5C00",
            uploads: sortedUploads,
            covered,
            gaps,
            missingMonths,
            shareOfTotal: 100,
            shareOfMax: 100,
          }}
          onClose={() => setDeleting(false)}
          onConfirm={async () => {
            if (!id) return;
            await distributorsService.remove(id);
            navigate("/panel/dealers");
          }}
        />
      )}
    </div>
  );
}

function Chip({
  icon,
  children,
  tone = { bg: "#F4F5F7", fg: "#71757E" },
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  tone?: { bg: string; fg: string };
}) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-[14px] px-2.5 py-1"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {icon}
      <span className="text-[11.5px] font-medium">{children}</span>
    </span>
  );
}

interface ChannelProps {
  label: string;
  labelClassName?: string;
  icon: React.ReactNode;
  value: string;
  valueClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

function Channel({
  label,
  labelClassName = "text-[#71757E]",
  icon,
  value,
  valueClassName = "text-[#1C1D22] text-[26px]",
  className = "",
  children,
}: ChannelProps) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col justify-center gap-2 px-6 py-[22px] ${className}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={`font-mono text-[9.5px] font-medium tracking-[1.3px] ${labelClassName}`}>
          {label}
        </span>
      </div>
      <p className={`font-mono font-semibold leading-none tracking-tight ${valueClassName}`}>
        {value}
      </p>
      {children}
    </div>
  );
}

/** Vuelca el historial para conciliarlo fuera de la aplicación. */
function exportUploads(dashboard: DistributorDashboard) {
  const { distributor, uploads } = dashboard;
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const rows = [
    ["Periodo", "Año", "Archivo", "Canciones", "Streams", "Bruto", "Neto", "Estado", "Subido por", "Fecha"],
    ...uploads.map((upload) => [
      upload.periodLabel,
      upload.year,
      upload.fileName,
      upload.songsCount,
      upload.totalStreams,
      upload.totalGrossIncome,
      upload.totalNetIncome,
      upload.status,
      upload.uploadedBy?.name ?? "",
      new Date(upload.createdAt).toISOString().slice(0, 10),
    ]),
  ];

  const csv = rows.map((row) => row.map(escape).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cargas-${distributor.name.replace(/[^\w]+/g, "-").toLowerCase()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
