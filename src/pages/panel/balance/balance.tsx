import { motion } from "framer-motion";
import { TrendingUp, Wallet, Filter } from "lucide-react";
import Select from "react-select";
import UseFilterSongsData from "../../../hooks/useFilterSongsData";
import { useSplitPayments } from "../../../hooks/useSplitPayments";
import { selectStyles } from "../../../components/ui/selectStyles";

const PLATFORM_OPTIONS = [
  { value: "spotify", label: "Spotify" },
  { value: "youtube", label: "YouTube" },
  { value: "apple", label: "Apple Music" },
];

const COUNTRY_OPTIONS = [
  { value: "mx", label: "México" },
  { value: "us", label: "Estados Unidos" },
  { value: "es", label: "España" },
];

const Balance = () => {
  const {
    summary,
    country,
    setCountry,
    platform,
    setPlatform,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = UseFilterSongsData();
  const { payments, isLoading: paymentsLoading, totalAmount } = useSplitPayments();

  const handleClearFilters = () => {
    setCountry("");
    setPlatform("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-indigo-900">Balance</h1>
      </div>

      {/* Filtros */}
      <div className="mb-8 rounded-xl border border-indigo-100 bg-white p-6 shadow-sm">
        <form className="space-y-4">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="text-indigo-600" size={20} />
            <h2 className="text-lg font-medium text-indigo-900">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="platform" className="mb-1 block text-sm font-medium text-gray-700">
                Plataforma
              </label>
              <Select
                inputId="platform"
                name="platform"
                value={platform ? PLATFORM_OPTIONS.find((p) => p.value === platform) ?? null : null}
                onChange={(opt) => setPlatform(opt?.value || "")}
                options={PLATFORM_OPTIONS}
                placeholder="Todas"
                styles={selectStyles}
                menuPortalTarget={document.body}
                isClearable
              />
            </div>

            <div>
              <label htmlFor="country" className="mb-1 block text-sm font-medium text-gray-700">
                País
              </label>
              <Select
                inputId="country"
                name="country"
                value={country ? COUNTRY_OPTIONS.find((c) => c.value === country) ?? null : null}
                onChange={(opt) => setCountry(opt?.value || "")}
                options={COUNTRY_OPTIONS}
                placeholder="Todos"
                styles={selectStyles}
                menuPortalTarget={document.body}
                isClearable
              />
            </div>

            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700">
                Fecha Inicio
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-gray-700">
                Fecha Fin
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <motion.button
              type="button"
              onClick={handleClearFilters}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Limpiar filtros
            </motion.button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-indigo-100 p-3">
              <Wallet className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Streams</h3>
              <p className="text-2xl font-bold text-indigo-600">{summary.totalStreams}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Ingresos</h3>
              <p className="text-2xl font-bold text-green-600">
                $
                {summary.totalNetIncome?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-red-100 p-3">
              <TrendingUp className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-900">Egresos</h3>
              <p className="text-2xl font-bold text-red-600">
                $
                {paymentsLoading
                  ? "..."
                  : totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de Movimientos */}
      <div className="mt-8">
        <h2 className="mb-6 text-xl font-semibold text-indigo-900">Movimientos</h2>

        <div className="grid grid-cols-1 gap-6">
          {/* Egresos - Split Payments */}
          <div className="rounded-xl border border-indigo-100 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-indigo-900">
                  Egresos - Pagos a Colaboradores
                </h3>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                  -$
                  {totalAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="space-y-4">
                {paymentsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <p className="text-gray-500">Cargando pagos...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <p className="text-gray-500">No hay pagos registrados</p>
                  </div>
                ) : (
                  payments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-100 p-2">
                          <TrendingUp className="text-red-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.description ||
                              `Pago a Colaborador - ${payment.idCollaborator}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-red-600">
                        -$
                        {payment.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aquí irían los modales para agregar ingresos y gastos */}
    </motion.div>
  );
};

export default Balance;
