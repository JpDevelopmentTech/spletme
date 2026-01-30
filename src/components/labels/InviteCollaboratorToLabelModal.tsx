import { useState } from 'react';
import { X, UserPlus, Layers, Tag, Check, AlertCircle, Loader2, Sparkles, Music2, Users, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LabelsService from '../../services/labels';

interface InviteCollaboratorToLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelType: 'artistic' | 'custom';
  labelIdentifier: string;
  labelName: string;
  songCount: number;
  onSuccess?: () => void;
}

export default function InviteCollaboratorToLabelModal({
  isOpen,
  onClose,
  labelType,
  labelIdentifier,
  labelName,
  songCount,
  onSuccess,
}: InviteCollaboratorToLabelModalProps) {
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [invitationResult, setInvitationResult] = useState<{
    collaboratorName: string;
    collaboratorEmail: string;
    totalSongs: number;
  } | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setError('');

    if (!collaboratorEmail.trim()) {
      setError('El correo electrónico del colaborador es requerido');
      return;
    }

    if (!isValidEmail(collaboratorEmail.trim())) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      const response = await LabelsService.inviteCollaboratorToLabel({
        labelType,
        labelIdentifier,
        collaboratorEmail: collaboratorEmail.trim().toLowerCase(),
      });

      if (response.error) {
        setError(response.message || 'Error al enviar la invitación');
      } else if (response.data) {
        setSuccess(true);
        setInvitationResult({
          collaboratorName: response.data.collaboratorName,
          collaboratorEmail: response.data.collaboratorEmail,
          totalSongs: response.data.totalSongs,
        });
        onSuccess?.();
      }
    } catch (err) {
      console.error('Error inviting collaborator:', err);
      setError('Error al enviar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCollaboratorEmail('');
    setSuccess(false);
    setError('');
    setInvitationResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
                labelType === 'custom' 
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        labelType === 'custom'
                          ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                      }`}>
                        <UserPlus className="w-6 h-6 text-white" />
                      </div>
                      {labelType === 'custom' && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Invitar Colaborador
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        {labelType === 'custom' ? (
                          <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          labelType === 'custom' 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {labelName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {success && invitationResult ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
                      labelType === 'custom'
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                        : 'bg-gradient-to-br from-green-400 to-emerald-500'
                    }`}>
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      ¡Invitación Enviada!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Se ha enviado una invitación a <strong>{invitationResult.collaboratorName}</strong>
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 max-w-sm mx-auto">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email: <span className="font-medium">{invitationResult.collaboratorEmail}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Canciones que se agregarán: <span className="font-medium">{invitationResult.totalSongs}</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                      El colaborador recibirá un email con un enlace para aceptar la invitación.
                      La invitación expira en 7 días.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Info Box */}
                    <div className={`mb-6 p-4 rounded-xl border ${
                      labelType === 'custom'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                        : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          labelType === 'custom'
                            ? 'bg-amber-100 dark:bg-amber-800/30'
                            : 'bg-indigo-100 dark:bg-indigo-800/30'
                        }`}>
                          <Users className={`w-5 h-5 ${
                            labelType === 'custom'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-indigo-600 dark:text-indigo-400'
                          }`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${
                            labelType === 'custom'
                              ? 'text-amber-700 dark:text-amber-300'
                              : 'text-indigo-700 dark:text-indigo-300'
                          }`}>
                            ¿Qué sucede al aceptar?
                          </p>
                          <p className={`text-sm mt-1 ${
                            labelType === 'custom'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-indigo-600 dark:text-indigo-400'
                          }`}>
                            El colaborador será agregado automáticamente a las <strong>{songCount} canciones</strong> de 
                            este label, permitiéndole ver sus métricas y datos.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Song count indicator */}
                    <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className={`p-2 rounded-lg ${
                        labelType === 'custom'
                          ? 'bg-amber-100 dark:bg-amber-800/30'
                          : 'bg-indigo-100 dark:bg-indigo-800/30'
                      }`}>
                        <Music2 className={`w-5 h-5 ${
                          labelType === 'custom'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Canciones en el label
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {songCount}
                        </p>
                      </div>
                    </div>

                    {/* Collaborator Email Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Correo Electrónico del Colaborador
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className={`w-5 h-5 ${
                            labelType === 'custom'
                              ? 'text-amber-500'
                              : 'text-indigo-500'
                          }`} />
                        </div>
                        <input
                          type="email"
                          value={collaboratorEmail}
                          onChange={(e) => setCollaboratorEmail(e.target.value)}
                          placeholder="colaborador@email.com"
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Ingresa el correo electrónico del usuario registrado que deseas invitar
                      </p>
                    </div>

                    {/* Note */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Nota:</strong> Los splits de pago se configuran por separado después de que 
                        el colaborador acepte la invitación.
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                {!success ? (
                  <>
                    <button
                      onClick={handleClose}
                      disabled={loading}
                      className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !collaboratorEmail.trim() || !isValidEmail(collaboratorEmail.trim())}
                      className={`px-6 py-2.5 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md ${
                        labelType === 'custom'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>Enviar Invitación</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleClose}
                    className={`px-6 py-2.5 text-white rounded-lg transition-colors shadow-md ${
                      labelType === 'custom'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                    }`}
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
