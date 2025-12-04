import { NavLink } from "react-router-dom";
import {
  Home,
  Music,
  Users,
  Handshake,
  BarChart2,
  CreditCard,
  Download,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Tag,
} from "lucide-react";
import Logo from "../../assets/images/2 - BLANCO.png";
import logo from "../../assets/images/5 - LOGO.png";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LocalStorageService from "../../services/localstorage";

interface UserData {
  username: string;
  name: string;
  lastName: string;
  email: string;
  userId: string;
}

const menuAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function Sidebar() {
  const { user, logout } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const userFromStorage = LocalStorageService.getItem("user");
    if (userFromStorage) {
      setUserData({
        username: userFromStorage.username || "",
        name: userFromStorage.name || "",
        lastName: userFromStorage.lastName || "",
        email: userFromStorage.email || "",
        userId: userFromStorage.id || ""
      });
    }
  }, []);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`lg:fixed left-0 top-0 h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-r border-white/20 z-30 transition-all duration-300 ${
          isCollapsed ? "lg:w-20" : "lg:w-80"
        } ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col p-4 lg:p-6 relative">
          {/* Close Button for Mobile */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={toggleMobileMenu}
            className="lg:hidden absolute top-4 right-4 p-2 bg-red-500/20 text-red-600 rounded-xl hover:bg-red-500/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Collapse Toggle Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={toggleCollapse}
            className="hidden lg:flex absolute top-4 right-4 p-2 bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          {/* Logo and Profile Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-start space-y-6 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`${
                isCollapsed ? "w-8 h-10" : "w-10 h-12"
              } transition-all duration-300`}
            >
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full space-y-3"
              >
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-200/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {userData?.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        ¡Bienvenido!
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {userData?.name || user?.name || "Usuario"}
                      </p>
                      {userData?.username && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{userData.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {userData?.email && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {userData.email}
                      </p>
                    )}
                    {userData?.userId && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {userData.userId}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Navigation Menu */}
          <div className="flex-1 space-y-6">
            {/* Música Section */}
            <motion.div
              variants={menuAnimation}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {!isCollapsed && (
                <motion.span
                  variants={itemAnimation}
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 flex items-center gap-2"
                >
                  <Music className="w-3 h-3" />
                  Música
                </motion.span>
              )}

              <motion.div variants={itemAnimation}>
                <NavLink
                  to="/panel/home"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home
                    className={`${
                      isCollapsed ? "w-5 h-5" : "w-5 h-5"
                    } group-hover:scale-110 transition-transform`}
                  />
                  {!isCollapsed && <span>Inicio</span>}
                </NavLink>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <NavLink
                  to="/panel/music"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Music
                    className={`${
                      isCollapsed ? "w-5 h-5" : "w-5 h-5"
                    } group-hover:scale-110 transition-transform`}
                  />
                  {!isCollapsed && <span>Música</span>}
                </NavLink>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <NavLink
                  to="/panel/dealers"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Handshake
                    className={`${
                      isCollapsed ? "w-5 h-5" : "w-5 h-5"
                    } group-hover:scale-110 transition-transform`}
                  />
                  {!isCollapsed && <span>Distribuidores</span>}
                </NavLink>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <NavLink
                  to="/panel/collaborators"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users
                    className={`${
                      isCollapsed ? "w-5 h-5" : "w-5 h-5"
                    } group-hover:scale-110 transition-transform`}
                  />
                  {!isCollapsed && <span>Colaboradores</span>}
                </NavLink>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <NavLink
                  to="/panel/labels"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Tag
                    className={`${
                      isCollapsed ? "w-5 h-5" : "w-5 h-5"
                    } group-hover:scale-110 transition-transform`}
                  />
                  {!isCollapsed && <span>Labels</span>}
                </NavLink>
              </motion.div>
            </motion.div>

            {/* Reportes Section */}
            <motion.div
              variants={menuAnimation}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {!isCollapsed && (
                <motion.span
                  variants={itemAnimation}
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 flex items-center gap-2"
                >
                  <BarChart2 className="w-3 h-3" />
                  Reportes
                </motion.span>
              )}

              <motion.div variants={itemAnimation}>
                <NavLink
                  to="/panel/balance"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BarChart2
                    className={`${
                      isCollapsed ? "w-5 h-5" : "w-5 h-5"
                    } group-hover:scale-110 transition-transform`}
                  />
                  {!isCollapsed && <span>Balance</span>}
                </NavLink>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <NavLink
                  to="/panel/pagos"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <CreditCard
                    className={`${
                      isCollapsed ? "w-5 h-5" : "w-5 h-5"
                    } group-hover:scale-110 transition-transform`}
                  />
                  {!isCollapsed && <span>Pagos</span>}
                </NavLink>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 flex items-center gap-2">
                  <Bell className="w-3 h-3" />
                  Acciones
                </span>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                  <span>Buscar</span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Footer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            {/* App Download Section */}
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-200/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Download className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descarga nuestra app
                  </span>
                </div>
                <div className="flex gap-2">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#"
                    className="transition-transform"
                  >
                    <img
                      className="w-24 h-8 object-contain"
                      src="data:image/png;base64,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"
                      alt="App Store"
                    />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#"
                    className="transition-transform"
                  >
                    <img
                      className="w-28 h-8 object-contain"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                      alt="Play Store"
                    />
                  </motion.a>
                </div>
              </motion.div>
            )}

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Cerrar sesión</span>}
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex justify-center"
            >
              <img
                src={Logo}
                alt="logo splet me"
                className={`${
                  isCollapsed ? "w-8" : "w-32"
                } opacity-80 transition-all duration-300`}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
