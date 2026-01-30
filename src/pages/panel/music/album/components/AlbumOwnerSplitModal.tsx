import { AnimatePresence, motion } from "framer-motion";
import {
  Music,
  Trash2,
  Crown,
  X,
  Plus,
  Globe,
  Calendar,
  Percent,
  Settings,
  ChevronDown,
  Save,
  Sparkles,
  Disc,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Select from "react-select";
import { countries, platforms } from "@/const";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CreateSplitOwnerRequest,
  splitsService,
  type SplitCondition,
} from "@/services/splits";
import LocalStorageService from "@/services/localstorage";
import type { Album } from "@/models/album";

interface AlbumOwnerSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: Album;
  onSplitsCreated?: () => void;
}

interface OwnerFormData {
  percentage: string;
  countriesType: "all" | "except" | "only";
  selectedCountries: { value: string; label: string }[];
  platformsType: "all" | "except" | "only";
  selectedPlatforms: { value: string; label: string }[];
  splitConditions: SplitCondition[];
  type: "general" | "specific";
}

interface CreationProgress {
  total: number;
  completed: number;
  failed: number;
  current: string;
  errors: Array<{ songTitle: string; error: string }>;
}

export default function AlbumOwnerSplitModal({
  isOpen,
  onClose,
  album,
  onSplitsCreated,
}: AlbumOwnerSplitModalProps) {
  const [ownerForm, setOwnerForm] = useState<OwnerFormData>({
    percentage: "",
    countriesType: "all",
    selectedCountries: [],
    platformsType: "all",
    selectedPlatforms: [],
    splitConditions: [],
    type: "general",
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<CreationProgress | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number | null>(null);

  const currentUser = LocalStorageService.getItem("user");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setProgress(null);
      setShowResults(false);
      setAutoCloseCountdown(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (autoCloseCountdown !== null && autoCloseCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoCloseCountdown(autoCloseCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoCloseCountdown === 0) {
      if (onSplitsCreated) {
        onSplitsCreated();
      }
      closeWithReset();
    }
  }, [autoCloseCountdown]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const updateOwnerForm = (
    field: keyof OwnerFormData,
    value: string | readonly { value: string; label: string }[]
  ) => {
    setOwnerForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSplitCondition = (
    conditionIndex: number,
    field: string,
    value:
      | string
      | readonly { value: string; label: string }[]
      | readonly string[]
  ) => {
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: (prev.splitConditions || []).map(
        (condition, index) =>
          index === conditionIndex
            ? { ...condition, [field]: value }
            : condition
      ),
    }));
  };

  const addSplitCondition = () => {
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: [
        ...prev.splitConditions,
        {
          percentage: 0,
          selectedCountries: [],
          countriesType: "all",
          selectedPlatforms: [],
          platformsType: "all",
          type: "specific",
        },
      ],
    }));
  };

  const removeSplitCondition = (conditionIndex: number) => {
    setOwnerForm((prev) => ({
      ...prev,
      splitConditions: prev.splitConditions.filter(
        (_, index) => index !== conditionIndex
      ),
    }));
  };

  const createBulkOwnerSplits = async () => {
    try {
      setIsLoading(true);
      setShowResults(false);

      // Validar datos básicos
      if (!album || !album.tracks || album.tracks.length === 0) {
        alert('Error: No hay canciones en este álbum');
        return;
      }

      if (!currentUser?.id) {
        alert('Error: No se pudo obtener la información del usuario. Por favor, inicia sesión de nuevo.');
        return;
      }

      // Crear las condiciones desde el formulario
      const conditions: SplitCondition[] = [];

      // Agregar condición general si hay porcentaje
      if (ownerForm.percentage && parseFloat(ownerForm.percentage) > 0) {
        const generalCondition = {
          percentage: parseFloat(ownerForm.percentage),
          selectedCountries: ownerForm.selectedCountries.map(c => c.value),
          countriesType: ownerForm.countriesType,
          selectedPlatforms: ownerForm.selectedPlatforms.map(p => p.value),
          platformsType: ownerForm.platformsType,
          type: "general" as const,
        };

        if (generalCondition.percentage <= 0 || generalCondition.percentage > 100) {
          alert('El porcentaje debe estar entre 0 y 100');
          return;
        }

        conditions.push(generalCondition);
      }

      // Agregar condiciones específicas
      ownerForm.splitConditions.forEach((condition, index) => {
        const percentage = typeof condition.percentage === 'string' ? parseFloat(condition.percentage) : condition.percentage;

        if (percentage <= 0 || percentage > 100) {
          alert(`El porcentaje de la condición específica #${index + 1} debe estar entre 0 y 100`);
          return;
        }

        const specificCondition = {
          fromDate: condition.fromDate,
          toDate: condition.toDate,
          percentage: percentage,
          selectedCountries: Array.isArray(condition.selectedCountries)
            ? condition.selectedCountries.map(c => typeof c === 'string' ? c : (c as { value: string; label: string }).value)
            : [],
          countriesType: condition.countriesType || "all" as const,
          selectedPlatforms: Array.isArray(condition.selectedPlatforms)
            ? condition.selectedPlatforms.map(p => typeof p === 'string' ? p : (p as { value: string; label: string }).value)
            : [],
          platformsType: condition.platformsType || "all" as const,
          type: "specific" as const,
        };

        conditions.push(specificCondition);
      });

      // Verificar que hay al menos una condición válida
      if (conditions.length === 0) {
        alert('Por favor, configura al menos una condición (porcentaje general o condición específica)');
        return;
      }

      // Inicializar el progreso
      setProgress({
        total: album.tracks.length,
        completed: 0,
        failed: 0,
        current: '',
        errors: [],
      });

      console.log('=== CREATING BULK OWNER SPLITS FOR ALBUM ===');
      console.log('Album:', album.albumTitle);
      console.log('Total tracks:', album.tracks.length);
      console.log('Conditions:', conditions);

      // Crear splits para cada canción del álbum
      for (let i = 0; i < album.tracks.length; i++) {
        const track = album.tracks[i];

        setProgress(prev => prev ? {
          ...prev,
          current: track.trackTitle,
        } : null);

        try {
          const ownerSplitData: CreateSplitOwnerRequest = {
            songId: track._id,
            conditions: conditions,
          };

          await splitsService.createOwnerSplit(ownerSplitData);

          setProgress(prev => prev ? {
            ...prev,
            completed: prev.completed + 1,
          } : null);

          console.log(`✓ Split created for: ${track.trackTitle}`);
        } catch (error: any) {
          console.error(`✗ Failed to create split for: ${track.trackTitle}`, error);

          let errorMessage = 'Error desconocido';
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          setProgress(prev => prev ? {
            ...prev,
            failed: prev.failed + 1,
            errors: [...prev.errors, {
              songTitle: track.trackTitle,
              error: errorMessage,
            }],
          } : null);
        }
      }

      console.log('=== BULK CREATION COMPLETED ===');
      setShowResults(true);

      // Auto-close modal after 3 seconds if all successful
      if (progress.failed === 0) {
        setAutoCloseCountdown(3);
      } else {
        // If there were failures, just call onSplitsCreated but keep modal open
        if (onSplitsCreated) {
          onSplitsCreated();
        }
      }

    } catch (error: any) {
      console.error('=== ERROR IN BULK CREATION ===');
      console.error('Error:', error);
      alert(`Error: ${error.message || 'No se pudieron crear los splits'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeWithReset = () => {
    setProgress(null);
    setShowResults(false);
    setAutoCloseCountdown(null);
    onClose();
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base: Record<string, unknown>) => ({
      ...base,
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "4px",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #f59e0b",
      },
      "&:focus-within": {
        border: "1px solid #f59e0b",
        boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
      },
    }),
    option: (
      base: Record<string, unknown>,
      { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }
    ) => ({
      ...base,
      backgroundColor: isSelected ? "#f59e0b" : isFocused ? "#fef3c7" : "white",
      color: isSelected ? "white" : "#374151",
    }),
    multiValue: (base: Record<string, unknown>) => ({
      ...base,
      backgroundColor: "#fef3c7",
      borderRadius: "8px",
    }),
    multiValueLabel: (base: Record<string, unknown>) => ({
      ...base,
      color: "#92400e",
      fontWeight: "500",
    }),
    multiValueRemove: (base: Record<string, unknown>) => ({
      ...base,
      color: "#92400e",
      "&:hover": {
        backgroundColor: "#f59e0b",
        color: "white",
      },
    }),
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWithReset}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-8 text-white overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2))",
                    "linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(245, 158, 11, 0.2))",
                    "linear-gradient(45deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2))",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Disc className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.h2
                      className="text-3xl font-bold mb-1"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      Configurar Split del Owner - Álbum
                    </motion.h2>
                    <motion.p
                      className="text-white/80 text-lg"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {album?.releaseTitle || album?.albumTitle || "Álbum"} - {album.tracks?.length || 0} canciones
                    </motion.p>
                  </div>
                </div>

                <motion.button
                  onClick={closeWithReset}
                  className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              {showResults && progress ? (
                // Results View
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      {progress.failed === 0 ? (
                        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                      ) : (
                        <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                      )}
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Proceso Completado
                    </h3>

                    {autoCloseCountdown !== null && progress.failed === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-600 mt-2"
                      >
                        Cerrando en {autoCloseCountdown} segundo{autoCloseCountdown !== 1 ? 's' : ''}...
                      </motion.p>
                    )}

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="text-3xl font-bold text-blue-600">{progress.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-3xl font-bold text-green-600">{progress.completed}</div>
                        <div className="text-sm text-gray-600">Exitosos</div>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4">
                        <div className="text-3xl font-bold text-red-600">{progress.failed}</div>
                        <div className="text-sm text-gray-600">Fallidos</div>
                      </div>
                    </div>

                    {progress.errors.length > 0 && (
                      <div className="mt-6 text-left">
                        <h4 className="font-semibold text-gray-900 mb-3">Errores encontrados:</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {progress.errors.map((error, index) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <div className="font-medium text-red-900">{error.songTitle}</div>
                              <div className="text-sm text-red-700">{error.error}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : isLoading && progress ? (
                // Progress View
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Creando Splits...
                      </h3>
                      <p className="text-gray-600">
                        {progress.completed + progress.failed} de {progress.total} canciones procesadas
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progreso</span>
                        <span>{Math.round(((progress.completed + progress.failed) / progress.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${((progress.completed + progress.failed) / progress.total) * 100}%`
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {progress.current && (
                      <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Music className="w-5 h-5 text-amber-600" />
                        </motion.div>
                        <div>
                          <div className="text-sm text-gray-600">Procesando:</div>
                          <div className="font-medium text-gray-900">{progress.current}</div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{progress.completed}</div>
                        <div className="text-sm text-gray-600">Completados</div>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
                        <div className="text-sm text-gray-600">Fallidos</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Configuration Form
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Info Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Creación masiva de splits</p>
                      <p>La configuración que definas se aplicará a todas las {album.tracks?.length || 0} canciones de este álbum.</p>
                    </div>
                  </div>

                  <motion.div
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Owner Header */}
                    <motion.div
                      className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 cursor-pointer"
                      onClick={toggleExpanded}
                      whileHover={{
                        backgroundColor: "rgba(245, 158, 11, 0.05)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Crown className="w-7 h-7" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {currentUser?.name || "Owner"}
                            </h3>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                              <span>{currentUser?.email}</span>
                              {ownerForm.percentage && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-medium">
                                  {ownerForm.percentage}%
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 transition-colors"
                        >
                          <ChevronDown className="w-5 h-5 text-amber-700" />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Collapsible Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 space-y-6">
                            {/* General Condition Section */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Settings className="w-6 h-6 text-amber-600" />
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    Condición General
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Configuración base que se aplica cuando no
                                    hay condiciones específicas activas
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Percentage Input */}
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <Percent className="w-4 h-4" />
                                    Porcentaje de Split
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={ownerForm.percentage}
                                      onChange={(e) =>
                                        updateOwnerForm("percentage", e.target.value)
                                      }
                                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-900 font-medium"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                      %
                                    </div>
                                  </div>
                                </div>

                                {/* Countries Configuration */}
                                <div className="space-y-3 col-span-2">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <Globe className="w-4 h-4" />
                                    Configuración de Países
                                  </label>
                                  <div className="space-y-2">
                                    {[
                                      {
                                        value: "all",
                                        label: "Todos los países",
                                      },
                                      {
                                        value: "except",
                                        label: "Excepto países seleccionados",
                                      },
                                      {
                                        value: "only",
                                        label: "Solo países seleccionados",
                                      },
                                    ].map((option) => (
                                      <motion.label
                                        key={option.value}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <input
                                          type="radio"
                                          name="countries-type"
                                          checked={
                                            ownerForm.countriesType === option.value
                                          }
                                          onChange={() =>
                                            updateOwnerForm(
                                              "countriesType",
                                              option.value as "all" | "except" | "only"
                                            )
                                          }
                                          className="w-4 h-4 text-amber-500 focus:ring-amber-500/20"
                                        />
                                        <span className="text-sm text-gray-900">
                                          {option.label}
                                        </span>
                                      </motion.label>
                                    ))}
                                  </div>

                                  {(ownerForm.countriesType === "except" ||
                                    ownerForm.countriesType === "only") && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <Select
                                        isMulti
                                        options={countries}
                                        value={ownerForm.selectedCountries}
                                        onChange={(selected) =>
                                          updateOwnerForm(
                                            "selectedCountries",
                                            selected || []
                                          )
                                        }
                                        styles={selectStyles}
                                        placeholder="Seleccionar países..."
                                        noOptionsMessage={() =>
                                          "No hay países disponibles"
                                        }
                                      />
                                    </motion.div>
                                  )}
                                </div>

                                {/* Platforms Configuration */}
                                <div className="space-y-3 lg:col-span-2">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                    <Music className="w-4 h-4" />
                                    Configuración de Plataformas
                                  </label>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    {[
                                      {
                                        value: "all",
                                        label: "Todas las plataformas",
                                      },
                                      {
                                        value: "except",
                                        label: "Excepto plataformas seleccionadas",
                                      },
                                      {
                                        value: "only",
                                        label: "Solo plataformas seleccionadas",
                                      },
                                    ].map((option) => (
                                      <motion.label
                                        key={option.value}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <input
                                          type="radio"
                                          name="platforms-type"
                                          checked={
                                            ownerForm.platformsType === option.value
                                          }
                                          onChange={() =>
                                            updateOwnerForm(
                                              "platformsType",
                                              option.value as "all" | "except" | "only"
                                            )
                                          }
                                          className="w-4 h-4 text-amber-500 focus:ring-amber-500/20"
                                        />
                                        <span className="text-sm text-gray-900">
                                          {option.label}
                                        </span>
                                      </motion.label>
                                    ))}
                                  </div>

                                  {(ownerForm.platformsType === "except" ||
                                    ownerForm.platformsType === "only") && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <Select
                                        isMulti
                                        options={platforms}
                                        value={ownerForm.selectedPlatforms}
                                        onChange={(selected) =>
                                          updateOwnerForm(
                                            "selectedPlatforms",
                                            selected || []
                                          )
                                        }
                                        styles={selectStyles}
                                        placeholder="Seleccionar plataformas..."
                                        noOptionsMessage={() =>
                                          "No hay plataformas disponibles"
                                        }
                                      />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Conditional Splits Section */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Sparkles className="w-6 h-6 text-orange-500" />
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900">
                                      Condiciones Específicas
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Configuraciones que se aplican en
                                      períodos específicos
                                    </p>
                                  </div>
                                </div>

                                <motion.button
                                  onClick={addSplitCondition}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Plus className="w-4 h-4" />
                                  Añadir Condición
                                </motion.button>
                              </div>

                              {/* Conditional Splits List */}
                              <div className="space-y-4">
                                {(ownerForm.splitConditions || []).map(
                                  (condition, conditionIndex) => (
                                    <motion.div
                                      key={conditionIndex}
                                      className="bg-gradient-to-r from-orange-50 to-orange-25 rounded-2xl p-6 border border-orange-200"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -20 }}
                                      transition={{
                                        delay: conditionIndex * 0.1,
                                      }}
                                    >
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                                            <Calendar className="w-4 h-4 text-orange-600" />
                                          </div>
                                          <h5 className="font-semibold text-gray-900">
                                            Condición #{conditionIndex + 1}
                                          </h5>
                                        </div>

                                        <motion.button
                                          onClick={() =>
                                            removeSplitCondition(conditionIndex)
                                          }
                                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-gray-900">
                                            Fecha de inicio
                                          </label>
                                          <input
                                            type="date"
                                            value={condition.fromDate}
                                            onChange={(e) =>
                                              updateSplitCondition(
                                                conditionIndex,
                                                "fromDate",
                                                e.target.value
                                              )
                                            }
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-gray-900">
                                            Fecha de fin
                                          </label>
                                          <input
                                            type="date"
                                            value={condition.toDate}
                                            onChange={(e) =>
                                              updateSplitCondition(
                                                conditionIndex,
                                                "toDate",
                                                e.target.value
                                              )
                                            }
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-gray-900">
                                            Porcentaje
                                          </label>
                                          <div className="relative">
                                            <input
                                              type="number"
                                              min="0"
                                              max="100"
                                              step="0.01"
                                              value={condition.percentage}
                                              onChange={(e) =>
                                                updateSplitCondition(
                                                  conditionIndex,
                                                  "percentage",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                              %
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Countries and Platforms for conditions */}
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-gray-900">
                                            Países
                                          </label>
                                          <div className="flex gap-2 text-xs">
                                            {[
                                              { value: "all", label: "Todos" },
                                              { value: "except", label: "Excepto" },
                                              { value: "only", label: "Solo" },
                                            ].map((option) => (
                                              <label
                                                key={option.value}
                                                className="flex items-center gap-1 cursor-pointer"
                                              >
                                                <input
                                                  type="radio"
                                                  name={`countries-condition-${conditionIndex}`}
                                                  checked={
                                                    condition.countriesType ===
                                                      option.value ||
                                                    (condition.countriesType ===
                                                      undefined &&
                                                      option.value === "all")
                                                  }
                                                  onChange={() =>
                                                    updateSplitCondition(
                                                      conditionIndex,
                                                      "countriesType",
                                                      option.value
                                                    )
                                                  }
                                                  className="w-3 h-3"
                                                />
                                                <span>{option.label}</span>
                                              </label>
                                            ))}
                                          </div>
                                          {condition.countriesType !== "all" && (
                                            <Select
                                              isMulti
                                              options={countries}
                                              onChange={(selected) =>
                                                updateSplitCondition(
                                                  conditionIndex,
                                                  "countries",
                                                  selected || []
                                                )
                                              }
                                              styles={selectStyles}
                                              placeholder="Seleccionar..."
                                            />
                                          )}
                                        </div>

                                        <div className="space-y-2">
                                          <label className="text-sm font-medium text-gray-900">
                                            Plataformas
                                          </label>
                                          <div className="flex gap-2 text-xs">
                                            {[
                                              { value: "all", label: "Todas" },
                                              { value: "except", label: "Excepto" },
                                              { value: "only", label: "Solo" },
                                            ].map((option) => (
                                              <label
                                                key={option.value}
                                                className="flex items-center gap-1 cursor-pointer"
                                              >
                                                <input
                                                  type="radio"
                                                  name={`platforms-condition-${conditionIndex}`}
                                                  checked={
                                                    condition.platformsType ===
                                                      option.value ||
                                                    (condition.countriesType ===
                                                      undefined &&
                                                      option.value === "all")
                                                  }
                                                  onChange={() =>
                                                    updateSplitCondition(
                                                      conditionIndex,
                                                      "platformsType",
                                                      option.value
                                                    )
                                                  }
                                                  className="w-3 h-3"
                                                />
                                                <span>{option.label}</span>
                                              </label>
                                            ))}
                                          </div>
                                          {condition.platformsType !== "all" && (
                                            <Select
                                              isMulti
                                              options={platforms}
                                              onChange={(selected) =>
                                                updateSplitCondition(
                                                  conditionIndex,
                                                  "platforms",
                                                  selected || []
                                                )
                                              }
                                              styles={selectStyles}
                                              placeholder="Seleccionar..."
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {showResults
                    ? "Proceso completado"
                    : `Configurando split para ${album.tracks?.length || 0} canciones`
                  }
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={closeWithReset}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showResults ? "Cerrar" : "Cancelar"}
                  </motion.button>

                  {!showResults && !isLoading && (
                    <motion.button
                      onClick={createBulkOwnerSplits}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Save className="w-4 h-4" />
                      Crear Splits para Todas las Canciones
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
