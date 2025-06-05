import { motion } from "framer-motion";
import { TrendingUp, Wallet, PieChart, Plus, Minus, Filter } from "lucide-react";
import { useState } from "react";
import UseFilterSongsData from "../../../hooks/useFilterSongsData";

const Balance = () => {

  const { summary, country, setCountry, platform, setPlatform, startDate, setStartDate, endDate, setEndDate } = UseFilterSongsData();
  
 

  const handleClearFilters = () => {
    setCountry("");
    setPlatform("");
    setStartDate("");
    setEndDate("");
  };

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

      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-8">
        <form  className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-indigo-600" size={20} />
            <h2 className="text-lg font-medium text-indigo-900">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                Plataforma
              </label>
              <select
                id="platform"
                name="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todas</option>
                <option value="spotify">Spotify</option>
                <option value="youtube">YouTube</option>
                <option value="apple">Apple Music</option>
              </select>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos</option>
                <option value="mx">México</option>
                <option value="us">Estados Unidos</option>
                <option value="es">España</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
       
          <motion.button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Limpiar filtros
          </motion.button>
          </div>
        </form>
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
              <h3 className="text-lg font-medium text-indigo-900">Streams</h3>
              <p className="text-2xl font-bold text-indigo-600">{summary.totalStreams}</p>
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
              <h3 className="text-lg font-medium text-indigo-900">Ingresos</h3>
              <p className="text-2xl font-bold text-green-600">${summary.totalNetIncome?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Egresos</h3>
              <p className="text-2xl font-bold text-red-600">$0.00</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de Movimientos Payoneer */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-indigo-900 mb-6">Movimientos Payoneer</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos Payoneer */}
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-indigo-900">Ingresos</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  +$2,500.00
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pago Spotify</p>
                      <p className="text-sm text-gray-500">15 Mar 2024</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+$1,200.00</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pago YouTube</p>
                      <p className="text-sm text-gray-500">10 Mar 2024</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+$1,300.00</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Colaboración - Artista A</p>
                      <p className="text-sm text-gray-500">8 Mar 2024</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+$800.00</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Licencia de Música - Usuario B</p>
                      <p className="text-sm text-gray-500">5 Mar 2024</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+$450.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Egresos Payoneer */}
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-indigo-900">Egresos</h3>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  -$1,200.00
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingUp className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Comisión Payoneer</p>
                      <p className="text-sm text-gray-500">15 Mar 2024</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-medium">-$200.00</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingUp className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Transferencia a Banco</p>
                      <p className="text-sm text-gray-500">12 Mar 2024</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-medium">-$300.00</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingUp className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pago a Productor - Usuario C</p>
                      <p className="text-sm text-gray-500">10 Mar 2024</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-medium">-$400.00</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingUp className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pago a Colaborador - Usuario D</p>
                      <p className="text-sm text-gray-500">8 Mar 2024</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-medium">-$300.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aquí irían los modales para agregar ingresos y gastos */}
    </motion.div>
  );
};

export default Balance; 