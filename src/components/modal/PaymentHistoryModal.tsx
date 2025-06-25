import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calendar, Globe, Music, TrendingUp, User, Clock, Filter, Search } from 'lucide-react';
import { usePayments } from '../../hooks/useSplits';
import { PaymentRecord, CalculationResponse } from '../../services/splits';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  splitId: string;
  songTitle?: string;
}

const PaymentHistoryModal = ({ isOpen, onClose, splitId, songTitle }: PaymentHistoryModalProps) => {
  const { payments, loading, error, loadPayments, clearError } = usePayments();
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (isOpen && splitId) {
      loadPayments(splitId);
    }
  }, [isOpen, splitId, loadPayments]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPayment(null);
      setFilterPlatform('');
      setFilterCountry('');
      setSearchTerm('');
      clearError();
    }
  }, [isOpen, clearError]);

  const filteredPayments = payments.filter(payment => {
    const matchesPlatform = !filterPlatform || payment.platform === filterPlatform;
    const matchesCountry = !filterCountry || payment.country === filterCountry;
    const matchesSearch = !searchTerm || 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPlatform && matchesCountry && matchesSearch;
  });

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const averageAmount = payments.length > 0 ? totalAmount / payments.length : 0;

  const platformStats = payments.reduce((acc, payment) => {
    if (payment.platform) {
      acc[payment.platform] = (acc[payment.platform] || 0) + payment.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const countryStats = payments.reduce((acc, payment) => {
    if (payment.country) {
      acc[payment.country] = (acc[payment.country] || 0) + payment.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                    {songTitle || 'Canción'} - {payments.length} pagos registrados
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
                      <select
                        value={filterPlatform}
                        onChange={(e) => setFilterPlatform(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                      >
                        <option value="">Todas las plataformas</option>
                        {Object.keys(platformStats).map(platform => (
                          <option key={platform} value={platform}>{platform}</option>
                        ))}
                      </select>
                      <select
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                      >
                        <option value="">Todos los países</option>
                        {Object.keys(countryStats).map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Statistics Summary */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Pagado</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {payments.length}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pagos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(averageAmount)}
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
                  ) : filteredPayments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay pagos registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {filteredPayments.map((payment) => (
                        <motion.div
                          key={payment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedPayment?.id === payment.id
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(payment.amount)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(payment.date)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              {payment.platform && (
                                <div className="flex items-center space-x-1">
                                  <Music className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-400">{payment.platform}</span>
                                </div>
                              )}
                              {payment.country && (
                                <div className="flex items-center space-x-1">
                                  <Globe className="w-3 h-3 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-400">{payment.country}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Payment Details */}
              <div className="w-1/2">
                {selectedPayment ? (
                  <div className="p-6 overflow-y-auto h-full">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Detalles del Pago
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID del Pago</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedPayment.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                          <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedPayment.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monto Total</p>
                          <p className="font-medium text-gray-900 dark:text-white text-lg">{formatCurrency(selectedPayment.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Cálculo</p>
                          <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedPayment.distribution.calculationDate)}</p>
                        </div>
                      </div>

                      {(selectedPayment.platform || selectedPayment.country) && (
                        <div className="flex space-x-4 mb-4">
                          {selectedPayment.platform && (
                            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                              <Music className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{selectedPayment.platform}</span>
                            </div>
                          )}
                          {selectedPayment.country && (
                            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                              <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium text-green-800 dark:text-green-300">{selectedPayment.country}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Distribution Details */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                        Distribución de Pagos
                      </h4>

                      {/* Owner */}
                      <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-medium text-indigo-900 dark:text-indigo-100">
                              {selectedPayment.distribution.owner.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                            {selectedPayment.distribution.owner.percentage}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
                            {formatCurrency(selectedPayment.distribution.owner.amount)}
                          </span>
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="space-y-3">
                        {selectedPayment.distribution.participants.map((participant, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {participant.name}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {participant.percentage}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                {participant.appliedConditions.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {participant.appliedConditions.map((condition, condIndex) => (
                                      <span key={condIndex} className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full">
                                        {condition}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                {formatCurrency(participant.amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Verification */}
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-green-800 dark:text-green-200">
                            Total Distribuido:
                          </span>
                          <span className="text-lg font-bold text-green-800 dark:text-green-200">
                            {formatCurrency(selectedPayment.distribution.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Selecciona un pago para ver los detalles</p>
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