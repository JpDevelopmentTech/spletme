/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
  Crown, X, Plus, Trash2, AlertCircle, CheckCircle, Save,
  Settings, Sparkles, ChevronDown, Percent, Globe, Music,
  Calendar, Tag,
} from 'lucide-react';
import Select from 'react-select';
import { countries, platforms } from '@/const';
import { createPortal } from 'react-dom';
import axios from 'axios';

interface CreateSplitsByLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  songCount: number;
}

type FilterType = 'all' | 'except' | 'only';

interface ConditionForm {
  percentage: string;
  fromDate?: string;
  toDate?: string;
  countriesType: FilterType;
  selectedCountries: { value: string; label: string }[];
  platformsType: FilterType;
  selectedPlatforms: { value: string; label: string }[];
  type: 'general' | 'specific';
}

const selectStyles = {
  control: (base: Record<string, unknown>) => ({
    ...base,
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '2px',
    boxShadow: 'none',
    backgroundColor: 'white',
    '&:hover': { border: '1px solid #F97316' },
    '&:focus-within': { border: '1px solid #F97316' },
  }),
  option: (
    base: Record<string, unknown>,
    { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }
  ) => ({
    ...base,
    backgroundColor: isSelected ? '#F97316' : isFocused ? '#fff7ed' : 'white',
    color: isSelected ? 'white' : '#374151',
    fontSize: '13px',
  }),
  multiValue: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: '#fff7ed',
    borderRadius: '6px',
  }),
  multiValueLabel: (base: Record<string, unknown>) => ({
    ...base,
    color: '#c2410c',
    fontWeight: '500',
    fontSize: '12px',
  }),
  multiValueRemove: (base: Record<string, unknown>) => ({
    ...base,
    color: '#c2410c',
    '&:hover': { backgroundColor: '#F97316', color: 'white' },
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    fontSize: '13px',
    color: '#9ca3af',
  }),
};

