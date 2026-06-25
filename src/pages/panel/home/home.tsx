import "./home.css";
import PlatformsCard from "@/components/platformsCard/platformsCard";
import { DashboardStatsCards } from "@/components/home/DashboardStatsCards";
import { PerformanceChart } from "@/components/home/PerformanceChart";
import { TopSongsTable } from "@/components/home/TopSongsTable";
import { useHomeDashboard } from "@/hooks/useHomeDashboard";

export default function Home() {
  const {
    user,
    selectedTimeframe,
    setSelectedTimeframe,
    topSongs,
    summary,
    totalAmount,
    netBalance,
    series,
    chartOptions,
  } = useHomeDashboard();

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="flex flex-col gap-7 px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#111827]">
              Bienvenido de vuelta, {user?.name}
            </h1>
            <p className="text-sm text-[#6B7280]">
              Aquí lo que ha pasado con tu música los últimos días
            </p>
          </div>
          <div className="h-0.5 w-10 rounded-full bg-[#F97316]" />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <DashboardStatsCards
            totalStreams={summary.totalStreams}
            totalNetIncome={summary.totalNetIncome}
            songsCount={summary.songsWithMatches}
            netBalance={netBalance}
            totalAmount={totalAmount}
          />

          <PerformanceChart
            series={series}
            options={chartOptions}
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
          />

          <PlatformsCard />

          <div className="col-span-9 flex-1 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Canciones Principales
                </h2>
                <a
                  href="/panel/music"
                  className="text-xs font-medium text-orange-500 transition-colors hover:text-orange-600"
                >
                  Ver todas
                </a>
              </div>
              <TopSongsTable songs={topSongs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
