import { useEffect, useMemo, useState } from "react";
import {
  GitBranch,
  Globe,
  Radio,
  Hash,
  User,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock3,
  AlertCircle,
} from "lucide-react";
import {
  ModalShell,
  ModalMark,
  FooterNote,
  SecondaryButton,
} from "@/components/ui/ModalShell";
import { songSplitsService } from "../../../../../services/songSplits";
import type { SplitHistoryItem } from "../../../../../types/song-split.types";
import type { SongCollaborator } from "../../../../../types/music.types";

interface HistoryOfSplitsProps {
  songId?: string;
  isOwner?: boolean;
  /** Sirve para poner nombre al `userId` de cada versión. */
  collaborators?: SongCollaborator[];
  /** Repartible de la canción, para traducir el porcentaje a dinero. */
  distributable?: number;
}

/** Una versión del historial con el porcentaje que tenía esa misma persona antes. */
interface SplitChange {
  key: string;
  item: SplitHistoryItem;
  subject: string;
  previousPercentage: number | null;
}

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
};

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${formatDate(value)} · ${date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const formatMoney = (value: number) =>
  value.toLocaleString("es-CO", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const ACTION_LABEL: Record<string, string> = {
  create: "creado",
  update: "modificado",
  delete: "eliminado",
};

const splitDate = (split: SplitHistoryItem) => split.updatedAt || split.createdAt;

const scopeOf = (split: SplitHistoryItem) => {
  const paises = split.countriesType === "all" ? "Todos los países" : split.selectedCountries?.join(", ");
  const plataformas = split.platformsType === "all" ? "todas las plataformas" : split.selectedPlatforms?.join(", ");
  if (split.countriesType === "all" && split.platformsType === "all") {
    return { text: "Todos los países y plataformas", worldwide: true };
  }
  return { text: [paises, plataformas].filter(Boolean).join(" · ") || "—", worldwide: false };
};

const Historyofsplits = ({
  songId,
  isOwner = false,
  collaborators = [],
  distributable = 0,
}: HistoryOfSplitsProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [historySplits, setHistorySplits] = useState<SplitHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!songId) {
      setHistorySplits([]);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    songSplitsService
      .getSplitHistoryBySong(songId)
      .then((history) => {
        if (active) setHistorySplits(history);
      })
      .catch(() => {
        if (active) setError("No pudimos traer el historial de splits.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [songId]);

  /** Nombre de la persona dueña del split, no de quien hizo el cambio. */
  const nameOf = useMemo(() => {
    const byId = new Map<string, string>();
    for (const c of collaborators) {
      if (c._id && c.name) byId.set(String(c._id), c.name);
    }
    return (split: SplitHistoryItem) => {
      if (split.role === "owner") return "el owner";
      const found = split.userId ? byId.get(String(split.userId)) : undefined;
      return found || split.updatedBy?.name || "un colaborador";
    };
  }, [collaborators]);

  /** Versiones ordenadas de la más nueva a la más vieja, cada una con su porcentaje anterior. */
  const changes = useMemo<SplitChange[]>(() => {
    const safe = Array.isArray(historySplits) ? historySplits : [];
    const visible = isOwner ? safe : safe.filter((s) => s.role !== "owner");

    // Ascendente para poder mirar hacia atrás dentro de cada persona.
    const ascending = [...visible].sort((a, b) => {
      const at = new Date(splitDate(a) || 0).getTime();
      const bt = new Date(splitDate(b) || 0).getTime();
      if (at !== bt) return at - bt;
      return (a.version ?? 0) - (b.version ?? 0);
    });

    const lastByPerson = new Map<string, number>();
    const withDelta = ascending.map((item, index) => {
      const person = String(item.userId ?? item.role ?? index);
      const previous = lastByPerson.has(person) ? (lastByPerson.get(person) as number) : null;
      lastByPerson.set(person, item.percentage ?? 0);
      return {
        key: item._id || `split-history-${index}`,
        item,
        subject: nameOf(item),
        previousPercentage: previous,
      };
    });

    return withDelta.reverse();
  }, [historySplits, isOwner, nameOf]);

  /** Cómo queda el reparto hoy: la última versión viva de cada persona. */
  const current = useMemo(() => {
    const latest = new Map<string, SplitChange>();
    // `changes` viene de más nuevo a más viejo, así que la primera que aparece es la vigente.
    for (const change of changes) {
      const person = String(change.item.userId ?? change.item.role);
      if (!latest.has(person)) latest.set(person, change);
    }
    return [...latest.values()]
      .filter((c) => !c.item.isDeleted && c.item.action !== "delete")
      .map((c) => ({
        name: c.item.role === "owner" ? "Tú (owner)" : c.subject,
        percentage: c.item.percentage ?? 0,
        isOwnerRow: c.item.role === "owner",
        version: c.item.version,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [changes]);

  const latestVersion = useMemo(
    () => changes.reduce((max, c) => Math.max(max, c.item.version ?? 0), 0),
    [changes],
  );

  const assigned = current.reduce((sum, p) => sum + p.percentage, 0);
  const selected = changes.find((c) => c.key === selectedKey) || null;
  const oldestDate = changes.length ? formatDate(splitDate(changes[changes.length - 1].item)) : "—";

  if (loading) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-2.5 py-14 text-center">
          <Clock3 className="h-6 w-6 animate-pulse text-[#A6AAB2]" />
          <p className="text-sm text-[#71757E]">Trayendo el historial de splits…</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-2.5 py-14 text-center">
          <span className="grid h-[52px] w-[52px] place-items-center rounded-[18px] bg-[#FDECEC]">
            <AlertCircle className="h-6 w-6 text-[#E5484D]" />
          </span>
          <p className="text-[15px] font-semibold text-[#1C1D22]">{error}</p>
          <p className="max-w-[340px] text-[13px] text-[#71757E]">
            Vuelve a entrar en un momento. El reparto vigente no se ha tocado.
          </p>
        </div>
      </Card>
    );
  }

  if (!changes.length) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-2.5 py-14 text-center">
          <span className="grid h-[58px] w-[58px] place-items-center rounded-[20px] bg-[#FFEADD]">
            <GitBranch className="h-6 w-6 text-[#FF5C00]" />
          </span>
          <p className="text-[15px] font-semibold text-[#1C1D22]">Todavía no hay cambios de reparto</p>
          <p className="max-w-[380px] text-[13px] text-[#71757E]">
            En cuanto asignes el primer split, aquí queda el registro de quién lo cambió y cuándo.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* ── Historial de versiones ── */}
        <section className="flex-1 overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
          <header className="flex flex-wrap items-center justify-between gap-3.5 px-5 py-[18px]">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-display text-[18px] font-semibold text-[#1C1D22]">
                Cómo ha cambiado el reparto
              </h3>
              <p className="text-[12.5px] font-medium text-[#71757E]">
                Cada cambio guarda su versión · la v{latestVersion} es la que se aplica hoy
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-[14px] bg-[#E4F5EC] px-2.5 py-[5px] text-[10.5px] font-semibold text-[#2FB37E]">
              <CheckCircle2 className="h-[11px] w-[11px]" />v{latestVersion} vigente
            </span>
          </header>

          <div className="h-px bg-[#E8E8EC]" />

          <div className="hidden items-center gap-3.5 px-5 py-[13px] lg:flex">
            <span className="w-[38px]" />
            <span className="flex-1 font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
              CAMBIO
            </span>
            <span className="w-[150px] font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
              ALCANCE
            </span>
            <span className="w-[120px] font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
              DEL % AL %
            </span>
            <span className="w-[96px]" />
          </div>

          <div className="h-px bg-[#E8E8EC]" />

          <ul>
            {changes.map((change, index) => {
              const { item } = change;
              const isCurrent = (item.version ?? 0) === latestVersion && index === 0;
              const scope = scopeOf(item);
              const verb = ACTION_LABEL[item.action] ?? "actualizado";
              const title =
                item.role === "owner"
                  ? `Split del owner ${verb}`
                  : `Split de ${change.subject} ${verb}`;

              return (
                <li key={change.key}>
                  {index > 0 && <div className="h-px bg-[#E8E8EC]" />}
                  <button
                    type="button"
                    onClick={() => setSelectedKey(change.key)}
                    className={`flex w-full flex-wrap items-center gap-3.5 px-5 py-3 text-left transition-colors hover:bg-[#FAFAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] focus-visible:ring-offset-[-2px] ${
                      isCurrent ? "bg-[#FF5C00]/[0.04]" : ""
                    }`}
                  >
                    <span
                      className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[12px] font-mono text-[12px] font-semibold ${
                        isCurrent ? "bg-[#FF5C00] text-white" : "bg-[#F4F5F7] text-[#71757E]"
                      }`}
                    >
                      v{item.version ?? "—"}
                    </span>

                    <span className="flex min-w-[180px] flex-1 flex-col gap-0.5">
                      <span className="truncate text-[13px] font-semibold text-[#1C1D22]">{title}</span>
                      <span className="truncate text-[11px] text-[#A6AAB2]">
                        por {item.updatedBy?.name || "—"} · {formatDate(splitDate(item))}
                      </span>
                    </span>

                    <span className="flex w-[150px] items-center gap-1.5">
                      {scope.worldwide ? (
                        <Globe className="h-3 w-3 shrink-0 text-[#A6AAB2]" />
                      ) : (
                        <Radio className="h-3 w-3 shrink-0 text-[#A6AAB2]" />
                      )}
                      <span className="truncate text-[11px] text-[#71757E]">{scope.text}</span>
                    </span>

                    <span className="flex w-[120px] items-center gap-2">
                      <span className="font-mono text-[12.5px] font-medium text-[#A6AAB2]">
                        {change.previousPercentage === null ? "—" : `${change.previousPercentage}%`}
                      </span>
                      <ArrowRight className="h-3 w-3 text-[#A6AAB2]" />
                      <span className="font-mono text-[14px] font-semibold text-[#1C1D22]">
                        {item.percentage ?? 0}%
                      </span>
                    </span>

                    <span className="flex w-[96px] items-center justify-end gap-1.5 text-[11.5px] font-semibold text-[#FF5C00]">
                      Ver detalle
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="h-px bg-[#E8E8EC]" />

          <footer className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
            <span className="flex items-center gap-2.5 text-[12px] text-[#71757E]">
              <GitBranch className="h-3.5 w-3.5" />
              {changes.length} {changes.length === 1 ? "versión" : "versiones"} desde el {oldestDate}
            </span>
            <span className="text-[11px] text-[#A6AAB2]">
              Las versiones anteriores no se borran: quedan como registro de lo acordado
            </span>
          </footer>
        </section>

        {/* ── Cómo queda ahora ── */}
        <aside className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:w-[340px]">
          <header className="flex flex-col gap-0.5 px-5 py-[18px]">
            <h3 className="font-display text-[18px] font-semibold text-[#1C1D22]">Cómo queda ahora</h3>
            <p className="text-[12.5px] font-medium text-[#71757E]">
              El reparto que resulta de {changes.length}{" "}
              {changes.length === 1 ? "versión" : "versiones"}
            </p>
          </header>

          <div className="h-px bg-[#E8E8EC]" />

          <div className="flex flex-col gap-4 px-5 py-[18px]">
            {current.map((person) => (
              <div key={`${person.name}-${person.version}`} className="flex flex-col gap-[7px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#1C1D22]">{person.name}</span>
                    {person.version === latestVersion && (
                      <span className="rounded-[10px] bg-[#FFEADD] px-[7px] py-0.5 text-[9.5px] font-semibold text-[#FF5C00]">
                        nuevo en v{latestVersion}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[13px] font-semibold text-[#1C1D22]">
                    {person.percentage}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#F4F5F7]">
                  <div
                    className={`h-full rounded-full ${person.isOwnerRow ? "bg-[#1C1D22]" : "bg-[#FF5C00]"}`}
                    style={{ width: `${Math.min(person.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}

            {distributable > 0 && (
              <p className="text-[11px] text-[#A6AAB2]">
                Se reparten {formatMoney(distributable)} entre {current.length}{" "}
                {current.length === 1 ? "persona" : "personas"}.
              </p>
            )}
          </div>

          <div className="h-px bg-[#E8E8EC]" />

          <footer className="flex items-center gap-2 px-5 py-3.5">
            {assigned === 100 ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#2FB37E]" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#EA580C]" />
            )}
            <span
              className={`text-[11.5px] font-semibold ${
                assigned === 100 ? "text-[#2FB37E]" : "text-[#EA580C]"
              }`}
            >
              {assigned === 100
                ? "100% asignado: no queda nada suelto"
                : `${assigned}% asignado · falta repartir ${100 - assigned}%`}
            </span>
          </footer>
        </aside>
      </div>

      {selected && (
        <VersionDetailModal
          change={selected}
          isCurrent={(selected.item.version ?? 0) === latestVersion}
          latestVersion={latestVersion}
          onClose={() => setSelectedKey(null)}
        />
      )}
    </>
  );
};

/** Envoltura de tarjeta para los estados de carga, error y vacío. */
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
    {children}
  </div>
);

/** Ficha de una versión: enseña qué cambió respecto a la anterior, no solo cómo quedó. */
const VersionDetailModal = ({
  change,
  isCurrent,
  latestVersion,
  onClose,
}: {
  change: SplitChange;
  isCurrent: boolean;
  latestVersion: number;
  onClose: () => void;
}) => {
  const { item } = change;
  const scope = scopeOf(item);
  const before = change.previousPercentage;
  const after = item.percentage ?? 0;
  const delta = before === null ? null : after - before;

  const rows = [
    {
      icon: Globe,
      label: "Países",
      value: item.countriesType === "all" ? "Todos" : item.selectedCountries?.join(", ") || "—",
    },
    {
      icon: Radio,
      label: "Plataformas",
      value: item.platformsType === "all" ? "Todas" : item.selectedPlatforms?.join(", ") || "—",
    },
    {
      icon: Hash,
      label: "Versión",
      value: isCurrent
        ? `v${item.version} · vigente`
        : `v${item.version} · sustituida por la v${latestVersion}`,
    },
    { icon: User, label: "Modificado por", value: item.updatedBy?.name || "—" },
    { icon: Calendar, label: "Fecha", value: formatDateTime(splitDate(item)) },
  ];

  const who = item.role === "owner" ? "Split del owner" : `Split de ${change.subject}`;

  return (
    <ModalShell
      title={`${who} · v${item.version}`}
      subtitle={`${ACTION_LABEL[item.action] === "creado" ? "Creado" : "Modificado"} el ${formatDate(splitDate(item))}`}
      logo={
        <ModalMark>
          <GitBranch className="h-[18px] w-[18px]" />
        </ModalMark>
      }
      onClose={onClose}
      footer={
        <>
          <FooterNote>
            {isCurrent
              ? "Esta es la versión que se aplica al reparto de hoy."
              : `Esta versión ya no está vigente: la sustituyó la v${latestVersion}.`}
          </FooterNote>
          <SecondaryButton onClick={onClose}>Cerrar</SecondaryButton>
        </>
      }
    >
      <div className="flex flex-col gap-2.5 rounded-[18px] bg-[#F4F5F7] px-5 py-[18px]">
        <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#A6AAB2]">
          QUÉ CAMBIÓ
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[26px] font-medium text-[#A6AAB2]">
            {before === null ? "—" : `${before}%`}
          </span>
          <ArrowRight className="h-[18px] w-[18px] text-[#A6AAB2]" />
          <span className="font-mono text-[26px] font-semibold text-[#1C1D22]">{after}%</span>
          {delta !== null && delta !== 0 && (
            <span
              className={`rounded-[12px] px-2.5 py-1 text-[10.5px] font-semibold ${
                delta > 0 ? "bg-[#E4F5EC] text-[#2FB37E]" : "bg-[#FDECEC] text-[#E5484D]"
              }`}
            >
              {delta > 0 ? "+" : ""}
              {delta} puntos
            </span>
          )}
        </div>
        <p className="text-[11.5px] text-[#71757E]">
          {before === null
            ? `Es el primer split de ${item.role === "owner" ? "el owner" : change.subject} en esta canción.`
            : `El alcance aplicado fue: ${scope.text.toLowerCase()}.`}
        </p>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[#E8E8EC]">
        {rows.map((row, i) => (
          <div key={row.label}>
            {i > 0 && <div className="h-px bg-[#E8E8EC]" />}
            <div className="flex items-center gap-2.5 px-4 py-3">
              <row.icon className="h-3.5 w-3.5 shrink-0 text-[#A6AAB2]" />
              <span className="flex-1 text-[12.5px] text-[#71757E]">{row.label}</span>
              <span className="max-w-[55%] truncate text-right text-[12.5px] font-semibold text-[#1C1D22]">
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
};

export default Historyofsplits;
