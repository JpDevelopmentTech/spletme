import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { motion } from "framer-motion";
import { 
  Music, 
  BarChart3, 
  TrendingUp, 
  Edit3, 
  Youtube, 
  Music2, 
  Smartphone, 
  Disc3, 
  ShoppingCart,
  MoreHorizontal,
  Eye,
  Users,
  Globe,
  Facebook,
  Radio,
  LucideIcon
} from "lucide-react";

interface ReproductionData {
  totalStreams: number;
  totalIncome: number;
  releasesCount: number;
  platform: string;
}

interface PlatformsProps {
  reproductions?: ReproductionData[];
}

const Platforms = ({ reproductions = [] }: PlatformsProps) => {
  // Mapeo de colores e iconos por plataforma
  const platformConfig: Record<string, { color: string; icon: LucideIcon }> = {
    "Spotify": { color: "#1DB954", icon: Music2 },
    "Apple Music": { color: "#FA243C", icon: Smartphone },
    "YouTube Official Content": { color: "#FF0000", icon: Youtube },
    "YouTube UGC": { color: "#FF0000", icon: Youtube },
    "Deezer": { color: "#FF0092", icon: Disc3 },
    "Amazon Premium": { color: "#00C7F2", icon: ShoppingCart },
    "Amazon Ad-Supported": { color: "#00A8E1", icon: ShoppingCart },
    "Facebook / Instagram": { color: "#E4405F", icon: Facebook },
    "iMusica": { color: "#FF6B35", icon: Music },
    "Yandex": { color: "#FFCC00", icon: Radio },
    "iTunes Match": { color: "#FA243C", icon: Smartphone },
    "Audiomack": { color: "#FFA500", icon: Music },
  };

  // Calcular el total de streams
  const totalStreams = reproductions.reduce((sum, item) => sum + item.totalStreams, 0);
  const totalIncome = reproductions.reduce((sum, item) => sum + item.totalIncome, 0);

  // Calcular porcentajes y preparar datos
  const platformData = reproductions
    .map(item => {
      const percentage = totalStreams > 0 ? Math.round((item.totalStreams / totalStreams) * 100) : 0;
      const config = platformConfig[item.platform] || { color: "#666666", icon: MoreHorizontal };
      
      return {
        name: item.platform,
        percentage,
        color: config.color,
        icon: config.icon,
        streams: item.totalStreams,
        income: item.totalIncome,
        releases: item.releasesCount
      };
    })
    .sort((a, b) => b.streams - a.streams); // Ordenar por streams descendente

  // Series para el gráfico (top 6 plataformas)
  const series2 = platformData.slice(0, 6).map(item => item.percentage);

  const options2: ApexOptions = {
    chart: {
      height: 200,
      type: "radialBar",
      background: 'transparent',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.1
      }
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 5,
          size: "40%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
        track: {
          background: 'rgba(148, 163, 184, 0.1)',
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        }
      },
    },
    colors: platformData.slice(0, 6).map(item => item.color),
    labels: platformData.slice(0, 6).map(item => item.name),
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 150,
          },
        },
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="p-6 lg:p-8">
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Platforms</h2>
                <p className="text-gray-600 dark:text-gray-300">Performance across streaming platforms</p>
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Edit3 className="w-4 h-4" />
            Edit Platforms
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            {/* Chart */}
            <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200/50">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Distribution Overview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Streams across platforms</p>
              </div>
              
              <div className="flex justify-center">
                <ReactApexChart
                  options={options2}
                  type="radialBar"
                  series={series2}
                />
              </div>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex items-center justify-center gap-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-2xl p-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white dark:bg-gray-600 shadow-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Platform List Section */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Performance</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4" />
                <span>Total: {totalStreams.toLocaleString()} streams</span>
              </div>
            </div>

            {/* Platform Items */}
            <div className="space-y-3">
              {platformData.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="group relative bg-gray-50/80 dark:bg-gray-700/80 hover:bg-gray-100/80 dark:hover:bg-gray-600/80 rounded-2xl p-4 transition-all duration-200 border border-gray-200/50 hover:border-gray-300/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: platform.color }}
                      >
                        <platform.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{platform.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {platform.streams.toLocaleString()} streams • ${platform.income.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }}></div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{platform.percentage}%</span>
                      </div>
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${platform.percentage}%` }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-200/50"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Music className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Performance</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {totalStreams.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Streams</p>
                
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      ${totalIncome.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Total Income</p>
                  </div>
                  <span className="text-gray-400">|</span>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {reproductions.length}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Platforms</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Platforms;
