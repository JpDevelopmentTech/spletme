import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Music,
  Disc,
  Users,
  Handshake,
  BarChart2,
  Menu,
  X,
  Wallet,
  Settings,
  Tag,
  ChevronDown,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import LocalStorageService from "../../services/localstorage";
import logo from "../../assets/images/2 - BLANCO.png";

interface UserData {
  name: string;
  lastName: string;
}

const navItems = [
  { to: "/panel/dealers", label: "Distribuidores", icon: Handshake },
  { to: "/panel/collaborators", label: "Colaboradores", icon: Users },
  { to: "/panel/labels", label: "Sellos", icon: Tag },
  { to: "/panel/analytics", label: "Analíticas", icon: BarChart2 },
  { to: "/panel/wallet", label: "Banco", icon: Wallet },
];

const musicSubItems = [
  { to: "/panel/music/songs", label: "Canciones", icon: Music },
  { to: "/panel/music/albums", label: "Álbumes", icon: Disc },
];

interface SidebarNavLinkProps {
  to: string;
  label: string;
  icon: typeof Home;
  indent?: boolean;
  onNavigate: () => void;
}

/** Enlace de navegación del sidebar. Estado activo con punto naranja; soporta sangría para submenús. */
function SidebarNavLink({ to, label, icon: Icon, indent = false, onNavigate }: SidebarNavLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3.5 rounded-[16px] transition-colors ${
          indent ? "py-2.5 pl-[34px] pr-3" : "px-3 py-[11px]"
        } ${isActive ? "" : "hover:bg-[#F4F5F7]"}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`flex-shrink-0 ${indent ? "h-[17px] w-[17px]" : "h-[19px] w-[19px]"}`}
            style={{ color: isActive ? "#FF5C00" : "#A6AAB2" }}
          />
          <span
            className={`flex-1 ${indent ? "text-[13px]" : "text-sm"}`}
            style={{
              color: isActive ? "#1C1D22" : "#71757E",
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {label}
          </span>
          {isActive && !indent && (
            <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-[#FF5C00]" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth0();
  const location = useLocation();
  const isMusicSection = location.pathname.startsWith("/panel/music");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMusicMenuOpen, setIsMusicMenuOpen] = useState(isMusicSection);

  useEffect(() => {
    if (isMusicSection) setIsMusicMenuOpen(true);
  }, [isMusicSection]);

  useEffect(() => {
    const stored = LocalStorageService.getItem("user");
    if (stored) {
      setUserData({ name: stored.name || "", lastName: stored.lastName || "" });
    }
  }, []);

  const displayName =
    [userData?.name, userData?.lastName].filter(Boolean).join(" ") || user?.name || "Usuario";

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-2xl border border-[#ECEEF1] bg-white p-2.5 shadow-sm transition-colors lg:hidden"
      >
        <Menu className="h-5 w-5 text-[#1C1D22]" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col border-r border-[#ECEEF1] bg-white px-5 pb-6 pt-7 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-2">
          <div className="rounded-lg bg-white p-1">
            <img src={logo} alt="SplitMe" className="h-7 w-auto" />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-[#A6AAB2] transition-colors hover:bg-[#F4F5F7] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Greeting */}
        <div className="mt-7 flex flex-col gap-0.5 px-2">
          <span className="text-[12.5px] text-[#A6AAB2]">Bienvenido de nuevo,</span>
          <span className="truncate text-[15px] font-semibold text-[#1C1D22]">{displayName}</span>
        </div>

        {/* Navigation */}
        <nav className="mt-7 flex flex-1 flex-col gap-1 overflow-y-auto">
          <SidebarNavLink
            to="/panel/home"
            label="Inicio"
            icon={Home}
            onNavigate={() => setIsMobileMenuOpen(false)}
          />

          {/* Música — sección expandible */}
          <button
            type="button"
            onClick={() => setIsMusicMenuOpen((prev) => !prev)}
            className={`flex items-center gap-3.5 rounded-[16px] px-3 py-[11px] transition-colors ${
              isMusicSection ? "" : "hover:bg-[#F4F5F7]"
            }`}
          >
            <Music
              className="h-[19px] w-[19px] flex-shrink-0"
              style={{ color: isMusicSection ? "#FF5C00" : "#A6AAB2" }}
            />
            <span
              className="flex-1 text-left text-sm"
              style={{
                color: isMusicSection ? "#1C1D22" : "#71757E",
                fontWeight: isMusicSection ? 600 : 500,
              }}
            >
              Música
            </span>
            <ChevronDown
              className="h-4 w-4 flex-shrink-0 text-[#A6AAB2] transition-transform duration-200"
              style={{ transform: isMusicMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          {isMusicMenuOpen &&
            musicSubItems.map(({ to, label, icon }) => (
              <SidebarNavLink
                key={to}
                to={to}
                label={label}
                icon={icon}
                indent
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            ))}

          {navItems.map(({ to, label, icon }) => (
            <SidebarNavLink
              key={to}
              to={to}
              label={label}
              icon={icon}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          ))}

          <SidebarNavLink
            to="/panel/profile"
            label="Ajustes"
            icon={Settings}
            onNavigate={() => setIsMobileMenuOpen(false)}
          />
        </nav>
      </div>
    </>
  );
}
