/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { ArrowLeft, Music2, DollarSign, TrendingUp, Play, Layers, Sparkles, Tag } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomLabelSongs } from '../../../hooks/useLabels';
import Loading from '../../../components/loading/loading';
import Title from '../../../components/title/title';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';

export default function CustomLabelDetail() {
  const { label } = useParams<{ label: string }>();
  const navigate = useNavigate();
  const { songs, customLabel, loading, error } = useCustomLabelSongs(label || '');

  const decodedLabel = decodeURIComponent(label || '');

  const totalNetIncome = songs.reduce((sum, song) => sum + (song.totalNetIncome || 0), 0);
  const totalStreams = songs.reduce((sum, song) => sum + (song.totalStreams || 0), 0);
  const totalPending = songs.reduce(
    (sum, song) => sum + (song.paymentInfo?.pendingAmount || song.totalNetIncome || 0),
    0
  );

  // Agrupar canciones por artisticLabel
  const songsByArtisticLabel = songs.reduce((acc, song) => {
    const label = song.artisticLabel || 'Sin Label';
    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(song);
    return acc;
  }, {} as Record<string, typeof songs>);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const handleSongClick = (songId: string) => {
    navigate(`/panel/song/${songId}`);
  };

  const items = [
    { label: 'Labels', url: '/panel/labels' },
    { label: decodedLabel, url: `/panel/labels/custom/${label}` },
  ];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={items} />

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/panel/labels')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a Labels</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Title title={decodedLabel || 'Sin Label'} />
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Label Personalizado
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {songs.length} {songs.length === 1 ? 'canción' : 'canciones'} en este label
              </p>
              {customLabel?.artisticLabels && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {customLabel.artisticLabels.map((artisticLabel, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      <Tag className="w-3 h-3 text-indigo-500" />
                      {artisticLabel}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Music2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Canciones</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {songs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ingresos Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalNetIncome.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pendiente</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalPending.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Labels agrupados info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-amber-200/50 dark:border-amber-700/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-amber-800 dark:text-amber-300">
              Labels Artísticos Agrupados ({customLabel?.artisticLabels?.length || 0})
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(songsByArtisticLabel).map(([artisticLabel, labelSongs]) => (
              <div
                key={artisticLabel}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{artisticLabel}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {labelSongs.length} {labelSongs.length === 1 ? 'canción' : 'canciones'}
                  </p>
                </div>
              </div>
            ))}
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

        {/* Songs List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {songs.map((song) => (
            <motion.div
              key={song._id}
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              onClick={() => handleSongClick(song._id)}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer"
            >
              <div className="flex items-start gap-6">
                {/* Album Art */}
                <div className="flex-shrink-0">
                  {song.spotifyData?.album?.images?.[0]?.url ? (
                    <img
                      src={song.spotifyData.album.images[0].url}
                      alt={song.trackTitle}
                      className="w-20 h-20 rounded-xl object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Music2 className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                        {song.trackTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {song.artistName}
                      </p>
                    </div>
                    {/* Badge del label artístico */}
                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      <Tag className="w-3 h-3" />
                      {song.artisticLabel}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ISRC</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {song.isrc || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Streams</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {song.totalStreams.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ingresos</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        ${song.totalNetIncome.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pendiente</p>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        ${(
                          song.paymentInfo?.pendingAmount || song.totalNetIncome
                        ).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Split Owner</p>
                      <p className="text-2xl font-medium text-green-600 dark:text-orange-400">
                        {song.ownerSplit?.conditions?.find((condition: any) => condition.type === 'general')?.percentage ?? 'N/A'}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {songs.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music2 className="w-12 h-12 text-amber-500 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No se encontraron canciones
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No hay canciones registradas para este label personalizado
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

