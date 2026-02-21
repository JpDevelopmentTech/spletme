import { NavLink } from "react-router-dom";
import {
  Home,
  Music,
  Users,
  Handshake,
  BarChart2,
  CreditCard,
  Menu,
  X,
  LogOut,
  Wallet,
  Settings,
  Tag,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import LocalStorageService from "../../services/localstorage";

interface UserData {
  username: string;
  name: string;
  lastName: string;
  email: string;
  userId: string;
}

const navItems = [
  { to: "/panel/home", label: "Overview", icon: Home },
  { to: "/panel/music", label: "Music", icon: Music },
  { to: "/panel/dealers", label: "Distributors", icon: Handshake },
  { to: "/panel/collaborators", label: "Collaborators", icon: Users },
  { to: "/panel/labels", label: "Labels", icon: Tag },
  { to: "/panel/balance", label: "Analytics", icon: BarChart2 },
  { to: "/panel/pagos", label: "Payments", icon: CreditCard },
  { to: "/panel/wallet", label: "Wallet", icon: Wallet },
];

export default function Sidebar() {
  const { user, logout } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userFromStorage = LocalStorageService.getItem("user");
    if (userFromStorage) {
      setUserData({
        username: userFromStorage.username || "",
        name: userFromStorage.name || "",
        lastName: userFromStorage.lastName || "",
        email: userFromStorage.email || "",
        userId: userFromStorage.id || "",
      });
    }
  }, []);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const displayName = userData?.name || user?.name || "User";
  const displayEmail = userData?.email || user?.email || "";
  const initials =
    (displayName.charAt(0) || "U").toUpperCase() +
    (userData?.lastName?.charAt(0) || displayName.split(" ")[1]?.charAt(0) || "").toUpperCase();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 w-[260px] transition-transform duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col justify-between py-8 px-6">
          {/* Top Section */}
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2">
              
              <img src="/src/assets/images/2 - BLANCO.png" alt="SplitMe" className="w-full" />
            </div>

            {/* Close button for mobile */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden absolute top-6 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors ${
                      isActive
                        ? "bg-[#F7F8FA] text-gray-900 font-semibold"
                        : "text-gray-500 hover:bg-gray-50 font-medium"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-[18px] h-[18px] ${
                          isActive ? "text-orange-500" : "text-gray-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* Settings */}
              <NavLink
                to="/panel/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors ${
                    isActive
                      ? "bg-[#F7F8FA] text-gray-900 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 font-medium"
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Settings
                      className={`w-[18px] h-[18px] ${
                        isActive ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                    <span>Settings</span>
                  </>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-4">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <span>Logout</span>
            </button>

            {/* Account Card */}
            <div className="bg-[#F7F8FA] rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-white">
                  {initials}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] font-semibold text-gray-900 truncate">
                  {displayName}
                </span>
                <span className="text-[11px] text-gray-400 truncate">
                  {displayEmail}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
