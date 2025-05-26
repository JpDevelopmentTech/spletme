import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  User, 
  X, 
  LogOut, 
  Settings, 
  HelpCircle,
  ChevronRight
} from "lucide-react";

export default function Panel() {
  const { logout } = useAuth0();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");



  const menuVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

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
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 h-full w-96 bg-white z-50 shadow-xl"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold text-gray-800">Profile Menu</h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </motion.button>
                </div>

                <div className="space-y-4 flex-grow">
                  <motion.button
                    whileHover={{ x: 10 }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Settings className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Settings</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 10 }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HelpCircle className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Help & Support</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
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
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
