import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  DollarSign,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import UseFilterSongsData from "../../../hooks/useFilterSongsData";
import UseSongs from "../../../hooks/useSongs";
import { useState } from "react";


const Income = () => {
  const { summary, country, platform, setCountry, setPlatform } =
    UseFilterSongsData();
  const { songs } = UseSongs() 
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 5;

  const countries = [
    { value: "mexico", label: "México" },
    { value: "united-states", label: "Estados Unidos" },
    { value: "spain", label: "España" },
    { value: "argentina", label: "Argentina" },
  ];

  const platforms = [
    { value: "youtube", label: "YouTube" },
    { value: "spotify", label: "Spotify" },
    { value: "apple-music", label: "Apple Music" },
    { value: "amazon-music", label: "Amazon Music" },
    { value: "deezer", label: "Deezer" },
    { value: "tidal", label: "Tidal" },
    { value: "pandora", label: "Pandora" },
    { value: "other", label: "Otros" },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    songs?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((songs?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleRow = (songId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(songId)) {
      newExpandedRows.delete(songId);
    } else {
      newExpandedRows.add(songId);
    }
    setExpandedRows(newExpandedRows);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-indigo-600" />
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-white border border-indigo-100 rounded-lg px-3 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos los países</option>
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </motion.select>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-indigo-600" />
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="bg-white border border-indigo-100 rounded-lg px-3 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas las plataformas</option>
            {platforms.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </motion.select>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-indigo-100 rounded-lg"
            >
              <DollarSign className="text-indigo-600" size={24} />
            </motion.div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">
                Ingresos Totales
              </h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-indigo-600"
              >
                ${summary.totalNetIncome.toFixed(2)}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-green-100 rounded-lg"
            >
              <ArrowUpRight className="text-green-600" size={24} />
            </motion.div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">
                Ingresos del Mes
              </h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-green-600"
              >
                ${summary.totalNetIncome.toFixed(2)}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-xl font-semibold text-indigo-900">
            Historial de Ingresos
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="w-10 px-6 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Canción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Artista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Sello
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Streams
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-900 uppercase tracking-wider">
                    Ingreso Neto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {currentItems.map((song) => (
                  <>
                    <motion.tr
                      key={song._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ backgroundColor: "#F5F3FF" }}
                      className="hover:bg-indigo-50"
                    >
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleRow(song._id)}
                          className="p-1 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          {expandedRows.has(song._id) ? (
                            <ChevronUp size={20} className="text-indigo-600" />
                          ) : (
                            <ChevronDown size={20} className="text-indigo-600" />
                          )}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-900">
                          {song.trackTitle}
                        </div>
                        <div className="text-sm text-indigo-500">{song.isrc}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-900">
                        {song.artistName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-900">
                        {song.artisticLabel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-900">
                        {song.totalStreams}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-900">
                        ${song.totalNetIncome.toFixed(2)}
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {expandedRows.has(song._id) && (
                        <motion.tr
                          variants={expandVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <td colSpan={6} className="px-6 py-4 bg-indigo-50">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="overflow-x-auto"
                            >
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-indigo-900">
                                      Plataforma
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-indigo-900">
                                      País
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-indigo-900">
                                      Fecha
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-indigo-900">
                                      Streams
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-indigo-900">
                                      Ingreso Bruto
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-indigo-900">
                                      Ingreso Neto
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-100">
                                  {song.releases.map((release, index) => (
                                    <motion.tr
                                      key={index}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="bg-white"
                                    >
                                      <td className="px-4 py-2 text-sm text-indigo-900">
                                        {release.platform}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-indigo-900">
                                        {release.country}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-indigo-900">
                                        {new Date(release.salesMonth).toLocaleDateString()}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-indigo-900">
                                        {release.quantity}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-indigo-900">
                                        ${release.grossIncome.toFixed(2)}
                                      </td>
                                      <td className="px-4 py-2 text-sm text-indigo-900">
                                        ${release.netIncome.toFixed(2)}
                                      </td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </motion.div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-4 flex items-center justify-between border-t border-indigo-100"
          >
            <div className="flex items-center">
              <p className="text-sm text-indigo-900">
                Mostrando{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, songs?.length || 0)}
                </span>{" "}
                de{" "}
                <span className="font-medium">{songs?.length || 0}</span>{" "}
                resultados
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-indigo-100 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-indigo-100 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Income;
