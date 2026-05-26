import { useState, useEffect } from 'react';
import { X, Layers, Sparkles, Check, AlertCircle, Loader2, Edit3, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LabelsService, { Label } from '../../services/labels';

interface EditLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelId: string;
  currentName: string;
  currentArtisticLabels: string[];
  availableLabels: Label[];
  onSuccess: () => void;
  onDelete?: () => void;
}

export default function EditLabelModal({
  isOpen,
  onClose,
  labelId,
  currentName,
  currentArtisticLabels,
  availableLabels,
  onSuccess,
  onDelete,
}: EditLabelModalProps) {
  const [name, setName] = useState(currentName);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(currentArtisticLabels);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Resetear estado cuando se abre/cierra el modal o cambian los datos
  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setSelectedLabels(currentArtisticLabels);
      setError('');
      setSuccess(false);
      setShowDeleteConfirm(false);
      setSearchQuery('');
    }
  }, [isOpen, currentName, currentArtisticLabels]);

  const filteredAvailableLabels = availableLabels.filter((label) =>
    (label.label || 'Sin Label')
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('El nombre del label es requerido');
      return;
    }

    if (selectedLabels.length === 0) {
      setError('Debes seleccionar al menos un label artístico');
      return;
    }

    // Verificar si hay cambios
    const nameChanged = name.trim() !== currentName;
    const labelsChanged = JSON.stringify(selectedLabels.sort()) !== JSON.stringify(currentArtisticLabels.sort());

    if (!nameChanged && !labelsChanged) {
      setError('No hay cambios para guardar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updateData: { name?: string; artisticLabels?: string[] } = {};
      
      if (nameChanged) {
        updateData.name = name.trim();
      }
      
      if (labelsChanged) {
        updateData.artisticLabels = selectedLabels;
      }

      const response = await LabelsService.updateLabel(labelId, updateData);

      if (response.error) {
        setError(response.message || 'Error al actualizar el label');
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating label:', err);
      setError('Error al actualizar el label');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await LabelsService.deleteLabel(labelId);

      if (response.error) {
        setError(response.message || 'Error al eliminar el label');
        setShowDeleteConfirm(false);
      } else {
        onDelete?.();
        onClose();
      }
    } catch (err) {
      console.error('Error deleting label:', err);
      setError('Error al eliminar el label');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  // Calcular estadísticas de los labels seleccionados
  const selectedStats = availableLabels
    .filter(l => selectedLabels.includes(l.label))
    .reduce(
      (acc, l) => ({
        songs: acc.songs + l.count,
        streams: acc.streams + l.totalStreams,
        income: acc.income + l.totalNetIncome,
      }),
      { songs: 0, streams: 0, income: 0 }
    );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Edit3 className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Editar Label Personalizado
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Modifica el nombre o los labels agrupados
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      ¡Label Actualizado!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Los cambios se han guardado correctamente
                    </p>
                  </motion.div>
                ) : showDeleteConfirm ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Trash2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      ¿Eliminar Label?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Esta acción no se puede deshacer. El label "{currentName}" será eliminado permanentemente.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                        className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Eliminando...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-5 h-5" />
                            <span>Eliminar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Name Input */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nombre del Label
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Mis Éxitos 2024"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>

                    {/* Labels Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Labels Artísticos Incluidos
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Selecciona los labels que deseas agrupar
                      </p>

                      {/* Buscador de labels */}
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar label artístico..."
                          className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Limpiar búsqueda"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-2">
                        {filteredAvailableLabels.length > 0 ? (
                          filteredAvailableLabels.map((label) => (
                            <motion.button
                              key={label.label}
                              type="button"
                              onClick={() => toggleLabel(label.label)}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                                selectedLabels.includes(label.label)
                                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  selectedLabels.includes(label.label)
                                    ? 'border-amber-500 bg-amber-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                  {selectedLabels.includes(label.label) && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {label.label || 'Sin Label'}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {label.count} canciones
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                  ${label.totalNetIncome.toFixed(2)}
                                </p>
                              </div>
                            </motion.button>
                          ))
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No se encontraron labels para "{searchQuery}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats Preview */}
                    {selectedLabels.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          <span className="font-semibold text-amber-700 dark:text-amber-300">
                            Vista Previa
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {selectedStats.songs}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Canciones</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {selectedStats.streams.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Streams</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${selectedStats.income.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Ingresos</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!success && !showDeleteConfirm && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Label</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onClose}
                      disabled={loading}
                      className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !name.trim() || selectedLabels.length === 0}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Guardar Cambios</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

