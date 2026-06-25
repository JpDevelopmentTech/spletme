import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ProfileSuccessPopupProps {
  isOpen: boolean;
}

export function ProfileSuccessPopup({ isOpen }: ProfileSuccessPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,   scale: 1     }}
          exit={{   opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl"
          style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", minWidth: 280 }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(34,197,94,0.15)" }}>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white">¡Perfil actualizado!</p>
            <p className="text-[12px] text-[#94A3B8]">Los cambios se guardaron correctamente.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
