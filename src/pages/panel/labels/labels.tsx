import { useState, useMemo } from 'react';
import { Music2, Tag, Plus, Search, ArrowRight, AlertCircle, FolderOpen } from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import Loading from '../../../components/loading/loading';
import { useNavigate } from 'react-router-dom';
import CreateLabelModal from '../../../components/labels/CreateLabelModal';

export default function Labels() {
  const { labels, loading, error, refreshLabels } = useLabels();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const totalSongs = labels.reduce((sum, l) => sum + l.count, 0);
  const avgSongs = labels.length > 0 ? Math.round(totalSongs / labels.length) : 0;

  const filteredLabels = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? labels.filter((l) => l.label?.toLowerCase().includes(q)) : labels;
  }, [labels, search]);

  const handleCreateSuccess = () => {
    refreshLabels();
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-6 lg:px-10 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Labels</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona tus sellos discográficos y sus canciones
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Label
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-[#F97316]" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Labels</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{labels.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Music2 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Canciones</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalSongs}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Music2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Promedio por Label</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgSongs}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Labels section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Sellos discográficos</span>
            <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              {filteredLabels.length}
            </span>
          </div>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar label..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] transition-colors"
            />
          </div>
        </div>

        {/* Empty state */}
        {labels.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <FolderOpen className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Sin labels</p>
            <p className="text-xs text-gray-400 mb-4">
              Aún no tienes canciones con labels asignados
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Crear primer label
            </button>
          </div>
        )}

        {/* No search results */}
        {labels.length > 0 && filteredLabels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Sin resultados</p>
            <p className="text-xs text-gray-400 mb-3">
              No se encontraron labels para "{search}"
            </p>
            <button
              onClick={() => setSearch('')}
              className="text-xs font-medium text-[#F97316] hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Grid */}
        {filteredLabels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {filteredLabels.map((label, index) => (
              <button
                key={index}
                onClick={() => navigate(`/panel/labels/${encodeURIComponent(label.label)}`)}
                className="group bg-[#F7F8FA] hover:bg-white border border-gray-200 hover:border-[#F97316] rounded-xl p-5 text-left transition-all"
              >
                {/* Icon + name */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#F97316] transition-colors">
                      {label.label || 'Sin Label'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {label.count} {label.count === 1 ? 'canción' : 'canciones'}
                    </p>
                  </div>
                </div>

                {/* Song count bar */}
                <div className="mb-4">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F97316] rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (label.count / Math.max(...labels.map((l) => l.count), 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Music2 className="w-3.5 h-3.5" />
                    {label.count} {label.count === 1 ? 'track' : 'tracks'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <CreateLabelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        availableLabels={labels}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
