import React, { useEffect, useState } from 'react';
import { useSplits } from '@/hooks/useSplits';
import { type Split } from '@/services/splits';
import { User, Music, Edit, Trash, Plus } from 'lucide-react';

interface SplitsListProps {
  songId: string;
  onEditSplit?: (split: Split) => void;
  onDeleteSplit?: (splitId: string) => void;
  onAddSplit?: () => void;
}

export const SplitsList: React.FC<SplitsListProps> = ({
  songId,
  onEditSplit,
  onDeleteSplit,
  onAddSplit,
}) => {
  const { getSplitsBySong, deleteSplit, loading, error } = useSplits();
  const [splits, setSplits] = useState<Split[]>([]);

  useEffect(() => {
    loadSplits();
  }, [songId]);

  const loadSplits = async () => {
    if (!songId) return;
    
    const splitsData = await getSplitsBySong(songId);
    setSplits(splitsData);
  };

  const handleDeleteSplit = async (splitId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este split?')) {
      const success = await deleteSplit(splitId);
      if (success) {
        await loadSplits(); // Recargar la lista
        onDeleteSplit?.(splitId);
      }
    }
  };

  const getConditionDescription = (split: Split) => {
    const { generalCondition } = split;
    let description = `${generalCondition.percentage}%`;

    // Agregar información de países
    if (generalCondition.countriesType === 'only' && generalCondition.selectedCountries.length > 0) {
      description += ` solo en ${generalCondition.selectedCountries.join(', ')}`;
    } else if (generalCondition.countriesType === 'except' && generalCondition.selectedCountries.length > 0) {
      description += ` excepto en ${generalCondition.selectedCountries.join(', ')}`;
    }

    // Agregar información de plataformas
    if (generalCondition.platformsType === 'only' && generalCondition.selectedPlatforms.length > 0) {
      description += ` solo en ${generalCondition.selectedPlatforms.join(', ')}`;
    } else if (generalCondition.platformsType === 'except' && generalCondition.selectedPlatforms.length > 0) {
      description += ` excepto en ${generalCondition.selectedPlatforms.join(', ')}`;
    }

    return description;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Cargando splits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={loadSplits}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Music className="w-5 h-5" />
          Splits de la Canción
        </h3>
        {onAddSplit && (
          <button
            onClick={onAddSplit}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Split
          </button>
        )}
      </div>

      {splits.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Music className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No hay splits configurados para esta canción</p>
          {onAddSplit && (
            <button
              onClick={onAddSplit}
              className="mt-4 text-indigo-600 hover:text-indigo-800 underline"
            >
              Configurar el primer split
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {splits.map((split) => (
            <div
              key={split.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {split.collaborator?.name || 'Colaborador'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {split.collaborator?.email || 'Email no disponible'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-indigo-600">
                    {split.generalCondition.percentage}%
                  </span>
                  <div className="flex gap-1">
                    {onEditSplit && (
                      <button
                        onClick={() => onEditSplit(split)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Editar split"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSplit(split.id!)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar split"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <strong>Condición:</strong> {getConditionDescription(split)}
                </p>
                
                {split.splitConditions && split.splitConditions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Condiciones específicas:</strong> {split.splitConditions.length} configurada(s)
                    </p>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-400">
                  Creado: {new Date(split.createdAt!).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {splits.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Total de splits: {splits.length}
            </span>
            <span className="text-gray-600">
              Porcentaje total: {splits.reduce((sum, split) => sum + split.generalCondition.percentage, 0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 