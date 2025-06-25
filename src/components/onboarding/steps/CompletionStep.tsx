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
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full shadow-2xl">
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
        className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
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
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span>Perfil completo</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span>Distribuidor conectado</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span>WhatsApp verificado</span>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="pt-6"
      >
        <Link
          to="/panel/home"
          className="inline-flex items-center justify-center w-full py-4 px-8 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <span>Ir al Dashboard</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🚀
            </motion.div>
          </div>
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
          <button className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200">
            Ver tutorial
          </button>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <button className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200">
            Contactar soporte
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CompletionStep; 