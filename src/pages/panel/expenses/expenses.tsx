import { motion } from "framer-motion";
import { ArrowDownRight, Plus, Receipt } from "lucide-react";

const Expenses = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-indigo-900">Gastos</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo Gasto
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Receipt className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Gastos Totales</h3>
              <p className="text-2xl font-bold text-indigo-600">$0.00</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowDownRight className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Gastos del Mes</h3>
              <p className="text-2xl font-bold text-red-600">$0.00</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-indigo-900 mb-4">Historial de Gastos</h2>
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4">
          <p className="text-gray-500 text-center py-8">No hay gastos registrados</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Expenses; 