import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { ApexOptions } from "apexcharts";
import UseFilterSongsData from "@/hooks/useFilterSongsData";
import { useSplitPayments } from "@/hooks/useSplitPayments";
import { useWallet } from "@/hooks/useWallet";
import SongService from "@/services/songs";
import type { TopSong } from "@/types";

interface DataPoint {
  date: string;
  streams: number;
  income: number;
}

function xaxisLabel(timeframe: string): string {
  if (timeframe === "7d" || timeframe === "30d") return "dd MMM";
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
    const res = await SongService.getSongsByParams(timeframe);
    const points: DataPoint[] = (res?.data ?? []).map((row) => ({
      date:    row.date,
      streams: row.totalStreams,
      income:  row.totalNetIncome,
    }));
    setDataPoints(points);
  }, []);

  useEffect(() => {
    fetchData(selectedTimeframe);
  }, [selectedTimeframe, fetchData]);

  const xCategories = useMemo(
    () => dataPoints.map((p) => p.date),
    [dataPoints]
  );

  const series = useMemo(
    () => [
      {
        name: "Streams",
        type: "area",
        data: dataPoints.map((p) => p.streams),
      },
      {
        name: "Revenue",
        type: "area",
        data: dataPoints.map((p) => Number(p.income.toFixed(2))),
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
