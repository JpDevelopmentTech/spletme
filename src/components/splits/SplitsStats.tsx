import React, { useEffect, useState } from 'react';
import { useSplits } from '@/hooks/useSplits';
import { type SplitsStats } from '@/services/splits';
import { BarChart3, Users, Percent, TrendingUp, Music } from 'lucide-react';

interface SplitsStatsProps {
  type?: 'owner' | 'collaborator';
  showDetails?: boolean;
}

export const SplitsStatsComponent: React.FC<SplitsStatsProps> = ({
  type = 'owner',
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={loadStats}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
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
      title: 'Total de Splits',
      value: stats.totalSplits,
      icon: Music,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Porcentaje Total',
      value: `${stats.totalPercentage}%`,
      icon: Percent,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Promedio por Split',
      value: `${stats.averagePercentage.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Estadísticas de Splits
        </h3>
        <span className="text-sm text-gray-500 capitalize">
          ({type === 'owner' ? 'Como propietario' : 'Como colaborador'})
        </span>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-4 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detalles adicionales */}
      {showDetails && stats.splits.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Splits Recientes
          </h4>
          
          <div className="space-y-3">
            {stats.splits.slice(0, 5).map((split) => (
              <div
                key={split.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Music className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {split.song?.trackTitle || 'Canción sin título'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {split.collaborator?.name || 'Colaborador'}
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
              <p className="text-sm text-gray-500">
                Mostrando 5 de {stats.splits.length} splits
              </p>
            </div>
          )}
        </div>
      )}

      {/* Resumen */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-indigo-900">Resumen</h4>
        </div>
        <p className="text-sm text-indigo-700">
          {type === 'owner' 
            ? `Tienes ${stats.totalSplits} splits configurados con un total del ${stats.totalPercentage}% de distribución.`
            : `Participas en ${stats.totalSplits} splits con un promedio del ${stats.averagePercentage.toFixed(1)}% por split.`
          }
        </p>
      </div>
    </div>
  );
}; 