import { useState } from "react";
import { motion } from "framer-motion";

interface ProfessionStepProps {
  nextStep: () => void;
}

const ProfessionStep = ({ nextStep }: ProfessionStepProps) => {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedOtherProfession, setSelectedOtherProfession] = useState("");

  const professions = [
    {
      id: "artista",
      name: "Artista",
      icon: "🎤",
      description: "Cantante, músico o intérprete",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: "productor",
      name: "Productor",
      icon: "🎛️",
      description: "Productor musical o de audio",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "compositor",
      name: "Compositor",
      icon: "🎼",
      description: "Compositor o escritor de canciones",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      id: "otro",
      name: "Otro",
      icon: "🎯",
      description: "Otra profesión musical",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const otherProfessionList = [
    "Ingeniero de sonido",
    "Diseñador de sonido",
    "Diseñador de audio",
    "Ingeniero de mezcla",
    "Ingeniero de masterización",
    "Ingeniero de grabación",
    "Manager musical",
    "Promotor de eventos",
    "DJ",
    "Locutor",
    "Podcaster"
  ];

  const handleProfessionSelect = (professionId: string) => {
    setSelectedProfession(professionId);
    if (professionId !== "otro") {
      setSelectedOtherProfession("");
    }
  };

  const handleSubmit = () => {
    if (selectedProfession && (selectedProfession !== "otro" || selectedOtherProfession)) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      {/* Selección de profesión principal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {professions.map((profession, index) => (
          <motion.div
            key={profession.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="radio"
              id={profession.id}
              name="profession"
              value={profession.id}
              className="hidden peer"
              onChange={() => handleProfessionSelect(profession.id)}
              checked={selectedProfession === profession.id}
            />
            <label
              htmlFor={profession.id}
              className={`block p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedProfession === profession.id
                  ? `border-transparent bg-gradient-to-r ${profession.gradient} text-white shadow-lg`
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="text-3xl">{profession.icon}</div>
                <div>
                  <h3 className={`font-semibold text-lg ${
                    selectedProfession === profession.id 
                      ? "text-white" 
                      : "text-gray-900 dark:text-white"
                  }`}>
                    {profession.name}
                  </h3>
                  <p className={`text-sm ${
                    selectedProfession === profession.id 
                      ? "text-white/80" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {profession.description}
                  </p>
                </div>
              </div>
            </label>
          </motion.div>
        ))}
      </div>

      {/* Selección específica para "Otro" */}
      {selectedProfession === "otro" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              ¿Cuál es tu profesión específica?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Selecciona la opción que mejor te describa
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {otherProfessionList.map((profession, index) => (
              <motion.div
                key={profession}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  id={profession}
                  name="otherProfession"
                  value={profession}
                  className="hidden peer"
                  onChange={(e) => setSelectedOtherProfession(e.target.value)}
                  checked={selectedOtherProfession === profession}
                />
                <label
                  htmlFor={profession}
                  className={`block p-3 rounded-lg border cursor-pointer transition-all duration-200 text-sm ${
                    selectedOtherProfession === profession
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-400"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="text-center font-medium">
                    {profession}
                  </div>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Botón de continuar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-6"
      >
        <button
          onClick={handleSubmit}
          disabled={!selectedProfession || (selectedProfession === "otro" && !selectedOtherProfession)}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            selectedProfession && (selectedProfession !== "otro" || selectedOtherProfession)
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>Continuar</span>
            <motion.div
              animate={{ x: selectedProfession ? [0, 5, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.div>
          </div>
        </button>
      </motion.div>
    </div>
  );
};

export default ProfessionStep; 