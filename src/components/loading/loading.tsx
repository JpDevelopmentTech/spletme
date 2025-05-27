import { Loader2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
const Loading = () => {
    return (
        <div className=" absolute top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
            >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-quinary"
                >
                    <Circle className="w-12 h-12" />
                </motion.div>
                <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Loader2 className="w-6 h-6 text-gray-600" />
                </motion.div>
            </motion.div>
            <motion.p 
                className="mt-4 text-sm font-medium text-gray-600 tracking-wider"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Cargando...
            </motion.p>
        </div>
    );
}

export default Loading;
