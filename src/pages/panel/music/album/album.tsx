/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Music2,
  Disc3,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import { SpotifyService } from "../../../../services/spotify";
import Loading from "../../../../components/loading/loading";

const Album = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAlbum();
  }, []);

  const getAlbum = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SpotifyService.getAlbum(id || "");
      setAlbum(response);
    } catch {
      setError("No se pudo cargar el álbum. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const totalDurationMs = album?.tracks?.items?.reduce(
    (sum: number, t: any) => sum + (t.duration_ms || 0),
    0
  ) ?? 0;

  if (loading) return <Loading />;

  if (error || !album) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] px-6 lg:px-10 py-8">
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-xl max-w-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-1">
              Error al cargar el álbum
            </p>
            <p className="text-xs text-red-600">{error || "Álbum no encontrado"}</p>
          </div>
        </div>
      </div>
    );
  }

  const artistNames = album.artists?.map((a: any) => a.name).join(", ") || "—";

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-6 lg:px-10 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalle del Álbum</h1>
            <p className="text-sm text-gray-500 mt-0.5">Información y pistas del álbum</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Link to="/panel/music" className="text-gray-400 hover:text-gray-600">
            Música
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[180px]">
            {album.name}
          </span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6">
        {/* Cover */}
        <div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-orange-50 flex items-center justify-center self-center sm:self-start">
          {album.images?.[0]?.url ? (
            <img
              src={album.images[0].url}
              alt={album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Disc3 className="w-12 h-12 text-[#F97316]" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold text-[#F97316] uppercase tracking-wide">
              Álbum
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{album.name}</h2>
            <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <Users className="w-3.5 h-3.5" />
              {artistNames}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#F7F8FA] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Music2 className="w-3.5 h-3.5 text-[#F97316]" />
                </div>
                <span className="text-xs font-medium text-gray-500">Pistas</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{album.total_tracks}</p>
            </div>

            <div className="bg-[#F7F8FA] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Duración</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatDuration(totalDurationMs)}</p>
            </div>

            <div className="bg-[#F7F8FA] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Artistas</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{album.artists?.length ?? 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <Music2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">Pistas</span>
          <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            {album.tracks?.items?.length ?? 0}
          </span>
        </div>

        {album.tracks?.items?.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Título
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  Artistas
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Tipo
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Duración
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {album.tracks.items.map((track: any, index: number) => (
                <tr
                  key={track.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* # */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400 font-medium">{index + 1}</span>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music2 className="w-4 h-4 text-[#F97316]" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                        {track.name}
                      </p>
                    </div>
                  </td>

                  {/* Artists */}
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">
                      {track.artists?.map((a: any) => a.name).join(", ") || "—"}
                    </p>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4 text-center hidden md:table-cell">
                    <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full capitalize">
                      {track.type || "track"}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-gray-600 font-mono">
                      {formatDuration(track.duration_ms || 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Music2 className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Sin pistas</p>
            <p className="text-xs text-gray-400">Este álbum no tiene pistas disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Album;
