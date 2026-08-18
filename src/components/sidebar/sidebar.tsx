import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AudioWaveform,
  House,
  LibraryBig,
  Handshake,
  Users,
  Tag,
  BarChart2,
  Wallet,
  Settings,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: typeof House;
  /** Marca activo también en las rutas hijas, no solo en la exacta. */
  matchNested?: boolean;
}

interface NavGroup {
  /** Rótulo de la sección. Sin él, el grupo va suelto arriba o al pie. */
  title?: string;
  items: NavItem[];
}

/**
 * La navegación va agrupada por para qué sirve cada cosa: primero el catálogo,
 * después lo que se gestiona alrededor de él. Los rótulos hacen de separador y
 * evitan una lista plana de ocho destinos sin jerarquía.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ to: "/panel/home", label: "Inicio", icon: House }],
  },
  {
    title: "MÚSICA",
    items: [
      { to: "/panel/music", label: "Música", icon: LibraryBig, matchNested: true },
    ],
  },
  {
    title: "GESTIÓN",
    items: [
      { to: "/panel/dealers", label: "Distribuidores", icon: Handshake, matchNested: true },
      { to: "/panel/collaborators", label: "Colaboradores", icon: Users, matchNested: true },
      { to: "/panel/labels", label: "Sellos", icon: Tag, matchNested: true },
      { to: "/panel/analytics", label: "Analíticas", icon: BarChart2 },
      { to: "/panel/wallet", label: "Banco", icon: Wallet },
    ],
  },
  {
    items: [{ to: "/panel/profile", label: "Ajustes", icon: Settings }],
  },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const close = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Acceso al menú en móvil, donde el panel va oculto */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Abrir menú"
        className="fixed left-4 top-4 z-50 rounded-2xl border border-[#E8E8EC] bg-white p-2.5 shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5 text-[#1C1D22]" />
      </button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#101114]/40 lg:hidden" onClick={close} />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col gap-6 overflow-y-auto border-r border-[#E8E8EC] bg-white px-5 py-6 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Marca */}
        <div className="flex flex-shrink-0 items-center justify-between">
          <NavLink to="/panel/home" onClick={close} className="flex items-center gap-2.5 px-1.5 py-1">
            <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[10px] bg-[#FF5C00]">
              <AudioWaveform className="h-[17px] w-[17px] text-white" />
            </span>
            <span className="font-display text-[19px] font-semibold text-[#1C1D22]">splitme</span>
          </NavLink>

          <button
            onClick={close}
            aria-label="Cerrar menú"
            className="rounded-lg p-1.5 text-[#A6AAB2] transition-colors hover:bg-[#F4F5F7] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-6">
          {NAV_GROUPS.map((group, index) => (
            <div key={group.title ?? `group-${index}`} className="flex flex-col gap-[3px]">
              {group.title && (
                <span className="px-[13px] py-1.5 font-mono text-[9.5px] font-medium tracking-[1.4px] text-[#A6AAB2]">
                  {group.title}
                </span>
              )}
              {group.items.map((item) => (
                <SidebarLink key={item.to} item={item} onNavigate={close} />
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

/**
 * Enlace del sidebar. El destino activo se marca con fondo, no con un punto al
 * margen: se reconoce de un vistazo sin tener que recorrer la lista.
 */
function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const { to, label, icon: Icon, matchNested } = item;

  return (
    <NavLink
      to={to}
      end={!matchNested}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[13px] px-[13px] py-[9px] transition-colors ${
          isActive ? "bg-[#FFEADD]" : "hover:bg-[#F4F5F7]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`h-[17px] w-[17px] flex-shrink-0 ${
              isActive ? "text-[#FF5C00]" : "text-[#71757E]"
            }`}
          />
          <span
            className={`text-[13.5px] ${
              isActive ? "font-semibold text-[#FF5C00]" : "font-medium text-[#1C1D22]"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
