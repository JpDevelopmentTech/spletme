import { Users, ArrowRight } from "lucide-react";

interface CollaboratorSummaryItem {
  _id?: string;
  id?: string;
  name?: string;
  percentage?: string;
  amountToPay?: string;
}

interface SongCollaboratorsSummaryProps {
  collaborators: CollaboratorSummaryItem[];
  onViewAll: () => void;
}

const TINTS = ["#FF5C00", "#2FB37E", "#A6AAB2", "#101114"];

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

function money(value?: string): string {
  return `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Resumen de colaboradores para la pestaña Resumen: nombre, split %, pendiente
 * y estado. Enlaza a la pestaña Colaboradores para ver el detalle completo.
 */
export function SongCollaboratorsSummary({ collaborators, onViewAll }: SongCollaboratorsSummaryProps) {
  const rows = collaborators.slice(0, 4);

  return (
    <div className="flex flex-col gap-3 rounded-[28px] bg-[#F4F5F7] p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Users className="h-[18px] w-[18px] text-[#1C1D22]" />
          <h3 className="text-base font-semibold text-[#1C1D22]">Colaboradores</h3>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[10.5px] font-bold text-[#71757E] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {collaborators.length}
          </span>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
        >
          Ver todos
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-[16px] bg-white p-6 text-center text-sm text-[#A6AAB2]">
          Sin colaboradores aún.
        </div>
      ) : (
        rows.map((c, idx) => {
          const pct = parseFloat(String(c.percentage ?? 0));
          const active = pct > 0;
          return (
            <div
              key={c._id ?? c.id ?? idx}
              className="flex items-center gap-3 rounded-[16px] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: TINTS[idx % TINTS.length] }}
              >
                <span className="text-[10.5px] font-bold text-white">{getInitials(c.name)}</span>
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1C1D22]">
                {c.name ?? "Colaborador"}
              </span>
              <span
                className={`w-12 text-[12.5px] font-semibold ${active ? "text-[#1C1D22]" : "text-[#A6AAB2]"}`}
              >
                {active ? `${pct}%` : "—"}
              </span>
              <span className="hidden w-[92px] text-[12px] font-medium text-[#71757E] sm:block">
                {money(c.amountToPay)}
              </span>
              <span className="flex w-[84px] justify-end">
                <span
                  className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
                  style={{
                    backgroundColor: active ? "#E4F5EC" : "#FFEADD",
                    color: active ? "#2FB37E" : "#FF5C00",
                  }}
                >
                  {active ? "Activo" : "Sin split"}
                </span>
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
