import { motion } from 'framer-motion';
import { Music2, Tag, TrendingUp, ArrowRight, Disc3, DollarSign, Play, ArrowUpDown, Plus, CheckCircle } from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import Loading from '../../../components/loading/loading';
import { useNavigate } from 'react-router-dom';
import Title from '../../../components/title/title';
import { useState } from 'react';
import CreateSplitsByLabelModal from '../../../components/modal/CreateSplitsByLabelModal';

type SortField = 'label' | 'count' | 'totalStreams' | 'totalNetIncome';
type SortOrder = 'asc' | 'desc';

export default function LabelsTable() {
  const { labels, loading, error, refreshLabels } = useLabels();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<{name: string, count: number} | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedLabels = [...labels].sort((a, b) => {
    let aValue: number | string = a[sortField];
    let bValue: number | string = b[sortField];

    if (sortField === 'label') {
      aValue = (a.label || '').toLowerCase();
      bValue = (b.label || '').toLowerCase();
      return sortOrder === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    }

    return sortOrder === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const totalSongs = labels.reduce((sum, label) => sum + label.count, 0);
  const totalStreams = labels.reduce((sum, label) => sum + label.totalStreams, 0);
  const totalIncome = labels.reduce((sum, label) => sum + label.totalNetIncome, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleLabelClick = (labelName: string) => {
    navigate(`/panel/labels/${encodeURIComponent(labelName)}`);
  };

  const handleOpenModal = (labelName: string, songCount: number) => {
    setSelectedLabel({ name: labelName, count: songCount });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLabel(null);
    // Refrescar la lista de labels después de crear splits
    refreshLabels();
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Title title="Labels Musicales" />
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona tus canciones organizadas por sello discográfico
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Labels</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {labels.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Music2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Canciones</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalSongs}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Streams</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalStreams.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Ingresos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalIncome.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {labels.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Disc3 className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No se encontraron labels
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Aún no tienes canciones con labels asignados
            </p>
          </motion.div>
        )}

        {/* Table */}
        {labels.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          >
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('label')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                      >
                        <Tag className="w-4 h-4" />
                        <span>Label</span>
                        <ArrowUpDown className={`w-4 h-4 transition-all ${
                          sortField === 'label' ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-0 group-hover:opacity-50'
                        }`} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('count')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                      >
                        <Music2 className="w-4 h-4" />
                        <span>Canciones</span>
                        <ArrowUpDown className={`w-4 h-4 transition-all ${
                          sortField === 'count' ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-0 group-hover:opacity-50'
                        }`} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left hidden md:table-cell">
                      <button
                        onClick={() => handleSort('totalStreams')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                      >
                        <Play className="w-4 h-4" />
                        <span>Streams</span>
                        <ArrowUpDown className={`w-4 h-4 transition-all ${
                          sortField === 'totalStreams' ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-0 group-hover:opacity-50'
                        }`} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left hidden lg:table-cell">
                      <button
                        onClick={() => handleSort('totalNetIncome')}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Ingresos</span>
                        <ArrowUpDown className={`w-4 h-4 transition-all ${
                          sortField === 'totalNetIncome' ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-0 group-hover:opacity-50'
                        }`} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <TrendingUp className="w-4 h-4" />
                        <span>Top Canciones</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Acciones
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLabels.map((label, index) => (
                    <motion.tr
                      key={index}
                      variants={itemVariants}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer"
                      onClick={() => handleLabelClick(label.label)}
                    >
                      {/* Label Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Tag className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {label.label || 'Sin Label'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Count */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {label.count}
                          </span>
                        </div>
                      </td>

                      {/* Streams */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {label.totalStreams.toLocaleString()}
                        </p>
                      </td>

                      {/* Income */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          ${label.totalNetIncome.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </td>

                      {/* Top Songs */}
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <div className="space-y-1 max-w-xs">
                          {label.topSongs.slice(0, 2).map((song, idx) => (
                            <p key={idx} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              • {song.trackTitle}
                            </p>
                          ))}
                          {label.topSongs.length > 2 && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              +{label.topSongs.length - 2} más
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {/* Split Status Badge */}
                          {label.splitProgress.hasAllSplits ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span className="hidden lg:inline">Splits Creados</span>
                            </div>
                          ) : (
                            <>
                              {label.splitProgress.withSplits > 0 && (
                                <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs">
                                  {label.splitProgress.percentage}%
                                </div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenModal(label.label, label.count);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Crear Splits</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLabelClick(label.label);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <span className="hidden sm:inline">Ver Detalles</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {selectedLabel && (
        <CreateSplitsByLabelModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          label={selectedLabel.name}
          songCount={selectedLabel.count}
        />
      )}
    </div>
  );
}

