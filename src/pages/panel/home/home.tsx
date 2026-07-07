import "./home.css";
import { useNavigate } from "react-router-dom";
import PlatformsCard from "@/components/platformsCard/platformsCard";
import { DashboardStatsCards } from "@/components/home/DashboardStatsCards";
import { PerformanceChart } from "@/components/home/PerformanceChart";
import { WalletSection } from "@/components/home/WalletSection";
import { TopSongsShowcase } from "@/components/home/TopSongsShowcase";
import { useHomeDashboard } from "@/hooks/useHomeDashboard";
import { useWalletAccountsStatus } from "@/hooks/useWalletAccountsStatus";

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

  const {
    loading: walletAccountsLoading,
    sendActive,
    receiveActive,
  } = useWalletAccountsStatus();

  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8">
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
            />

            <div className="rounded-[36px] border border-white/60 bg-white/55 p-7 shadow-[0_16px_40px_-16px_rgba(255,92,0,0.15)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1C1D22]">Canciones Principales</h2>
                <a
                  href="/panel/music/songs"
                  className="text-[12.5px] font-semibold text-[#FF5C00] transition-colors hover:text-[#EA580C]"
                >
                  Ver todas
                </a>
              </div>
              <TopSongsShowcase songs={topSongs} />
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 lg:w-[320px]">
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
