import { motion } from "framer-motion";
import { TrendingUp, Wallet, PieChart } from "lucide-react";

const Balance = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-indigo-900">Balance</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Wallet className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Balance Total</h3>
              <p className="text-2xl font-bold text-indigo-600">$0.00</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Balance del Mes</h3>
              <p className="text-2xl font-bold text-green-600">$0.00</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <PieChart className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Distribución</h3>
              <p className="text-2xl font-bold text-purple-600">0%</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Resumen Mensual</h2>
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4">
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Tendencias</h2>
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4">
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Balance; 