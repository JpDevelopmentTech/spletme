import ReactApexChart from "react-apexcharts";
import Select from "../../../../components/atoms/select";
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
    fill: {
      opacity: 1
    },
  }

const Activity = () => {
  return (
    <div className="rounded-2xl shadow-lg col-span-6 p-6 flex flex-col ">
      <div className="flex justify-between items-center">
        <Title
          title="Actividad"
          subtitle="Escoge el año y analiza la actividad"
        ></Title>
        <div>
          <Select
            options={[
              {
                value: "2021",
                label: "2021",
              },
              {
                value: "2022",
                label: "2022",
              },
            ]}
          />
        </div>
      </div>
      <div className="mt-3">
        <ReactApexChart options={options} type="bar" 
        series={series} height={200}
        />
      </div>
    </div>
  );
};

export default Activity;
