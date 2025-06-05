import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  User, 
  X, 
  LogOut, 
  ChevronRight
} from "lucide-react";

export default function Panel() {
  const { logout } = useAuth0();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-gray-50 flex font-custom relative">
      <Sidebar />
      <div className="w-full h-full ml-80">
        <div className="w-full border-b bg-white h-20 flex items-center justify-between px-8 shadow-sm">
          <div className="w-full lg:w-2/3 flex items-center">
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Search anything..."
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(true)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <User className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        <div className="p-8">
          <Outlet />
        </div>
      </div>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
                exit: { opacity: 0 }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              variants={{
                hidden: { x: "100%", opacity: 0 },
                visible: { x: 0, opacity: 1 },
                exit: { x: "100%", opacity: 0 }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 z-50 shadow-2xl"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Menu
                  </h2>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>

                <div className="space-y-4 flex-grow">
                  <motion.button
                    whileHover={{ x: 10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/panel/profile")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors duration-200">
                      <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">Perfil</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    }
                  })}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
