import { useMemo, useRef, useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  CircleAlert,
  CircleCheck,
  CalendarCheck,
  CalendarOff,
  Check,
  Cpu,
  Lock,
  Download,
  ArrowRight,
  TriangleAlert,
} from "lucide-react";
import type { UploadPeriodPayload } from "../../types/distributor.types";
import type { RejectedSong, UploadSongsResult, UploadStatus } from "../../services/distributorsService";
import {
  MONTH_NAMES,
  MONTH_SHORT_NAMES,
  buildPeriodLabel,
  findOverlappingUpload,
  formatUploadPeriod,
  monthsCovered,
  resolvePeriod,
  validatePeriodRange,
  type PeriodLike,
} from "../../utils/period.utils";
import { formatMonthRange } from "@/utils/coverage.utils";
import {
  ModalShell,
  FieldLabel,
  PrimaryButton,
  SecondaryButton,
  DistributorMark,
} from "@/components/ui/ModalShell";

type UploadPhase = "idle" | "uploading" | "processing" | "done";

interface Props {
  distributorName: string;
  distributorLogo?: string | null;
  /** Cargas ya registradas, para impedir subir meses que se solapan. */
  existingUploads?: PeriodLike[];
  /** Periodo ya marcado al abrir; lo usa el aviso de hueco del detalle. */
  initialPeriod?: UploadPeriodPayload;
  onClose: () => void;
  onConfirm: (
    file: File,
    period: UploadPeriodPayload,
    onProgress: (percent: number) => void,
    onProcessingProgress?: (status: UploadStatus) => void,
  ) => Promise<UploadSongsResult | void>;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i).reverse();

const PRESETS = [
  { label: "Q1", startMonth: 1, endMonth: 3 },
  { label: "Q2", startMonth: 4, endMonth: 6 },
  { label: "Q3", startMonth: 7, endMonth: 9 },
  { label: "Q4", startMonth: 10, endMonth: 12 },
  { label: "Año completo", startMonth: 1, endMonth: 12 },
];

const ACCEPTED = /\.(csv|xlsx|xls)$/i;

