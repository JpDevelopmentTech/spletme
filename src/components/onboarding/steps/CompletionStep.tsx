import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CompletionStep = () => {
  const confettiVariants = {
    initial: { opacity: 0, y: -20, rotate: 0 },
    animate: {
      opacity: [0, 1, 1, 0],
      y: [0, -10, 100],
      rotate: [0, 180, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1,
      }
    }
  };

  const checkmarkVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.8, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    }
  };

  return (
    <div className="text-center space-y-8 relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 20}%`,
            }}
            variants={confettiVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: Math.random() * 2 }}
          >
            {["🎉", "🎊", "✨", "🌟", "🎈"][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 10,
          delay: 0.2 
        }}
        className="relative"
      >
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-2xl">
          <motion.svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
            initial="initial"
            animate="animate"
          >
            <motion.path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkmarkVariants}
            />
          </motion.svg>
        </div>
        
        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-green-400"
          animate={{
            scale: [1, 1.2, 1.4],
            opacity: [0.8, 0.4, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-green-400"
          animate={{
            scale: [1, 1.1, 1.3],
            opacity: [0.6, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.5
          }}
        />
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          ¡Cuenta verificada exitosamente!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Tu perfil ha sido configurado correctamente. Ya puedes comenzar a gestionar 
          tus regalías musicales.
        </p>
      </motion.div>

      {/* Features Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
      >
        {[
          {
            icon: "📊",
            title: "Analytics",
            description: "Monitorea tus ingresos en tiempo real"
          },
          {
            icon: "💰",
            title: "Regalías",
            description: "Gestiona y divide tus ganancias"
          },
          {
            icon: "🎵",
            title: "Catálogo",
            description: "Sincroniza tu música automáticamente"
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-2xl mb-2">{feature.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="text-2xl">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            ¡Bienvenido a SplitMe!
          </h3>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Estás listo para comenzar. Tu cuenta está completamente configurada y 
          sincronizada con tu distribuidor musical.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Perfil completo</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Distribuidor conectado</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>WhatsApp verificado</span>
          </div>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="pt-4"
      >
        <Link
          to="/panel/home"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 space-x-3"
        >
          <span>Ir a mi panel</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            🚀
          </motion.div>
        </Link>
      </motion.div>

      {/* Additional Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          ¿Necesitas ayuda para comenzar?
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
            Ver tutorial
          </button>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
            Contactar soporte
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CompletionStep; 