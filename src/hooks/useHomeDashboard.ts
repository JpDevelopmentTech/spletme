import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { ApexOptions } from "apexcharts";
import UseFilterSongsData from "@/hooks/useFilterSongsData";
import { useSplitPayments } from "@/hooks/useSplitPayments";
import { useWallet } from "@/hooks/useWallet";
import SongService from "@/services/songs";
import type { TopSong } from "@/types";

interface DataPoint {
  label: Date;
  streams: number;
  income: number;
}

const pad = (n: number) => String(n).padStart(2, "0");
const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

interface PeriodSlice {
  startDate: string;
  endDate: string;
  label: Date;
}

function buildPeriods(timeframe: string): PeriodSlice[] {
  const now = new Date();
  const periods: PeriodSlice[] = [];

  if (timeframe === "7d") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      periods.push({ startDate: fmtDate(d), endDate: fmtDate(d), label: d });
    }
  } else if (timeframe === "30d") {
    for (let i = 3; i >= 0; i--) {
      const endD = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7);
      const startD = new Date(endD.getFullYear(), endD.getMonth(), endD.getDate() - 6);
      periods.push({ startDate: fmtDate(startD), endDate: fmtDate(endD), label: new Date(startD) });
    }
  } else if (timeframe === "90d") {
    for (let i = 2; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      periods.push({ startDate: fmtDate(start), endDate: fmtDate(end), label: new Date(start) });
    }
  } else {
    // 1y — 12 months
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      periods.push({ startDate: fmtDate(start), endDate: fmtDate(end), label: new Date(start) });
    }
  }

  return periods;
}

function xaxisLabel(timeframe: string): string {
  if (timeframe === "7d") return "dd MMM";
  if (timeframe === "30d") return "dd MMM";
  return "MMM yyyy";
}

/**
 * Centraliza el estado y la lógica de datos del dashboard principal.
 * Expone datos listos para consumir por los componentes de presentación.
 */
export function useHomeDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("90d");
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

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

  const fetchData = useCallback(async (timeframe: string) => {
    const periods = buildPeriods(timeframe);
    const results = await Promise.all(
      periods.map(async ({ startDate, endDate, label }) => {
        try {
          const res = await SongService.getSongsByFilter("", "", startDate, endDate);
          return {
            label,
            streams: res?.data?.summary?.totalStreams ?? 0,
            income: res?.data?.summary?.totalNetIncome ?? 0,
          };
        } catch {
          return { label, streams: 0, income: 0 };
        }
      })
    );
    setDataPoints(results);
  }, []);

  useEffect(() => {
    fetchData(selectedTimeframe);
  }, [selectedTimeframe, fetchData]);

  const xCategories = useMemo(
    () => dataPoints.map((p) => p.label.toISOString()),
    [dataPoints]
  );

  const series = useMemo(
    () => [
      {
        name: "Streams",
        type: "area",
        data: dataPoints.length > 0 ? dataPoints.map((p) => p.streams) : [],
      },
      {
        name: "Revenue",
        type: "area",
        data: dataPoints.length > 0 ? dataPoints.map((p) => Number(p.income.toFixed(2))) : [],
      },
    ],
    [dataPoints]
  );

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false }, background: "transparent" },
      stroke: { width: [2, 2], curve: "smooth" },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90, 100] },
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
        categories: xCategories,
        labels: {
          style: { fontSize: "11px", colors: "#9CA3AF" },
          datetimeFormatter: { day: "dd MMM", month: "MMM yy" },
          format: xaxisLabel(selectedTimeframe),
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
        x: {
          format: selectedTimeframe === "7d" || selectedTimeframe === "30d"
            ? "dd MMM yyyy"
            : "MMM yyyy",
        },
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
    [xCategories, selectedTimeframe]
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
