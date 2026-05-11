import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import type { Quarter } from '../../types/distributor.types';

interface Props {
  distributorName: string;
  onClose: () => void;
  onConfirm: (file: File, quarter: Quarter, year: number) => Promise<void>;
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

export default function UploadSongsModal({ distributorName, onClose, onConfirm }: Props) {
  const [quarter, setQuarter] = useState<Quarter>('Q1');
  const [year, setYear] = useState(CURRENT_YEAR);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && !f.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Solo se aceptan archivos CSV o Excel (.csv, .xlsx, .xls)');
      return;
    }
    setError('');
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError('Selecciona un archivo antes de continuar'); return; }
    setLoading(true);
    setError('');
    try {
      await onConfirm(file, quarter, year);
      onClose();
    } catch {
      setError('Error al subir el archivo. Verifica el formato e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
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
              {QUARTERS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuarter(q)}
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-xs font-medium transition-colors text-left ${
                    quarter === q
                      ? 'border-[#F97316] bg-orange-50 text-[#F97316]'
                      : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-bold w-7">{q}</span>
                  <span className="text-[11px]">{QUARTER_LABELS[q].split('—')[1]?.trim()}</span>
                </button>
              ))}
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
              disabled={loading || !file}
              className="flex-1 h-10 bg-[#F97316] rounded-lg text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Subiendo...' : `Subir ${quarter} ${year}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
