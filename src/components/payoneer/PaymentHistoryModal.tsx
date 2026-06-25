import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { usePayoneer } from "../../hooks/usePayoneer";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ isOpen, onClose }) => {
  const { paymentHistory, loading } = usePayoneer();
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  const filteredHistory = paymentHistory.filter((payment) => {
    if (filter === "all") return true;
    return payment.type === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "sent" ? ArrowUpRight : ArrowDownLeft;
  };

  const getTypeColor = (type: string) => {
    return type === "sent" ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100";
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
            className="relative max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <History className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Historial de Pagos</h2>
                  <p className="text-sm text-gray-600">Todas tus transacciones de Payoneer</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Filters */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter("sent")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === "sent"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Enviados
                </button>
                <button
                  onClick={() => setFilter("received")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === "received"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
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
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <History className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No hay transacciones</h3>
                  <p className="text-gray-600">
                    {filter === "all"
                      ? "Aún no tienes transacciones en tu historial"
                      : `No tienes pagos ${filter === "sent" ? "enviados" : "recibidos"}`}
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
                        className="rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`h-10 w-10 ${typeClasses} flex items-center justify-center rounded-lg`}
                            >
                              <TypeIcon className="h-5 w-5" />
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">
                                  ${payment.amount.toFixed(2)} {payment.currency}
                                </h4>
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses}`}
                                >
                                  <StatusIcon className="mr-1 inline h-3 w-3" />
                                  {payment.status}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{payment.description}</p>
                              <div className="mt-2 flex items-center space-x-4">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <span>ID: {payment.payoneerTransactionId}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                payment.type === "received" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {payment.type === "received" ? "+" : "-"}${payment.amount.toFixed(2)}
                            </p>
                            <p className="mt-1 text-xs capitalize text-gray-500">
                              {payment.type === "sent" ? "Enviado" : "Recibido"}
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
                      $
                      {filteredHistory
                        .filter((p) => p.type === "sent" && p.status === "completed")
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recibido</p>
                    <p className="text-lg font-semibold text-green-600">
                      $
                      {filteredHistory
                        .filter((p) => p.type === "received" && p.status === "completed")
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
