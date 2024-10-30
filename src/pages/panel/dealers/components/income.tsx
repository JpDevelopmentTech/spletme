import ReactApexChart from "react-apexcharts";
import Title from "../../../../components/title/title";
import { ApexOptions } from "apexcharts";

export default function Income() {
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
      ],
    },
  ];
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 15
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Ene','Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)'
      }
    },
    fill: {
      opacity: 1
    },
  }
  return (
    <div id="income" className="col-span-6 p-6 rounded-2xl shadow-lg hover:scale-[1.01] duration-200">
      <div className="flex justify-between  flex-col">
        <Title title="Ingresos" subtitle="Mide el comportamiento por distribuidor" />
        <div>
          <ReactApexChart series={series} type="bar" options={options} height={350}/>
        </div>
      </div>
    </div>
  );
}
