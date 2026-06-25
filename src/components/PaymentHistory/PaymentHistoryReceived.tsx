import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle,
  ArrowDownLeft,
} from "lucide-react";
import { usePayments } from "../../hooks/usePayments";
import { useSelector } from "react-redux";

interface AuthState {
  auth: {
    isAuth: string;
    user: {
      _id?: string;
      id?: string;
      [key: string]: unknown;
    };
  };
}

interface PaymentHistoryReceivedProps {
  title?: string;
  showTitle?: boolean;
  maxHeight?: string;
  refreshTrigger?: number;
}

const PaymentHistoryReceived = ({
  title = "Pagos Recibidos",
  showTitle = true,
  maxHeight = "400px",
  refreshTrigger,
}: PaymentHistoryReceivedProps) => {
  const { payments, loading, error, loadPayments, getTotalAmount } = usePayments();

  // Obtener el usuario actual del store de Redux
  const user = useSelector((state: AuthState) => state.auth.user);
  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    if (currentUserId) {
      // Cargar pagos donde el usuario actual es el colaborador que recibe el pago
      loadPayments(currentUserId);
    }
  }, [currentUserId, refreshTrigger, loadPayments]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        Recibido
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Cargando pagos recibidos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="mr-2 h-8 w-8" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="w-full rounded-xl border border-yellow-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center py-8 text-yellow-600">
          <AlertCircle className="mr-2 h-8 w-8" />
          <span>No se pudo obtener la información del usuario</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      {showTitle && (
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <ArrowDownLeft className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                {payments.length} pagos recibidos • Total: {formatCurrency(getTotalAmount())}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxHeight }} className="overflow-y-auto">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <ArrowDownLeft className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No has recibido pagos</h3>
            <p className="max-w-sm text-center text-sm">
              Los pagos que recibas como colaborador aparecerán aquí.
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
                className="p-6 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">Pago recibido</p>
                        {getStatusBadge()}
                      </div>

                      <p className="mb-2 text-xs text-gray-500">De usuario: {payment.owner}</p>

                      {payment.description && (
                        <div className="mb-2 flex items-center text-sm text-gray-600">
                          <FileText className="mr-1 h-4 w-4" />
                          {payment.description}
                        </div>
                      )}

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-green-600">
                      +{formatCurrency(payment.amount)}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      Recibido
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {payments.length > 0 && showTitle && (
        <div className="rounded-b-xl border-t border-gray-200 bg-green-50 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Mostrando {payments.length} pago{payments.length !== 1 ? "s" : ""} recibido
              {payments.length !== 1 ? "s" : ""}
            </span>
            <span className="font-semibold text-green-600">
              Total recibido: {formatCurrency(getTotalAmount())}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentHistoryReceived;
