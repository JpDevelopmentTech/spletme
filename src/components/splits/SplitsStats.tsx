import React, { useEffect, useState } from "react";
import { useSplits } from "@/hooks/useSplits";
import { type SplitsStats } from "@/services/splits";
import { BarChart3, Users, Percent, TrendingUp, Music } from "lucide-react";

interface SplitsStatsProps {
  type?: "owner" | "collaborator";
  showDetails?: boolean;
}

export const SplitsStatsComponent: React.FC<SplitsStatsProps> = ({
  type = "owner",
  showDetails = true,
}) => {
  const { getStats, loading, error } = useSplits();
  const [stats, setStats] = useState<SplitsStats | null>(null);

  useEffect(() => {
    loadStats();
  }, [type]);

  const loadStats = async () => {
    const statsData = await getStats(type);
    setStats(statsData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={loadStats}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: "Total de Splits",
      value: stats.totalSplits,
      icon: Music,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Porcentaje Total",
      value: `${stats.totalPercentage}%`,
      icon: Percent,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Promedio por Split",
      value: `${stats.averagePercentage.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-semibold text-gray-900">Estadísticas de Splits</h3>
        <span className="text-sm capitalize text-gray-500">
          ({type === "owner" ? "Como propietario" : "Como colaborador"})
        </span>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-lg border border-gray-200 p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detalles adicionales */}
      {showDetails && stats.splits.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5" />
            Splits Recientes
          </h4>

          <div className="space-y-3">
            {stats.splits.slice(0, 5).map((split) => (
              <div
                key={split.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                    <Music className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {split.song?.trackTitle || "Canción sin título"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {split.collaborator?.name || "Colaborador"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-indigo-600">
                    {split.generalCondition.percentage}%
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(split.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {stats.splits.length > 5 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Mostrando 5 de {stats.splits.length} splits</p>
            </div>
          )}
        </div>
      )}

      {/* Resumen */}
      <div className="rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h4 className="font-semibold text-indigo-900">Resumen</h4>
        </div>
        <p className="text-sm text-indigo-700">
          {type === "owner"
            ? `Tienes ${stats.totalSplits} splits configurados con un total del ${stats.totalPercentage}% de distribución.`
            : `Participas en ${stats.totalSplits} splits con un promedio del ${stats.averagePercentage.toFixed(1)}% por split.`}
        </p>
      </div>
    </div>
  );
};
