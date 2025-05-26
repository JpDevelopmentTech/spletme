import { ApexOptions } from "apexcharts";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PlatformsCard = () => {
  const [chart, setChart] = useState<string>("radialBar");
  const series2 = [76, 67, 61, 90, 50, 30];

  const platforms = [
    { name: "Youtube", color: "#FF6384", value: 76 },
    { name: "Amazon Music", color: "#36A2EB", value: 67 },
    { name: "Spotify", color: "#4BC0C0", value: 61 },
    { name: "Apple Music", color: "#212121", value: 90 },
    { name: "Deezer", color: "#9966FF", value: 50 },
    { name: "Otra", color: "#C9CBCF", value: 30 },
  ];

  // Chart options for radial and pie
  const options2: ApexOptions = {
    chart: {
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 5,
          size: "40%",
          background: "transparent",
        },
        track: {
          background: "#f1f5f950",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
      pie: {
        donut: {
          size: "50%",
        }
      }
    },
    stroke: {
      lineCap: "round",
    },
    colors: platforms.map(p => p.color),
    labels: platforms.map(p => p.name),
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  // Chart options for bar
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 320,
      fontFamily: "Inter, sans-serif",
      background: "transparent",
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500,
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 6,
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Aug', 'Sep', 'Oct'],
      labels: {
        show: true,
        style: {
          colors: "#64748b",
          fontSize: '10px',
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: "#64748b",
          fontSize: '10px',
        }
      }
    },
    grid: {
      show: true,
      borderColor: "#e2e8f080",
      strokeDashArray: 5,
      position: 'back',
    },
    fill: {
      opacity: 1
    },
    colors: platforms.map(p => p.color),
    tooltip: {
      theme: "light"
    }
  }

  const series = [
    {
      name: "Youtube",
      data: [28, 45, 35]
    }, 
    {
      name: 'Amazon Music',
      data: [22, 30, 25],
    }, 
    {
      name: 'Spotify',
      data: [30, 25, 20],
    }, 
    {
      name: 'Apple Music',
      data: [25, 15, 18],
    }, 
    {
      name: 'Deezer',
      data: [15, 10, 12],
    }, 
    {
      name: 'Otra',
      data: [8, 5, 7],
    }
  ];

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
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
    hidden: { y: 5, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="col-span-12 lg:col-span-3 bg-gradient-to-br from-white to-gray-50 backdrop-blur-xl rounded-2xl lg:row-span-3 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Light effect container */}
      <div className="p-5 h-full flex flex-col">
        <header className="flex justify-between items-center mb-5">
          <div>
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-semibold text-gray-800"
            >
              Plataformas
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-sm"
            >
              Comportamiento por plataforma
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-indigo-50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-indigo-100"
          >
            <div className="text-sm font-medium flex items-center gap-1.5">
              <span className="text-indigo-600 text-lg font-semibold">1,250</span>
              <span className="text-indigo-400 text-xs">Streams + Views</span>
            </div>
          </motion.div>
        </header>

        {/* Chart container */}
        <div className="relative flex-grow mb-4">
          <motion.div 
            key={chart}
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            className="w-full h-64"
          >
            {chart === "bar" && (
              <ReactApexChart
                options={options}
                type="bar"
                series={series}
                height="100%"
                width="100%"
              />
            )}

            {chart === "pie" && (
              <ReactApexChart
                options={options2}
                type="pie"
                series={series2}
                height="100%"
                width="100%"
              />
            )}

            {chart === "radialBar" && (
              <ReactApexChart
                options={options2}
                type="radialBar"
                series={series2}
                height="100%"
                width="100%"
              />
            )}
          </motion.div>
        </div>

        {/* Toggle buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <div className="bg-gray-100 backdrop-blur-sm rounded-xl p-1 flex justify-between">
            <button
              onClick={() => setChart("bar")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                chart === "bar" 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 20v-7h4v7h-4Zm-6 0V4h4v16h-4Zm-6 0V9h4v11H4Z"/>
                </svg>
              </div>
            </button>
            <button
              onClick={() => setChart("radialBar")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                chart === "radialBar" 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 1a7 7 0 0 0-7 7a7 7 0 0 0 7 7a7 7 0 0 0 7-7a7 7 0 0 0-7-7"/>
                </svg>
              </div>
            </button>
            <button
              onClick={() => setChart("pie")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                chart === "pie" 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 2v11h11c-.09 4.815-4.195 8.91-9 9c-4.986 0-9-4.015-9-9c0-4.805 4.086-8.91 9-9Z"/>
                </svg>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-x-3 gap-y-2 mb-5"
        >
          {platforms.map((platform) => (
            <motion.div 
              key={platform.name}
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <div className="w-6 h-2 rounded-sm" style={{ backgroundColor: platform.color }}></div>
              <div className="flex justify-between w-full">
                <span className="text-gray-700 text-xs font-medium">{platform.name}</span>
                <span className="text-gray-500 text-xs">{platform.value}%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-auto"
        >
          <Link
            to={"#"}
            className="bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 group w-full py-2.5 px-4 text-indigo-600 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>Editar plataformas</span>
            <motion.div 
              className="w-0 h-0.5 bg-indigo-400 group-hover:w-full absolute bottom-2 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlatformsCard;
