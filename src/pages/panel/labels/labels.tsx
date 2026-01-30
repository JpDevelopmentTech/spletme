import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Tag, TrendingUp, ArrowRight, Disc3, Plus, FolderPlus } from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import Loading from '../../../components/loading/loading';
import { useNavigate } from 'react-router-dom';
import Title from '../../../components/title/title';
import CreateLabelModal from '../../../components/labels/CreateLabelModal';

export default function Labels() {
  const { labels, loading, error, refreshLabels } = useLabels();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleLabelClick = (labelName: string) => {
    navigate(`/panel/labels/${encodeURIComponent(labelName)}`);
  };

  const handleCreateSuccess = () => {
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
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
          <Title title="Labels Musicales" />
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona tus canciones organizadas por sello discográfico
          </p>
          </div>
          
          {/* Create Label Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span>Crear Nuevo Label</span>
          </motion.button>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
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
                  {labels.reduce((sum, label) => sum + label.count, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Label</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {labels.length > 0
                    ? Math.round(labels.reduce((sum, label) => sum + label.count, 0) / labels.length)
                    : 0}
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

        {/* Labels Grid */}
        {labels.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Disc3 className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No se encontraron labels
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Aún no tienes canciones con labels asignados
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FolderPlus className="w-5 h-5" />
              Crear tu primer label
            </motion.button>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {/* Create New Label Card */}
          {labels.length > 0 && (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="group cursor-pointer"
            >
              <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-600 flex flex-col items-center justify-center min-h-[240px]">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-2 text-center">
                  Crear Nuevo Label
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Agrupa tus labels artísticos
                </p>
              </div>
            </motion.div>
          )}

          {labels.map((label, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLabelClick(label.label)}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-700">
                {/* Label Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Tag className="w-8 h-8 text-white" />
                </div>

                {/* Label Name */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {label.label || 'Sin Label'}
                </h3>

                {/* Song Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {label.count} {label.count === 1 ? 'canción' : 'canciones'}
                    </span>
                  </div>
                </div>

                {/* View Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                    Ver canciones
                  </span>
                  <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Create Label Modal */}
      <CreateLabelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        availableLabels={labels}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
