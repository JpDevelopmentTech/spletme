import { useMemo, useState } from "react";
import Title from "../../../../../components/title/title";
import Button from "../../../../../components/atoms/button";
import type { Split } from "../../../../../services/splits";

interface HistoryOfSplitsProps {
  splits: Split[];
  loading?: boolean;
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

const getSplitDate = (split: Split) => split.updatedAt || split.createdAt;

const Historyofsplits = ({ splits, loading = false }: HistoryOfSplitsProps) => {
  const [viewData, setViewData] = useState(true);

  const filteredSplits = useMemo(() => {
    return splits.filter((split) => {
      const status = (split as Split & { status?: string }).status;
      const isStatusActive =
        typeof status === "string" && status.toLowerCase() === "active";
      return !split.isActive && !isStatusActive;
    });
  }, [splits]);

  return (
    <div className="col-span-12 p-6 rounded-xl border border-gray-200 bg-white">
      <div className="flex justify-between items-center w-full">
        <Title title="Historial de splits" />
        <Button onClick={() => setViewData(!viewData)} type="primary">
          {viewData ? "Ver menos" : "Ver más"}
        </Button>
      </div>

      {viewData && (
        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Cargando historial de splits...
            </div>
          ) : filteredSplits.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              No hay historial de splits para mostrar.
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-center">Hora</th>
                  <th className="px-4 py-3 text-center">Colaborador</th>
                  <th className="px-4 py-3 text-center">Porcentaje</th>
                  <th className="px-4 py-3 text-center">Editado por</th>
                </tr>
              </thead>
              <tbody>
                {filteredSplits.map((split, index) => {
                  const splitDate = getSplitDate(split);
                  const percentage = split.generalCondition?.percentage ?? 0;
                  const collaboratorName = split.collaborator?.name || "Owner";
                  const editedBy = split.owner?.name || "Sistema";

                  return (
                    <tr
                      key={split.id || `split-history-${index}`}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{formatDate(splitDate)}</td>
                      <td className="px-4 py-3 text-center">
                        {formatTime(splitDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {collaboratorName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{editedBy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Historyofsplits;
