import {
  ArrowLeft,
  Layers,
  Sparkles,
  Tag,
  AlertCircle,
  Music2,
  DollarSign,
  Play,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCustomLabelSongs } from "../../../hooks/useLabels";
import Loading from "../../../components/loading/loading";

export default function CustomLabelDetail() {
  const { label } = useParams<{ label: string }>();
  const navigate = useNavigate();
  const { songs, customLabel, loading, error } = useCustomLabelSongs(
    label || "",
  );

  const decodedLabel = decodeURIComponent(label || "");
  const artisticLabels = customLabel?.artisticLabels ?? [];

  const totalNetIncome = songs.reduce(
    (sum, song) => sum + (song.totalNetIncome || 0),
    0,
  );
  const totalStreams = songs.reduce(
    (sum, song) => sum + (song.totalStreams || 0),
    0,
  );
  const totalOwnerEarnings = songs.reduce(
    (sum, song) => sum + (song.ownerEarnings || 0),
    0,
  );

  const formatStreams = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen space-y-6 bg-[#F7F8FA] px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/panel/labels")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalle del Sello Personalizado
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Sellos artísticos que conforman este sello
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/panel/labels"
            className="text-gray-400 hover:text-gray-600"
          >
            Labels
          </Link>
          <span className="text-gray-300">/</span>
          <span className="max-w-[180px] truncate font-medium text-gray-900">
            {decodedLabel}
          </span>
        </div>
      </div>

      {/* Label identity */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
        <div className="relative flex-shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-md">
            <Layers className="h-7 w-7 text-white" />
          </div>
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {decodedLabel || "Sin Label"}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {artisticLabels.length}{" "}
            {artisticLabels.length === 1
              ? "sello artístico"
              : "sellos artísticos"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Music2 className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Canciones</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{songs.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">
              Ingresos Total
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalNetIncome)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <Play className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">
              Total Streams
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatStreams(totalStreams)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <DollarSign className="h-4 w-4 text-[#F97316]" />
            </div>
            <span className="text-xs font-medium text-gray-500">
              Ganancias del Owner
            </span>
          </div>
          <p className="text-2xl font-bold text-[#F97316]">
            {formatCurrency(totalOwnerEarnings)}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Artistic labels list */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
          <Tag className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">
            Sellos incluidos
          </span>
          <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
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
                className="flex cursor-pointer items-center gap-3 px-6 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
                  <Tag className="h-4 w-4 text-[#F97316]" />
                </div>
                <span className="truncate text-sm font-semibold text-gray-900">
                  {artisticLabel}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Tag className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-700">
              Sin sellos asociados
            </p>
            <p className="max-w-xs text-xs text-gray-400">
              Este sello personalizado todavía no agrupa ningún sello artístico
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
