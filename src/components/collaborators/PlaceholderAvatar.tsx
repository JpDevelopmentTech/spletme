interface PlaceholderAvatarProps {
  name: string;
  /** Tamaño en píxeles del lado. Por defecto, el de una fila de lista. */
  size?: number;
}

const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase() || "?";

/**
 * FUNCIONALIDAD TEMPORAL — perfiles sin cuenta.
 *
 * El contorno discontinuo es lo que dice que esa persona todavía no existe en
 * Splitme. Va en la forma y no solo en el color: se distingue de un colaborador
 * de verdad aunque el chip de al lado no se lea, y sobrevive a quien no
 * distingue bien los tonos.
 */
export function PlaceholderAvatar({ name, size = 38 }: PlaceholderAvatarProps) {
  return (
    <span
      style={{ height: size, width: size, fontSize: size * 0.3 }}
      className="grid flex-shrink-0 place-items-center rounded-full border-[1.5px] border-dashed border-[#A6AAB2] bg-[#F4F5F7] font-semibold text-[#71757E]"
    >
      {initialsOf(name)}
    </span>
  );
}

/** El chip que acompaña al avatar allí donde hace falta nombrar el estado. */
export function PlaceholderChip() {
  return (
    <span className="inline-flex flex-shrink-0 items-center rounded-[11px] border border-dashed border-[#C9CCD2] px-[7px] py-[2px] text-[10px] font-semibold text-[#71757E]">
      Sin cuenta
    </span>
  );
}
