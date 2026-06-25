import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { BarChart2, PieChart, BarChartHorizontal, RefreshCw } from "lucide-react";
import spotifyLogo from "@/assets/images/logo/spotify.svg";
import youtubeLogo from "@/assets/images/logo/youtube.svg";
import metaLogo from "@/assets/images/logo/meta.svg";
import amazonLogo from "@/assets/images/logo/amazon.svg";
import appleMusicLogo from "@/assets/images/logo/apple-music.svg";
import deezerLogo from "@/assets/images/logo/deezer.svg";
import tiktokLogo from "@/assets/images/logo/tiktok.svg";

interface ReproductionData {
  totalStreams: number;
  totalIncome: number;
  releasesCount: number;
  platform: string;
}

interface PlatformsProps {
  reproductions?: ReproductionData[];
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

const chartButtons: { view: ChartView; icon: JSX.Element; label: string }[] = [
  { view: "bar", icon: <BarChart2 className="h-3.5 w-3.5" />, label: "Barras" },
  { view: "donut", icon: <PieChart className="h-3.5 w-3.5" />, label: "Dona" },
  {
    view: "horizontal",
    icon: <BarChartHorizontal className="h-3.5 w-3.5" />,
    label: "Horizontal",
  },
];

const flipStyles = `
  .flip-zone-wrapper {
    perspective: 1200px;
  }
  .flip-zone-inner {
    position: relative;
    width: 100%;
    transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .flip-zone-inner.flipped {
    transform: rotateY(180deg);
  }
  .flip-zone-face {
    width: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .flip-zone-face.back {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: rotateY(180deg);
  }
`;

const Platforms = ({ reproductions = [] }: PlatformsProps) => {
  const [chartView, setChartView] = useState<ChartView>("donut");
  const [isFlipped, setIsFlipped] = useState(false);

  const platformData = useMemo<PlatformDataItem[]>(() => {
    const totalStreams = reproductions.reduce((sum, item) => sum + (item.totalStreams || 0), 0);
    const totalIncome = reproductions.reduce((sum, item) => sum + (item.totalIncome || 0), 0);

    const mapped = reproductions
      .map((item) => {
        const name = item.platform || "Otros";
        const config = platformConfig[name] || platformConfig.Otros;
        return {
          name,
          percentage: totalStreams > 0 ? Math.round((item.totalStreams / totalStreams) * 100) : 0,
          incomePercentage:
            totalIncome > 0 ? Math.round((item.totalIncome / totalIncome) * 100) : 0,
          color: config.color,
          letter: config.letter,
          logo: config.logo,
          streams: item.totalStreams,
          income: item.totalIncome,
          releases: item.releasesCount,
        };
      })
      .sort((a, b) => b.streams - a.streams);

    const platformsWithData = mapped.filter((p) => p.percentage > 0);
    const platformsWithZero = mapped.filter((p) => p.percentage === 0);
    const groupedData: PlatformDataItem[] = [...platformsWithData];

    if (platformsWithZero.length > 0) {
      const othersConfig = platformConfig.Otros;
      const othersStreams = platformsWithZero.reduce((sum, p) => sum + p.streams, 0);
      const othersIncome = platformsWithZero.reduce((sum, p) => sum + p.income, 0);
      const othersData: PlatformDataItem = {
        name: "Otros",
        percentage: totalStreams > 0 ? Math.round((othersStreams / totalStreams) * 100) : 0,
        incomePercentage: totalIncome > 0 ? Math.round((othersIncome / totalIncome) * 100) : 0,
        color: othersConfig.color,
        letter: othersConfig.letter,
        logo: othersConfig.logo,
        streams: othersStreams,
        income: othersIncome,
        releases: platformsWithZero.reduce((sum, p) => sum + p.releases, 0),
      };
      if (othersData.streams > 0 || platformsWithZero.length > 0) groupedData.push(othersData);
    }

    return groupedData;
  }, [reproductions]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const visibleData = platformData.slice(0, 5);

  const visibleDataByIncome = useMemo(
    () => [...platformData].sort((a, b) => b.income - a.income).slice(0, 5),
    [platformData],
  );

  // ── Opciones INGRESOS ────────────────────────────────────────────────────────

  const incomeBarOptions: ApexOptions = useMemo(
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
      colors: visibleDataByIncome.map((p) => p.color),
      xaxis: {
        categories: visibleDataByIncome.map((p) => p.name.split(" ")[0]),
        labels: { style: { fontSize: "10px", colors: "#9CA3AF" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#9CA3AF", fontSize: "10px" },
          formatter: (val: number) => {
            if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
            if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
            return `$${Math.round(val)}`;
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
        y: { formatter: (val: number) => formatCurrency(val) },
      },
    }),
    [visibleDataByIncome],
  );

  const incomeDonutOptions: ApexOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false }, background: "transparent" },
      labels: visibleDataByIncome.map((p) => p.name),
      colors: visibleDataByIncome.map((p) => p.color),
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
        y: { formatter: (val: number) => formatCurrency(val) },
      },
    }),
    [visibleDataByIncome],
  );

  const incomeHorizontalOptions: ApexOptions = useMemo(
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
      colors: visibleDataByIncome.map((p) => p.color),
      xaxis: {
        labels: {
          style: { fontSize: "10px", colors: "#9CA3AF" },
          formatter: (val: string) => {
            const num = Number(val);
            if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
            if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
            return `$${Math.round(num)}`;
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: "#6B7280", fontSize: "10px" } } },
      grid: {
        borderColor: "#F3F4F6",
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      legend: { show: false },
      tooltip: {
        theme: "light",
        y: { formatter: (val: number) => formatCurrency(val) },
      },
    }),
    [visibleDataByIncome],
  );

  // ── Opciones STREAMS ─────────────────────────────────────────────────────────

  const streamsBarOptions: ApexOptions = useMemo(
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
        y: { formatter: (val: number) => `${formatNumber(val)} streams` },
      },
    }),
    [visibleData],
  );

  const streamsDonutOptions: ApexOptions = useMemo(
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
        y: { formatter: (val: number) => `${formatNumber(val)} streams` },
      },
    }),
    [visibleData],
  );

  const streamsHorizontalOptions: ApexOptions = useMemo(
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
      yaxis: { labels: { style: { colors: "#6B7280", fontSize: "10px" } } },
      grid: {
        borderColor: "#F3F4F6",
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      legend: { show: false },
      tooltip: {
        theme: "light",
        y: { formatter: (val: number) => `${formatNumber(val)} streams` },
      },
    }),
    [visibleData],
  );

  // ── Render de una cara ───────────────────────────────────────────────────────

  const renderFace = (mode: "income" | "streams", isBackFace = false) => {
    const isIncome = mode === "income";
    const data = isIncome ? visibleDataByIncome : visibleData;

    const barOpts = isIncome ? incomeBarOptions : streamsBarOptions;
    const donutOpts = isIncome ? incomeDonutOptions : streamsDonutOptions;
    const horizontalOpts = isIncome ? incomeHorizontalOptions : streamsHorizontalOptions;

    const barSeries = isIncome
      ? [{ name: "Ingresos", data: data.map((p) => p.income) }]
      : [{ name: "Streams", data: data.map((p) => p.streams) }];
    const donutSeries = isIncome ? data.map((p) => p.income) : data.map((p) => p.streams);
    const horizontalSeries = isIncome
      ? [
          {
            name: "Ingresos",
            data: data.map((p) => ({ x: p.name.split(" ")[0], y: p.income })),
          },
        ]
      : [
          {
            name: "Streams",
            data: data.map((p) => ({ x: p.name.split(" ")[0], y: p.streams })),
          },
        ];

    // La cara trasera está pre-rotada 180° en Y, lo que espejea las columnas.
    // Intercambiamos el orden para que tras el flip la lista quede siempre a la derecha.
    const chartOrder = isBackFace
      ? "order-2 lg:border-l lg:border-gray-100 lg:pl-6"
      : "order-1 lg:border-r lg:border-gray-100 lg:pr-6";
    const listOrder = isBackFace ? "order-1" : "order-2";

    return (
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Gráfica */}
        <div className={chartOrder}>
          {chartView === "bar" && (
            <div className="h-[200px] lg:h-[230px]">
              <ReactApexChart
                options={barOpts}
                series={barSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </div>
          )}
          {chartView === "donut" && (
            <div className="h-[220px] lg:h-[250px]">
              <ReactApexChart
                options={donutOpts}
                series={donutSeries}
                type="donut"
                height="100%"
                width="100%"
              />
            </div>
          )}
          {chartView === "horizontal" && (
            <div className="h-[200px] lg:h-[230px]">
              <ReactApexChart
                options={horizontalOpts}
                series={horizontalSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </div>
          )}
        </div>

        {/* Lista de plataformas */}
        <div className={listOrder}>
          <div className="flex flex-col rounded-lg border border-gray-100 px-3">
            {data.map((platform, index) => (
              <div
                key={platform.name}
                className={`flex items-center justify-between py-2.5 ${
                  index < data.length - 1 ? "border-b border-gray-100" : ""
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
                    <span className="text-[12px] font-semibold text-gray-900">{platform.name}</span>
                    <span className="text-[11px] text-gray-400">
                      {isIncome
                        ? formatCurrency(platform.income)
                        : `${formatNumber(platform.streams)} streams`}
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
      </div>
    );
  };

  return (
    <>
      <style>{flipStyles}</style>
      <div className="h-full min-h-[420px] rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4">
          {/* ── HEADER FIJO: título + badge + botón flip ─────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">Platforms</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  isFlipped ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {isFlipped ? "Streams" : "Ingresos"}
              </span>
            </div>
            <button
              onClick={() => setIsFlipped((f) => !f)}
              title={isFlipped ? "Ver ingresos" : "Ver streams"}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isFlipped ? "Ver ingresos" : "Ver streams"}</span>
            </button>
          </div>

          {/* ── TOGGLE TIPO DE GRÁFICA FIJO ──────────────────────────────────── */}
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

          {/* ── ZONA QUE GIRA: solo gráfica + lista ──────────────────────────── */}
          {platformData.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <p className="text-sm text-gray-400">No platform data yet</p>
            </div>
          ) : (
            <div className="flip-zone-wrapper">
              <div className={`flip-zone-inner ${isFlipped ? "flipped" : ""}`}>
                {/* FRENTE — Ingresos */}
                <div className="flip-zone-face front">{renderFace("income", false)}</div>
                {/* REVERSO — Streams */}
                <div className="flip-zone-face back">{renderFace("streams", true)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Platforms;
