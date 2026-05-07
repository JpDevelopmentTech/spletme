import { NavLink } from "react-router-dom";
import {
  Home,
  Music,
  Users,
  Handshake,
  BarChart2,
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
  { to: "/panel/home", label: "Inicio", icon: Home },
  { to: "/panel/music", label: "Música", icon: Music },
  { to: "/panel/dealers", label: "Distribuidores", icon: Handshake },
  { to: "/panel/collaborators", label: "Colaboradores", icon: Users },
  { to: "/panel/labels", label: "Sellos", icon: Tag },
  { to: "/panel/balance", label: "Analíticas", icon: BarChart2 },
  { to: "/panel/wallet", label: "Billetera", icon: Wallet },
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

  const displayName = userData?.name || user?.name || "User";
  const displayEmail = userData?.email || user?.email || "";
  const initials =
    (displayName.charAt(0) || "U").toUpperCase() +
    (
      userData?.lastName?.charAt(0) ||
      displayName.split(" ")[1]?.charAt(0) ||
      ""
    ).toUpperCase();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl transition-colors"
        style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B" }}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-30 w-[260px] flex flex-col transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: "#0F172A", borderRight: "1px solid #1E293B" }}
      >
        {/* Top bar — logo */}
        <div
          className="flex items-center gap-2.5 px-6 flex-shrink-0"
          style={{ height: 64, borderBottom: "1px solid #1E293B" }}
        >
          <div
            className="flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: "#F97316" }}
          >
            S
          </div>
          <span className="text-white font-bold text-lg flex-1">SplitMe</span>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: "#94A3B8" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors ${
                  isActive ? "font-semibold" : ""
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(249,115,22,0.12)" : "transparent",
                color: isActive ? "#F97316" : "#94A3B8",
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (!el.classList.contains("font-semibold")) {
                  el.style.backgroundColor = "rgba(255,255,255,0.05)";
                  el.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (!el.classList.contains("font-semibold")) {
                  el.style.backgroundColor = "transparent";
                  el.style.color = "#94A3B8";
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-[18px] h-[18px] flex-shrink-0"
                    style={{ color: isActive ? "#F97316" : "#475569" }}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Settings */}
          <NavLink
            to="/panel/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors ${
                isActive ? "font-semibold" : ""
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "rgba(249,115,22,0.12)" : "transparent",
              color: isActive ? "#F97316" : "#94A3B8",
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains("font-semibold")) {
                el.style.backgroundColor = "rgba(255,255,255,0.05)";
                el.style.color = "#FFFFFF";
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains("font-semibold")) {
                el.style.backgroundColor = "transparent";
                el.style.color = "#94A3B8";
              }
            }}
          >
            {({ isActive }) => (
              <>
                <Settings
                  className="w-[18px] h-[18px] flex-shrink-0"
                  style={{ color: isActive ? "#F97316" : "#475569" }}
                />
                <span>Ajustes</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Bottom section */}
        <div className="flex flex-col gap-2 p-3 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors"
            style={{ color: "#94A3B8" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = "#F87171";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
            }}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            <span>Cerrar sesión</span>
          </button>

          {/* Account card */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: "#1E293B" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F97316" }}
            >
              <span className="text-xs font-semibold text-white">{initials}</span>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className="text-[13px] font-semibold truncate"
                style={{ color: "#F1F5F9" }}
              >
                {displayName}
              </span>
              <span className="text-[11px] truncate" style={{ color: "#64748B" }}>
                {displayEmail}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
