import "./home.css";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PlatformsCard from "@/components/platformsCard/platformsCard";
import { DashboardStatsCards } from "@/components/home/DashboardStatsCards";
import { PerformanceChart } from "@/components/home/PerformanceChart";
import { WalletSection } from "@/components/home/WalletSection";
import { TopSongsShowcase } from "@/components/home/TopSongsShowcase";
import { useHomeDashboard } from "@/hooks/useHomeDashboard";
import { useWalletAccountsStatus } from "@/hooks/useWalletAccountsStatus";

/** Cómo se lee cada rango del selector en el subtítulo de la página. */
const TIMEFRAME_LABELS: Record<string, string> = {
  "7d": "los últimos 7 días",
  "30d": "los últimos 30 días",
  "90d": "los últimos 90 días",
  "1y": "el último año",
};

export default function Home() {
  const {
    selectedTimeframe,
    setSelectedTimeframe,
    topSongs,
    summary,
    totalAmount,
    netBalance,
    series,
    chartOptions,
  } = useHomeDashboard();

  const { loading: walletAccountsLoading, sendActive, receiveActive } = useWalletAccountsStatus();

  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#F7F7F9]">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display text-2xl font-semibold text-[#1C1D22]">Inicio</h1>
          <p className="text-[13px] text-[#71757E]">
            Tu catálogo en {TIMEFRAME_LABELS[selectedTimeframe] ?? "el periodo seleccionado"}
          </p>
        </div>

        <DashboardStatsCards
          totalStreams={summary.totalStreams}
          totalNetIncome={summary.totalNetIncome}
          songsCount={summary.songsWithMatches}
          netBalance={netBalance}
          totalAmount={totalAmount}
        />

        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <PerformanceChart
              series={series}
              options={chartOptions}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
              totalStreams={summary.totalStreams}
              totalNetIncome={summary.totalNetIncome}
            />

            <div className="rounded-[26px] border border-[#E8E8EC] bg-white p-[26px] shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)]">
              <div className="mb-[18px] flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <h2 className="font-display text-lg font-semibold text-[#1C1D22]">
                    Canciones Principales
                  </h2>
                  <span className="text-[12.5px] text-[#71757E]">Por ingresos generados</span>
                </div>
                <a
                  href="/panel/music?view=songs"
                  className="flex items-center gap-1 text-[12.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
                >
                  Ver todas
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <TopSongsShowcase songs={topSongs} />
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 lg:w-[352px]">
            <WalletSection
              loading={walletAccountsLoading}
              sendActive={sendActive}
              receiveActive={receiveActive}
              onGoToBank={() => navigate("/panel/wallet")}
            />
            <PlatformsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
