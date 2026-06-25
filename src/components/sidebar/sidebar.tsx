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
  ChevronDown,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import LocalStorageService from "../../services/localstorage";
import { AuthService } from "@/services/auth";
import SwitchSubuserModal from "../modal/SwitchSubuserModal";

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
  { to: "/panel/analytics", label: "Analíticas", icon: BarChart2 },
  { to: "/panel/wallet", label: "Banco", icon: Wallet },
];

export default function Sidebar() {
  const { user } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false);

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

  const handleLogout = async () => {
    await AuthService.logout();
  };

  const displayName = userData?.name || user?.name || "User";
  const displayEmail = userData?.email || user?.email || "";
  const initials =
    (displayName.charAt(0) || "U").toUpperCase() +
    (userData?.lastName?.charAt(0) || displayName.split(" ")[1]?.charAt(0) || "").toUpperCase();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl p-2.5 transition-colors lg:hidden"
        style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B" }}
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-30 flex h-full w-[260px] flex-col transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: "#0F172A", borderRight: "1px solid #1E293B" }}
      >
        {/* Top bar — logo */}
        <div
          className="flex flex-shrink-0 items-center gap-2.5 px-6"
          style={{ height: 64, borderBottom: "1px solid #1E293B" }}
        >
          <div
            className="flex flex-shrink-0 items-center justify-center text-lg font-bold text-white"
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              backgroundColor: "#F97316",
            }}
          >
            S
          </div>
          <span className="flex-1 text-lg font-bold text-white">SplitMe</span>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-1.5 transition-colors lg:hidden"
            style={{ color: "#94A3B8" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors ${
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
                    className="h-[18px] w-[18px] flex-shrink-0"
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
              `flex items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors ${
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
                  className="h-[18px] w-[18px] flex-shrink-0"
                  style={{ color: isActive ? "#F97316" : "#475569" }}
                />
                <span>Ajustes</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Account card - clickable */}
        <button
          onClick={() => setShowSwitchUserModal((prev) => !prev)}
          className="mx-3 mb-3 flex w-[calc(100%-24px)] items-center gap-3 rounded-xl p-3 transition-colors"
          style={{
            backgroundColor: showSwitchUserModal ? "#263548" : "#1E293B",
            border: showSwitchUserModal ? "1px solid #334155" : "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (!showSwitchUserModal)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a2d42";
          }}
          onMouseLeave={(e) => {
            if (!showSwitchUserModal)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1E293B";
          }}
        >
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F97316" }}
          >
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-[13px] font-semibold" style={{ color: "#F1F5F9" }}>
              {displayName}
            </span>
            <span className="truncate text-[11px]" style={{ color: "#475569" }}>
              @{userData?.username || displayEmail}
            </span>
          </div>
          <ChevronDown
            className="h-4 w-4 flex-shrink-0 transition-transform duration-200"
            style={{
              color: "#94A3B8",
              transform: showSwitchUserModal ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {/* Bottom section */}
        <div className="flex flex-shrink-0 flex-col gap-2 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors"
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
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
      {/* Switch Subuser Modal */}
      <SwitchSubuserModal
        isOpen={showSwitchUserModal}
        onClose={() => setShowSwitchUserModal(false)}
        currentUserId={userData?.userId || ""}
      />
    </>
  );
}
