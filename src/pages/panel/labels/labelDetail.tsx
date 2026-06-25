/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowLeft,
  Music2,
  DollarSign,
  Play,
  Tag,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLabelSongs } from "../../../hooks/useLabels";
import Loading from "../../../components/loading/loading";
import { useState, useMemo } from "react";

type SortField = "title" | "streams" | "revenue";
type SortDir = "asc" | "desc";

export default function LabelDetail() {
  const { label } = useParams<{ label: string }>();
  const navigate = useNavigate();
  const { songs, loading, error } = useLabelSongs(label || "");

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const decodedLabel = decodeURIComponent(label || "");

  const totalNetIncome = songs.reduce((sum, song) => sum + (song.totalNetIncome || 0), 0);
  const totalStreams = songs.reduce((sum, song) => sum + (song.totalStreams || 0), 0);

  // Ganancia del owner: viene precalculada por canción desde el backend
  // (totalNetIncome * % general del ownerSplit). Aquí solo se totaliza.
  const totalOwnerEarnings = songs.reduce((sum, song) => sum + (song.ownerEarnings || 0), 0);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredSongs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? songs.filter(
          (s) =>
            s.trackTitle?.toLowerCase().includes(q) ||
            s.artistName?.toLowerCase().includes(q) ||
            s.isrc?.toLowerCase().includes(q),
        )
      : [...songs];

    filtered.sort((a, b) => {
      let diff = 0;
      if (sortField === "title") {
        diff = (a.trackTitle || "").localeCompare(b.trackTitle || "");
      } else if (sortField === "streams") {
        diff = (a.totalStreams || 0) - (b.totalStreams || 0);
      } else {
        diff = (a.totalNetIncome || 0) - (b.totalNetIncome || 0);
      }
      return sortDir === "asc" ? diff : -diff;
    });

    return filtered;
  }, [songs, search, sortField, sortDir]);

  const formatStreams = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  const formatCurrency = (val: number) =>
    `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-gray-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#F97316]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#F97316]" />
    );
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Detalle del Sello</h1>
            <p className="mt-0.5 text-sm text-gray-500">Canciones y métricas del sello</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/panel/labels" className="text-gray-400 hover:text-gray-600">
            Labels
          </Link>
          <span className="text-gray-300">/</span>
          <span className="max-w-[180px] truncate font-medium text-gray-900">{decodedLabel}</span>
        </div>
      </div>

      {/* Label identity */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50">
          <Tag className="h-7 w-7 text-[#F97316]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{decodedLabel || "Sin Label"}</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {songs.length} {songs.length === 1 ? "canción" : "canciones"} registradas
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
            <span className="text-xs font-medium text-gray-500">Ingresos Total</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalNetIncome)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <Play className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">Total Streams</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatStreams(totalStreams)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <DollarSign className="h-4 w-4 text-[#F97316]" />
            </div>
            <span className="text-xs font-medium text-gray-500">Ganancias del Owner</span>
          </div>
          <p className="text-2xl font-bold text-[#F97316]">{formatCurrency(totalOwnerEarnings)}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">Canciones</span>
            <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              {filteredSongs.length}
            </span>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, artista, ISRC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-[#F97316] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        {filteredSongs.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1.5 transition-colors hover:text-gray-700"
                  >
                    Canción
                    <SortIcon field="title" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ISRC
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <button
                    onClick={() => handleSort("streams")}
                    className="flex items-center gap-1.5 transition-colors hover:text-gray-700"
                  >
                    Streams
                    <SortIcon field="streams" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <button
                    onClick={() => handleSort("revenue")}
                    className="flex items-center gap-1.5 transition-colors hover:text-gray-700"
                  >
                    Ingresos
                    <SortIcon field="revenue" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Split Owner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSongs.map((song) => {
                const ownerPct = song.ownerSplit?.percentage ?? null;

                return (
                  <tr
                    key={song._id}
                    onClick={() => navigate(`/panel/song/${song._id}`)}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    {/* Song */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {song.spotifyData?.album?.images?.[0]?.url ? (
                          <img
                            src={song.spotifyData.album.images[0].url}
                            alt={song.trackTitle}
                            className="h-9 w-9 flex-shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50">
                            <Music2 className="h-4 w-4 text-[#F97316]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {song.trackTitle}
                          </p>
                          <p className="truncate text-xs text-gray-500">{song.artistName}</p>
                        </div>
                      </div>
                    </td>

                    {/* ISRC */}
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-gray-500">{song.isrc || "—"}</span>
                    </td>

                    {/* Streams */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatStreams(song.totalStreams || 0)}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(song.totalNetIncome || 0)}
                      </span>
                    </td>

                    {/* Split Owner */}
                    <td className="px-4 py-4">
                      {ownerPct !== null ? (
                        <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#F97316]">
                          {ownerPct}%
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-400">
                          Sin split
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Music2 className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-700">
              {search ? "Sin resultados" : "No hay canciones"}
            </p>
            <p className="max-w-xs text-xs text-gray-400">
              {search
                ? `No se encontraron canciones para "${search}"`
                : "No hay canciones registradas para este sello"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-xs font-medium text-[#F97316] hover:underline"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