function FilterSegment({
  value,
  onChange,
  labels,
  name,
}: {
  value: FilterType;
  onChange: (v: FilterType) => void;
  labels: { all: string; except: string; only: string };
  name: string;
}) {
  const options: { val: FilterType; label: string }[] = [
    { val: 'all', label: labels.all },
    { val: 'except', label: labels.except },
    { val: 'only', label: labels.only },
  ];
  return (
    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.val}
          type="button"
          onClick={() => onChange(opt.val)}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === opt.val
              ? 'bg-white text-gray-900 border border-gray-200'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label={`${name} ${opt.label}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function CreateSplitsByLabelModal({
  isOpen,
  onClose,
  label,
  songCount,
}: CreateSplitsByLabelModalProps) {
  const [generalForm, setGeneralForm] = useState<ConditionForm>({
    percentage: '',
    countriesType: 'all',
    selectedCountries: [],
    platformsType: 'all',
    selectedPlatforms: [],
    type: 'general',
  });
  const [specificConditions, setSpecificConditions] = useState<ConditionForm[]>([]);
  const [isGeneralExpanded, setIsGeneralExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);
    setResult(null);
    setGeneralForm({
      percentage: '',
      countriesType: 'all',
      selectedCountries: [],
      platformsType: 'all',
      selectedPlatforms: [],
      type: 'general',
    });
    setSpecificConditions([]);
    setIsGeneralExpanded(true);
  }, [isOpen]);

  const updateGeneralForm = (
    field: keyof ConditionForm,
    value: string | readonly { value: string; label: string }[]
  ) => {
    setGeneralForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpecificCondition = (
    index: number,
    field: string,
    value: string | readonly { value: string; label: string }[]
  ) => {
    setSpecificConditions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const addSpecificCondition = () => {
    setSpecificConditions((prev) => [
      ...prev,
      {
        percentage: '',
        fromDate: '',
        toDate: '',
        countriesType: 'all',
        selectedCountries: [],
        platformsType: 'all',
        selectedPlatforms: [],
        type: 'specific',
      },
    ]);
  };

  const removeSpecificCondition = (index: number) => {
    setSpecificConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const conditions: any[] = [];

      if (generalForm.percentage && parseFloat(generalForm.percentage) > 0) {
        const pct = parseFloat(generalForm.percentage);
        if (pct <= 0 || pct > 100) {
          setErrorMessage('El porcentaje general debe estar entre 1 y 100.');
          return;
        }
        conditions.push({
          percentage: pct,
          selectedCountries: generalForm.selectedCountries.map((c) => c.value),
          countriesType: generalForm.countriesType,
          selectedPlatforms: generalForm.selectedPlatforms.map((p) => p.value),
          platformsType: generalForm.platformsType,
          type: 'general',
        });
      }

      for (let i = 0; i < specificConditions.length; i++) {
        const cond = specificConditions[i];
        const pct = parseFloat(cond.percentage);
        if (!pct || pct <= 0 || pct > 100) {
          setErrorMessage(`El porcentaje de la condición #${i + 1} debe estar entre 1 y 100.`);
          return;
        }
        conditions.push({
          fromDate: cond.fromDate,
          toDate: cond.toDate,
          percentage: pct,
          selectedCountries: cond.selectedCountries.map((c) => typeof c === 'string' ? c : c.value),
          countriesType: cond.countriesType || 'all',
          selectedPlatforms: cond.selectedPlatforms.map((p) => typeof p === 'string' ? p : p.value),
          platformsType: cond.platformsType || 'all',
          type: 'specific',
        });
      }

      if (conditions.length === 0) {
        setErrorMessage('Configura al menos una condición con un porcentaje válido.');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_URL_API}/api/v1/labels/create-split-by-label`,
        { label, conditions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear los splits';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setErrorMessage(null);
    onClose();
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#F97316] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base leading-tight">
                Owner Split — Label
              </h2>
              <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {label} · {songCount} {songCount === 1 ? 'canción' : 'canciones'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#F7F8FA] p-5 space-y-4">
          {result ? (
            /* ── Result view ── */
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Splits Creados</h3>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: 'Total', value: result.summary?.total ?? 0, color: 'blue' },
                  { label: 'Creados', value: result.summary?.created ?? 0, color: 'green' },
                  { label: 'Actualizados', value: result.summary?.updated ?? 0, color: 'purple' },
                  { label: 'Omitidos', value: result.summary?.skipped ?? 0, color: 'yellow' },
                  { label: 'Errores', value: result.summary?.errors ?? 0, color: 'red' },
                ].map((s) => (
                  <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-100 rounded-xl p-3 text-center`}>
                    <p className={`text-xl font-bold text-${s.color}-600`}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Successful */}
              {result.successful?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Procesadas ({result.successful.length})
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {result.successful.map((item: any, i: number) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded-lg border ${
                          item.status === 'updated'
                            ? 'bg-purple-50 border-purple-100'
                            : 'bg-green-50 border-green-100'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.trackTitle}</p>
                          <p className="text-xs text-gray-500">{item.artistName} · ${item.calculation?.totalOwed?.toFixed(2) ?? '0.00'}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          item.status === 'updated'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.status === 'updated' ? 'Actualizado' : 'Creado'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed */}
              {result.failed?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Con error ({result.failed.length})
                  </p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {result.failed.map((item: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-red-50 border border-red-100">
                        <p className="text-sm font-medium text-gray-900">{item.trackTitle}</p>
                        <p className="text-xs text-red-600">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Form view ── */
            <>
              {/* Info banner */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  La configuración se aplicará a las <strong>{songCount}</strong> canciones del label <strong>{label}</strong>.
                </p>
              </div>

              {/* General condition */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsGeneralExpanded((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Settings className="w-4 h-4 text-[#F97316]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Condición General</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Aplica cuando no hay condiciones específicas activas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {generalForm.percentage && (
                      <span className="px-2.5 py-1 bg-orange-50 text-[#F97316] text-xs font-semibold rounded-full">
                        {generalForm.percentage}%
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isGeneralExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isGeneralExpanded && (
                  <div className="px-5 py-5 space-y-5">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        <Percent className="w-3.5 h-3.5" /> Porcentaje
                      </label>
                      <div className="relative max-w-xs">
                        <input
                          type="number" min="0" max="100" step="0.01" placeholder="0.00"
                          value={generalForm.percentage}
                          onChange={(e) => updateGeneralForm('percentage', e.target.value)}
                          className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#F97316] transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        <Globe className="w-3.5 h-3.5" /> Países
                      </label>
                      <FilterSegment
                        value={generalForm.countriesType}
                        onChange={(v) => updateGeneralForm('countriesType', v)}
                        labels={{ all: 'Todos', except: 'Excepto', only: 'Solo' }}
                        name="países"
                      />
                      {generalForm.countriesType !== 'all' && (
                        <Select isMulti options={countries} value={generalForm.selectedCountries}
                          onChange={(s) => updateGeneralForm('selectedCountries', s || [])}
                          styles={selectStyles} placeholder="Seleccionar países..."
                          noOptionsMessage={() => 'No hay países disponibles'}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        <Music className="w-3.5 h-3.5" /> Plataformas
                      </label>
                      <FilterSegment
                        value={generalForm.platformsType}
                        onChange={(v) => updateGeneralForm('platformsType', v)}
                        labels={{ all: 'Todas', except: 'Excepto', only: 'Solo' }}
                        name="plataformas"
                      />
                      {generalForm.platformsType !== 'all' && (
                        <Select isMulti options={platforms} value={generalForm.selectedPlatforms}
                          onChange={(s) => updateGeneralForm('selectedPlatforms', s || [])}
                          styles={selectStyles} placeholder="Seleccionar plataformas..."
                          noOptionsMessage={() => 'No hay plataformas disponibles'}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Specific conditions */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#F97316]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Condiciones Específicas</p>
                      <p className="text-xs text-gray-500 mt-0.5">Aplican por período, país o plataforma</p>
                    </div>
                  </div>
                  <button type="button" onClick={addSpecificCondition}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir
                  </button>
                </div>

                {specificConditions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Sin condiciones específicas</p>
                    <p className="text-xs text-gray-400 max-w-xs">
                      Agrega condiciones para definir porcentajes distintos según período, país o plataforma.
                    </p>
                  </div>
                ) : (
                  <div className="p-5 space-y-4">
                    {specificConditions.map((cond, idx) => (
                      <div key={idx} className="bg-[#F7F8FA] rounded-xl border border-gray-200 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-[#F97316]">{idx + 1}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">Condición específica</span>
                          </div>
                          <button type="button" onClick={() => removeSpecificCondition(idx)}
                            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Desde</label>
                            <input type="date" value={cond.fromDate || ''}
                              onChange={(e) => updateSpecificCondition(idx, 'fromDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hasta</label>
                            <input type="date" value={cond.toDate || ''}
                              onChange={(e) => updateSpecificCondition(idx, 'toDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Porcentaje</label>
                            <div className="relative">
                              <input type="number" min="0" max="100" step="0.01"
                                value={cond.percentage}
                                onChange={(e) => updateSpecificCondition(idx, 'percentage', e.target.value)}
                                className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#F97316] transition-colors bg-white"
                              />
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              <Globe className="w-3 h-3" /> Países
                            </label>
                            <FilterSegment
                              value={cond.countriesType}
                              onChange={(v) => updateSpecificCondition(idx, 'countriesType', v)}
                              labels={{ all: 'Todos', except: 'Excepto', only: 'Solo' }}
                              name={`países-${idx}`}
                            />
                            {cond.countriesType !== 'all' && (
                              <Select isMulti options={countries} value={cond.selectedCountries}
                                onChange={(s) => updateSpecificCondition(idx, 'selectedCountries', s || [])}
                                styles={selectStyles} placeholder="Seleccionar..."
                              />
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              <Music className="w-3 h-3" /> Plataformas
                            </label>
                            <FilterSegment
                              value={cond.platformsType}
                              onChange={(v) => updateSpecificCondition(idx, 'platformsType', v)}
                              labels={{ all: 'Todas', except: 'Excepto', only: 'Solo' }}
                              name={`plataformas-${idx}`}
                            />
                            {cond.platformsType !== 'all' && (
                              <Select isMulti options={platforms} value={cond.selectedPlatforms}
                                onChange={(s) => updateSpecificCondition(idx, 'selectedPlatforms', s || [])}
                                styles={selectStyles} placeholder="Seleccionar..."
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          {errorMessage && (
            <div className="flex items-start gap-2 mb-3 p-3 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{errorMessage}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {result ? 'Cerrar' : 'Cancelar'}
            </button>
            {!result && (
              <button type="button" onClick={handleSubmit} disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2 bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading ? 'Creando...' : 'Crear Splits'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
