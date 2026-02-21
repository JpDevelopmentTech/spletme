import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SongService from "../../services/songs";

interface PlatformStadistic {
  _id: string;
  totalStreams: number;
  totalNetIncome: number;
  releasesCount: number;
}

interface PlatformDataItem {
  name: string;
  percentage: number;
  color: string;
  letter: string;
  streams: number;
  income: number;
  releases: number;
}

const platformConfig: Record<string, { color: string; letter: string }> = {
  "Spotify": { color: "#22C55E", letter: "S" },
  "Apple Music": { color: "#111827", letter: "A" },
  "YouTube Official Content": { color: "#EF4444", letter: "Y" },
  "YouTube UGC": { color: "#EF4444", letter: "Y" },
  "Deezer": { color: "#6B7280", letter: "D" },
  "Amazon Premium": { color: "#00C7F2", letter: "A" },
  "Amazon Ad-Supported": { color: "#00A8E1", letter: "A" },
  "Facebook / Instagram": { color: "#E4405F", letter: "F" },
  "iMusica": { color: "#FF6B35", letter: "I" },
  "Yandex": { color: "#FFCC00", letter: "Y" },
  "iTunes Match": { color: "#FA243C", letter: "I" },
  "Audiomack": { color: "#FFA500", letter: "A" },
  "Otros": { color: "#6366F1", letter: "O" },
};

const PlatformsCard = () => {
  const [platformData, setPlatformData] = useState<PlatformDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await SongService.getStadisticsByPlatformAll();
        const stadistics: PlatformStadistic[] = response?.data || [];

        const totalStreams = stadistics.reduce(
          (sum, item) => sum + (item.totalStreams || 0),
          0
        );

        const mapped: PlatformDataItem[] = stadistics
          .map((item) => {
            const name = item._id || "Otros";
            const percentage =
              totalStreams > 0
                ? Math.round((item.totalStreams / totalStreams) * 100)
                : 0;
            const config = platformConfig[name] || platformConfig["Otros"];

            return {
              name,
              percentage,
              color: config.color,
              letter: config.letter,
              streams: item.totalStreams,
              income: item.totalNetIncome,
              releases: item.releasesCount,
            };
          })
          .sort((a, b) => b.streams - a.streams);

        const platformsWithData = mapped.filter((p) => p.percentage > 0);
        const platformsWithZero = mapped.filter((p) => p.percentage === 0);

        const groupedData: PlatformDataItem[] = [...platformsWithData];

        if (platformsWithZero.length > 0) {
          const othersConfig = platformConfig["Otros"];
          const othersData: PlatformDataItem = {
            name: "Otros",
            percentage: 0,
            color: othersConfig.color,
            letter: othersConfig.letter,
            streams: platformsWithZero.reduce((sum, p) => sum + p.streams, 0),
            income: platformsWithZero.reduce((sum, p) => sum + p.income, 0),
            releases: platformsWithZero.reduce((sum, p) => sum + p.releases, 0),
          };

          if (totalStreams > 0) {
            othersData.percentage = Math.round((othersData.streams / totalStreams) * 100);
          }

          if (othersData.streams > 0 || platformsWithZero.length > 0) {
            groupedData.push(othersData);
          }
        }

        setPlatformData(groupedData);
      } catch (error) {
        console.error("Error loading platform stadistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Platforms</h2>
          <Link
            to="/panel/platforms"
            className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Platform List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          </div>
        ) : platformData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-sm text-gray-400">No platform data yet</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {platformData.slice(0, 4).map((platform, index) => (
              <div
                key={platform.name}
                className={`flex items-center justify-between py-3 ${
                  index < Math.min(platformData.length, 4) - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: platform.color }}
                  >
                    <span className="text-sm font-bold text-white">
                      {platform.letter}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-gray-900">
                      {platform.name}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatNumber(platform.streams)} streams
                    </span>
                  </div>
                </div>
                <span className="text-[13px] font-semibold text-gray-900">
                  {platform.percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformsCard;
