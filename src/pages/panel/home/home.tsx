import { ApexOptions } from "apexcharts";
import "./home.css";
import ReactApexChart from "react-apexcharts";
import logoPayoneer from "../../../assets/images/payoneer-dark-logo.svg";
import { Link } from "react-router-dom";
import CardSong from "../../../components/cardsong/cardsong";
import { useState } from "react";
import PlatformsCard from "../../../components/platformsCard/platformsCard";
import { motion } from "framer-motion";
import DashboardTour from "../../../components/tour/DashboardTour";
import { 
  Music, 
  Youtube, 
  DollarSign, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Users,
  Play,
  Calendar,
  Filter,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import UseSongs from "../../../hooks/useSongs";
import UseFilterSongsData from "@/hooks/useFilterSongsData";

export default function Home() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const { songs } = UseSongs();
  const { summary } = UseFilterSongsData();

  const series = [
    {
      name: "Streams",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Revenue",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ['#8B5CF6', '#06B6D4'],
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.1)',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
      labels: {
        style: {
          fontSize: '12px',
          colors: '#64748B'
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B'
        }
      }
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
      theme: 'dark',
      style: {
        fontSize: '12px'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.4,
        gradientToColors: ['rgba(139, 92, 246, 0.1)', 'rgba(6, 182, 212, 0.1)'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    }
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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

  const timeframeOptions = [
    { value: "7d", label: "7D", active: selectedTimeframe === "7d" },
    { value: "30d", label: "30D", active: selectedTimeframe === "30d" },
    { value: "90d", label: "90D", active: selectedTimeframe === "90d" },
    { value: "1y", label: "1Y", active: selectedTimeframe === "1y" }
  ];
  
  return (
    <>
      <DashboardTour />
      
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Header Section */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
            data-tour="hero-header"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full border border-purple-200/50 mb-4"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Dashboard Analytics</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-4"
            >
              Bienvenidos a SplitMe
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6"
            >
              Aquí podrás ver el rendimiento de tus canciones, analizar tendencias y descubrir insights para crecer tu audiencia
            </motion.p>

            {/* Tour Trigger Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              onClick={() => {
                // Trigger tour restart by clearing localStorage and reloading
                localStorage.removeItem('dashboard-tour-completed');
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Iniciar Tour del Dashboard
            </motion.button>
          </motion.div>

          {/* Quick Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            data-tour="stats-cards"
          >
            {[
              { 
                title: "Total Streams", 
                value: "2.4M", 
                change: "+12.5%", 
                icon: Play, 
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-500/10 to-cyan-500/10"
              },
              { 
                title: "Monthly Revenue", 
                value: "$12,847", 
                change: "+8.2%", 
                icon: DollarSign, 
                color: "from-green-500 to-emerald-500",
                bgColor: "from-green-500/10 to-emerald-500/10"
              },
              { 
                title: "Active Listeners", 
                value: "847K", 
                change: "+15.3%", 
                icon: Users, 
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-500/10 to-pink-500/10"
              },
              { 
                title: "Conversion Rate", 
                value: "3.2%", 
                change: "+2.1%", 
                icon: Target, 
                color: "from-orange-500 to-red-500",
                bgColor: "from-orange-500/10 to-red-500/10"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 overflow-hidden"
              >
                {/* Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${stat.color} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-1 text-green-600 text-sm font-medium"
                    >
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </motion.div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Performance Analytics Chart */}
            <motion.div
              variants={itemVariants}
              className="col-span-12 xl:col-span-8"
              data-tour="analytics-chart"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-6 lg:p-8">
                  {/* Chart Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
                      <p className="text-gray-600 dark:text-gray-300">Track your music performance over time</p>
                    </div>
                     
                    {/* Timeframe Selector */}
                    <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-gray-700/80 rounded-2xl p-1">
                      {timeframeOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            option.active
                              ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md"
                              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          }`}
                          onClick={() => setSelectedTimeframe(option.value)}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Streams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Revenue</span>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="h-[350px]">
                    <ReactApexChart
                      options={options}
                      series={series}
                      type="area"
                      height="100%"
                      width="100%"
                    />
                  </div>
                  
                  {/* Mini Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    {[
                      { label: "Total Streams", value: "325K", icon: Music, color: "text-purple-600", bgColor: "bg-purple-100" },
                      { label: "Total Views", value: "847K", icon: Youtube, color: "text-red-600", bgColor: "bg-red-100" },
                      { label: "Total Revenue", value: "$244.19", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-100" }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="bg-gray-50/80 dark:bg-gray-700/80 rounded-2xl p-4 text-center group hover:bg-gray-100/80 dark:hover:bg-gray-600/80 transition-colors duration-200"
                      >
                        <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{stat.label}</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Balance & Payment Section */}
            <motion.div
              variants={itemVariants}
              className="col-span-12 xl:col-span-4"
              data-tour="balance-section"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Balance</h2>
                      <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        June 3, 2024
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Balance Overview */}
                  <div className="space-y-6 mb-8">
                    <motion.div 
                      whileHover={{ x: 8, scale: 1.02 }}
                      className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Income</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
                      </div>
                      <p className="text-green-600 dark:text-green-400 font-bold text-lg">${summary.totalNetIncome?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </motion.div>
                     
                    <motion.div 
                      whileHover={{ x: 8, scale: 1.02 }}
                      className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200/50"
                    >
                      <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <ArrowDownRight className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Expense</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
                      </div>
                      <p className="text-orange-500 dark:text-orange-400 font-bold text-lg">$50.00</p>
                    </motion.div>
                  </div>

                  {/* Net Balance */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-200/50 mb-6"
                  >
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Net Balance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">$50.00</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Payment Section */}
                <div className="p-6 lg:p-8 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-900/20">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Pay securely with</p>
                  <div className="flex items-center justify-center mb-6">
                    <img src={logoPayoneer} alt="Payoneer logo" className="h-12" />
                  </div>

                  <motion.button
                    className="w-full px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#FF4800] to-[#FF6B35] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open('https://myaccount.payoneer.com/login', '_blank')}
                  >
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                    Login to Payoneer
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Platforms Section */}
            <motion.div
              variants={itemVariants}
              className="col-span-12 lg:col-span-4"
              data-tour="platforms-section"
            >
              <PlatformsCard />
            </motion.div>

            {/* Top Songs Section */}
            <motion.div
              variants={itemVariants}
              className="col-span-12 lg:col-span-8"
              data-tour="top-songs"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Songs</h2>
                      <p className="text-gray-600 dark:text-gray-300">Your best performing tracks this month</p>
                    </div>
                     
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-colors"
                      >
                        <Filter className="w-5 h-5" />
                      </motion.button>
                      
                      <Link to="/panel/music" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                        View all
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Songs Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {songs.length > 0 ? (
                      <>
                        {songs.slice(0, 4).map((song, index) => (
                          <motion.div
                            key={song._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="transform transition-all duration-200"
                          >
                            <CardSong song={song} />
                          </motion.div>
                        ))}
                      </>
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-16 px-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 }}
                          className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mb-6"
                        >
                          <Music className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">No songs yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
                          Upload your first song to start tracking your music performance and analytics
                        </p>
                        <Link 
                          to="/panel/music" 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <Music className="w-5 h-5" />
                          Upload song
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
