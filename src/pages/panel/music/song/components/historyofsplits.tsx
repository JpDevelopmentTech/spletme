import { useEffect, useMemo, useState } from "react";
import Title from "../../../../../components/title/title";
import Button from "../../../../../components/atoms/button";
import type { Split } from "../../../../../services/splits";
import { useSplits } from "../../../../../hooks/useSplits";

interface HistoryOfSplitsProps {
  songId?: string;
}

type SplitHistoryItem = Split & {
  action?: string;
  percentage?: number;
  countriesType?: string;
  platformsType?: string;
  selectedCountries?: string[];
  selectedPlatforms?: string[];
  version?: number;
  role?: string;
  userId?: string;
  updatedBy?: { _id: string; username: string; name: string; email: string };
};

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

const getSplitDate = (split: Split) => split.updatedAt || split.createdAt;

const getActionLabel = (action?: string) => {
  const actions: Record<string, string> = {
    create: "Creado",
    update: "Modificado",
    delete: "Eliminado",
  };
  return actions[action || ""] || "—";
};

const getActionColor = (action?: string) => {
  const colors: Record<string, string> = {
    create: "text-green-600 bg-green-50 dark:bg-green-900/20",
    update: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    delete: "text-red-600 bg-red-50 dark:bg-red-900/20",
  };
  return colors[action || ""] || "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
};

const Historyofsplits = ({ songId }: HistoryOfSplitsProps) => {
  const [viewData, setViewData] = useState(true);
  const [selectedSplitKey, setSelectedSplitKey] = useState<string | null>(null);
  const [historySplits, setHistorySplits] = useState<Split[]>([]);
  const { getSongSplitHistory, loading } = useSplits();

  useEffect(() => {
    if (!songId) {
      setHistorySplits([]);
      return;
    }

    getSongSplitHistory(songId).then(setHistorySplits);
  }, [songId, getSongSplitHistory]);

  const allSplits = useMemo(() => {
    const safeSplits = Array.isArray(historySplits) ? historySplits : [];

    return [...safeSplits].sort((a, b) => {
      const aDate = getSplitDate(a);
      const bDate = getSplitDate(b);
      const aTime = aDate ? new Date(aDate).getTime() : 0;
      const bTime = bDate ? new Date(bDate).getTime() : 0;
      return bTime - aTime;
    });
  }, [historySplits]);

  const selectedSplit = useMemo(() => {
    if (!selectedSplitKey) return null;
    return (
      allSplits.find(
        (split, index) =>
          (split.id || `split-history-${index}`) === selectedSplitKey,
      ) || null
    );
  }, [allSplits, selectedSplitKey]);

  const selectedSplitData = selectedSplit as SplitHistoryItem | null;
  const collaboratorName = selectedSplitData?.updatedBy?.name || selectedSplitData?.collaborator?.name || "—";
  const collaboratorEmail = selectedSplitData?.updatedBy?.email || selectedSplitData?.collaborator?.email || "—";

  return (
    <div className="col-span-12 p-6 rounded-xl border border-gray-200 bg-white">
      <div className="flex justify-between items-center w-full">
        <Title title="Historial de splits" />
        <Button onClick={() => setViewData(!viewData)} type="primary">
          {viewData ? "Ver menos" : "Ver más"}
        </Button>
      </div>

      {viewData && (
        <div className="mt-4">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Cargando historial de splits...
            </div>
          ) : allSplits.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No hay historial de splits para mostrar.
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {allSplits.map((split, index) => {
                  const splitKey = split.id || `split-history-${index}`;
                  const splitDate = getSplitDate(split);
                  const splitData = split as SplitHistoryItem;

                  return (
                    <button
                      key={splitKey}
                      type="button"
                      onClick={() => setSelectedSplitKey(splitKey)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">
                          {formatDate(splitDate)}
                        </span>
                        {splitData.action && (
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getActionColor(splitData.action)}`}
                          >
                            {getActionLabel(splitData.action)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-orange-500 font-semibold">
                        Ver detalle
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {selectedSplitData && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setSelectedSplitKey(null)}
        >
          <div
            className="w-full max-w-[460px] bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/60 dark:border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-white/10">
              <div>
                <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-1">
                  Detalle del split
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {collaboratorName}
                </p>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  {collaboratorEmail}
                </p>
              </div>
              <button
                onClick={() => setSelectedSplitKey(null)}
                className="w-7 h-7 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Métricas destacadas */}
            <div className="px-6 pt-4 grid grid-cols-3 gap-2">
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3">
                <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase mb-1">
                  Porcentaje
                </p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {selectedSplitData.percentage ?? 0}%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3">
                <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase mb-1">
                  Rol
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  {selectedSplitData.role || "—"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3">
                <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase mb-1">
                  Acción
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  {getActionLabel(selectedSplitData.action)}
                </p>
              </div>
            </div>

            {/* Filas de datos */}
            <div className="px-6 py-4 flex flex-col divide-y divide-gray-100 dark:divide-white/10 text-[13px]">
              {[
                {
                  label: "Países",
                  value: selectedSplitData.countriesType === "all"
                    ? "Todos"
                    : selectedSplitData.selectedCountries?.join(", ") || "—",
                },
                {
                  label: "Plataformas",
                  value: selectedSplitData.platformsType === "all"
                    ? "Todas"
                    : selectedSplitData.selectedPlatforms?.join(", ") || "—",
                },
                {
                  label: "Versión",
                  value: selectedSplitData.version != null ? String(selectedSplitData.version) : "—",
                },
                {
                  label: "Modificado por",
                  value: selectedSplitData.updatedBy?.name || "—",
                },
                {
                  label: "Fecha",
                  value: formatDateTime(selectedSplitData.updatedAt),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right max-w-[60%]">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5">
              <button
                onClick={() => setSelectedSplitKey(null)}
                className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-[14px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
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