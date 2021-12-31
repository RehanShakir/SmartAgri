import ReactApexChart from "react-apexcharts";
import React from "react";
import "../../assets/styles/main.css";

import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";

const LineChart = ({ enData, soilData, data }) => {
  //Environment
  let temperature = [];
  let humidity = [];
  let atmosphericPressure = [];

  //Soil Paremeters
  let soilMoisture = [];
  let eC = [];
  let pH = [];
  let nitrogen = [];
  let phosphorus = [];
  let potassium = [];

  let enTime = [];

  data.map((d) => {
    // enTime.push(d.createdAt.split("T")[1].split(".")[0].slice(0, 5));
    enTime.reverse().push(d.createdAt);
    return 0;
  });
  // console.log(enTime);

  enData.map((d) => {
    temperature.push(d.Temperautre);
    humidity.push(d.Humidity);
    atmosphericPressure.push(d.Atmospheric_Pressure);

    return 0;
  });

  soilData.map((d) => {
    soilMoisture.push(d.Soil_Moisture);
    eC.push(d.EC);
    pH.push(d.pH);
    nitrogen.push(d.Nitrogen);
    phosphorus.push(d.Phosphorus);
    potassium.push(d.Potassium);

    return 0;
  });
  const { Title } = Typography;

  const lineChart = {
    series: [
      {
        name: "Termperature",
        data: temperature.reverse(),
        offsetY: 0,
      },
      {
        name: "Humidity",
        data: humidity.reverse(),
        offsetY: 0,
      },
      {
        name: "Atmosphereic Pressure",
        data: atmosphericPressure.reverse(),
        offsetY: 0,
      },
    ],

    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },

      xaxis: {
        // type: "numeric",
        labels: {
          trim: false,
          // hideOverlappingLabels: false,
          showDuplicates: false,
          // tickAmount: 1,
          // range: 10,
          style: {
            fontSize: "10px",
            fontWeight: 600,
            cssClass: "apex-x-axis",
            colors: ["#2E93fA", "#66DA26", "#546E7A"],
          },
          itemMargin: {
            horizontal: 15,
            vertical: 10,
          },
        },

        categories: enTime,
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };
  const lineChart1 = {
    series: [
      {
        name: "Soil Moisture",
        data: soilMoisture.reverse(),
        offsetY: 0,
      },
      {
        name: "EC",
        data: eC.reverse(),
        offsetY: 0,
      },
      {
        name: "pH",
        data: pH.reverse(),
        offsetY: 0,
      },
      {
        name: "Nitrogen",
        data: nitrogen.reverse(),
        offsetY: 0,
      },
      {
        name: "Phosphorus",
        data: phosphorus.reverse(),
        offsetY: 0,
      },
      {
        name: "Potassium",
        data: potassium.reverse(),
        offsetY: 0,
      },
    ],

    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },

      xaxis: {
        labels: {
          style: {
            fontSize: "10px",
            fontWeight: 600,
          },
        },
        categories: enTime,
      },
      colors: [
        "#FD6544",
        "#FDA044  ",
        "#857463",
        "#6264A3",
        "#A45493",
        "#3FB863",
      ],

      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Environment</Title>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Termperature</li>
            <li>{<MinusOutlined />} Humidity</li>
            <li>{<MinusOutlined />} Atmospheric Pressure</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />
      <div className="linechart">
        <div>
          <Title level={5}>Soil Paremeters</Title>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />}Soil_Moisture</li>
            <li>{<MinusOutlined />}EC</li>
            <li>{<MinusOutlined />}pH</li>
            <li>{<MinusOutlined />}Nitrogen</li>
            <li>{<MinusOutlined />}Phosphorus</li>
            <li>{<MinusOutlined />}Potassium</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart1.options}
        series={lineChart1.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
};

export default LineChart;
