import { AnimatePresence, motion } from "framer-motion";
import { Disc, X, Save } from "lucide-react";
import { createPortal } from "react-dom";
import { useAlbumOwnerSplit } from "@/hooks/useAlbumOwnerSplit";
import { OwnerSplitConfigForm } from "@/components/album-owner-split/OwnerSplitConfigForm";
import { OwnerSplitProgressView } from "@/components/album-owner-split/OwnerSplitProgressView";
import { OwnerSplitResultsView } from "@/components/album-owner-split/OwnerSplitResultsView";
import type { AlbumOwnerSplitModalProps } from "@/types/album-owner-split.types";

export default function AlbumOwnerSplitModal({
  isOpen,
  onClose,
  album,
  onSplitsCreated,
}: AlbumOwnerSplitModalProps) {
  const {
    mounted,
    ownerForm,
    isExpanded,
    isLoading,
    isLoadingFilters,
    countryOptions,
    platformOptions,
    progress,
    showResults,
    autoCloseCountdown,
    currentUser,
    toggleExpanded,
    updateOwnerForm,
    createBulkOwnerSplits,
    closeWithReset,
  } = useAlbumOwnerSplit(isOpen, album, onClose, onSplitsCreated);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex w-full items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWithReset}
        >
          <motion.div
            className="mx-4 flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-8 text-white">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(245,158,11,0.2), rgba(249,115,22,0.2))",
                    "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(245,158,11,0.2))",
                    "linear-gradient(45deg, rgba(245,158,11,0.2), rgba(249,115,22,0.2))",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Disc className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.h2
                      className="mb-1 text-3xl font-bold"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      Configurar Split del Owner - Álbum
                    </motion.h2>
                    <motion.p
                      className="text-lg text-white/80"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {album?.releaseTitle ?? album?.albumTitle ?? "Álbum"} —{" "}
                      {album.tracks?.length ?? 0} canciones
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  onClick={closeWithReset}
                  className="rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
              {showResults && progress ? (
                <OwnerSplitResultsView
                  progress={progress}
                  autoCloseCountdown={autoCloseCountdown}
                />
              ) : isLoading && progress ? (
                <OwnerSplitProgressView progress={progress} />
              ) : (
                <OwnerSplitConfigForm
                  ownerForm={ownerForm}
                  isExpanded={isExpanded}
                  tracksCount={album.tracks?.length ?? 0}
                  currentUser={currentUser}
                  isLoadingFilters={isLoadingFilters}
                  countryOptions={countryOptions}
                  platformOptions={platformOptions}
                  onToggleExpanded={toggleExpanded}
                  onUpdateForm={updateOwnerForm}
                />
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {showResults
                    ? "Proceso completado"
                    : `Configurando split para ${album.tracks?.length ?? 0} canciones`}
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={closeWithReset}
                    className="px-6 py-3 font-medium text-gray-600 transition-colors hover:text-gray-900"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showResults ? "Cerrar" : "Cancelar"}
                  </motion.button>

                  {!showResults && !isLoading && (
                    <motion.button
                      onClick={createBulkOwnerSplits}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Save className="h-4 w-4" />
                      Crear Splits para Todas las Canciones
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
