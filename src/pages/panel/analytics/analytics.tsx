import { useState, useEffect, useCallback } from 'react';
import type {
  AnalyticsFilters,
  AnalyticsKpis,
  RevenueByPlatformData,
  PieChartEntry,
  TopSong,
  TopArtist,
  TopLabel,
  HistoricalTotal,
  PlatformCountryRow,
  SplitOwnerInfo,
} from '../../../types/analytics.types';
import { analyticsService } from '../../../services/analyticsService';
import AnalyticsFiltersBar from './components/AnalyticsFilters';
import AnalyticsKpisSection from './components/AnalyticsKpis';
import RevenueByPlatformChart from './components/RevenueByPlatformChart';
import RevenuePieCharts from './components/RevenuePieCharts';
import TopChartsSection from './components/TopChartsSection';
import StreamRevenueChart from './components/StreamRevenueChart';
import PlatformCountrySummary from './components/PlatformCountrySummary';
import SplitOwnerModule from './components/SplitOwnerModule';
import TransactionsTable from './components/TransactionsTable';
import SongsAnalyticsView from './components/SongsAnalyticsView';

type Tab = 'overview' | 'transactions' | 'songs';

export default function Analytics() {
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const [kpis, setKpis] = useState<AnalyticsKpis | null>(null);
  const [historical, setHistorical] = useState<HistoricalTotal | null>(null);
  const [revenueByPlatform, setRevenueByPlatform] = useState<RevenueByPlatformData | null>(null);
  const [storeData, setStoreData] = useState<PieChartEntry[]>([]);
  const [countryData, setCountryData] = useState<PieChartEntry[]>([]);
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [topLabels, setTopLabels] = useState<TopLabel[]>([]);
  const [platformSummary, setPlatformSummary] = useState<PlatformCountryRow[]>([]);
  const [splitOwner, setSplitOwner] = useState<SplitOwnerInfo | null>(null);

  const [loadingKpis, setLoadingKpis] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingTops, setLoadingTops] = useState(false);

  const fetchKpis = useCallback(async () => {
    setLoadingKpis(true);
    try {
      const [kpisData, historicalData] = await Promise.all([
        analyticsService.getKpis(filters),
        analyticsService.getHistoricalTotal(),
      ]);
      setKpis(kpisData);
      setHistorical(historicalData);
    } catch {
      setKpis(null);
    } finally {
      setLoadingKpis(false);
    }
  }, [filters]);

  const fetchCharts = useCallback(async () => {
    setLoadingCharts(true);
    try {
      const [platformData, store, country, summary] = await Promise.all([
        analyticsService.getRevenueByPlatform(filters),
        analyticsService.getRevenueByStore(filters),
        analyticsService.getRevenueByCountry(filters),
        analyticsService.getPlatformCountrySummary(filters),
      ]);
      setRevenueByPlatform(platformData);
      setStoreData(store);
      setCountryData(country);
      setPlatformSummary(summary);
    } catch {
      setRevenueByPlatform(null);
    } finally {
      setLoadingCharts(false);
    }
  }, [filters]);

  const fetchTops = useCallback(async () => {
    setLoadingTops(true);
    try {
      const [songs, artists, labels, owner] = await Promise.all([
        analyticsService.getTopSongs(filters),
        analyticsService.getTopArtists(filters),
        analyticsService.getTopLabels(filters),
        analyticsService.getSplitOwnerInfo(),
      ]);
      setTopSongs(songs);
      setTopArtists(artists);
      setTopLabels(labels);
      setSplitOwner(owner);
    } catch {
      setTopSongs([]);
    } finally {
      setLoadingTops(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchKpis();
    fetchCharts();
    fetchTops();
  }, [fetchKpis, fetchCharts, fetchTops]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Resumen' },
    { id: 'transactions', label: 'Transacciones' },
    { id: 'songs', label: 'Canciones' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="px-6 lg:px-10 py-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#111827]">Analíticas</h1>
          <p className="text-sm text-[#6B7280]">
            KPIs, ingresos, tops y transacciones de tu catálogo
          </p>
          <div className="w-10 h-0.5 rounded-full bg-[#F97316] mt-1" />
        </div>

        {/* Filters */}
        <AnalyticsFiltersBar filters={filters} onChange={setFilters} />

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-[#F97316] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* KPIs — always visible */}
        <AnalyticsKpisSection kpis={kpis} historical={historical} loading={loadingKpis} />

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <>
            {/* Stacked bar chart */}
            <RevenueByPlatformChart data={revenueByPlatform} loading={loadingCharts} />

            {/* Pie charts */}
            <RevenuePieCharts
              storeData={storeData}
              countryData={countryData}
              loading={loadingCharts}
            />

            {/* Top 5 charts */}
            <TopChartsSection
              topSongs={topSongs}
              topArtists={topArtists}
              topLabels={topLabels}
              loading={loadingTops}
            />

            {/* Stream x Revenue + Split Owner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <StreamRevenueChart songs={topSongs} loading={loadingTops} />
              </div>
              <SplitOwnerModule data={splitOwner} loading={loadingTops} />
            </div>

            {/* TOP 10 Platform × Country */}
            <PlatformCountrySummary data={platformSummary} loading={loadingCharts} />
          </>
        )}

        {/* Tab: Transactions */}
        {activeTab === 'transactions' && <TransactionsTable filters={filters} />}

        {/* Tab: Songs */}
        {activeTab === 'songs' && <SongsAnalyticsView filters={filters} />}
      </div>
    </div>
  );
}
