import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Play, 
  DollarSign, 
  Disc3, 
  ChevronRight,
  Sparkles,
  BarChart3,
  PieChart,
} from "lucide-react";
import SongService from "../../services/songs";

interface PlatformStadistic {
  _id: string;
  totalStreams: number;
  totalNetIncome: number;
  releasesCount: number;
}

interface PlatformDataItem {
  name: string;
  percentage: number;
  color: string;
  gradient: string;
  streams: number;
  income: number;
  releases: number;
  icon: string;
}

// Platform configurations with beautiful gradients and icons
const platformConfig: Record<string, { color: string; gradient: string; icon: string }> = {
  "Spotify": { 
    color: "#1DB954", 
    gradient: "from-[#1DB954] via-[#1ed760] to-[#169c46]",
    icon: "🎵"
  },
  "Apple Music": { 
    color: "#FC3C44", 
    gradient: "from-[#FC3C44] via-[#ff6b6b] to-[#d63384]",
    icon: "🍎"
  },
  "YouTube Official Content": { 
    color: "#FF0000", 
    gradient: "from-[#FF0000] via-[#ff4444] to-[#cc0000]",
    icon: "▶️"
  },
  "YouTube UGC": { 
    color: "#FF4444", 
    gradient: "from-[#FF4444] via-[#ff6666] to-[#cc3333]",
    icon: "📺"
  },
  "Deezer": { 
    color: "#FF0092", 
    gradient: "from-[#FF0092] via-[#ff44aa] to-[#cc0074]",
    icon: "🎧"
  },
  "Amazon Premium": { 
    color: "#00C7F2", 
    gradient: "from-[#00C7F2] via-[#00d4ff] to-[#0099cc]",
    icon: "📦"
  },
  "Amazon Ad-Supported": { 
    color: "#00A8E1", 
    gradient: "from-[#00A8E1] via-[#33bbff] to-[#0088bb]",
    icon: "🔊"
  },
  "Facebook / Instagram": { 
    color: "#E4405F", 
    gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]",
    icon: "📸"
  },
  "iMusica": { 
    color: "#FF6B35", 
    gradient: "from-[#FF6B35] via-[#ff8855] to-[#cc5528]",
    icon: "🎶"
  },
  "Yandex": { 
    color: "#FFCC00", 
    gradient: "from-[#FFCC00] via-[#ffdd44] to-[#ccaa00]",
    icon: "🔍"
  },
  "iTunes Match": { 
    color: "#FA243C", 
    gradient: "from-[#FA243C] via-[#ff5566] to-[#cc1d30]",
    icon: "🎼"
  },
  "Audiomack": { 
    color: "#FFA500", 
    gradient: "from-[#FFA500] via-[#ffbb33] to-[#cc8400]",
    icon: "🎤"
  },
  "Otros": { 
    color: "#6366F1", 
    gradient: "from-[#6366F1] via-[#818CF8] to-[#4F46E5]",
    icon: "🌐"
  },
};

