import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { BarChart2, PieChart, BarChartHorizontal, RefreshCw } from "lucide-react";
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
  incomePercentage: number;
  color: string;
  letter: string;
  logo?: string;
  streams: number;
  income: number;
  releases: number;
}

type ChartView = "bar" | "donut" | "horizontal";

const platformConfig: Record<string, { color: string; letter: string; logo?: string }> = {
  Spotify: { color: "#22C55E", letter: "S", logo: spotifyLogo },
  "Apple Music": { color: "#FC3C44", letter: "A", logo: appleMusicLogo },
  "YouTube Official Content": { color: "#EF4444", letter: "Y", logo: youtubeLogo },
  "YouTube UGC": { color: "#EF4444", letter: "Y", logo: youtubeLogo },
  Deezer: { color: "#6B7280", letter: "D", logo: deezerLogo },
  "Amazon Premium": { color: "#00C7F2", letter: "A", logo: amazonLogo },
  "Amazon Ad-Supported": { color: "#00A8E1", letter: "A", logo: amazonLogo },
  "Facebook / Instagram": { color: "#E4405F", letter: "F", logo: metaLogo },
  iMusica: { color: "#FF6B35", letter: "I" },
  Yandex: { color: "#FFCC00", letter: "Y" },
  "iTunes Match": { color: "#FA243C", letter: "I" },
  Audiomack: { color: "#FFA500", letter: "A" },
  TikTok: { color: "#FF0050", letter: "T", logo: tiktokLogo },
  Otros: { color: "#6366F1", letter: "O" },
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

const flipStyles = `
  .pc-flip-wrapper { perspective: 1200px; }
  .pc-flip-inner {
    position: relative; width: 100%;
    transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .pc-flip-inner.flipped { transform: rotateY(180deg); }
  .pc-flip-face { width: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; }
  .pc-flip-face.back {
    position: absolute; top: 0; left: 0; height: 100%;
    transform: rotateY(180deg);
  }
`;

const PlatformsCard = () => {
  const [platformData, setPlatformData] = useState<PlatformDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartView, setChartView] = useState<ChartView>("donut");
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setLoading(true);
    SongService.getStadisticsByPlatformAll()
      .then((response) => {
        const stats: PlatformStadistic[] = response?.data ?? [];
        const totalStreams = stats.reduce((s, i) => s + (i.totalStreams ?? 0), 0);
        const totalIncome = stats.reduce((s, i) => s + (i.totalNetIncome ?? 0), 0);

        const mapped: PlatformDataItem[] = stats
          .map((item) => {
            const name = item._id || "Otros";
            const cfg = platformConfig[name] ?? platformConfig.Otros;
            return {
              name,
              percentage: totalStreams > 0 ? Math.round((item.totalStreams / totalStreams) * 100) : 0,
              incomePercentage: totalIncome > 0 ? Math.round((item.totalNetIncome / totalIncome) * 100) : 0,
              color: cfg.color,
              letter: cfg.letter,
              logo: cfg.logo,
              streams: item.totalStreams,
              income: item.totalNetIncome,
              releases: item.releasesCount,
            };
          })
          .sort((a, b) => b.streams - a.streams);

        const withData = mapped.filter((p) => p.percentage > 0);
        const withZero = mapped.filter((p) => p.percentage === 0);
        const grouped = [...withData];

        if (withZero.length > 0) {
          const othersStreams = withZero.reduce((s, p) => s + p.streams, 0);
          const othersIncome = withZero.reduce((s, p) => s + p.income, 0);
          const cfg = platformConfig.Otros;
          const others: PlatformDataItem = {
            name: "Otros",
            percentage: totalStreams > 0 ? Math.round((othersStreams / totalStreams) * 100) : 0,
            incomePercentage: totalIncome > 0 ? Math.round((othersIncome / totalIncome) * 100) : 0,
            color: cfg.color, letter: cfg.letter, logo: cfg.logo,
            streams: othersStreams, income: othersIncome,
            releases: withZero.reduce((s, p) => s + p.releases, 0),
          };
          if (others.streams > 0 || withZero.length > 0) grouped.push(others);
        }

        setPlatformData(grouped);
      })
      .catch(() => setPlatformData([]))
      .finally(() => setLoading(false));
  }, []);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const formatCurrency = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const visibleByStreams = useMemo(() => platformData.slice(0, 5), [platformData]);
  const visibleByIncome = useMemo(
    () => [...platformData].sort((a, b) => b.income - a.income).slice(0, 5),
    [platformData],
  );

  // ── Opciones INGRESOS ──────────────────────────────────────────────────────

  const incomeBarOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false }, background: "transparent" },
    plotOptions: { bar: { borderRadius: 5, columnWidth: "55%", borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    colors: visibleByIncome.map((p) => p.color),
    xaxis: {
      categories: visibleByIncome.map((p) => p.name.split(" ")[0]),
      labels: { style: { fontSize: "10px", colors: "#9CA3AF" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "10px" },
        formatter: (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(1)}K` : `$${Math.round(v)}`,
      },
    },
    grid: { borderColor: "#F3F4F6", yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    legend: { show: false },
    tooltip: { theme: "light", y: { formatter: (v: number) => formatCurrency(v) } },
  }), [visibleByIncome]);

  const incomeDonutOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false }, background: "transparent" },
    labels: visibleByIncome.map((p) => p.name),
    colors: visibleByIncome.map((p) => p.color),
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "62%" } } },
    legend: { position: "bottom", fontSize: "10px", labels: { colors: "#6B7280" }, markers: { size: 5 }, itemMargin: { horizontal: 6, vertical: 2 } },
    tooltip: { theme: "light", y: { formatter: (v: number) => formatCurrency(v) } },
  }), [visibleByIncome]);

  const incomeHorizontalOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false }, background: "transparent" },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "55%", borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    colors: visibleByIncome.map((p) => p.color),
    xaxis: {
      labels: {
        style: { fontSize: "10px", colors: "#9CA3AF" },
        formatter: (v: string) => { const n = Number(v); return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K` : `$${Math.round(n)}`; },
      },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#6B7280", fontSize: "10px" } } },
    grid: { borderColor: "#F3F4F6", xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    legend: { show: false },
    tooltip: { theme: "light", y: { formatter: (v: number) => formatCurrency(v) } },
  }), [visibleByIncome]);

  // ── Opciones STREAMS ───────────────────────────────────────────────────────

  const streamsBarOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false }, background: "transparent" },
    plotOptions: { bar: { borderRadius: 5, columnWidth: "55%", borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    colors: visibleByStreams.map((p) => p.color),
    xaxis: {
      categories: visibleByStreams.map((p) => p.name.split(" ")[0]),
      labels: { style: { fontSize: "10px", colors: "#9CA3AF" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "10px" },
        formatter: (v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(1)}K` : String(Math.round(v)),
      },
    },
    grid: { borderColor: "#F3F4F6", yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
    legend: { show: false },
    tooltip: { theme: "light", y: { formatter: (v: number) => `${formatNumber(v)} streams` } },
  }), [visibleByStreams]);

  const streamsDonutOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false }, background: "transparent" },
    labels: visibleByStreams.map((p) => p.name),
    colors: visibleByStreams.map((p) => p.color),
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "62%" } } },
    legend: { position: "bottom", fontSize: "10px", labels: { colors: "#6B7280" }, markers: { size: 5 }, itemMargin: { horizontal: 6, vertical: 2 } },
    tooltip: { theme: "light", y: { formatter: (v: number) => `${formatNumber(v)} streams` } },
  }), [visibleByStreams]);

  const streamsHorizontalOptions: ApexOptions = useMemo(() => ({
    chart: { toolbar: { show: false }, background: "transparent" },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "55%", borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    colors: visibleByStreams.map((p) => p.color),
    xaxis: {
      labels: {
        style: { fontSize: "10px", colors: "#9CA3AF" },
        formatter: (v: string) => { const n = Number(v); return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(Math.round(n)); },
      },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#6B7280", fontSize: "10px" } } },
    grid: { borderColor: "#F3F4F6", xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    legend: { show: false },
    tooltip: { theme: "light", y: { formatter: (v: number) => `${formatNumber(v)} streams` } },
  }), [visibleByStreams]);

  const renderFace = (mode: "income" | "streams") => {
    const isIncome = mode === "income";
    const data = isIncome ? visibleByIncome : visibleByStreams;
    const barOpts = isIncome ? incomeBarOptions : streamsBarOptions;
    const donutOpts = isIncome ? incomeDonutOptions : streamsDonutOptions;
    const horizOpts = isIncome ? incomeHorizontalOptions : streamsHorizontalOptions;
    const barSeries = [{ name: isIncome ? "Ingresos" : "Streams", data: data.map((p) => isIncome ? p.income : p.streams) }];
    const donutSeries = data.map((p) => isIncome ? p.income : p.streams);
    const horizSeries = [{ name: isIncome ? "Ingresos" : "Streams", data: data.map((p) => ({ x: p.name.split(" ")[0], y: isIncome ? p.income : p.streams })) }];

    return (
      <div className="flex flex-col gap-3">
        {/* Gráfica */}
        {chartView === "bar" && (
          <div className="h-[160px]">
            <ReactApexChart options={barOpts} series={barSeries} type="bar" height="100%" width="100%" />
          </div>
        )}
        {chartView === "donut" && (
          <div className="h-[200px]">
            <ReactApexChart options={donutOpts} series={donutSeries} type="donut" height="100%" width="100%" />
          </div>
        )}
        {chartView === "horizontal" && (
          <div className="h-[160px]">
            <ReactApexChart options={horizOpts} series={horizSeries} type="bar" height="100%" width="100%" />
          </div>
        )}

        {/* Lista de plataformas */}
        <div className="flex flex-col border border-gray-100 rounded-lg px-3">
          {data.map((platform, index) => (
            <div
              key={platform.name}
              className={`flex items-center justify-between py-2.5 ${index < data.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: platform.logo ? "#F3F4F6" : platform.color }}
                >
                  {platform.logo ? (
                    <img src={platform.logo} alt={platform.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs font-bold text-white">{platform.letter}</span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-semibold text-gray-900">{platform.name}</span>
                  <span className="text-[11px] text-gray-400">
                    {isIncome ? formatCurrency(platform.income) : `${formatNumber(platform.streams)} streams`}
                  </span>
                </div>
              </div>
              <span className="text-[12px] font-semibold text-gray-900">
                {isIncome ? platform.incomePercentage : platform.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{flipStyles}</style>
      <div className="col-span-3 row-span-3 bg-white rounded-xl p-6 border border-gray-200 h-full">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">Platforms</h2>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors ${
                isFlipped ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
              }`}>
                {isFlipped ? "Streams" : "Ingresos"}
              </span>
            </div>
            <button
              onClick={() => setIsFlipped((f) => !f)}
              title={isFlipped ? "Ver ingresos" : "Ver streams"}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? "Ver ingresos" : "Ver streams"}</span>
            </button>
          </div>

          {/* Toggle tipo de gráfica */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-0.5">
            {chartButtons.map(({ view, icon, label }) => (
              <button
                key={view}
                title={label}
                onClick={() => setChartView(view)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  chartView === view ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
            </div>
          ) : platformData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <p className="text-sm text-gray-400">No platform data yet</p>
            </div>
          ) : (
            <div className="pc-flip-wrapper">
              <div className={`pc-flip-inner ${isFlipped ? "flipped" : ""}`}>
                {/* FRENTE — Ingresos */}
                <div className="pc-flip-face front">
                  {renderFace("income")}
                </div>
                {/* REVERSO — Streams */}
                <div className="pc-flip-face back">
                  {renderFace("streams")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlatformsCard;
