import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { BarChart2, PieChart, BarChartHorizontal } from "lucide-react";
import SongService from "../../services/songs";
import spotifyLogo from "../../assets/images/logo/spotify.svg";
import youtubeLogo from "../../assets/images/logo/youtube.svg";
import metaLogo from "../../assets/images/logo/meta.svg";
import amazonLogo from "../../assets/images/logo/amazon.svg";
import appleMusicLogo from "../../assets/images/logo/apple-music.svg";
import deezerLogo from "../../assets/images/logo/deezer.svg";
import tiktokLogo from "../../assets/images/logo/tiktok.svg";

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
  logo?: string;
  streams: number;
  income: number;
  releases: number;
}

type ChartView = "bar" | "donut" | "horizontal";

const platformConfig: Record<string, { color: string; letter: string; logo?: string }> = {
  "Spotify": { color: "#22C55E", letter: "S", logo: spotifyLogo },
  "Apple Music": { color: "#111827", letter: "A", logo: appleMusicLogo },
  "YouTube Official Content": {
    color: "#EF4444",
    letter: "Y",
    logo: youtubeLogo,
  },
  "YouTube UGC": { color: "#EF4444", letter: "Y", logo: youtubeLogo },
  "Deezer": { color: "#6B7280", letter: "D", logo: deezerLogo },
  "Amazon Premium": { color: "#00C7F2", letter: "A", logo: amazonLogo },
  "Amazon Ad-Supported": { color: "#00A8E1", letter: "A", logo: amazonLogo },
  "Facebook / Instagram": { color: "#E4405F", letter: "F", logo: metaLogo },
  "iMusica": { color: "#FF6B35", letter: "I" },
  "Yandex": { color: "#FFCC00", letter: "Y" },
  "iTunes Match": { color: "#FA243C", letter: "I" },
  "Audiomack": { color: "#FFA500", letter: "A" },
  "TikTok": { color: "#000000", letter: "T", logo: tiktokLogo },
  "Otros": { color: "#6366F1", letter: "O" },
};

const chartButtons: {
  view: ChartView;
  icon: React.ReactNode;
  label: string;
}[] = [
  { view: "bar", icon: <BarChart2 className="h-3.5 w-3.5" />, label: "Barras" },
  { view: "donut", icon: <PieChart className="h-3.5 w-3.5" />, label: "Dona" },
  {
    view: "horizontal",
    icon: <BarChartHorizontal className="h-3.5 w-3.5" />,
    label: "Horizontal",
  },
];

const PlatformsCard = () => {
  const [platformData, setPlatformData] = useState<PlatformDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chartView, setChartView] = useState<ChartView>("donut");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await SongService.getStadisticsByPlatformAll();
        const stadistics: PlatformStadistic[] = response?.data || [];

        const totalStreams = stadistics.reduce((sum, item) => sum + (item.totalStreams || 0), 0);

        const mapped: PlatformDataItem[] = stadistics
          .map((item) => {
            const name = item._id || "Otros";
            const percentage =
              totalStreams > 0 ? Math.round((item.totalStreams / totalStreams) * 100) : 0;
            const config = platformConfig[name] || platformConfig["Otros"];

            return {
              name,
              percentage,
              color: config.color,
              letter: config.letter,
              logo: config.logo,
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
            logo: othersConfig.logo,
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

  const visibleData = platformData.slice(0, 5);

  const barOptions: ApexOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false }, background: "transparent" },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "55%",
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      colors: visibleData.map((p) => p.color),
      xaxis: {
        categories: visibleData.map((p) => p.name.split(" ")[0]),
        labels: { style: { fontSize: "10px", colors: "#9CA3AF" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#9CA3AF", fontSize: "10px" },
          formatter: (val: number) => {
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
            if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
            return String(Math.round(val));
          },
        },
      },
      grid: {
        borderColor: "#F3F4F6",
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      legend: { show: false },
      tooltip: {
        theme: "light",
        y: { formatter: (val: number) => formatNumber(val) + " streams" },
      },
    }),
    [visibleData],
  );

  const barSeries = useMemo(
    () => [
      {
        name: "Streams",
        data: visibleData.map((p) => p.streams),
      },
    ],
    [visibleData],
  );

  const donutOptions: ApexOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false }, background: "transparent" },
      labels: visibleData.map((p) => p.name),
      colors: visibleData.map((p) => p.color),
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: "62%" } } },
      legend: {
        position: "bottom",
        fontSize: "10px",
        labels: { colors: "#6B7280" },
        markers: { size: 5 },
        itemMargin: { horizontal: 6, vertical: 2 },
      },
      tooltip: {
        theme: "light",
        y: { formatter: (val: number) => formatNumber(val) + " streams" },
      },
    }),
    [visibleData],
  );

  const donutSeries = useMemo(() => visibleData.map((p) => p.streams), [visibleData]);

  const horizontalOptions: ApexOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false }, background: "transparent" },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: "55%",
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      colors: visibleData.map((p) => p.color),
      xaxis: {
        labels: {
          style: { fontSize: "10px", colors: "#9CA3AF" },
          formatter: (val: string) => {
            const num = Number(val);
            if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
            if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
            return String(Math.round(num));
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#6B7280", fontSize: "10px" },
          formatter: (val: number) => String(val),
        },
      },
      grid: {
        borderColor: "#F3F4F6",
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      legend: { show: false },
      tooltip: {
        theme: "light",
        y: { formatter: (val: number) => formatNumber(val) + " streams" },
      },
    }),
    [visibleData],
  );

  const horizontalSeries = useMemo(
    () => [
      {
        name: "Streams",
        data: visibleData.map((p) => ({
          x: p.name.split(" ")[0],
          y: p.streams,
        })),
      },
    ],
    [visibleData],
  );

  return (
    <div className="col-span-3 row-span-3 h-full rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Platforms</h2>
        </div>
        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-0.5">
          {chartButtons.map(({ view, icon, label }) => (
            <button
              key={view}
              title={label}
              onClick={() => setChartView(view)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                chartView === view
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-orange-500" />
          </div>
        ) : platformData.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <p className="text-sm text-gray-400">No platform data yet</p>
          </div>
        ) : (
          <>
            {/* Chart */}
            {chartView === "bar" && (
              <div className="h-[160px]">
                <ReactApexChart
                  options={barOptions}
                  series={barSeries}
                  type="bar"
                  height="100%"
                  width="100%"
                />
              </div>
            )}
            {chartView === "donut" && (
              <div className="h-[200px]">
                <ReactApexChart
                  options={donutOptions}
                  series={donutSeries}
                  type="donut"
                  height="100%"
                  width="100%"
                />
              </div>
            )}
            {chartView === "horizontal" && (
              <div className="h-[160px]">
                <ReactApexChart
                  options={horizontalOptions}
                  series={horizontalSeries}
                  type="bar"
                  height="100%"
                  width="100%"
                />
              </div>
            )}

            {/* Lista siempre visible */}
            <div className="flex flex-col border-t border-gray-100 pt-2">
              {visibleData.map((platform, index) => (
                <div
                  key={platform.name}
                  className={`flex items-center justify-between py-2.5 ${
                    index < visibleData.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg"
                      style={{
                        backgroundColor: platform.logo ? "#F3F4F6" : platform.color,
                      }}
                    >
                      {platform.logo ? (
                        <img
                          src={platform.logo}
                          alt={platform.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">{platform.letter}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] font-semibold text-gray-900">
                        {platform.name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {formatNumber(platform.streams)} streams
                      </span>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-gray-900">
                    {platform.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlatformsCard;
