import { useState } from 'react';
import { X, Plus, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Condition {
  type: 'specific' | 'general';
  percentage: number;
  description: string;
  fromDate?: string;
  toDate?: string;
  countriesType: 'all' | 'except' | 'only';
  selectedCountries: string[];
  platformsType: 'all' | 'except' | 'only';
  selectedPlatforms: string[];
}

interface CreateSplitsByLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  songCount: number;
}

export default function CreateSplitsByLabelModal({
  isOpen,
  onClose,
  label,
  songCount,
}: CreateSplitsByLabelModalProps) {
  const [conditions, setConditions] = useState<Condition[]>([
    {
      type: 'general',
      percentage: 100,
      description: 'Ingresos generales',
      countriesType: 'all',
      selectedCountries: [],
      platformsType: 'all',
      selectedPlatforms: [],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const addCondition = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split('T')[0];

    setConditions([
      ...conditions,
      {
        type: 'specific',
        percentage: 0,
        description: '',
        fromDate: today,
        toDate: nextMonthStr,
        countriesType: 'all',
        selectedCountries: [],
        platformsType: 'all',
        selectedPlatforms: [],
      },
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof Condition, value: any) => {
    const newConditions = [...conditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value,
    };
    setConditions(newConditions);
  };

  const getTotalPercentage = () => {
    return conditions.reduce((sum, condition) => sum + (condition.percentage || 0), 0);
  };

  const handleSubmit = async () => {
    setError('');
    setResult(null);

    // Validaciones
    if (conditions.length === 0) {
      setError('Debes agregar al menos una condición');
      return;
    }

    // Validar que haya exactamente 1 condición general
    const generalConditions = conditions.filter(c => c.type === 'general');
    if (generalConditions.length !== 1) {
      setError('Debe haber exactamente una condición general');
      return;
    }

    const totalPercentage = getTotalPercentage();
    if (totalPercentage > 100) {
      setError(`El total de porcentajes no puede exceder 100%. Actual: ${totalPercentage}%`);
      return;
    }

    if (totalPercentage <= 0) {
      setError('El total de porcentajes debe ser mayor a 0%');
      return;
    }

    for (const condition of conditions) {
      if (!condition.description.trim()) {
        setError('Todas las condiciones deben tener una descripción');
        return;
      }

      // Validar fechas para condiciones específicas
      if (condition.type === 'specific') {
        if (!condition.fromDate || !condition.toDate) {
          setError('Las condiciones específicas deben tener fechas de inicio y fin');
          return;
        }
        if (new Date(condition.fromDate) >= new Date(condition.toDate)) {
          setError('La fecha de inicio debe ser anterior a la fecha de fin');
          return;
        }
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_URL_API}/api/v1/labels/create-split-by-label`,
        {
          label,
          conditions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data.data);
    } catch (err: any) {
      console.error('Error creating splits:', err);
      setError(err.response?.data?.message || 'Error al crear los splits');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConditions([
      {
        type: 'general',
        percentage: 100,
        description: 'Ingresos generales',
        countriesType: 'all',
        selectedCountries: [],
        platformsType: 'all',
        selectedPlatforms: [],
      },
    ]);
    setResult(null);
    setError('');
    onClose();
  };

  const totalPercentage = getTotalPercentage();
  const isValidPercentage = totalPercentage > 0 && totalPercentage <= 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Crear Splits por Label
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Label: <span className="font-semibold">{label}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Se crearán splits para {songCount} canciones
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {!result ? (
                  <>
                    {/* Conditions List */}
                    <div className="space-y-4 mb-6">
                      {conditions.map((condition, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Condición {index + 1}
                            </h3>
                            {conditions.length > 1 && (
                              <button
                                onClick={() => removeCondition(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Type */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipo
                              </label>
                              <select
                                value={condition.type}
                                onChange={(e) =>
                                  updateCondition(index, 'type', e.target.value as 'specific' | 'general')
                                }
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              >
                                <option value="general">General</option>
                                <option value="specific">Específica</option>
                              </select>
                            </div>

                            {/* Percentage */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Porcentaje
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={condition.percentage}
                                onChange={(e) =>
                                  updateCondition(index, 'percentage', parseFloat(e.target.value) || 0)
                                }
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descripción
                              </label>
                              <input
                                type="text"
                                value={condition.description}
                                onChange={(e) => updateCondition(index, 'description', e.target.value)}
                                placeholder="Ej: Ingresos de Spotify en USA"
                                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>

                            {/* Date Range - Only for Specific Type */}
                            {condition.type === 'specific' && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha Inicio
                                  </label>
                                  <input
                                    type="date"
                                    value={condition.fromDate || ''}
                                    onChange={(e) => updateCondition(index, 'fromDate', e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha Fin
                                  </label>
                                  <input
                                    type="date"
                                    value={condition.toDate || ''}
                                    onChange={(e) => updateCondition(index, 'toDate', e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Condition Button */}
                    <button
                      onClick={addCondition}
                      className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Agregar Condición</span>
                    </button>

                    {/* Percentage Summary */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Total de Porcentajes
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            totalPercentage > 0 && totalPercentage <= 100
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {totalPercentage}%
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {totalPercentage > 100 && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            ⚠️ El total no puede exceder 100%
                          </p>
                        )}
                        {totalPercentage <= 0 && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            ⚠️ El total debe ser mayor a 0%
                          </p>
                        )}
                        {totalPercentage > 0 && totalPercentage < 100 && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            ℹ️ Los colaboradores podrán reclamar el {100 - totalPercentage}% restante
                          </p>
                        )}
                        {totalPercentage === 100 && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            ✓ Reclamarás el 100% de los ingresos (no se podrán agregar colaboradores)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}
                  </>
                ) : (
                  // Result View
                  <div className="space-y-6">
                    {/* Success Header */}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Splits Creados Exitosamente
                      </h3>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {result.summary.total}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {result.summary.created}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Creados</p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {result.summary.skipped}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Omitidos</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {result.summary.errors}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Errores</p>
                      </div>
                    </div>

                    {/* Successful Songs */}
                    {result.successful.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Canciones con splits creados ({result.successful.length})
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {result.successful.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3"
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.trackTitle}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {item.artistName} • ${item.calculation.totalOwed.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Failed Songs */}
                    {result.failed.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Canciones omitidas o con error ({result.failed.length})
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {result.failed.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.trackTitle}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{item.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                {!result ? (
                  <>
                    <button
                      onClick={handleClose}
                      disabled={loading}
                      className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !isValidPercentage}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Creando...</span>
                        </>
                      ) : (
                        <span>Crear Splits</span>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

