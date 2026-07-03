import { useEffect, useMemo, useState } from "react";
import {
  GitBranch,
  History,
  ArrowRight,
  X,
  Globe,
  Radio,
  Hash,
  User,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { songSplitsService } from "../../../../../services/songSplits";
import type { SplitHistoryItem } from "../../../../../types/song-split.types";

interface HistoryOfSplitsProps {
  songId?: string;
  isOwner?: boolean;
}

const formatDate = (dateValue?: string) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-CO");
};

const formatTime = (dateValue?: string) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (dateValue?: string) => {
  if (!dateValue) return "—";
  return `${formatDate(dateValue)} ${formatTime(dateValue)}`;
};

const getSplitDate = (split: SplitHistoryItem) => split.updatedAt || split.createdAt;

const ACTION_VERB: Record<string, string> = {
  create: "creado",
  update: "actualizado",
  delete: "eliminado",
};

const formatItemDate = (dateValue?: string) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
};

const getActionLabel = (action?: string) => {
  const actions: Record<string, string> = {
    create: "Creado",
    update: "Modificado",
    delete: "Eliminado",
  };
  return actions[action || ""] || "—";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase() || "?";

const Historyofsplits = ({ songId, isOwner = false }: HistoryOfSplitsProps) => {
  const [selectedSplitKey, setSelectedSplitKey] = useState<string | null>(null);
  const [historySplits, setHistorySplits] = useState<SplitHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!songId) {
      setHistorySplits([]);
      return;
    }

    let active = true;
    setLoading(true);
    songSplitsService
      .getSplitHistoryBySong(songId)
      .then((history) => {
        if (active) setHistorySplits(history);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [songId]);

  const allSplits = useMemo(() => {
    const safeSplits = Array.isArray(historySplits) ? historySplits : [];
    const visible = isOwner ? safeSplits : safeSplits.filter((s) => s.role !== "owner");

    return [...visible].sort((a, b) => {
      const aDate = getSplitDate(a);
      const bDate = getSplitDate(b);
      const aTime = aDate ? new Date(aDate).getTime() : 0;
      const bTime = bDate ? new Date(bDate).getTime() : 0;
      return bTime - aTime;
    });
  }, [historySplits, isOwner]);

  const selectedSplit = useMemo(() => {
    if (!selectedSplitKey) return null;
    return (
      allSplits.find(
        (split, index) => (split._id || `split-history-${index}`) === selectedSplitKey,
      ) || null
    );
  }, [allSplits, selectedSplitKey]);

  const selectedSplitData = selectedSplit;
  const collaboratorName = selectedSplitData?.updatedBy?.name || "—";
  const collaboratorEmail = selectedSplitData?.updatedBy?.email || "—";
  const detailPct = selectedSplitData?.percentage ?? 0;
  const detailActionIsCreate = selectedSplitData?.action === "create";
  const detailRows = [
    {
      icon: Globe,
      label: "Países",
      value:
        selectedSplitData?.countriesType === "all"
          ? "Todos"
          : selectedSplitData?.selectedCountries?.join(", ") || "—",
    },
    {
      icon: Radio,
      label: "Plataformas",
      value:
        selectedSplitData?.platformsType === "all"
          ? "Todas"
          : selectedSplitData?.selectedPlatforms?.join(", ") || "—",
    },
    {
      icon: Hash,
      label: "Versión",
      value: selectedSplitData?.version != null ? `v${selectedSplitData.version}` : "—",
    },
    { icon: User, label: "Modificado por", value: selectedSplitData?.updatedBy?.name || "—" },
    { icon: Calendar, label: "Fecha", value: formatDateTime(selectedSplitData?.updatedAt) },
  ];

  return (
    <div className="rounded-[28px] bg-[#F4F5F7] p-6">
      <div className="flex items-center gap-2.5">
        <GitBranch className="h-[19px] w-[19px] text-[#1C1D22]" />
        <h3 className="text-base font-semibold text-[#1C1D22]">Historial de Splits</h3>
      </div>

      <div className="mt-4">
          {loading ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <History className="h-6 w-6 text-[#A6AAB2]" />
              <p className="text-sm text-[#71757E]">Cargando historial de splits...</p>
            </div>
          ) : allSplits.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <History className="h-6 w-6 text-[#A6AAB2]" />
              <p className="text-sm text-[#71757E]">No hay historial de splits para mostrar.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allSplits.map((split, index) => {
                const splitKey = split._id || `split-history-${index}`;
                const subject =
                  split.role === "owner"
                    ? "del owner"
                    : split.updatedBy?.name
                      ? `de ${split.updatedBy.name}`
                      : "de colaborador";
                const title = `Split ${subject} ${ACTION_VERB[split.action || ""] ?? "actualizado"}`;

                return (
                  <button
                    key={splitKey}
                    type="button"
                    onClick={() => setSelectedSplitKey(splitKey)}
                    className="flex w-full items-center gap-3 rounded-[16px] bg-white px-3.5 py-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#FAFAFB]"
                  >
                    <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[16px] bg-[#FFEADD]">
                      <GitBranch className="h-4 w-4 text-[#FF5C00]" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[13px] font-semibold text-[#1C1D22]">{title}</span>
                      <span className="truncate text-[11px] text-[#A6AAB2]">
                        {formatItemDate(getSplitDate(split))}
                        {split.percentage != null ? ` · ${split.percentage}%` : ""}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[11.5px] font-semibold text-[#FF5C00]">
                      Ver detalle
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      {selectedSplitData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setSelectedSplitKey(null)}
        >
          <div
            className="w-full max-w-[468px] overflow-hidden rounded-[28px] bg-[#F4F5F7] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3.5 px-[22px] pb-[18px] pt-[22px]">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF5C00]">
                <span className="text-base font-bold text-white">{getInitials(collaboratorName)}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px] font-semibold text-[#1C1D22]">{collaboratorName}</p>
                <p className="truncate text-[12.5px] text-[#A6AAB2]">{collaboratorEmail}</p>
              </div>
              <button
                onClick={() => setSelectedSplitKey(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#71757E] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:text-[#1C1D22]"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3.5 px-[22px]">
              {/* Porcentaje hero */}
              <div className="flex items-center gap-[18px] rounded-[22px] bg-white p-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div
                  className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#FF5C00 ${detailPct * 3.6}deg, #EDEEF1 ${detailPct * 3.6}deg)`,
                  }}
                >
                  <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white">
                    <span className="text-[20px] font-bold text-[#1C1D22]">{detailPct}%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A6AAB2]">
                    Porcentaje del split
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#FFEADD] px-2.5 py-1 text-[11.5px] font-semibold capitalize text-[#FF5C00]">
                      {selectedSplitData.role || "—"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                        detailActionIsCreate
                          ? "bg-[#E4F5EC] text-[#2FB37E]"
                          : "bg-[#FFEADD] text-[#FF5C00]"
                      }`}
                    >
                      {detailActionIsCreate ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <GitBranch className="h-3 w-3" />
                      )}
                      {getActionLabel(selectedSplitData.action)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detalles */}
              <div className="rounded-[22px] bg-white px-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {detailRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center gap-3 py-3 ${
                      i > 0 ? "border-t border-[#1C1D22]/[0.06]" : ""
                    }`}
                  >
                    <row.icon className="h-4 w-4 shrink-0 text-[#A6AAB2]" />
                    <span className="text-[13px] text-[#71757E]">{row.label}</span>
                    <span className="ml-auto max-w-[55%] truncate text-right text-[13px] font-semibold text-[#1C1D22]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-[22px] pb-[22px] pt-4">
              <button
                onClick={() => setSelectedSplitKey(null)}
                className="w-full rounded-[16px] bg-[#101114] py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#26272c]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historyofsplits;
