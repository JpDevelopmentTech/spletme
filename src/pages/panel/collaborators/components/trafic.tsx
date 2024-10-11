import ReactApexChart from "react-apexcharts";
import Title from "../../../../components/title/title";
import { ApexOptions } from "apexcharts";

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
      columnWidth: "70%",
      borderRadius: 15,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Ene", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  fill: {
    opacity: 1,
  },
};

const Trafic = () => {
  return (
    <div className="rounded-2xl shadow-lg col-span-6 row-span-2 p-6 flex flex-col">
      <Title title="Trafico" subtitle="Aqui un texto para el trafico" />
      <div>
        <ReactApexChart options={options} series={series} type="area" height={200} />
      </div>
    </div>
  );
};

export default Trafic;
