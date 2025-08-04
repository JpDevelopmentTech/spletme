import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, User, Clock, Search } from 'lucide-react';
import { useSplits } from '../../hooks/useSplits';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  splitId: string;
  songTitle?: string;
}

const PaymentHistoryModal = ({ isOpen, onClose, splitId, songTitle }: PaymentHistoryModalProps) => {
  const { loading, error, getSplitsBySong, clearError } = useSplits();
  const [splits, setSplits] = useState<any[]>([]);
  const [selectedSplit, setSelectedSplit] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (isOpen && splitId) {
      loadSplits();
    }
  }, [isOpen, splitId]);

  const loadSplits = async () => {
    if (splitId) {
      const result = await getSplitsBySong(splitId);
      setSplits(result || []);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedSplit(null);
      setSearchTerm('');
      clearError();
    }
  }, [isOpen, clearError]);

  const filteredSplits = splits.filter(split => {
    const matchesSearch = !searchTerm || 
      split.collaborator?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      split.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPercentage = splits.reduce((sum, split) => sum + (split.generalCondition?.percentage || 0), 0);
  const averagePercentage = splits.length > 0 ? totalPercentage / splits.length : 0;



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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Historial de Pagos
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {songTitle || 'Canción'} - {splits.length} splits registrados
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-80px)]">
              {/* Left Panel - Payment List */}
              <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
                {/* Filters and Search */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex flex-col space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Buscar pagos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400">
                        Filtros de splits
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Summary */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {totalPercentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Porcentaje</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {splits.length}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Splits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {averagePercentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Promedio</p>
                    </div>
                  </div>
                </div>

                {/* Payment List */}
                <div className="overflow-y-auto flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando pagos...</span>
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-600 dark:text-red-400">
                      <p>Error al cargar los pagos: {error}</p>
                    </div>
                  ) : filteredSplits.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay splits registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {filteredSplits.map((split) => (
                        <motion.div
                          key={split.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedSplit?.id === split.id
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                          onClick={() => setSelectedSplit(split)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-blue-500" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {split.collaborator?.name || 'Colaborador'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {split.generalCondition?.percentage || 0}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {split.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Split Details */}
              <div className="w-1/2">
                {selectedSplit ? (
                  <div className="p-6 overflow-y-auto h-full">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Detalles del Split
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID del Split</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedSplit.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedSplit.isActive ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Porcentaje</p>
                          <p className="font-medium text-gray-900 dark:text-white text-lg">{selectedSplit.generalCondition?.percentage || 0}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Colaborador</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedSplit.collaborator?.name || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex space-x-4 mb-4">
                        <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            {selectedSplit.collaborator?.email || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Split Conditions */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Condiciones del Split
                      </h4>

                      {/* General Condition */}
                      <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-indigo-900 dark:text-indigo-100">
                              Condición General
                            </span>
                          </div>
                          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                            {selectedSplit.generalCondition?.percentage || 0}%
                          </span>
                        </div>
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">
                          <p>Plataformas: {selectedSplit.generalCondition?.platformsType || 'N/A'}</p>
                          <p>Países: {selectedSplit.generalCondition?.countriesType || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Specific Conditions */}
                      {selectedSplit.splitConditions && selectedSplit.splitConditions.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Condiciones Específicas
                          </h5>
                          {selectedSplit.splitConditions.map((condition: any, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  Condición {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {condition.percentage}%
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>Tipo: {condition.type}</p>
                                {condition.fromDate && <p>Desde: {condition.fromDate}</p>}
                                {condition.toDate && <p>Hasta: {condition.toDate}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Selecciona un split para ver los detalles</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentHistoryModal; 