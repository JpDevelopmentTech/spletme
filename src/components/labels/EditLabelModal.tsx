import { useState, useEffect } from "react";
import {
  X,
  Layers,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  Edit3,
  Trash2,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LabelsService, { Label } from "../../services/labels";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Resetear estado cuando se abre/cierra el modal o cambian los datos
  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setSelectedLabels(currentArtisticLabels);
      setError("");
      setSuccess(false);
      setShowDeleteConfirm(false);
      setSearchQuery("");
    }
  }, [isOpen, currentName, currentArtisticLabels]);

  const filteredAvailableLabels = availableLabels.filter((label) =>
    (label.label || "Sin Label").toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("El nombre del label es requerido");
      return;
    }

    if (selectedLabels.length === 0) {
      setError("Debes seleccionar al menos un label artístico");
      return;
    }

    // Verificar si hay cambios
    const nameChanged = name.trim() !== currentName;
    const labelsChanged =
      JSON.stringify(selectedLabels.sort()) !== JSON.stringify(currentArtisticLabels.sort());

    if (!nameChanged && !labelsChanged) {
      setError("No hay cambios para guardar");
      return;
    }

    setLoading(true);
    setError("");

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
        setError(response.message || "Error al actualizar el label");
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating label:", err);
      setError("Error al actualizar el label");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const response = await LabelsService.deleteLabel(labelId);

      if (response.error) {
        setError(response.message || "Error al eliminar el label");
        setShowDeleteConfirm(false);
      } else {
        onDelete?.();
        onClose();
      }
    } catch (err) {
      console.error("Error deleting label:", err);
      setError("Error al eliminar el label");
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  // Calcular estadísticas de los labels seleccionados
  const selectedStats = availableLabels
    .filter((l) => selectedLabels.includes(l.label))
    .reduce(
      (acc, l) => ({
        songs: acc.songs + l.count,
        streams: acc.streams + l.totalStreams,
        income: acc.income + l.totalNetIncome,
      }),
      { songs: 0, streams: 0, income: 0 },
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:border-gray-700 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-lg">
                        <Edit3 className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md">
                        <Sparkles className="h-3 w-3 text-white" />
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
                    className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
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
                    className="py-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg">
                      <Trash2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      ¿Eliminar Label?
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                      Esta acción no se puede deshacer. El label "{currentName}" será eliminado
                      permanentemente.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                        className="rounded-lg px-6 py-2.5 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Eliminando...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-5 w-5" />
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
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Nombre del Label
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Mis Éxitos 2024"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Labels Selection */}
                    <div className="mb-6">
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Labels Artísticos Incluidos
                      </label>
                      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                        Selecciona los labels que deseas agrupar
                      </p>

                      {/* Buscador de labels */}
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar label artístico..."
                          className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Limpiar búsqueda"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="max-h-60 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                        {filteredAvailableLabels.length > 0 ? (
                          filteredAvailableLabels.map((label) => (
                            <motion.button
                              key={label.label}
                              type="button"
                              onClick={() => toggleLabel(label.label)}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`flex w-full items-center justify-between rounded-lg border p-3 transition-all ${
                                selectedLabels.includes(label.label)
                                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                  : "border-gray-200 hover:border-amber-300 dark:border-gray-600 dark:hover:border-amber-700"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                                    selectedLabels.includes(label.label)
                                      ? "border-amber-500 bg-amber-500"
                                      : "border-gray-300 dark:border-gray-600"
                                  }`}
                                >
                                  {selectedLabels.includes(label.label) && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {label.label || "Sin Label"}
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
                          <div className="py-6 text-center">
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
                        className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <Layers className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
                        className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                      >
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!success && !showDeleteConfirm && (
                <div className="flex items-center justify-between border-t border-gray-200 p-6 dark:border-gray-700">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar Label</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={onClose}
                      disabled={loading}
                      className="rounded-lg px-6 py-2.5 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !name.trim() || selectedLabels.length === 0}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-white shadow-md transition-colors hover:from-amber-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
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
