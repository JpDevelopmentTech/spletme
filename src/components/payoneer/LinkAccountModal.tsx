import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Mail, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { usePayoneer } from '../../hooks/usePayoneer';

interface LinkAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LinkAccountModal: React.FC<LinkAccountModalProps> = ({ isOpen, onClose }) => {
    const { linkAccount, loading, error, clearError } = usePayoneer();
    const [step, setStep] = useState<'form' | 'success'>('form');
    
    // Form states
    const [payoneerEmail, setPayoneerEmail] = useState('');
    const [payoneerAccountId, setPayoneerAccountId] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleLinkAccount = async () => {
        clearError();
        
        if (!acceptTerms) {
            return;
        }

        try {
            await linkAccount(payoneerEmail, payoneerAccountId || undefined);
            setStep('success');
        } catch (error) {
            console.error('Error linking account:', error);
        }
    };

    const resetModal = () => {
        setStep('form');
        setPayoneerEmail('');
        setPayoneerAccountId('');
        setAcceptTerms(false);
        clearError();
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const renderStep = () => {
        switch (step) {
            case 'form':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <CreditCard className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Vincular Cuenta de Payoneer
                            </h3>
                            <p className="text-sm text-gray-600">
                                Conecta tu cuenta de Payoneer para enviar y recibir pagos de forma gratuita
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email de Payoneer *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={payoneerEmail}
                                        onChange={(e) => setPayoneerEmail(e.target.value)}
                                        placeholder="tu-email@payoneer.com"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Usa el mismo email que tienes registrado en tu cuenta de Payoneer
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID de Cuenta Payoneer (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={payoneerAccountId}
                                    onChange={(e) => setPayoneerAccountId(e.target.value)}
                                    placeholder="123456789"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Puedes encontrar este ID en tu cuenta de Payoneer
                                </p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-blue-800">
                                            ¿Cómo funciona?
                                        </h4>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Vinculamos tu cuenta de forma segura</li>
                                                <li>Verificamos tu identidad con Payoneer</li>
                                                <li>Una vez verificado, podrás enviar y recibir pagos</li>
                                                <li>Las transferencias entre usuarios son gratuitas</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                                    Acepto los{' '}
                                    <button 
                                        type="button"
                                        className="text-indigo-600 hover:text-indigo-500 underline"
                                        onClick={() => window.open('https://www.payoneer.com/legal/terms-conditions/', '_blank')}
                                    >
                                        términos y condiciones
                                    </button>
                                    {' '}de Payoneer y autorizo la vinculación de mi cuenta
                                </label>
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <button
                                onClick={handleLinkAccount}
                                disabled={!payoneerEmail || !acceptTerms || loading}
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <LinkIcon className="w-4 h-4" />
                                <span>{loading ? 'Vinculando...' : 'Vincular Cuenta'}</span>
                            </button>
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
                                ¡Cuenta Vinculada!
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Tu cuenta de Payoneer ha sido vinculada exitosamente
                            </p>
                            
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Email:</span>
                                    <span className="font-medium">{payoneerEmail}</span>
                                </div>
                                {payoneerAccountId && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">ID de Cuenta:</span>
                                        <span className="font-medium">{payoneerAccountId}</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Próximos pasos:</strong> Payoneer verificará tu cuenta. 
                                    Recibirás un email cuando el proceso esté completo.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Continuar
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
                                Vincular Payoneer
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

export default LinkAccountModal; 