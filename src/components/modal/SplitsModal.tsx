import { AnimatePresence, motion } from "framer-motion";
import {
  Music,
  Trash2,
  User,
  X,
  Plus,
  Globe,
  Calendar,
  Percent,
  Users,
  Settings,
  ChevronDown,
  Save,
  Sparkles,
} from "lucide-react";
import { User as UserType } from "@/models/user";
import Select from "react-select";
import { countries, platforms } from "@/const";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  splitsService,
  type SplitCondition,
  type CreateSplitRequest,
} from "@/services/splits";

interface SplitsModalProps {
  collaborators: UserType[];
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  onSplitSaved: (splitId: string) => void;
}

interface CollaboratorFormData {
  percentage: string;
  countriesType: "all" | "except" | "only";
  selectedCountries: { value: string; label: string }[];
  platformsType: "all" | "except" | "only";
  selectedPlatforms: { value: string; label: string }[];
  splitConditions: SplitCondition[];
  type: "general" | "specific";
}

export default function SplitsModal({
  collaborators,
  isOpen,
  onClose,
  songId,
}: SplitsModalProps) {
  const [collaboratorForms, setCollaboratorForms] = useState<
    Record<string, CollaboratorFormData>
  >({});
  const [expandedCollaborators, setExpandedCollaborators] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Toggle expanded state for collaborator
  const toggleCollaboratorExpanded = (collaboratorId: string) => {
    setExpandedCollaborators((prev) => ({
      ...prev,
      [collaboratorId]: !prev[collaboratorId],
    }));
  };

  // Actualizar datos del formulario de un colaborador específico
  const updateCollaboratorForm = (
    collaboratorId: string,
    field: keyof CollaboratorFormData,
    value: string | readonly { value: string; label: string }[]
  ) => {
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: {
        ...prev[collaboratorId],
        [field]: value,
      },
    }));
  };

  // Actualizar condiciones específicas de split
  const updateSplitCondition = (
    collaboratorId: string,
    conditionIndex: number,
    field: string,
    value:
      | string
      | readonly { value: string; label: string }[]
      | readonly string[]
  ) => {
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: {
        ...prev[collaboratorId],
        splitConditions: (prev[collaboratorId]?.splitConditions || []).map(
          (condition, index) =>
            index === conditionIndex
              ? { ...condition, [field]: value }
              : condition
        ),
      },
    }));
  };

  const addSplitCondition = (collaboratorId: string) => {
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: {
        ...prev[collaboratorId],
        splitConditions: [
          ...prev[collaboratorId].splitConditions,
          {
            percentage: 0,
            selectedCountries: [],
            countriesType: "all",
            selectedPlatforms: [],
            platformsType: "all",
            type: "specific",
          },
        ],
      },
    }));
  };

  const removeSplitCondition = (
    collaboratorId: string,
    conditionIndex: number
  ) => {
    setCollaboratorForms((prev) => ({
      ...prev,
      [collaboratorId]: {
        ...prev[collaboratorId],
        splitConditions: prev[collaboratorId].splitConditions.filter(
          (_, index) => index !== conditionIndex
        ),
      },
    }));
  };

  const saveSplit = async () => {
    setIsLoading(true);
    try {
      // Convertir los datos del formulario al formato del backend
      const splitsToCreate: CreateSplitRequest[] = [];

      for (const [collaboratorId, formData] of Object.entries(
        collaboratorForms
      )) {
        if (formData.percentage && parseFloat(formData.percentage) > 0) {
          const splitRequest: CreateSplitRequest = {
            songId,
            collaboratorId,
            conditions: formData.splitConditions.map((condition) => ({
              fromDate: condition.fromDate,
              toDate: condition.toDate,
              percentage: condition.percentage,
              selectedCountries: condition.selectedCountries || [],
              countriesType: condition.countriesType,
              selectedPlatforms: condition.selectedPlatforms || [],
              platformsType: condition.platformsType,
              type: condition.type,
            })),
          };

          splitRequest.conditions?.push({
            percentage: parseFloat(formData.percentage),
            selectedCountries: formData.selectedCountries.map((c) => c.value),
            selectedPlatforms: formData.selectedPlatforms.map((p) => p.value),
            countriesType: formData.countriesType,
            platformsType: formData.platformsType,
            type: "general",
          });

          splitsToCreate.push(splitRequest);
        }
      }

      const response = await splitsService.createSplit(splitsToCreate);
      console.log(response);
      onClose();
    } catch (error) {
      console.error("Error saving splits:", error);
      alert("Error al guardar los splits. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
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
        border: "1px solid #219EBC",
      },
      "&:focus-within": {
        border: "1px solid #219EBC",
        boxShadow: "0 0 0 3px rgba(33, 158, 188, 0.1)",
      },
    }),
    option: (
      base: Record<string, unknown>,
      { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }
    ) => ({
      ...base,
      backgroundColor: isSelected ? "#219EBC" : isFocused ? "#8ECAE6" : "white",
      color: isSelected ? "white" : "#374151",
    }),
    multiValue: (base: Record<string, unknown>) => ({
      ...base,
      backgroundColor: "#8ECAE6",
      borderRadius: "8px",
    }),
    multiValueLabel: (base: Record<string, unknown>) => ({
      ...base,
      color: "#023047",
      fontWeight: "500",
    }),
    multiValueRemove: (base: Record<string, unknown>) => ({
      ...base,
      color: "#023047",
      "&:hover": {
        backgroundColor: "#219EBC",
        color: "white",
      },
    }),
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header */}
            <div className="relative bg-gradient-to-r from-tertiary via-secondary to-tertiary p-8 text-white overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-tertiary/20 to-secondary/20"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(33, 158, 188, 0.2), rgba(142, 202, 230, 0.2))",
                    "linear-gradient(135deg, rgba(142, 202, 230, 0.2), rgba(33, 158, 188, 0.2))",
                    "linear-gradient(45deg, rgba(33, 158, 188, 0.2), rgba(142, 202, 230, 0.2))",
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
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.h2
                      className="text-3xl font-bold mb-1"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      Configurar Splits
                    </motion.h2>
                    <motion.p
                      className="text-white/80 text-lg"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Distribuye los ingresos entre colaboradores
                    </motion.p>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            {/* Enhanced Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {collaborators.map((collaborator, index) => {
                  // Inicializar formulario si no existe
                  if (!collaboratorForms[collaborator.id]) {
                    setCollaboratorForms((prev) => ({
                      ...prev,
                      [collaborator.id]: {
                        percentage: "",
                        countriesType: "all",
                        selectedCountries: [],
                        platformsType: "all",
                        selectedPlatforms: [],
                        splitConditions: [],
                        type: "general",
                      },
                    }));
                  }

                  const formData = collaboratorForms[collaborator.id] || {
                    percentage: "",
                    countriesType: "all",
                    selectedCountries: [],
                    platformsType: "all",
                    selectedPlatforms: [],
                    splitConditions: [],
                    type: "general",
                  };

                  const isExpanded = expandedCollaborators[collaborator.id];

                  return (
                    <motion.div
                      key={collaborator.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {/* Collaborator Header */}
                      <motion.div
                        className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 cursor-pointer"
                        onClick={() =>
                          toggleCollaboratorExpanded(collaborator.id)
                        }
                        whileHover={{
                          backgroundColor: "rgba(142, 202, 230, 0.05)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-tertiary flex items-center justify-center text-white shadow-lg"
                              whileHover={{ scale: 1.1 }}
                            >
                              <User className="w-7 h-7" />
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-bold text-quaternary mb-1">
                                {collaborator.name}
                              </h3>
                              <p className="text-septenary text-sm flex items-center gap-2">
                                <span>{collaborator.email}</span>
                                {formData.percentage && (
                                  <span className="px-2 py-1 bg-secondary/20 text-tertiary rounded-lg text-xs font-medium">
                                    {formData.percentage}%
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <ChevronDown className="w-5 h-5 text-septenary" />
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
                              <div className="bg-gradient-to-r from-secondary/10 to-tertiary/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                  <Settings className="w-6 h-6 text-tertiary" />
                                  <div>
                                    <h4 className="text-lg font-semibold text-quaternary">
                                      Condición General
                                    </h4>
                                    <p className="text-sm text-septenary">
                                      Configuración base que se aplica cuando no
                                      hay condiciones específicas activas
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* Percentage Input */}
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-quaternary">
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
                                        value={formData.percentage}
                                        onChange={(e) =>
                                          updateCollaboratorForm(
                                            collaborator.id,
                                            "percentage",
                                            e.target.value
                                          )
                                        }
                                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tertiary/20 focus:border-tertiary transition-all text-quaternary font-medium"
                                      />
                                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-septenary">
                                        %
                                      </div>
                                    </div>
                                  </div>

                                  {/* Countries Configuration */}
                                  <div className="space-y-3 col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-quaternary">
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
                                            name={`countries-${collaborator.id}`}
                                            checked={
                                              formData.countriesType ===
                                              option.value
                                            }
                                            onChange={() =>
                                              updateCollaboratorForm(
                                                collaborator.id,
                                                "countriesType",
                                                option.value as
                                                  | "all"
                                                  | "except"
                                                  | "only"
                                              )
                                            }
                                            className="w-4 h-4 text-tertiary focus:ring-tertiary/20"
                                          />
                                          <span className="text-sm text-quaternary">
                                            {option.label}
                                          </span>
                                        </motion.label>
                                      ))}
                                    </div>

                                    {(formData.countriesType === "except" ||
                                      formData.countriesType === "only") && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                      >
                                        <Select
                                          isMulti
                                          options={countries}
                                          value={formData.selectedCountries}
                                          onChange={(selected) =>
                                            updateCollaboratorForm(
                                              collaborator.id,
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
                                    <label className="flex items-center gap-2 text-sm font-medium text-quaternary">
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
                                          label:
                                            "Excepto plataformas seleccionadas",
                                        },
                                        {
                                          value: "only",
                                          label:
                                            "Solo plataformas seleccionadas",
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
                                            name={`platforms-${collaborator.id}`}
                                            checked={
                                              formData.platformsType ===
                                              option.value
                                            }
                                            onChange={() =>
                                              updateCollaboratorForm(
                                                collaborator.id,
                                                "platformsType",
                                                option.value as
                                                  | "all"
                                                  | "except"
                                                  | "only"
                                              )
                                            }
                                            className="w-4 h-4 text-tertiary focus:ring-tertiary/20"
                                          />
                                          <span className="text-sm text-quaternary">
                                            {option.label}
                                          </span>
                                        </motion.label>
                                      ))}
                                    </div>

                                    {(formData.platformsType === "except" ||
                                      formData.platformsType === "only") && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                      >
                                        <Select
                                          isMulti
                                          options={platforms}
                                          value={formData.selectedPlatforms}
                                          onChange={(selected) =>
                                            updateCollaboratorForm(
                                              collaborator.id,
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
                                    <Sparkles className="w-6 h-6 text-quinary" />
                                    <div>
                                      <h4 className="text-lg font-semibold text-quaternary">
                                        Condiciones Específicas
                                      </h4>
                                      <p className="text-sm text-septenary">
                                        Configuraciones que se aplican en
                                        períodos específicos
                                      </p>
                                    </div>
                                  </div>

                                  <motion.button
                                    onClick={() =>
                                      addSplitCondition(collaborator.id)
                                    }
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-quinary to-quinary/80 text-white rounded-xl hover:shadow-lg transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Plus className="w-4 h-4" />
                                    Añadir Condición
                                  </motion.button>
                                </div>

                                {/* Conditional Splits List */}
                                <div className="space-y-4">
                                  {(formData.splitConditions || []).map(
                                    (condition, conditionIndex) => (
                                      <motion.div
                                        key={conditionIndex}
                                        className="bg-gradient-to-r from-quinary/10 to-quinary/5 rounded-2xl p-6 border border-quinary/20"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{
                                          delay: conditionIndex * 0.1,
                                        }}
                                      >
                                        <div className="flex items-center justify-between mb-4">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-quinary/20 flex items-center justify-center">
                                              <Calendar className="w-4 h-4 text-quinary" />
                                            </div>
                                            <h5 className="font-semibold text-quaternary">
                                              Condición #{conditionIndex + 1}
                                            </h5>
                                          </div>

                                          <motion.button
                                            onClick={() =>
                                              removeSplitCondition(
                                                collaborator.id,
                                                conditionIndex
                                              )
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
                                            <label className="text-sm font-medium text-quaternary">
                                              Fecha de inicio
                                            </label>
                                            <input
                                              type="date"
                                              value={condition.fromDate}
                                              onChange={(e) =>
                                                updateSplitCondition(
                                                  collaborator.id,
                                                  conditionIndex,
                                                  "fromDate",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all"
                                            />
                                          </div>

                                          <div className="space-y-2">
                                            <label className="text-sm font-medium text-quaternary">
                                              Fecha de fin
                                            </label>
                                            <input
                                              type="date"
                                              value={condition.toDate}
                                              onChange={(e) =>
                                                updateSplitCondition(
                                                  collaborator.id,
                                                  conditionIndex,
                                                  "toDate",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all"
                                            />
                                          </div>

                                          <div className="space-y-2">
                                            <label className="text-sm font-medium text-quaternary">
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
                                                    collaborator.id,
                                                    conditionIndex,
                                                    "percentage",
                                                    e.target.value
                                                  )
                                                }
                                                className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-quinary/20 focus:border-quinary transition-all"
                                              />
                                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-septenary text-sm">
                                                %
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Countries and Platforms for conditions - Similar structure but more compact */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <label className="text-sm font-medium text-quaternary">
                                              Países
                                            </label>
                                            <div className="flex gap-2 text-xs">
                                              {[
                                                {
                                                  value: "all",
                                                  label: "Todos",
                                                },
                                                {
                                                  value: "except",
                                                  label: "Excepto",
                                                },
                                                {
                                                  value: "only",
                                                  label: "Solo",
                                                },
                                              ].map((option) => (
                                                <label
                                                  key={option.value}
                                                  className="flex items-center gap-1 cursor-pointer"
                                                >
                                                  <input
                                                    type="radio"
                                                    name={`countries-${collaborator.id}-${conditionIndex}`}
                                                    checked={
                                                      condition.countriesType ===
                                                        option.value ||
                                                      (condition.countriesType ===
                                                        undefined &&
                                                        option.value === "all")
                                                    }
                                                    onChange={() =>
                                                      updateSplitCondition(
                                                        collaborator.id,
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
                                            {condition.countriesType !==
                                              "all" && (
                                              <Select<
                                                {
                                                  value: string;
                                                  label: string;
                                                },
                                                true
                                              >
                                                isMulti
                                                options={countries}
                                                onChange={(selected) =>
                                                  updateSplitCondition(
                                                    collaborator.id,
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
                                            <label className="text-sm font-medium text-quaternary">
                                              Plataformas
                                            </label>
                                            <div className="flex gap-2 text-xs">
                                              {[
                                                {
                                                  value: "all",
                                                  label: "Todas",
                                                },
                                                {
                                                  value: "except",
                                                  label: "Excepto",
                                                },
                                                {
                                                  value: "only",
                                                  label: "Solo",
                                                },
                                              ].map((option) => (
                                                <label
                                                  key={option.value}
                                                  className="flex items-center gap-1 cursor-pointer"
                                                >
                                                  <input
                                                    type="radio"
                                                    name={`platforms-${collaborator.id}-${conditionIndex}`}
                                                    checked={
                                                      condition.platformsType ===
                                                        option.value ||
                                                      (condition.platformsType ===
                                                        undefined &&
                                                        option.value === "all")
                                                    }
                                                    onChange={() =>
                                                      updateSplitCondition(
                                                        collaborator.id,
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
                                            {condition.platformsType !==
                                              "all" && (
                                              <Select
                                                isMulti
                                                options={platforms}
                                                onChange={(selected) =>
                                                  updateSplitCondition(
                                                    collaborator.id,
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
                  );
                })}
              </motion.div>
            </div>

            {/* Enhanced Footer */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-septenary">
                  {collaborators.length} colaborador
                  {collaborators.length !== 1 ? "es" : ""} configurado
                  {collaborators.length !== 1 ? "s" : ""}
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-3 text-septenary hover:text-quaternary transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancelar
                  </motion.button>

                  <motion.button
                    onClick={saveSplit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-tertiary to-secondary text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isLoading ? "Guardando..." : "Guardar Configuración"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use React Portal to render at root level
  if (!mounted) return null;
  
  return createPortal(modalContent, document.body);
}
