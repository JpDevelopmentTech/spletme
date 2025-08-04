import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, FileText, User, AlertCircle, Loader2, Clock, CheckCircle } from 'lucide-react';
import { usePayments } from '../../hooks/usePayments';

interface PaymentHistoryProps {
  title?: string;
  showTitle?: boolean;
  maxHeight?: string;
  collaboratorId?: string;
  refreshTrigger?: number; // Para refrescar desde componente padre
}

const PaymentHistory = ({ 
  title = "Historial de Pagos", 
  showTitle = true,
  maxHeight = "400px",
  collaboratorId,
  refreshTrigger 
}: PaymentHistoryProps) => {
  const { payments, loading, error, loadPayments, getTotalAmount } = usePayments();

  useEffect(() => {
    loadPayments(collaboratorId);
  }, [collaboratorId, refreshTrigger, loadPayments]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    // Todos los pagos en la DB se consideran completados
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completado
      </span>
    );
  };



  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="ml-2 text-gray-600">Cargando historial de pagos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 w-full">
        <div className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="w-8 h-8 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 w-full"
    >
      {showTitle && (
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                {payments.length} pagos realizados • Total: {formatCurrency(getTotalAmount())}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxHeight }} className="overflow-y-auto">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <DollarSign className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay pagos registrados
            </h3>
            <p className="text-sm text-center max-w-sm">
              Los pagos que realices aparecerán aquí con todos los detalles.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          Pago a colaborador
                        </p>
                        {getStatusBadge()}
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-2">
                        ID: {payment.idCollaborator}
                      </p>
                      
                      {payment.description && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <FileText className="w-4 h-4 mr-1" />
                          {payment.description}
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      Procesado
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {payments.length > 0 && showTitle && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Mostrando {payments.length} pago{payments.length !== 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-gray-900">
              Total: {formatCurrency(getTotalAmount())}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentHistory; 