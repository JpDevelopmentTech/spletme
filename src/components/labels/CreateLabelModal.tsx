import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Tag,
  Search,
  Check,
  Plus,
  Sparkles,
  Music2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import LabelsService from "../../services/labels";

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
  onSuccess,
}: CreateLabelModalProps) {
  const [name, setName] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName("");
      setSelectedLabels([]);
      setSearchTerm("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Filter labels based on search
  const filteredLabels = availableLabels.filter((label) =>
    label.label?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Toggle label selection
  const toggleLabel = (labelName: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelName)
        ? prev.filter((l) => l !== labelName)
        : [...prev, labelName],
    );
    setError(null);
  };

  // Select all visible labels
  const selectAll = () => {
    const visibleLabelNames = filteredLabels
      .map((l) => l.label)
      .filter(Boolean) as string[];
    setSelectedLabels((prev) => {
      const allSelected = visibleLabelNames.every((l) => prev.includes(l));
      if (allSelected) {
        return prev.filter((l) => !visibleLabelNames.includes(l));
      }
      return [...new Set([...prev, ...visibleLabelNames])];
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("El nombre del label es requerido");
      return;
    }

    if (selectedLabels.length === 0) {
      setError("Debes seleccionar al menos un label artístico");
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
        setError(response.message || "Error al crear el label");
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals for selected labels
  const selectedStats = availableLabels
    .filter((l) => selectedLabels.includes(l.label))
    .reduce(
      (acc, label) => ({
        songs: acc.songs + label.count,
        streams: acc.streams + label.totalStreams,
        income: acc.income + label.totalNetIncome,
      }),
      { songs: 0, streams: 0, income: 0 },
    );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Tag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Crear Nuevo Label
                  </h2>
                  <p className="text-sm text-white/80">
                    Agrupa tus labels artísticos
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <X className="h-5 w-5" />
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
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                ¡Label creado exitosamente!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tu nuevo label ha sido guardado
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6 p-6">
              {/* Name Input */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-12 text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                  />
                  <Sparkles className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Search Labels */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selecciona Labels Artísticos
                  </label>
                  <button
                    onClick={selectAll}
                    className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {filteredLabels.every((l) =>
                      selectedLabels.includes(l.label),
                    )
                      ? "Deseleccionar todos"
                      : "Seleccionar todos"}
                  </button>
                </div>
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar labels..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Labels List */}
                <div className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto pr-2">
                  {filteredLabels.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      <Music2 className="mx-auto mb-2 h-10 w-10 opacity-50" />
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
                        className={`flex w-full items-center justify-between rounded-xl border-2 p-3 transition-all duration-200 ${
                          selectedLabels.includes(label.label)
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700/30 dark:hover:border-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              selectedLabels.includes(label.label)
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {selectedLabels.includes(label.label) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Tag className="h-4 w-4" />
                            )}
                          </div>
                          <div className="text-left">
                            <p
                              className={`text-sm font-medium ${
                                selectedLabels.includes(label.label)
                                  ? "text-indigo-700 dark:text-indigo-300"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {label.label || "Sin nombre"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {label.count} canciones •{" "}
                              {label.totalStreams?.toLocaleString() || 0}{" "}
                              streams
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-green-600 dark:text-green-400">
                            ${label.totalNetIncome?.toFixed(2) || "0.00"}
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
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 dark:from-indigo-900/20 dark:to-purple-900/20"
                >
                  <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Resumen de selección ({selectedLabels.length} labels)
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {selectedStats.songs}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Canciones
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {selectedStats.streams >= 1000000
                          ? `${(selectedStats.streams / 1000000).toFixed(1)}M`
                          : selectedStats.streams >= 1000
                            ? `${(selectedStats.streams / 1000).toFixed(1)}K`
                            : selectedStats.streams.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Streams
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${selectedStats.income.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ingresos
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || !name.trim() || selectedLabels.length === 0
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
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
