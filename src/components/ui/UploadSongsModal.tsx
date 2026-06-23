import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Music2 } from 'lucide-react';
import type { Quarter } from '../../types/distributor.types';
import type { UploadSongsResult } from '../../services/distributorsService';

type UploadPhase = 'idle' | 'uploading' | 'processing' | 'done';

interface Props {
  distributorName: string;
  existingUploads?: Array<{ quarter: Quarter; year: number }>;
  onClose: () => void;
  onConfirm: (
    file: File,
    quarter: Quarter,
    year: number,
    onProgress: (percent: number) => void,
  ) => Promise<UploadSongsResult | void>;
}

const QUARTERS: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const QUARTER_LABELS: Record<Quarter, string> = {
  Q1: 'Q1 — Ene / Feb / Mar',
  Q2: 'Q2 — Abr / May / Jun',
  Q3: 'Q3 — Jul / Ago / Sep',
  Q4: 'Q4 — Oct / Nov / Dic',
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export default function UploadSongsModal({
  distributorName,
  existingUploads = [],
  onClose,
  onConfirm,
}: Props) {
  const [quarter, setQuarter] = useState<Quarter>('Q1');
  const [year, setYear] = useState(CURRENT_YEAR);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadSongsResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loading = phase === 'uploading' || phase === 'processing';

  const isDuplicate = existingUploads.some((u) => u.quarter === quarter && u.year === year);
  const usedQuartersForYear = existingUploads
    .filter((u) => u.year === year)
    .map((u) => u.quarter);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && !f.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Solo se aceptan archivos CSV o Excel (.csv, .xlsx, .xls)');
      return;
    }
    setError('');
    setFile(f);
  }

  function handleBackdropClose() {
    if (loading) return;
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError('Selecciona un archivo antes de continuar'); return; }
    if (isDuplicate) {
      setError(`Ya existe una carga ${quarter} ${year} para este distribuidor`);
      return;
    }
    setError('');
    setProgress(0);
    setPhase('uploading');
    try {
      const res = await onConfirm(file, quarter, year, (percent) => {
        setProgress(percent);
        // Cuando el archivo termina de subir, empieza el guardado en backend
        if (percent >= 100) setPhase('processing');
      });
      setResult(res ?? null);
      setPhase('done');
    } catch (err) {
      const apiMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(apiMessage || 'Error al subir el archivo. Verifica el formato e intenta de nuevo.');
      setPhase('idle');
      setProgress(0);
    }
  }

  if (phase !== 'idle') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleBackdropClose} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
          <UploadProgressView
            phase={phase}
            progress={progress}
            result={result}
            fileName={file?.name ?? ''}
            quarter={quarter}
            year={year}
            onClose={onClose}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleBackdropClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Subir canciones</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Distribuidor: <span className="font-semibold text-[#F97316]">{distributorName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Quarter selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
              Temporada (Quarter) *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUARTERS.map((q) => {
                const isUsed = usedQuartersForYear.includes(q);
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => !isUsed && setQuarter(q)}
                    disabled={isUsed}
                    title={isUsed ? `Ya existe una carga ${q} ${year}` : undefined}
                    className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-xs font-medium transition-colors text-left ${
                      isUsed
                        ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                        : quarter === q
                        ? 'border-[#F97316] bg-orange-50 text-[#F97316]'
                        : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-bold w-7">{q}</span>
                    <span className="text-[11px]">{QUARTER_LABELS[q].split('—')[1]?.trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Year selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
              Año *
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 px-3 border border-gray-200 rounded-lg text-sm text-[#111827] focus:outline-none focus:border-[#F97316] bg-white"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* File upload area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
              Archivo CSV / Excel *
            </label>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl py-6 transition-colors ${
                file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-[#F97316] hover:bg-orange-50'
              }`}
            >
              {file ? (
                <>
                  <FileText className="w-6 h-6 text-green-500" />
                  <span className="text-sm font-semibold text-green-600">{file.name}</span>
                  <span className="text-xs text-green-500">
                    {(file.size / 1024).toFixed(1)} KB — click para cambiar
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#9CA3AF]" />
                  <span className="text-sm font-medium text-[#6B7280]">
                    Click para seleccionar archivo
                  </span>
                  <span className="text-xs text-[#9CA3AF]">CSV, XLSX o XLS</span>
                </>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Period summary */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#FAFAFA] rounded-lg border border-gray-100">
            <AlertCircle className="w-3.5 h-3.5 text-[#F97316] flex-shrink-0" />
            <span className="text-xs text-[#6B7280]">
              Esta carga se asociará a{' '}
              <span className="font-semibold text-[#111827]">{quarter} {year}</span>
              {' '}para <span className="font-semibold text-[#111827]">{distributorName}</span>
            </span>
          </div>

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !file || isDuplicate}
              className="flex-1 h-10 bg-[#F97316] rounded-lg text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Subiendo...' : isDuplicate ? `${quarter} ${year} ya cargado` : `Subir ${quarter} ${year}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ProgressProps {
  phase: UploadPhase;
  progress: number;
  result: UploadSongsResult | null;
  fileName: string;
  quarter: Quarter;
  year: number;
  onClose: () => void;
}

function UploadProgressView({ phase, progress, result, fileName, quarter, year, onClose }: ProgressProps) {
  const isUploading = phase === 'uploading';
  const isProcessing = phase === 'processing';
  const isDone = phase === 'done';

  const title = isDone
    ? '¡Canciones guardadas!'
    : isProcessing
    ? 'Guardando canciones...'
    : 'Subiendo archivo...';

  const subtitle = isDone
    ? `Carga ${quarter} ${year} completada`
    : isProcessing
    ? 'Estamos procesando y guardando tus canciones'
    : 'Enviando el archivo al servidor';

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Animación / icono */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {isDone ? (
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-50">
            <CheckCircle2 className="w-11 h-11 text-green-500" />
          </div>
        ) : (
          <>
            <span className="absolute inline-flex w-full h-full rounded-full bg-orange-100 opacity-60 animate-ping" />
            <div className="relative flex items-end justify-center gap-1 w-20 h-20 rounded-full bg-orange-50">
              {/* Ecualizador animado: sensación de "guardando música" */}
              <div className="flex items-end gap-1 h-9">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-[#F97316]"
                    style={{
                      animation: 'usm-eq 0.9s ease-in-out infinite',
                      animationDelay: `${i * 0.12}s`,
                    }}
                  />
                ))}
              </div>
              <Music2 className="absolute -bottom-1 -right-1 w-5 h-5 text-orange-400 bg-white rounded-full p-0.5 shadow-sm" />
            </div>
          </>
        )}
      </div>

      {/* Texto */}
      <div className="text-center px-2">
        <h3 className="text-base font-bold text-[#111827]">{title}</h3>
        <p className="text-xs text-[#6B7280] mt-1">{subtitle}</p>
        {fileName && (
          <p className="text-[11px] text-[#9CA3AF] mt-1 flex items-center justify-center gap-1">
            <FileText className="w-3 h-3" /> {fileName}
          </p>
        )}
      </div>

      {/* Barra de progreso */}
      {!isDone && (
        <div className="w-full">
          <div className="relative h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
            {isUploading ? (
              <div
                className="h-full rounded-full bg-[#F97316] transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            ) : (
              // Fase de guardado: barra indeterminada animada
              <div
                className="absolute top-0 h-full w-2/5 rounded-full bg-gradient-to-r from-orange-300 via-[#F97316] to-orange-300"
                style={{ animation: 'usm-indeterminate 1.1s ease-in-out infinite' }}
              />
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] font-medium text-[#9CA3AF]">
              {isUploading ? 'Subiendo archivo' : 'Procesando registros'}
            </span>
            <span className="text-[11px] font-bold text-[#F97316]">
              {isUploading ? `${progress}%` : 'En curso...'}
            </span>
          </div>
        </div>
      )}

      {/* Resumen al finalizar */}
      {isDone && (
        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl bg-green-50 border border-green-100">
              <span className="text-2xl font-bold text-green-600">
                {result?.songsProcessed ?? 0}
              </span>
              <span className="text-[11px] font-medium text-green-700">
                Canciones guardadas
              </span>
            </div>
            {(result?.rejectedCount ?? 0) > 0 && (
              <div className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-2xl font-bold text-amber-600">
                  {result?.rejectedCount}
                </span>
                <span className="text-[11px] font-medium text-amber-700">
                  Rechazadas
                </span>
              </div>
            )}
          </div>

          {result?.rejected && result.rejected.length > 0 && (
            <div className="flex flex-col gap-2 rounded-xl bg-amber-50 border border-amber-100 p-3">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Estas canciones ya tienen propietario y no se subieron
              </p>
              <ul className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                {result.rejected.map((song) => (
                  <li
                    key={song.isrc}
                    className="flex flex-col rounded-lg bg-white border border-amber-100 px-2.5 py-1.5"
                  >
                    <span className="text-xs font-medium text-[#111827] truncate">
                      {song.trackTitle || song.isrc}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] truncate">
                      {[song.artistName, song.isrc].filter(Boolean).join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="h-10 bg-[#F97316] rounded-lg text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Finalizar
          </button>
        </div>
      )}

      {/* Keyframes locales del componente */}
      <style>{`
        @keyframes usm-eq {
          0%, 100% { height: 28%; }
          50% { height: 100%; }
        }
        @keyframes usm-indeterminate {
          0% { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
