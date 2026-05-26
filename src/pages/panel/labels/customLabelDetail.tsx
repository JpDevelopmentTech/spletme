import { ArrowLeft, Layers, Sparkles, Tag, AlertCircle, Music2, DollarSign, Play } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomLabelSongs } from '../../../hooks/useLabels';
import Loading from '../../../components/loading/loading';

export default function CustomLabelDetail() {
  const { label } = useParams<{ label: string }>();
  const navigate = useNavigate();
  const { songs, customLabel, loading, error } = useCustomLabelSongs(label || '');

  const decodedLabel = decodeURIComponent(label || '');
  const artisticLabels = customLabel?.artisticLabels ?? [];

  const totalNetIncome = songs.reduce((sum, song) => sum + (song.totalNetIncome || 0), 0);
  const totalStreams = songs.reduce((sum, song) => sum + (song.totalStreams || 0), 0);
  const totalOwnerEarnings = songs.reduce(
    (sum, song) => sum + (song.ownerEarnings || 0),
    0
  );

  const formatStreams = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-6 lg:px-10 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/panel/labels')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalle del Sello Personalizado</h1>
            <p className="text-sm text-gray-500 mt-0.5">Sellos artísticos que conforman este sello</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/panel/labels" className="text-gray-400 hover:text-gray-600">
            Labels
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[180px]">{decodedLabel}</span>
        </div>
      </div>

      {/* Label identity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{decodedLabel || 'Sin Label'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {artisticLabels.length}{' '}
            {artisticLabels.length === 1 ? 'sello artístico' : 'sellos artísticos'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Music2 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Canciones</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{songs.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Ingresos Total</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalNetIncome)}</p>
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
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#F97316]" />
            </div>
            <span className="text-xs font-medium text-gray-500">Ganancias del Owner</span>
          </div>
          <p className="text-2xl font-bold text-[#F97316]">{formatCurrency(totalOwnerEarnings)}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Artistic labels list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">Sellos incluidos</span>
          <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            {artisticLabels.length}
          </span>
        </div>

        {artisticLabels.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {artisticLabels.map((artisticLabel) => (
              <li
                key={artisticLabel}
                onClick={() =>
                  navigate(`/panel/labels/${encodeURIComponent(artisticLabel)}`)
                }
                className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-[#F97316]" />
                </div>
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {artisticLabel}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Tag className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Sin sellos asociados
            </p>
            <p className="text-xs text-gray-400 max-w-xs">
              Este sello personalizado todavía no agrupa ningún sello artístico
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
