import ReactApexChart from "react-apexcharts";
import Title from "../../../../components/title/title";
import { ApexOptions } from "apexcharts";

const Pay = () => {
  const series = [
    {
      name: "Distribuidora 2",
      data: [
        {
          x: "Ene",
          y: 1000000,
        },
        {
          x: "Feb",
          y: 1200000,
        },
        {
          x: "Mar",
          y: 900000,
        },
        {
          x: "Abr",
          y: 1400000,
        },
        {
          x: "May",
          y: 1300000,
        },
        {
          x: "Jun",
          y: 1200000,
        },
        {
          x: "Jul",
          y: 1000000,
        },
        {
          x: "Ago",
          y: 1200000,
        },
        {
          x: "Sep",
          y: 900000,
        },
        {
          x: "Oct",
          y: 1400000,
        },
        {
          x: "Nov",
          y: 1300000,
        },
        {
          x: "Dic",
          y: 1200000,
        },

      ],
    },
  ];
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 15,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
  };
  return (
    <div className="p-12 rounded-2xl border w-full col-span-9">
      <div className="flex justify-between items-center">
        <Title title="Pagos" subtitle="Mide el comportamiento de tus pago" />
        <select name="" id="">
          <option value="">Filtrar por año</option>
        </select>
      </div>
      <ReactApexChart
        series={series}
        type="bar"
        options={options}
        height={350}
      />
    </div>
  );
};

export default Pay;
