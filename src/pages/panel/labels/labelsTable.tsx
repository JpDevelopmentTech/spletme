import {
  Music2, Tag, Play, DollarSign, ArrowRight, Disc3, Layers,
  Plus, CheckCircle, AlertCircle, ArrowUpDown, ChevronUp,
  ChevronDown, Edit3, UserPlus, FolderPlus,
} from 'lucide-react';
import { useLabels } from '../../../hooks/useLabels';
import { Label } from '../../../services/labels';
import Loading from '../../../components/loading/loading';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CreateSplitsByLabelModal from '../../../components/modal/CreateSplitsByLabelModal';
import CreateSplitsByCustomLabelModal from '../../../components/modal/CreateSplitsByCustomLabelModal';
import CreateLabelModal from '../../../components/labels/CreateLabelModal';
import EditLabelModal from '../../../components/labels/EditLabelModal';
import InviteCollaboratorToLabelModal from '../../../components/labels/InviteCollaboratorToLabelModal';

type SortField = 'label' | 'count' | 'totalStreams' | 'totalNetIncome';
type SortOrder = 'asc' | 'desc';

interface ExtendedLabel extends Label {
  _id?: string;
  artisticLabels?: string[];
  createdAt?: string;
}

export default function LabelsTable() {
  const { labels, allLabels, customLabels, loading, error, refreshLabels } = useLabels();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<{ name: string; count: number } | null>(null);
  const [isCreateLabelModalOpen, setIsCreateLabelModalOpen] = useState(false);
  const [customLabelModalOpen, setCustomLabelModalOpen] = useState(false);
  const [selectedCustomLabel, setSelectedCustomLabel] = useState<{ name: string; artisticLabels: string[]; count: number } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState<{ id: string; name: string; artisticLabels: string[] } | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [labelToInvite, setLabelToInvite] = useState<{
    labelType: 'artistic' | 'custom';
    labelIdentifier: string;
    labelName: string;
    songCount: number;
  } | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedLabels = [...allLabels].sort((a, b) => {
    if (a.isCustom && !b.isCustom) return -1;
    if (!a.isCustom && b.isCustom) return 1;

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

  const totalSongs = allLabels.reduce((sum, l) => sum + l.count, 0);
  const totalStreams = allLabels.reduce((sum, l) => sum + l.totalStreams, 0);
  const totalIncome = allLabels.reduce((sum, l) => sum + l.totalNetIncome, 0);

  const handleLabelClick = (labelName: string, isCustom = false) => {
    if (isCustom) {
      navigate(`/panel/labels/custom/${encodeURIComponent(labelName)}`);
    } else {
      navigate(`/panel/labels/${encodeURIComponent(labelName)}`);
    }
  };

  const handleOpenModal = (labelName: string, songCount: number) => {
    setSelectedLabel({ name: labelName, count: songCount });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLabel(null);
    refreshLabels();
  };

  const handleOpenCustomLabelModal = (labelName: string, artisticLabels: string[], songCount: number) => {
    setSelectedCustomLabel({ name: labelName, artisticLabels, count: songCount });
    setCustomLabelModalOpen(true);
  };

  const handleCloseCustomLabelModal = () => {
    setCustomLabelModalOpen(false);
    setSelectedCustomLabel(null);
    refreshLabels();
  };

  const handleOpenEditModal = (id: string, name: string, artisticLabels: string[]) => {
    setLabelToEdit({ id, name, artisticLabels });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setLabelToEdit(null);
  };

  const handleOpenInviteModal = (
    labelType: 'artistic' | 'custom',
    labelIdentifier: string,
    labelName: string,
    songCount: number
  ) => {
    setLabelToInvite({ labelType, labelIdentifier, labelName, songCount });
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
    setLabelToInvite(null);
  };

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatStreams = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />;
    return sortOrder === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-[#F97316]" />
      : <ChevronDown className="w-3.5 h-3.5 text-[#F97316]" />;
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-6 lg:px-10 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Labels Musicales</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona tus canciones organizadas por sello discográfico
          </p>
        </div>
        <button
          onClick={() => setIsCreateLabelModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          Crear Nuevo Label
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-[#F97316]" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Labels</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{allLabels.length}</p>
          <p className="text-xs text-gray-400 mt-1">
            {customLabels.length} personalizados · {labels.length} artísticos
          </p>
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
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Streams</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatStreams(totalStreams)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Ingresos</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {allLabels.length === 0 && !loading && (
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <Disc3 className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Sin labels</p>
          <p className="text-xs text-gray-400 mb-4">
            Aún no tienes canciones con labels asignados
          </p>
          <button
            onClick={() => setIsCreateLabelModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Crear primer label
          </button>
        </div>
      )}

      {/* Table */}
      {allLabels.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <button
                      onClick={() => handleSort('label')}
                      className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                    >
                      Label
                      <SortIcon field="label" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <button
                      onClick={() => handleSort('count')}
                      className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                    >
                      Canciones
                      <SortIcon field="count" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    <button
                      onClick={() => handleSort('totalStreams')}
                      className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                    >
                      Streams
                      <SortIcon field="totalStreams" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                    <button
                      onClick={() => handleSort('totalNetIncome')}
                      className="flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                    >
                      Ingresos
                      <SortIcon field="totalNetIncome" />
                    </button>
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedLabels.map((label, index) => (
                  <tr
                    key={label.isCustom ? `custom-${index}` : `artistic-${index}`}
                    className={`transition-colors cursor-pointer ${
                      label.isCustom
                        ? 'bg-orange-50/40 hover:bg-orange-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleLabelClick(label.label, label.isCustom)}
                  >
                    {/* Label name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {label.isCustom ? (
                          <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Layers className="w-4 h-4 text-[#F97316]" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Tag className="w-4 h-4 text-[#F97316]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {label.label || 'Sin Label'}
                            </p>
                            {label.isCustom && (
                              <span className="flex-shrink-0 px-2 py-0.5 bg-orange-100 text-[#F97316] text-xs font-semibold rounded-full">
                                Personalizado
                              </span>
                            )}
                          </div>
                          {label.isCustom && (label as ExtendedLabel).artisticLabels?.length ? (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              Incluye: {(label as ExtendedLabel).artisticLabels!.slice(0, 2).join(', ')}
                              {(label as ExtendedLabel).artisticLabels!.length > 2 &&
                                ` +${(label as ExtendedLabel).artisticLabels!.length - 2} más`}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    {/* Count */}
                    <td className="px-4 py-4">
                      <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        {label.count} {label.count === 1 ? 'canción' : 'canciones'}
                      </span>
                    </td>

                    {/* Streams */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm font-medium text-gray-900">
                        {formatStreams(label.totalStreams)}
                      </span>
                    </td>

                    {/* Income */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(label.totalNetIncome)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {label.isCustom ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(
                                  (label as ExtendedLabel)._id || '',
                                  label.label,
                                  (label as ExtendedLabel).artisticLabels || []
                                );
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                              title="Editar label"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden lg:inline">Editar</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenInviteModal(
                                  'custom',
                                  (label as ExtendedLabel)._id || '',
                                  label.label,
                                  label.count
                                );
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                              title="Invitar colaborador"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span className="hidden lg:inline">Invitar</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCustomLabelModal(
                                  label.label,
                                  (label as ExtendedLabel).artisticLabels || [],
                                  label.count
                                );
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">Crear Splits</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLabelClick(label.label, true);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-[#F97316] hover:text-[#F97316] text-gray-600 text-xs font-medium rounded-lg transition-colors"
                            >
                              <span className="hidden sm:inline">Ver</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenInviteModal(
                                  'artistic',
                                  label.label,
                                  label.label,
                                  label.count
                                );
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                              title="Invitar colaborador"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span className="hidden lg:inline">Invitar</span>
                            </button>

                            {label.splitProgress?.hasAllSplits ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 text-xs font-medium rounded-lg">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">Splits Creados</span>
                              </div>
                            ) : (
                              <>
                                {label.splitProgress?.withSplits > 0 && (
                                  <span className="hidden lg:inline-flex px-2 py-1 bg-yellow-50 border border-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg">
                                    {label.splitProgress.percentage}%
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenModal(label.label, label.count);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span className="hidden md:inline">Crear Splits</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLabelClick(label.label, false);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-[#F97316] hover:text-[#F97316] text-gray-600 text-xs font-medium rounded-lg transition-colors"
                            >
                              <span className="hidden sm:inline">Ver</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedLabel && (
        <CreateSplitsByLabelModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          label={selectedLabel.name}
          songCount={selectedLabel.count}
        />
      )}

      <CreateLabelModal
        isOpen={isCreateLabelModalOpen}
        onClose={() => setIsCreateLabelModalOpen(false)}
        availableLabels={labels}
        onSuccess={() => refreshLabels()}
      />

      {selectedCustomLabel && (
        <CreateSplitsByCustomLabelModal
          isOpen={customLabelModalOpen}
          onClose={handleCloseCustomLabelModal}
          labelName={selectedCustomLabel.name}
          artisticLabels={selectedCustomLabel.artisticLabels}
          songCount={selectedCustomLabel.count}
        />
      )}

      {labelToEdit && (
        <EditLabelModal
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          labelId={labelToEdit.id}
          currentName={labelToEdit.name}
          currentArtisticLabels={labelToEdit.artisticLabels}
          availableLabels={labels}
          onSuccess={() => {
            refreshLabels();
            handleCloseEditModal();
          }}
          onDelete={() => refreshLabels()}
        />
      )}

      {labelToInvite && (
        <InviteCollaboratorToLabelModal
          isOpen={inviteModalOpen}
          onClose={handleCloseInviteModal}
          labelType={labelToInvite.labelType}
          labelIdentifier={labelToInvite.labelIdentifier}
          labelName={labelToInvite.labelName}
          songCount={labelToInvite.songCount}
          onSuccess={() => refreshLabels()}
        />
      )}
    </div>
  );
}
