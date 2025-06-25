import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { usePayoneer } from '../../hooks/usePayoneer';

interface RequestPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RequestPaymentModal: React.FC<RequestPaymentModalProps> = ({ isOpen, onClose }) => {
    const { requestPayment, findUser, loading, error, clearError } = usePayoneer();
    const [step, setStep] = useState<'find-user' | 'request-details' | 'success'>('find-user');
    
    // Form states
    const [email, setEmail] = useState('');
    const [foundUser, setFoundUser] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [requestResult, setRequestResult] = useState<any>(null);

    const handleFindUser = async () => {
        clearError();
        try {
            const user = await findUser(email);
            if (user) {
                setFoundUser(user);
                setStep('request-details');
            }
        } catch (error) {
            console.error('User not found:', error);
        }
    };

    const handleRequestPayment = async () => {
        clearError();
        try {
            const result = await requestPayment(email, parseFloat(amount), currency, description, dueDate);
            setRequestResult(result);
            setStep('success');
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    const resetModal = () => {
        setStep('find-user');
        setEmail('');
        setFoundUser(null);
        setAmount('');
        setDescription('');
        setDueDate('');
        setRequestResult(null);
        clearError();
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    // Get tomorrow's date as minimum date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const renderStep = () => {
        switch (step) {
            case 'find-user':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Buscar Usuario
                            </h3>
                            <p className="text-sm text-gray-600">
                                Ingresa el email de Payoneer del usuario al que le vas a solicitar dinero
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email de Payoneer
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="usuario@ejemplo.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <button
                                onClick={handleFindUser}
                                disabled={!email || loading}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Buscando...' : 'Buscar Usuario'}
                            </button>
                        </div>
                    </div>
                );

            case 'request-details':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Usuario Encontrado
                            </h3>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="font-medium text-gray-900">{foundUser?.name}</p>
                                <p className="text-sm text-gray-600">{email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cantidad
                                    </label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        min="0.01"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Moneda
                                    </label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha límite (opcional)
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    min={minDate}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Concepto de la solicitud..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setStep('find-user')}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Atrás
                                </button>
                                <button
                                    onClick={handleRequestPayment}
                                    disabled={!amount || !description || loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    <DollarSign className="w-4 h-4" />
                                    <span>{loading ? 'Enviando...' : 'Solicitar Pago'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'success':
                return (
                    <div className="space-y-6 text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                ¡Solicitud Enviada!
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Tu solicitud de pago ha sido enviada a {foundUser?.name}
                            </p>
                            
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Cantidad:</span>
                                    <span className="font-medium">{amount} {currency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Para:</span>
                                    <span className="font-medium">{foundUser?.name}</span>
                                </div>
                                {dueDate && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Fecha límite:</span>
                                        <span className="font-medium">{new Date(dueDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">ID de Solicitud:</span>
                                    <span className="font-mono text-xs">{requestResult?.id}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    El usuario recibirá una notificación por email y podrá aprobar o rechazar tu solicitud.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Finalizar
                        </button>
                    </div>
                );

            default:
                return null;
        }
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
                        onClick={handleClose}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white rounded-xl shadow-xl w-full max-w-md"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Solicitar Pago
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {renderStep()}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RequestPaymentModal; 