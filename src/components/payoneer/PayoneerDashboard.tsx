import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    CreditCard, 
    Send, 
    ArrowDownToLine, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    Plus,
    History,
    Users,
    DollarSign
} from 'lucide-react';
import { usePayoneer } from '../../hooks/usePayoneer';
import SendPaymentModal from './SendPaymentModal';
import RequestPaymentModal from './RequestPaymentModal';
import PaymentHistoryModal from './PaymentHistoryModal';
import LinkAccountModal from './LinkAccountModal';

const PayoneerDashboard: React.FC = () => {
    const { 
        account, 
        balance, 
        pendingRequests, 
        isLinked, 
        isVerified, 
        totalBalance,
        loading,
        approveRequest,
        declineRequest
    } = usePayoneer();

    const [sendModalOpen, setSendModalOpen] = useState(false);
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [linkModalOpen, setLinkModalOpen] = useState(false);

    const statusConfig = {
        pending: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
        approved: { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
        declined: { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle }
    };

    const handleApproveRequest = async (requestId: string) => {
        try {
            await approveRequest(requestId);
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const handleDeclineRequest = async (requestId: string) => {
        try {
            await declineRequest(requestId);
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    if (!isLinked) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                        <CreditCard className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Conecta tu cuenta de Payoneer
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Para enviar y recibir pagos, necesitas vincular tu cuenta de Payoneer
                    </p>
                    <button
                        onClick={() => setLinkModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Vincular Cuenta
                    </button>
                </div>
                
                <LinkAccountModal 
                    isOpen={linkModalOpen}
                    onClose={() => setLinkModalOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard Payoneer</h2>
                        <p className="text-gray-600">Gestiona tus pagos y transacciones</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {isVerified ? 'Verificado' : 'Pendiente verificación'}
                        </div>
                    </div>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {balance.map((bal, index) => (
                        <motion.div
                            key={bal.currency}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-100 text-sm">Balance {bal.currency}</p>
                                    <p className="text-2xl font-bold">${bal.amount.toFixed(2)}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-indigo-200" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSendModalOpen(true)}
                    className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 hover:border-indigo-300 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Send className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-900">Enviar Pago</h3>
                            <p className="text-sm text-gray-600">Envía dinero a otros usuarios</p>
                        </div>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRequestModalOpen(true)}
                    className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 hover:border-indigo-300 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ArrowDownToLine className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-900">Solicitar Pago</h3>
                            <p className="text-sm text-gray-600">Pide dinero a otros usuarios</p>
                        </div>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setHistoryModalOpen(true)}
                    className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 hover:border-indigo-300 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <History className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-gray-900">Historial</h3>
                            <p className="text-sm text-gray-600">Ver todas las transacciones</p>
                        </div>
                    </div>
                </motion.button>
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Solicitudes Pendientes ({pendingRequests.length})
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {pendingRequests.slice(0, 3).map((request) => {
                            const StatusIcon = statusConfig[request.status as keyof typeof statusConfig]?.icon || Clock;
                            const statusStyle = statusConfig[request.status as keyof typeof statusConfig];

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 ${statusStyle?.bg} rounded-lg flex items-center justify-center`}>
                                            <StatusIcon className={`w-5 h-5 ${statusStyle?.color}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                ${request.amount} {request.currency}
                                            </p>
                                            <p className="text-sm text-gray-600">{request.description}</p>
                                        </div>
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDeclineRequest(request.id)}
                                                disabled={loading}
                                                className="px-3 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
                                            >
                                                Rechazar
                                            </button>
                                            <button
                                                onClick={() => handleApproveRequest(request.id)}
                                                disabled={loading}
                                                className="px-3 py-1 text-xs text-green-600 border border-green-300 rounded hover:bg-green-50 disabled:opacity-50"
                                            >
                                                Aprobar
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modals */}
            <SendPaymentModal 
                isOpen={sendModalOpen}
                onClose={() => setSendModalOpen(false)}
            />
            
            <RequestPaymentModal 
                isOpen={requestModalOpen}
                onClose={() => setRequestModalOpen(false)}
            />
            
            <PaymentHistoryModal 
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
            />
        </div>
    );
};

export default PayoneerDashboard; 