import { ChevronDown } from "lucide-react";

interface FilterFacetProps {
  /** Nombre del filtro. Se omite cuando el valor ya se explica solo. */
  label?: string;
  value: string;
  highlighted?: boolean;
  icon?: React.ReactNode;
  /** El `<select>` nativo, que se superpone invisible. */
  children: React.ReactElement;
}

/**
 * Selector con la etiqueta y su valor actual a la vista.
 *
 * El `<select>` nativo va encima transparente: conserva el teclado y el menú del
 * sistema, que en móvil es mejor que cualquier desplegable propio.
 */
export function FilterFacet({
  label,
  value,
  highlighted = false,
  icon,
  children,
}: FilterFacetProps) {
  return (
    <div
      className={`relative flex items-center gap-2 rounded-full border px-3.5 py-2 transition-colors ${
        highlighted
          ? "border-transparent bg-[#FFEADD]"
          : "border-[#E8E8EC] bg-white hover:border-[#D9DAE0]"
      }`}
    >
      {icon && <span className={highlighted ? "text-[#FF5C00]" : "text-[#71757E]"}>{icon}</span>}
      {label && (
        <span className={`text-[12px] ${highlighted ? "text-[#EA580C]" : "text-[#A6AAB2]"}`}>
          {label}
        </span>
      )}
      <span
        className={`text-[12.5px] font-semibold ${highlighted ? "text-[#FF5C00]" : "text-[#1C1D22]"}`}
      >
        {value}
      </span>
      <ChevronDown className={`h-3.5 w-3.5 ${highlighted ? "text-[#FF5C00]" : "text-[#A6AAB2]"}`} />
      <span className="absolute inset-0 [&>select]:h-full [&>select]:w-full [&>select]:cursor-pointer [&>select]:opacity-0">
        {children}
      </span>
    </div>
  );
}
