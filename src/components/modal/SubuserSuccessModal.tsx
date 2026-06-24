import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Users, ShieldCheck, Eye, Key } from "lucide-react";

interface SubuserSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INFO_ITEMS = [
  {
    icon: <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
    title: "Extensión de tu cuenta",
    desc: "El subusuario comparte tu cuenta principal y puede acceder a la plataforma con sus propias credenciales.",
  },
  {
    icon: <Eye className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
    title: "Acceso a tu catálogo",
    desc: "Puede ver y gestionar las canciones, álbumes y splits a los que le des acceso como titular de la cuenta.",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
    title: "Sin acceso a datos sensibles",
    desc: "Los subusuarios no pueden ver tu información financiera privada ni modificar la configuración de tu cuenta.",
  },
  {
    icon: <Key className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
    title: "Credenciales independientes",
    desc: "Cada subusuario tiene su propio correo y contraseña para iniciar sesión, manteniendo la seguridad de tu cuenta.",
  },
];

export function SubuserSuccessModal({ isOpen, onClose }: SubuserSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header verde de éxito */}
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 px-6 pt-7 pb-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold mb-1"
              >
                ¡Subusuario creado!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-white/80"
              >
                El subusuario ya forma parte de tu cuenta en SplitMe.
              </motion.p>
            </div>

            {/* Cuerpo — explicación */}
            <div className="px-6 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                ¿Cómo funcionan los subusuarios?
              </p>

              <div className="flex flex-col gap-4">
                {INFO_ITEMS.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">{item.title}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
