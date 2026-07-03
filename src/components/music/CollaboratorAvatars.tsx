import type { SongCollaborator } from "@/types/music.types";

interface CollaboratorAvatarsProps {
  collaborators?: SongCollaborator[];
  emptyLabel?: string;
}

const TINTS = ["#FF5C00", "#2FB37E", "#A6AAB2"];

/** Iniciales (hasta 2) a partir del nombre. */
function getInitials(name?: string): string {
  if (!name) return "?";
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0] ?? "")
      .join("")
      .toUpperCase() || "?"
  );
}

/** Pila de avatares de colaboradores (máx. 3 + contador). */
export function CollaboratorAvatars({ collaborators, emptyLabel = "—" }: CollaboratorAvatarsProps) {
  const list = collaborators ?? [];
  if (list.length === 0) {
    return <span className="text-[11.5px] text-[#A6AAB2]">{emptyLabel}</span>;
  }
  const shown = list.slice(0, 3);
  const extra = list.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((c, idx) =>
        c.image ? (
          <img
            key={idx}
            src={c.image}
            alt={c.name}
            title={c.name}
            className="h-7 w-7 rounded-full border-2 border-white object-cover"
          />
        ) : (
          <div
            key={idx}
            title={c.name}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white"
            style={{ backgroundColor: TINTS[idx % TINTS.length] }}
          >
            <span className="text-[9.5px] font-bold text-white">{getInitials(c.name)}</span>
          </div>
        ),
      )}
      {extra > 0 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#EDEEF1]">
          <span className="text-[9.5px] font-medium text-[#71757E]">+{extra}</span>
        </div>
      )}
    </div>
  );
}
