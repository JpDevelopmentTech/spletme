import { useState, useMemo } from "react";
import { Music2, Tag, Plus, Search, ArrowRight, AlertCircle, FolderOpen } from "lucide-react";
import { useLabels } from "../../../hooks/useLabels";
import Loading from "../../../components/loading/loading";
import { useNavigate } from "react-router-dom";
import CreateLabelModal from "../../../components/labels/CreateLabelModal";

export default function Labels() {
  const { labels, loading, error, refreshLabels } = useLabels();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState("");

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
    <div className="min-h-screen space-y-6 bg-[#F7F8FA] px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Labels</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Gestiona tus sellos discográficos y sus canciones
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Nuevo Label
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <Tag className="h-4 w-4 text-[#F97316]" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Labels</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{labels.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Music2 className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Canciones</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalSongs}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <Music2 className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Promedio por Label</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgSongs}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Labels section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Sellos discográficos</span>
            <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              {filteredLabels.length}
            </span>
          </div>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar label..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#F97316] focus:outline-none"
            />
          </div>
        </div>

        {/* Empty state */}
        {labels.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <FolderOpen className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-700">Sin labels</p>
            <p className="mb-4 text-xs text-gray-400">
              Aún no tienes canciones con labels asignados
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#F97316] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
            >
              <Plus className="h-3.5 w-3.5" />
              Crear primer label
            </button>
          </div>
        )}

        {/* No search results */}
        {labels.length > 0 && filteredLabels.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-700">Sin resultados</p>
            <p className="mb-3 text-xs text-gray-400">No se encontraron labels para "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="text-xs font-medium text-[#F97316] hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Grid */}
        {filteredLabels.length > 0 && (
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLabels.map((label, index) => (
              <button
                key={index}
                onClick={() => navigate(`/panel/labels/${encodeURIComponent(label.label)}`)}
                className="group rounded-xl border border-gray-200 bg-[#F7F8FA] p-5 text-left transition-all hover:border-[#F97316] hover:bg-white"
              >
                {/* Icon + name */}
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
                    <Tag className="h-5 w-5 text-[#F97316]" />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#F97316]">
                      {label.label || "Sin Label"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {label.count} {label.count === 1 ? "canción" : "canciones"}
                    </p>
                  </div>
                </div>

                {/* Song count bar */}
                <div className="mb-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-[#F97316] transition-all"
                      style={{
                        width: `${Math.min(100, (label.count / Math.max(...labels.map((l) => l.count), 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Music2 className="h-3.5 w-3.5" />
                    {label.count} {label.count === 1 ? "track" : "tracks"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#F97316]" />
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
