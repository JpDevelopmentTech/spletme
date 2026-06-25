import AddDealer from "../../../../components/adddealer/addleader";
import { FiTrendingUp, FiDollarSign, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

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
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="p-4">
      <div className="mt-6 grid grid-cols-12 gap-6">
        <motion.button
          variants={cardVariants}
          whileHover="hover"
          className="group relative col-span-3 flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#91CDE9] to-[#A4DFFB] p-6 shadow-xl transition-all duration-300"
          onClick={() => navigateToId("behavior")}
        >
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
          <FiActivity className="mb-4 text-3xl text-white" />
          <span className="mb-2 text-xl font-bold text-white">Comportamiento</span>
          <span className="mb-4 text-sm text-white/90">Status general</span>
          <span className="mt-auto transform rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-[#91CDE9] backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-1">
            Ver detalles
          </span>
        </motion.button>

        <motion.button
          variants={cardVariants}
          whileHover="hover"
          className="group relative col-span-3 flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#FB8601] to-[#FF9911] p-6 shadow-xl transition-all duration-300"
          onClick={() => navigateToId("income")}
        >
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
          <FiDollarSign className="mb-4 text-3xl text-white" />
          <span className="mb-2 text-xl font-bold text-white">Ingresos</span>
          <span className="mb-4 text-sm text-white/90">Status general</span>
          <span className="mt-auto transform rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-[#FB8601] backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-1">
            Ver detalles
          </span>
        </motion.button>

        <motion.button
          variants={cardVariants}
          whileHover="hover"
          className="group relative col-span-3 flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#023047] to-[#023047]/90 p-6 shadow-xl transition-all duration-300"
          onClick={() => navigateToId("high_performance")}
        >
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
          <FiTrendingUp className="mb-4 text-3xl text-white" />
          <span className="mb-2 text-xl font-bold text-white">Rendimiento</span>
          <span className="mb-4 text-sm text-white/90">Status general</span>
          <span className="mt-auto transform rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-[#023047] backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-1">
            Ver detalles
          </span>
        </motion.button>

        <AddDealer />
      </div>
    </div>
  );
}
