/**
 * Páginas a dibujar en un paginador: la primera, la última y las contiguas a la
 * actual. Los saltos se marcan con `null`, que la vista pinta como una elipsis.
 *
 * Antes el historial construía el array completo de páginas para descartarlo
 * justo después, así que una lista larga creaba cientos de elementos en cada
 * render para acabar mostrando cinco.
 */
export function pageWindow(page: number, totalPages: number): Array<number | null> {
  const pages: Array<number | null> = [];
  let previous = 0;

  for (let candidate = 1; candidate <= totalPages; candidate += 1) {
    const isEdge = candidate === 1 || candidate === totalPages;
    if (!isEdge && Math.abs(candidate - page) > 1) continue;
    if (previous && candidate - previous > 1) pages.push(null);
    pages.push(candidate);
    previous = candidate;
  }

  return pages;
}
