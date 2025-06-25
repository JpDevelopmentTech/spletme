import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Music, AlertCircle, Check, User as UserIcon, Plus, Calendar, Globe, Settings, Loader2 } from 'lucide-react';
import { User } from '../../models/user';
import { useSplits } from '../../hooks/useSplits';
import { CreateSplitRequest, SplitParticipant as ServiceParticipant, SplitCondition } from '../../services/splits';

// Local interfaces for the modal
interface Participant {
  id: string;
  name: string;
  role: string;
  percentage: number;
  conditions: SplitCondition[];
}

interface SplitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: User[];
  songId?: string; // Optional song ID for loading existing splits
  onSplitSaved?: (splitId: string) => void; // Callback when split is saved
}

const SplitsModal = ({ isOpen, onClose, collaborators, songId, onSplitSaved }: SplitsModalProps) => {
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [ownerPercentage, setOwnerPercentage] = useState<number>(0);
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  const {
    split,
    loading,
    error,
    saving,
    loadSplitBySong,
    createSplit,
    updateSplit,
    generateConditionDescription,
    clearError,
    clearSplit
  } = useSplits();

  const platforms = [
    'Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Deezer', 
    'Tidal', 'SoundCloud', 'Bandcamp', 'Pandora', 'iHeartRadio'
  ];

  const countries = [
    'Colombia', 'Estados Unidos', 'México', 'Argentina', 'España', 'Brasil',
    'Chile', 'Perú', 'Ecuador', 'Venezuela', 'Uruguay', 'Paraguay',
    'Reino Unido', 'Francia', 'Alemania', 'Italia', 'Canadá', 'Australia'
  ];

  const conditionTypes = [
    { value: 'time', label: 'Por período de tiempo' },
    { value: 'platforms', label: 'Solo en ciertas plataformas' },
    { value: 'countries', label: 'Solo en ciertos países' },
    { value: 'time_reduced', label: 'Período con reducción posterior' },
    { value: 'custom', label: 'Condición personalizada' }
  ];

  // Load existing split when modal opens with songId
  useEffect(() => {
    if (isOpen && songId) {
      loadSplitBySong(songId);
    } else if (isOpen && !songId) {
      // Initialize with collaborators for new split
      initializeParticipants();
    }
  }, [isOpen, songId, loadSplitBySong]);

  // Initialize participants from collaborators or existing split
  useEffect(() => {
    if (split) {
      // Load existing split data
      setOwnerPercentage(split.ownerPercentage);
      setParticipants(split.participants?.map(p => ({
        id: p.id || p.name, // Use ID if available, fallback to name
        name: p.name,
        role: p.role,
        percentage: p.percentage,
        conditions: p.conditions || []
      })));
    } else if (collaborators && collaborators.length > 0) {
      initializeParticipants();
    }
  }, [split, collaborators]);

  const initializeParticipants = () => {
    setParticipants(collaborators?.map(collaborator => ({
      id: collaborator.id,
      name: collaborator.name,
      role: collaborator.role || '',
      percentage: collaborator.percentage || 0,
      conditions: []
    })) || []);
    setOwnerPercentage(0);
  };

  // Clear state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLocalErrors({});
      clearError();
      if (!songId) {
        clearSplit();
      }
    }
  }, [isOpen, songId, clearError, clearSplit]);

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const addCondition = (participantId: string) => {
    const newCondition: SplitCondition = {
      type: 'time',
      percentage: 0,
      description: '',
      parameters: {}
    };
    
    setParticipants(participants.map(p => 
      p.id === participantId 
        ? { ...p, conditions: [...p.conditions, newCondition] }
        : p
    ));
  };

  const removeCondition = (participantId: string, conditionIndex: number) => {
    setParticipants(participants.map(p => 
      p.id === participantId 
        ? { ...p, conditions: p.conditions.filter((_, index) => index !== conditionIndex) }
        : p
    ));
  };

  const updateCondition = (participantId: string, conditionIndex: number, field: keyof SplitCondition, value: string | number) => {
    setParticipants(participants.map(p => 
      p.id === participantId 
        ? {
            ...p, 
            conditions: p.conditions.map((c, index) => 
              index === conditionIndex ? { ...c, [field]: value } : c
            )
          }
        : p
    ));
  };

  const updateConditionParameter = (participantId: string, conditionIndex: number, parameter: string, value: string | number | string[]) => {
    setParticipants(participants.map(p => 
      p.id === participantId 
        ? {
            ...p, 
            conditions: p.conditions.map((c, index) => 
              index === conditionIndex 
                ? { ...c, parameters: { ...c.parameters, [parameter]: value } }
                : c
            )
          }
        : p
    ));
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string | number) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
    
    // Clear related errors
    if (localErrors[`${id}_${field}`]) {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${id}_${field}`];
        return newErrors;
      });
    }
  };

  const getTotalPercentage = () => {
    return participants?.reduce((sum, p) => sum + (p.percentage || 0), 0) + ownerPercentage;
  };

  const handleSave = async () => {
    if (!songId) {
      setLocalErrors({ general: 'ID de canción requerido' });
      return;
    }

    const splitData: CreateSplitRequest = {
      songId,
      owner: {
        name: "Tú (Dueño)",
        role: "Dueño/Creador",
        percentage: ownerPercentage
      },
      splits: participants.map((participant): ServiceParticipant => ({
        name: participant.name,
        role: participant.role,
        percentage: participant.percentage,
        conditions: participant.conditions.map(c => ({
          ...c,
          description: generateConditionDescription(c)
        }))
      }))
    };

    let result;
    if (split?.id) {
      // Update existing split
      result = await updateSplit(split.id, splitData);
    } else {
      // Create new split
      result = await createSplit(splitData);
    }

    if (result) {
      onSplitSaved?.(result.id);
      onClose();
    }
  };

  const isFormValid = () => {
    return ownerPercentage > 0 &&
           participants?.every(p => p.percentage > 0) &&
           getTotalPercentage() === 100 &&
           !loading &&
           !saving;
  };

  const totalPercentage = getTotalPercentage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {split ? 'Editar Split' : 'Gestionar Splits'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configura la distribución de regalías
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={saving}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando split...</span>
              </div>
            )}

            {/* Content */}
            {!loading && (
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Error Display */}
                {(error || localErrors.general) && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {error || localErrors.general}
                    </p>
                  </div>
                )}

                {/* Owner Percentage */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    Tu porcentaje como dueño de la canción
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={ownerPercentage || ''}
                      onChange={(e) => {
                        setOwnerPercentage(parseInt(e.target.value) || 0);
                        if (localErrors.ownerPercentage) {
                          setLocalErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.ownerPercentage;
                            return newErrors;
                          });
                        }
                      }}
                      placeholder="0"
                      disabled={saving}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                        localErrors.ownerPercentage
                          ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                          : 'border-gray-200 bg-white hover:border-gray-300 focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:focus:border-gray-400'
                      } dark:text-white dark:placeholder-gray-400`}
                    />
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">%</span>
                  </div>
                  {localErrors.ownerPercentage && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {localErrors.ownerPercentage}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Este es tu porcentaje como dueño/creador principal de la canción
                  </p>
                </div>

                {/* Participants */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    <Music className="w-4 h-4 inline mr-2" />
                    Colaboradores
                  </label>

                  <div className="space-y-4">
                    {participants?.map((participant, index) => (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Participante {index + 1}
                          </span>
                          {participants.length > 1 && (
                            <button
                              onClick={() => removeParticipant(participant.id)}
                              disabled={saving}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Name */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Nombre
                            </label>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{participant.name}</span>
                          </div>

                          {/* Role */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Rol
                            </label>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{participant.role || 'Sin rol asignado'}</span>
                          </div>

                          {/* Percentage */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Porcentaje Base (%)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={participant.percentage || 0}
                              onChange={(e) => updateParticipant(participant.id, 'percentage', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              disabled={saving}
                              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                                localErrors[`${participant.id}_percentage`]
                                  ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500'
                              } dark:text-white dark:placeholder-gray-400 text-sm`}
                            />
                            {localErrors[`${participant.id}_percentage`] && (
                              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {localErrors[`${participant.id}_percentage`]}
                              </p>
                            )}
                          </div>

                          {/* Conditions */}
                          <div className="col-span-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                                Condiciones del Split
                              </label>
                              <button
                                type="button"
                                onClick={() => addCondition(participant.id)}
                                disabled={saving}
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50"
                              >
                                <Plus size={12} />
                                Agregar
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              {participant.conditions.map((condition, conditionIndex) => (
                                <div key={conditionIndex} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {condition.type === 'time' && <Calendar size={14} className="text-gray-500" />}
                                      {condition.type === 'platforms' && <Music size={14} className="text-gray-500" />}
                                      {condition.type === 'countries' && <Globe size={14} className="text-gray-500" />}
                                      {(condition.type === 'time_reduced' || condition.type === 'custom') && <Settings size={14} className="text-gray-500" />}
                                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Condición {conditionIndex + 1}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeCondition(participant.id, conditionIndex)}
                                      disabled={saving}
                                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                      <select
                                        value={condition.type}
                                        onChange={(e) => updateCondition(participant.id, conditionIndex, 'type', e.target.value as SplitCondition['type'])}
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                                      >
                                        {conditionTypes.map(type => (
                                          <option key={type.value} value={type.value}>
                                            {type.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={condition.percentage}
                                        onChange={(e) => updateCondition(participant.id, conditionIndex, 'percentage', parseInt(e.target.value) || 0)}
                                        placeholder="% para esta condición"
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                                      />
                                    </div>
                                  </div>

                                  {/* Specific parameters based on type */}
                                  {condition.type === 'time' && (
                                    <div className="grid grid-cols-2 gap-2">
                                      <input
                                        type="date"
                                        value={condition.parameters.startDate || ''}
                                        onChange={(e) => updateConditionParameter(participant.id, conditionIndex, 'startDate', e.target.value)}
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                                      />
                                      <input
                                        type="date"
                                        value={condition.parameters.endDate || ''}
                                        onChange={(e) => updateConditionParameter(participant.id, conditionIndex, 'endDate', e.target.value)}
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                                      />
                                    </div>
                                  )}

                                  {condition.type === 'platforms' && (
                                    <div>
                                      <select
                                        multiple
                                        value={condition.parameters.platforms || []}
                                        onChange={(e) => {
                                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                          updateConditionParameter(participant.id, conditionIndex, 'platforms', selectedOptions);
                                        }}
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-20 disabled:opacity-50"
                                      >
                                        {platforms.map(platform => (
                                          <option key={platform} value={platform}>
                                            {platform}
                                          </option>
                                        ))}
                                      </select>
                                      <p className="text-xs text-gray-500 mt-1">Mantén Ctrl/Cmd para seleccionar múltiples</p>
                                    </div>
                                  )}

                                  {condition.type === 'countries' && (
                                    <div>
                                      <select
                                        multiple
                                        value={condition.parameters.countries || []}
                                        onChange={(e) => {
                                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                          updateConditionParameter(participant.id, conditionIndex, 'countries', selectedOptions);
                                        }}
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-20 disabled:opacity-50"
                                      >
                                        {countries.map(country => (
                                          <option key={country} value={country}>
                                            {country}
                                          </option>
                                        ))}
                                      </select>
                                      <p className="text-xs text-gray-500 mt-1">Mantén Ctrl/Cmd para seleccionar múltiples</p>
                                    </div>
                                  )}

                                  {condition.type === 'time_reduced' && (
                                    <div className="grid grid-cols-3 gap-2">
                                      <input
                                        type="date"
                                        value={condition.parameters.startDate || ''}
                                        onChange={(e) => updateConditionParameter(participant.id, conditionIndex, 'startDate', e.target.value)}
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                                      />
                                      <input
                                        type="date"
                                        value={condition.parameters.endDate || ''}
                                        onChange={(e) => updateConditionParameter(participant.id, conditionIndex, 'endDate', e.target.value)}
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                                      />
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={condition.parameters.finalPercentage || 0}
                                        onChange={(e) => updateConditionParameter(participant.id, conditionIndex, 'finalPercentage', parseInt(e.target.value) || 0)}
                                        placeholder="% después"
                                        disabled={saving}
                                        className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                                      />
                                    </div>
                                  )}

                                  {condition.type === 'custom' && (
                                    <textarea
                                      value={condition.parameters.text || ''}
                                      onChange={(e) => updateConditionParameter(participant.id, conditionIndex, 'text', e.target.value)}
                                      placeholder="Describe la condición personalizada..."
                                      disabled={saving}
                                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-16 resize-none disabled:opacity-50"
                                    />
                                  )}

                                  {/* Generated description */}
                                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                                    <strong>Vista previa:</strong> {generateConditionDescription(condition)}
                                  </div>
                                </div>
                              ))}
                              
                              {participant.conditions.length === 0 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 italic text-center py-2">
                                  Sin condiciones específicas - Se aplicará el porcentaje base
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Resumen de Distribución
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tu porcentaje:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{ownerPercentage}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Colaboradores:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {participants?.reduce((sum, p) => sum + p.percentage, 0)}%
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-gray-700 dark:text-gray-300">Total:</span>
                        <span className={`${totalPercentage === 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {totalPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total validation error */}
                {totalPercentage !== 100 && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      La suma de porcentajes debe ser exactamente 100% (actual: {totalPercentage}%)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid() || saving}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isFormValid() && !saving
                    ? 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{split ? 'Actualizar Split' : 'Guardar Split'}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplitsModal; 
