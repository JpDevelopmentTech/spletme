import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { ApexOptions } from "apexcharts";
import UseFilterSongsData from "@/hooks/useFilterSongsData";
import { useSplitPayments } from "@/hooks/useSplitPayments";
import { useWallet } from "@/hooks/useWallet";
import SongService from "@/services/songs";
import type { TopSong } from "@/types";

const MONTH_WEIGHTS = [0.1, 0.12, 0.15, 0.18, 0.2, 0.25];
const WEIGHTS_SUM = MONTH_WEIGHTS.reduce((acc, v) => acc + v, 0);

/**
 * Centraliza el estado y la lógica de datos del dashboard principal.
 * Expone datos listos para consumir por los componentes de presentación.
 */
export function useHomeDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);

  const { totalAmount } = useSplitPayments();
  const { summary } = UseFilterSongsData();
  const { wallet, loading: walletLoading, hasWallet, createWallet, refreshWallet } = useWallet();
  const { user } = useAuth0();

  useEffect(() => {
    SongService.getTopByStreams().then((res: { data?: TopSong[] } | null) => {
      if (res?.data) setTopSongs(res.data);
    });
  }, []);

  // Auto-reload una sola vez por sesión para asegurar datos frescos
  useEffect(() => {
    const key = "panel-home-auto-reloaded";
    if (sessionStorage.getItem(key) === "true") return;
    sessionStorage.setItem(key, "true");
    window.location.reload();
  }, []);

  const monthlyCategories = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      d.setMonth(now.getMonth() - (5 - i));
      return d.toISOString();
    });
  }, []);

  const series = useMemo(
    () => [
      {
        name: "Streams",
        type: "area",
        data: MONTH_WEIGHTS.map((w) => Math.round(((summary.totalStreams ?? 0) * w) / WEIGHTS_SUM)),
      },
      {
        name: "Revenue",
        type: "area",
        data: MONTH_WEIGHTS.map((w) =>
          Number((((summary.totalNetIncome ?? 0) * w) / WEIGHTS_SUM).toFixed(2)),
        ),
      },
    ],
    [summary.totalStreams, summary.totalNetIncome],
  );

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false }, background: "transparent" },
      stroke: { width: [2, 2], curve: "smooth" },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.02,
          stops: [0, 90, 100],
        },
      },
      markers: { size: [0, 0] },
      dataLabels: { enabled: false },
      colors: ["#111827", "#22C55E"],
      grid: {
        borderColor: "#F3F4F6",
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      xaxis: {
        type: "datetime",
        categories: monthlyCategories,
        labels: {
          style: { fontSize: "11px", colors: "#9CA3AF" },
          datetimeFormatter: { month: "MMM" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: [
        {
          seriesName: "Streams",
          labels: {
            style: { colors: "#9CA3AF", fontSize: "11px" },
            formatter: (val: number) => {
              if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
              if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
              return String(Math.round(val));
            },
          },
        },
        {
          seriesName: "Revenue",
          opposite: true,
          labels: {
            style: { colors: "#22C55E", fontSize: "11px" },
            formatter: (val: number) => `$${val.toFixed(2)}`,
          },
        },
      ],
      tooltip: {
        x: { format: "MMM yyyy" },
        theme: "light",
        style: { fontSize: "12px" },
        y: [
          {
            formatter: (val: number) => {
              if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M streams`;
              if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K streams`;
              return `${Math.round(val)} streams`;
            },
          },
          { formatter: (val: number) => `$${val.toFixed(2)}` },
        ],
      },
      legend: { show: false },
    }),
    [monthlyCategories],
  );

  const netBalance = (summary.totalNetIncome ?? 0) - totalAmount;
  const walletBalance = wallet?.accounts?.[0]?.balance ?? 0;

  return {
    user,
    selectedTimeframe,
    setSelectedTimeframe,
    topSongs,
    summary,
    totalAmount,
    netBalance,
    wallet,
    walletBalance,
    walletLoading,
    hasWallet,
    createWallet,
    refreshWallet,
    series,
    chartOptions,
  };
}