const PlatformsCard = () => {
  const [activeView, setActiveView] = useState<"cards" | "bars" | "rings">("cards");
  const [platformData, setPlatformData] = useState<PlatformDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformDataItem | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await SongService.getStadisticsByPlatformAll();
        const stadistics: PlatformStadistic[] = response?.data || [];

        const totalStreams = stadistics.reduce(
          (sum, item) => sum + (item.totalStreams || 0),
          0
        );

        const mapped: PlatformDataItem[] = stadistics
          .map((item) => {
            const name = item._id || "Otros";
            const percentage =
              totalStreams > 0
                ? Math.round((item.totalStreams / totalStreams) * 100)
                : 0;
            const config = platformConfig[name] || platformConfig["Otros"];

            return {
              name,
              percentage,
              color: config.color,
              gradient: config.gradient,
              icon: config.icon,
              streams: item.totalStreams,
              income: item.totalNetIncome,
              releases: item.releasesCount,
            };
          })
          .sort((a, b) => b.streams - a.streams);

        // Group platforms with 0% into "Otros"
        const platformsWithData = mapped.filter((p) => p.percentage > 0);
        const platformsWithZero = mapped.filter((p) => p.percentage === 0);

        const groupedData: PlatformDataItem[] = [...platformsWithData];
        
        if (platformsWithZero.length > 0) {
          const othersConfig = platformConfig["Otros"];
          const othersData: PlatformDataItem = {
            name: "Otros",
            percentage: 0,
            color: othersConfig.color,
            gradient: othersConfig.gradient,
            icon: othersConfig.icon,
            streams: platformsWithZero.reduce((sum, p) => sum + p.streams, 0),
            income: platformsWithZero.reduce((sum, p) => sum + p.income, 0),
            releases: platformsWithZero.reduce((sum, p) => sum + p.releases, 0),
          };
          
          if (totalStreams > 0) {
            othersData.percentage = Math.round((othersData.streams / totalStreams) * 100);
          }
          
          if (othersData.streams > 0 || platformsWithZero.length > 0) {
            groupedData.push(othersData);
          }
        }

        setPlatformData(groupedData);
        if (groupedData.length > 0) {
          setSelectedPlatform(groupedData[0]);
        }
      } catch (error) {
        console.error("Error loading platform stadistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalStreams = platformData.reduce((sum, p) => sum + p.streams, 0);
  const totalIncome = platformData.reduce((sum, p) => sum + p.income, 0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const viewOptions = [
    { id: "cards", icon: PieChart, label: "Cards" },
    { id: "bars", icon: BarChart3, label: "Bars" },
  ];



  // Platform card component
  const PlatformCard = ({ platform, index }: { platform: PlatformDataItem; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedPlatform(platform)}
      className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
        selectedPlatform?.name === platform.name 
          ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' 
          : ''
      }`}
      style={{ 
        background: `linear-gradient(135deg, ${platform.color}15, ${platform.color}05)`,
        borderColor: platform.color,
        boxShadow: selectedPlatform?.name === platform.name 
          ? `0 8px 32px ${platform.color}30` 
          : '0 4px 16px rgba(0,0,0,0.05)'
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-30"
        style={{ background: platform.color }}
      />
      
      <div className="relative z-10 flex items-center gap-3">
        {/* Platform icon with gradient background */}
        <div 
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center shadow-lg`}
          style={{ boxShadow: `0 4px 14px ${platform.color}40` }}
        >
          <span className="text-xl">{platform.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {platform.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatNumber(platform.streams)} streams
            </span>
            <span 
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ 
                background: `${platform.color}20`,
                color: platform.color
              }}
            >
              {platform.percentage}%
            </span>
          </div>
        </div>
        
        {/* Mini progress bar */}
        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${platform.percentage}%` }}
            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${platform.gradient} rounded-full`}
          />
        </div>
      </div>
    </motion.div>
  );

  // Horizontal bar component
  const HorizontalBar = ({ platform, index, maxStreams }: { platform: PlatformDataItem; index: number; maxStreams: number }) => {
    const widthPercent = maxStreams > 0 ? (platform.streams / maxStreams) * 100 : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
        className="group"
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div className="flex items-center gap-3 mb-2">
          <div 
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.gradient} flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110`}
          >
            <span className="text-sm">{platform.icon}</span>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
            {platform.name}
          </span>
          <span className="text-sm font-bold" style={{ color: platform.color }}>
            {formatNumber(platform.streams)}
          </span>
        </div>
        
        <div className="relative h-3 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${widthPercent}%` }}
            transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${platform.gradient} rounded-full`}
            style={{
              boxShadow: hoveredIndex === index ? `0 0 20px ${platform.color}60` : 'none'
            }}
          />
          {/* Shimmer effect */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 2, delay: index * 0.1 + 1, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
      
      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-start mb-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-1"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Disc3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Plataformas
              </h3>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Rendimiento global por plataforma
            </motion.p>
          </div>
          
          {/* View toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 gap-1"
          >
            {viewOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView(option.id as typeof activeView)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  activeView === option.id
                    ? "bg-white dark:bg-gray-600 shadow-md text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <option.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </motion.div>
        </header>

        {/* Stats summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl p-4 border border-blue-200/30 dark:border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Streams</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(totalStreams)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500 font-medium">+12.5%</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl p-4 border border-green-200/30 dark:border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500 font-medium">+8.3%</span>
            </div>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
              />
              <span className="text-gray-500 text-sm">Cargando estadísticas...</span>
            </div>
          ) : platformData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No hay datos de plataformas aún</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Cards View */}
              {activeView === "cards" && (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar"
                >
                  {platformData.slice(0, 8).map((platform, index) => (
                    <PlatformCard key={platform.name} platform={platform} index={index} />
                  ))}
                </motion.div>
              )}

              {/* Bars View */}
              {activeView === "bars" && (
                <motion.div
                  key="bars"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar"
                >
                  {platformData.slice(0, 8).map((platform, index) => (
                    <HorizontalBar 
                      key={platform.name} 
                      platform={platform} 
                      index={index}
                      maxStreams={platformData[0]?.streams || 1}
                    />
                  ))}
                </motion.div>
              )}

              {/* Rings View */}
       
            </AnimatePresence>
          )}
        </div>

        {/* Selected platform detail */}
        {selectedPlatform && activeView === "cards" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
            style={{ 
              background: `linear-gradient(135deg, ${selectedPlatform.color}08, transparent)` 
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-6 h-6 rounded-lg bg-gradient-to-br ${selectedPlatform.gradient} flex items-center justify-center`}
                >
                  <span className="text-xs">{selectedPlatform.icon}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {selectedPlatform.name}
                </span>
              </div>
              <span 
                className="text-xs font-bold px-2 py-1 rounded-full"
                style={{ background: `${selectedPlatform.color}20`, color: selectedPlatform.color }}
              >
                {selectedPlatform.percentage}% del total
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatNumber(selectedPlatform.streams)}
                </p>
                <p className="text-xs text-gray-500">Streams</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${selectedPlatform.income.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedPlatform.releases}
                </p>
                <p className="text-xs text-gray-500">Releases</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <Link
            to="/panel/platforms"
            className="group relative w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <Sparkles className="w-4 h-4" />
            <span>Ver todas las plataformas</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </motion.div>
  );
};

export default PlatformsCard;
