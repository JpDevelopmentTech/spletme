import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, ArrowUpRight, ArrowDownLeft, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { usePayoneer } from '../../hooks/usePayoneer';

interface PaymentHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ isOpen, onClose }) => {
    const { paymentHistory, loading } = usePayoneer();
    const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

    const filteredHistory = paymentHistory.filter(payment => {
        if (filter === 'all') return true;
        return payment.type === filter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return CheckCircle;
            case 'pending':
                return Clock;
            case 'failed':
            case 'cancelled':
                return XCircle;
            default:
                return Clock;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'failed':
            case 'cancelled':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeIcon = (type: string) => {
        return type === 'sent' ? ArrowUpRight : ArrowDownLeft;
    };

    const getTypeColor = (type: string) => {
        return type === 'sent' ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <History className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Historial de Pagos
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Todas tus transacciones de Payoneer
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'all' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Todos
                                </button>
                                <button
                                    onClick={() => setFilter('sent')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'sent' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Enviados
                                </button>
                                <button
                                    onClick={() => setFilter('received')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'received' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Recibidos
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : filteredHistory.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <History className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No hay transacciones
                                    </h3>
                                    <p className="text-gray-600">
                                        {filter === 'all' 
                                            ? 'Aún no tienes transacciones en tu historial'
                                            : `No tienes pagos ${filter === 'sent' ? 'enviados' : 'recibidos'}`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredHistory.map((payment, index) => {
                                        const StatusIcon = getStatusIcon(payment.status);
                                        const TypeIcon = getTypeIcon(payment.type);
                                        const statusClasses = getStatusColor(payment.status);
                                        const typeClasses = getTypeColor(payment.type);

                                        return (
                                            <motion.div
                                                key={payment.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`w-10 h-10 ${typeClasses} rounded-lg flex items-center justify-center`}>
                                                            <TypeIcon className="w-5 h-5" />
                                                        </div>
                                                        
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="font-medium text-gray-900">
                                                                    ${payment.amount.toFixed(2)} {payment.currency}
                                                                </h4>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses}`}>
                                                                    <StatusIcon className="w-3 h-3 inline mr-1" />
                                                                    {payment.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {payment.description}
                                                            </p>
                                                            <div className="flex items-center space-x-4 mt-2">
                                                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                                    <span>ID: {payment.payoneerTransactionId}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className={`font-semibold ${
                                                            payment.type === 'received' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {payment.type === 'received' ? '+' : '-'}${payment.amount.toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 capitalize">
                                                            {payment.type === 'sent' ? 'Enviado' : 'Recibido'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        {filteredHistory.length > 0 && (
                            <div className="border-t border-gray-200 p-6">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Transacciones</p>
                                        <p className="text-lg font-semibold text-gray-900">{filteredHistory.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Enviado</p>
                                        <p className="text-lg font-semibold text-red-600">
                                            ${filteredHistory
                                                .filter(p => p.type === 'sent' && p.status === 'completed')
                                                .reduce((sum, p) => sum + p.amount, 0)
                                                .toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Recibido</p>
                                        <p className="text-lg font-semibold text-green-600">
                                            ${filteredHistory
                                                .filter(p => p.type === 'received' && p.status === 'completed')
                                                .reduce((sum, p) => sum + p.amount, 0)
                                                .toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaymentHistoryModal; 