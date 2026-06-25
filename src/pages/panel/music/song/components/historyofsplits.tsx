import { useEffect, useMemo, useState } from "react";
import Title from "../../../../../components/title/title";
import Button from "../../../../../components/atoms/button";
import { songSplitsService } from "../../../../../services/songSplits";
import type { SplitHistoryItem } from "../../../../../types/song-split.types";

interface HistoryOfSplitsProps {
  songId?: string;
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

const getSplitDate = (split: SplitHistoryItem) =>
  split.updatedAt || split.createdAt;

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
          (split._id || `split-history-${index}`) === selectedSplitKey,
      ) || null
    );
  }, [allSplits, selectedSplitKey]);

  const selectedSplitData = selectedSplit;
  const collaboratorName = selectedSplitData?.updatedBy?.name || "—";
  const collaboratorEmail = selectedSplitData?.updatedBy?.email || "—";

  return (
    <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex w-full items-center justify-between">
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
                  const splitKey = split._id || `split-history-${index}`;
                  const splitDate = getSplitDate(split);
                  const splitData = split;

                  return (
                    <button
                      key={splitKey}
                      type="button"
                      onClick={() => setSelectedSplitKey(splitKey)}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">
                          {formatDate(splitDate)}
                        </span>
                        {splitData.action && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${getActionColor(splitData.action)}`}
                          >
                            {getActionLabel(splitData.action)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-orange-500">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelectedSplitKey(null)}
        >
          <div
            className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-gray-200/60 bg-white dark:border-white/10 dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 pb-4 pt-5 dark:border-white/10">
              <div>
                <p className="mb-1 text-[11px] font-medium uppercase tracking-widest text-gray-400">
                  Detalle del split
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {collaboratorName}
                </p>
                <p className="mt-0.5 text-[13px] text-gray-400">
                  {collaboratorEmail}
                </p>
              </div>
              <button
                onClick={() => setSelectedSplitKey(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-white/10 dark:hover:bg-white/5"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Métricas destacadas */}
            <div className="grid grid-cols-3 gap-2 px-6 pt-4">
              <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/5">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  Porcentaje
                </p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {selectedSplitData.percentage ?? 0}%
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/5">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  Rol
                </p>
                <p className="text-lg font-medium capitalize text-gray-900 dark:text-white">
                  {selectedSplitData.role || "—"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-white/5">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  Acción
                </p>
                <p className="text-lg font-medium capitalize text-gray-900 dark:text-white">
                  {getActionLabel(selectedSplitData.action)}
                </p>
              </div>
            </div>

            {/* Filas de datos */}
            <div className="flex flex-col divide-y divide-gray-100 px-6 py-4 text-[13px] dark:divide-white/10">
              {[
                {
                  label: "Países",
                  value:
                    selectedSplitData.countriesType === "all"
                      ? "Todos"
                      : selectedSplitData.selectedCountries?.join(", ") || "—",
                },
                {
                  label: "Plataformas",
                  value:
                    selectedSplitData.platformsType === "all"
                      ? "Todas"
                      : selectedSplitData.selectedPlatforms?.join(", ") || "—",
                },
                {
                  label: "Versión",
                  value:
                    selectedSplitData.version != null
                      ? String(selectedSplitData.version)
                      : "—",
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
                  <span className="max-w-[60%] text-right font-medium text-gray-900 dark:text-white">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5">
              <button
                onClick={() => setSelectedSplitKey(null)}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
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
