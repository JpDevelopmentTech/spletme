import AddDealer from "../../../../components/adddealer/addleader";
import { FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NavBar() {
  const navigateToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <motion.button
          variants={cardVariants}
          whileHover="hover"
          className="col-span-3 group relative overflow-hidden flex flex-col p-6 shadow-xl bg-gradient-to-br from-[#91CDE9] to-[#A4DFFB] rounded-2xl transition-all duration-300"
          onClick={() => navigateToId("behavior")}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <FiActivity className="text-white text-3xl mb-4" />
          <span className="text-white text-xl font-bold mb-2">
            Comportamiento
          </span>
          <span className="text-white/90 text-sm mb-4">Status general</span>
          <span className="bg-white/90 backdrop-blur-sm px-4 py-2 text-[#91CDE9] text-sm font-medium rounded-xl mt-auto transform group-hover:translate-y-1 transition-transform duration-300">
            Ver detalles
          </span>
        </motion.button>

        <motion.button
          variants={cardVariants}
          whileHover="hover"
          className="col-span-3 group relative overflow-hidden flex flex-col p-6 shadow-xl bg-gradient-to-br from-[#FB8601] to-[#FF9911] rounded-2xl transition-all duration-300"
          onClick={() => navigateToId("income")}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <FiDollarSign className="text-white text-3xl mb-4" />
          <span className="text-white text-xl font-bold mb-2">Ingresos</span>
          <span className="text-white/90 text-sm mb-4">Status general</span>
          <span className="bg-white/90 backdrop-blur-sm px-4 py-2 text-[#FB8601] text-sm font-medium rounded-xl mt-auto transform group-hover:translate-y-1 transition-transform duration-300">
            Ver detalles
          </span>
        </motion.button>

        <motion.button
          variants={cardVariants}
          whileHover="hover"
          className="col-span-3 group relative overflow-hidden flex flex-col p-6 shadow-xl bg-gradient-to-br from-[#023047] to-[#023047]/90 rounded-2xl transition-all duration-300"
          onClick={() => navigateToId("high_performance")}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <FiTrendingUp className="text-white text-3xl mb-4" />
          <span className="text-white text-xl font-bold mb-2">
            Rendimiento
          </span>
          <span className="text-white/90 text-sm mb-4">Status general</span>
          <span className="bg-white/90 backdrop-blur-sm px-4 py-2 text-[#023047] text-sm font-medium rounded-xl mt-auto transform group-hover:translate-y-1 transition-transform duration-300">
            Ver detalles
          </span>
        </motion.button>

        <AddDealer />
      </div>
    </div>
  );
}
