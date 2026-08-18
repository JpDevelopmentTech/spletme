export interface DetailTab<K extends string = string> {
  key: K;
  label: string;
  icon: React.ReactNode;
  /** Contador que acompaña al rótulo, si aporta algo. */
  count?: number;
}

interface DetailTabsProps<K extends string> {
  tabs: DetailTab<K>[];
  active: K;
  onChange: (key: K) => void;
}

/**
 * Pestañas de las páginas de detalle. La activa va en tinta sólida en vez de un
 * subrayado: destaca sin depender del color, que es lo que se pierde cuando hay
 * cinco seguidas.
 */
export function DetailTabs<K extends string>({ tabs, active, onChange }: DetailTabsProps<K>) {
  return (
    <div role="tablist" aria-label="Secciones" className="flex flex-wrap items-center gap-1.5">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-2 rounded-[20px] px-[15px] py-2.5 transition-colors ${
              isActive
                ? "bg-[#1C1D22]"
                : "border border-[#E8E8EC] bg-white hover:bg-[#F4F5F7]"
            }`}
          >
            <span className={isActive ? "text-white" : "text-[#71757E]"}>{tab.icon}</span>
            <span
              className={`text-[12.5px] ${
                isActive ? "font-semibold text-white" : "font-medium text-[#1C1D22]"
              }`}
            >
              {tab.label}
            </span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`rounded-[10px] px-[7px] py-[2px] font-mono text-[10px] font-semibold ${
                  isActive ? "bg-white/[0.16] text-white" : "bg-[#F4F5F7] text-[#71757E]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
