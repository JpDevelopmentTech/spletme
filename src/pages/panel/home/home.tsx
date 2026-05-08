import { ApexOptions } from "apexcharts";
import "./home.css";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PlatformsCard from "../../../components/platformsCard/platformsCard";
import DashboardTour from "../../../components/tour/DashboardTour";
import {
  Music,
  DollarSign,
  Play,
  Wallet,
  Plus,
  Send,
  History,
  PiggyBank,
  ChevronRight,
} from "lucide-react";
import UseFilterSongsData from "@/hooks/useFilterSongsData";
import { useSplitPayments } from "@/hooks/useSplitPayments";
import { useWallet } from "@/hooks/useWallet";
import CreateWalletModal from "@/components/wallet/CreateWalletModal";
import WithdrawalModal from "@/components/wallet/WithdrawalModal";
import TransferFundsModal from "@/components/wallet/TransferFundsModal";
import WalletService from "@/services/wallet";
import SongService from "@/services/songs";
import { useAuth0 } from "@auth0/auth0-react";
export default function Home() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const { totalAmount } = useSplitPayments();
  const { summary } = UseFilterSongsData();
  const [topSongs, setTopSongs] = useState<any[]>([]);

  useEffect(() => {
    SongService.getTopByStreams().then((res) => {
      if (res?.data) setTopSongs(res.data);
    });
  }, []);

  useEffect(() => {
    const autoReloadKey = "panel-home-auto-reloaded";
    if (sessionStorage.getItem(autoReloadKey) === "true") {
      return;
    }

    sessionStorage.setItem(autoReloadKey, "true");
    window.location.reload();
  }, []);

  const { wallet, loading: walletLoading, hasWallet, createWallet, refreshWallet } = useWallet();
  const { user } = useAuth0();

  // Generar categorías mensuales (últimos 6 meses)
  const monthlyCategories = useMemo(() => {
    const months: string[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      d.setMonth(now.getMonth() - i);
      months.push(d.toISOString());
    }

    return months;
  }, []);

  // Distribución simple para repartir el total entre los meses (suma = 1)
  const monthWeights = useMemo(() => [0.1, 0.12, 0.15, 0.18, 0.2, 0.25], []);
  const weightsSum = monthWeights.reduce((acc, v) => acc + v, 0);

  const series = useMemo(
    () => [
      {
        name: "Streams",
        type: "area",
        data: monthWeights.map((w) =>
          Math.round(((summary.totalStreams || 0) * w) / weightsSum)
        ),
      },
      {
        name: "Revenue",
        type: "area",
        data: monthWeights.map((w) =>
          Number(
            (((summary.totalNetIncome || 0) * w) / weightsSum).toFixed(2)
          )
        ),
      },
    ],
    [summary.totalStreams, summary.totalNetIncome, weightsSum, monthWeights]
  );

  const options: ApexOptions = {
    chart: {
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: {
      width: [2, 2],
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: [0, 0],
    },
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
        {
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      ],
    },
    legend: { show: false },
  };

  const timeframeOptions = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
  ];

  const formatStreams = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val?.toLocaleString() || "0";
  };

  const formatCurrency = (val: number) =>
    `$${val?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`;

  const netBalance = summary.totalNetIncome - totalAmount;

  return (
    <>
      <DashboardTour />

      <div className="min-h-screen bg-[#F7F8FA]">
        <div className="px-6 lg:px-10 py-8 flex flex-col gap-7">
          {/* Header */}
          <div data-tour="hero-header" className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-[#111827]">
                Bienvenido de vuelta, {user?.name}
              </h1>
              <p className="text-sm text-[#6B7280]">
                Aquí lo que ha pasado con tu música los últimos días
              </p>
            </div>
            <div className="w-10 h-0.5 rounded-full bg-[#F97316]" />
          </div>

          {/* Stats Row */}
          <div
            className="grid grid-cols-12 gap-4"
            data-tour="stats-cards"
          >

            {/* Total Streams */}
            <div className="col-span-4 bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">Streams Totales</span>
                <Play className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-[28px] font-bold text-gray-900 leading-tight">
                {formatStreams(summary.totalStreams)}
              </p>
              <span className="text-xs font-medium text-green-500 mt-1 inline-block">
                &uarr; 12.5%
              </span>
            </div>

            {/* Ingresos Totales */}
            <div className="bg-white col-span-4 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">Ingresos Totales</span>
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-[28px] font-bold text-green-500 leading-tight">
                {formatCurrency(summary.totalNetIncome)}
              </p>
              <span className="text-xs font-medium text-green-500 mt-1 inline-block">
                &uarr; 8.2%
              </span>
            </div>

            {/* Canciones */}
            <div className="bg-white col-span-4 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">Canciones</span>
                <Music className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-[28px] font-bold text-gray-900 leading-tight">
                {summary.songsWithMatches?.toLocaleString() || "0"}
              </p>
              <span className="text-xs font-medium text-green-500 mt-1 inline-block">
                &uarr; 15.3%
              </span>
            </div>
            <div className="col-span-8 row-span-2 flex-1 bg-white rounded-xl p-6 border border-gray-200" data-tour="analytics-chart">
              <div className="flex flex-col gap-5 ">
                {/* Chart Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-base font-semibold text-gray-900">Rendimiento</h2>
                    <p className="text-xs text-gray-400">Streams e ingresos en el tiempo</p>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                    {timeframeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${selectedTimeframe === option.value
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                        onClick={() => setSelectedTimeframe(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart Legend */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-gray-900 rounded-sm" />
                    <span className="text-[11px] text-gray-500">Streams</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-sm" />
                    <span className="text-[11px] text-gray-500">Ingresos</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-[280px]">
                  <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>
            </div>

            {/* Net Balance */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 col-span-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">Balance Neto</span>
                <PiggyBank className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-[28px] font-bold text-gray-900 leading-tight">
                {formatCurrency(netBalance)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-green-500">
                  +{formatCurrency(summary.totalNetIncome)}
                </span>
                <span className="text-xs font-medium text-red-500">
                  &ndash;{formatCurrency(totalAmount)}
                </span>
              </div>
            </div>


            <PlatformsCard />

            <div
              className="col-span-2 bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-5"
              data-tour="balance-section"
            >
              {walletLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                </div>
              ) : hasWallet && wallet ? (
                <>
                  {/* Wallet Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Billetera</h2>
                    <span className="px-2.5 py-1 bg-green-50 text-green-500 text-[11px] font-semibold rounded-full">
                      Activa
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="flex flex-col gap-1 py-4 border-y border-gray-100">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                      Balance Disponible
                    </span>
                    <span className="text-[32px] font-bold text-green-500 leading-tight">
                      ${Number(wallet.accounts?.[0]?.balance || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-[11px] text-gray-400">USD</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setIsTransferModalOpen(true)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-orange-500 text-white rounded-[10px] hover:bg-orange-600 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Send className="w-4 h-4" />
                        <span className="text-[13px] font-semibold">Enviar dinero</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsWithdrawalModalOpen(true)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-[#F7F8FA] border border-gray-200 rounded-[10px] hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-[13px] font-medium text-gray-700">Retirar fondos</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between px-4 py-3 bg-[#F7F8FA] border border-gray-200 rounded-[10px] hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <History className="w-4 h-4 text-gray-500" />
                        <span className="text-[13px] font-medium text-gray-700">Ver historial</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Sin billetera */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Billetera</h2>
                  </div>
                  <div className="flex flex-col items-center text-center py-6 gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Sin billetera conectada</h3>
                    <p className="text-xs text-gray-500">
                      Crea tu billetera de pago para comenzar a recibir pagos
                    </p>
                  </div>
                  <button
                    onClick={() => setIsWalletModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-[10px] text-[13px] font-semibold hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Crear billetera
                  </button>
                </>
              )}
            </div>

            <div
              className="flex-1 bg-white rounded-xl p-6 border border-gray-200 col-span-10"
              data-tour="top-songs"
            >
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Canciones Principales</h2>
                  <Link
                    to="/panel/music"
                    className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Ver todas
                  </Link>
                </div>

                {/* Songs Table */}
                {topSongs.length > 0 ? (
                  <div className="flex flex-col">
                    {/* Table Header */}
                    <div className="flex items-center py-2.5 border-b border-gray-100">
                      <div className="flex-1">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase">Canción</span>
                      </div>
                      <div className="w-[100px]">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase">Streams</span>
                      </div>
                      <div className="w-[100px]">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase">Ingresos</span>
                      </div>
                      <div className="w-[80px]">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase">Estado</span>
                      </div>
                    </div>

                    {/* Table Rows */}
                    {topSongs.map((song, index) => (
                      <div
                        key={song._id}
                        className="flex items-center py-3 border-b border-gray-100 last:border-b-0 gap-3"
                      >
                        {/* Cover */}
                        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {song.spotifyData?.album?.images?.[0]?.url ? (
                            <img
                              src={song.spotifyData.album.images[0].url}
                              alt={song.trackTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Music className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                          <span className="text-[13px] font-semibold text-gray-900 truncate">
                            {song.trackTitle || `Canción ${index + 1}`}
                          </span>
                          <span className="text-[11px] text-gray-400 truncate">
                            {song.artistName || ""}
                          </span>
                        </div>
                        <div className="w-[100px]">
                          <span className="text-[13px] font-medium text-gray-900">
                            {formatStreams(song.totalStreams || 0)}
                          </span>
                        </div>
                        <div className="w-[100px]">
                          <span className="text-[13px] font-medium text-green-500">
                            {formatCurrency(song.totalNetIncome || 0)}
                          </span>
                        </div>
                        <div className="w-[80px]">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${index === 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {index === 0 ? "Tendencia" : "Estable"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                      <Music className="w-7 h-7 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700">Sin canciones aún</h3>
                    <p className="text-xs text-gray-400 text-center max-w-xs">
                      Sube tu primera canción para comenzar a ver el rendimiento de tu música
                    </p>
                    <Link
                      to="/panel/music"
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Music className="w-4 h-4" />
                      Subir canción
                    </Link>
                  </div>
                )}
              </div>
            </div>




          </div>


        </div>
      </div>

      {/* Modals */}
      <CreateWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSubmit={async (data: { first_name: string; last_name: string; email: string; phone_number: string; contact_type: string; country: string }) => {
          const result = await createWallet(data);
          if (result.success) {
            setIsWalletModalOpen(false);
            refreshWallet();
          }
          return result;
        }}
      />

      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        walletBalance={wallet?.accounts?.[0]?.balance || 0}
        onWithdrawalSuccess={() => {
          refreshWallet();
        }}
      />

      <TransferFundsModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        walletBalance={wallet?.accounts?.[0]?.balance || 0}
        onTransferConfirm={async (amount, recipientEmail, note) => {
          const result = await WalletService.sendFundsToUser({
            amount,
            recipientEmail,
            note,
          });

          if (!result.error) {
            refreshWallet();
          }

          return result;
        }}
      />
    </>
  );
}
