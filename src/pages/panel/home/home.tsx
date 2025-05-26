import { ApexOptions } from "apexcharts";
import "./home.css";
import ReactApexChart from "react-apexcharts";
import logoPayoneer from "../../../assets/images/payoneer-dark-logo.svg";
import { Link } from "react-router-dom";
import CardSong from "../../../components/cardsong/cardsong";
import { useState } from "react";
import PlatformsCard from "../../../components/platformsCard/platformsCard";
import { motion } from "framer-motion";
import { Share2, Download, Music, Youtube, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import UseSongs from "../../../hooks/useSongs";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { songs } = UseSongs();

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
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ['#2563EB', '#60A5FA'],
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 5,
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
          fontSize: '10px',
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
      theme: 'light',
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const filterOptions = ["Concept", "Timeframe", "Format"];
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Header with filters */}
      <motion.div
        variants={fadeInUp}
        className="mb-8"
      >
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome to your music analytics</p>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <div className="flex space-x-1">
            {filterOptions.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeFilter === filter.toLowerCase()
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveFilter(filter.toLowerCase())}
              >
                {filter}
              </motion.button>
            ))}
          </div>
          
          <div className="flex ml-auto space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <Download className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main stats chart */}
        <motion.div
          variants={fadeInUp}
          className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Performance Analytics</h2>
              <p className="text-sm text-gray-500">Overview of your music performance</p>
            </div>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                <span className="w-2 h-2 mr-1 rounded-full bg-indigo-500"></span>
                Streams
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                <span className="w-2 h-2 mr-1 rounded-full bg-orange-500"></span>
                Revenue
              </span>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height="100%"
              width="100%"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-lg p-3 text-center"
            >
              <div className="flex items-center justify-center mb-1">
                <Music className="w-4 h-4 text-indigo-600 mr-1" />
                <span className="text-sm font-medium">Streams</span>
              </div>
              <p className="text-lg font-bold">325K</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-lg p-3 text-center"
            >
              <div className="flex items-center justify-center mb-1">
                <Youtube className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm font-medium">Views</span>
              </div>
              <p className="text-lg font-bold">325K</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-lg p-3 text-center"
            >
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <p className="text-lg font-bold">$244.19</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Balance section */}
        <motion.div
          variants={fadeInUp}
          className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-semibold">Balance</h2>
                <p className="text-sm text-gray-500">June 3, 2024</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50">
                <BarChart3 className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            
            <div className="space-y-6">
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 mr-3">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Income</p>
                </div>
                <p className="text-green-600 font-semibold">$100.00</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 5 }}
                className="flex items-center p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 mr-3">
                  <ArrowDownRight className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Expense</p>
                </div>
                <p className="text-orange-500 font-semibold">$50.00</p>
              </motion.div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 mt-4">
            <p className="text-sm font-medium text-gray-600 mb-3">Pay securely with</p>
            <div className="flex items-center">
              <img src={logoPayoneer} alt="Payoneer logo" className="h-10" />
            </div>
          </div>

          <div className="px-6 pb-6">
            <motion.button
              className="w-full px-4 py-3 text-sm text-white bg-[#FF4800] rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://myaccount.payoneer.com/login', '_blank')}
            >
              Login to Payoneer
            </motion.button>
          </div>
        </motion.div>

        {/* Platforms section */}
        <motion.div
          variants={fadeInUp}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <PlatformsCard />
        </motion.div>

        {/* Top Songs section */}
        <motion.div
          variants={fadeInUp}
          className="col-span-12 md:col-span-6 lg:col-span-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Top Songs</h2>
                <p className="text-sm text-gray-500">Your best performing tracks</p>
              </div>
              <Link to="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {songs.length > 0 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <CardSong song={songs[0]} />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardSong song={songs[1]} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardSong song={songs[2]} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CardSong song={songs[3]} />
                  </motion.div>
                </>
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 px-4">
                  <Music className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No songs yet</h3>
                  <p className="text-sm text-gray-500 text-center max-w-sm">
                    Upload your first song to start tracking your music performance
                  </p>
                  <Link to="/panel/music" className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors">
                    Upload song
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