export default function UploadSongsModal({
  distributorName,
  distributorLogo,
  existingUploads = [],
  initialPeriod,
  onClose,
  onConfirm,
}: Props) {
  const [year, setYear] = useState(initialPeriod?.year ?? CURRENT_YEAR);
  const [startMonth, setStartMonth] = useState(initialPeriod?.startMonth ?? 1);
  const [endMonth, setEndMonth] = useState(initialPeriod?.endMonth ?? 3);
  /** Mes desde el que se está extendiendo la selección con el segundo clic. */
  const [anchor, setAnchor] = useState<number | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);
  const [liveProcessed, setLiveProcessed] = useState(0);
  const [liveRejected, setLiveRejected] = useState(0);
  const [result, setResult] = useState<UploadSongsResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const busy = phase === "uploading" || phase === "processing";

  /** Meses del año ya cubiertos por otras cargas: no se pueden volver a subir. */
  const takenMonths = useMemo(() => {
    const taken = new Set<number>();
    for (const upload of existingUploads) {
      if (upload.year !== year) continue;
      const period = resolvePeriod(upload);
      if (!period) continue;
      for (let m = period.startMonth; m <= period.endMonth; m += 1) taken.add(m);
    }
    return taken;
  }, [existingUploads, year]);

  const rangeError = validatePeriodRange(startMonth, endMonth);
  const periodLabel = buildPeriodLabel(startMonth, endMonth, year);
  const months = monthsCovered(startMonth, endMonth);

  const overlapping = rangeError
    ? null
    : findOverlappingUpload(existingUploads, { startMonth, endMonth }, year);

  /** Meses de la selección que chocan con una carga previa. */
  const conflictingMonths = useMemo(() => {
    const conflicts: number[] = [];
    for (let m = startMonth; m <= endMonth; m += 1) if (takenMonths.has(m)) conflicts.push(m);
    return conflicts;
  }, [startMonth, endMonth, takenMonths]);

  /** El tramo libre contiguo más largo dentro de la selección, para ofrecer el arreglo. */
  const suggestedRange = useMemo(() => {
    if (conflictingMonths.length === 0) return null;
    let best: { startMonth: number; endMonth: number } | null = null;
    let current: number | null = null;

    for (let m = startMonth; m <= endMonth + 1; m += 1) {
      const free = m <= endMonth && !takenMonths.has(m);
      if (free && current === null) current = m;
      if (!free && current !== null) {
        const candidate = { startMonth: current, endMonth: m - 1 };
        const size = candidate.endMonth - candidate.startMonth + 1;
        if (!best || size > best.endMonth - best.startMonth + 1) best = candidate;
        current = null;
      }
    }
    return best;
  }, [conflictingMonths, startMonth, endMonth, takenMonths]);

  function selectMonth(month: number) {
    if (takenMonths.has(month)) return;
    if (anchor === null) {
      setStartMonth(month);
      setEndMonth(month);
      setAnchor(month);
    } else {
      setStartMonth(Math.min(anchor, month));
      setEndMonth(Math.max(anchor, month));
      setAnchor(null);
    }
    setError("");
  }

  function applyPreset(preset: { startMonth: number; endMonth: number }) {
    setStartMonth(preset.startMonth);
    setEndMonth(preset.endMonth);
    setAnchor(null);
    setError("");
  }

  function acceptFile(candidate: File | null) {
    if (!candidate) return;
    if (!ACCEPTED.test(candidate.name)) {
      setError("Solo se aceptan archivos CSV o Excel (.csv, .xlsx, .xls).");
      return;
    }
    setError("");
    setFile(candidate);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rangeError) return setError(rangeError);
    if (overlapping) {
      return setError(`El periodo se solapa con la carga de ${formatUploadPeriod(overlapping)}.`);
    }
    if (!file) return setError("Selecciona el archivo del reporte antes de continuar.");

    setError("");
    setProgress(0);
    setProcessingProgress(0);
    setProcessedRows(0);
    setLiveProcessed(0);
    setLiveRejected(0);
    setPhase("uploading");

    try {
      const res = await onConfirm(
        file,
        { startMonth, endMonth, year },
        (percent) => {
          setProgress(percent);
          if (percent >= 100) setPhase("processing");
        },
        (status) => {
          setPhase("processing");
          setProcessingProgress(status.progress);
          setProcessedRows(status.processedRows);
          setLiveProcessed(status.songsProcessed);
          setLiveRejected(status.rejectedCount);
        },
      );
      setResult(res ?? null);
      setPhase("done");
    } catch (err) {
      const apiMessage = (err as { response?: { data?: { message?: string } } }).response?.data
        ?.message;
      const fallback = (err as Error)?.message;
      setError(apiMessage || fallback || "Error al subir el archivo. Revisa el formato.");
      setPhase("idle");
      setProgress(0);
    }
  }

  // ---- Fases de subida, procesado y resultado -----------------------------

  if (phase !== "idle") {
    const done = phase === "done";
    return (
      <ModalShell
        title={done ? "Reporte procesado" : phase === "uploading" ? "Subiendo reporte" : "Procesando reporte"}
        subtitle={`${periodLabel} · ${distributorName}`}
        width="lg"
        locked={busy}
        onClose={onClose}
        logo={<DistributorMark name={distributorName} logo={distributorLogo} size={36} />}
        footer={
          done ? (
            <>
              <span className="flex-1 text-[11px] text-[#A6AAB2]">
                Los datos del distribuidor ya están actualizados
              </span>
              <PrimaryButton
                onClick={onClose}
                icon={<ArrowRight className="h-[15px] w-[15px]" />}
              >
                Listo
              </PrimaryButton>
            </>
          ) : (
            <>
              <span className="flex-1 text-[11px] text-[#A6AAB2]">
                Puedes cerrar esta ventana: el proceso sigue en el servidor.
              </span>
              <SecondaryButton onClick={onClose}>Seguir en segundo plano</SecondaryButton>
            </>
          )
        }
      >
        <Steps phase={phase} />

        {phase === "uploading" && (
          <>
            <Phase title="Subiendo archivo" value={`${progress}%`} percent={progress} />
            <div className="flex items-center gap-2.5 rounded-[14px] bg-[#F4F5F7] px-3.5 py-3">
              <FileSpreadsheet className="h-[15px] w-[15px] flex-shrink-0 text-[#71757E]" />
              <span className="flex-1 truncate font-mono text-[11px] text-[#71757E]">
                {file?.name}
              </span>
              <span className="flex-shrink-0 font-mono text-[10.5px] text-[#A6AAB2]">
                {formatSize(file?.size ?? 0)}
              </span>
            </div>
          </>
        )}

        {phase === "processing" && (
          <>
            <Phase
              title="Procesando filas"
              value={processedRows > 0 ? `${processedRows.toLocaleString()} filas` : "Leyendo…"}
              percent={processingProgress}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <LiveMetric label="PROCESADAS" value={liveProcessed} color="#2FB37E" />
              <LiveMetric label="OMITIDAS" value={liveRejected} color="#E5484D" />
            </div>
            <p className="flex items-start gap-2.5 rounded-[14px] bg-[#FFEADD] px-3.5 py-3 text-[11px] leading-relaxed text-[#EA580C]">
              <CircleAlert className="mt-px h-3.5 w-3.5 flex-shrink-0 text-[#FF5C00]" />
              Puedes cerrar esta ventana: el reporte se sigue procesando en el servidor.
            </p>
          </>
        )}

        {done && <UploadResult result={result} periodLabel={periodLabel} />}
      </ModalShell>
    );
  }

  // ---- Formulario ---------------------------------------------------------

  const canSubmit = Boolean(file) && !rangeError && !overlapping;

  return (
    <form onSubmit={handleSubmit} className="contents">
      <ModalShell
        title="Subir reporte"
        subtitle={`${distributorName} · ${existingUploads.length} ${
          existingUploads.length === 1 ? "reporte cargado" : "reportes cargados"
        }`}
        width="lg"
        onClose={onClose}
        logo={<DistributorMark name={distributorName} logo={distributorLogo} />}
        footer={
          <>
            <span className="flex-1 text-[11px] text-[#A6AAB2]">
              Los ISRC ya registrados por otro usuario se omiten
            </span>
            <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
            <PrimaryButton
              type="submit"
              disabled={!canSubmit}
              icon={<Upload className="h-[15px] w-[15px]" />}
            >
              {overlapping ? "Periodo ya cargado" : `Subir ${formatMonthRange({ startMonth, endMonth })}`}
            </PrimaryButton>
          </>
        }
      >
        {/* Periodo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel required invalid={Boolean(overlapping)}>
              PERIODO DEL REPORTE
            </FieldLabel>
            <div className="flex items-center gap-0.5 rounded-2xl bg-[#F4F5F7] p-0.5">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setYear(y);
                    setAnchor(null);
                  }}
                  className={`rounded-[13px] px-2.5 py-1.5 font-mono text-[10.5px] font-semibold transition-colors ${
                    y === year ? "bg-[#FF5C00] text-white" : "text-[#71757E] hover:text-[#1C1D22]"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* La regleta es el control: se elige el mes inicial y luego el final. */}
          <div className="flex gap-1">
            {MONTH_SHORT_NAMES.map((short, index) => {
              const month = index + 1;
              const taken = takenMonths.has(month);
              const selected = month >= startMonth && month <= endMonth;
              const conflict = taken && selected;
              const isAnchor = anchor === month;

              return (
                <button
                  key={short}
                  type="button"
                  disabled={taken}
                  onClick={() => selectMonth(month)}
                  aria-pressed={selected}
                  title={
                    taken
                      ? `${MONTH_NAMES[index]}: ya cubierto por otra carga`
                      : `${MONTH_NAMES[index]} ${year}`
                  }
                  className={[
                    "flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[13px] transition-colors",
                    conflict
                      ? "border-[1.5px] border-[#E5484D] bg-[#FDECEC]"
                      : selected
                        ? "bg-[#FF5C00]"
                        : taken
                          ? "cursor-not-allowed border border-[#E8E8EC] bg-[#F4F5F7]"
                          : "border border-[#E8E8EC] bg-white hover:border-[#FF5C00]",
                    isAnchor && !conflict ? "ring-[3px] ring-[#FF5C00]/25" : "",
                  ].join(" ")}
                >
                  <span
                    className={`font-mono text-[10.5px] font-semibold ${
                      conflict
                        ? "text-[#E5484D]"
                        : selected
                          ? "text-white"
                          : taken
                            ? "text-[#A6AAB2]"
                            : "text-[#1C1D22]"
                    }`}
                  >
                    {short}
                  </span>
                  {conflict ? (
                    <CircleAlert className="h-3 w-3 text-[#E5484D]" />
                  ) : taken ? (
                    <Lock className="h-3 w-3 text-[#A6AAB2]" />
                  ) : (
                    <span
                      className={`h-[5px] w-[5px] rounded-full ${
                        selected ? "bg-white/40" : "bg-[#E8E8EC]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((preset) => {
              const active = startMonth === preset.startMonth && endMonth === preset.endMonth;
              const blocked = rangeIsTaken(preset, takenMonths);
              return (
                <button
                  key={preset.label}
                  type="button"
                  disabled={blocked}
                  onClick={() => applyPreset(preset)}
                  className={`rounded-[14px] border px-2.5 py-1.5 text-[11px] transition-colors ${
                    active
                      ? "border-[#FF5C00] bg-[#FFEADD] font-semibold text-[#FF5C00]"
                      : "border-[#E8E8EC] bg-white font-medium text-[#71757E] enabled:hover:border-[#D9DAE0]"
                  } disabled:cursor-not-allowed disabled:opacity-45`}
                  title={blocked ? "Todos sus meses ya están cargados" : undefined}
                >
                  {preset.label}
                </button>
              );
            })}
            <span className="ml-auto text-[10.5px] text-[#A6AAB2]">
              {anchor === null
                ? "Pulsa un mes y luego otro para marcar el rango"
                : `Desde ${MONTH_NAMES[anchor - 1]}… elige el mes final`}
            </span>
          </div>
        </div>

        {/* Archivo */}
        <div className="flex flex-col gap-2">
          <FieldLabel required>ARCHIVO DEL REPORTE</FieldLabel>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              acceptFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-4 transition-colors ${
              file
                ? "border-[1.5px] border-[#2FB37E] bg-[#E4F5EC]"
                : dragging
                  ? "border-[1.5px] border-dashed border-[#FF5C00] bg-[#FFEADD]"
                  : "border-[1.5px] border-dashed border-[#E8E8EC] bg-white hover:border-[#FF5C00] hover:bg-[#FFEADD]/40"
            }`}
          >
            <span
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[13px] ${
                file ? "bg-white" : "bg-[#F4F5F7]"
              }`}
            >
              {file ? (
                <FileSpreadsheet className="h-[19px] w-[19px] text-[#2FB37E]" />
              ) : (
                <Upload className="h-[19px] w-[19px] text-[#A6AAB2]" />
              )}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
              <span
                className={`truncate text-[12.5px] font-semibold ${
                  file ? "font-mono text-[#1C1D22]" : "text-[#71757E]"
                }`}
              >
                {file ? file.name : "Arrastra el archivo o pulsa para elegirlo"}
              </span>
              <span className={`text-[11px] ${file ? "text-[#2FB37E]" : "text-[#A6AAB2]"}`}>
                {file ? formatSize(file.size) : "CSV, XLSX o XLS"}
              </span>
            </span>
            {file && (
              <span className="flex-shrink-0 rounded-[14px] bg-white px-3 py-1.5 text-[11.5px] font-semibold text-[#71757E]">
                Cambiar
              </span>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </div>

        {/* Resumen o conflicto */}
        {overlapping ? (
          <div className="flex flex-col gap-3 rounded-[18px] bg-[#FDECEC] p-4">
            <span className="flex items-center gap-2.5">
              <CircleAlert className="h-[15px] w-[15px] flex-shrink-0 text-[#E5484D]" />
              <span className="text-[12.5px] font-semibold text-[#E5484D]">
                {conflictingMonths.map((m) => MONTH_SHORT_NAMES[m - 1]).join(", ")} ya{" "}
                {conflictingMonths.length === 1 ? "está cubierto" : "están cubiertos"}
              </span>
            </span>
            <span className="text-[11px] leading-relaxed text-[#E5484D]">
              El reporte «{formatUploadPeriod(overlapping)}» ya incluye esos meses. Cada mes solo
              puede pertenecer a una carga.
            </span>
            {suggestedRange && (
              <button
                type="button"
                onClick={() => applyPreset(suggestedRange)}
                className="self-start rounded-[13px] bg-[#E5484D] px-3.5 py-2 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#C93B40]"
              >
                Ajustar a {formatMonthRange(suggestedRange)}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-[18px] bg-[#FFEADD] p-4">
            <CalendarCheck className="h-[17px] w-[17px] flex-shrink-0 text-[#FF5C00]" />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[12.5px] font-semibold text-[#EA580C]">
                {periodLabel} · {months} {months === 1 ? "mes" : "meses"}
              </span>
              <span className="text-[11px] text-[#EA580C]">
                No se solapa con ninguna carga anterior de {distributorName}.
              </span>
            </span>
            <CircleCheck className="h-[17px] w-[17px] flex-shrink-0 text-[#FF5C00]" />
          </div>
        )}

        {error && (
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#E5484D]">
            <TriangleAlert className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </ModalShell>
    </form>
  );
}

/** Los tres pasos reales del proceso: subida, procesado en servidor y fin. */
function Steps({ phase }: { phase: UploadPhase }) {
  const active = phase === "uploading" ? 0 : phase === "processing" ? 1 : 2;
  const steps = [
    { label: "Subida", icon: <Upload className="h-3.5 w-3.5" /> },
    { label: "Procesado", icon: <Cpu className="h-3.5 w-3.5" /> },
    { label: "Listo", icon: <Check className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const done = index < active;
        const current = index === active;
        return (
          <div key={step.label} className="flex flex-1 items-center last:flex-none">
            {index > 0 && (
              <span
                className={`mx-1 h-0.5 flex-1 ${index <= active ? "bg-[#FF5C00]" : "bg-[#E8E8EC]"}`}
              />
            )}
            <span className="flex flex-shrink-0 items-center gap-2">
              <span
                className={`flex h-[26px] w-[26px] items-center justify-center rounded-full ${
                  done
                    ? "bg-[#FF5C00] text-white"
                    : current
                      ? "border-[1.5px] border-[#FF5C00] bg-[#FFEADD] text-[#FF5C00]"
                      : "bg-[#F4F5F7] text-[#A6AAB2]"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : step.icon}
              </span>
              <span
                className={`text-[11.5px] ${
                  done || current ? "font-semibold text-[#1C1D22]" : "text-[#A6AAB2]"
                }`}
              >
                {step.label}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Phase({ title, value, percent }: { title: string; value: string; percent: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-[#1C1D22]">{title}</span>
        <span className="font-mono text-[12px] font-semibold text-[#FF5C00]">{value}</span>
      </div>
      <span className="h-2 w-full overflow-hidden rounded-full bg-[#F4F5F7]">
        <span
          className="block h-full rounded-full bg-[#FF5C00] transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(2, percent))}%` }}
        />
      </span>
    </div>
  );
}

function LiveMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-[14px] bg-[#F4F5F7] px-3.5 py-3">
      <span className="font-mono text-[9.5px] font-medium tracking-[1.1px] text-[#A6AAB2]">
        {label}
      </span>
      <span className="font-mono text-[17px] font-semibold" style={{ color }}>
        {value.toLocaleString()}
      </span>
    </div>
  );
}

/**
 * Resultado de la carga. Antes salía como banner amarillo en la página de
 * detalle; aquí se resuelve donde ocurrió, con los rechazos agrupados por motivo
 * y exportables para poder reclamarlos.
 */
function UploadResult({
  result,
  periodLabel,
}: {
  result: UploadSongsResult | null;
  periodLabel: string;
}) {
  const groups = useMemo(() => groupRejections(result?.rejected ?? []), [result]);
  const rejected = result?.rejected ?? [];

  return (
    <>
      <div className="flex items-center gap-3 rounded-[18px] bg-[#E4F5EC] p-4">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2FB37E]">
          <Check className="h-5 w-5 text-white" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-[#1F7D58]">
            {(result?.songsProcessed ?? 0).toLocaleString()}{" "}
            {result?.songsProcessed === 1 ? "canción procesada" : "canciones procesadas"}
          </span>
          <span className="text-[11.5px] text-[#2FB37E]">{periodLabel}</span>
        </span>
      </div>

      {rejected.length > 0 && (
        <div className="flex flex-col gap-3 rounded-[18px] border border-[#E8E8EC] p-4">
          <div className="flex items-center gap-2.5">
            <CalendarOff className="h-3.5 w-3.5 flex-shrink-0 text-[#EA580C]" />
            <span className="flex-1 text-[12.5px] font-semibold text-[#1C1D22]">
              {rejected.length} {rejected.length === 1 ? "canción omitida" : "canciones omitidas"}
            </span>
            <button
              type="button"
              onClick={() => downloadRejections(rejected, periodLabel)}
              className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-[#F4F5F7] px-2.5 py-1.5 text-[10.5px] font-semibold text-[#71757E] transition-colors hover:bg-[#E8E8EC] hover:text-[#1C1D22]"
            >
              <Download className="h-3 w-3" />
              CSV
            </button>
          </div>

          {groups.map((group) => (
            <div key={group.reason} className="flex flex-col gap-2">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#EA580C]" />
                <span className="flex-1 text-[11.5px] text-[#71757E]">{group.reason}</span>
                <span className="font-mono text-[11.5px] font-semibold text-[#1C1D22]">
                  {group.items.length}
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-1.5">
                {group.items.slice(0, 6).map((song, index) => (
                  <span
                    key={`${song.isrc || song.trackTitle}-${index}`}
                    title={`${song.trackTitle} — ${song.artistName}`}
                    className="rounded-[11px] bg-[#FFEADD] px-2 py-1 font-mono text-[10px] text-[#EA580C]"
                  >
                    {song.isrc || song.trackTitle || "—"}
                  </span>
                ))}
                {group.items.length > 6 && (
                  <span className="text-[10.5px] text-[#A6AAB2]">
                    y {group.items.length - 6} más
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

interface RejectionGroup {
  reason: string;
  items: RejectedSong[];
}

/**
 * El servidor no envía el motivo del rechazo, pero sí distingue: una canción sin
 * ISRC no se pudo identificar, y una con ISRC se omitió porque ya pertenece a
 * otro usuario. Agruparlas así evita una lista plana de códigos sin explicación.
 */
function groupRejections(rejected: RejectedSong[]): RejectionGroup[] {
  const withIsrc = rejected.filter((song) => Boolean(song.isrc));
  const withoutIsrc = rejected.filter((song) => !song.isrc);

  return [
    { reason: "ISRC ya registrado por otro usuario", items: withIsrc },
    { reason: "Sin ISRC en el archivo", items: withoutIsrc },
  ].filter((group) => group.items.length > 0);
}

/** Descarga los rechazos para poder reclamarlos al distribuidor. */
function downloadRejections(rejected: RejectedSong[], periodLabel: string) {
  const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const rows = [
    ["ISRC", "UPC", "Titulo", "Artista"],
    ...rejected.map((song) => [song.isrc, song.upc, song.trackTitle, song.artistName]),
  ];
  const csv = rows.map((row) => row.map(escape).join(",")).join("\n");

  // El BOM hace que Excel abra el CSV como UTF-8 y no rompa los acentos.
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `omitidas-${periodLabel.replace(/[^\w]+/g, "-").toLowerCase()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function rangeIsTaken(
  range: { startMonth: number; endMonth: number },
  taken: Set<number>,
): boolean {
  for (let m = range.startMonth; m <= range.endMonth; m += 1) if (!taken.has(m)) return false;
  return true;
}

function formatSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
