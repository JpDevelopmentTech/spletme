import React, { useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import {
  DollarSign,
  Music,
  Users,
  Calendar,
  BarChart3,
  Award,
  ArrowLeft,
} from "lucide-react";
import AddCollaborator from "../../collaborators/components/addCollaborator";
import EspecificData from "./components/especificData";
import Table from "./components/table";
import { useParams, useNavigate } from "react-router-dom";
import Platforms from "./components/platforms";
import Historyofsplits from "./components/historyofsplits";
import Extraordinarycosts from "./components/extraordinarycosts";
import useSong from "../../../../hooks/useSong";
import Loading from "../../../../components/loading/loading";
import StripeConnectLoginModal from "../../../../components/modal/StripeConnectLoginModal";
import StripePaymentModal from "../../../../components/modal/StripePaymentModal";
import AlertComponent from "../../../../components/alert/alert";
import LocalStorageService from "../../../../services/localstorage";
import PaymentHistory from "../../../../components/PaymentHistory/PaymentHistory";
import useCurrentCollaborator from "../../../../hooks/useCurrentCollaborator";
import useMetricPayments from "../../../../hooks/useMetricPayments";

export default function Song() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    song,
    loading,
    getCollaboratorsInfo,
    getOwnerPercentage,
    getOwnerTotalOwed,
  } = useSong({ id: id || "" });
  const { getCurrentUserPercentage, getCurrentUserAmount } =
    useCurrentCollaborator({ collaborators: song?.collaborators || [] });
  const [showStripeLoginModal, setShowStripeLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [paymentHistoryRefresh, setPaymentHistoryRefresh] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const { metricsData, loading: metricLoading } = useMetricPayments(
    id || "",
    "month"
  );

  const getUserDisplayPercentage = () => {
    const collaboratorPercentage = getCurrentUserPercentage();
    if (collaboratorPercentage && collaboratorPercentage > 0) {
      return collaboratorPercentage;
    }
    return getOwnerPercentage();
  };

  const getUserDisplayAmount = () => {
    const collaboratorAmount = getCurrentUserAmount();
    if (collaboratorAmount && parseFloat(collaboratorAmount) > 0) {
      return collaboratorAmount;
    }
    const ownerPct = getOwnerPercentage();
    const totalIncome = song?.totalNetIncome || 0;
    return ((ownerPct / 100) * totalIncome).toFixed(2);
  };

  const isStripeConnected = () => {
    const authData = LocalStorageService.getItem("stripe_connect_auth");
    return authData?.isLoggedIn === true;
  };

  const handlePayAllClick = () => {
    if (isStripeConnected()) {
      setShowPaymentModal(true);
    } else {
      setShowStripeLoginModal(true);
    }
  };

  const handleStripeLoginSuccess = () => {
    setAlertMessage(
      "¡Inicio de sesión exitoso! Te has conectado correctamente con Stripe Connect."
    );
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const handlePaymentSuccess = () => {
    setPaymentHistoryRefresh((prev) => prev + 1);
    setAlertMessage(
      "¡Pago procesado exitosamente! Los colaboradores recibirán su parte correspondiente."
    );
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 5000);
  };

  const ownerAmount = getOwnerTotalOwed();
  const totalToPay = Math.max(0, (song?.totalNetIncome || 0) - ownerAmount);

  const monthlyCategories = useMemo(() => {
    const months: string[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      d.setMonth(now.getMonth() - i);
      months.push(d.toISOString());
    }

    return months;
  }, []);

  const monthWeights = useMemo(() => [0.1, 0.12, 0.15, 0.18, 0.2, 0.25], []);
  const weightsSum = monthWeights.reduce((acc, v) => acc + v, 0);
  const totalPaymentsFromMetrics = useMemo(
    () => metricsData.reduce((acc, item) => acc + Number(item.totalNetIncome || 0), 0),
    [metricsData]
  );
  const totalPaymentsForChart = totalPaymentsFromMetrics > 0 ? totalPaymentsFromMetrics : totalToPay;

  const chartSeries = useMemo(
    () => [
      {
        name: "Streams",
        type: "area",
        data: monthWeights.map((w) =>
          Math.round(((song?.totalStreams || 0) * w) / weightsSum)
        ),
      },
      {
        name: "Pagos",
        type: "area",
        data: monthWeights.map((w) =>
          Number((((totalPaymentsForChart || 0) * w) / weightsSum).toFixed(2))
        ),
      },
    ],
    [song?.totalStreams, totalPaymentsForChart, weightsSum, monthWeights]
  );

  const chartOptions: ApexOptions = {
    chart: {
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: {
      width: [2, 2],
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: [0, 0],
    },
    dataLabels: { enabled: false },
    colors: ["#111827", "#22C55E"],
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "datetime",
      categories: monthlyCategories,
      labels: {
        style: { fontSize: "11px", colors: "#9CA3AF" },
        datetimeFormatter: { month: "MMM" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        seriesName: "Streams",
        labels: {
          style: { colors: "#9CA3AF", fontSize: "11px" },
          formatter: (val: number) => {
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
            if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
            return String(Math.round(val));
          },
        },
      },
      {
        seriesName: "Pagos",
        opposite: true,
        labels: {
          style: { colors: "#22C55E", fontSize: "11px" },
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      },
    ],
    tooltip: {
      x: { format: "MMM yyyy" },
      theme: "light",
      style: { fontSize: "12px" },
      y: [
        {
          formatter: (val: number) => {
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M streams`;
            if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K streams`;
            return `${Math.round(val)} streams`;
          },
        },
        {
          formatter: (val: number) => `$${val.toFixed(2)}`,
        },
      ],
    },
    legend: { show: false },
  };

  const timeframeOptions = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
  ];

  if (loading) return <Loading />;

  return (
    <React.Fragment>
      <StripeConnectLoginModal
        isOpen={showStripeLoginModal}
        onClose={() => setShowStripeLoginModal(false)}
        onLoginSuccess={handleStripeLoginSuccess}
      />
      <StripePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        songTitle={song?.trackTitle}
        totalAmount={song?.totalNetIncome || 0}
        collaborators={song?.collaborators || []}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <AlertComponent message={alertMessage} type={alertType} />

      <div className="min-h-screen bg-[#F7F8FA] px-10 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Detalle de Canción
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Información de la pista y regalías
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer">
              Inicio
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer">
              Música
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-600">Detalle de Canción</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex gap-6">
          {/* Album Art */}
          <div className="w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
            {song?.spotifyData?.album?.images?.length > 0 ? (
              <img
                src={song.spotifyData.album.images[0].url}
                alt={`${song.trackTitle} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-12 h-12 text-gray-300" />
            )}
          </div>

          {/* Song Info */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold text-gray-900">
                  {song?.trackTitle || "—"}
                </h2>
                <p className="flex items-center gap-2 text-gray-500 text-sm">
                  <Users className="w-4 h-4" />
                  {song?.artistName || "—"}
                </p>
              </div>
              <span className="flex-shrink-0 bg-[#F97316] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                ISRC: {song?.isrc || "—"}
              </span>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Streams */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Total Streams
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {song?.totalStreams?.toLocaleString() || "0"}
                </p>
              </div>

              {/* Net Income */}
              <div className="bg-green-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Net Income
                  </span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  $
                  {song?.totalNetIncome?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </p>
              </div>

              {/* My Percentage */}
              <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    Mi porcentaje
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-bold text-purple-600">
                    ${getUserDisplayAmount()}
                  </p>
                  <span className="text-xs text-gray-400">
                    {getUserDisplayPercentage()}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Banner */}
        {(
          
          <div className="bg-[#F97316] rounded-xl px-7 py-5 flex items-center justify-between">
         
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-base">
                Próxima liquidación estimada
              </span>
            </div>
            <p className="text-orange-100 text-sm pl-7">10 Julio 2024</p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-orange-100 text-xs font-medium">
                Total a pagar
              </p>
              <p className="text-white text-2xl font-bold">
                ${totalToPay.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handlePayAllClick}
              className="flex items-center gap-2 bg-white text-[#F97316] font-bold text-sm px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              Pagar a todos
            </button>
          </div>
        </div>
        )}

        {/* Collaborators Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-gray-900" />
              <h3 className="text-base font-bold text-gray-900">
                Colaboradores
              </h3>
            </div>
            <AddCollaborator compact />
          </div>
          <Table
            collaborators={getCollaboratorsInfo()}
            songId={song?._id || song?.id}
            song={song}
          />
        </div>

        {/* Streaming vs Payments Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-semibold text-gray-900">
                  Rendimiento
                </h2>
                <p className="text-xs text-gray-400">
                  Streams y pagos en el tiempo
                </p>
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      selectedTimeframe === option.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setSelectedTimeframe(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-900 rounded-sm" />
                <span className="text-[11px] text-gray-500">Streams</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-sm" />
                <span className="text-[11px] text-gray-500">Pagos</span>
              </div>
            </div>

            <div className="h-[280px]">
              {metricLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-orange-500" />
                </div>
              ) : (
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="area"
                  height="100%"
                  width="100%"
                />
              )}
            </div>
          </div>
        </div>

        {/* Payment History + Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <PaymentHistory
              title="Historial de Pagos Realizados"
              maxHeight="400px"
              refreshTrigger={paymentHistoryRefresh}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Platforms reproductions={song?.reproductions} />
          </div>
        </div>

        {/* Specific Data */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <EspecificData song={song} />
        </div>

        {/* History of Splits */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <Historyofsplits />
        </div>

        {/* Extraordinary Costs */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <Extraordinarycosts />
        </div>
      </div>
    </React.Fragment>
  );
}
