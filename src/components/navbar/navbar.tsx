import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Search, Globe, Bell, ChevronDown, User, Users, LogOut } from "lucide-react";
import LocalStorageService from "../../services/localstorage";
import { AuthService } from "@/services/auth";

interface NavbarProps {
  onSwitchUser?: () => void;
}

/**
 * Barra superior del panel: buscador, selector de idioma, notificaciones y
 * menú de usuario (perfil, cambiar usuario y cerrar sesión) en un dropdown.
 */
export default function Navbar({ onSwitchUser }: NavbarProps) {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const stored = LocalStorageService.getItem("user");
  const displayName = stored?.name || user?.name || "Usuario";
  const displayEmail = stored?.email || user?.email || "";
  const initials =
    (displayName.charAt(0) || "U").toUpperCase() +
    (stored?.lastName?.charAt(0) || displayName.split(" ")[1]?.charAt(0) || "").toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await AuthService.logout();
  };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 bg-white/80 px-4 py-3.5 backdrop-blur-xl lg:px-8">
      <div className="hidden items-center gap-3 rounded-full bg-[#F4F5F7] px-5 py-3 sm:flex sm:w-[320px] lg:w-[380px]">
        <Search className="h-[19px] w-[19px] flex-shrink-0 text-[#A6AAB2]" />
        <input
          type="text"
          placeholder="Buscar canciones, plataformas…"
          className="w-full bg-transparent text-[13.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:outline-none focus:border-none outline-none focus-visible:outline-none border-none focus:ring-0"
        />
      </div>

      <div className="flex-1" />

      <button className="flex items-center gap-2 rounded-full bg-[#F4F5F7] px-4 py-2.5 transition-colors hover:bg-[#E7E9EC]">
        <Globe className="h-[18px] w-[18px] text-[#71757E]" />
        <span className="text-[13px] font-medium text-[#1C1D22]">ES</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#A6AAB2]" />
      </button>

      <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F5F7] transition-colors hover:bg-[#E7E9EC]">
        <Bell className="h-5 w-5 text-[#71757E]" />
        <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#FF5C00]" />
      </button>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-full bg-[#F4F5F7] py-1.5 pl-1.5 pr-3.5 transition-colors hover:bg-[#E7E9EC]"
        >
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#FF5C00] text-xs font-bold text-white">
            {initials}
          </span>
          <span className="hidden flex-col items-start leading-tight sm:flex">
            <span className="text-[12.5px] font-semibold text-[#1C1D22]">{displayName}</span>
            <span className="text-[10.5px] text-[#A6AAB2]">Artista</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#A6AAB2]" />
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-[22px] bg-white p-2 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.16)]">
            <div className="flex items-center gap-2.5 px-2.5 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5C00] text-[13px] font-bold text-white">
                {initials}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[12.5px] font-semibold text-[#1C1D22]">
                  {displayName}
                </span>
                <span className="truncate text-[10.5px] text-[#A6AAB2]">{displayEmail}</span>
              </div>
            </div>
            <div className="my-1 h-px bg-[#1C1D22]/10" />
            <button
              onClick={() => {
                setOpen(false);
                navigate("/panel/profile");
              }}
              className="flex w-full items-center gap-3 rounded-[16px] px-2.5 py-2.5 text-[13px] font-medium text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
            >
              <User className="h-[17px] w-[17px] text-[#71757E]" />
              Mi perfil
            </button>
            {onSwitchUser && (
              <button
                onClick={() => {
                  setOpen(false);
                  onSwitchUser();
                }}
                className="flex w-full items-center gap-3 rounded-[16px] px-2.5 py-2.5 text-[13px] font-medium text-[#1C1D22] transition-colors hover:bg-[#F4F5F7]"
              >
                <Users className="h-[17px] w-[17px] text-[#71757E]" />
                Cambiar usuario
              </button>
            )}
            <div className="my-1 h-px bg-[#1C1D22]/10" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-[16px] bg-[#EF4444]/[0.06] px-2.5 py-2.5 text-[13px] font-semibold text-[#EF4444] transition-colors hover:bg-[#EF4444]/10"
            >
              <LogOut className="h-[17px] w-[17px]" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
