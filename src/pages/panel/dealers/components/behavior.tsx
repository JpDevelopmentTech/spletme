import ReactApexChart from "react-apexcharts";
import Title from "../../../../components/title/title";
import { ApexOptions } from "apexcharts";

export default function Behavior() {
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
          y: 1100000,
        },
        {
          x: "Ago",
          y: 1000000,
        },
        {
          x: "Sep",
          y: 900000,
        },
        {
          x: "Oct",
          y: 800000,
        },
        {
          x: "Nov",
          y: 700000,
        },
        {
          x: "Dic",
          y: 600000,
        },
      ],
    },
    {
      name: "Distribuidora 1",
      data: [
        {
          x: "Ene",
          y: 1200000,
        },
        {
          x: "Feb",
          y: 1400000,
        },
        {
          x: "Mar",
          y: 1100000,
        },
        {
          x: "Abr",
          y: 1600000,
        },
        {
          x: "May",
          y: 1500000,
        },
        {
          x: "Jun",
          y: 1400000,
        },
        {
          x: "Jul",
          y: 1300000,
        },
        {
          x: "Ago",
          y: 1200000,
        },
        {
          x: "Sep",
          y: 1100000,
        },
        {
          x: "Oct",
          y: 1000000,
        },
        {
          x: "Nov",
          y: 900000,
        },
        {
          x: "Dic",
          y: 800000,
        },
      ],
    },
    {
      name: "Distribuidora 3",
      data: [
        {
          x: "Ene",
          y: 1400000,
        },
        {
          x: "Feb",
          y: 1600000,
        },
        {
          x: "Mar",
          y: 1300000,
        },
        {
          x: "Abr",
          y: 1800000,
        },
        {
          x: "May",
          y: 1700000,
        },
        {
          x: "Jun",
          y: 1600000,
        },
        {
          x: "Jul",
          y: 1500000,
        },
        {
          x: "Ago",
          y: 1400000,
        },
        {
          x: "Sep",
          y: 1300000,
        },
        {
          x: "Oct",
          y: 1200000,
        },
        {
          x: "Nov",
          y: 1100000,
        },
        {
          x: "Dic",
          y: 1000000,
        },
      ],
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      height: 100,
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#8e8da4",
        },
        offsetX: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    //xaxis de meses del año
    xaxis: {
      categories: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
    },
    tooltip: {
      shared: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
  };

  return (
    <div
      id="behavior"
      className="col-span-12 row-span-2 p-6 rounded-2xl shadow-lg hover:scale-[1.01] duration-200 relative"
    >
      <div className="flex justify-between items-center">
        <Title
          title="Comportamiento"
          subtitle="Mide el comportamiento por distribuidor"
        />
      </div>
      <div>
        <ReactApexChart
          type="area"
          options={options}
          series={series}
          height={350}
        />
      </div>
    </div>
  );
}
