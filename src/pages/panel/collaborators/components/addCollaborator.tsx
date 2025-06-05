import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, UserPlus, Mail, Hash, UserCog } from "lucide-react";

export default function AddCollaborator() {
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [method, setMethod] = useState<'email' | 'code'>('email');

  return (
    <>
      <AnimatePresence>
        {showCollaboratorsModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCollaboratorsModal(false)}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-50 to-indigo-100">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 rounded-lg bg-indigo-100"
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800">Añadir colaborador</h3>
                </div>
                <motion.button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCollaboratorsModal(false)}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Elige cómo quieres agregar al colaborador al proyecto.
                  </p>
                  
                  <div className="flex gap-4 mb-6">
                    <motion.button
                      className={`flex-1 py-2.5 px-4 rounded-lg border transition-all ${
                        method === 'email' 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setMethod('email')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>Por correo</span>
                      </div>
                    </motion.button>
                    <motion.button
                      className={`flex-1 py-2.5 px-4 rounded-lg border transition-all ${
                        method === 'code' 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setMethod('code')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Hash className="w-4 h-4" />
                        <span>Por código</span>
                      </div>
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {method === 'email' ? (
                      <>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Código de usuario"
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        />
                      </div>
                    )}
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCog className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="" disabled selected>Seleccionar rol</option>
                      <option value="singer">Cantante</option>
                      <option value="composer">Compositor</option>
                      <option value="musician">Músico</option>
                      <option value="producer">Productor</option>
                      <option value="arranger">Arreglista</option>
                      <option value="lyricist">Letrista</option>
                      <option value="mixer">Mezclador</option>
                      <option value="mastering">Mastering</option>
                    </select>

                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <motion.button
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCollaboratorsModal(false)}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlus className="w-4 h-4" />
                  Añadir colaborador
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="border border-gray-200 rounded-xl p-5 flex items-center justify-center gap-4 bg-white hover:shadow-lg transition-all w-full group col-span-3 row-span-1"
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ y: 0, scale: 0.99 }}
        onClick={() => setShowCollaboratorsModal(true)}
      >
        <motion.div 
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
        <div className="flex flex-col items-start">
          <span className="font-semibold text-gray-800 text-lg">Agregar</span>
          <span className="text-sm text-gray-600">Nuevo colaborador</span>
        </div>
      </motion.button>
    </>
  );
}
