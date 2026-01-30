import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Tag, 
  Search, 
  Check, 
  Plus,
  Sparkles,
  Music2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import LabelsService from '../../services/labels';

interface Label {
  label: string;
  count: number;
  totalStreams: number;
  totalNetIncome: number;
}

interface CreateLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableLabels: Label[];
  onSuccess: () => void;
}

export default function CreateLabelModal({ 
  isOpen, 
  onClose, 
  availableLabels,
  onSuccess 
}: CreateLabelModalProps) {
  const [name, setName] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedLabels([]);
      setSearchTerm('');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Filter labels based on search
  const filteredLabels = availableLabels.filter(label => 
    label.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle label selection
  const toggleLabel = (labelName: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelName)
        ? prev.filter(l => l !== labelName)
        : [...prev, labelName]
    );
    setError(null);
  };

  // Select all visible labels
  const selectAll = () => {
    const visibleLabelNames = filteredLabels.map(l => l.label).filter(Boolean) as string[];
    setSelectedLabels(prev => {
      const allSelected = visibleLabelNames.every(l => prev.includes(l));
      if (allSelected) {
        return prev.filter(l => !visibleLabelNames.includes(l));
      }
      return [...new Set([...prev, ...visibleLabelNames])];
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('El nombre del label es requerido');
      return;
    }

    if (selectedLabels.length === 0) {
      setError('Debes seleccionar al menos un label artístico');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await LabelsService.createLabel({
        name: name.trim(),
        artisticLabels: selectedLabels,
      });

      if (response.error) {
        setError(response.message || 'Error al crear el label');
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals for selected labels
  const selectedStats = availableLabels
    .filter(l => selectedLabels.includes(l.label))
    .reduce(
      (acc, label) => ({
        songs: acc.songs + label.count,
        streams: acc.streams + label.totalStreams,
        income: acc.income + label.totalNetIncome,
      }),
      { songs: 0, streams: 0, income: 0 }
    );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Crear Nuevo Label</h2>
                  <p className="text-white/80 text-sm">Agrupa tus labels artísticos</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Success State */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Label creado exitosamente!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tu nuevo label ha sido guardado
              </p>
            </motion.div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Label
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(null);
                    }}
                    placeholder="Ej: Mis Sellos Principales"
                    className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Search Labels */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selecciona Labels Artísticos
                  </label>
                  <button
                    onClick={selectAll}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    {filteredLabels.every(l => selectedLabels.includes(l.label)) 
                      ? 'Deseleccionar todos' 
                      : 'Seleccionar todos'}
                  </button>
                </div>
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar labels..."
                    className="w-full px-4 py-2.5 pl-10 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Labels List */}
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {filteredLabels.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Music2 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No se encontraron labels</p>
                    </div>
                  ) : (
                    filteredLabels.map((label, index) => (
                      <motion.button
                        key={label.label || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => toggleLabel(label.label)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedLabels.includes(label.label)
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            selectedLabels.includes(label.label)
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                          }`}>
                            {selectedLabels.includes(label.label) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Tag className="w-4 h-4" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className={`font-medium text-sm ${
                              selectedLabels.includes(label.label)
                                ? 'text-indigo-700 dark:text-indigo-300'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {label.label || 'Sin nombre'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {label.count} canciones • {label.totalStreams?.toLocaleString() || 0} streams
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-green-600 dark:text-green-400">
                            ${label.totalNetIncome?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Stats */}
              {selectedLabels.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Resumen de selección ({selectedLabels.length} labels)
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {selectedStats.songs}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Canciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {selectedStats.streams >= 1000000 
                          ? `${(selectedStats.streams / 1000000).toFixed(1)}M`
                          : selectedStats.streams >= 1000
                          ? `${(selectedStats.streams / 1000).toFixed(1)}K`
                          : selectedStats.streams.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Streams</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${selectedStats.income.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ingresos</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !name.trim() || selectedLabels.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Crear Label
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </AnimatePresence>
  );
}

