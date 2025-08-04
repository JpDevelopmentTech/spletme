import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CreditCard, AlertCircle, CheckCircle, Users, Clock, ArrowRight } from 'lucide-react';
import PaymentsService from '../../services/payments';

interface Collaborator {
  id?: string;
  name?: string;
  email?: string;
  percentage?: number;
  [key: string]: unknown;
}

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle?: string;
  totalAmount?: number;
  collaborators?: Collaborator[];
  onPaymentSuccess?: () => void;
}

const StripePaymentModal = ({ 
  isOpen, 
  onClose, 
  songTitle, 
  totalAmount = 0,
  collaborators = [],
  onPaymentSuccess 
}: StripePaymentModalProps) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [amount, setAmount] = useState<number>(totalAmount);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setStep('confirm');
      setAmount(totalAmount);
      setDescription('');
      setErrors({});
    }
  }, [isOpen, totalAmount]);

  const handlePayment = async () => {
    setErrors({});
    
    // Validaciones
    if (amount <= 0) {
      setErrors({ amount: 'El monto debe ser mayor a 0' });
      return;
    }

    if (collaborators.length === 0) {
      setErrors({ general: 'No hay colaboradores para procesar el pago' });
      return;
    }

    setStep('processing');
    
    try {
      // Procesar pagos para todos los colaboradores
      const paymentPromises = collaborators.map(async (collaborator) => {
        if (collaborator.id) {
          const collaboratorAmount = (amount * (collaborator.percentage || 0)) / 100;
          return await PaymentsService.createPayment(
            collaborator.id, 
            collaboratorAmount, 
            description || `Pago por ${songTitle}`
          );
        }
        return null;
      });

      const results = await Promise.all(paymentPromises);
      const hasErrors = results.some(result => result && result.error);
      
      if (hasErrors) {
        setErrors({ general: 'Error al procesar algunos pagos. Por favor intenta de nuevo.' });
        setStep('confirm');
        return;
      }

      setStep('success');
      
      // Auto-cerrar después del éxito
      setTimeout(() => {
        onPaymentSuccess?.();
        handleClose();
      }, 3000);

    } catch (error) {
      setErrors({ general: 'Error al procesar el pago. Por favor intenta de nuevo.' });
      setStep('confirm');
    }
    
  };

  const handleClose = () => {
    setStep('confirm');
    setAmount(totalAmount);
    setDescription('');
    setErrors({});
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const renderConfirmStep = () => (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
            Resumen del Pago
          </h3>
          <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
            <Users className="w-4 h-4 mr-1" />
            {collaborators.length} colaboradores
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Canción</p>
            <p className="font-medium text-gray-900 dark:text-white">{songTitle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monto Total</p>
            <p className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">
              {formatCurrency(amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Monto a Distribuir *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount || ''}
            onChange={(e) => {
              setAmount(parseFloat(e.target.value) || 0);
              if (errors.amount) {
                setErrors(prev => ({ ...prev, amount: '' }));
              }
            }}
            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.amount 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
            } dark:text-white`}
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.amount}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Descripción (Opcional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:text-white"
          placeholder="Ej: Regalías de Spotify - Enero 2024"
          rows={3}
        />
      </div>

      {/* Collaborators Preview */}
      {collaborators.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Colaboradores ({collaborators.length})
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            {collaborators.slice(0, 3).map((collaborator: Collaborator, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {collaborator.name || collaborator.email || `Colaborador ${index + 1}`}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {collaborator.percentage || 0}%

                </span>
              </div>
            ))}
            {collaborators.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                +{collaborators.length - 3} colaboradores más...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error General */}
      {errors.general && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.general}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handlePayment}
          disabled={amount <= 0}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3 rounded-lg transition-all hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>Procesar Pago</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center space-y-6 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mx-auto w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
      />
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Procesando Pago
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Distribuyendo {formatCurrency(amount)} entre {collaborators.length} colaboradores...
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 text-blue-800 dark:text-blue-300">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Procesando con Stripe Connect</span>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
          Los pagos aparecerán en las cuentas de los colaboradores en 1-3 días hábiles
        </p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ¡Pago Procesado Exitosamente!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Se ha distribuido {formatCurrency(amount)} entre {collaborators.length} colaboradores
        </p>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">ID de Transacción:</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">
              STR_{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
            <span className="text-green-600 dark:text-green-400 font-medium">Completado</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tiempo de procesamiento:</span>
            <span className="text-gray-900 dark:text-white">2.3 segundos</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-gray-500 dark:text-gray-400"
      >
        Cerrando automáticamente...
      </motion.div>
    </div>
  );

  const getModalTitle = () => {
    switch (step) {
      case 'confirm':
        return 'Procesar Pago con Stripe';
      case 'processing':
        return 'Procesando Pago';
      case 'success':
        return 'Pago Completado';
      default:
        return 'Pago';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={step === 'confirm' ? handleClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreditCard className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getModalTitle()}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stripe Connect • {songTitle}
                  </p>
                </div>
              </div>
              {step === 'confirm' && (
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              {step === 'confirm' && renderConfirmStep()}
              {step === 'processing' && renderProcessingStep()}
              {step === 'success' && renderSuccessStep()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StripePaymentModal; 